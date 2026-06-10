import {useState} from "react";
import apiClient from "../api/apiClient";
import {formatDate, formatTime} from "../utils/eventUtils";

function EventPreviewCard({eventPreview, createdEvent, onEventCreated}) {
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");

    if (!eventPreview && createdEvent) {
        return (
            <div className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm">
                <div className="rounded-xl bg-green-50 p-5 text-sm text-green-700">
                    <p className="text-lg font-semibold text-green-800">
                        {createdEvent.message}
                    </p>

                    <p className="mt-2 text-green-700">
                        Your event has been added to Google Calendar.
                    </p>

                    {createdEvent.htmlLink && (
                        <a
                            href={createdEvent.htmlLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                            Open event in Google Calendar
                        </a>
                    )}
                </div>

                <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-5 text-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Event Preview
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Generate another event using AI mode or manual preset mode.
                    </p>
                </div>
            </div>
        );
    }

    if (!eventPreview) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-900">Event Preview</h2>
                <p className="mt-2 text-sm text-gray-500">
                    Use AI mode or manual preset mode to generate a preview.
                </p>
            </div>
        );
    }

    const hasMissingFields =
        eventPreview.missingFields && eventPreview.missingFields.length > 0;

    const handleCreateEvent = async () => {
        setIsCreating(true);
        setError("");

        try {
            const response = await apiClient.post("/calendar/events", {
                title: eventPreview.title,
                date: eventPreview.date,
                start_time: eventPreview.startTime,
                end_time: eventPreview.endTime,
                reminder_minutes: eventPreview.reminderMinutes,
                color_id: eventPreview.colorId,
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

            setError(message);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-blue-600">Event Preview</p>
                    <h2 className="mt-1 text-2xl font-bold text-gray-950">
                        {eventPreview.title}
                    </h2>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {eventPreview.colorLabel}
        </span>
            </div>

            {hasMissingFields && (
                <div className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                    <p className="font-semibold">Missing fields:</p>
                    <ul className="mt-1 list-inside list-disc">
                        {eventPreview.missingFields.map((field) => (
                            <li key={field}>{field}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="space-y-4 text-sm">
                <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Date
                    </p>
                    <p className="mt-1 font-medium text-gray-900">
                        {formatDate(eventPreview.date)}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Start Time
                        </p>
                        <p className="mt-1 font-medium text-gray-900">
                            {formatTime(eventPreview.startTime)}
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            End Time
                        </p>
                        <p className="mt-1 font-medium text-gray-900">
                            {formatTime(eventPreview.endTime)}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Reminder
                    </p>
                    <p className="mt-1 font-medium text-gray-900">
                        {eventPreview.reminderMinutes} minutes before
                    </p>
                </div>

                {eventPreview.shiftLeader && (
                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Shift Leader
                        </p>
                        <p className="mt-1 font-medium text-gray-900">
                            {eventPreview.shiftLeader}
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <button
                onClick={handleCreateEvent}
                disabled={isCreating || hasMissingFields}
                className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
                {isCreating ? "Creating Event..." : "Confirm & Create Event"}
            </button>
        </div>
    );
}

export default EventPreviewCard;