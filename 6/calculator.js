
function getPrices() {
    "use strict";
    return {
        serviceProperties: {
            urgent: 2000
        },
        serviceTypes: {
            type1: 1000,
            type2: 3000,
            type3: 5000
        }
    };
}

function updatePrice() {
    "use strict";

    const quantityInput = document.getElementById("quantity");
    const resultElement = document.getElementById("result");
    const optionsContainer = document.getElementById("options-container");
    const propertyContainer = document.getElementById("property-container");
    const optionSelect = document.getElementById("service-option");
    const propertyCheckbox = document.getElementById("service-property");

    const prices = getPrices();


    const selectedRadio = document.querySelector("input[name=\"service-type\"]:checked");
    if (!selectedRadio) {
        return;
    }

    const serviceType = selectedRadio.value;
    const quantityStr = quantityInput.value.trim();


    if (serviceType === "type1") {
        optionsContainer.style.display = "none";
        propertyContainer.style.display = "none";
    } else if (serviceType === "type2") {
        optionsContainer.style.display = "block";
        propertyContainer.style.display = "none";
    } else if (serviceType === "type3") {
        optionsContainer.style.display = "none";
        propertyContainer.style.display = "block";
    }

    const isValidQuantity = /^[1-9]\d*$/.test(quantityStr);

    if (!isValidQuantity) {
        resultElement.className = "result-box show error";
        if (quantityStr === "") {
            resultElement.textContent = "Пожалуйста, укажите количество услуг.";
        } else {
            resultElement.textContent = "Ошибка: количество должно быть целым положительным числом!";
        }
        return;
    }

    const count = parseInt(quantityStr, 10);
    const basePrice = prices.serviceTypes[serviceType] || 0;
    let extraPrice = 0;

    if (serviceType === "type2") {

        extraPrice += parseInt(optionSelect.value, 10);
    } else if (serviceType === "type3") {

        if (propertyCheckbox.checked) {
            extraPrice += prices.serviceProperties.urgent;
        }
    }

    const totalPrice = (basePrice + extraPrice) * count;

    resultElement.className = "result-box show success";
    resultElement.textContent = "Итоговая стоимость: " + totalPrice.toLocaleString("ru-RU") + " руб.";
}

window.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const quantityInput = document.getElementById("quantity");
    const typeRadios = document.querySelectorAll("input[name=\"service-type\"]");
    const optionSelect = document.getElementById("service-option");
    const propertyCheckbox = document.getElementById("service-property");


    quantityInput.addEventListener("input", updatePrice);
    quantityInput.addEventListener("change", updatePrice);

 
    let i;
    for (i = 0; i < typeRadios.length; i += 1) {
        typeRadios[i].addEventListener("change", updatePrice);
    }


    optionSelect.addEventListener("change", updatePrice);


    propertyCheckbox.addEventListener("change", updatePrice);


    updatePrice();
});