import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

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
    window.location.href = 'LoginPage.html';
  }
}
  // Call the checkSession function when the page loads
  window.onload = checkSession();
