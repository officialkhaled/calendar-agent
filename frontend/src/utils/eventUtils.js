export function buildEventTitle(baseTitle, shiftLeader) {
    if (!shiftLeader) {
        return baseTitle;
    }

    return `${baseTitle} - ${shiftLeader}`;
}

export function formatTime(time) {
    if (!time) return "";

    const [hourString, minuteString] = time.split(":");
    const hour = Number(hourString);
    const minute = Number(minuteString);

    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);

    return date.toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

export function formatDate(dateString) {
    if (!dateString) return "No date selected";

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}