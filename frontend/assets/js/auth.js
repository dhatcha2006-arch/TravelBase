async function submitToFlask(form, url, message) {
  try {
    const tokenResponse = await fetch("/csrf-token", { credentials: "same-origin" });
    const { token } = await tokenResponse.json();
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRF-Token": token,
      },
      body: new URLSearchParams(new FormData(form)),
    });
    if (new URL(response.url).searchParams.has("error")) {
      showMessage(message, "That didn't work. Check your details and try again.", "error");
      return;
    }
    window.location.href = response.url;
  } catch (error) {
    showMessage(message, "Could not reach the server. Is it running?", "error");
  }
}

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

    submitToFlask(form, "/register", message);
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

    submitToFlask(form, "/login", message);
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
