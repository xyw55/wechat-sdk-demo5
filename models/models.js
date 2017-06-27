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
  // mongo: {
  //   adapter: 'mongo',
  //   url: 'mongodb://localhost:27017/notes'
  // },
  mysql: {
    adapter: 'mysql',
    url: 'mysql://root:a19930927@localhost/notes'  
  }
};
// 数据集合 
// 报道流程
var number = Waterline.Collection.extend({
  identity:'number',
  connection:'mysql',
  schema:true,
  attributes:{
    //报道号码
    numid:{
      type:'integer',
      // type:'string',
      // size:10,
      required:true,   
    },
    //学号
    stuid:{
      type:'string',
      size:10,
      required:true,
    },
    //是否签到
    sign:{
      type:'boolean',
      // size:1,
      required:true,
    }
  }
});
var orm = new Waterline();
  
// 加载数据集合  
orm.loadCollection(number);
// orm.loadCollection(Note);
  
var config = {
  adapters: adapters,
  connections: connections  
};
  
exports.orm = orm;
exports.config = config;
