export function handNumber(numberStr) {
    const number = parseFloat(numberStr);
    if (number > 100000000) {
        let wan = (number / 100000000).toFixed(1);
        wan = wan.replace(/.0$/, '');
        return wan + '亿';
    }
    else if (number > 10000) {
        let wan = (number / 10000).toFixed(1);
        wan = wan.replace(/.0$/, '');
        return wan + '万';
    }
    else {
        return numberStr;
    }
}
export function handFixed(numberStr) {
    const number = parseFloat(numberStr);
    const wan = number.toFixed(2);
    return wan;
}
//# sourceMappingURL=handleNumber.js.map