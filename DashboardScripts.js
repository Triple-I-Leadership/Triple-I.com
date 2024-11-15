

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
