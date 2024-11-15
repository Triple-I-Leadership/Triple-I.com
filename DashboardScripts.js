import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to display all users and their session info
async function showUsers() {
  // Fetch all users from the 'users' table
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, username, email'); // Retrieve basic user details

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return;
  }

  // Fetch active session data from the 'user_sessions' table (if any)
  const { data: sessions, error: sessionsError } = await supabase
    .from('UserSessions')
    .select('user_id, is_active, created_at'); // Get active session details

  if (sessionsError) {
    console.error('Error fetching session data:', sessionsError);
    return;
  }

  // Get the user table body
  const userTableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];

  // Clear the existing user list (if any)
  userTableBody.innerHTML = '';

  // Loop through the users and display each user's session status
  users.forEach(user => {
    // Find the active session for this user
    const session = sessions.find(s => s.user_id === user.id);
    const isActive = session ? session.is_active : false; // Check if user has an active session
    const sessionStartTime = session ? session.created_at : 'N/A'; // If no active session, show N/A

    // Create a new row for the user
    const row = document.createElement('tr');

    // Create table data cells for username, email, session active status, and session start time
    const usernameCell = document.createElement('td');
    usernameCell.textContent = user.username;

    const emailCell = document.createElement('td');
    emailCell.textContent = user.email;

    const sessionActiveCell = document.createElement('td');
    sessionActiveCell.textContent = isActive ? 'Yes' : 'No';

    const loginTimeCell = document.createElement('td');
    loginTimeCell.textContent = sessionStartTime;

    // Append all cells to the row
    row.appendChild(usernameCell);
    row.appendChild(emailCell);
    row.appendChild(sessionActiveCell);
    row.appendChild(loginTimeCell);

    // Append the row to the table body
    userTableBody.appendChild(row);
  });
}

// Add event listener to the "Show Users" button
document.getElementById('showUsersBtn').addEventListener('click', showUsers);

async function checkSession() {
  // Get the current session from Supabase
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Error getting session:", error);
    return;
  }

  if (data.session) {
    console.log('User is logged in:', data.session.user);

    // Check if the session already exists in the user_sessions table
    const userId = data.session.user.id;
    
    // Insert or update the session in the 'user_sessions' table
    const { data: sessionData, error: sessionError } = await supabase
      .from('user_sessions')
      .upsert([
        {
          user_id: userId,
          is_active: true,
          updated_at: new Date(),
        }
      ])
      .eq('user_id', userId)
      .single(); // Ensure that only one row is returned

    if (sessionError) {
      console.error("Error inserting/updating session:", sessionError);
    } else {
      console.log("Session updated for user:", sessionData);
    }

    // You can now access the user's info and render it on the page
    // You can fetch additional details if needed using sessionData
  } else {
    console.log('No user is logged in');
    
    // Redirect to login page if no user is logged in
    window.location.href = 'login.html';
  }
}
