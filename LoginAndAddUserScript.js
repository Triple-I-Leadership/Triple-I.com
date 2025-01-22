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

document.getElementById("loginButton").addEventListener("click", async function () {
  const identifier = document.getElementById("emailOrUsername").value; // Input field for email or username
  const password = document.getElementById("password").value;

  try {
    let email = identifier;

    // Check if the identifier is not an email (assume it's a username)
    if (!identifier.includes("@")) {
      // Fetch the email corresponding to the username
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("email")
        .eq("username", identifier)
        .single();

      if (userError || !user) {
        console.error("Error fetching email by username:", userError?.message || "No user found");
        alert("Invalid username or email!");
        return;
      }

      email = user.email; // Replace the identifier with the retrieved email
    }

    // Authenticate the user with the resolved email
    const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (loginError) {
      console.error("Login error:", loginError.message);
      alert("Invalid email/username or password!");
      return;
    }

    // Fetch user details based on the logged-in user's ID
    const { data: userRole, error: roleError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", session.user.id)
      .single();

    if (roleError) {
      console.error("Error fetching user role:", roleError.message);
      alert("Could not determine user role!");
      return;
    }

    // Normalize role to lowercase for case-insensitivity
    const role = userRole.role.toLowerCase();

    // Redirect based on role
    if (role === "officer") {
      window.location.href = "Dashboard.html";
    } else if (role === "member") {
      window.location.href = "index.html";
    } else {
      console.error("Unknown role:", userRole.role);
      alert("Role not recognized!");
    }
  } catch (error) {
    console.error("Error logging in:", error.message);
    alert("Something went wrong during login!");
  }
});

