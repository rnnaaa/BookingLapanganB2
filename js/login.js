// Toggle visibility password
function setupPasswordToggle(toggleId, passwordId) {
  const toggle = document.getElementById(toggleId);
  const password = document.getElementById(passwordId);

  if (toggle && password) {
    toggle.addEventListener("click", function () {
      const type = password.getAttribute("type") === "password" ? "text" : "password";
      password.setAttribute("type", type);
      toggle.querySelector("i").classList.toggle("fa-eye");
      toggle.querySelector("i").classList.toggle("fa-eye-slash");
    });
  }
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

function updatePasswordStrengthIndicator(password, indicatorId) {
  const strength = checkPasswordStrength(password);
  let indicator = document.getElementById(indicatorId);

  if (!indicator) {
    indicator = document.createElement("div");
    indicator.id = indicatorId;
    indicator.className = "password-strength";
    document.getElementById(indicatorId.replace("Indicator", "")).parentNode.appendChild(indicator);
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
  if (!field) return false;

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
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value) => value.length >= 1, // Minimal 1 karakter untuk login
  resetPassword: (value) => value.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value),
  resetConfirmPassword: (value) => value === document.getElementById("resetPassword")?.value,
};

// Demo accounts untuk testing
const demoAccounts = {
  "admin@badmintonpro.com": { password: "Admin123!", role: "admin", name: "Administrator" },
  "user@badmintonpro.com": { password: "User123!", role: "user", name: "John Doe" },
};

// Toggle antara form login dan lupa password
function showForm(formToShow) {
  // Sembunyikan semua form
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("forgotPasswordForm").classList.add("hidden");
  document.getElementById("resetPasswordForm").classList.add("hidden");

  // Tampilkan form yang dipilih
  document.getElementById(formToShow).classList.remove("hidden");

  // Reset form dan validasi
  document.querySelectorAll(".is-invalid, .is-valid").forEach((el) => {
    el.classList.remove("is-invalid", "is-valid");
  });

  // Focus pada field pertama
  setTimeout(() => {
    const firstInput = document.querySelector(`#${formToShow} input`);
    if (firstInput) firstInput.focus();
  }, 300);
}

// Simulasi pengiriman email reset password
function simulateEmailSending(email, callback) {
  const alertDiv = document.getElementById("forgotPasswordAlert");
  const submitButton = document.querySelector('#forgotPasswordFormElement button[type="submit"]');
  const buttonText = document.getElementById("forgotButtonText");
  const spinner = document.getElementById("forgotSpinner");

  // Tampilkan loading
  submitButton.disabled = true;
  buttonText.textContent = "Mengirim...";
  spinner.classList.remove("d-none");

  // Simulasi delay pengiriman email
  setTimeout(() => {
    // Reset UI
    submitButton.disabled = false;
    buttonText.textContent = "Kirim Link Reset";
    spinner.classList.add("d-none");

    // Panggil callback dengan hasil
    callback(true, "Link reset password telah dikirim ke email Anda. Periksa inbox atau folder spam.");
  }, 2000);
}

// Simulasi reset password
function simulatePasswordReset(callback) {
  const submitButton = document.querySelector('#resetPasswordFormElement button[type="submit"]');
  const buttonText = document.getElementById("resetButtonText");
  const spinner = document.getElementById("resetSpinner");

  // Tampilkan loading
  submitButton.disabled = true;
  buttonText.textContent = "Mereset...";
  spinner.classList.remove("d-none");

  // Simulasi delay reset password
  setTimeout(() => {
    // Reset UI
    submitButton.disabled = false;
    buttonText.textContent = "Reset Password";
    spinner.classList.add("d-none");

    // Panggil callback dengan hasil
    callback(true, "Password berhasil direset! Silakan login dengan password baru.");
  }, 2000);
}

// Event listeners ketika DOM siap
document.addEventListener("DOMContentLoaded", function () {
  // Setup password toggles
  setupPasswordToggle("toggleLoginPassword", "loginPassword");
  setupPasswordToggle("toggleResetPassword", "resetPassword");
  setupPasswordToggle("toggleResetConfirmPassword", "resetConfirmPassword");

  // Event listeners untuk navigasi form
  document.getElementById("showForgotPassword").addEventListener("click", function (e) {
    e.preventDefault();
    showForm("forgotPasswordForm");
  });

  document.getElementById("backToLogin").addEventListener("click", function (e) {
    e.preventDefault();
    showForm("loginForm");
  });

  document.getElementById("backToLoginFromReset").addEventListener("click", function (e) {
    e.preventDefault();
    showForm("loginForm");
  });

  // Validasi real-time untuk form login
  document.getElementById("loginEmail").addEventListener("blur", function () {
    validateField("loginEmail", validators.email, "emailFeedback");
  });

  document.getElementById("loginPassword").addEventListener("blur", function () {
    validateField("loginPassword", validators.password, "passwordFeedback");
  });

  // Validasi real-time untuk form lupa password
  document.getElementById("forgotPasswordEmail").addEventListener("blur", function () {
    validateField("forgotPasswordEmail", validators.email, "forgotEmailFeedback");
  });

  // Validasi real-time untuk form reset password
  document.getElementById("resetPassword").addEventListener("input", function () {
    updatePasswordStrengthIndicator(this.value, "resetPasswordStrengthIndicator");
    validateField("resetPassword", validators.resetPassword, "resetPasswordFeedback");

    // Validasi ulang konfirmasi password jika sudah diisi
    if (document.getElementById("resetConfirmPassword").value) {
      validateField("resetConfirmPassword", validators.resetConfirmPassword, "resetConfirmFeedback");
    }
  });

  document.getElementById("resetPassword").addEventListener("blur", function () {
    validateField("resetPassword", validators.resetPassword, "resetPasswordFeedback");
  });

  document.getElementById("resetConfirmPassword").addEventListener("blur", function () {
    validateField("resetConfirmPassword", validators.resetConfirmPassword, "resetConfirmFeedback");
  });

  // Validasi form login
  document.getElementById("loginFormElement").addEventListener("submit", function (e) {
    e.preventDefault();

    // Validasi field
    const isEmailValid = validateField("loginEmail", validators.email, "emailFeedback");
    const isPasswordValid = validateField("loginPassword", validators.password, "passwordFeedback");

    const alertDiv = document.getElementById("loginAlert");
    const submitButton = document.querySelector('#loginFormElement button[type="submit"]');
    const buttonText = document.getElementById("loginButtonText");
    const spinner = document.getElementById("loginSpinner");
    const rememberMe = document.getElementById("loginRemember").checked;

    if (isEmailValid && isPasswordValid) {
      // Semua valid, tampilkan loading
      alertDiv.classList.add("d-none");
      submitButton.disabled = true;
      buttonText.textContent = "Memverifikasi...";
      spinner.classList.remove("d-none");

      // Simulasi proses login (ganti dengan AJAX call ke backend)
      setTimeout(() => {
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        // Cek apakah ini akun demo
        if (demoAccounts[email] && demoAccounts[email].password === password) {
          // Login berhasil
          const user = demoAccounts[email];

          alertDiv.innerHTML = `Login berhasil! Selamat datang, ${user.name}.`;
          alertDiv.classList.remove("d-none", "alert-danger");
          alertDiv.classList.add("alert-success");

          // Simpan info login jika "Ingat saya" dicentang
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }

          // Simpan info user di sessionStorage
          sessionStorage.setItem("currentUser", JSON.stringify(user));

          // Redirect berdasarkan role setelah 1.5 detik
          setTimeout(() => {
            if (user.role === "admin") {
              window.location.href = "admin-dashboard.html";
            } else {
              window.location.href = "user-dashboard.html";
            }
          }, 1500);
        } else {
          // Login gagal
          alertDiv.innerHTML = "Email atau password salah. Silakan coba lagi.";
          alertDiv.classList.remove("d-none", "alert-success");
          alertDiv.classList.add("alert-danger");

          // Reset UI state
          submitButton.disabled = false;
          buttonText.textContent = "Login";
          spinner.classList.add("d-none");
        }
      }, 1500);
    } else {
      // Tampilkan pesan error
      alertDiv.innerHTML = "Harap periksa kembali email dan password Anda.";
      alertDiv.classList.remove("d-none", "alert-success");
      alertDiv.classList.add("alert-danger");
    }
  });

  // Validasi form lupa password
  document.getElementById("forgotPasswordFormElement").addEventListener("submit", function (e) {
    e.preventDefault();

    const isEmailValid = validateField("forgotPasswordEmail", validators.email, "forgotEmailFeedback");
    const alertDiv = document.getElementById("forgotPasswordAlert");

    if (isEmailValid) {
      const email = document.getElementById("forgotPasswordEmail").value;

      // Simulasi pengiriman email
      simulateEmailSending(email, function (success, message) {
        if (success) {
          alertDiv.innerHTML = message;
          alertDiv.classList.remove("d-none", "alert-danger");
          alertDiv.classList.add("alert-success");

          // Reset form
          document.getElementById("forgotPasswordFormElement").reset();

          // Tampilkan form reset password setelah 2 detik (simulasi)
          setTimeout(() => {
            showForm("resetPasswordForm");
          }, 2000);
        } else {
          alertDiv.innerHTML = "Terjadi kesalahan. Silakan coba lagi.";
          alertDiv.classList.remove("d-none", "alert-success");
          alertDiv.classList.add("alert-danger");
        }
      });
    } else {
      alertDiv.innerHTML = "Harap masukkan email yang valid.";
      alertDiv.classList.remove("d-none", "alert-success");
      alertDiv.classList.add("alert-danger");
    }
  });

  // Validasi form reset password
  document.getElementById("resetPasswordFormElement").addEventListener("submit", function (e) {
    e.preventDefault();

    const isPasswordValid = validateField("resetPassword", validators.resetPassword, "resetPasswordFeedback");
    const isConfirmValid = validateField("resetConfirmPassword", validators.resetConfirmPassword, "resetConfirmFeedback");
    const alertDiv = document.getElementById("resetPasswordAlert");

    if (isPasswordValid && isConfirmValid) {
      // Simulasi reset password
      simulatePasswordReset(function (success, message) {
        if (success) {
          alertDiv.innerHTML = message;
          alertDiv.classList.remove("d-none", "alert-danger");
          alertDiv.classList.add("alert-success");

          // Reset form
          document.getElementById("resetPasswordFormElement").reset();

          // Kembali ke form login setelah 2 detik
          setTimeout(() => {
            showForm("loginForm");
          }, 2000);
        } else {
          alertDiv.innerHTML = "Terjadi kesalahan. Silakan coba lagi.";
          alertDiv.classList.remove("d-none", "alert-success");
          alertDiv.classList.add("alert-danger");
        }
      });
    } else {
      alertDiv.innerHTML = "Harap periksa kembali password baru Anda.";
      alertDiv.classList.remove("d-none", "alert-success");
      alertDiv.classList.add("alert-danger");
    }
  });

  // Auto-fill email yang diingat
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  if (rememberedEmail) {
    document.getElementById("loginEmail").value = rememberedEmail;
    document.getElementById("loginRemember").checked = true;
  }

  // Auto-focus pada field pertama
  document.getElementById("loginEmail").focus();
});
