import { accessConstants } from '../utils/accessConstants.js';
import makeCall from '../utils/callfunction.js';
import { registerUserName } from '../utils/registerUserName.js';

// Переменная для хранения текущего набранного номера
export let currentNumber = '';
const accessConstant = accessConstants();
document.addEventListener('DOMContentLoaded', function () {
    // Функция для отображения зарегистрированного пользователя
    registerUserName();
    // Скрытие кнопок и времени звонка
    accessConstant.pauseButton.style.display = 'none';
    accessConstant.cancelButton.style.display = 'none';
    accessConstant.callTime.style.display = 'none';
    accessConstant.answerButton.style.display = 'none';

    // Функция для отображения набранного номера
    function numberAbonent() {
        const numberPad = document.querySelector('.number-pad');

        numberPad.addEventListener('click', function (event) {
            const target = event.target.closest('.number');
            if (target) {
                const digit = target.getAttribute('data-number');
                currentNumber += digit;
                accessConstant.abonentName.textContent =
                    'Звонок абоненту: ' + currentNumber;
            }
        });
    }
    numberAbonent();

    // Получаем параметры URL
    const urlParams = new URLSearchParams(window.location.search);
    const phoneNumber = urlParams.get('phoneNumber');
    console.log('phoneNumber', phoneNumber);
    if (phoneNumber) {
        console.log(phoneNumber);
        makeCall(phoneNumber);
    }

    // Функция для стирания набранного номера
    function clearUserNumberForCall() {
        accessConstant.clearButton = document.querySelector('.clear');

        accessConstant.clearButton.addEventListener('click', function () {
            currentNumber = currentNumber.slice(0, -1);
            accessConstant.abonentName.textContent = currentNumber;
        });
    }
    clearUserNumberForCall();

    accessConstant.callButton.addEventListener('click', function () {
        makeCall(currentNumber);
    });
});
