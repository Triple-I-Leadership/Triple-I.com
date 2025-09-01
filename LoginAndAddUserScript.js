import supabase from "./supabase.js";

const hashParams = new URLSearchParams(window.location.hash.substring(1));
const accessToken = hashParams.get('access_token');
const refreshToken = hashParams.get('refresh_token');
const expiresIn = hashParams.get('expires_in');

console.log("Access Token: ", accessToken);
console.log("Refresh Token: ", refreshToken);
console.log("Expires In: ", expiresIn);

if (accessToken) {
  supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
    .then(() => {
      console.log("Authenticated with Supabase successfully!");
    })
    .catch((error) => {
      console.error("Error during authentication:", error);
    });
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userInput = document.getElementById('userInput').value;
  const password = document.getElementById('password').value;

  let email = userInput;

  if (!userInput.includes('@')) {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('username', userInput)
      .single();

    if (error || !data) {
      document.getElementById('errorMessage').innerText = 'Invalid username or email.';
      return;
    }

    email = data.email;
  }

  const { data: loginData, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  
    if (error) {
      document.getElementById('errorMessage').innerText = error.message;
      return;
    }
  
    const user = loginData.user;
    console.log("Logged in user:", user);
    
    const { data, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id) // pass the actual ID!
      .single();


    if (roleError || !data) {
      console.error("Failed to fetch user role:", roleError?.message);
      document.getElementById('errorMessage').innerText = "Unable to verify user role.";
      return;
    }

    const role = data.role.toLowerCase();

    if (role === "advisor" || role === "officer") {
      window.location.href = "Dashboard.html";
    } else {
      window.location.href = "Profile.html";
    }
  }); // <- make sure this closing brace exists!
