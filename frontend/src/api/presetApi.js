import apiClient from "./apiClient";

export async function getPresets() {
  const response = await apiClient.get("/presets");
  return response.data;
}

export async function createPreset(presetData) {
  const response = await apiClient.post("/presets", presetData);
  return response.data;
}