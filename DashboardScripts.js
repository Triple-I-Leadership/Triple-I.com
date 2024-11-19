// Initialize Supabase client
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-anon-key';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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
      .from('usersessions')
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
window.onload = checkSession();
