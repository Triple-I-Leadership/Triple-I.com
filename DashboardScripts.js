import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch and display users
async function fetchUsers() {
  // Get users from Supabase
  const { data: users, error } = await supabase
    .from('users')
    .select('id, username, email'); // Adjust fields as per your table structure

  if (error) {
    console.error("Error fetching users:", error);
    return;
  }

  // Select the container where users will be displayed
  const userListContainer = document.getElementById('UserList');
  userListContainer.innerHTML = ''; // Clear any existing content

  // Create a list of users
  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.classList.add('user-item');
    userDiv.innerHTML = `
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <button onclick="viewUser(${user.id})">View</button>
    `;
    userListContainer.appendChild(userDiv);
  });
}

// Function to handle viewing user details (optional)
function viewUser(userId) {
  alert(`View details for user with ID: ${userId}`);
}

// Fetch and display users when the page loads
window.onload = fetchUsers;
