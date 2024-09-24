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

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // For demo purposes, let's assume a static username and password
    const validUsername = 'admin';
    const validPassword = 'password123';

    if (username === validUsername && password === validPassword) {
        alert('Login successful!');
        window.location.href = 'index.html'
    } else {
        document.getElementById('error-message').textContent = 'Invalid username or password.';
    }
});

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
