import { accessConstants } from './accessConstants.js';

// Функция для запуска отсчета времени разговора
const accessConstant = accessConstants();
export function startCallTimer() {
    let startTime = new Date();

    let timerInterval = setInterval(function () {
        let currentTime = new Date();
        let elapsedTime = Math.floor((currentTime - startTime) / 1000);
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = elapsedTime % 60;

        accessConstant.callTime.textContent = `${minutes} мин: ${seconds} сек`;
        // console.log(accessConstant.callTime.textContent);
    }, 1000);

    function stopCallTimer() {
        clearInterval(timerInterval);
        accessConstant.callTime.textContent = '';
    }

    return stopCallTimer;
}
