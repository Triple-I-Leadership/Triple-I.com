import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);
/**
 * Check if a user is logged in and update the session.
 * Redirects to login page if no user is found.
 */
async function checkSession() {
  try {
    // Get the current session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error fetching session:', error);
      return;
    }

    if (session) {
      console.log('User is logged in:', session.user);

      // Update or insert session in the database
      const { data, error: upsertError } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: session.user.id,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (upsertError) {
        console.error('Error updating session:', upsertError);
      } else {
        console.log('Session updated successfully:', data);
      }
    } else {
      console.log('No user is logged in.');

      // Redirect to login page
      window.location.href = 'LoginPage.html';
    }
  } catch (err) {
    console.error('Unexpected error in checkSession:', err);
  }
}
/**
 * Event listener for page load to check session.
 */
window.onload = checkSession;

