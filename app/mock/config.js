/**
 * 设置开发模式,服务模式,演示模式
 */
const path = require('path');
const config = {
  '/api/menu/header': {
    method: 'get',
    data: './modeConfig.json'
  },
  '/api/menu/logOut': {
    method: 'logOut',
    data: './logOut.json'
  }
};

for(let item in config) {
  if(config.hasOwnProperty(item)) {
    config[item].path = path.resolve(__dirname,config[item].data);
    config[item].target = 'http://localhost:3000';
  }
}

module.exports = config;
