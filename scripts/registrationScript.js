document.addEventListener('DOMContentLoaded', function () {
    // слушатель на форме регистрации
    function registrationForm() {
        const form = document.getElementById('form-registration');

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const server = document.getElementById('server').value;
            localStorage.setItem('server', server);
            const login = document.getElementById('login').value;
            localStorage.setItem('login', login);
            const password = document.getElementById('password').value;
            localStorage.setItem('password', password);

            try {
                var socket = new JsSIP.WebSocketInterface(`wss://${server}`);

                var configuration = {
                    sockets: [socket],
                    uri: `sip:${login}@${server}`,
                    password: password,
                };

                var softphone = new JsSIP.UA(configuration);

                softphone.start();

                softphone.on('registered', function () {
                    window.location.href = 'main-content.html';
                });

                softphone.on('registrationFailed', function (e) {
                    alert(`Registration failed: ${e.cause}`);
                });
            } catch (error) {
                alert(`Registration failed: ${error}`);
            }
        });
    }
    registrationForm();
});
