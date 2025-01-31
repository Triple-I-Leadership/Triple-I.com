import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to add the user to your `users` table (optional)
  async function addUserToDatabase(username, email) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        { username: username, email: email }
      ]);

    if (error) {
      console.error('Error adding user to database:', error);
    } else {
      console.log('User added to users table:', data);
      alert('User added successfully!');
    }
  };

const hashParams = new URLSearchParams(window.location.hash.substring(1));
const accessToken = hashParams.get('access_token');
const refreshToken = hashParams.get('refresh_token');
const expiresIn = hashParams.get('expires_in');

console.log("Access Token: ", accessToken);
console.log("Refresh Token: ", refreshToken);
console.log("Expires In: ", expiresIn);

// Use the token to sign in
if (accessToken) {
  supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
    .then(() => {
      console.log("Authenticated with Supabase successfully!");
    })
    .catch((error) => {
      console.error("Error during authentication:", error);
    });
}
      alert('User added successfully!');
    }
  }
export async function checkSession() {
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
        // Handle form submission
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const { user, session, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                document.getElementById('errorMessage').innerText = error.message;
            } else {
                console.log('User logged in:', user);
                window.location.href = 'Dashboard.html'
            }
        });


