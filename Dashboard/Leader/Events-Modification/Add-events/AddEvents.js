import supabase from "../../../../supabase.js";

document.getElementById("submitEvent").addEventListener("click", async function() {
    const eventName = document.getElementById("eventName").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const description = document.getElementById("description").value.trim();
    const required = document.getElementById("required").value; // Capture the required field
    const statusMessage = document.getElementById("statusMessage");

    if (!eventName || !startDate || !endDate || !required) {
        statusMessage.textContent = "Please fill in all fields!";
        statusMessage.style.color = "red";
        return;
    }

    // Convert input dates to UTC format
    function convertToUTC(localDate) {
        return new Date(localDate).toISOString();
    }

    const utcStartDate = convertToUTC(startDate);
    const utcEndDate = convertToUTC(endDate);

    // ✅ Get the logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error("User not authenticated:", userError);
        statusMessage.textContent = "You must be logged in to add an event!";
        statusMessage.style.color = "red";
        return;
    }

    const userId = user.id;

    // ✅ Insert event with user_id and required status
    const { data, error } = await supabase
        .from("calendar_events")
        .insert([
            {
                user_id: userId,
                event: eventName,
                date: utcStartDate,
                end_date: utcEndDate,
                description: description,
                required: required === "true" // Convert "true"/"false" string to boolean
            }
        ]);

    if (error) {
        console.error("Error adding event:", error);
        statusMessage.textContent = "Error adding event!";
        statusMessage.style.color = "red";
    } else {
        statusMessage.textContent = "Event added successfully!";
        statusMessage.style.color = "green";
        
        // Clear form fields after submission
        document.getElementById("eventName").value = "";
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
        document.getElementById("description").value = "";
        document.getElementById("required").value = "true"; // Reset dropdown
    }
});

document.getElementById("Go_Back").addEventListener("click", function() {
    window.location.href = 'Dashboard.html';
});
