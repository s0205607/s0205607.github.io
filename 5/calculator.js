function calculateOrder(event) {
    "use strict";
    event.preventDefault();

    const quantityInput = document.getElementById("quantity");
    const productSelect = document.getElementById("product");
    const resultElement = document.getElementById("result");

    const quantityValue = quantityInput.value.trim();

    const matchResult = quantityValue.match(/^\d+$/);

    if (matchResult === null) {
        resultElement.className = "result-box show error";
        resultElement.textContent = "Ошибка: количество товара должно содержать только цифры!";
        return;
    }

    const count = parseInt(quantityValue, 10);

    if (count <= 0) {
        resultElement.className = "result-box show error";
        resultElement.textContent = "Ошибка: количество товара должно быть больше 0!";
        return;
    }

    const price = parseInt(productSelect.value, 10);
    const total = price * count;

    resultElement.className = "result-box show success";
    resultElement.textContent = "Стоимость заказа: " + total.toLocaleString("ru-RU") + " руб.";
}

window.addEventListener("DOMContentLoaded", function () {
    "use strict";
    const calcButton = document.getElementById("calc-btn");
    calcButton.addEventListener("click", calculateOrder);
});