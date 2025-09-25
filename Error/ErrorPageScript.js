// GlobalErrorHandler.js

// Function to handle errors and redirect to the error page
function handleError(error) {
  console.error(error); // Log the error to the console for debugging

  const errorDetails = {
    code: error?.code || "No Error Code found.",
    message: error?.message || "An unknown error occurred.",
    stack: error?.stack || "No stack trace available.",
  };

  sessionStorage.setItem("errorDetails", JSON.stringify(errorDetails));
  window.location.href = "ErrorPage.html";
}

// Function to retrieve and display error details (to use on ErrorPage.html)
function displayStoredError(targetElementId = "errorDetails") {
  const container = document.getElementById(targetElementId);
  const errorDetails = JSON.parse(sessionStorage.getItem("errorDetails"));

  if (errorDetails && container) {
    container.innerHTML = `
      <p><strong>Error Code:</strong> ${errorDetails.code}</p>
      <p><strong>Message:</strong> ${errorDetails.message}</p>
      <p><strong>Stack Trace:</strong><pre>${errorDetails.stack}</pre></p>
    `;
  } else if (container) {
    container.innerText = "No error details available.";
  }
}

// Optional: Catch global JS errors
window.addEventListener("error", (e) => {
  handleError(e.error || new Error("An unexpected global error occurred."));
});

// Optional: Catch unhandled promise rejections
window.addEventListener("unhandledrejection", (e) => {
  handleError(e.reason || new Error("An unhandled promise rejection occurred."));
});
