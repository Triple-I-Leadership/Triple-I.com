import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your actual key
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    
    if (form) {
        form.addEventListener('submit', handleSignup);
    } else {
        console.error("Form element not found!");
    }
});

async function handleSignup(event) {
    event.preventDefault(); // Prevents default form submission behavior

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Clear messages
    errorMessage.textContent = '';
    successMessage.textContent = '';

    if (!username || !email || !password) {
        errorMessage.textContent = 'All fields are required.';
        return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
    });

    if (signUpError) {
        errorMessage.textContent = `Sign-up failed: ${signUpError.message}`;
    } else {
        console.log('User signed up successfully:', signUpData);

        const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert([{ id: signUpData.user.id, username, email }]);

        if (insertError) {
            errorMessage.textContent = `Failed to add user to table: ${insertError.message}`;
        } else {
            successMessage.textContent = 'Sign-up successful! Redirecting...';
            setTimeout(() => {
                window.location.href = 'Dashboard.html';
            }, 2000);
        }
    }
}
