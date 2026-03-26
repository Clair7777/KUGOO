document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("feedback-modal");

  // ✅ ПРАВИЛЬНЫЕ селекторы для ВСЕХ кнопок "Записаться"
  const openButtons = document.querySelectorAll(`
    .signup-btn,
    .testdrive-models-button,
    [data-target="#feedback-modal"],
    .header-content-button
  `);

  // Открытие модала
  openButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  });

  // Закрытие по крестику
  const closeBtn = document.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      closeModal();
    });
  }

  // Закрытие по клику вне модала
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Закрытие по Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }
});

// Блокировка кнопки до согласия с политикой
const privacyCheckbox = document.getElementById("modal-privacy");
const submitBtn = document.getElementById("modal-submit");

if (privacyCheckbox && submitBtn) {
  submitBtn.disabled = true;
  submitBtn.style.opacity = "0.6";

  privacyCheckbox.addEventListener("change", function () {
    submitBtn.disabled = !this.checked;
    submitBtn.style.opacity = this.checked ? "1" : "0.6";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const modalForm = document.querySelector(".modal-form");
  const submitButton = document.querySelector(".modal-form-button");
  const phoneInput = document.getElementById("user-phone-modal");
  const privacyCheckbox = document.getElementById("modal-privacy");

  // Функция форматирования номера телефона
  function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, "");

    if (value.startsWith("8")) {
      value = "7" + value.slice(1);
    }
    if (value.startsWith("7") || value.startsWith("9")) {
      value = value.substring(0, 11);
    }

    let formattedValue = "";
    if (value.length > 0) formattedValue = "+7 ";
    if (value.length > 1) formattedValue += "(" + value.slice(1, 4);
    if (value.length >= 4) formattedValue += ") " + value.slice(4, 7);
    if (value.length >= 7) formattedValue += "-" + value.slice(7, 9);
    if (value.length >= 9) formattedValue += "-" + value.slice(9, 11);

    input.value = formattedValue;
  }

  // Маска для телефона
  phoneInput.addEventListener("input", function (e) {
    formatPhoneNumber(this);
  });

  phoneInput.addEventListener("focus", function () {
    if (this.value === "") {
      this.value = "+7 ";
    }
  });

  // Обработчик отправки формы
  function handleFormSubmit(e) {
    e.preventDefault();

    // Проверка заполненности полей
    if (!phoneInput.value || phoneInput.value === "+7 ") {
      showError(phoneInput, "Введите номер телефона");
      return;
    }

    if (!privacyCheckbox.checked) {
      showError(
        privacyCheckbox.parentElement,
        "Необходимо согласиться с политикой конфиденциальности"
      );
      return;
    }

    // Блокировка кнопки
    submitButton.disabled = true;
    submitButton.textContent = "Отправка...";

    // Отправка формы
    const formData = new FormData(modalForm);

    fetch("handler.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Ошибка сервера");
      })
      .then((data) => {
        if (data.success) {
          showSuccess(
            "Заявка отправлена! Менеджер свяжется с вами в течение 5 минут."
          );
          modalForm.reset();
          // Закрытие модального окна
          const modalClose = document.querySelector(".modal-close");
          modalClose.click();
        } else {
          throw new Error(data.message || "Ошибка отправки");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showError(submitButton, "Ошибка отправки. Попробуйте позже.");
      })
      .finally(() => {
        // Разблокировка кнопки
        submitButton.disabled = false;
        submitButton.textContent = "Оформить предзаказ";
      });
  }

  // Функции показа ошибок и успеха
  function showError(element, message) {
    // Удаляем предыдущие сообщения об ошибках
    const existingError = element.parentElement.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.cssText =
      "color: #ff4444; font-size: 12px; margin-top: 5px;";
    errorDiv.textContent = message;

    element.parentElement.appendChild(errorDiv);

    // Анимация мигания
    element.style.borderColor = "#ff4444";
    setTimeout(() => {
      element.style.borderColor = "";
    }, 2000);
  }

  function showSuccess(message) {
    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px; 
            background: #4CAF50; color: white; padding: 15px 20px; 
            border-radius: 5px; z-index: 10000; font-weight: bold;
        `;
    successDiv.textContent = message;

    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }

  // Привязка обработчика к кнопке и форме
  submitButton.addEventListener("click", handleFormSubmit);
  modalForm.addEventListener("submit", handleFormSubmit);

  // Сброс ошибок при вводе
  phoneInput.addEventListener("input", function () {
    const error = this.parentElement.querySelector(".error-message");
    if (error) error.remove();
  });

  privacyCheckbox.addEventListener("change", function () {
    const error =
      this.parentElement.parentElement.querySelector(".error-message");
    if (error) error.remove();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const socialLinks = document.querySelectorAll(".footer-bottom-social-wrp");

  socialLinks.forEach(function (link) {
    const countElement = link.querySelector(".footer-bottom-social-count");
    if (countElement) {
      // Определяем ключ для localStorage по классу иконки (vk, ytube, tgblue)
      const iconClass =
        link.querySelector("svg").className.baseVal ||
        link.querySelector("svg").classList[0];
      const storageKey =
        "social_click_" + iconClass.replace("footer-bottom-icon-", "");

      // Загружаем текущее число из localStorage или используем из HTML
      let currentCount =
        parseInt(localStorage.getItem(storageKey)) ||
        parseInt(countElement.textContent.replace(/\s/g, "")) ||
        0;

      // Обновляем отображение
      countElement.textContent = currentCount.toLocaleString("ru-RU") + " "; // Формат 3 300

      link.addEventListener("click", function (e) {
        e.preventDefault(); // Предотвращаем переход, если href="#"

        currentCount++;
        countElement.textContent = currentCount.toLocaleString("ru-RU") + " ";
        localStorage.setItem(storageKey, currentCount);
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".no-models-input");
  const phoneInput = document.getElementById("user-phone");
  const checkbox = document.getElementById("subscribeNews");
  const submitBtn = document.getElementById("modal-submit");

  if (!form || !phoneInput || !checkbox || !submitBtn) return;

  // 1. Маска для телефона
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("8")) value = "7" + value.slice(1);
    if (value.startsWith("7")) {
      value =
        "+7 (" +
        value.slice(1, 4) +
        ") " +
        value.slice(4, 7) +
        "-" +
        value.slice(7, 9) +
        "-" +
        value.slice(9, 11);
    }
    e.target.value = value.slice(0, 18);
  });

  // 2. Блокировка кнопки до галочки
  checkbox.addEventListener("change", function () {
    submitBtn.disabled = !this.checked;
    submitBtn.style.opacity = this.checked ? "1" : "0.6";
  });
  submitBtn.disabled = true; // Изначально заблокирована
  submitBtn.style.opacity = "0.6";

  // 3. Отправка формы
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const phone = phoneInput.value.replace(/\D/g, "");
    if (!phone || phone.length !== 11 || !checkbox.checked) {
      alert("Введите корректный телефон и согласитесь с политикой");
      return;
    }

    // Блокировка кнопки
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    const formData = new FormData();
    formData.append("userphone", phone);
    formData.append("subscribe", checkbox.checked ? "1" : "0");

    fetch("handler.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("✅ Заявка отправлена! Мы свяжемся с вами.");
          form.reset();
          checkbox.checked = false;
          submitBtn.disabled = true;
          submitBtn.textContent = "Оставить заявку на тест-драйв";
        } else {
          throw new Error(data.error || "Ошибка сервера");
        }
      })
      .catch((error) => {
        alert("❌ Ошибка: " + error.message);
      })
      .finally(() => {
        submitBtn.disabled = !checkbox.checked;
        submitBtn.textContent = "Оставить заявку на тест-драйв";
        submitBtn.style.opacity = checkbox.checked ? "1" : "0.6";
      });
  });
});
