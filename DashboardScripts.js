import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
    const showUsersButton = document.getElementById("showUsersButton");

    if (showUsersButton) {
        showUsersButton.addEventListener("click", async function () {
            try {
                // Fetch user data
                const { data: users, error: userError } = await supabase
                    .from("users")
                    .select("id, username, email");

                if (userError) {
                    console.error("Error fetching users:", userError);
                    return;
                }

                // Fetch session data
                const { data: sessions, error: sessionError } = await supabase
                    .from("user_sessions")
                    .select("user_id, is_active, created_at, updated_at");

                if (sessionError) {
                    console.error("Error fetching sessions:", sessionError);
                    return;
                }

                const userListContent = document.getElementById("userListContent");
                userListContent.innerHTML = ""; // Clear previous content

                users.forEach((user) => {
                    const session = sessions.find((s) => s.user_id === user.id);
                    const isActive = session ? (session.is_active ? "Yes" : "No") : "No";
                    const firstSession = session ? new date(session.created_at).toLocaleString() : "N/A";
                    const lastSession = session ? new Date(session.updated_at).toLocaleString() : "N/A";

                    const userCard = document.createElement("div");
                    userCard.className = "user-card";
                    userCard.innerHTML = `
                        <p><strong>Username:</strong> ${user.username}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Active Session:</strong> ${isActive}</p>
                        <p><strong>First Session:</stron> ${firstSession}</p>
                        <p><strong>Last Session:</strong> ${lastSession}</p>
                        <hr>
                    `;

                    userListContent.appendChild(userCard);
                });

                console.log("Users displayed successfully!");
            } catch (error) {
                console.error("Error displaying users:", error);
            }
        });
    } else {
        console.error("showUsersButton not found in the DOM.");
    }
});
