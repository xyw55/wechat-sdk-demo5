exports.init = function (app) {
	var wechat_cfg = require('../config/wechat.cfg');
	var http = require('http');
	var https = require('https');
	var cache = require('memory-cache');
	var sha1 = require('sha1'); //签名算法
	//var url = require('url');
	var signature = require('../sign/signature');
	var url = require('url');
	var appID = wechat_cfg.appid;
	var appSecret = wechat_cfg.secret;
    var qr = require('qr-image');      //生成二维码插件qr-image
    var fs = require('fs');

	var getToken = require('../sign/token').getToken;
    // models
    var models = require('../models/models');
    //初始化 
    var config = models.config;
    models.orm.initialize(config, function(err, models) {
      if(err) {
        console.error('orm initialize failed.', err)
        return;
      }
      app.models = models.collections;
    });
    var interval,massage_num,section;
// 	app.get('/auth',function(req,res){
// 		getToken(wechat_cfg.accessTokenUrl).then(function(accessToken){   //accessToken就是token.js中的Promise中的值，即rosolve返回的result
//     		var token = accessToken.access_token;
//     	//	console.log(token);
//     		var code = url.parse(req.url,true).query.code;    //企业微信后台验证Uri的域名并生成CODE，uri?code=code&state=state
// 	        var link = 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+token+'&code='+code;   //获取用户信息
// 	  //      console.log(new Date()+' and the code is '+code+' Now getting the Number...');
// 	//        console.log(link);
// 	        var result = https.get(link, function(data){
// 	            var bodyChunks = '';
// 	            data.on('data',function(chunk){
// 	                bodyChunks += chunk;
// 	            });
// 	            data.on('end',function(){
// 	                var body = JSON.parse(bodyChunks);
// //	                console.log(body);
// 	                if (body.UserId) {
// 						var sign_url = req.protocol + '://' + req.host + req.originalUrl; //获取当前url
// //						console.log(sign_url,req.originalUrl);
// //						console.log("============");
// 	                    signature.sign(sign_url, function(signatureMap){
// 							signatureMap.appId = wechat_cfg.appid;
// 							signatureMap.UserId = body.UserId;
// 							res.render('index',{"signatureMap":signatureMap});
// 						});
// 	                }else{
// 	                    console.dir(body);
// 	                }
// 	            });
// 			});

//     	});			
//     });

//     app.post('/location',function(req,res){     //post请求的参数在body里面
// 		//var url = req.protocol + '://' + req.host + req.path;
// 		var url = req.protocol + '://' + req.host + req.originalUrl; //获取当前url
// 		console.log("req.body",req.body);

// 		// signature.sign(url,function(signatureMap){
// 		// 	signatureMap.appId = wechat_cfg.appid;
// 		// 	signatureMap.UserId = req.body.UserId;
// 		// 	res.render('index',{"signatureMap":signatureMap});
// 		// });
//         stuid = req.body.userId;
//         locat = req.body.location;
//         console.log("================",stuid,typeof(locat))
//         if (locat == "true"){
//             app.models.number.findOne({stuid:stuid}, function(err, art) {
//             if (err) {
//                 console.log(err);
//                 return res.render('get_num',{
//                     stuid: stuid,
//                     title: '取号',
//                     message: '系统异常！'
//                 });
//             }
//             if (art) {
//                 if(fs.existsSync('section.dat')){
//                   section = JSON.parse(fs.readFileSync('section.dat'));
//                   // console.log(token);
//                 }
//                 else{
//                     section = {"min":0,"max":0}
//                 }
//                 res.render('get_num', {
//                         title: "报道取号",
//                         stuid: stuid,
//                         art: art,
//                         min:section.min,
//                         max:section.max,
//                     });
//                     console.log("art",art);
//             }
//             else{        
//                 app.models.number.find({stuid:{'!':null},limit: 1, sort: 'numid DESC' }, function(err, num_id){
//                     console.log("num_id",num_id)
//                     if(num_id.length!=0) {
//                         console.log("true",num_id[0].numid)
//                         var newUser = {
//                             stuid: stuid,
//                             sign: false,
//                             numid:num_id[0].numid+1
//                         };
//                     }
//                     else {
//                         var newUser = {
//                             stuid: stuid,
//                             sign: false,
//                             numid:1
//                         };                
//                     }
//                     app.models.number.create(newUser, function(err, art) {
//                         if(err) {
//                             return res.render('get_num',{
//                                 stuid: stuid,
//                                 title: '取号',
//                                 message: '系统异常！'
//                             });
//                         } 
//                         else {
//                             if(fs.existsSync('section.dat')){
//                               section = JSON.parse(fs.readFileSync('section.dat'));
//                             }
//                             else{
//                                 section = {"min":0,"max":0}
//                             }
//                             console.log('creat success :\n',art);
//                             res.render('get_num', {
//                                 title: "报道取号",
//                                 stuid: stuid,
//                                 art: art,
//                                 min:section.min,
//                                 max:section.max
//                             });
//                         }  
//                     });
//                 });
//                 }
//             });   
//         }
//         else{
//             res.render('outer', {
//                     title: "报道取号",
//                 });
//         }
// 	});
//     //生成二维码
//     app.get('/create_qrcode', function (req, res, next) {
//         var text = req.query.text;
//         try {
//             var img = qr.image(text,{size :10});
//             res.writeHead(200, {'Content-Type': 'image/png'});
//             img.pipe(res);
//         } catch (e) {
//             res.writeHead(414, {'Content-Type': 'text/html'});
//             res.end('<h1>414 Request-URI Too Large</h1>');
//         }
//     })
//     app.post('/QRCode',function(req,res){
//         res.render('QRCode', {
//                 title: "生成二维码",
//                 stuid:inputdata.UserId,
//             });
//     });
//     app.get("/sign",function(req,res){
//         getToken(wechat_cfg.accessTokenUrl).then(function(accessToken){   //accessToken就是token.js中的Promise中的值，即rosolve返回的result
//             var token = accessToken.access_token;
//         //  console.log(token);
//             var code = url.parse(req.url,true).query.code;    //企业微信后台验证Uri的域名并生成CODE，uri?code=code&state=state
//             var link = 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+token+'&code='+code;   //获取用户信息
//       //      console.log(new Date()+' and the code is '+code+' Now getting the Number...');
//     //        console.log(link);
//             var result = https.get(link, function(data){
//                 var bodyChunks = '';
//                 data.on('data',function(chunk){
//                     bodyChunks += chunk;
//                 });
//                 data.on('end',function(){
//                     var body = JSON.parse(bodyChunks);
//                     // console.log(body.UserId);
//                     app.models.number.findOne({stuid:body.UserId}, function(err, art){
//                         if(err) {
//                             console.log('err is :\n',err);
//                             return res.render('get_none',{
//                                 stuid: stuid,
//                                 title: '报道取号',
//                                 message: '请先取号'
//                             });
//                         } 
//                         else{
//                             if (art.sign==false) {
//                                 app.models.number.update({stuid:body.UserId},{sign:true}).exec(function afterwards(err, updated){
//                                 if (err) {
//                                 // handle error here- e.g. `res.serverError(err);`
//                                 return;
//                                 }
//                                 if (updated){
//                                     return res.render('sign',{
//                                         title: '报道取号',
//                                         message: '签到成功',
//                                         stuid:updated[0].stuid,
//                                         numid:updated[0].numid
//                                     });
//                                 }
//                                 });
//                             }
//                             else{
//                                 return res.render('sign',{
//                                     title: '取号',
//                                     message: '您已签到',
//                                     stuid:art.stuid,
//                                     numid:art.numid
//                                 });            
//                             }
//                         }
//                     });
//                 });            
//             });
//         });
//     });
    //保安设置取号区间
    app.get('/auth0',function(req,res){
        getToken(wechat_cfg.accessTokenUrl).then(function(accessToken){   //accessToken就是token.js中的Promise中的值，即rosolve返回的result
            var token = accessToken.access_token;
        //  console.log(token);
            var code = url.parse(req.url,true).query.code;    //企业微信后台验证Uri的域名并生成CODE，uri?code=code&state=state
            var link = 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+token+'&code='+code;   //获取用户信息
      //      console.log(new Date()+' and the code is '+code+' Now getting the Number...');
    //        console.log(link);
            var result = https.get(link, function(data){
                var bodyChunks = '';
                app.models.setup.findOne({interval:{'!':null}}, function(err, setup){
                    // console.log("setup=================",setup)
                    interval = setup.interval;
                    massage_num = setup.massage_num;
                });
                if(fs.existsSync('section.dat')){
                    section = JSON.parse(fs.readFileSync('section.dat'));
                    // section={"min":0,"max":section.max+interval};
                    // fs.writeFileSync('section.dat', JSON.stringify(section));
                    // section = JSON.parse(fs.readFileSync('section.dat'));
                }
                else{
                    section = {"min":0,"max":0}
                    fs.writeFileSync('section.dat', JSON.stringify(section));
                }
                data.on('data',function(chunk){
                    bodyChunks += chunk;
                });
                data.on('end',function(){
                    var body = JSON.parse(bodyChunks);
                    res.render('set',{title:"设置取号区间",min:section.min,max:section.max});
                });
            });

        });         
    });

    app.post('/set',function(req,res){
    //     console.log("req.body",req.body);
    //     min=req.body.min;
    //     max=req.body.max;
        // app.models.setup.findOne({interval:{'!':null}}, function(err, setup){
        //     // console.log("setup=================",setup)
        //     interval = setup.interval;
        //     massage_num = setup.massage_num;
        // });
        // var result={"min":min,"max":max};
        // fs.writeFileSync('section.dat', JSON.stringify(result));
        if(fs.existsSync('section.dat')){
            section = JSON.parse(fs.readFileSync('section.dat'));
            section={"min":1,"max":section.max+interval};
            fs.writeFileSync('section.dat', JSON.stringify(section));
            // section = JSON.parse(fs.readFileSync('section.dat'));
        }
        else{
            section = {"min":1,"max":interval};
            fs.writeFileSync('section.dat', JSON.stringify(section));
        }
        console.log('区间设置成功');
        console.log((section.max<=5))
        console.log('section.max-interval=========',section.max-interval);
        // return res.redirect('set');
        // 对号码区间内的学生推送消息
        app.models.login.find({id:{'>':section.max-interval}&&{'<=':section.max}}, function(err, stulist){
            console.log("stulist",stulist)
            if(stulist) {
                var stustr = stulist[0].S_number;
                for(var i=1;i<stulist.length;i++){
                    stustr = stustr + "|" + stulist[i].S_number
                }
                console.log("stustr",stustr)
                getToken(wechat_cfg.accessTokenUrl).then(function(accessToken){   //accessToken就是token.js中的Promise中的值，即rosolve返回的result
                    var token = accessToken.access_token;
                //  console.log(token);
                    var request=require('request');

                    var options = {
                        headers: {"Connection": "close"},
                        url: 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token='+token,
                        method: 'POST',
                        json:true,
                        body: {"touser" : stustr,
                       "toparty" : "",
                       "totag" : "",
                       "msgtype" : "text",
                       "agentid" : "83",
                       "text" : {
                           "content" : "已叫到您的号码，现在可以报道了。"
                       },
                       "safe":0}
                    };

                    function callback(error, response, data) {
                        if (!error && response.statusCode == 200) {
                            console.log('----info------',data);
                        }
                    }
                    request(options, callback);
                });         
            }
        });
        //对即将要叫到号码的学生推送消息
        app.models.login.find({id:{'>':section.max}&&{'<=':section.max+massage_num}}, function(err, stulist){
            console.log("stulist",stulist)
            if(stulist) {
                var stustr = stulist[0].S_number;
                for(var i=1;i<stulist.length;i++){
                    stustr = stustr + "|" + stulist[i].S_number
                }
                console.log("stustr",typeof(stustr))
                getToken(wechat_cfg.accessTokenUrl).then(function(accessToken){   //accessToken就是token.js中的Promise中的值，即rosolve返回的result
                    var token = accessToken.access_token;
                //  console.log(token);
                    var request=require('request');

                    var options = {
                        headers: {"Connection": "close"},
                        url: 'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token='+token,
                        method: 'POST',
                        json:true,
                        body: {"touser" : stustr,
                       "toparty" : "",
                       "totag" : "",
                       "msgtype" : "text",
                       "agentid" : "83",
                       "text" : {
                           "content" : "即将叫到您的号码，请准备报道。"
                       },
                       "safe":0}
                    };

                    function callback(error, response, data) {
                        if (!error && response.statusCode == 200) {
                            console.log('----info------',data);
                        }
                    }
                    request(options, callback);
                });         

            }
        });
        return res.render('set',{title:"设置取号区间",min:section.min,max:section.max});       
    });
}