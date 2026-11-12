/*jslint browser */

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

    function showStatus(text, type) {
        statusBox.textContent = text;
        statusBox.className = "form-status " + type;
    }

    function clearStatus() {
        statusBox.textContent = "";
        statusBox.className = "form-status";
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

    form.addEventListener("input", saveFormData);
    consentInput.addEventListener("change", saveFormData);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearStatus();
        submitBtn.disabled = true;
        submitBtn.textContent = "Отправка...";

        const payload = {
            consent: consentInput.checked,
            email: emailInput.value,
            fullname: fullnameInput.value,
            message: messageInput.value,
            organization: organizationInput.value,
            phone: phoneInput.value
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
