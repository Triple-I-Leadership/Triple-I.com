import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ✅ Initialize Supabase Client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg'; // 🚨 Replace with environment variable in production!
const supabase = createClient(supabaseUrl, supabaseKey);

const userTableBody = document.getElementById("userTableBody");

// ✅ Fetch Users from Supabase
async function fetchUsers() {
    const { data, error } = await supabase
        .from("users") // Adjust table name if needed
        .select("id, username, email, role") // Fetch user details
        .order("username", { ascending: true });

    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    userTableBody.innerHTML = ""; // Clear previous entries

    data.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role || "User"}</td>
            <td>
                <button class="edit-btn" onclick="editUser(${user.id}, '${user.username}', '${user.email}', '${user.role}')">Edit</button>
                <button class="reset-btn" onclick="resetUserPassword('${user.id}')">Reset Password</button>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;

        userTableBody.appendChild(row);
    });
}

// ✅ Edit User
window.editUser = async function (id, currentUsername, currentEmail, currentRole) {
    const newUsername = prompt("Edit Username:", currentUsername);
    if (!newUsername) return;

    const newEmail = prompt("Edit Email:", currentEmail);
    if (!newEmail) return;

    const newRole = prompt("Edit Role (admin/user):", currentRole);
    if (!newRole) return;

    const { error } = await supabase
        .from("users")
        .update({ username: newUsername, email: newEmail, role: newRole })
        .eq("id", id);

    if (error) {
        console.error("Error updating user:", error);
        return;
    }

    alert("User updated successfully!");
    fetchUsers(); // Refresh list
};

// ✅ Securely Reset User Password
window.resetUserPassword = async function (userId) {
    if (!confirm("Are you sure you want to reset this user's password?")) return;

    const { data, error } = await supabase.rpc("reset_user_password", { target_user_id: userId });

    if (error || !data || !data.temp_password) {
        alert("Failed to reset password.");
        return;
    }

    // Show temporary password in a modal for a few seconds
    const tempPassword = data.temp_password;
    
    const passwordDisplay = document.createElement("div");
    passwordDisplay.innerHTML = `
        <div id="passwordModal" style="
            position: fixed; 
            top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 15px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.2);
            text-align: center; z-index: 1000;">
            <p><strong>Temporary Password:</strong></p>
            <p style="font-size: 18px; font-weight: bold; color: red;">${tempPassword}</p>
            <p>This password will disappear in 10 seconds.</p>
        </div>
    `;
    
    document.body.appendChild(passwordDisplay);

    // Hide the modal after 10 seconds
    setTimeout(() => {
        document.getElementById("passwordModal").remove();
    }, 10000);
};

// ✅ Delete User
window.deleteUser = async function (id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting user:", error);
        return;
    }

    alert("User deleted successfully!");
    fetchUsers(); // Refresh list
};

// ✅ Load Users on Page Load
fetchUsers();

document.getElementById("Go_Back").addEventListener("click", function() {
    window.location.href = '../pages/Dashboard.html';
});
