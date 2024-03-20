document.addEventListener('DOMContentLoaded', function () {
    // Функция для отображения зарегистрированного пользователя
    function registrUserName() {
        let userName = document.getElementById('user-info');
        userName.textContent = localStorage.getItem('login');
    }
    registrUserName();

    // Переменная для хранения текущего набранного номера
    let currentNumber = '';
    // Переменная для хранения значения набранного номера и отображения
    const abonentName = document.querySelector('.abonent-name');
    // Кнопка паузы при звонке
    const pauseButton = document.querySelector('.abonent-button-pause');
    // кнопка отмены звонка
    const cancelButton = document.querySelector('.abonent-button-none');
    // кнопка принятия входящего звонка
    const answerButton = document.querySelector('.abonent-button-answer');
    // отображение времени звонка
    const callTime = document.querySelector('.abonent-time');

    // Скрытие кнопок и времени звонка
    pauseButton.style.display = 'none';
    cancelButton.style.display = 'none';
    callTime.style.display = 'none';
    answerButton.style.display = 'none';

    // Функция для отображения набранного номера
    function numberAbonent() {
        const numberPad = document.querySelector('.number-pad');

        numberPad.addEventListener('click', function (event) {
            const target = event.target.closest('.number');
            if (target) {
                const digit = target.getAttribute('data-number');
                currentNumber += digit;
                abonentName.textContent = currentNumber;
            }
        });
    }
    numberAbonent();

    // Функция для стирания набранного номера
    function clearUserNumberForCall() {
        const clearButton = document.querySelector('.clear');

        clearButton.addEventListener('click', function () {
            currentNumber = currentNumber.slice(0, -1);
            abonentName.textContent = currentNumber;
        });
    }
    clearUserNumberForCall();

    // Функция для осуществления звонка
    function makeCall() {
        console.log('currentNumber', currentNumber);
        if (currentNumber) {
            try {
                var socket = new JsSIP.WebSocketInterface(
                    `wss://${localStorage.getItem('server')}`
                );
                var configuration = {
                    sockets: [socket],
                    uri: `sip:${localStorage.getItem(
                        'login'
                    )}@${localStorage.getItem('server')}`,
                    password: localStorage.getItem('password'),
                };

                var softForCall = new JsSIP.UA(configuration);

                softForCall.start();

                softForCall.on('connected', function (e) {
                    console.log('Соединение установлено, совершаем вызов');
                    var eventHandlers = {
                        progress: function (e) {
                            console.log('Звонок в процессе');
                            pauseButton.style.display = 'block';
                            cancelButton.style.display = 'block';
                            callTime.style.display = 'block';
                            answerButton.style.display = 'none';
                        },
                        failed: function (e) {
                            console.log(
                                'Не удалось совершить звонок: ' + e.cause
                            );
                        },
                        ended: function (e) {
                            console.log('Звонок завершен: ' + e.cause);
                            pauseButton.style.display = 'none';
                            cancelButton.style.display = 'none';
                            callTime.style.display = 'none';
                        },
                        confirmed: function (e) {
                            console.log('Звонок подтвержден');
                        },
                    };
                    var options = {
                        eventHandlers: eventHandlers,
                        mediaConstraints: { audio: true, video: false },
                    };

                    var session = softForCall.call(
                        `sip:${currentNumber}@${localStorage.getItem(
                            'server'
                        )}`,
                        options
                    );

                    // Обработчик входящего вызова
                    softForCall.on('newRTCSession', function (e) {
                        console.log('Получен входящий вызов');
                        let incomingSession = e.session;
                        let incomingNumber = e.request.from.uri.user;

                        // Показываем кнопку принятия вызова и скрываем кнопки отмены и паузы
                        answerButton.style.display = 'block';
                        pauseButton.style.display = 'none';
                        cancelButton.style.display = 'none';

                        // Обработчик нажатия на кнопку принятия вызова
                        answerButton.addEventListener('click', function () {
                            console.log('Принять вызов');
                            // По нажатию на кнопку принятия вызова скрываем ее и показываем кнопки отмены и паузы
                            answerButton.style.display = 'none';
                            pauseButton.style.display = 'block';
                            cancelButton.style.display = 'block';

                            // Принять входящий вызов
                            incomingSession.answer(options);
                        });
                    });
                });
            } catch (error) {
                console.log('Ошибка при звонке: ' + error);
            }
        } else {
            console.log('Введите номер для звонка');
        }
    }

    document.querySelector('.button-call').addEventListener('click', makeCall);
});
