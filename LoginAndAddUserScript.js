  // Initialize Supabase client
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
  const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  window.onload = function() {
    document.getElementById('signupForm').addEventListener('submit', handleSignup);

    async function handleSignup(event) {
      console.log("Form submitted, preventing default...");
      event.preventDefault();

      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      await signUpAndAddUser(username, email, password);
    }
    async function signUpAndAddUser(username, email, password) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password
      });

      if (signUpError) {
        console.error('Error during sign-up:', signUpError.message);
        alert('Sign-up failed: ' + signUpError.message);
      } else {
        console.log('User signed up successfully:', signUpData);

        const { data: insertData, error: insertError } = await supabase
          .from('users')
          .insert([{ id: signUpData.user.id, username: username, email: email }]);

        if (insertError) {
          console.error('Error adding user to table:', insertError.message);
          alert('Failed to add user to table: ' + insertError.message);
        } else {
          console.log('User added to the users table:', insertData);
          alert('Sign-up successful and user added to the table!');
        }
      }
    }
  }
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
  }
  async function checkSession() {
    const { data, error } = await supabase.auth.getSession();
    
    if (data.session) {
      console.log('User is logged in:', data.session.user);
      // You can now access the user's info and render it on the page
    } else {
      console.log('No user is logged in');
      // Redirect to login page if no user is logged in
      window.location.href = 'login.html';
    }
  }

  // Call the checkSession function when the page loads
  window.onload = checkSession;
  // Function to log in a user
  async function loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error('Login failed:', error.message);
      alert('Login failed: ' + error.message);
    } else {
      console.log('User logged in:', data);
      alert('Login successful!');

      // Redirect the user to a new page or perform any other action
      window.location.href = 'WelcomePageMember.html';  // Example redirect after successful login
    }
  }
