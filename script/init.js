"use strict";
const fs = require('fs');
const errno = require('./errno.js');
const ecc = require('eccjs');
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const db = low('db.json', {
    storage
})

let createECC = (remove, log) => {
    console.log(log);
    if (remove) {
        db('eccKey').remove()
    }
    let keys = ecc.generate(ecc.ENC_DEC)
    db('eccKey').push({
        dec: keys.dec,
        enc: keys.enc
    })
}

if (!db('eccKey').find()) {
    createECC(false, '=> 创建ECC加密密匙...');
}

try {
    ecc.decrypt(db('eccKey').find().dec, ecc.encrypt(db('eccKey').find().enc, 'hello world!')) !== 'hello world!'
} catch (e) {
    createECC(true, '=> ECC密匙损坏, 重新创建...');
} finally {
    if (ecc.decrypt(db('eccKey').find().dec, ecc.encrypt(db('eccKey').find().enc, 'hello world!')) !== 'hello world!') {
        createECC(true, '=> ECC密匙损坏, 重新创建...');
    }
    console.log('=> ECC密匙校验完成');
}

try {
    fs.statSync('./config.js')
} catch (e) {
    if (e.errno !== -2) {
        throw errno(e.errno)
    }
    console.log('=> 创建配置文件...');
    let defaultConfig = []
    defaultConfig.push('"use strict";')
    defaultConfig.push('let setting = {};setting.server = {};setting.interface = {}')
    defaultConfig.push('//配置文件 (别改上面的)')
    defaultConfig.push('')
    defaultConfig.push('//服务器端口号')
    defaultConfig.push('setting.server.port = 2333')
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
    console.log('=> config.js 创建成功');
}

try {
    fs.statSync('./data')
} catch (e) {
    if (e.errno !== -2) {
        throw errno(e.errno)
    }
    fs.mkdirSync('./data')
}

try {
    fs.statSync('./data/textures')
} catch (e) {
    if (e.errno !== -2) {
        throw errno(e.errno)
    }
    fs.mkdirSync('./data/textures')
}
