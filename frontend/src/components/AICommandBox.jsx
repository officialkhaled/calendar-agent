import {useState} from "react";
import apiClient from "../api/apiClient";

function AICommandBox({onPreviewGenerated}) {
    const [command, setCommand] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateWithAI = async (event) => {
        event.preventDefault();

        if (!command.trim()) {
            setError("Please enter a calendar command.");
            return;
        }

        setIsGenerating(true);
        setError("");

        try {
            const response = await apiClient.post("/ai/generate-event", {
                command,
            });

            const aiPreview = {
                eventType: response.data.event_type,
                title: response.data.title,
                date: response.data.date,
                startTime: response.data.start_time,
                endTime: response.data.end_time,
                reminderMinutes: response.data.reminder_minutes,
                colorId: response.data.color_id,
                colorLabel: response.data.color_label,
                shiftLeader: response.data.shift_leader || "",
                missingFields: response.data.missing_fields || [],
            };

            onPreviewGenerated(aiPreview);
        } catch (error) {
            const message =
                error.response?.data?.detail ||
                "Failed to generate event using AI. Make sure LM Studio is running.";

            setError(message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <form
            onSubmit={handleGenerateWithAI}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
            <div className="mb-5">
                <p className="text-sm font-medium text-purple-600">AI Mode</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-950">
                    Generate with Natural Language
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Type a command and let your local AI prepare the event preview.
                </p>
            </div>

            <div className="space-y-4">
        <textarea
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            rows={4}
            placeholder="Example: Add Tesco shift tomorrow 3 to 11 with FH"
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        />

                {error && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                >
                    {isGenerating ? "Generating..." : "Generate with AI"}
                </button>

                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                    <p className="font-medium text-gray-800">Try these:</p>
                    <ul className="mt-2 space-y-1">
                        <li>Add Tesco shift tomorrow 3 to 11 with FH</li>
                        <li>Create Tesco shift Friday with PK</li>
                        <li>I have Tesco shift next Monday 15:00 to 23:00 with FH</li>
                    </ul>
                </div>
            </div>
        </form>
    );
}

export default AICommandBox;