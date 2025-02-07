import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById("showUsersButton").addEventListener("click", fetchUsers);

let users = [];

async function fetchUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .limit(1000);

  if (error) {
    console.error("Error fetching users:", error);
    return;
  }

  console.log("Fetched Users:", data); // Debugging log

  users = data.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  }));

  renderUsers();
}

function renderUsers() {
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
