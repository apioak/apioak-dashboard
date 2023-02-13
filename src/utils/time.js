//时间戳(秒) 转为年-月-日 时:分:秒
export var formatDate = function (date) {
    if (date !== '' && date !== undefined) {

        date = new Date(date * 1000)

        var y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate(),
            h = date.getHours(),
            i = date.getMinutes(),
            s = date.getSeconds();

        if (m < 10) {
            m = '0' + m;
        }
        if (d < 10) {
            d = '0' + d;
        }
        if (h < 10) {
            h = '0' + h;
        }
        if (i < 10) {
            i = '0' + i;
        }
        if (s < 10) {
            s = '0' + s;
        }
        var t = y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;

        return t
    } else {
        return ''
    }
};