

(function () {
    "use strict";

    const ENDPOINT_URL = "https://formcarry.com/s/KMaRbiSHFmy";
    const STORAGE_KEY = "feedback_form_data";
    const MODAL_HASH = "#feedback";

    const openBtn = document.getElementById("open-modal-btn");
    const closeBtn = document.getElementById("close-modal-btn");
    const modal = document.getElementById("feedback-modal");
    const form = document.getElementById("feedback-form");
    const submitBtn = document.getElementById("submit-btn");
    const statusBox = document.getElementById("form-status");

    const fullnameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const organizationInput = document.getElementById("organization");
    const messageInput = document.getElementById("message");
    const consentInput = document.getElementById("consent");

    const fields = [
        fullnameInput,
        emailInput,
        phoneInput,
        organizationInput,
        messageInput
    ];

    function showStatus(text, type) {
        statusBox.textContent = text;
        statusBox.className = "form-status " + type;
    }

    function clearErrors() {
        fields.forEach(function (field) {
            field.classList.remove("input-error");
        });
    }

    function clearStatus() {
        statusBox.textContent = "";
        statusBox.className = "form-status";
        clearErrors();
    }

    function failField(field, message) {
        field.classList.add("input-error");
        field.focus();
        showStatus(message, "error");
        return false;
    }

    function validateForm() {
        const fullname = fullnameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const organization = organizationInput.value.trim();
        const message = messageInput.value.trim();

        const nameRegex = /^[A-Za-zА-Яа-яЁё -]{2,100}$/;
        const letterRegex = /[A-Za-zА-Яа-яЁё]/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const phoneRegex = /^[+0-9 ()-]{10,20}$/;
        const digitsOnly = phone.replace(/[^0-9]/g, "");

        clearErrors();

        if (!fullname || !nameRegex.test(fullname) || !letterRegex.test(fullname)) {
            return failField(
                fullnameInput,
                "ФИО должно содержать только буквы (без цифр и спецсимволов)."
            );
        }

        if (!email || !emailRegex.test(email)) {
            return failField(
                emailInput,
                "Введите корректный Email (например, name@mail.ru)."
            );
        }

        if (
            !phone ||
            !phoneRegex.test(phone) ||
            digitsOnly.length < 10 ||
            digitsOnly.length > 15
        ) {
            return failField(
                phoneInput,
                "Телефон не должен содержать буквы (нужно 10–15 цифр)."
            );
        }

        if (
            !organization ||
            organization.length < 2 ||
            !letterRegex.test(organization)
        ) {
            return failField(
                organizationInput,
                "Укажите название организации (минимум 2 символа, с буквами)."
            );
        }

        if (!message || message.length < 5) {
            return failField(
                messageInput,
                "Введите сообщение (минимум 5 символов)."
            );
        }

        if (!consentInput.checked) {
            consentInput.focus();
            showStatus(
                "Необходимо согласие на обработку персональных данных.",
                "error"
            );
            return false;
        }

        return true;
    }

    function saveFormData() {
        const data = {
            consent: consentInput.checked,
            email: emailInput.value,
            fullname: fullnameInput.value,
            message: messageInput.value,
            organization: organizationInput.value,
            phone: phoneInput.value
        };
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (ignore) {
            return;
        }
    }

    function restoreFormData() {
        let raw = null;
        try {
            raw = window.localStorage.getItem(STORAGE_KEY);
        } catch (ignore) {
            return;
        }
        if (!raw) {
            return;
        }
        try {
            const data = JSON.parse(raw);
            fullnameInput.value = data.fullname || "";
            emailInput.value = data.email || "";
            phoneInput.value = data.phone || "";
            organizationInput.value = data.organization || "";
            messageInput.value = data.message || "";
            consentInput.checked = Boolean(data.consent);
        } catch (ignore) {
            return;
        }
    }

    function clearSavedData() {
        try {
            window.localStorage.removeItem(STORAGE_KEY);
        } catch (ignore) {
            return;
        }
    }

    function openModal(pushHistory) {
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        if (pushHistory && window.location.hash !== MODAL_HASH) {
            window.history.pushState({ feedbackOpen: true }, "", MODAL_HASH);
        }
    }

    function closeModal(useHistoryBack) {
        if (useHistoryBack && window.location.hash === MODAL_HASH) {
            window.history.back();
            return;
        }
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
    }

    openBtn.addEventListener("click", function () {
        clearStatus();
        openModal(true);
    });

    closeBtn.addEventListener("click", function () {
        closeModal(true);
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal(true);
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal(true);
        }
    });

    window.addEventListener("popstate", function () {
        if (window.location.hash === MODAL_HASH) {
            openModal(false);
        } else {
            closeModal(false);
        }
    });

    form.addEventListener("input", function (event) {
        event.target.classList.remove("input-error");
        saveFormData();
    });

    consentInput.addEventListener("change", saveFormData);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearStatus();

        if (!validateForm()) {
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Отправка...";

        const payload = {
            consent: consentInput.checked,
            email: emailInput.value.trim(),
            fullname: fullnameInput.value.trim(),
            message: messageInput.value.trim(),
            organization: organizationInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        window.fetch(ENDPOINT_URL, {
            body: JSON.stringify(payload),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST"
        }).then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP " + String(response.status));
            }
            return response.json();
        }).then(function () {
            form.reset();
            clearSavedData();
            showStatus("Сообщение успешно отправлено!", "success");
        }).catch(function () {
            showStatus(
                "Ошибка при отправке. Проверьте подключение и ссылку формы.",
                "error"
            );
        }).finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = "Отправить";
        });
    });

    restoreFormData();
    if (window.location.hash === MODAL_HASH) {
        openModal(false);
    }
}());
