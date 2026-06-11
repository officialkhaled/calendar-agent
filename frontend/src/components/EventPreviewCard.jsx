import {useEffect, useState} from "react";
import apiClient from "../api/apiClient";
import {calendarColors, reminderOptions} from "../data/eventPresets";
import {formatDate, formatTime} from "../utils/eventUtils";

function EventPreviewCard({eventPreview, createdEvent, onEventCreated}) {
    const [editableEvent, setEditableEvent] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (eventPreview) {
            setEditableEvent(eventPreview);
            setError("");
        }
    }, [eventPreview]);

    if (!eventPreview && createdEvent) {
        return (
            <div className="rounded-3xl border border-emerald-200 bg-white/90 p-6 shadow-2xl shadow-emerald-100 backdrop-blur-xl">
                <div className="rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-700">
                    <p className="text-lg font-black text-emerald-800">
                        {createdEvent.message}
                    </p>

                    <p className="mt-2 text-emerald-700">
                        Your event has been added to Google Calendar.
                    </p>

                    {createdEvent.htmlLink && (
                        <a
                            href={createdEvent.htmlLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-emerald-700"
                        >
                            Open event in Google Calendar
                        </a>
                    )}
                </div>

                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-5 text-center">
                    <h2 className="text-lg font-bold text-slate-900">Ready for next event</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Generate another event using AI Mode or Manual Mode.
                    </p>
                </div>
            </div>
        );
    }

    if (!eventPreview || !editableEvent) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/85 p-6 text-center shadow-xl shadow-slate-200/70 backdrop-blur-xl">
                <h2 className="text-lg font-bold text-slate-900">Event Preview</h2>
                <p className="mt-2 text-sm text-slate-500">
                    Use AI Mode or Manual Mode to generate a preview.
                </p>
            </div>
        );
    }

    const hasMissingFields =
        editableEvent.missingFields && editableEvent.missingFields.length > 0;

    const updateField = (field, value) => {
        setEditableEvent((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleCreateEvent = async () => {
        setIsCreating(true);
        setError("");

        try {
            const response = await apiClient.post("/calendar/events", {
                title: editableEvent.title,
                date: editableEvent.date,
                start_time: editableEvent.startTime,
                end_time: editableEvent.endTime,
                reminder_minutes: Number(editableEvent.reminderMinutes),
                color_id: editableEvent.colorId,
            });

            onEventCreated({
                message: response.data.message,
                htmlLink: response.data.html_link || "",
                googleEventId: response.data.google_event_id || "",
            });
        } catch (error) {
            const message =
                error.response?.data?.detail ||
                "Failed to create Google Calendar event.";

            setError(typeof message === "string" ? message : "Invalid event details.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
            <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
                    Editable Preview
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    Review before creating
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                    You can edit the AI/manual result before syncing to Google Calendar.
                </p>
            </div>

            {hasMissingFields && (
                <div className="mb-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
                    <p className="font-bold">Missing fields:</p>
                    <ul className="mt-1 list-inside list-disc">
                        {editableEvent.missingFields.map((field) => (
                            <li key={field}>{field}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="grid gap-5">
                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Event Title
                    </label>
                    <input
                        type="text"
                        value={editableEvent.title}
                        onChange={(event) => updateField("title", event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Date
                    </label>
                    <input
                        type="date"
                        value={editableEvent.date}
                        onChange={(event) => updateField("date", event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                        {formatDate(editableEvent.date)}
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Start Time
                        </label>
                        <input
                            type="time"
                            value={editableEvent.startTime}
                            onChange={(event) => updateField("startTime", event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            {formatTime(editableEvent.startTime)}
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            End Time
                        </label>
                        <input
                            type="time"
                            value={editableEvent.endTime}
                            onChange={(event) => updateField("endTime", event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            {formatTime(editableEvent.endTime)}
                        </p>
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Reminder
                    </label>
                    <select
                        value={editableEvent.reminderMinutes}
                        onChange={(event) =>
                            updateField("reminderMinutes", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                        {reminderOptions.map((reminder) => (
                            <option key={reminder.value} value={reminder.value}>
                                {reminder.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Calendar Color
                    </label>
                    <select
                        value={editableEvent.colorId}
                        onChange={(event) => {
                            const selectedColor = calendarColors.find(
                                (color) => color.id === event.target.value
                            );

                            updateField("colorId", event.target.value);
                            updateField("colorLabel", selectedColor?.label || "General");
                        }}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                        {calendarColors.map((color) => (
                            <option key={color.id} value={color.id}>
                                {color.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <button
                onClick={handleCreateEvent}
                disabled={isCreating || hasMissingFields}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isCreating ? "Creating Event..." : "Confirm & Create Event"}
            </button>
        </div>
    );
}

export default EventPreviewCard;