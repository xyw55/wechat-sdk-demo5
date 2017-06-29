var Waterline = require('waterline');
var mysqlAdapter = require('sails-mysql');
var mongoAdapter = require('sails-mongo');
//需要先npm install 安装上面三个模块  

// 适配器  
var adapters = {
  mongo: mongoAdapter,
  mysql: mysqlAdapter,
  default: 'mysql'  
};
// 连接  
var connections = {
  mysql: {
    adapter: 'mysql',
    url: 'mysql://root:a19930927@localhost/Room'  
  }
};
// 数据集合 
var login = Waterline.Collection.extend({
  identity:'login',
  connection:'mysql',
  schema:true,
  autoPK:false,
  attributes:{
    //报道号码
    id:{
      type:'integer',
      required:true, 
      autoIncrement: true,
      primaryKey:true,  
    },
    //学号
    S_number:{
      type:'string',
      size:10      
    },
    tiem:{
      required:true,
      type:"timestamp",
      // defaultsTo:function(){
      // return new Date();
      // }
    }
  },
  autoCreatedAt:false,  //waterline会给collection自动加上createdAt和updatedAt字段，这里设置不加这两个字段
  autoUpdatedAt:false,
});
var setup = Waterline.Collection.extend({
  identity:'setup',
  connection:'mysql',
  schema:true,
  // autoPK:false,   //此字段为 true 时,数据表会自动生成 id 唯一标识字段
  attributes:{
    //设置叫号间隔
    interval:{
      type:'integer',
      required:true, 
    },
    //设置推送即将取号消息的数量
    message_num:{
      type:'integer',
      required:true, 
    },  
  },
  autoCreatedAt:false,  //waterline会给collection自动加上createdAt和updatedAt字段，这里设置不加这两个字段
  autoUpdatedAt:false,
});
var orm = new Waterline();

// 加载数据集合  
orm.loadCollection(login);
orm.loadCollection(setup);
  
var config = {
  adapters: adapters,
  connections: connections  
};
  
exports.orm = orm;
exports.config = config;
