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

	var getToken = require('../sign/token').getToken;

	
	app.get('/',function(req,res){
		//var url = req.protocol + '://' + req.host + req.path;
		var url = req.protocol + '://' + req.host + req.originalUrl; //获取当前url
		console.log(req);
		signature.sign(url,function(signatureMap){
			signatureMap.appId = wechat_cfg.appid;
			res.render('index',{"signatureMap":signatureMap});
		});
	});

	app.get('/auth',function(req,res){
		var token = "";
		getToken(appID, appSecret).then(function(res){
    		token = res.access_token;
    	});

		//var url = req.protocol + '://' + req.host + req.path;
		var myurl = req.protocol + '://' + req.host + req.originalUrl; //获取当前url
		console.log(myurl);
		var code = url.parse(req.url,true).query.code;
        var link = 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+token+'&code='+code;
        console.log(new Date()+' and the code is '+code+' Now getting the Number...');
        var res = https.get(link, function(data){
            var bodyChunks = '';
            data.on('data',function(chunk){
                bodyChunks += chunk;
            });
            data.on('end',function(){
                var body = JSON.parse(bodyChunks);
                console.log(body);
                if (body.UserId) {
                    req.session.No = body.UserId;
                    console.log(req.session.No);
                    signature.sign(url, function(signatureMap){
						signatureMap.appId = wechat_cfg.appid;
						signatureMap.UserId = body.UserId;
						res.render('index',{"signatureMap":signatureMap});
					});
                }else{
                    console.dir(body);
                }
            });
		});
    });

};
