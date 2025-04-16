import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

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
