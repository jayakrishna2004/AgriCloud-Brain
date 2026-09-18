package com.agricloud.brain.service;

import com.agricloud.brain.dto.CloudMonitoringResponse;
import com.agricloud.brain.model.CloudMetric;
import com.agricloud.brain.repository.MonitoringRepository;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatch.CloudWatchClient;
import software.amazon.awssdk.services.cloudwatch.model.Datapoint;
import software.amazon.awssdk.services.cloudwatch.model.Dimension;
import software.amazon.awssdk.services.cloudwatch.model.GetMetricStatisticsRequest;
import software.amazon.awssdk.services.cloudwatch.model.GetMetricStatisticsResponse;
import software.amazon.awssdk.services.cloudwatch.model.Statistic;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.ec2.model.DescribeInstancesRequest;
import software.amazon.awssdk.services.ec2.model.DescribeInstancesResponse;
import software.amazon.awssdk.services.ec2.model.Instance;
import software.amazon.awssdk.services.ec2.model.InstanceStateName;
import software.amazon.awssdk.services.ec2.model.Reservation;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class MonitoringService {

    private final MonitoringRepository monitoringRepository;

    private CloudWatchClient cloudWatchClient;

    private Ec2Client ec2Client;

    @Value("${aws.region:ap-south-1}")
    private String awsRegion;

    public MonitoringService(
            MonitoringRepository monitoringRepository
    ) {
        this.monitoringRepository = monitoringRepository;
    }

    // ==========================================
    // INITIALIZE AWS CLIENTS
    // ==========================================

    @PostConstruct
    public void initializeAwsClients() {

        Region region = Region.of(awsRegion);

        this.cloudWatchClient =
                CloudWatchClient.builder()
                        .region(region)
                        .build();

        this.ec2Client =
                Ec2Client.builder()
                        .region(region)
                        .build();
    }

    // ==========================================
    // EXISTING DATABASE METHODS
    // ==========================================

    public List<CloudMetric> getMetrics() {

        return monitoringRepository.findAll();
    }

    public CloudMetric saveMetric(
            CloudMetric metric
    ) {

        return monitoringRepository.save(metric);
    }

    // ==========================================
    // REAL AWS MONITORING
    // ==========================================

    public CloudMonitoringResponse getCurrentMetrics() {

        try {

            int runningInstances =
                    getRunningInstanceCount();

            double cpuUsage =
                    getAverageCpuUsage();

            // Get real memory usage from CloudWatch Agent
            double memoryUsage =
                    getAverageMemoryUsage();

            // Workload is represented by CPU utilization
            double workload =
                    cpuUsage;

            String status =
                    runningInstances > 0
                            ? "ONLINE"
                            : "NO_RUNNING_INSTANCES";

            return new CloudMonitoringResponse(
                    round(cpuUsage),
                    round(memoryUsage),
                    round(workload),
                    runningInstances,
                    status,
                    "AWS",
                    Instant.now().toString()
            );

        } catch (Exception error) {

            throw new RuntimeException(
                    "Unable to retrieve AWS monitoring data: "
                            + error.getMessage(),
                    error
            );
        }
    }

    // ==========================================
    // COUNT RUNNING EC2 INSTANCES
    // ==========================================

    private int getRunningInstanceCount() {

        DescribeInstancesRequest request =
                DescribeInstancesRequest.builder()
                        .filters(
                                software.amazon.awssdk.services.ec2.model.Filter
                                        .builder()
                                        .name("instance-state-name")
                                        .values("running")
                                        .build()
                        )
                        .build();

        DescribeInstancesResponse response =
                ec2Client.describeInstances(request);

        int count = 0;

        for (Reservation reservation :
                response.reservations()) {

            for (Instance instance :
                    reservation.instances()) {

                if (instance.state() != null
                        && instance.state().name()
                        == InstanceStateName.RUNNING) {

                    count++;
                }
            }
        }

        return count;
    }

    // ==========================================
    // GET AVERAGE CPU UTILIZATION
    // ==========================================

    private double getAverageCpuUsage() {

        DescribeInstancesRequest request =
                DescribeInstancesRequest.builder()
                        .filters(
                                software.amazon.awssdk.services.ec2.model.Filter
                                        .builder()
                                        .name("instance-state-name")
                                        .values("running")
                                        .build()
                        )
                        .build();

        DescribeInstancesResponse response =
                ec2Client.describeInstances(request);

        double totalCpu = 0.0;

        int instanceCount = 0;

        for (Reservation reservation :
                response.reservations()) {

            for (Instance instance :
                    reservation.instances()) {

                if (instance.state() == null
                        || instance.state().name()
                        != InstanceStateName.RUNNING) {

                    continue;
                }

                double cpu =
                        getCpuForInstance(
                                instance.instanceId()
                        );

                totalCpu += cpu;

                instanceCount++;
            }
        }

        if (instanceCount == 0) {

            return 0.0;
        }

        return totalCpu / instanceCount;
    }

    // ==========================================
    // CLOUDWATCH CPU METRIC
    // ==========================================

    private double getCpuForInstance(
            String instanceId
    ) {

        Instant end =
                Instant.now();

        Instant start =
                end.minus(
                        10,
                        ChronoUnit.MINUTES
                );

        Dimension instanceDimension =
                Dimension.builder()
                        .name("InstanceId")
                        .value(instanceId)
                        .build();

        GetMetricStatisticsRequest request =
                GetMetricStatisticsRequest.builder()
                        .namespace("AWS/EC2")
                        .metricName("CPUUtilization")
                        .dimensions(instanceDimension)
                        .startTime(start)
                        .endTime(end)
                        .period(300)
                        .statistics(Statistic.AVERAGE)
                        .build();

        GetMetricStatisticsResponse response =
                cloudWatchClient
                        .getMetricStatistics(request);

        List<Datapoint> datapoints =
                response.datapoints();

        if (datapoints == null
                || datapoints.isEmpty()) {

            return 0.0;
        }

        double total = 0.0;

        int validDatapoints = 0;

        for (Datapoint datapoint :
                datapoints) {

            if (datapoint.average() != null) {

                total += datapoint.average();

                validDatapoints++;
            }
        }

        if (validDatapoints == 0) {

            return 0.0;
        }

        return total / validDatapoints;
    }

    // ==========================================
    // GET AVERAGE MEMORY UTILIZATION
    // ==========================================

    private double getAverageMemoryUsage() {

        DescribeInstancesRequest request =
                DescribeInstancesRequest.builder()
                        .filters(
                                software.amazon.awssdk.services.ec2.model.Filter
                                        .builder()
                                        .name("instance-state-name")
                                        .values("running")
                                        .build()
                        )
                        .build();

        DescribeInstancesResponse response =
                ec2Client.describeInstances(request);

        double totalMemory = 0.0;

        int instanceCount = 0;

        for (Reservation reservation :
                response.reservations()) {

            for (Instance instance :
                    reservation.instances()) {

                if (instance.state() == null
                        || instance.state().name()
                        != InstanceStateName.RUNNING) {

                    continue;
                }

                String host =
                        instance.privateDnsName();

                if (host == null || host.isBlank()) {

                    continue;
                }

                double memory =
                        getMemoryForInstance(host);

                totalMemory += memory;

                instanceCount++;
            }
        }

        if (instanceCount == 0) {

            return 0.0;
        }

        return totalMemory / instanceCount;
    }

    // ==========================================
    // CLOUDWATCH MEMORY METRIC
    // ==========================================

    private double getMemoryForInstance(
            String host
    ) {

        Instant end =
                Instant.now();

        Instant start =
                end.minus(
                        10,
                        ChronoUnit.MINUTES
                );

        Dimension hostDimension =
                Dimension.builder()
                        .name("host")
                        .value(host)
                        .build();

        GetMetricStatisticsRequest request =
                GetMetricStatisticsRequest.builder()
                        .namespace("AgriCloud/EC2")
                        .metricName("mem_used_percent")
                        .dimensions(hostDimension)
                        .startTime(start)
                        .endTime(end)
                        .period(300)
                        .statistics(Statistic.AVERAGE)
                        .build();

        GetMetricStatisticsResponse response =
                cloudWatchClient
                        .getMetricStatistics(request);

        List<Datapoint> datapoints =
                response.datapoints();

        if (datapoints == null
                || datapoints.isEmpty()) {

            return 0.0;
        }

        double total = 0.0;

        int validDatapoints = 0;

        for (Datapoint datapoint :
                datapoints) {

            if (datapoint.average() != null) {

                total += datapoint.average();

                validDatapoints++;
            }
        }

        if (validDatapoints == 0) {

            return 0.0;
        }

        return total / validDatapoints;
    }

    // ==========================================
    // ROUND VALUE
    // ==========================================

    private double round(double value) {

        return Math.round(value * 100.0) / 100.0;
    }
}