const path = require('path')
const fs = require('fs')
const fileUtils = require('../utils/file_utils')
const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const { json } = require('stream/consumers')
//创建WebSocket服务器端的对象，绑定的端口号是9998
const wss = new WebSocket.Server({
    port: 9998
})
const jname = {
    "玄武区": "xuanwu",
    "秦淮区": "qinhuai",
    "建邺区": "jianye",
    "鼓楼区": "gulou",
    "浦口区": "pukou",
    "栖霞区": "qixia",
    "雨花台区": "yuhuatai",
    "江宁区": "jiangning",
    "六合区": "liuhe",
    "溧水区": "lishui",
    "高淳区": "gaochun"
}
const pmap = {
    "L": "liuhe",
    "P": "pukou",
    "Q": "qixia",
    "G": "gulou",
    "X": "xuanwu",
    "Y": "jianye",
    "T": "yuhuatai",
    "J": "jiangning",
    "S": "lishui",
    "H": "qinhuai",
    "C": "gaochun"
}

const isInPolygon = (checkPoint, polygonPoints) => {
    var counter = 0;
    var i;
    var xinters;
    var p1, p2;
    var pointCount = polygonPoints.length;
    p1 = polygonPoints[0];

    for (i = 1; i <= pointCount; i++) {
        p2 = polygonPoints[i % pointCount];
        if (
            checkPoint[0] > Math.min(p1[0], p2[0]) &&
            checkPoint[0] <= Math.max(p1[0], p2[0])
        ) {
            if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
                if (p1[0] != p2[0]) {
                    xinters =
                        ((checkPoint[0] - p1[0]) * (p2[1] - p1[1])) / (p2[0] - p1[0]) +
                        p1[1];
                    if (p1[1] == p2[1] || checkPoint[1] <= xinters) {
                        counter++;
                    }
                }
            }
        }
        p1 = p2;
    }
    if (counter % 2 == 0) {
        return false;
    } else {
        return true;
    }
}
// 判断点在哪个多边形内

const solve = (tmp, updata) => {
    const positionarr = ["玄武区", "秦淮区", "建邺区", "鼓楼区", "浦口区", "栖霞区", "雨花台区", "江宁区", "六合区", "溧水区", "高淳区"]
    // console.log(tmp);
    const res = [];
    const n = updata.length, m = tmp.length;
    for (let i = 0; i < n; i++) {
        const checkPoint = [parseFloat(updata[i].longitude), parseFloat(updata[i].dimension)];
        let f = false;
        for (let j = 0; j < m; j++) {
            if (isInPolygon(checkPoint, tmp[j])) {
                f = true;
                res.push(positionarr[j]);
                break;
            }
        }
    }
    console.log(res);
    return res;
}









//服务端开启了监听
module.exports.listen = () => {
    wss.on('connection', client => {
        console.log('有客户端连接成功了...')
        client.on('message', async msg => {
            console.log('客户端发送数据给服务端了：' + msg)
            let payload = JSON.parse(msg)
            const action = payload.action
            if (action === 'getData') {
                let fname = pmap[payload.chartName.split('')[0]];
                let filePath = "";
                if (payload.isL === 1) {
                    filePath = '../data/' + fname + '/' + payload.chartName + '.json';
                } else {
                    filePath = '../data/' + payload.chartName + '.json';
                }
                //payload.chartName //trend seller map rank hot stock
                filePath = path.join(__dirname, filePath)
                const ret = await fileUtils.getFileJsonData(filePath)
                //需要在服务端获取到数据的基础上，增加一个data的字段
                //data所对应的值，就是某个json文件的内容
                payload.data = ret
                client.send(JSON.stringify(payload))
            } else if (action === 'judge') {
                let filePath = '../data/accpass.json'
                filePath = path.join(__dirname, filePath)
                const ret = await fileUtils.getFileJsonData(filePath)
                // payload.data = {
                //     status: 0,
                //     tn: "sf"
                // }
                // client.send(JSON.stringify(payload))
                let tmp = JSON.parse(ret)
                for (let i = 0; i < tmp.length; i++) {
                    if (tmp[i].name === payload.name) {
                        if (tmp[i].account === payload.account && tmp[i].passWord === payload.passWord) {
                            //生成token
                            const token = jwt.sign({
                                id: tmp[i].id
                            }, 'secret', { expiresIn: 1000 * 20 })
                            console.log(token)
                            payload.data = {
                                status: 0,
                                token
                            }
                            console.log(payload.data)
                        }
                    }
                }
                client.send(JSON.stringify(payload))
            } else if (action === 'updateData') {
                // console.log(payload.viewName)
                let viewName = payload.viewName
                let fname = pmap[viewName.split('')[0]]; // 站点所在的区对应的文件夹s


                let cursor = payload.cursor
                let filePath = '../data/' + fname + '/' + viewName + '.json'
                filePath = path.join(__dirname, filePath)
                const ret = await fileUtils.getFileJsonData(filePath)
                let tmp = JSON.parse(ret)
                tmp.splice(cursor, 1, payload.updata)
                let str = JSON.stringify(tmp);
                fs.writeFile(filePath, str, function (err) {
                    if (err) {
                        console.log("新增失败")
                    } else {
                        console.log("新增成功")
                    }
                })
            } else if (action === 'addpeo') {

                let gmap = {

                }
                console.log(payload.updata, payload.time);
                let tpdata = payload.updata;
                // console.log(tpdata[0][8]);

                // let tmp = new Array(20).fill(0).map(() => new Array())
                let tdata = '', tname = '';
                for (let i = 0; i < tpdata.length; i++) {

                    let f = -1;
                    for (let j = tpdata[i].length - 1; j >= 0; j--) {
                        if (tpdata[i][j] >= 'A' && tpdata[i][j] <= 'Z') {
                            // console.log(tpdata[i][j]);
                            tdata = pmap[tpdata[i][j]];
                            // console.log(tdata);
                            f = j;
                        }
                    }
                    tname = tpdata[i].substring(f, tpdata[i].length);
                    // console.log(tname);
                    // let filePath = '../data/' + tdata + '/' + tname + '.json';
                    // console.log(filePath);
                    // filePath = path.join(__dirname, filePath)
                    // const ret = await fileUtils.getFileJsonData(filePath);
                    // let tmp = JSON.parse(ret);
                    // console.log(tmp);
                    let t1 = -1; // t1记录第一个空格的位置
                    for (let k = 0; k < tpdata[i].length; k++) {
                        if (tpdata[i][k] == ' ') {
                            t1 = k;
                            break;
                        }
                    }
                    if (!gmap[tname]) {
                        gmap[tname] = []
                    }
                    gmap[tname].push({
                        id: tpdata[i].substring(t1 + 1, f - 1),
                        name: tpdata[i].substring(0, t1),
                        sex: parseInt(tpdata[i].substring(t1 + 1, f - 1)[16]) % 2 == 0 ? "女" : "男",
                        time: payload.time[i],
                        place: tname,
                        result: "waiting",
                        inde: 2,
                        flag: false,
                        error: 0
                    })
                }
                for (const key in gmap) {
                    let filePath = '../data/' + pmap[key[0]] + '/' + key + '.json'; // **
                    filePath = path.join(__dirname, filePath);
                    const ret = await fileUtils.getFileJsonData(filePath);
                    // let tpw = JSON.parse(ret);
                    // tpw = tpw.concat(tmp);
                    let strk = JSON.stringify(gmap[key]);
                    fs.writeFile(filePath, strk, function (err) {
                        if (err) {
                            console.log("新增失败")
                        } else {
                            console.log("新增成功")
                        }
                    })
                }
                // const token = jwt.sign({
                //     id: tmp[i].id
                // }, 'secret', { expiresIn: 1000 * 60 * 2 })
                // console.log(token)
                // let pload = {}
                // pload.data = {
                //     action: 'getalldata',
                //     token_s:token
                // }
                // client.send(pload);

            } else if (action === 'addnewposition') {
                console.log(payload.updata);
                // console.log(solve(2));
                let filePath = '../data/coordinates.json';
                filePath = path.join(__dirname, filePath);
                const ret = await fileUtils.getFileJsonData(filePath);
                let tmp = JSON.parse(ret); // 各个区县边界的文件
                payload.data = solve(tmp, payload.updata); // payload.data中存储的是返回的站点名称
                console.log(payload);
                const obj = {
                    "玄武区": "sellerxuan",
                    "秦淮区": "sellerqin",
                    "建邺区": "sellerjian",
                    "鼓楼区": "sellergu",
                    "浦口区": "sellerpu",
                    "栖霞区": "sellerqi",
                    "雨花台区": "selleryu",
                    "江宁区": "sellerjiang",
                    "六合区": "sellerliu",
                    "溧水区": "sellerli",
                    "高淳区": "sellergao"
                };
                const dataarr = payload.data;
                const flagobj = {
                    "玄武区": [],
                    "秦淮区": [],
                    "建邺区": [],
                    "鼓楼区": [],
                    "浦口区": [],
                    "栖霞区": [],
                    "雨花台区": [],
                    "江宁区": [],
                    "六合区": [],
                    "溧水区": [],
                    "高淳区": []
                };
                for (let i = 0; i < dataarr.length; i++) {
                    flagobj[dataarr[i]].push(i);
                }
                for (const key in flagobj) {
                    if (flagobj[key].length != 0) {
                        let str = obj[key];
                        let filepath = '../data/' + str + '.json';
                        filepath = path.join(__dirname, filepath);
                        const rett = await fileUtils.getFileJsonData(filepath);
                        let tmpp = JSON.parse(rett);
                        for (let i = 0; i < flagobj[key].length; i++) {
                            let k = flagobj[key][i];
                            let name = payload.updata[k].name, value = 0;
                            tmpp.push({ name, value });
                        }
                        console.log(tmpp);
                        let strr = JSON.stringify(tmpp);
                        fs.writeFile(filepath, strr, function (err) {
                            if (err) {
                                console.log("新增失败")
                            } else {
                                console.log("新增成功")
                            }
                        })
                    }
                }
                let filepathk = '../data/map.json';
                filepathk = path.join(__dirname, filepathk);
                const retk = await fileUtils.getFileJsonData(filepathk);
                let tmpk = JSON.parse(retk);
                for (let i = 0; i < tmpk.length; i++) {
                    let strname = tmpk[i].name;
                    strname = strname.substring(0, strname.length - 2);
                    // console.log(strname);
                    if (flagobj[strname].length != 0) { // 如果tmpk[i]区有新增的节点则新建节点文件且把把该区添加到map.json文件
                        for (let j = 0; j < flagobj[strname].length; j++) {
                            let k = flagobj[strname][j];
                            let fpath = '../data/' + jname[strname] + '/' + payload.updata[k].name + '.json';
                            fpath = path.join(__dirname, fpath);
                            let messages =
                                [
                                ];
                            messages = JSON.stringify(messages);
                            fs.writeFile(fpath, messages, function (err) {
                                if (err) {
                                    console.log("新增失败")
                                } else {
                                    console.log("新增成功")
                                }
                            })
                            let name = payload.updata[k].name, longitude = payload.updata[k].longitude, dimension = payload.updata[k].dimension;
                            let value = [longitude, dimension];
                            tmpk[i].children.push({ name, value });
                        }
                    }
                }
                let strk = JSON.stringify(tmpk);
                fs.writeFile(filepathk, strk, function (err) {
                    if (err) {
                        console.log("新增失败")
                    } else {
                        console.log("新增成功")
                    }
                })



                client.send(JSON.stringify(payload));
            } else {
                //原封不动的将所接收到的数据转发给每一个处于连接状态的客户端
                //wss.clients //所有客户端的连接
                wss.clients.forEach(client => {
                    client.send(JSON.stringify(JSON.parse(msg)))
                })
            }

            // client.send('hello socket from backend')
        })
    })
}
