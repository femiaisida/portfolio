// email-sender.js

// Wait for the DOM to be fully loaded before attaching events
document.addEventListener("DOMContentLoaded", function() {
  // Reference form fields and the send button
  const toInput = document.getElementById("toInput");
  const subjectInput = document.getElementById("subjectInput");
  const bodyInput = document.getElementById("bodyInput");
  const sendButton = document.getElementById("sendButton");

  sendButton.addEventListener("click", function() {
    // Retrieve values from input fields, trimming any extra whitespace
    const to = toInput.value.trim();
    const subject = subjectInput.value.trim();
    const body = bodyInput.value.trim();

    // Basic validation to ensure no field is empty
    if (!to || !subject || !body) {
      alert("Please fill in all fields");
      return;
    }

    // Prepare the parameters for EmailJS.
    // Adding 'reply_to' will instruct the email's reply header to use the user's email.
    const templateParams = {
      to_email: to,        // The user-entered recipient address
      subject: subject,    // The subject provided by the user
      message: body,       // The body message entered by the user
      reply_to: to         // Sets the reply-to header to the user's email
    };

    // Send the email using EmailJS.
    emailjs.send('service_pliykwl', 'template_y206pdt', templateParams)
      .then(function(response) {
        console.log("SUCCESS!", response.status, response.text);
        alert("Email sent successfully!");
        // Reset form fields on success
        toInput.value = "";
        subjectInput.value = "";
        bodyInput.value = "";
      }, function(error) {
        console.log("FAILED...", error);
        alert("Failed to send email. Please try again later.");
      });
  });
});