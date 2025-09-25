import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Grab form elements
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const settingsForm = document.querySelector('form');
const submitButton = settingsForm.querySelector('button');

// Validation state
const validation = {
  username: false,
  email: false,
  password: false
};

// Enable or disable submit button
function updateSubmitButton() {
  submitButton.disabled = !Object.values(validation).some(v => v === true);
}

// --- Username Validation ---
usernameInput.addEventListener('input', async () => {
  const value = usernameInput.value.trim();
  if (!value) {
    usernameInput.style.borderColor = 'red';
    validation.username = false;
  } else {
    // Check if username exists in users table
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', value)
      .limit(1);

    if (error || data.length > 0) {
      usernameInput.style.borderColor = 'red';
      validation.username = false;
    } else {
      usernameInput.style.borderColor = 'green';
      validation.username = true;
    }
  }
  updateSubmitButton();
});

// --- Email Validation ---
emailInput.addEventListener('input', () => {
  const value = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(value)) {
    emailInput.style.borderColor = 'green';
    validation.email = true;
  } else {
    emailInput.style.borderColor = 'red';
    validation.email = false;
  }
  updateSubmitButton();
});

// --- Password Validation ---
passwordInput.addEventListener('input', () => {
  const value = passwordInput.value.trim();
  // Password must be at least 8 chars, include a number and a letter
  const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (strongPassword.test(value)) {
    passwordInput.style.borderColor = 'green';
    validation.password = true;
  } else {
    passwordInput.style.borderColor = 'red';
    validation.password = false;
  }
  updateSubmitButton();
});

// --- Form Submission ---
settingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) return alert('Error fetching user: ' + userError.message);

  const uuid = user.id;

  // Update username
  if (validation.username) {
    const { error } = await supabase
      .from('users')
      .update({ username: usernameInput.value.trim() })
      .eq('id', uuid);
    if (error) return alert('Username update failed: ' + error.message);
  }

  // Update email
  if (validation.email) {
    const { error } = await supabase.auth.updateUser({ email: emailInput.value.trim() });
    if (error) return alert('Email update failed: ' + error.message);
  }

  // Update password
  if (validation.password) {
    const { error } = await supabase.auth.updateUser({ password: passwordInput.value.trim() });
    if (error) return alert('Password update failed: ' + error.message);
  }

  alert('Settings updated successfully!');
  settingsForm.reset();
  usernameInput.style.borderColor = '';
  emailInput.style.borderColor = '';
  passwordInput.style.borderColor = '';
  validation.username = false;
  validation.email = false;
  validation.password = false;
  updateSubmitButton();
});
