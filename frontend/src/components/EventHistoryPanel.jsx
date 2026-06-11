import {useEffect, useState} from "react";
import {getEventHistory} from "../api/calendarApi";
import {formatDate, formatTime} from "../utils/eventUtils";

function EventHistoryPanel({refreshKey}) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await getEventHistory();
                setHistory(data);
            } catch (error) {
                setHistory([]);
            }
        };

        loadHistory();
    }, [refreshKey]);

    return (
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Recent Events
            </p>

            <h2 className="mt-2 text-lg font-bold text-slate-950">
                Calendar History
            </h2>

            {history.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                    No events created yet.
                </p>
            ) : (
                <div className="mt-4 space-y-3">
                    {history.map((event) => (
                        <div
                            key={event.id}
                            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                        >
                            <p className="text-sm font-bold text-slate-900">
                                {event.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {formatDate(event.date)} · {formatTime(event.start_time)} -{" "}
                                {formatTime(event.end_time)}
                            </p>

                            {event.html_link && (
                                <a
                                    href={event.html_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-block text-xs font-bold text-blue-600 underline"
                                >
                                    Open in Calendar
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EventHistoryPanel;