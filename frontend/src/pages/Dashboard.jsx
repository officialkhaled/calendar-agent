import HealthCheckCard from "../components/HealthCheckCard";

function Dashboard() {
    return (
        <main className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <section className="mb-8">
                    <p className="text-sm font-medium text-blue-600">
                        Local AI Calendar Agent
                    </p>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950">
                        CalPilot
                    </h1>

                    <p className="mt-3 max-w-2xl text-gray-600">
                        Create Google Calendar events faster using saved presets and local
                        AI through LM Studio.
                    </p>
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                    <HealthCheckCard/>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Sprint 1 Progress
                        </h2>

                        <ul className="mt-3 space-y-2 text-sm text-gray-600">
                            <li>✅ React frontend created</li>
                            <li>✅ FastAPI backend created</li>
                            <li>✅ CORS configured</li>
                            <li>✅ Frontend connected to backend</li>
                        </ul>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Dashboard;