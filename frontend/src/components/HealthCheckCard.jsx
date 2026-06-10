import {useEffect, useState} from "react";
import apiClient from "../api/apiClient";

function HealthCheckCard() {
    const [status, setStatus] = useState("Checking backend...");
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const checkBackend = async () => {
            try {
                const response = await apiClient.get("/health");
                setStatus(response.data.message);
                setIsConnected(true);
            } catch (error) {
                setStatus("Backend is not connected");
                setIsConnected(false);
            }
        };

        checkBackend();
    }, []);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Backend Status
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">{status}</p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                        isConnected
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
          {isConnected ? "Connected" : "Disconnected"}
        </span>
            </div>
        </div>
    );
}

export default HealthCheckCard;