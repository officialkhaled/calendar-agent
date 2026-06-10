function ModeTabs({activeMode, onModeChange}) {
    const tabs = [
        {
            id: "ai",
            label: "AI Mode",
            description: "Use natural language",
        },
        {
            id: "manual",
            label: "Manual Mode",
            description: "Use saved presets",
        },
    ];

    return (
        <div className="rounded-3xl border border-white/70 bg-white/80 p-2 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => {
                    const isActive = activeMode === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onModeChange(tab.id)}
                            className={`rounded-2xl px-4 py-4 text-left transition-all ${
                                isActive
                                    ? "bg-slate-950 text-white shadow-lg shadow-slate-300"
                                    : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            <p className="text-sm font-bold">{tab.label}</p>
                            <p
                                className={`mt-1 text-xs ${
                                    isActive ? "text-slate-300" : "text-slate-400"
                                }`}
                            >
                                {tab.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default ModeTabs;