// Define the global error handler
window.onerror = function (message, source, lineno, colno, error) {
  console.error(`Error: ${message} at ${source}:${lineno}:${colno}`, error);

  // Store the error details in sessionStorage
  const errorDetails = {
    message,
    source,
    lineno,
    colno,
    stack: error?.stack || "No stack trace available",
  };
  sessionStorage.setItem("errorDetails", JSON.stringify(errorDetails));

  // Redirect to the error page
  window.location.href = "error.html";
};

// Retrieve error details from sessionStorage
    const errorDetails = JSON.parse(sessionStorage.getItem("errorDetails"));

    if (errorDetails) {
      const errorElement = document.getElementById("errorDetails");
      errorElement.innerText = `
        Message: ${errorDetails.message}
        Source: ${errorDetails.source}
        Line: ${errorDetails.lineno}
        Column: ${errorDetails.colno}
        Stack: ${errorDetails.stack}
      `;
    } else {
      document.getElementById("errorDetails").innerText = "No error details available.";
    }
