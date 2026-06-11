import {useEffect, useState} from "react";
import {createPreset, deletePreset, getPresets} from "../api/presetApi";
import {calendarColors, reminderOptions} from "../data/eventPresets";
import {createSlugKey} from "../utils/stringUtils";

function PresetManager({onNotify, onPresetsChanged}) {
    const [presets, setPresets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        label: "",
        defaultTitle: "",
        defaultStartTime: "09:00",
        defaultEndTime: "10:00",
        defaultReminderMinutes: 30,
        defaultColorId: "1",
    });

    const loadPresets = async () => {
        try {
            const data = await getPresets();
            setPresets(data);
        } catch (error) {
            setError("Could not load presets.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPresets();
    }, []);

    const handleChange = (field, value) => {
        setForm((current) => {
            const updated = {
                ...current,
                [field]: value,
            };

            if (field === "label" && !current.defaultTitle) {
                updated.defaultTitle = value;
            }

            return updated;
        });
    };

    const resetForm = () => {
        setForm({
            label: "",
            defaultTitle: "",
            defaultStartTime: "09:00",
            defaultEndTime: "10:00",
            defaultReminderMinutes: 30,
            defaultColorId: "1",
        });
    };

    const handleCreatePreset = async (event) => {
        event.preventDefault();

        setError("");

        if (!form.label.trim()) {
            setError("Preset name is required.");
            return;
        }

        if (!form.defaultTitle.trim()) {
            setError("Default title is required.");
            return;
        }

        const selectedColor = calendarColors.find(
            (color) => color.id === form.defaultColorId
        );

        const payload = {
            key: createSlugKey(form.label),
            label: form.label.trim(),
            default_title: form.defaultTitle.trim(),
            default_start_time: form.defaultStartTime,
            default_end_time: form.defaultEndTime,
            default_reminder_minutes: Number(form.defaultReminderMinutes),
            default_color_id: form.defaultColorId,
            color_label: selectedColor?.label || "General",
        };

        try {
            setIsSaving(true);

            await createPreset(payload);
            await loadPresets();

            resetForm();

            onPresetsChanged?.();

            onNotify?.({
                type: "success",
                title: "Preset created",
                message: `${payload.label} is now available in Manual Mode.`,
            });
        } catch (error) {
            const message =
                error.response?.data?.detail || "Could not create preset.";

            setError(message);

            onNotify?.({
                type: "error",
                title: "Preset creation failed",
                message,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeletePreset = async (preset) => {
        const confirmed = window.confirm(
            `Delete preset "${preset.label}"?`
        );

        if (!confirmed) return;

        try {
            await deletePreset(preset.id);
            await loadPresets();

            onPresetsChanged?.();

            onNotify?.({
                type: "info",
                title: "Preset deleted",
                message: `${preset.label} was removed.`,
            });
        } catch (error) {
            const message =
                error.response?.data?.detail || "Could not delete preset.";

            onNotify?.({
                type: "error",
                title: "Delete failed",
                message,
            });
        }
    };

    return (
        <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
            <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">
                    Preset Library
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    Manage saved presets
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Create reusable event templates for shifts, study sessions, meetings,
                    and repeated events.
                </p>
            </div>

            {error && (
                <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleCreatePreset} className="grid gap-5">
                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Preset Name
                    </label>

                    <input
                        type="text"
                        value={form.label}
                        onChange={(event) => handleChange("label", event.target.value)}
                        placeholder="Example: Study Session"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Default Event Title
                    </label>

                    <input
                        type="text"
                        value={form.defaultTitle}
                        onChange={(event) =>
                            handleChange("defaultTitle", event.target.value)
                        }
                        placeholder="Example: Study Session"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Default Start Time
                        </label>

                        <input
                            type="time"
                            value={form.defaultStartTime}
                            onChange={(event) =>
                                handleChange("defaultStartTime", event.target.value)
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Default End Time
                        </label>

                        <input
                            type="time"
                            value={form.defaultEndTime}
                            onChange={(event) =>
                                handleChange("defaultEndTime", event.target.value)
                            }
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Default Reminder
                    </label>

                    <select
                        value={form.defaultReminderMinutes}
                        onChange={(event) =>
                            handleChange("defaultReminderMinutes", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
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
                        Default Color
                    </label>

                    <select
                        value={form.defaultColorId}
                        onChange={(event) =>
                            handleChange("defaultColorId", event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    >
                        {calendarColors.map((color) => (
                            <option key={color.id} value={color.id}>
                                {color.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-sm font-black text-white shadow-xl shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSaving ? "Saving Preset..." : "Create Preset"}
                </button>
            </form>

            <div className="mt-8">
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">
                    Saved Presets
                </h3>

                {isLoading ? (
                    <p className="mt-4 text-sm text-slate-500">Loading presets...</p>
                ) : (
                    <div className="mt-4 grid gap-3">
                        {presets.map((preset) => (
                            <div
                                key={preset.id}
                                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                            >
                                <div>
                                    <p className="text-sm font-bold text-slate-900">
                                        {preset.label}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {preset.default_start_time} - {preset.default_end_time} ·{" "}
                                        {preset.default_reminder_minutes} min reminder ·{" "}
                                        {preset.color_label}
                                    </p>
                                </div>

                                {preset.key !== "tesco_shift" && (
                                    <button
                                        onClick={() => handleDeletePreset(preset)}
                                        className="rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PresetManager;