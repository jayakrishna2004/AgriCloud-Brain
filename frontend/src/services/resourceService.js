import api from "./api";

export async function getResources() {

  const response = await api.get("/resources");

  return response.data;
}

export async function getResourceMetrics() {

  const response = await api.get(
    "/resources/metrics"
  );

  return response.data;
}

export async function getAlerts() {

  const response = await api.get("/alerts");

  return response.data;
}