import {useMemo, useState} from "react";
import {
    calendarColors,
    eventPresets,
    reminderOptions,
    shiftLeaders,
} from "../data/eventPresets";
import {buildEventTitle} from "../utils/eventUtils";

function PresetEventForm({onPreviewGenerated}) {
    const defaultPreset = eventPresets[0];

    const [presetId, setPresetId] = useState(defaultPreset.id);
    const [date, setDate] = useState("");
    const [shiftLeader, setShiftLeader] = useState("");
    const [startTime, setStartTime] = useState(defaultPreset.defaultStartTime);
    const [endTime, setEndTime] = useState(defaultPreset.defaultEndTime);
    const [reminderMinutes, setReminderMinutes] = useState(
        defaultPreset.defaultReminderMinutes
    );
    const [colorId, setColorId] = useState(defaultPreset.defaultColorId);

    const selectedPreset = useMemo(() => {
        return eventPresets.find((preset) => preset.id === presetId);
    }, [presetId]);

    const selectedColor = useMemo(() => {
        return calendarColors.find((color) => color.id === colorId);
    }, [colorId]);

    const handlePresetChange = (event) => {
        const nextPresetId = event.target.value;
        const nextPreset = eventPresets.find((preset) => preset.id === nextPresetId);

        setPresetId(nextPresetId);
        setStartTime(nextPreset.defaultStartTime);
        setEndTime(nextPreset.defaultEndTime);
        setReminderMinutes(nextPreset.defaultReminderMinutes);
        setColorId(nextPreset.defaultColorId);
    };

    const handleGeneratePreview = (event) => {
        event.preventDefault();

        const selectedLeader = shiftLeaders.find(
            (leader) => leader.id === shiftLeader
        );

        const title = buildEventTitle(
            selectedPreset.defaultTitle,
            selectedLeader?.label
        );

        const preview = {
            eventType: selectedPreset.id,
            title,
            date,
            startTime,
            endTime,
            reminderMinutes: Number(reminderMinutes),
            colorId,
            colorLabel: selectedColor?.label || "Default",
            shiftLeader: selectedLeader?.label || "",
        };

        onPreviewGenerated(preview);
    };

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

            <div className="grid gap-5">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Event Type
                    </label>
                    <select
                        value={presetId}
                        onChange={handlePresetChange}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        {eventPresets.map((preset) => (
                            <option key={preset.id} value={preset.id}>
                                {preset.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        required
                        onChange={(event) => setDate(event.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Shift Leader
                    </label>
                    <select
                        value={shiftLeader}
                        onChange={(event) => setShiftLeader(event.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Start Time
                        </label>
                        <input
                            type="time"
                            value={startTime}
                            required
                            onChange={(event) => setStartTime(event.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            End Time
                        </label>
                        <input
                            type="time"
                            value={endTime}
                            required
                            onChange={(event) => setEndTime(event.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Reminder
                    </label>
                    <select
                        value={reminderMinutes}
                        onChange={(event) => setReminderMinutes(event.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        {reminderOptions.map((reminder) => (
                            <option key={reminder.value} value={reminder.value}>
                                {reminder.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Calendar Color
                    </label>
                    <select
                        value={colorId}
                        onChange={(event) => setColorId(event.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                    className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    Generate Preview
                </button>
            </div>
        </form>
    );
}

export default PresetEventForm;