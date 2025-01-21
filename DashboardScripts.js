import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById("showUsersButton").addEventListener("click", async function () {
  try {
    // Fetch user data
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id, username, email, Role");

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

    // Locate the container to display the users
    const tableContainer = document.getElementById("tableContainer");

    // Clear any existing content
    tableContainer.innerHTML = "";

    // Create a table
    const userTable = document.createElement("table");
    userTable.innerHTML = `
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Active Session</th>
          <th>First Session</th>
          <th>Last Session</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(user => {
          const session = sessions.find(s => s.user_id === user.id);
          const isActive = session ? (session.is_active ? "Yes" : "No") : "No";
          const firstSession = session ? new Date(session.created_at).toLocaleString() : "N/A";
          const lastSession = session ? new Date(session.updated_at).toLocaleString() : "N/A";
          
          return `
            <tr>
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td>${user.Role}</td>
              <td>${isActive}</td>
              <td>${firstSession}</td>
              <td>${lastSession}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    `;

    // Add the table to the container
    tableContainer.appendChild(userTable);

    console.log("Users table loaded successfully!");
  } catch (error) {
    console.error("Error displaying users:", error);
  }
});
