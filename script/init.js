"use strict"
const fs = require('fs-extra')
const errno = require('./errno')
const ecc = require('eccjs')
const eccDB = require('./serverInfoManager').ecc

console.log()
let createECC = (log) => {
    console.log(log)
    eccDB(ecc.generate(ecc.ENC_DEC))
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
    setting.dev.noCompression = false
    setting.dev.responseTime = true
    setting.dev.softError = false


    fs.writeFileSync('./config.json', JSON.stringify(setting, null, 2))
    console.log('=> config.json 创建成功')
}

module.exports = require('../config')
console.log("=> 配置文件读取成功\n")

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
