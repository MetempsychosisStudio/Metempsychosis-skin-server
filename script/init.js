"use strict"
const fs = require('fs-extra')
const errno = require('./errno')
const ecc = require('eccjs')
const eccDB = require('./serverInfoManager').ecc

console.log()

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
    console.log('=> 创建配置文件...')
    let setting = {}

    setting.server = {}
    setting.server.port = 2333

    setting.server.database = {}
    if (process.platform == 'win32') {
        setting.server.database.type = 'lowdb'
    } else {
        setting.server.database.type = 'leveldb'
    }

    setting.interface = {}
    setting.interface.title = '皮肤服务器'

    setting.dev = {}
    setting.dev.webLogger = false
    setting.dev.eccLevel = 4
    setting.dev.noCompression = false
    setting.dev.responseTime = true
    setting.dev.softError = false


    fs.writeFileSync('./config.json', JSON.stringify(setting, null, 2))
    console.log('=> config.json 创建成功')
}

module.exports = require('../config')
console.log("=> 配置文件读取成功\n")

switch (module.exports.dev.eccLevel) {
    case 1:
        eccDB.level(192)
        break;
    case 2:
        eccDB.level(224)
        break;
    case 3:
        eccDB.level(256)
        break;
    case 4:
        eccDB.level(384)
        break;
    default:
        eccDB.level(192)
}

let createECC = (log) => {
    console.log(log)
    eccDB(ecc.generate(ecc.ENC_DEC, eccDB.level()))
}

if (!eccDB()) {
    createECC('=> 创建ECC加密密匙...')
}

try {
    ecc.decrypt(eccDB().dec, ecc.encrypt(eccDB().enc, 'hello world!'))
} catch (e) {
    createECC('=> ECC密匙损坏, 重新创建...')
} finally {
    if (ecc.decrypt(eccDB().dec, ecc.encrypt(eccDB().enc, 'hello world!')) !== 'hello world!') {
        createECC('=> ECC密匙损坏, 重新创建...')
    }
    console.log('=> ECC密匙校验完成')
}

if (module.exports.dev.softError) {
    process.on('uncaughtException', (err) => {
        console.log('Caught exception');
        console.error(err);
    });
}

module.exports.set = (setting) => {
    return 'niconiconi'
        // TODO: set config.json
}
