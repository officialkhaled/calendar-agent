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
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        API Status
                    </p>

                    <h2 className="mt-2 text-lg font-bold text-slate-950">
                        FastAPI Backend
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">{status}</p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isConnected
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
          {isConnected ? "Online" : "Offline"}
        </span>
            </div>
        </div>
    );
}

export default HealthCheckCard;