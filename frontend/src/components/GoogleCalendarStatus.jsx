import {useEffect, useState} from "react";
import apiClient from "../api/apiClient";

function GoogleCalendarStatus({onNotify}) {
    const [status, setStatus] = useState({
        connected: false,
        message: "Checking Google Calendar connection...",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

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

    const handleDisconnect = async () => {
        setIsDisconnecting(true);

        try {
            const response = await apiClient.post("/auth/google/disconnect");
            setStatus({
                connected: false,
                message: response.data.message,
            });

            onNotify?.({
                type: "info",
                title: "Google Calendar disconnected",
                message: "You can now connect a different Google account.",
            });
        } catch (error) {
            onNotify?.({
                type: "error",
                title: "Disconnect failed",
                message: "Could not disconnect Google Calendar.",
            });
        } finally {
            setIsDisconnecting(false);
        }
    };

    return (
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        Calendar Sync
                    </p>

                    <h2 className="mt-2 text-lg font-bold text-slate-950">
                        Google Calendar
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                        {isLoading ? "Checking..." : status.message}
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                        status.connected
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                    }`}
                >
          {status.connected ? "Connected" : "Not Connected"}
        </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                {!status.connected && (
                    <button
                        onClick={handleConnect}
                        className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                        Connect Calendar
                    </button>
                )}

                {status.connected && (
                    <>
                        <button
                            onClick={handleConnect}
                            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
                        >
                            Change Account
                        </button>

                        <button
                            onClick={handleDisconnect}
                            disabled={isDisconnecting}
                            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 disabled:opacity-60"
                        >
                            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default GoogleCalendarStatus;