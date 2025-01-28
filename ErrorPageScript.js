    // Function to handle errors and redirect to the error page
    function handleError(error) {
      console.error(error); // Log the error to the console for debugging

      // Prepare error details
      const errorDetails = {
        message: error.message || "An unknown error occurred.",
        stack: error.stack || "No stack trace available.",
      };

      // Store error details in sessionStorage for retrieval on the error page
      sessionStorage.setItem("errorDetails", JSON.stringify(errorDetails));

      // Redirect to the error page
      window.location.href = "ErrorPage.html";
    }

    // Function to simulate an error
    function triggerError() {
      try {
        // Example: Intentionally throw an error
        throw new Error("This is a sample error!");
      } catch (error) {
        handleError(error);
      }
    }

    // Retrieve error details from sessionStorage
const errorDetails = JSON.parse(sessionStorage.getItem("errorDetails"));

if (errorDetails) {
      // Display the error details on the page
  document.getElementById("errorDetails").innerHTML = `
  <p><strong>Message:</strong> ${errorDetails.message}</p>
  <p><strong>Stack Trace:</strong><pre>${errorDetails.stack}</pre></p>
      `;
    } else {
      // Fallback if no error details are found
document.getElementById("errorDetails").innerText = "No error details available.";
    }
