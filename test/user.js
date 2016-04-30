var fs = require('fs-extra');

fs.removeSync('./db.json')
fs.removeSync('./levelDB')
fs.removeSync('./config.json')

var assert = require("assert");
var request = require('supertest')(require('../index'));
var should = require("should");
var ecc = require('eccjs');
var setting = require('../script/init.js');
var eccKey = require('../script/serverInfoManager').ecc
var io = require('socket.io-client');
var socketURL = 'http://0.0.0.0:' + setting.server.port;
var socketOptions = {
    transports: ['websocket'],
    'force new connection': true
};
var client = io.connect(socketURL, socketOptions);


function enecc(e) {
    return ecc.encrypt(eccKey().enc, e)
}

describe('User', function() {
    describe('Register', function() {
        describe('should return "lostElement" when lost element', function() {
            it('lost username', function(done) {
                client.emit('register', enecc(JSON.stringify({
                    password: '123456',
                    rPassword: '123456'
                })), function(e) {
                    e.should.equal('lostElement');
                    done();
                })
            });
            it('lost password', function(done) {
                client.emit('register', enecc(JSON.stringify({
                    username: 'simon3000',
                    rPassword: '123456'
                })), function(e) {
                    e.should.equal('lostElement');
                    done();
                })
            });
            it('lost rPassword', function(done) {
                client.emit('register', enecc(JSON.stringify({
                    username: 'simon3000',
                    password: '123456'
                })), function(e) {
                    e.should.equal('lostElement');
                    done();
                })
            });
        })
        describe('should return "illegalUsername" when username is illegal', function() {
            it('中文', function(done) {
                client.emit('register', enecc(JSON.stringify({
                    username: '中文',
                    password: '123456',
                    rPassword: '123456'
                })), function(e) {
                    e.should.equal('illegalUsername');
                    done();
                })
            });
            it('spa ce', function(done) {
                client.emit('register', enecc(JSON.stringify({
                    username: 'spa ce',
                    password: '123456',
                    rPassword: '123456'
                })), function(e) {
                    e.should.equal('illegalUsername');
                    done();
                })
            });
            it('simon-0', function(done) {
                client.emit('register', enecc(JSON.stringify({
                    username: 'simon-0',
                    password: '123456',
                    rPassword: '123456'
                })), function(e) {
                    e.should.equal('illegalUsername');
                    done();
                })
            });
        })
        describe('passwordNotSame', function() {
            it('should return "passwordNotSame" when "password" and "rPassword" is not same', function(done) {
                client.emit('register', enecc(JSON.stringify({
                    username: 'simon3000',
                    password: '123456',
                    rPassword: '1234567'
                })), function(e) {
                    e.should.equal('passwordNotSame');
                    done();
                })
            });
        })
        describe('should return "done" when user successfully registered', function() {
            it('simon3000', function(done) {
                client.emit('register', enecc(JSON.stringify({
                    username: 'simon3000',
                    password: '123456',
                    rPassword: '123456'
                })), function(e) {
                    e.should.equal('done');
                    done();
                })
            });
            it('kbc_000', function(done) {
                client.emit('register', enecc(JSON.stringify({
                    username: 'kBc_000',
                    password: '233-=<<./sNDBd',
                    rPassword: '233-=<<./sNDBd'
                })), function(e) {
                    e.should.equal('done');
                    done();
                })
            });
            it('should return "repeat" when user already registered', function(done) {
                client.emit('register', enecc(JSON.stringify({
                    username: 'simon3000',
                    password: '123456',
                    rPassword: '123456'
                })), function(e) {
                    e.should.equal('repeat');
                    done();
                })
            });
        })
        describe('Change password', function() {
            it('should return "userNotExist" when user not exist', function(done) {
                client.emit('changePassword', enecc(JSON.stringify({
                    username: 'simon',
                    password: '123456',
                    newPassword: '654321'
                })), function(e) {
                    e.should.equal('userNotExist');
                    done();
                })
            })
            it('should return "bad" when old password is incorrect', function(done) {

                client.emit('changePassword', enecc(JSON.stringify({
                    username: 'simon3000',
                    password: '123',
                    newPassword: '654321'
                })), function(e) {
                    e.should.equal('bad');
                    done();
                })
            })
            it('should return "done" when password is changed', function(done) {

                client.emit('changePassword', enecc(JSON.stringify({
                    username: 'siMOn3000',
                    password: '123456',
                    newPassword: '654321'
                })), function(e) {
                    e.should.equal('done');
                    done();
                })
            })
        })
    });
});

describe('interface', function() {
    describe('Check register', function() {
        it('should return "false" when username is already been registered', function(done) {
            client.emit('isRegister', 'SIMon3000', function(e) {
                e.should.equal(false);
                done();
            })
        });
        it('should return "true" when username is not yet been registered', function(done) {
            client.emit('isRegister', 'simon', function(e) {
                e.should.equal(true);
                done();
            })
        });
    });
    describe('Page setting', function() {
        it('Page title', function(done) {
            io.connect(socketURL, socketOptions).on('setting', function(e) {
                e.title.should.containEql(setting.interface.title)
                done();
            })
        })
        it('ECCKey', function(done) {
            io.connect(socketURL, socketOptions).on('setting', function(e) {
                ecc.decrypt(eccKey().dec, ecc.encrypt(e.ECCKey, 'hello world!')).should.containEql('hello world!')
                done();
            })
        })
    })
})
