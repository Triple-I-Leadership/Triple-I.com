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

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Attempt to log in the user
        const { user, session, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            document.getElementById('errorMessage').innerText = error.message;
            return;
        }

        // Fetch user role from your database
        const { data: users, error: roleError } = await supabase
            .from("users")
            .select("Role")
            .eq("email", email)
            .single();

        if (roleError || !users) {
            console.error("Error fetching role:", roleError || "No user data found");
            document.getElementById('errorMessage').innerText = "Failed to fetch user role. Please try again.";
            return;
        }

        // Redirect based on the role
        const role = users.Role;
        console.log("User role:", role);

        if (role === "Officer") {
            window.location.href = "Dashboard.html";
        } else if (role === "Member") {
            window.location.href = "MemberPage.html"; // Change this to the correct member page
        } else {
            document.getElementById('errorMessage').innerText = "Unknown role. Please contact support.";
        }
    } catch (err) {
        console.error("Unexpected error during login:", err);
        document.getElementById('errorMessage').innerText = "An unexpected error occurred.";
    }
});

