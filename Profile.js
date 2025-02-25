const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function fetchUpcomingEvents() {
    const { data, error } = await supabase
        .from("calendar_events")
        .select("event, date")
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(2);

    if (error) { console.error("Error fetching events:", error); return; }

    const eventContainer = document.getElementById("upcomingEvents");
    eventContainer.innerHTML = data.map(event => 
        `<p class="upcoming-event">${event.event} - ${new Date(event.date).toLocaleString()}</p>`
    ).join("");
}

async function fetchReminders() {
    const { data, error } = await supabase
        .from("calendar_events")
        .select("event, date")
        .gte("date", new Date().toISOString())
        .lte("date", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

    if (error) { console.error("Error fetching reminders:", error); return; }

    const reminderContainer = document.getElementById("reminderSection");
    reminderContainer.innerHTML = data.map(event => 
        `<p class="reminder">Reminder: ${event.event} is happening soon!</p>`
    ).join("");
}

fetchUpcomingEvents();
fetchReminders();
