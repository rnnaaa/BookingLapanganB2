// Toggle visibility password
function setupPasswordToggle(toggleId, passwordId) {
  const toggle = document.getElementById(toggleId);
  const password = document.getElementById(passwordId);

  toggle.addEventListener("click", function () {
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    toggle.querySelector("i").classList.toggle("fa-eye");
    toggle.querySelector("i").classList.toggle("fa-eye-slash");
  });
}

// Validasi real-time untuk nomor HP
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.startsWith("0")) {
    value = value.substring(1);
  }
  if (value.length > 0) {
    value = "0" + value;
  }
  input.value = value;
}

// Validasi kekuatan password
function checkPasswordStrength(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return strength;
}

function updatePasswordStrengthIndicator(password) {
  const strength = checkPasswordStrength(password);
  let indicator = document.getElementById("passwordStrengthIndicator");

  if (!indicator) {
    indicator = document.createElement("div");
    indicator.id = "passwordStrengthIndicator";
    indicator.className = "password-strength";
    document.getElementById("registerPassword").parentNode.appendChild(indicator);
  }

  // Hapus semua kelas strength
  indicator.classList.remove("password-weak", "password-medium", "password-strong", "password-very-strong");

  if (password.length === 0) {
    indicator.style.width = "0%";
    return;
  }

  if (strength <= 2) {
    indicator.classList.add("password-weak");
  } else if (strength === 3) {
    indicator.classList.add("password-medium");
  } else if (strength === 4) {
    indicator.classList.add("password-strong");
  } else {
    indicator.classList.add("password-very-strong");
  }
}

// Validasi form
function validateField(fieldId, validationFn, feedbackId) {
  const field = document.getElementById(fieldId);
  const isValid = validationFn(field.value);

  if (isValid) {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  } else {
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
  }

  return isValid;
}

// Fungsi validasi untuk setiap field
const validators = {
  name: (value) => value.length >= 3,
  phone: (value) => /^08[0-9]{9,}$/.test(value),
  job: (value) => value && value !== "",
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  address: (value) => value.length >= 10,
  password: (value) => value.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value),
  confirmPassword: (value) => value === document.getElementById("registerPassword").value,
  terms: (value) => document.getElementById("registerTerms").checked,
};

// Event listeners untuk validasi real-time
document.addEventListener("DOMContentLoaded", function () {
  // Setup password toggles
  setupPasswordToggle("toggleRegisterPassword", "registerPassword");
  setupPasswordToggle("toggleRegisterConfirmPassword", "registerConfirmPassword");

  // Validasi real-time untuk setiap field
  document.getElementById("registerName").addEventListener("blur", function () {
    validateField("registerName", validators.name, "nameFeedback");
  });

  document.getElementById("registerPhone").addEventListener("input", function () {
    formatPhoneNumber(this);
    validateField("registerPhone", validators.phone, "phoneFeedback");
  });

  document.getElementById("registerPhone").addEventListener("blur", function () {
    validateField("registerPhone", validators.phone, "phoneFeedback");
  });

  document.getElementById("registerJob").addEventListener("change", function () {
    validateField("registerJob", validators.job, "jobFeedback");
  });

  document.getElementById("registerEmail").addEventListener("blur", function () {
    validateField("registerEmail", validators.email, "emailFeedback");
  });

  document.getElementById("registerAddress").addEventListener("blur", function () {
    validateField("registerAddress", validators.address, "addressFeedback");
  });

  document.getElementById("registerPassword").addEventListener("input", function () {
    updatePasswordStrengthIndicator(this.value);
    validateField("registerPassword", validators.password, "passwordFeedback");

    // Validasi ulang konfirmasi password jika sudah diisi
    if (document.getElementById("registerConfirmPassword").value) {
      validateField("registerConfirmPassword", validators.confirmPassword, "confirmPasswordFeedback");
    }
  });

  document.getElementById("registerPassword").addEventListener("blur", function () {
    validateField("registerPassword", validators.password, "passwordFeedback");
  });

  document.getElementById("registerConfirmPassword").addEventListener("blur", function () {
    validateField("registerConfirmPassword", validators.confirmPassword, "confirmPasswordFeedback");
  });

  document.getElementById("registerTerms").addEventListener("change", function () {
    const isValid = validators.terms();
    if (isValid) {
      this.classList.remove("is-invalid");
    } else {
      this.classList.add("is-invalid");
    }
  });

  // Validasi form register
  document.getElementById("registerFormElement").addEventListener("submit", function (e) {
    e.preventDefault();

    // Validasi semua field
    const isNameValid = validateField("registerName", validators.name, "nameFeedback");
    const isPhoneValid = validateField("registerPhone", validators.phone, "phoneFeedback");
    const isJobValid = validateField("registerJob", validators.job, "jobFeedback");
    const isEmailValid = validateField("registerEmail", validators.email, "emailFeedback");
    const isAddressValid = validateField("registerAddress", validators.address, "addressFeedback");
    const isPasswordValid = validateField("registerPassword", validators.password, "passwordFeedback");
    const isConfirmPasswordValid = validateField("registerConfirmPassword", validators.confirmPassword, "confirmPasswordFeedback");
    const isTermsValid = validators.terms();

    // Validasi terms checkbox
    const termsCheckbox = document.getElementById("registerTerms");
    if (isTermsValid) {
      termsCheckbox.classList.remove("is-invalid");
    } else {
      termsCheckbox.classList.add("is-invalid");
    }

    const alertDiv = document.getElementById("registerAlert");
    const submitButton = document.querySelector('#registerFormElement button[type="submit"]');
    const buttonText = document.getElementById("registerButtonText");
    const spinner = document.getElementById("registerSpinner");

    if (isNameValid && isPhoneValid && isJobValid && isEmailValid && isAddressValid && isPasswordValid && isConfirmPasswordValid && isTermsValid) {
      // Semua valid, tampilkan loading
      alertDiv.classList.add("d-none");
      submitButton.disabled = true;
      buttonText.textContent = "Mendaftarkan...";
      spinner.classList.remove("d-none");

      // Simulasi proses pendaftaran (ganti dengan AJAX call ke backend)
      setTimeout(() => {
        // Simulasi pendaftaran berhasil
        alertDiv.innerHTML = "Pendaftaran berhasil! Anda akan diarahkan ke halaman login.";
        alertDiv.classList.remove("d-none", "alert-danger");
        alertDiv.classList.add("alert-success");

        // Reset form
        document.getElementById("registerFormElement").reset();

        // Reset UI state
        submitButton.disabled = false;
        buttonText.textContent = "Daftar Sekarang";
        spinner.classList.add("d-none");

        // Hapus kelas valid dari semua field
        document.querySelectorAll(".is-valid").forEach((el) => {
          el.classList.remove("is-valid");
        });

        // Hapus indikator kekuatan password
        const indicator = document.getElementById("passwordStrengthIndicator");
        if (indicator) {
          indicator.remove();
        }

        // Redirect ke halaman login setelah 2 detik
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      }, 1500);
    } else {
      // Tampilkan pesan error umum
      alertDiv.innerHTML = "Harap perbaiki kesalahan pada form sebelum melanjutkan.";
      alertDiv.classList.remove("d-none", "alert-success");
      alertDiv.classList.add("alert-danger");

      // Scroll ke atas form
      alertDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Auto-focus pada field pertama
  document.getElementById("registerName").focus();
});
