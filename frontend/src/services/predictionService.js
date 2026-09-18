import api from "./api";

export async function getPredictions() {

  const response = await api.get("/predictions");

  return response.data;
}

export async function getLatestPrediction() {

  const response = await api.get("/predictions/latest");

  return response.data;
}

export async function createPrediction(data) {

  const response = await api.post(
    "/predictions",
    data
  );

  return response.data;
}