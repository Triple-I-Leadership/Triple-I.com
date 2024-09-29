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
        // Handle form submission
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const { user, session, error } = await supabase.auth.signIn({
                email: email,
                password: password,
            });

            if (error) {
                document.getElementById('errorMessage').innerText = error.message;
            } else {
                console.log('User logged in:', user);
                window.location.href = 'index.html'
            }
        });
