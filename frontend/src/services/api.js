const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api";

const AI_ENGINE_URL =
  import.meta.env.VITE_AI_ENGINE_URL ||
  "http://localhost:5000";

// ==========================================
// GET JWT TOKEN
// ==========================================

const getToken = () => {

  return localStorage.getItem(
    "agricloud_token"
  );

};


// ==========================================
// COMMON HEADERS
// ==========================================

const getHeaders = () => {

  const token = getToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`
        }
      : {})
  };

};


// ==========================================
// BACKEND HEALTH
// ==========================================

export const checkBackendHealth = async () => {

  try {

    const response = await fetch(
      `${API_URL}/health`
    );

    let data = null;

    try {

      data =
        await response.json();

    } catch {

      data = null;

    }

    if (!response.ok) {

      throw new Error(
        data?.message ||
        data?.error ||
        "Spring Boot backend is unavailable"
      );

    }

    return data;

  } catch (error) {

    throw new Error(
      error.message ||
      "Spring Boot backend is unavailable"
    );

  }

};


// ==========================================
// AI ENGINE HEALTH
// ==========================================

export const checkAIHealth = async () => {

  try {

    const response = await fetch(
      `${AI_ENGINE_URL}/health`
    );

    let data = null;

    try {

      data =
        await response.json();

    } catch {

      data = null;

    }

    if (!response.ok) {

      throw new Error(
        data?.message ||
        data?.error ||
        "AI Engine is unavailable"
      );

    }

    return data;

  } catch (error) {

    throw new Error(
      error.message ||
      "AI Engine is unavailable"
    );

  }

};


// ==========================================
// AWS CLOUD MONITORING
// REAL AWS DATA
// ==========================================

export const getCloudMonitoring = async () => {

  try {

    const response = await fetch(
      `${API_URL}/monitoring/current`,
      {
        method: "GET",
        headers: getHeaders()
      }
    );

    let data;

    try {

      data =
        await response.json();

    } catch {

      throw new Error(
        "Invalid response from AWS monitoring service"
      );

    }

    if (!response.ok) {

      throw new Error(
        data?.message ||
        data?.error ||
        "Unable to fetch AWS monitoring data"
      );

    }

    return data;

  } catch (error) {

    throw new Error(
      error.message ||
      "Unable to fetch AWS monitoring data"
    );

  }

};


// ==========================================
// GET ALL PREDICTIONS
// ==========================================

export const getAllPredictions = async () => {

  try {

    const response = await fetch(
      `${API_URL}/predictions`,
      {
        method: "GET",
        headers: getHeaders()
      }
    );

    let data;

    try {

      data =
        await response.json();

    } catch {

      throw new Error(
        "Invalid response from backend"
      );

    }

    if (!response.ok) {

      throw new Error(
        data?.message ||
        data?.error ||
        "Unable to fetch predictions"
      );

    }

    return data;

  } catch (error) {

    throw new Error(
      error.message ||
      "Unable to fetch predictions"
    );

  }

};


// ==========================================
// GET LATEST PREDICTION
// ==========================================

export const getLatestPrediction = async () => {

  try {

    const response = await fetch(
      `${API_URL}/predictions/latest`,
      {
        method: "GET",
        headers: getHeaders()
      }
    );

    let data;

    try {

      data =
        await response.json();

    } catch {

      throw new Error(
        "Invalid response from backend"
      );

    }

    if (!response.ok) {

      throw new Error(
        data?.message ||
        data?.error ||
        "Unable to fetch latest prediction"
      );

    }

    return data;

  } catch (error) {

    throw new Error(
      error.message ||
      "Unable to fetch latest prediction"
    );

  }

};


// ==========================================
// CREATE AI PREDICTION
// ==========================================

export const getPrediction = async ({
  cpu,
  memory,
  workload,
  instances
}) => {

  try {

    const response = await fetch(
      `${API_URL}/predictions`,
      {
        method: "POST",

        headers: getHeaders(),

        body: JSON.stringify({

          cpu: Number(cpu),

          memory: Number(memory),

          workload:
            Number(workload),

          instances:
            Number(instances)

        })
      }
    );

    let data;

    try {

      data =
        await response.json();

    } catch {

      throw new Error(
        "Invalid response from backend"
      );

    }

    if (!response.ok) {

      throw new Error(
        data?.message ||
        data?.error ||
        "Prediction failed"
      );

    }

    return data;

  } catch (error) {

    throw new Error(
      error.message ||
      "Unable to generate AI prediction"
    );

  }

};