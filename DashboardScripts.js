import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

// Add event listener to the button
document.getElementById("showUsersButton").addEventListener("click", async function () {
  try {
    // Fetch user data from Supabase
    const { data: users, error } = await supabase
      .from("users")
      .select("id, username, email, role");

    if (error) {
      console.error("Error fetching users from Supabase:", error);
      return;
    }

    // Create a dictionary to store user data
    const userDictionary = {};
    users.forEach(user => {
      userDictionary[user.id] = {
        username: user.username,
        email: user.email,
        role: user.role
      };
    });

    // Display the user dictionary in a table
    displayUsers(userDictionary);
  } catch (error) {
    console.error("Error fetching or displaying users:", error);
  }
});

// Function to display the user dictionary in a table
function displayUsers(userDictionary) {
  const container = document.getElementById("userContainer");

  // Clear previous content
  container.innerHTML = "";

  // Create a table element
  const table = document.createElement("table");
  table.border = "1";

  // Create table header
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Username</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  `;
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");

  // Loop through the dictionary and add rows
  for (const id in userDictionary) {
    const user = userDictionary[id];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
    `;
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  container.appendChild(table);

  console.log("User dictionary:", userDictionary);
}
