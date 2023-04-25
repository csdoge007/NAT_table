export const time = {
    change() {
        let datetime = document.querySelector('.datetime');
        let dt = new Date()
        let y = dt.getFullYear()
        let mt =  dt.getMonth() + 1
        let day = dt.getDate()
        let h = dt.getHours() //获取时
        let m = dt.getMinutes() //获取分
        let s = dt.getSeconds() //获取秒
        datetime.innerHTML =
            "当前时间：" +
            y +
            "年" +
            mt +
            "月" +
            day +
            "日-" +
            h +
            "时" +
            m +
            "分" +
            s +
            "秒";
    },
    // 防抖函数
    debounce(func,wait,immediate) {
        let timeout,result;
        let debounced = function() {
            let context = this;
            let args = arguments;
            if(timeout) clearTimeout(timeout);
            if(immediate){
                let flag = !timeout;
                timeout = setTimeout(function() {
                    timeout = null;
                },wait);
                if(flag) result = func.apply(context,args);
            }else{
                timeout = setTimeout(function() {
                    func.apply(context,args);
                },wait);
            }
            return result;
        }
        debounced.cancel = function() {
            clearTimeout(timeout);
            timeout = null;
        }
        return debounced;
    }

}