import {useEffect, useState} from "react";
import apiClient from "../api/apiClient";

function GoogleCalendarStatus() {
    const [status, setStatus] = useState({
        connected: false,
        message: "Checking Google Calendar connection...",
    });

    const [isLoading, setIsLoading] = useState(true);

    const checkStatus = async () => {
        try {
            const response = await apiClient.get("/auth/google/status");
            setStatus(response.data);
        } catch (error) {
            setStatus({
                connected: false,
                message: "Could not check Google Calendar status",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    const handleConnect = () => {
        window.location.href = "http://127.0.0.1:8000/api/auth/google";
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Google Calendar
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        {isLoading ? "Checking..." : status.message}
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                        status.connected
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                    }`}
                >
          {status.connected ? "Connected" : "Not Connected"}
        </span>
            </div>

            {!status.connected && (
                <button
                    onClick={handleConnect}
                    className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                    Connect Google Calendar
                </button>
            )}
        </div>
    );
}

export default GoogleCalendarStatus;