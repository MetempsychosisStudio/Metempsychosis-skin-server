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
    ecc.decrypt(db('eccKey').find().dec, ecc.encrypt(db('eccKey').find().enc, 'hello world!'))
} catch (e) {
    createECC(true, '=> ECC密匙损坏, 重新创建...');
} finally {
    if (ecc.decrypt(db('eccKey').find().dec, ecc.encrypt(db('eccKey').find().enc, 'hello world!')) !== 'hello world!') {
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
    setting.interface = {}

    setting.server.port = 2333
    setting.interface.title = '皮肤服务器'

    fs.writeFileSync('./config.json', JSON.stringify(setting, null, 2));
    console.log('=> config.json 创建成功');
}

module.exports = require('../config.json')

module.exports.set = (setting) => {
    return 'niconiconi'
        // TODO: set config.json
}
