var express = require('express');

var app = express();

// app.set('view engine', 'jade'); // 设置模板引擎
app.set('view engine', 'ejs');
app.set('views', './views');  // 设置模板相对路径(相对当前目录)

app.locals.basedir = './'

var port = 80 ;  //BAE 百度应用引擎默认端口号
 //中间件定义
app.use(express.logger());
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());

//静态资源

app.use(express.static('./static'));

//启动服务
app.listen(port, function() {
	console.log('服务启动成功！请访问 http://localhost:' + port);
});


//启动路由分发
require('./router/router').init(app);

