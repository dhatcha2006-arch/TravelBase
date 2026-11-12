function setupRegistrationForm() {
  const form = document.querySelector("#register-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = document.querySelector("#form-message");

    if (!form.reportValidity()) {
      showMessage(
        message,
        "Please complete the required fields with valid information.",
        "error",
      );
      return;
    }

    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirm-password");

    if (password.value.length < 8) {
      showMessage(message, "Use a password with at least 8 characters.", "error");
      password.focus();
      return;
    }

    if (password.value !== confirmPassword.value) {
      showMessage(message, "The passwords do not match.", "error");
      confirmPassword.focus();
      return;
    }

    showMessage(
      message,
      "Your details look good. Account creation will be available when TravelBase connects to its booking service.",
      "success",
    );
  });
}

function setupLoginForm() {
  const form = document.querySelector("#login-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = document.querySelector("#form-message");

    if (!form.reportValidity()) {
      showMessage(
        message,
        "Enter a valid email address and password to continue.",
        "error",
      );
      return;
    }

    showMessage(
      message,
      "This frontend demo does not authenticate users yet. Connect the Flask service to enable customer and admin sign-in.",
      "error",
    );
  });
}

function setupPasswordRecoveryLink() {
  const link = document.querySelector("#forgot-password");

  if (!link) {
    return;
  }

  link.addEventListener("click", (event) => {
    event.preventDefault();
    showMessage(
      document.querySelector("#form-message"),
      "Password recovery will be available when the account service is connected.",
      "error",
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupRegistrationForm();
  setupLoginForm();
  setupPasswordRecoveryLink();
});
