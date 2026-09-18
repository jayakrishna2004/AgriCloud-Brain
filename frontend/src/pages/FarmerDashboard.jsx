import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  Activity,
  Cpu,
  Database,
  Server,
  Brain,
  RefreshCw,
  LogOut,
  Sprout,
  Cloud,
  Gauge,
  Menu,
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Clock,
  MemoryStick
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import {
  useAuth
} from "../context/AuthContext";

import {
  getPrediction,
  getCloudMonitoring
} from "../services/api";


function FarmerDashboard() {

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
  // INPUTS
  // ==========================================

  const [
    cpuInput,
    setCpuInput
  ] = useState(70);


  const [
    memoryInput,
    setMemoryInput
  ] = useState(65);


  const [
    workloadInput,
    setWorkloadInput
  ] = useState(75);


  const [
    instancesInput,
    setInstancesInput
  ] = useState(4);


  // ==========================================
  // AI RESULT
  // ==========================================

  const [
    prediction,
    setPrediction
  ] = useState(null);


  const [
    predictionLoading,
    setPredictionLoading
  ] = useState(false);


  const [
    predictionError,
    setPredictionError
  ] = useState("");


  // ==========================================
  // AWS MONITORING
  // ==========================================

  const [
    cloudMetrics,
    setCloudMetrics
  ] = useState(null);


  const [
    cloudHistory,
    setCloudHistory
  ] = useState([]);


  const [
    cloudLoading,
    setCloudLoading
  ] = useState(true);


  const [
    cloudError,
    setCloudError
  ] = useState("");


  const [
    lastUpdated,
    setLastUpdated
  ] = useState(null);


  // ==========================================
  // NAVIGATION
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
  // AWS MONITORING
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


        setCloudHistory(
          previous => [

            ...previous,

            sample

          ].slice(-30)
        );


        setLastUpdated(
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
  // INITIAL MONITORING
  // ==========================================

  useEffect(() => {

    loadCloudMonitoring();

  }, []);


  // ==========================================
  // AUTO MONITORING EVERY 15 SEC
  // ==========================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        loadCloudMonitoring();

      }, 15000);


    return () => {

      clearInterval(interval);

    };

  }, []);


  // ==========================================
  // AI PREDICTION
  // ==========================================

  const handlePrediction =
    async () => {

      setPredictionError("");

      setPrediction(null);

      setPredictionLoading(true);


      try {

        const result =
          await getPrediction({

            cpu:
              cpuInput,

            memory:
              memoryInput,

            workload:
              workloadInput,

            instances:
              instancesInput

          });


        setPrediction(result);


        setTimeout(() => {

          scrollToSection(
            "ai-result"
          );

        }, 100);

      } catch (err) {

        console.error(
          "Prediction error:",
          err
        );

        setPredictionError(
          err.message ||
          "Unable to generate prediction"
        );

      } finally {

        setPredictionLoading(false);

      }

    };


  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh =
    async () => {

      await loadCloudMonitoring();

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
  // LIVE VALUES
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
  // HISTORY CHART
  // ==========================================

  const historyData =
    cloudHistory.map(
      (item, index) => ({

        name:
          item.time instanceof Date
            ? item.time.toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit"
                }
              )
            : `S${index + 1}`,

        CPU:
          item.cpu,

        Memory:
          item.memory,

        Workload:
          item.workload

      })
    );


  // ==========================================
  // RESOURCE STATUS
  // ==========================================

  const getStatus =
    value => {

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


  const cpuStatus =
    getStatus(cpu);

  const memoryStatus =
    getStatus(memory);

  const workloadStatus =
    getStatus(workload);


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
          left:
            sidebarOpen
              ? 0
              : "-270px",
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

              <Sprout
                size={26}
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
                Farmer Portal
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
            icon={
              <BarChart3
                size={19}
              />
            }
            text="Dashboard"
            onClick={() =>
              scrollToSection(
                "dashboard"
              )
            }
            active
          />

          <SidebarItem
            icon={
              <Cloud
                size={19}
              />
            }
            text="Cloud Monitoring"
            onClick={() =>
              scrollToSection(
                "cloud-monitoring"
              )
            }
          />

          <SidebarItem
            icon={
              <Gauge
                size={19}
              />
            }
            text="Resource Health"
            onClick={() =>
              scrollToSection(
                "resource-health"
              )
            }
          />

          <SidebarItem
            icon={
              <Brain
                size={19}
              />
            }
            text="AI Prediction"
            onClick={() =>
              scrollToSection(
                "ai-prediction"
              )
            }
          />

          <SidebarItem
            icon={
              <Sparkles
                size={19}
              />
            }
            text="Recommendation"
            onClick={() =>
              scrollToSection(
                "ai-result"
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
          MAIN
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
                  "Farmer"}
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
            maxWidth: "1200px",
            margin: "0 auto",
            padding:
              "30px 25px"
          }}
        >

          {/* =================================
              DASHBOARD
          ================================== */}

          <section id="dashboard">

            <div
              style={{
                marginBottom: "25px"
              }}
            >

              <h1
                style={{
                  margin:
                    "0 0 8px",
                  color: "#1f2937",
                  fontSize: "32px"
                }}
              >
                Welcome to your Farm Dashboard 🌱
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: "15px"
                }}
              >
                Monitor your AWS cloud resources
                and use AI to predict your
                future workload requirements.
              </p>

            </div>


            {/* QUICK CARDS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(210px,1fr))",
                gap: "18px",
                marginBottom: "28px"
              }}
            >

              <MetricCard
                icon={<Cpu size={24} />}
                title="CPU Usage"
                value={`${cpu.toFixed(2)}%`}
                description="Live AWS metric"
                status={
                  cpuStatus
                }
              />

              <MetricCard
                icon={
                  <MemoryStick
                    size={24}
                  />
                }
                title="Memory Usage"
                value={`${memory.toFixed(2)}%`}
                description="Live AWS metric"
                status={
                  memoryStatus
                }
              />

              <MetricCard
                icon={
                  <Activity
                    size={24}
                  />
                }
                title="Workload"
                value={`${workload.toFixed(2)}%`}
                description="Current cloud workload"
                status={
                  workloadStatus
                }
              />

              <MetricCard
                icon={
                  <Server
                    size={24}
                  />
                }
                title="Instances"
                value={instances}
                description="Active AWS instances"
                status={{
                  text: "Online",
                  color: "#2e7d32"
                }}
              />

            </div>

          </section>


          {/* =================================
              CLOUD MONITORING
          ================================== */}

          <section
            id="cloud-monitoring"
            style={sectionStyle}
          >

            <SectionTitle
              icon={
                <Cloud size={27} />
              }
              title="AWS Cloud Monitoring"
              subtitle="Real-time cloud infrastructure status"
              right={
                <button
                  type="button"
                  onClick={handleRefresh}
                  style={{
                    border:
                      "1px solid #d1d5db",
                    background:
                      "#ffffff",
                    borderRadius:
                      "8px",
                    padding:
                      "8px 12px",
                    cursor:
                      "pointer",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "6px"
                  }}
                >

                  <RefreshCw
                    size={15}
                  />

                  Refresh

                </button>
              }
            />


            {cloudError && (

              <ErrorBox
                message={
                  cloudError
                }
              />

            )}


            <div
              style={{
                marginTop: "20px",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(190px,1fr))",
                gap: "15px"
              }}
            >

              <CloudCard
                icon={
                  <Cpu size={23} />
                }
                title="CPU"
                value={`${cpu.toFixed(2)}%`}
                status={
                  cpuStatus
                }
              />

              <CloudCard
                icon={
                  <MemoryStick
                    size={23}
                  />
                }
                title="Memory"
                value={`${memory.toFixed(2)}%`}
                status={
                  memoryStatus
                }
              />

              <CloudCard
                icon={
                  <Activity
                    size={23}
                  />
                }
                title="Workload"
                value={`${workload.toFixed(2)}%`}
                status={
                  workloadStatus
                }
              />

              <CloudCard
                icon={
                  <Server
                    size={23}
                  />
                }
                title="Instances"
                value={instances}
                status={{
                  text: "Online",
                  color: "#2e7d32"
                }}
              />

              <CloudCard
                icon={
                  <ShieldCheck
                    size={23}
                  />
                }
                title="Provider"
                value={
                  cloudMetrics?.provider ||
                  "AWS"
                }
                status={{
                  text:
                    cloudMetrics?.status ||
                    "ONLINE",
                  color:
                    "#2e7d32"
                }}
              />

            </div>


            <div
              style={{
                marginTop: "15px",
                color: "#9ca3af",
                fontSize: "12px"
              }}
            >

              <Clock
                size={14}
                style={{
                  verticalAlign:
                    "middle"
                }}
              />

              {" "}
              Last updated:{" "}

              {lastUpdated
                ? lastUpdated.toLocaleString()
                : "-"}

            </div>

          </section>


          {/* =================================
              RESOURCE HEALTH
          ================================== */}

          <section
            id="resource-health"
            style={sectionStyle}
          >

            <SectionTitle
              icon={
                <Gauge size={27} />
              }
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


          {/* =================================
              HISTORY
          ================================== */}

          <section style={sectionStyle}>

            <SectionTitle
              icon={
                <TrendingUp
                  size={27}
                />
              }
              title="Cloud Usage History"
              subtitle="Live AWS resource utilization"
            />


            {historyData.length === 0 ? (

              <EmptyBox
                text="Collecting AWS monitoring data..."
              />

            ) : (

              <ResponsiveContainer
                width="100%"
                height={330}
              >

                <LineChart
                  data={
                    historyData
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
                    name="CPU"
                  />

                  <Line
                    type="monotone"
                    dataKey="Memory"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={false}
                    name="Memory"
                  />

                  <Line
                    type="monotone"
                    dataKey="Workload"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={false}
                    name="Workload"
                  />

                </LineChart>

              </ResponsiveContainer>

            )}

          </section>


          {/* =================================
              HIGH RESOURCE WARNING
          ================================== */}

          {(
            cpu >= 80 ||
            memory >= 80 ||
            workload >= 80
          ) && (

            <div
              style={{
                background: "#fee2e2",
                border:
                  "1px solid #fecaca",
                borderRadius: "12px",
                padding: "18px",
                marginBottom: "25px",
                display: "flex",
                gap: "12px",
                alignItems:
                  "flex-start"
              }}
            >

              <AlertTriangle
                size={24}
                color="#dc2626"
              />

              <div>

                <strong
                  style={{
                    color: "#b91c1c"
                  }}
                >
                  High Resource Usage
                </strong>

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    color: "#991b1b",
                    fontSize: "13px"
                  }}
                >
                  One or more cloud resources
                  are currently experiencing
                  high utilization. Run an AI
                  prediction to determine the
                  recommended cloud capacity.
                </p>

              </div>

            </div>

          )}


          {/* =================================
              AI PREDICTION
          ================================== */}

          <section
            id="ai-prediction"
            style={sectionStyle}
          >

            <SectionTitle
              icon={
                <Brain size={27} />
              }
              title="AI Workload Prediction"
              subtitle="Predict cloud resource requirements"
            />


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(200px,1fr))",
                gap: "18px",
                marginTop: "22px"
              }}
            >

              <InputField
                label="CPU Usage (%)"
                value={cpuInput}
                setValue={setCpuInput}
                min={0}
                max={100}
              />

              <InputField
                label="Memory Usage (%)"
                value={memoryInput}
                setValue={setMemoryInput}
                min={0}
                max={100}
              />

              <InputField
                label="Workload (%)"
                value={workloadInput}
                setValue={setWorkloadInput}
                min={0}
                max={100}
              />

              <InputField
                label="Current Instances"
                value={instancesInput}
                setValue={setInstancesInput}
                min={1}
                max={20}
              />

            </div>


            <button
              type="button"
              onClick={
                handlePrediction
              }
              disabled={
                predictionLoading
              }
              style={{
                width: "100%",
                marginTop: "23px",
                padding: "14px",
                border: "none",
                borderRadius: "9px",
                background:
                  predictionLoading
                    ? "#9ca3af"
                    : "#2e7d32",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor:
                  predictionLoading
                    ? "not-allowed"
                    : "pointer",
                display: "flex",
                justifyContent:
                  "center",
                alignItems:
                  "center",
                gap: "8px"
              }}
            >

              {predictionLoading ? (

                <>
                  <RefreshCw
                    size={18}
                    style={{
                      animation:
                        "spin 1s linear infinite"
                    }}
                  />

                  Running AI Prediction...

                </>

              ) : (

                <>
                  <Brain size={18} />

                  Run AI Prediction

                </>

              )}

            </button>


            {predictionError && (

              <ErrorBox
                message={
                  predictionError
                }
              />

            )}

          </section>


          {/* =================================
              AI RESULT
          ================================== */}

          {prediction && (

            <section
              id="ai-result"
              style={sectionStyle}
            >

              <SectionTitle
                icon={
                  <Sparkles
                    size={27}
                  />
                }
                title="AI Recommendation"
                subtitle="AI-generated cloud resource recommendation"
              />


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(210px,1fr))",
                  gap: "18px",
                  marginTop: "22px"
                }}
              >

                <ResultCard
                  icon={
                    <Activity
                      size={24}
                    />
                  }
                  title="Predicted Load"
                  value={
                    `${Number(
                      prediction.predictedLoad ??
                      prediction.predicted_load ??
                      0
                    ).toFixed(2)}%`
                  }
                />

                <ResultCard
                  icon={
                    <Brain
                      size={24}
                    />
                  }
                  title="AI Confidence"
                  value={
                    `${Number(
                      prediction.confidence ?? 0
                    ).toFixed(1)}%`
                  }
                />

                <ResultCard
                  icon={
                    <Server
                      size={24}
                    />
                  }
                  title="Recommended Instances"
                  value={
                    prediction.recommendedInstances ??
                    prediction.recommended_instances ??
                    0
                  }
                />

                <ResultCard
                  icon={
                    <Cloud
                      size={24}
                    />
                  }
                  title="Actual Workload"
                  value={
                    `${Number(
                      prediction.actualLoad ??
                      prediction.actual_load ??
                      workloadInput
                    ).toFixed(2)}%`
                  }
                />

              </div>


              <div
                style={{
                  marginTop: "22px",
                  background: "#eef8ef",
                  borderLeft:
                    "5px solid #2e7d32",
                  borderRadius: "10px",
                  padding: "18px"
                }}
              >

                <div
                  style={{
                    display: "flex",
                    gap: "9px",
                    alignItems:
                      "center"
                  }}
                >

                  <CheckCircle
                    size={21}
                    color="#2e7d32"
                  />

                  <strong
                    style={{
                      color: "#1f2937"
                    }}
                  >
                    AI Recommendation
                  </strong>

                </div>


                <p
                  style={{
                    color: "#374151",
                    lineHeight: "1.6",
                    marginBottom: 0
                  }}
                >

                  Based on the current workload,
                  the AI model recommends{" "}

                  <strong>
                    {
                      prediction.recommendedInstances ??
                      prediction.recommended_instances ??
                      0
                    }
                  </strong>

                  {" "}cloud instances.

                  The predicted workload is{" "}

                  <strong>
                    {Number(
                      prediction.predictedLoad ??
                      prediction.predicted_load ??
                      0
                    ).toFixed(2)}%
                  </strong>

                  {" "}with{" "}

                  <strong>
                    {Number(
                      prediction.confidence ?? 0
                    ).toFixed(1)}%
                  </strong>

                  {" "}confidence.

                </p>

              </div>

            </section>

          )}

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
// SIDEBAR
// ==========================================

function SidebarItem({
  icon,
  text,
  onClick,
  active
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

      {text}

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
// METRIC CARD
// ==========================================

function MetricCard({
  icon,
  title,
  value,
  description,
  status
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
          marginBottom: "10px"
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
          color: "#1f2937",
          fontWeight: "bold",
          fontSize: "27px",
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

      {status && (

        <div
          style={{
            color:
              status.color,
            fontSize: "12px",
            fontWeight: "600",
            marginTop: "7px"
          }}
        >
          ● {status.text}
        </div>

      )}

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
  status
}) {

  return (

    <div
      style={{
        background: "#f9fbf9",
        border:
          "1px solid #e5e7eb",
        borderRadius: "11px",
        padding: "16px"
      }}
    >

      <div
        style={{
          color: "#2e7d32",
          marginBottom: "8px"
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
          fontSize: "25px",
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

  const color =
    value >= 80
      ? "#dc2626"
      : value >= 60
        ? "#d97706"
        : "#2e7d32";


  return (

    <div
      style={{
        marginTop: "20px"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: "7px",
          color: "#374151",
          fontWeight: "600"
        }}
      >

        <span>
          {label}
        </span>

        <span
          style={{
            color
          }}
        >
          {value.toFixed(2)}%
        </span>

      </div>

      <div
        style={{
          height: "9px",
          background: "#e5e7eb",
          borderRadius: "10px"
        }}
      >

        <div
          style={{
            width:
              `${Math.min(value,100)}%`,
            height: "100%",
            background: color,
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
// INPUT
// ==========================================

function InputField({
  label,
  value,
  setValue,
  min,
  max
}) {

  return (

    <div>

      <label
        style={{
          display: "block",
          marginBottom: "7px",
          fontWeight: "600",
          color: "#374151",
          fontSize: "13px"
        }}
      >
        {label}
      </label>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={
          event => {

            const value =
              event.target.value;

            setValue(
              value === ""
                ? ""
                : Number(value)
            );

          }
        }
        style={{
          width: "100%",
          padding: "11px",
          border:
            "1px solid #d1d5db",
          borderRadius: "8px",
          fontSize: "15px",
          outline: "none"
        }}
      />

    </div>

  );

}


// ==========================================
// RESULT CARD
// ==========================================

function ResultCard({
  icon,
  title,
  value
}) {

  return (

    <div
      style={{
        background: "#f8faf8",
        border:
          "1px solid #e5e7eb",
        borderRadius: "11px",
        padding: "18px"
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
          fontSize: "27px",
          fontWeight: "bold",
          color: "#1f2937",
          marginTop: "4px"
        }}
      >
        {value}
      </div>

    </div>

  );

}


// ==========================================
// ERROR
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
// EMPTY
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


export default FarmerDashboard;