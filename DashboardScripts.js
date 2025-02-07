import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById("showUsersButton").addEventListener("click", fetchUsers);

let users = [];

async function fetchUsersMultipleTimes(attempts = 3, delay = 500) {
  let allUsers = [];

  for (let i = 0; i < attempts; i++) {
    console.log(`Fetching users (Attempt ${i + 1}/${attempts})...`);

    const { data, error } = await supabase
      .from("users")
      .select("id, username, email, role");

    if (error) {
      console.error(`Error fetching users on attempt ${i + 1}:`, error);
      continue; // Skip this attempt and try again
    }

    if (data.length > 0) {
      allUsers = [...new Map([...allUsers, ...data].map(user => [user.id, user])).values()];
    }

    await new Promise(resolve => setTimeout(resolve, delay)); // Wait before next attempt
  }

  if (allUsers.length === 0) {
    console.warn("No users found after multiple attempts.");
  } else {
    console.log("Final Users List:", allUsers);
  }

  users = allUsers;
  renderUsers();
}


function renderUsers() {
  console.log("Rendering Users:", users); // Debugging log

  if (users.length === 0) {
    console.warn("No users to display.");
  }

  const container = document.getElementById("userContainer");
  container.style.display = 'block'; // Show the container after rendering users
  container.innerHTML = `
    <table border="1" class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody border="1">
        ${users.map(user => `
          <tr class="${getRoleClass(user.role)}">
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  console.log("Users displayed successfully.");
}

function getRoleClass(role) {
  if (role.toLowerCase() === "officer") return "officer-user";
  if (role.toLowerCase() === "member") return "member-user";
  return "regular-user";
}

document.head.insertAdjacentHTML('beforeend', `
  <style>
    .user-table {
      width: 100%;
      border-collapse: collapse;
    }
    .user-table th, .user-table td {
      border: 1px solid black;
      padding: 8px;
      text-align: left;
    }
    .officer-user { background-color: red; color: white; }
    .member-user { background-color: orange; color: black; }
    .regular-user { background-color: blue; color: white; }
    #userContainer {
      display: none; /* Initially hide the user container */
    }
  </style>
`);
