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
    loader.style.backgroundColor = "rgba(0,0,0,0.5)";
    loader.style.display = "flex";
    loader.style.alignItems = "center";
    loader.style.justifyContent = "center";
    loader.innerHTML = "<div style='color: white; font-size: 24px;'>Loading...</div>";
    document.body.appendChild(loader);
  }

  // Wait for 5 seconds (5000 milliseconds) before redirecting
  setTimeout(function() {
    window.location.href = destination; // Change the page
  }, 5000);
}
