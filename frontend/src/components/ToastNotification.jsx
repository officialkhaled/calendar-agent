import {useEffect, useRef} from "react";
import gsap from "gsap";

function ToastNotification({notification, onClose}) {
    const toastRef = useRef(null);

    useEffect(() => {
        if (!notification) return;

        gsap.fromTo(
            toastRef.current,
            {
                y: -20,
                opacity: 0,
                scale: 0.96,
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: "power3.out",
            }
        );

        const timer = setTimeout(() => {
            gsap.to(toastRef.current, {
                y: -20,
                opacity: 0,
                scale: 0.96,
                duration: 0.25,
                ease: "power2.in",
                onComplete: onClose,
            });
        }, 3500);

        return () => clearTimeout(timer);
    }, [notification, onClose]);

    if (!notification) return null;

    const styles = {
        success: "border-emerald-200 bg-emerald-50 text-emerald-800",
        error: "border-red-200 bg-red-50 text-red-800",
        info: "border-blue-200 bg-blue-50 text-blue-800",
    };

    return (
        <div className="fixed right-6 top-6 z-50 w-[calc(100%-3rem)] max-w-sm">
            <div
                ref={toastRef}
                className={`rounded-2xl border p-4 shadow-xl backdrop-blur-xl ${
                    styles[notification.type] || styles.info
                }`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold">{notification.title}</p>
                        <p className="mt-1 text-sm opacity-90">{notification.message}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg px-2 text-lg leading-none opacity-60 transition hover:opacity-100"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ToastNotification;