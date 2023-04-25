//服务入口文件
//1.创建koa对象
const Koa = require('koa');
const jwt = require('koa-jwt')
const app = new Koa();//app为koa的实例对象
//2.绑定中间件
//绑定第一层中间件
const respDurationMiddleware = require('./middleware/koa_response_duration');
app.use(respDurationMiddleware);
//绑定第二层中间件
const respHeaderMiddleware = require('./middleware/koa_response_header');
app.use(respHeaderMiddleware);
//绑定第三层中间件
const respDataMiddleware = require('./middleware/koa_response_data');
app.use(respDataMiddleware);
//3.绑定端口号
app.listen(8808);

const WebSocketService = require('./service/web_socket_service');
//开启服务端的监听，监听客户端的连接
WebSocketService.listen()
