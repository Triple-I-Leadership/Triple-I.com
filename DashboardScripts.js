// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function showUsers() {
  try {
    // Fetch all users from the 'users' table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username, email');
    if (usersError) throw usersError;

    console.log('Users:', users); // Debugging log

    // Fetch active session data from the 'user_sessions' table
    const { data: sessions, error: sessionsError } = await supabase
      .from('user_sessions')
      .select('user_id, is_active, created_at');
    if (sessionsError) throw sessionsError;

    console.log('Sessions:', sessions); // Debugging log

    // Get the table body element
    const userTableBody = document
      .getElementById('userTable')
      .getElementsByTagName('tbody')[0];

    // Clear existing table rows
    userTableBody.innerHTML = '';

    // Combine user and session data and render it in the table
    users.forEach(user => {
      const session = sessions.find(s => s.user_id === user.id);
      const isActive = session ? session.is_active : false;
      const sessionStartTime = session ? session.created_at : 'N/A';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${isActive ? 'Yes' : 'No'}</td>
        <td>${sessionStartTime}</td>
      `;
      userTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching or displaying users:', error);
  }
}

async function checkSession() {
  // Get the current session from Supabase
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("Error getting session:", sessionError);
    return;
  }

  if (sessionData.session) {
    console.log('User is logged in:', sessionData.session.user);

    // Extract user information
    const userId = sessionData.session.user.id;

    try {
      // Insert or update the session in the 'user_sessions' table
      const { data, error } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: userId,
          is_active: true,
          updated_at: new Date().toISOString(), // Use ISO string for timestamp
        });

      if (error) {
        console.error("Error inserting/updating session:", error);
      } else {
        console.log("Session updated for user:", data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  } else {
    console.log('No user is logged in');
    
    // Redirect to login page if no user is logged in
    window.location.href = 'login.html';
  }
}
window.onload = checkSession();
