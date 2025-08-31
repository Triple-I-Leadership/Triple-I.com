import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

async function getSupabaseConfig() {
    const res = await fetch('/.netlify/functions/supabase');
    const { url, key } = await res.json();
    console.log('Supabase URL:', url);
    console.log('Supabase Key:', key);
  
    // Now you can initialize your client
    const supabase = createClient(url, key);
    return supabase;
  }
  
  getSupabaseConfig();
  
// Fetch current user
async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
        console.error("No user signed in.");
        return null;
    }
    return data.user.id;
}

// Fetch upcoming events (within the next month)
async function fetchUpcomingEvents() {
    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);

    const { data, error } = await supabase
        .from("calendar_events")
        .select("event, date")
        .gte("date", now.toISOString())
        .lte("date", oneMonthLater.toISOString())
        .order("date", { ascending: true })
        .limit(2);

    if (error) { console.error("Error fetching events:", error); return; }

    const eventContainer = document.getElementById("upcomingEvents");
    eventContainer.innerHTML = data.map(event =>
        `<p class="upcoming-event">${event.event} - ${new Date(event.date).toLocaleString()}</p>`
    ).join("");
}

// Fetch reminders (next 24 hours)
async function fetchReminders() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
        .from("calendar_events")
        .select("event, date")
        .gte("date", now.toISOString())
        .lte("date", tomorrow.toISOString());

    if (error) { console.error("Error fetching reminders:", error); return; }

    const reminderContainer = document.getElementById("reminderSection");
    reminderContainer.innerHTML = data.map(event =>
        `<p class="reminder">Reminder: ${event.event} is happening soon!</p>`
    ).join("");
}

// Fetch total points for the user
async function fetchTotalPoints() {
    const userId = await getCurrentUser();
    if (!userId) return;

    const { data, error } = await supabase
        .from("users")
        .select("id, points")
        .eq("id", userId);

    if (error) {
        console.error("Error fetching points:", error);
        return;
    }

    const totalPoints = data.reduce((sum, row) => sum + row.points, 0);
    document.getElementById("totalPoints").textContent = totalPoints;
}

// Run everything
fetchUpcomingEvents();
fetchReminders();
fetchTotalPoints();
