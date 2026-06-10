import {useState} from "react";
import HealthCheckCard from "../components/HealthCheckCard";
import PresetEventForm from "../components/PresetEventForm";
import EventPreviewCard from "../components/EventPreviewCard";
import AICommandBox from "../components/AICommandBox";
import GoogleCalendarStatus from "../components/GoogleCalendarStatus";
import ToastNotification from "../components/ToastNotification";
import ModeTabs from "../components/ModeTabs";
import AnimatedPanel from "../components/AnimatedPanel";

function Dashboard() {
    const [eventPreview, setEventPreview] = useState(null);
    const [createdEvent, setCreatedEvent] = useState(null);
    const [activeMode, setActiveMode] = useState("ai");
    const [notification, setNotification] = useState(null);

    const handleNotify = (payload) => {
        setNotification(payload);
    };

    const handlePreviewGenerated = (preview) => {
        setEventPreview(preview);
        setCreatedEvent(null);
    };

    const handleEventCreated = (eventData) => {
        setCreatedEvent(eventData);
        setEventPreview(null);

        handleNotify({
            type: "success",
            title: "Event created",
            message: "Your event was added to Google Calendar.",
        });
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f6f8ff] px-6 py-8">
            <ToastNotification
                notification={notification}
                onClose={() => setNotification(null)}
            />

            <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-80 w-80 rounded-full bg-blue-300/30 blur-3xl"/>
            <div className="pointer-events-none absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-purple-300/30 blur-3xl"/>
            <div className="pointer-events-none absolute bottom-[-15%] left-[30%] h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl"/>

            <div className="relative mx-auto max-w-7xl">
                <section className="mb-8">
                    <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm backdrop-blur-xl">
                        Local AI Calendar Agent
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
                        <div>
                            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
                                Calendar Agent turns quick commands into calendar-ready events.
                            </h1>

                            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                                Schedule Tesco shifts and repeated events faster using presets,
                                local AI through LM Studio, and direct Google Calendar sync.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
                            <p className="text-sm font-bold text-slate-900">
                                Current workflow
                            </p>

                            <div className="mt-4 grid gap-3 text-sm text-slate-600">
                                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                    1
                  </span>
                                    Generate event preview
                                </div>

                                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    2
                  </span>
                                    Review event details
                                </div>

                                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    3
                  </span>
                                    Create in Google Calendar
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-8 grid gap-6 lg:grid-cols-3">
                    <HealthCheckCard/>
                    <GoogleCalendarStatus onNotify={handleNotify}/>

                    <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                            Build Status
                        </p>

                        <h2 className="mt-2 text-lg font-bold text-slate-950">
                            Production-style MVP
                        </h2>

                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li>✅ AI event preview</li>
                            <li>✅ Google Calendar sync</li>
                            <li>✅ Account switching</li>
                            <li>✅ Animated UI + notifications</li>
                        </ul>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                    <div className="space-y-6">
                        <ModeTabs activeMode={activeMode} onModeChange={setActiveMode}/>

                        <AnimatedPanel animationKey={activeMode}>
                            {activeMode === "ai" ? (
                                <AICommandBox
                                    onPreviewGenerated={handlePreviewGenerated}
                                    onNotify={handleNotify}
                                />
                            ) : (
                                <PresetEventForm onPreviewGenerated={handlePreviewGenerated}/>
                            )}
                        </AnimatedPanel>
                    </div>

                    <div className="lg:sticky lg:top-8 lg:self-start">
                        <AnimatedPanel animationKey={eventPreview?.title || createdEvent?.googleEventId || "empty"}>
                            <EventPreviewCard
                                eventPreview={eventPreview}
                                createdEvent={createdEvent}
                                onEventCreated={handleEventCreated}
                            />
                        </AnimatedPanel>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Dashboard;