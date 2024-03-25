// функция сохранения исходящих звонков
export function saveCallNumberOut(number) {
    let callHistoryOut =
        JSON.parse(localStorage.getItem('callHistoryOutCall')) || [];
    callHistoryOut.unshift(number);
    localStorage.setItem('callHistoryOutCall', JSON.stringify(callHistoryOut));
}

// функция сохранения входящих звонков
export function saveCallNumberIncom(number) {
    let callHistoryIncom =
        JSON.parse(localStorage.getItem('callHistoryIncomingCall')) || [];
    callHistoryIncom.unshift(number);
    localStorage.setItem(
        'callHistoryIncomingCall',
        JSON.stringify(callHistoryIncom)
    );
}
