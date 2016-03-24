"use strict";
let fs = require('fs');
let errno = require('./errno.js');
try {
    fs.statSync('./config.js')
} catch (e) {
    if (e.errno !== -2) {
        throw errno(e.errno)
    }
    console.log('创建配置文件...');
    let defaultConfig = []
    defaultConfig.push('"use strict";')
    defaultConfig.push('let setting = {};setting.server = {};setting.interface = {}')
    defaultConfig.push('//配置文件 (别改上面的)')
    defaultConfig.push('')
    defaultConfig.push('//服务器端口号')
    defaultConfig.push('setting.server.port = 8080')
    defaultConfig.push('')
    defaultConfig.push('//网页标题')
    defaultConfig.push('setting.interface.title = "皮肤服务器"')
    defaultConfig.push('')
    defaultConfig.push('')
    defaultConfig.push('')
    defaultConfig.push('')
    defaultConfig.push('//不要改下面的东西')
    defaultConfig.push('module.exports = setting;')
    fs.writeFileSync('./config.js', defaultConfig.join('\n'));
    console.log('config.js 创建成功');
}

try {
    fs.statSync('./textures')
} catch (e) {
    if (e.errno !== -2) {
        throw errno(e.errno)
    }
    fs.mkdirSync('./textures')
}
