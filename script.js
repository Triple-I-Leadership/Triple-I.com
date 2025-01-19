import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// Initialize Supabase client
const supabaseUrl = 'https://fvypinxntxcpebvrrqpv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eXBpbnhudHhjcGVidnJycXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMTAyMDksImV4cCI6MjA0Mjg4NjIwOX0.Njr9v6k_QjA4ocszgB6SaPBauKvA4jNQSUj1cdOXCDg';
const supabase = createClient(supabaseUrl, supabaseKey);

window.showloader = function(destination) {
  // Create a loading div if it doesn't exist
  if (!document.getElementById("loading-screen")) {
    const loader = document.createElement("div");
    loader.id = "loading-screen";
    loader.style.position = "fixed";
    loader.style.top = "0";
    loader.style.left = "0";
    loader.style.width = "100%";
    loader.style.height = "100%";
    loader.style.backgroundColor = "rgba(135,206,235,1)";
    loader.style.zIndex = "9999";
    loader.style.overflow = "hidden";

    // Add animated clouds and plane
    loader.innerHTML = `
      <div class="clouds">
        <div class="cloud"></div>
        <div class="cloud"></div>
        <div class="cloud"></div>
      </div>
      <div class="plane-container">
        <img src="imgs/Jet.png" alt="Plane" class="plane" />
        <div class="contrail"></div>
      </div>
    `;

    document.body.appendChild(loader);

    // Add CSS styles dynamically for the animation
    const style = document.createElement("style");
    style.innerHTML = `
      
      .clouds {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 1;
      }
      .cloud {
        position: absolute;
        width: 150px;
        height: 80px;
        background: black;
        border-radius: 50%;
        opacity: 0.7;
        animation: moveClouds 6s linear infinite;
      }
      .cloud:nth-child(1) {
        top: 20%;
        left: -20%;
        animation-duration: 10s;
      }
      .cloud:nth-child(2) {
        top: 50%;
        left: -30%;
        animation-duration: 15s;
      }
      .cloud:nth-child(3) {
        top: 70%;
        left: -25%;
        animation-duration: 12s;
      }
      @keyframes moveClouds {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(110%);
        }
      }
      .plane-container {
        position: absolute;
        top: 50%;
        left: -10%;
        transform: translateY(-50%);
        animation: flyPlane 5s linear forwards;
        z-index: 2;
      }
      .plane {
        width: 100px;
      }
      @keyframes flyPlane {
        from {
          left: -10%;
        }
        to {
          left: 110%;
        }
      }
      .contrail {
        position: absolute;
        width: 10px;
        height: 100%;
        background: rgba(0, 0, 0, 1);
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        animation: fadeContrail 2s linear forwards;
      }
      @keyframes fadeContrail {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Wait for 1.5 seconds before redirecting
  setTimeout(function () {
    window.location.href = destination; // Change the page
  }, 1500);
};

// Slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

document.getElementById('next').addEventListener('click', function () {
  changeSlide(1);
});

document.getElementById('prev').addEventListener('click', function () {
  changeSlide(-1);
});

function changeSlide(direction) {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
}

// Automatically change slides every 5 seconds
setInterval(() => {
  changeSlide(1);
}, 5000);

// Check Supabase session
async function checkSession() {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error getting session:", sessionError);
    return;
  }

  if (sessionData.session) {
    console.log("User is logged in:", sessionData.session.user);

    const userId = sessionData.session.user.id;

    try {
      const { data, error } = await supabase
        .from("user_sessions")
        .upsert({
          user_id: userId,
          is_active: true,
          updated_at: new Date().toISOString(),
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
    console.log("No user is logged in");
    window.location.href = "LoginPage.html";
  }
}

window.onload = checkSession;
