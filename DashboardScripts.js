import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  const showUsersButton = document.getElementById('showUsersButton');

  // Ensure the button exists before attaching the event listener
  if (showUsersButton) {
    showUsersButton.addEventListener('click', async () => {
      console.log("Show Users button clicked!");
      await fetchAndDisplayUsers();
    });
  }
});

async function fetchAndDisplayUsers() {
  try {
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, username, email');
    const { data: sessions, error: sessionError } = await supabase
      .from('user_sessions')
      .select('user_id, is_active, created_at');

    if (userError || sessionError) {
      console.error("Error fetching data:", userError || sessionError);
      return;
    }

    const userListContent = document.getElementById('userListContent');
    userListContent.innerHTML = ''; // Clear previous content

    users.forEach(user => {
      const session = sessions.find(s => s.user_id === user.id);
      const listItem = document.createElement('li');
      listItem.textContent = `
        Username: ${user.username}, 
        Email: ${user.email}, 
        Is Active: ${session?.is_active || 'No'}, 
        Last Session: ${session?.created_at || 'None'}
      `;
      userListContent.appendChild(listItem);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}
