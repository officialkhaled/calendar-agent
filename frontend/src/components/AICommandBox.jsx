import {useState} from "react";
import apiClient from "../api/apiClient";

function AICommandBox({onPreviewGenerated, onNotify}) {
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

            onNotify?.({
                type: "success",
                title: "AI preview generated",
                message: "Your event preview is ready to review.",
            });
        } catch (error) {
            const message =
                error.response?.data?.detail ||
                "Failed to generate event using AI. Make sure LM Studio is running.";

            setError(message);

            onNotify?.({
                type: "error",
                title: "AI generation failed",
                message,
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <form
            onSubmit={handleGenerateWithAI}
            className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur-xl"
        >
            <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500">
                    AI Calendar Agent
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    Tell CalPilot what to schedule
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Type naturally. The local model will extract date, time, title,
                    reminder, and shift leader.
                </p>
            </div>

            <div className="space-y-4">
        <textarea
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            rows={5}
            placeholder="Example: Add Tesco shift tomorrow 3 to 11 with FH"
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
        />

                {error && (
                    <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isGenerating ? "Generating Preview..." : "Generate AI Preview"}
                </button>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-bold text-slate-800">Try these commands</p>

                    <div className="mt-3 grid gap-2">
                        {[
                            "Add Tesco shift tomorrow 3 to 11 with FH",
                            "Create Tesco shift Friday with PK",
                            "I have Tesco shift next Monday 15:00 to 23:00 with FH",
                        ].map((example) => (
                            <button
                                type="button"
                                key={example}
                                onClick={() => setCommand(example)}
                                className="rounded-xl bg-white px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-purple-50 hover:text-purple-700"
                            >
                                {example}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </form>
    );
}

export default AICommandBox;