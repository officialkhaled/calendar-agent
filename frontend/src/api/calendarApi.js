import apiClient from "./apiClient";

export async function getEventHistory() {
    const response = await apiClient.get("/calendar/history");
    return response.data;
}