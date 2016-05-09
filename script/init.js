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

function setConfig(config) {
    if (typeof config != 'object') {
        config = {}
    }

    //Main
    if (typeof config.server != 'object') {
        config.server = {}
    }
    if (typeof config.interface != 'object') {
        config.interface = {}
    }
    if (typeof config.dev != 'object') {
        config.dev = {}
    }


    if (config.server.port === undefined) {
        config.server.port = 2333
    } else if (typeof config.server.port !== 'number' || config.server.port > 65536 || config.server.port < 1) {
        config.server.port = 2333
        console.log('=> config.server.port 错误, 已重置');
    }

    if (typeof config.server.database != 'object') {
        config.server.database = {}
    }

    if (config.server.database.type === undefined) {
        if (process.platform == 'win32') {
            config.server.database.type = 'lowdb'
        } else {
            config.server.database.type = 'leveldb'
        }
    } else if (config.server.database.type != 'lowdb' && config.server.database.type != 'leveldb') {
        if (process.platform == 'win32') {
            config.server.database.type = 'lowdb'
        } else {
            config.server.database.type = 'leveldb'
        }
        console.log('=> config.server.database.type 错误, 已重置');
    }


    if (typeof config.interface.title === 'undefined') {
        config.interface.title = '皮肤服务器'
    } else if (typeof config.interface.title != 'string') {
        config.interface.title = '皮肤服务器'
        console.log('=> config.interface.title 错误, 已重置');
    }


    if (config.dev.webLogger === undefined) {
        config.dev.webLogger = false
    } else if (typeof config.dev.webLogger != 'boolean') {
        config.dev.webLogger = false
        console.log('=> config.dev.webLogger 错误, 已重置');
    }
    if (config.dev.eccLevel === undefined) {
        config.dev.eccLevel = 4
    } else if (typeof config.dev.eccLevel != 'number') {
        config.dev.eccLevel = 4
        console.log('=> config.dev.eccLevel 错误, 已重置');
    }
    if (config.dev.noCompression === undefined) {
        config.dev.noCompression = false
    } else if (typeof config.dev.noCompression != 'boolean') {
        config.dev.noCompression = false
        console.log('=> config.dev.noCompression 错误, 已重置');
    }
    if (config.dev.responseTime === undefined) {
        config.dev.responseTime = true
    } else if (typeof config.dev.responseTime != 'boolean') {
        config.dev.responseTime = true
        console.log('=> config.dev.responseTime 错误, 已重置');
    }
    if (config.dev.softError === undefined) {
        config.dev.softError = false
    } else if (typeof config.dev.softError != 'boolean') {
        config.dev.softError = false
        console.log('=> config.dev.softError 错误, 已重置');
    }
    return config
}

try {
    fs.statSync('./config.json')
} catch (e) {
    fs.writeFileSync('./config.json', JSON.stringify(setConfig(), null, 2))
    console.log('=> config.json 创建成功')
} finally {
    fs.writeFileSync('./config.json', JSON.stringify(setConfig(require('../config')), null, 2))
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

module.exports.set = (config) => {
    return 'niconiconi'
        // TODO: set config.json
}
