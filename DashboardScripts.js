import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
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
      .select('user_id, is_active, updated_at');
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
