import {useState} from "react";
import HealthCheckCard from "../components/HealthCheckCard";
import PresetEventForm from "../components/PresetEventForm";
import EventPreviewCard from "../components/EventPreviewCard";
import AICommandBox from "../components/AICommandBox";
import GoogleCalendarStatus from "../components/GoogleCalendarStatus";

function Dashboard() {
    const [eventPreview, setEventPreview] = useState(null);
    const [createdEvent, setCreatedEvent] = useState(null);

    const handlePreviewGenerated = (preview) => {
        setEventPreview(preview);
        setCreatedEvent(null);
    };

    const handleEventCreated = (eventData) => {
        setCreatedEvent(eventData);
        setEventPreview(null);
    };

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="mx-auto max-w-6xl">
                <section className="mb-8">
                    <p className="text-sm font-medium text-blue-600">
                        Local AI Calendar Agent
                    </p>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950">
                        Calendar Agent
                    </h1>

                    <p className="mt-3 max-w-2xl text-gray-600">
                        Create Google Calendar events faster using saved presets and local
                        AI through LM Studio.
                    </p>
                </section>

                <section className="mb-8 grid gap-6 md:grid-cols-3">
                    <HealthCheckCard/>
                    <GoogleCalendarStatus/>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Sprint 4 Completed
                        </h2>

                        <ul className="mt-3 space-y-2 text-sm text-gray-600">
                            <li>✅ AI event preview works</li>
                            <li>✅ Google Calendar connected</li>
                            <li>✅ Calendar event creation works</li>
                            <li>✅ Event preview resets after success</li>
                        </ul>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                    <div className="space-y-6">
                        <AICommandBox onPreviewGenerated={handlePreviewGenerated}/>
                        <PresetEventForm onPreviewGenerated={handlePreviewGenerated}/>
                    </div>

                    <div className="lg:sticky lg:top-8 lg:self-start">
                        <EventPreviewCard
                            eventPreview={eventPreview}
                            createdEvent={createdEvent}
                            onEventCreated={handleEventCreated}
                        />
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Dashboard;