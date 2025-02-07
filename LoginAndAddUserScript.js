import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);
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
    const userInput = document.getElementById('userInput').value;
    const password = document.getElementById('password').value;

    let email = userInput;

    // Check if the user entered a username instead of an email
    if (!userInput.includes('@')) {
        // Look up the user by username in Supabase
        const { data, error } = await supabase
            .from('users')  // Adjust table name if necessary
            .select('email')
            .eq('username', userInput)
            .single();

        if (error || !data) {
            document.getElementById('errorMessage').innerText = 'Invalid username or email.';
            return;
        }

        // Use the retrieved email for authentication
        email = data.email;
    }

    // Sign in with email/password
    const { user, session, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        document.getElementById('errorMessage').innerText = error.message;
    } else {
        console.log('User logged in:', user);
        window.location.href = 'Dashboard.html';
    }
});
