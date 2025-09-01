import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

async function getSupabaseConfig() {
    const res = await fetch('/.netlify/functions/ServerlessFunctions.js');
    const { url, key } = await res.json();
    console.log('Supabase URL:', url);
    console.log('Supabase Key:', key);
  
    // Now you can initialize your client
    const supabase = createClient(url, key);
    return supabase;
}

getSupabaseConfig()

const eventTableBody = document.getElementById("eventTableBody");

// ✅ Function to Convert UTC Time to Local
function convertToLocalTime(utcDateTime) {
    if (!utcDateTime) return "N/A";
    const date = new Date(utcDateTime);
    return date.toLocaleString([], {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    });
}

// ✅ Fetch Events from Supabase
async function fetchEvents() {
    const { data, error } = await supabase
        .from("calendar_events")
        .select("id, event, date, end_date")
        .order("date", { ascending: true });

    if (error) {
        console.error("Error fetching events:", error);
        return;
    }

    eventTableBody.innerHTML = ""; // Clear previous events

    data.forEach(event => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${event.id}</td>
            <td>${event.event}</td>
            <td>${convertToLocalTime(event.date)}</td>
            <td>${convertToLocalTime(event.end_date)}</td>
            <td>
                <button class="edit-btn" onclick="editEvent(${event.id}, '${event.event}', '${event.date}', '${event.end_date}')">Edit</button>
                <button class="delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
            </td>
        `;

        eventTableBody.appendChild(row);
    });
}

// ✅ Edit Event
window.editEvent = async function (id, eventName, date, endDate) {
    const newEvent = prompt("Edit Event Name:", eventName);
    if (!newEvent) return;

    const newDate = prompt("Edit Start Date (YYYY-MM-DD HH:MM:SS):", date);
    if (!newDate) return;

    const newEndDate = prompt("Edit End Date (YYYY-MM-DD HH:MM:SS):", endDate);
    if (!newEndDate) return;

    const { error } = await supabase
        .from("calendar_events")
        .update({ event: newEvent, date: newDate, end_date: newEndDate })
        .eq("id", id);

    if (error) {
        console.error("Error updating event:", error);
        return;
    }

    alert("Event updated successfully!");
    fetchEvents(); // Refresh event list
};

// ✅ Delete Event
window.deleteEvent = async function (id) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting event:", error);
        return;
    }

    alert("Event deleted successfully!");
    fetchEvents(); // Refresh event list
};

// ✅ Load Events on Page Load
fetchEvents();

document.getElementById("Go_Back").addEventListener("click", function() {
    window.location.href = 'Dashboard.html';
});
