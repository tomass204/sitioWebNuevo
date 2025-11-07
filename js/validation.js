document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("signup");
   
    const nameInput = document.getElementById("name");
   
    const emailInput = document.getElementById("email");
   
    const passwordInput = document.getElementById("password");
   
    const ageInput = document.getElementById("age");
   
    const messagesDiv = document.getElementById("form-messages");
   
   
   
    // Crear elementos de error dinámicos
   
    function showError(input, message) {
   
     let error = input.parentNode.querySelector(".error-msg");
   
     if (!error) {
   
      error = document.createElement("small");
   
      error.className = "error-msg";
   
      error.style.color = "red";
   
      error.style.display = "block";
   
      input.parentNode.appendChild(error);
   
     }
   
     error.textContent = message;
   
     input.classList.add("invalid");
   
    }
   
   
   
    function clearError(input) {
   
     let error = input.parentNode.querySelector(".error-msg");
   
     if (error) error.textContent = "";
   
     input.classList.remove("invalid");
   
    }
   
   
   
    // Validaciones personalizadas
   
    function validateName() {
   
     if (nameInput.value.trim().length < 3) {
   
      showError(nameInput, "El nombre debe tener al menos 3 caracteres.");
   
      return false;
   
     }
   
     clearError(nameInput);
   
     return true;
   
    }
   
   
   
    function validateEmail() {
   
     const emailRegex = /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/;
   
     if (!emailRegex.test(emailInput.value.trim())) {
   
      showError(emailInput, "Introduce un correo electrónico válido.");
   
      return false;
   
     }
   
     clearError(emailInput);
   
     return true;
   
    }
   
   
   
    function validatePassword() {
   
     if (passwordInput.value.length < 8) {
   
      showError(passwordInput, "La contraseña debe tener mínimo 8 caracteres.");
   
      return false;
   
     }
   
     clearError(passwordInput);
   
     return true;
   
    }
   
   
   
    function validateAge() {
   
     const age = parseInt(ageInput.value, 10);
   
     if (isNaN(age) || age < 13) {
   
      showError(ageInput, "Debes tener al menos 13 años.");
   
      return false;
   
     }
   
     clearError(ageInput);
   
     return true;
   
    }
   
   
   
    // Sugerencias en tiempo real
   
    passwordInput.addEventListener("input", () => {
   
     if (passwordInput.value.length >= 8) {
   
      messagesDiv.textContent = "✅ Tu contraseña es segura.";
   
      messagesDiv.style.color = "green";
   
     } else {
   
      messagesDiv.textContent = "⚠️ Tu contraseña debe tener mínimo 8 caracteres.";
   
      messagesDiv.style.color = "orange";
   
     }
   
    });
   
   
   
    emailInput.addEventListener("input", () => {
   
     if (/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(emailInput.value.trim())) {
   
      messagesDiv.textContent = "✅ Parece un correo válido.";
   
      messagesDiv.style.color = "green";
   
     } else {
   
      messagesDiv.textContent = "";
   
     }
   
    });
   
   
   
    // Validación al enviar
   
    form.addEventListener("submit", (e) => {
   
     let isValid = true;
   
   
   
     if (!validateName()) isValid = false;
   
     if (!validateEmail()) isValid = false;
   
     if (!validatePassword()) isValid = false;
   
     if (!validateAge()) isValid = false;
   
   
   
     if (!isValid) {
   
      e.preventDefault();
   
      messagesDiv.textContent = "❌ Corrige los errores antes de enviar el formulario.";
   
      messagesDiv.style.color = "red";
   
     } else {
   
      messagesDiv.textContent = "✅ Formulario enviado correctamente.";
   
      messagesDiv.style.color = "green";
   
     }
   
    });
   
   });
   
   