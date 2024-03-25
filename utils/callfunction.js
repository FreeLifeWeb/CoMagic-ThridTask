import { accessConstants } from './accessConstants.js';
import { startCallTimer } from './callTime.js';
import { saveCallNumberIncom, saveCallNumberOut } from './saveCallNumbers.js';

let session;
let stopTimer;
const accessConstant = accessConstants();
// функция звонка
function makeCall(number) {
    console.log('currentNumber', number);
    if (number) {
        saveCallNumberOut(number);
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
                        console.log('Звонок в процессе' + e.data);
                        accessConstant.pauseButton.style.display = 'block';
                        accessConstant.cancelButton.style.display = 'block';
                        accessConstant.callTime.style.display = 'block';
                        accessConstant.answerButton.style.display = 'none';
                        stopTimer = startCallTimer();
                    },
                    failed: function (e) {
                        console.log('Не удалось совершить звонок: ' + e.cause);
                        alert('Не удалось совершить звонок: ' + e.cause);
                        accessConstant.abonentName.textContent = '';
                    },
                    ended: function (e) {
                        console.log('Звонок завершен: ' + e.cause);
                        accessConstant.pauseButton.style.display = 'none';
                        accessConstant.cancelButton.style.display = 'none';
                        accessConstant.callTime.style.display = 'none';
                        accessConstant.abonentName.textContent = '';
                    },
                    confirmed: function (e) {
                        console.log('Звонок подтвержден');
                    },
                };

                var options = {
                    eventHandlers: eventHandlers,
                    pcConfig: {
                        hackStripTcp: true,
                        iceServers: [],
                    },
                    mediaConstraints: {
                        audio: true,
                        video: false,
                    },
                    rtcOfferConstraints: {
                        offerToReceiveAudio: 1,
                        offerToReceiveVideo: 0,
                    },
                };
                session = softForCall.call(
                    `sip:${number}@${localStorage.getItem('server')}`,
                    options
                );

                // Обработчик входящего вызова
                softForCall.on('newRTCSession', function (e) {
                    console.log('Получен входящий вызов');
                    let incomingSession = e.session;
                    if (incomingSession) {
                        // console.log(incomingSession);
                        let incomingNumber = e.request.from.uri.user;
                        accessConstant.abonentName.textContent =
                            'Входящий звонок от ' + incomingNumber;
                        saveCallNumberIncom(incomingNumber);
                        // console.log('incomingNumber', incomingNumber);

                        // Воспроизведение звукового сигнала о входящем вызове
                        // console.log('Входящий звонок - динь-динь!!');
                        // Показываем кнопку принятия вызова и скрываем кнопки отмены и паузы
                        accessConstant.answerButton.style.display = 'block';
                        accessConstant.pauseButton.style.display = 'none';
                        accessConstant.cancelButton.style.display = 'none';

                        // Обработчик нажатия на кнопку принятия вызова
                        accessConstant.answerButton.addEventListener(
                            'click',
                            function () {
                                console.log('Принять вызов');
                                stopTimer = startCallTimer();
                                accessConstant.callTime.style.display = 'block';
                                accessConstant.answerButton.style.display =
                                    'none';
                                accessConstant.pauseButton.style.display =
                                    'block';
                                accessConstant.cancelButton.style.display =
                                    'block';

                                // Принять входящий вызов
                                incomingSession.answer(options);

                                incomingSession.connection.addEventListener(
                                    'addstream',
                                    function (event) {
                                        console.log(
                                            'Аудио поток собеседника получен'
                                        );
                                        let remoteStream = event.stream;

                                        let audioElement =
                                            document.createElement('audio');
                                        audioElement.id = 'remoteAudio';
                                        audioElement.autoplay = true;
                                        audioElement.style.display = 'none';

                                        // Подключаем аудио поток собеседника к аудио элементу
                                        audioElement.srcObject = remoteStream;

                                        // Добавляем аудио элемент на страницу
                                        document.body.appendChild(audioElement);
                                    }
                                );

                                incomingSession.on('ended', function () {
                                    stopTimer();
                                    accessConstant.abonentName.textContent = '';
                                });

                                // Получаем доступ к микрофону и передаем его аудио потоку
                                navigator.mediaDevices
                                    .getUserMedia({ audio: true })
                                    .then(function (stream) {
                                        // Записываем медиапоток в локальную переменную
                                        window.localStream = stream;
                                        // Передаем медиапоток в аудио поток сессии
                                        // console.log(incomingSession.connection);
                                        incomingSession.connection.addStream(
                                            window.localStream
                                        );
                                    })
                                    .catch(function (err) {
                                        console.log(
                                            'Ошибка при получении доступа к микрофону: ' +
                                                err
                                        );
                                    });
                            }
                        );
                    }
                });

                // Обработчик нажатия на кнопку отмены разговора
                function endConversation() {
                    console.log('Отменить звонок');
                    // console.log(session);
                    if (session && session.isEstablished()) {
                        session.terminate(); // Отмена текущего разговора
                    }

                    accessConstant.pauseButton.style.display = 'none';
                    accessConstant.cancelButton.style.display = 'none';
                    accessConstant.callTime.style.display = 'none';
                    accessConstant.answerButton.style.display = 'none';
                    accessConstant.abonentName.textContent = '';
                    stopTimer();
                }
                accessConstant.cancelButton.addEventListener(
                    'click',
                    endConversation
                );
            });
        } catch (error) {
            console.log('Ошибка при звонке: ' + error);
        }
    } else {
        console.log('Введите номер для звонка');
    }
}

export default makeCall;
