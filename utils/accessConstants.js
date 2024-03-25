export function accessConstants() {
    let userName = document.getElementById('user-info');

    // Переменная для хранения значения набранного номера и отображения
    const abonentName = document.querySelector('.abonent-name');
    // Кнопка паузы при звонке
    const pauseButton = document.querySelector('.abonent-button-pause');
    // кнопка отмены звонка
    const cancelButton = document.querySelector('.abonent-button-none');
    // кнопка принятия входящего звонка
    const answerButton = document.querySelector('.abonent-button-answer');
    // кнопка стирания набранного номера
    const clearButton = document.querySelector('.clear');
    // кнопка набора номера для звонка
    const callButton = document.querySelector('.button-call');

    // отображение времени звонка
    const callTime = document.querySelector('.abonent-time');
    return {
        userName,
        abonentName,
        pauseButton,
        cancelButton,
        answerButton,
        clearButton,
        callButton,
        callTime,
    };
}
