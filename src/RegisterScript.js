import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://fvypinxntxcpebvrrqpv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg";
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registerForm").addEventListener("submit", handleSignup);
});

async function handleSignup(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
    });

    const {error: signUpError } = await supabase.from("users").insert({
        email,
        username
    });
    
    if (signUpError) {
        console.error("Sign-up error:", signUpError.message);
        alert("Sign-up failed: " + signUpError.message);
        return;
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the code in Supabase
    const { error: insertError } = await supabase.from("verification_codes").insert([
        {
            user_id: signUpData.user.id,
            code: verificationCode,
            expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // Expires in 15 mins
        }
    ]);

    if (insertError) {
        console.error("Error storing verification code:", insertError.message);
        alert("Failed to generate verification code.");
        return;
    }

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    // Redirect to the verification page
    window.location.href = `Verification.html?email=${encodeURIComponent(email)}`;
}

async function sendVerificationEmail(email, code) {
    const { error } = await supabase.auth.api.sendMagicLinkEmail(email, {
        subject: "Verify Your Account",
        html: `<p>Your verification code is: <strong>${code}</strong></p><p>It expires in 15 minutes.</p>`,
    });

    if (error) {
        console.error("Error sending verification email:", error.message);
        alert("Failed to send verification email.");
    } else {
        console.log("Verification email sent successfully.");
    }
}
