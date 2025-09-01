import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

async function getSupabaseConfig() {
    const res = await fetch('/.netlify/functions/ServerlessFunctions.js');
    const { url, key } = await res.json();
    console.log('Supabase URL:', url);
    console.log('Supabase Key:', key);
  
    // Now you can initialize your client
    const supabase = createClient(url, key);
    return supabase;
};
  
await getSupabaseConfig();
  

const pointsTableBody = document.getElementById("pointsTableBody");

// ✅ Fetch Users from Supabase
async function fetchUsers() {
    const { data, error } = await supabase
        .from("users")
        .select("id, username, email, points, role")
        .order("username", { ascending: true });

    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    pointsTableBody.innerHTML = ""; // Clear table

    data.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.points}</td>
            <td>${user.role}</td>
            <td>
                <button class="edit-btn" onclick="editPoints('${user.id}', ${user.points})">Edit</button>
                <button class="delete-btn" onclick="deleteUser('${user.id}')">Delete</button>
            </td>
        `;

        pointsTableBody.appendChild(row);
    });
}

// ✅ Edit Points
window.editPoints = async function (id, currentPoints) {
    const newPoints = prompt("New Point Count:", currentPoints);
    if (newPoints === null || isNaN(newPoints)) return;

    const { error } = await supabase
        .from("users")
        .update({ points: newPoints })
        .eq("id", id);

    if (error) {
        console.error("Error updating points:", error);
        return;
    }

    alert("Points updated successfully!");
    fetchUsers(); // Refresh table
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
    fetchUsers(); // Refresh table
};

// ✅ Load Users on Page Load
fetchUsers();

document.getElementById("Go_Back").addEventListener("click", function () {
    window.location.href = 'Dashboard.html';
});
