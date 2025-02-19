import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg'; // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById("submitEvent").addEventListener("click", async function() {
    const eventName = document.getElementById("eventName").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const description = document.getElementById("description").value;
    const statusMessage = document.getElementById("statusMessage");

    if (!eventName || !startDate || !endDate) {
        statusMessage.textContent = "Please fill in all fields!";
        statusMessage.style.color = "red";
        return;
    }

    // ✅ Get the logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("User not authenticated:", userError);
        statusMessage.textContent = "You must be logged in to add an event!";
        statusMessage.style.color = "red";
        return;
    }

    const userId = user.id; // Logged-in user's ID

    // ✅ Insert event with user_id
    const { data, error } = await supabase
        .from("calendar_events")
        .insert([
            {
                user_id: userId,  // Include the user's ID
                event: eventName,
                date: startDate,
                end_date: endDate,
                description: description
            }
        ]);

    if (error) {
        console.error("Error adding event:", error);
        statusMessage.textContent = "Error adding event!";
        statusMessage.style.color = "red";
    } else {
        statusMessage.textContent = "Event added successfully!";
        statusMessage.style.color = "green";
        document.getElementById("eventName").value = "";
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
        document.getElementById("description").value = "";
    }
});
