import makeCall from '../utils/callfunction.js';
import { registerUserName } from '../utils/registerUserName.js';

document.addEventListener('DOMContentLoaded', function () {
    // функция отображения логина регистрированного пользователя
    registerUserName();

    // Функция для отображения истории входящих звонков на странице
    function displayCallHistoryIncom() {
        let callHistoryIncomig =
            JSON.parse(localStorage.getItem('callHistoryIncomingCall')) || [];
        let historyList = document.querySelector('.list-history');
        historyList.innerHTML = '';
        callHistoryIncomig.forEach(function (number) {
            let listItem = document.createElement('li');
            listItem.classList.add('item-history');
            listItem.textContent = number;
            let phoneIcon = document.createElement('img');
            phoneIcon.classList.add('phone-history-icon');
            phoneIcon.src = './icons/phone.svg';
            phoneIcon.alt = 'phone';
            listItem.appendChild(phoneIcon);
            historyList.appendChild(listItem);
        });
    }
    displayCallHistoryIncom();

    // Функция для отображения истории исходящих звонков на странице
    function displayCallHistoryOut() {
        let callHistoryOut =
            JSON.parse(localStorage.getItem('callHistoryOutCall')) || [];
        let historyList = document.querySelector('.list-history-outgoing');
        historyList.innerHTML = '';
        callHistoryOut.forEach(function (number) {
            let listItem = document.createElement('li');
            listItem.classList.add('item-history');
            listItem.textContent = number;
            let phoneIcon = document.createElement('img');
            phoneIcon.classList.add('phone-history-icon');
            phoneIcon.src = './icons/phone.svg';
            phoneIcon.alt = 'phone';
            listItem.appendChild(phoneIcon);
            historyList.appendChild(listItem);
        });
    }
    displayCallHistoryOut();

    // Функция для обработки клика по номеру в истории звонков
    function handleCallHistoryClick(event) {
        const target = event.target.closest('.item-history');
        if (target) {
            const clickedNumber = target.textContent.trim();
            console.log('clickedNumber', clickedNumber);
            window.location.href = `main-content.html?phoneNumber=${clickedNumber}`;
            // localStorage.setItem('clickedNumber', clickedNumber);
        }
    }

    // обработчик клика ко всем элементам списка истории входящих звонков
    const historyListItemsIncoming = document.querySelectorAll(
        '.list-history .item-history'
    );
    historyListItemsIncoming.forEach(function (item) {
        item.addEventListener('click', handleCallHistoryClick);
    });

    // обработчик клика ко всем элементам списка истории исходящих звонков
    const historyListItemsOutgoing = document.querySelectorAll(
        '.list-history-outgoing .item-history'
    );
    historyListItemsOutgoing.forEach(function (item) {
        item.addEventListener('click', handleCallHistoryClick);
    });
});
