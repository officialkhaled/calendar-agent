import {useEffect, useMemo, useState} from "react";
import {getPresets} from "../api/presetApi";
import {
    calendarColors,
    reminderOptions,
    shiftLeaders,
} from "../data/eventPresets";
import {buildEventTitle} from "../utils/eventUtils";

function PresetEventForm({onPreviewGenerated}) {
    const [presets, setPresets] = useState([]);
    const [isLoadingPresets, setIsLoadingPresets] = useState(true);
    const [presetError, setPresetError] = useState("");

    const [presetId, setPresetId] = useState("");
    const [date, setDate] = useState("");
    const [shiftLeader, setShiftLeader] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [reminderMinutes, setReminderMinutes] = useState(30);
    const [colorId, setColorId] = useState("9");

    useEffect(() => {
        const loadPresets = async () => {
            try {
                const data = await getPresets();
                setPresets(data);

                if (data.length > 0) {
                    const firstPreset = data[0];

                    setPresetId(String(firstPreset.id));
                    setStartTime(firstPreset.default_start_time);
                    setEndTime(firstPreset.default_end_time);
                    setReminderMinutes(firstPreset.default_reminder_minutes);
                    setColorId(firstPreset.default_color_id);
                }
            } catch (error) {
                setPresetError("Could not load presets from backend.");
            } finally {
                setIsLoadingPresets(false);
            }
        };

        loadPresets();
    }, []);

    const selectedPreset = useMemo(() => {
        return presets.find((preset) => String(preset.id) === String(presetId));
    }, [presets, presetId]);

    const selectedColor = useMemo(() => {
        return calendarColors.find((color) => color.id === colorId);
    }, [colorId]);

    const handlePresetChange = (event) => {
        const nextPresetId = event.target.value;
        const nextPreset = presets.find(
            (preset) => String(preset.id) === String(nextPresetId)
        );

        setPresetId(nextPresetId);

        if (!nextPreset) return;

        setStartTime(nextPreset.default_start_time);
        setEndTime(nextPreset.default_end_time);
        setReminderMinutes(nextPreset.default_reminder_minutes);
        setColorId(nextPreset.default_color_id);
    };

    const handleGeneratePreview = (event) => {
        event.preventDefault();

        if (!selectedPreset) {
            setPresetError("Please select a valid preset.");
            return;
        }

        const selectedLeader = shiftLeaders.find(
            (leader) => leader.id === shiftLeader
        );

        const title = buildEventTitle(
            selectedPreset.default_title,
            selectedLeader?.label
        );

        const preview = {
            eventType: selectedPreset.key,
            title,
            date,
            startTime,
            endTime,
            reminderMinutes: Number(reminderMinutes),
            colorId,
            colorLabel: selectedColor?.label || selectedPreset.color_label || "Default",
            shiftLeader: selectedLeader?.label || "",
        };

        onPreviewGenerated(preview);
    };

    if (isLoadingPresets) {
        return (
            <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur-xl">
                <p className="text-sm font-semibold text-slate-600">
                    Loading presets...
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleGeneratePreview}
            className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur-xl"
        >
            <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
                    Manual Scheduler
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                    Create from saved preset
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Select predefined values and generate a clean event preview.
                </p>
            </div>

            {presetError && (
                <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {presetError}
                </div>
            )}

            <div className="grid gap-5">
                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Event Type
                    </label>

                    <select
                        value={presetId}
                        onChange={handlePresetChange}
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                        {presets.map((preset) => (
                            <option key={preset.id} value={preset.id}>
                                {preset.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Date
                    </label>

                    <input
                        type="date"
                        value={date}
                        required
                        onChange={(event) => setDate(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Shift Leader
                    </label>

                    <select
                        value={shiftLeader}
                        onChange={(event) => setShiftLeader(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                        <option value="">No shift leader</option>
                        {shiftLeaders.map((leader) => (
                            <option key={leader.id} value={leader.id}>
                                {leader.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            Start Time
                        </label>

                        <input
                            type="time"
                            value={startTime}
                            required
                            onChange={(event) => setStartTime(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">
                            End Time
                        </label>

                        <input
                            type="time"
                            value={endTime}
                            required
                            onChange={(event) => setEndTime(event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                        Reminder
                    </label>

                    <select
                        value={reminderMinutes}
                        onChange={(event) => setReminderMinutes(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                        value={colorId}
                        onChange={(event) => setColorId(event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                    className="rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-4 text-sm font-black text-white shadow-xl shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-2xl"
                >
                    Generate Preview
                </button>
            </div>
        </form>
    );
}

export default PresetEventForm;