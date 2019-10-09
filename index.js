const myconnect = require("./mysqlConnection");
const config = require("./config.js");
const express = require("express");
const staticex = require("express-static");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const consolidate = require('consolidate');
const multer = require("multer");
const server = express();
const upload = multer({dest:'./staticfile/upload/'});
const user = require("./router/user.js");
const teachact = require("./router/teacher.js")
const queryact = require("./router/query.js")
const nms = require("./streamServer").nms;
const http = require('http').Server(server);

const fs = require('fs');
const privateKey  = fs.readFileSync('./2199690_esion.xin.key', 'utf8');
const certificate = fs.readFileSync('./2199690_esion.xin.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const https = require('https').Server(credentials,server);
const io = require('socket.io')(https);
myconnect.connect(config.database);

//监听端口
http.listen(config.serverPoint, function(){
  console.log(`listening on *:${config.serverPoint}`);
});
https.listen(config.serverPoints, function(){
  console.log(`https listening on *:${config.serverPoints}`);
});
nms.run();
//添加cookie和session
io.on('connection', function(socket){
  console.log('an user connected');
	socket.on('room', function(room){
    console.log('join room: ' + room);
		socket.join(room);
		socket.on('chat message', function(msg){
	    console.log('message: ' + msg.user);
			socket.broadcast.to(room).emit('chat message', msg);
	  });
		socket.on('chat audio', function(msg){
	    console.log('message: ' + msg.user);
			socket.broadcast.to(room).emit('chat audio', msg);
	  });
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
var key_rand = [];
for (var i = 0; i <= 10000; i++) {
	key_rand.push("sess_key"+Math.random()*10000);
}
server.use(cookieParser("asdwad"));
server.use(cookieSession({
	keys:key_rand
}));




server.set('view engine','html');
// 模板位置
server.set('views','./views');
// 使用ejs引擎去解析html，这里可以设置多种多对
server.engine('html',consolidate.ejs);
//解析post数据
server.use(bodyParser.urlencoded({
	extended: true,
	limit: 2*1024*1024
}))
server.use(upload.single('heardfile'));

//识别css等静态文件,不引入将不知道外部样式表
server.use('/public',staticex("./staticfile"));
server.use('/teach',teachact);
server.use('/query',queryact);
server.use('/',user);
