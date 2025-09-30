// ==== NAVIGATION ====
function toggleMenu() {
  const navigation = document.querySelector(".navigation");
  navigation.classList.toggle("active");
}

// ==== MODALES ====
const modalLogin = document.getElementById("modal-login");
const modalRegistro = document.getElementById("modal-registro");
const overlay = document.getElementById("overlay");

function abrirModal(modal) {
  modal.classList.add("active");
  overlay.classList.add("active");
}

function cerrarModal() {
  document
    .querySelectorAll(".modal")
    .forEach((m) => m.classList.remove("active"));
  overlay.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
  // Abrir login
  document.querySelectorAll("a[href='#login']").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      abrirModal(modalLogin);
    });
  });

  // Abrir registro
  document.querySelectorAll("a[href='#registro']").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      abrirModal(modalRegistro);
    });
  });

  // Cerrar con X
  document.querySelectorAll(".modal .close").forEach((btn) => {
    btn.addEventListener("click", cerrarModal);
  });

  // Cerrar clic en overlay
  overlay.addEventListener("click", cerrarModal);
});

// ==== VALIDACIÓN DE FORMULARIOS ====
function validarFormulario(form) {
  let valido = true;
  form.querySelectorAll("input").forEach((input) => {
    const error = input.nextElementSibling;
    if (input.value.trim() === "") {
      error.textContent = "Este campo es obligatorio";
      valido = false;
    } else {
      error.textContent = "";
    }
  });
  return valido;
}

// ==== EVENTOS ====
document.addEventListener("DOMContentLoaded", () => {
  const navigation = document.querySelector(".navigation");
  const navLinks = document.querySelectorAll(".navigation a");

  // Cerrar el menú al hacer clic en cualquier enlace
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navigation.classList.contains("active")) {
        navigation.classList.remove("active");
      }
    });
  });

  document.querySelectorAll("a[href='#registro']").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      abrirModal(modalRegistro);
    });
  });

  // Botones de cerrar
  document.querySelectorAll(".modal .close").forEach((btn) => {
    btn.addEventListener("click", cerrarModal);
  });

  // Cerrar al hacer clic en overlay
  overlay.addEventListener("click", cerrarModal);

  // Validación + envío con fetch para cada formulario
  document.querySelectorAll(".modal form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (validarFormulario(form)) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        let url = "";
        if (form.id === "formRegistro") {
          url = "http://localhost:3000/api/register";
        } else if (form.id === "formLogin") {
          url = "http://localhost:3000/api/login";
        } else {
          alert("Formulario desconocido");
          return;
        }

        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (response.ok) {
            alert(result.message);
            cerrarModal();
            form.reset();
          } else {
            alert(result.message || "Error en la petición");
          }
        } catch (error) {
          alert("Error de conexión con el servidor");
        }
      }
    });
  });
});
