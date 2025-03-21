import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://fvypinxntxcpebvrrqpv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg";
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");

    document.getElementById("verifyForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const verificationCode = document.getElementById("verificationCode").value;

        // Get user ID from email
        const { data: userData, error: userError } = await supabase
            .from("auth.users")
            .select("id")
            .eq("email", email)
            .single();

        if (userError || !userData) {
            console.error("User not found:", userError?.message);
            document.getElementById("message").textContent = "User not found.";
            return;
        }

        const userId = userData.id;

        // Check if the code exists and is still valid
        const { data: codeData, error: codeError } = await supabase
            .from("verification_codes")
            .select("*")
            .eq("user_id", userId)
            .eq("code", verificationCode)
            .gte("expires_at", new Date().toISOString())
            .single();

        if (codeError || !codeData) {
            console.error("Invalid or expired code");
            document.getElementById("message").textContent = "Invalid or expired code.";
            return;
        }

        console.log("User verified successfully!");
        document.getElementById("message").textContent = "Account verified! Redirecting...";
        
        // Delete the used verification code
        await supabase.from("verification_codes").delete().eq("id", codeData.id);

        // Redirect to login page
        setTimeout(() => {
            window.location.href = "Dashboard.html";
        }, 2000);
    });
});
