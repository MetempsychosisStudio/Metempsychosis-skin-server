"use strict";
const fs = require('fs');
const errno = require('./errno.js');
const ecc = require('eccjs');
const db = require('./db.js')
const eccDB = db.ecc

console.log();
let createECC = (remove, log) => {
    console.log(log);
    if (remove) {
        eccDB.remove()
    }
    let keys = ecc.generate(ecc.ENC_DEC)
    eccDB.push({
        dec: keys.dec,
        enc: keys.enc
    })
}

if (!eccDB.find()) {
    createECC(false, '=> 创建ECC加密密匙...');
}

try {
    ecc.decrypt(eccDB.find().dec, ecc.encrypt(eccDB.find().enc, 'hello world!'))
} catch (e) {
    createECC(true, '=> ECC密匙损坏, 重新创建...');
} finally {
    if (ecc.decrypt(eccDB.find().dec, ecc.encrypt(eccDB.find().enc, 'hello world!')) !== 'hello world!') {
        createECC(true, '=> ECC密匙损坏, 重新创建...');
    }
    console.log('=> ECC密匙校验完成');
}

try {
    fs.statSync('./data')
} catch (e) {
    fs.mkdirSync('./data')
}

try {
    fs.statSync('./data/textures')
} catch (e) {
    fs.mkdirSync('./data/textures')
}

try {
    fs.statSync('./config.json')
} catch (e) {
    console.log('=> 创建配置文件...');
    let setting = {}

    setting.server = {}
    setting.server.port = 2333

    setting.interface = {}
    setting.interface.title = '皮肤服务器'

    setting.dev = {}
    setting.dev.webLogger = false
    setting.dev.noCompression = false
    setting.dev.responseTime = true


    fs.writeFileSync('./config.json', JSON.stringify(setting, null, 2));
    console.log('=> config.json 创建成功');
}

module.exports = require('../config.json')
console.log("=> 配置文件读取成功\n");

module.exports.set = (setting) => {
    return 'niconiconi'
        // TODO: set config.json
}
