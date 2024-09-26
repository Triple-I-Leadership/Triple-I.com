  // Initialize Supabase client
  const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function handleSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Call the function to add the user with the email and password to Supabase Auth
    await signUpUser(username, email, password);
  }
  // Function to sign up a user with Supabase Auth
  async function signUpUser(username, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      console.error('Error signing up user:', error.message);
      alert('Failed to sign up user: ' + error.message);
    } else {
      console.log('User signed up:', data);

      // Now you can also store the username (alongside email) in the `users` table
      await addUserToDatabase(username, email);
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
