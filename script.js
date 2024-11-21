function showloader(destination) {
  // Create a loading div if it doesn't exist
  if (!document.getElementById("loading-screen")) {
    var loader = document.createElement("div");
    loader.id = "loading-screen";
    loader.style.position = "fixed";
    loader.style.top = "0";
    loader.style.left = "0";
    loader.style.width = "100%";
    loader.style.height = "100%";
    loader.style.backgroundColor = "rgba(75,156,211,1)";
    loader.style.display = "flex";
    loader.style.alignItems = "center";
    loader.style.justifyContent = "center";
    loader.innerHTML = "<div style='color: white; font-size: 24px;'>Loading...</div>";
    document.body.appendChild(loader);
  }

  // Wait for 5 seconds (5000 milliseconds) before redirecting
  setTimeout(function() {
    window.location.href = destination; // Change the page
  }, 1250);
}
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

document.getElementById('next').addEventListener('click', function() {
    changeSlide(1);
});

document.getElementById('prev').addEventListener('click', function() {
    changeSlide(-1);
});

function changeSlide(direction) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Optional: Automatically change slides every 5 seconds
setInterval(() => {
    changeSlide(1);
}, 5000);

async function checkSession() {
  // Get the current session from Supabase
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("Error getting session:", sessionError);
    return;
  }

  if (sessionData.session) {
    console.log('User is logged in:', sessionData.session.user);

    // Extract user information
    const userId = sessionData.session.user.id;

    try {
      // Insert or update the session in the 'user_sessions' table
      const { data, error } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: userId,
          is_active: true,
          updated_at: new Date().toISOString(), // Use ISO string for timestamp
        });

      if (error) {
        console.error("Error inserting/updating session:", error);
      } else {
        console.log("Session updated for user:", data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  } else {
    console.log('No user is logged in');
    
    // Redirect to login page if no user is logged in
    window.location.href = 'login.html';
  }
}
window.onload = checkSession()
