import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  Activity,
  Brain,
  RefreshCw,
  LogOut,
  ShieldCheck,
  TrendingUp,
  Users,
  Server,
  Database,
  Cloud,
  Cpu,
  Menu,
  X,
  AlertTriangle,
  CheckCircle,
  Gauge,
  Bell,
  BarChart3,
  Clock,
  MemoryStick
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import { useAuth } from "../context/AuthContext";

import {
  getAllPredictions,
  checkBackendHealth,
  checkAIHealth,
  getCloudMonitoring
} from "../services/api";


function AdminDashboard() {

  const navigate = useNavigate();

  const {
    user,
    logout
  } = useAuth();


  // ==========================================
  // SIDEBAR
  // ==========================================

  const [
    sidebarOpen,
    setSidebarOpen
  ] = useState(true);


  // ==========================================
  // PREDICTIONS
  // ==========================================

  const [
    predictions,
    setPredictions
  ] = useState([]);


  // ==========================================
  // AWS MONITORING
  // ==========================================

  const [
    cloudMetrics,
    setCloudMetrics
  ] = useState(null);


  const [
    monitoringHistory,
    setMonitoringHistory
  ] = useState([]);


  // ==========================================
  // LOADING
  // ==========================================

  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    cloudLoading,
    setCloudLoading
  ] = useState(true);


  const [
    refreshing,
    setRefreshing
  ] = useState(false);


  // ==========================================
  // ERRORS
  // ==========================================

  const [
    error,
    setError
  ] = useState("");


  const [
    cloudError,
    setCloudError
  ] = useState("");


  // ==========================================
  // SYSTEM STATUS
  // ==========================================

  const [
    backendStatus,
    setBackendStatus
  ] = useState("Checking...");


  const [
    aiStatus,
    setAIStatus
  ] = useState("Checking...");


  const [
    backendHealthy,
    setBackendHealthy
  ] = useState(false);


  const [
    aiHealthy,
    setAIHealthy
  ] = useState(false);


  // ==========================================
  // ALERTS
  // ==========================================

  const [
    alerts,
    setAlerts
  ] = useState([]);


  const [
    lastRefresh,
    setLastRefresh
  ] = useState(null);


  // ==========================================
  // SCROLL NAVIGATION
  // ==========================================

  const scrollToSection = (id) => {

    const element =
      document.getElementById(id);

    if (element) {

      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

    if (
      window.innerWidth < 900
    ) {

      setSidebarOpen(false);

    }

  };


  // ==========================================
  // LOAD PREDICTIONS
  // ==========================================

  const loadPredictions = async () => {

    try {

      setError("");

      const data =
        await getAllPredictions();

      let list = [];

      if (
        Array.isArray(data)
      ) {

        list = data;

      } else if (
        Array.isArray(data?.content)
      ) {

        list = data.content;

      } else if (
        Array.isArray(data?.data)
      ) {

        list = data.data;

      }

      setPredictions(list);

    } catch (err) {

      setError(
        err.message ||
        "Unable to load prediction data"
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD AWS MONITORING
  // ==========================================

  const loadCloudMonitoring =
    async () => {

      try {

        setCloudError("");

        const data =
          await getCloudMonitoring();

        setCloudMetrics(data);


        const sample = {

          time: new Date(),

          cpu:
            Number(
              data?.cpuUsage ?? 0
            ),

          memory:
            Number(
              data?.memoryUsage ?? 0
            ),

          workload:
            Number(
              data?.workload ?? 0
            ),

          instances:
            Number(
              data?.instances ?? 0
            )

        };


        setMonitoringHistory(
          previous => [

            ...previous,

            sample

          ].slice(-60)
        );


        const newAlerts = [];


        if (
          sample.cpu >= 80
        ) {

          newAlerts.push({
            type: "CPU",
            value: sample.cpu,
            message:
              `CPU usage is high at ${sample.cpu.toFixed(2)}%`,
            time: new Date()
          });

        }


        if (
          sample.memory >= 80
        ) {

          newAlerts.push({
            type: "Memory",
            value: sample.memory,
            message:
              `Memory usage is high at ${sample.memory.toFixed(2)}%`,
            time: new Date()
          });

        }


        if (
          sample.workload >= 80
        ) {

          newAlerts.push({
            type: "Workload",
            value: sample.workload,
            message:
              `Workload is high at ${sample.workload.toFixed(2)}%`,
            time: new Date()
          });

        }


        if (
          newAlerts.length > 0
        ) {

          setAlerts(
            previous => [

              ...previous,

              ...newAlerts

            ].slice(-20)
          );

        }


        setLastRefresh(
          new Date()
        );

      } catch (err) {

        console.error(
          "AWS monitoring error:",
          err
        );

        setCloudError(
          err.message ||
          "Unable to load AWS monitoring"
        );

      } finally {

        setCloudLoading(false);

      }

    };


  // ==========================================
  // BACKEND HEALTH
  // ==========================================

  const checkBackend =
    async () => {

      try {

        await checkBackendHealth();

        setBackendHealthy(true);

        setBackendStatus(
          "Online"
        );

      } catch {

        setBackendHealthy(false);

        setBackendStatus(
          "Offline"
        );

      }

    };


  // ==========================================
  // AI HEALTH
  // ==========================================

  const checkAI =
    async () => {

      try {

        await checkAIHealth();

        setAIHealthy(true);

        setAIStatus(
          "Online"
        );

      } catch {

        setAIHealthy(false);

        setAIStatus(
          "Offline"
        );

      }

    };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadPredictions();

    loadCloudMonitoring();

    checkBackend();

    checkAI();

  }, []);


  // ==========================================
  // AUTO REFRESH EVERY 15 SEC
  // ==========================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        loadPredictions();

        loadCloudMonitoring();

        checkBackend();

        checkAI();

      }, 15000);


    return () => {

      clearInterval(interval);

    };

  }, []);


  // ==========================================
  // MANUAL REFRESH
  // ==========================================

  const handleRefresh =
    async () => {

      setRefreshing(true);

      await Promise.all([

        loadPredictions(),

        loadCloudMonitoring(),

        checkBackend(),

        checkAI()

      ]);

      setRefreshing(false);

    };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    logout();

    navigate(
      "/login",
      {
        replace: true
      }
    );

  };


  // ==========================================
  // NORMALIZE PREDICTIONS
  // ==========================================

  const normalizedPredictions =
    useMemo(() => {

      return predictions.map(
        (item, index) => {

          return {

            id:
              item.id ??
              index + 1,

            predictedLoad:
              Number(
                item.predictedLoad ??
                item.predicted_load ??
                0
              ),

            actualLoad:
              Number(
                item.actualLoad ??
                item.actual_load ??
                0
              ),

            confidence:
              Number(
                item.confidence ??
                0
              ),

            instances:
              Number(
                item.recommendedInstances ??
                item.recommended_instances ??
                0
              ),

            time:
              item.predictionTime ??
              item.prediction_time ??
              item.createdAt ??
              item.created_at ??
              ""

          };

        }
      );

    }, [predictions]);


  // ==========================================
  // STATISTICS
  // ==========================================

  const statistics =
    useMemo(() => {

      if (
        normalizedPredictions.length === 0
      ) {

        return {

          total: 0,

          averageLoad: "0.00",

          averageConfidence: "0.0",

          instances: 0

        };

      }


      const total =
        normalizedPredictions.length;


      const averageLoad =
        normalizedPredictions.reduce(
          (sum, item) =>
            sum +
            item.predictedLoad,
          0
        ) / total;


      const averageConfidence =
        normalizedPredictions.reduce(
          (sum, item) =>
            sum +
            item.confidence,
          0
        ) / total;


      const latest =
        normalizedPredictions[
          normalizedPredictions.length - 1
        ];


      return {

        total,

        averageLoad:
          averageLoad.toFixed(2),

        averageConfidence:
          averageConfidence.toFixed(1),

        instances:
          latest?.instances || 0

      };

    }, [normalizedPredictions]);


  // ==========================================
  // PREDICTION CHART
  // ==========================================

  const predictionChartData =
    normalizedPredictions
      .slice(-10)
      .map(
        (item, index) => {

          let timeLabel =
            `P${index + 1}`;


          if (item.time) {

            const date =
              new Date(item.time);


            if (
              !isNaN(
                date.getTime()
              )
            ) {

              timeLabel =
                date.toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit"
                  }
                );

            }

          }


          return {

            name:
              timeLabel,

            predicted:
              item.predictedLoad,

            actual:
              item.actualLoad,

            instances:
              item.instances

          };

        }
      );


  // ==========================================
  // AWS CHART
  // ==========================================

  const monitoringChartData =
    monitoringHistory.map(
      (item, index) => ({

        name:
          item.time instanceof Date
            ? item.time.toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                }
              )
            : `S${index + 1}`,

        CPU:
          Number(item.cpu || 0),

        Memory:
          Number(item.memory || 0),

        Workload:
          Number(item.workload || 0)

      })
    );


  // ==========================================
  // CURRENT AWS VALUES
  // ==========================================

  const cpu =
    Number(
      cloudMetrics?.cpuUsage ?? 0
    );

  const memory =
    Number(
      cloudMetrics?.memoryUsage ?? 0
    );

  const workload =
    Number(
      cloudMetrics?.workload ?? 0
    );

  const instances =
    Number(
      cloudMetrics?.instances ?? 0
    );


  // ==========================================
  // RESOURCE STATUS
  // ==========================================

  const getResourceStatus =
    (value) => {

      if (value >= 80) {

        return {
          text: "Critical",
          color: "#dc2626"
        };

      }

      if (value >= 60) {

        return {
          text: "Warning",
          color: "#d97706"
        };

      }

      return {

        text: "Healthy",
        color: "#2e7d32"

      };

    };


  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8f4",
        fontFamily:
          "Arial, sans-serif"
      }}
    >

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside
        style={{
          position: "fixed",
          left: sidebarOpen ? 0 : "-270px",
          top: 0,
          bottom: 0,
          width: "250px",
          background: "#ffffff",
          borderRight:
            "1px solid #e5e7eb",
          zIndex: 1000,
          transition:
            "left 0.25s ease",
          boxShadow:
            "3px 0 15px rgba(0,0,0,0.05)"
        }}
      >

        <div
          style={{
            padding: "22px",
            borderBottom:
              "1px solid #e5e7eb"
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >

            <div
              style={{
                width: "43px",
                height: "43px",
                borderRadius: "11px",
                background:
                  "#e7f5e9",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center"
              }}
            >

              <ShieldCheck
                size={25}
                color="#2e7d32"
              />

            </div>

            <div>

              <strong
                style={{
                  color: "#1f2937",
                  fontSize: "17px"
                }}
              >
                AgriCloud-Brain
              </strong>

              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "11px"
                }}
              >
                Administrator
              </div>

            </div>

          </div>

        </div>


        <nav
          style={{
            padding: "18px 12px"
          }}
        >

          <SidebarItem
            icon={<BarChart3 size={19} />}
            text="Dashboard"
            onClick={() =>
              scrollToSection(
                "dashboard"
              )
            }
            active
          />

          <SidebarItem
            icon={<Cloud size={19} />}
            text="AWS Monitoring"
            onClick={() =>
              scrollToSection(
                "aws-monitoring"
              )
            }
          />

          <SidebarItem
            icon={<Gauge size={19} />}
            text="Resource Health"
            onClick={() =>
              scrollToSection(
                "resource-health"
              )
            }
          />

          <SidebarItem
            icon={<Bell size={19} />}
            text="Alerts"
            onClick={() =>
              scrollToSection(
                "alerts"
              )
            }
            badge={
              alerts.length > 0
                ? alerts.length
                : null
            }
          />

          <SidebarItem
            icon={<ShieldCheck size={19} />}
            text="System Status"
            onClick={() =>
              scrollToSection(
                "system-status"
              )
            }
          />

          <SidebarItem
            icon={<Brain size={19} />}
            text="AI Predictions"
            onClick={() =>
              scrollToSection(
                "predictions"
              )
            }
          />

          <SidebarItem
            icon={<Database size={19} />}
            text="Recent Records"
            onClick={() =>
              scrollToSection(
                "recent-records"
              )
            }
          />

        </nav>


        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px",
            borderTop:
              "1px solid #e5e7eb"
          }}
        >

          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: "8px",
              border:
                "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              gap: "8px"
            }}
          >

            <LogOut size={17} />

            Logout

          </button>

        </div>

      </aside>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div
        style={{
          marginLeft:
            sidebarOpen
              ? "250px"
              : "0",
          transition:
            "margin-left 0.25s ease"
        }}
      >

        {/* HEADER */}

        <header
          style={{
            background: "#ffffff",
            borderBottom:
              "1px solid #e5e7eb",
            padding:
              "15px 25px",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            position: "sticky",
            top: 0,
            zIndex: 900
          }}
        >

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            style={{
              background: "#ffffff",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer"
            }}
          >

            {sidebarOpen
              ? <X size={20} />
              : <Menu size={20} />
            }

          </button>


          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px"
            }}
          >

            <div
              style={{
                textAlign: "right"
              }}
            >

              <strong
                style={{
                  color: "#111827"
                }}
              >
                {user?.name ||
                  "System Administrator"}
              </strong>

              <div
                style={{
                  color: "#6b7280",
                  fontSize: "12px"
                }}
              >
                {user?.email || ""}
              </div>

            </div>


            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                background: "#ffffff",
                color: "#111827",
                border:
                  "1px solid #d1d5db",
                borderRadius: "8px",
                padding:
                  "9px 13px",
                cursor: "pointer"
              }}
            >

              <LogOut size={16} />

              Logout

            </button>

          </div>

        </header>


        <main
          style={{
            maxWidth: "1250px",
            margin: "0 auto",
            padding:
              "30px 25px"
          }}
        >

          {/* DASHBOARD */}

          <section id="dashboard">

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "25px"
              }}
            >

              <div>

                <h1
                  style={{
                    margin:
                      "0 0 7px",
                    color: "#1f2937",
                    fontSize: "32px"
                  }}
                >
                  Cloud & AI Monitoring
                </h1>

                <p
                  style={{
                    margin: 0,
                    color: "#6b7280"
                  }}
                >
                  Real-time AWS infrastructure
                  monitoring and AI workload
                  intelligence.
                </p>

              </div>


              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  background:
                    refreshing
                      ? "#9ca3af"
                      : "#2e7d32",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding:
                    "11px 17px",
                  cursor:
                    refreshing
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: "600"
                }}
              >

                <RefreshCw
                  size={17}
                  style={{
                    animation:
                      refreshing
                        ? "spin 1s linear infinite"
                        : "none"
                  }}
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}

              </button>

            </div>


            {error && (

              <ErrorBox
                message={error}
              />

            )}


            {/* STAT CARDS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(210px,1fr))",
                gap: "18px",
                marginBottom: "28px"
              }}
            >

              <StatCard
                icon={<Users size={25} />}
                title="Prediction Records"
                value={statistics.total}
                description="Total AI predictions"
              />

              <StatCard
                icon={<Activity size={25} />}
                title="Average Workload"
                value={`${statistics.averageLoad}%`}
                description="Average predicted load"
              />

              <StatCard
                icon={<Brain size={25} />}
                title="AI Confidence"
                value={`${statistics.averageConfidence}%`}
                description="Average model confidence"
              />

              <StatCard
                icon={<Server size={25} />}
                title="Recommended Instances"
                value={statistics.instances}
                description="Latest AI recommendation"
              />

            </div>

          </section>


          {/* AWS MONITORING */}

          <section
            id="aws-monitoring"
            style={sectionStyle}
          >

            <SectionTitle
              icon={<Cloud size={27} />}
              title="AWS Cloud Monitoring"
              subtitle="Live EC2 and CloudWatch metrics"
              right={
                <StatusBadge
                  status={
                    cloudError
                      ? "OFFLINE"
                      : "ONLINE"
                  }
                  healthy={!cloudError}
                />
              }
            />


            {cloudError && (

              <ErrorBox
                message={cloudError}
              />

            )}


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(190px,1fr))",
                gap: "15px",
                marginTop: "20px"
              }}
            >

              <CloudCard
                icon={<Cpu size={23} />}
                title="CPU Usage"
                value={`${cpu.toFixed(2)}%`}
                description="EC2 CPU utilization"
                status={
                  getResourceStatus(cpu)
                }
              />

              <CloudCard
                icon={<MemoryStick size={23} />}
                title="Memory Usage"
                value={`${memory.toFixed(2)}%`}
                description="EC2 memory utilization"
                status={
                  getResourceStatus(memory)
                }
              />

              <CloudCard
                icon={<Activity size={23} />}
                title="Current Workload"
                value={`${workload.toFixed(2)}%`}
                description="Cloud workload"
                status={
                  getResourceStatus(workload)
                }
              />

              <CloudCard
                icon={<Server size={23} />}
                title="Running Instances"
                value={instances}
                description="Active EC2 instances"
                status={{
                  text: "Online",
                  color: "#2e7d32"
                }}
              />

              <CloudCard
                icon={<ShieldCheck size={23} />}
                title="Provider"
                value={
                  cloudMetrics?.provider ||
                  "AWS"
                }
                description="Cloud provider"
                status={{
                  text:
                    cloudMetrics?.status ||
                    "ONLINE",
                  color: "#2e7d32"
                }}
              />

            </div>


            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent:
                  "space-between",
                color: "#9ca3af",
                fontSize: "12px"
              }}
            >

              <span>

                <Clock
                  size={14}
                  style={{
                    verticalAlign:
                      "middle"
                  }}
                />

                {" "}
                AWS timestamp:{" "}

                {cloudMetrics?.timestamp
                  ? formatTime(
                      cloudMetrics.timestamp
                    )
                  : "-"}

              </span>


              <span>

                Last dashboard refresh:{" "}

                {lastRefresh
                  ? formatTime(
                      lastRefresh
                    )
                  : "-"}

              </span>

            </div>

          </section>


          {/* RESOURCE HEALTH */}

          <section
            id="resource-health"
            style={sectionStyle}
          >

            <SectionTitle
              icon={<Gauge size={27} />}
              title="Resource Health"
              subtitle="Current AWS resource utilization"
            />


            <ResourceBar
              label="CPU"
              value={cpu}
            />

            <ResourceBar
              label="Memory"
              value={memory}
            />

            <ResourceBar
              label="Workload"
              value={workload}
            />

          </section>


          {/* AWS HISTORY */}

          <section style={sectionStyle}>

            <SectionTitle
              icon={
                <TrendingUp size={27} />
              }
              title="AWS Monitoring History"
              subtitle="Last 60 live monitoring samples"
            />


            {monitoringChartData.length === 0 ? (

              <EmptyBox
                text="Waiting for AWS monitoring data..."
              />

            ) : (

              <ResponsiveContainer
                width="100%"
                height={330}
              >

                <LineChart
                  data={
                    monitoringChartData
                  }
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                  />

                  <YAxis
                    domain={[0,100]}
                  />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="CPU"
                    stroke="#2e7d32"
                    strokeWidth={3}
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="Memory"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="Workload"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>

            )}

          </section>


          {/* ALERTS */}

          <section
            id="alerts"
            style={sectionStyle}
          >

            <SectionTitle
              icon={
                <AlertTriangle
                  size={27}
                />
              }
              title="Alert Center"
              subtitle="Automatic resource utilization alerts"
            />


            {alerts.length === 0 ? (

              <div
                style={{
                  marginTop: "18px",
                  background: "#e7f5e9",
                  border:
                    "1px solid #bbf7d0",
                  color: "#166534",
                  borderRadius: "10px",
                  padding: "17px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >

                <CheckCircle
                  size={21}
                />

                <div>

                  <strong>
                    No active alerts
                  </strong>

                  <div
                    style={{
                      fontSize: "12px",
                      marginTop: "3px"
                    }}
                  >
                    AWS resources are
                    operating within
                    normal limits.
                  </div>

                </div>

              </div>

            ) : (

              <div
                style={{
                  display: "grid",
                  gap: "10px",
                  marginTop: "18px"
                }}
              >

                {alerts
                  .slice()
                  .reverse()
                  .slice(0,10)
                  .map(
                    (alert,index) => (

                      <div
                        key={index}
                        style={{
                          background:
                            "#fff7ed",
                          border:
                            "1px solid #fed7aa",
                          borderRadius:
                            "10px",
                          padding:
                            "14px",
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center"
                        }}
                      >

                        <div
                          style={{
                            display:
                              "flex",
                            gap: "10px",
                            alignItems:
                              "center"
                          }}
                        >

                          <AlertTriangle
                            size={20}
                            color="#d97706"
                          />

                          <div>

                            <strong
                              style={{
                                color:
                                  "#92400e"
                              }}
                            >
                              {alert.type}
                              {" "}Alert
                            </strong>

                            <div
                              style={{
                                fontSize:
                                  "12px",
                                color:
                                  "#92400e",
                                marginTop:
                                  "3px"
                              }}
                            >
                              {alert.message}
                            </div>

                          </div>

                        </div>


                        <span
                          style={{
                            fontSize:
                              "11px",
                            color:
                              "#9ca3af"
                          }}
                        >
                          {formatTime(
                            alert.time
                          )}
                        </span>

                      </div>

                    )
                  )}

              </div>

            )}

          </section>


          {/* SYSTEM STATUS */}

          <section
            id="system-status"
            style={sectionStyle}
          >

            <SectionTitle
              icon={
                <ShieldCheck
                  size={27}
                />
              }
              title="System Status"
              subtitle="Automatic service health monitoring"
            />


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(200px,1fr))",
                gap: "14px",
                marginTop: "18px"
              }}
            >

              <StatusItem
                name="Spring Boot Backend"
                status={backendStatus}
                healthy={backendHealthy}
              />

              <StatusItem
                name="AI Engine"
                status={aiStatus}
                healthy={aiHealthy}
              />

              <StatusItem
                name="Random Forest Model"
                status={
                  aiStatus ===
                  "Checking..."
                    ? "Checking..."
                    : aiHealthy
                      ? "Active"
                      : "Offline"
                }
                healthy={aiHealthy}
              />

              <StatusItem
                name="Prediction Service"
                status={
                  backendHealthy &&
                  aiHealthy
                    ? "Operational"
                    : "Offline"
                }
                healthy={
                  backendHealthy &&
                  aiHealthy
                }
              />

              <StatusItem
                name="AWS Cloud Monitoring"
                status={
                  cloudError
                    ? "Offline"
                    : "Online"
                }
                healthy={!cloudError}
              />

            </div>

          </section>


          {/* AI CHARTS */}

          <section
            id="predictions"
            style={sectionStyle}
          >

            <SectionTitle
              icon={<Brain size={27} />}
              title="AI Prediction Analytics"
              subtitle="Historical workload prediction performance"
            />


            {predictionChartData.length === 0 ? (

              <EmptyBox
                text="No AI prediction data available"
              />

            ) : (

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(400px,1fr))",
                  gap: "20px"
                }}
              >

                <div>

                  <h3
                    style={{
                      color: "#374151",
                      fontSize: "15px"
                    }}
                  >
                    Predicted vs Actual Load
                  </h3>

                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >

                    <LineChart
                      data={
                        predictionChartData
                      }
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="name"
                      />

                      <YAxis
                        domain={[0,100]}
                      />

                      <Tooltip />

                      <Legend />

                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#2e7d32"
                        strokeWidth={3}
                        name="Predicted"
                      />

                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#2563eb"
                        strokeWidth={3}
                        name="Actual"
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>


                <div>

                  <h3
                    style={{
                      color: "#374151",
                      fontSize: "15px"
                    }}
                  >
                    Recommended Instances
                  </h3>

                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >

                    <BarChart
                      data={
                        predictionChartData
                      }
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="name"
                      />

                      <YAxis />

                      <Tooltip />

                      <Bar
                        dataKey="instances"
                        fill="#2e7d32"
                        name="Instances"
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>

            )}

          </section>


          {/* RECENT RECORDS */}

          <section
            id="recent-records"
            style={sectionStyle}
          >

            <SectionTitle
              icon={<Database size={27} />}
              title="Recent AI Predictions"
              subtitle="Latest workload prediction records"
            />


            {loading ? (

              <EmptyBox
                text="Loading prediction data..."
              />

            ) : normalizedPredictions.length === 0 ? (

              <EmptyBox
                text="No prediction records available yet."
              />

            ) : (

              <div
                style={{
                  overflowX: "auto",
                  marginTop: "18px"
                }}
              >

                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse"
                  }}
                >

                  <thead>

                    <tr
                      style={{
                        background:
                          "#f3f7f3"
                      }}
                    >

                      <th style={tableHeader}>
                        ID
                      </th>

                      <th style={tableHeader}>
                        Predicted Load
                      </th>

                      <th style={tableHeader}>
                        Actual Load
                      </th>

                      <th style={tableHeader}>
                        Confidence
                      </th>

                      <th style={tableHeader}>
                        Instances
                      </th>

                      <th style={tableHeader}>
                        Status
                      </th>

                      <th style={tableHeader}>
                        Time
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {normalizedPredictions
                      .slice()
                      .reverse()
                      .slice(0,10)
                      .map(
                        item => {

                          const status =
                            item.predictedLoad >= 80
                              ? "High"
                              : item.predictedLoad >= 60
                                ? "Medium"
                                : "Low";


                          return (

                            <tr
                              key={item.id}
                            >

                              <td style={tableCell}>
                                #{item.id}
                              </td>

                              <td style={tableCell}>
                                <strong>
                                  {item.predictedLoad.toFixed(2)}%
                                </strong>
                              </td>

                              <td style={tableCell}>
                                {item.actualLoad.toFixed(2)}%
                              </td>

                              <td style={tableCell}>
                                {item.confidence.toFixed(1)}%
                              </td>

                              <td style={tableCell}>

                                <span
                                  style={{
                                    background:
                                      "#e7f5e9",
                                    color:
                                      "#2e7d32",
                                    padding:
                                      "5px 10px",
                                    borderRadius:
                                      "20px",
                                    fontWeight:
                                      "600"
                                  }}
                                >
                                  {item.instances}
                                </span>

                              </td>

                              <td style={tableCell}>

                                <span
                                  style={{
                                    background:
                                      status === "High"
                                        ? "#fee2e2"
                                        : status === "Medium"
                                          ? "#fff7ed"
                                          : "#e7f5e9",
                                    color:
                                      status === "High"
                                        ? "#dc2626"
                                        : status === "Medium"
                                          ? "#d97706"
                                          : "#2e7d32",
                                    padding:
                                      "5px 10px",
                                    borderRadius:
                                      "20px",
                                    fontWeight:
                                      "600"
                                  }}
                                >
                                  {status}
                                </span>

                              </td>

                              <td style={tableCell}>
                                {formatTime(
                                  item.time
                                )}
                              </td>

                            </tr>

                          );

                        }
                      )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </main>

      </div>


      <style>
        {`

          * {
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          @keyframes spin {

            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }

          }

          button:hover {
            opacity: 0.92;
          }

          @media (max-width: 900px) {

            main {
              padding-left: 15px !important;
              padding-right: 15px !important;
            }

          }

        `}
      </style>

    </div>

  );

}


// ==========================================
// SIDEBAR ITEM
// ==========================================

function SidebarItem({
  icon,
  text,
  onClick,
  active,
  badge
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        border: "none",
        background:
          active
            ? "#e7f5e9"
            : "transparent",
        color:
          active
            ? "#2e7d32"
            : "#4b5563",
        padding:
          "11px 12px",
        borderRadius:
          "8px",
        display: "flex",
        alignItems: "center",
        gap: "11px",
        cursor: "pointer",
        marginBottom: "5px",
        textAlign: "left",
        fontWeight:
          active ? "600" : "500"
      }}
    >

      {icon}

      <span
        style={{
          flex: 1
        }}
      >
        {text}
      </span>

      {badge && (

        <span
          style={{
            background:
              "#dc2626",
            color:
              "#ffffff",
            borderRadius:
              "20px",
            minWidth:
              "20px",
            height:
              "20px",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            fontSize:
              "10px"
          }}
        >
          {badge}
        </span>

      )}

    </button>

  );

}


// ==========================================
// SECTION STYLE
// ==========================================

const sectionStyle = {

  background: "#ffffff",

  borderRadius: "14px",

  padding: "23px",

  marginBottom: "25px",

  boxShadow:
    "0 4px 15px rgba(0,0,0,0.05)"

};


// ==========================================
// SECTION TITLE
// ==========================================

function SectionTitle({
  icon,
  title,
  subtitle,
  right
}) {

  return (

    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center"
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >

        <span
          style={{
            color: "#2e7d32"
          }}
        >
          {icon}
        </span>

        <div>

          <h2
            style={{
              margin: 0,
              color: "#1f2937",
              fontSize: "23px"
            }}
          >
            {title}
          </h2>

          <div
            style={{
              color: "#9ca3af",
              fontSize: "12px",
              marginTop: "3px"
            }}
          >
            {subtitle}
          </div>

        </div>

      </div>

      {right}

    </div>

  );

}


// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  icon,
  title,
  value,
  description
}) {

  return (

    <div
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "20px",
        boxShadow:
          "0 4px 15px rgba(0,0,0,0.05)"
      }}
    >

      <div
        style={{
          color: "#2e7d32",
          marginBottom: "11px"
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#6b7280",
          fontSize: "14px"
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginTop: "5px",
          color: "#1f2937"
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#9ca3af",
          fontSize: "12px",
          marginTop: "4px"
        }}
      >
        {description}
      </div>

    </div>

  );

}


// ==========================================
// CLOUD CARD
// ==========================================

function CloudCard({
  icon,
  title,
  value,
  description,
  status
}) {

  return (

    <div
      style={{
        border:
          "1px solid #e5e7eb",
        borderRadius: "11px",
        padding: "16px",
        background: "#f9fbf9"
      }}
    >

      <div
        style={{
          color: "#2e7d32",
          marginBottom: "9px"
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#6b7280",
          fontSize: "13px"
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "26px",
          fontWeight: "bold",
          color: "#1f2937",
          margin:
            "4px 0"
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#9ca3af",
          fontSize: "11px"
        }}
      >
        {description}
      </div>

      <div
        style={{
          marginTop: "8px",
          color: status.color,
          fontSize: "12px",
          fontWeight: "600"
        }}
      >
        ● {status.text}
      </div>

    </div>

  );

}


// ==========================================
// RESOURCE BAR
// ==========================================

function ResourceBar({
  label,
  value
}) {

  const status =
    value >= 80
      ? "#dc2626"
      : value >= 60
        ? "#d97706"
        : "#2e7d32";


  return (

    <div
      style={{
        marginTop: "19px"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: "7px",
          fontWeight: "600",
          color: "#374151"
        }}
      >

        <span>
          {label}
        </span>

        <span
          style={{
            color: status
          }}
        >
          {value.toFixed(2)}%
        </span>

      </div>

      <div
        style={{
          height: "9px",
          background: "#e5e7eb",
          borderRadius: "10px",
          overflow: "hidden"
        }}
      >

        <div
          style={{
            width:
              `${Math.min(value,100)}%`,
            height: "100%",
            background: status,
            borderRadius: "10px",
            transition:
              "width 0.4s ease"
          }}
        />

      </div>

    </div>

  );

}


// ==========================================
// STATUS ITEM
// ==========================================

function StatusItem({
  name,
  status,
  healthy
}) {

  const checking =
    status === "Checking...";

  const color =
    checking
      ? "#d97706"
      : healthy
        ? "#2e7d32"
        : "#dc2626";


  return (

    <div
      style={{
        border:
          "1px solid #e5e7eb",
        borderRadius: "9px",
        padding: "14px",
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center"
      }}
    >

      <strong
        style={{
          color: "#374151",
          fontSize: "13px"
        }}
      >
        {name}
      </strong>

      <span
        style={{
          color,
          fontSize: "12px",
          fontWeight: "bold"
        }}
      >
        ●{" "}
        {checking
          ? "Checking"
          : status}
      </span>

    </div>

  );

}


// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({
  status,
  healthy
}) {

  return (

    <span
      style={{
        color:
          healthy
            ? "#2e7d32"
            : "#dc2626",
        fontWeight: "bold",
        fontSize: "13px"
      }}
    >
      ● {status}
    </span>

  );

}


// ==========================================
// ERROR BOX
// ==========================================

function ErrorBox({
  message
}) {

  return (

    <div
      style={{
        background: "#fee2e2",
        color: "#b91c1c",
        border:
          "1px solid #fecaca",
        padding: "12px",
        borderRadius: "8px",
        marginTop: "15px"
      }}
    >
      {message}
    </div>

  );

}


// ==========================================
// EMPTY BOX
// ==========================================

function EmptyBox({
  text
}) {

  return (

    <div
      style={{
        padding: "45px",
        textAlign: "center",
        color: "#9ca3af"
      }}
    >
      {text}
    </div>

  );

}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(value) {

  if (!value) {

    return "-";

  }

  const date =
    new Date(value);

  if (
    isNaN(
      date.getTime()
    )
  ) {

    return value;

  }

  return date.toLocaleString();

}


// ==========================================
// TABLE STYLES
// ==========================================

const tableHeader = {

  textAlign: "left",

  padding: "12px",

  fontSize: "13px",

  color: "#374151",

  borderBottom:
    "1px solid #e5e7eb"

};


const tableCell = {

  padding:
    "13px 12px",

  borderBottom:
    "1px solid #f0f0f0",

  color: "#4b5563",

  fontSize: "14px"

};


export default AdminDashboard;