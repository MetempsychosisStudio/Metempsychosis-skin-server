var fs = require('fs');

try {
    fs.statSync('db.json')
} catch (e) {
    fs.writeFileSync('db.json', '');
} finally {
    fs.unlinkSync('db.json')
}

var setting = require('../config.js');
var app = require('../index');
var assert = require("assert");
var request = require('supertest')(app);
var should = require("should");
var low = require('lowdb')
var storage = require('lowdb/file-sync')
var ecc = require('eccjs');
var db = low('db.json', {
    storage: {
        read: storage.read
    }
})

function enecc(e) {
    return ecc.encrypt(db('eccKey').find().enc, e)
}

describe('User', function() {
    describe('Register', function() {
        describe('should return "lostElement" when lost element', function() {
            it('lost username', function(done) {
                request.post('/register')
                    .send({
                        aec: enecc(JSON.stringify({
                            password: '123456',
                            rPassword: '123456'
                        }))
                    })
                    .expect(200, function(err, res) {
                        should.not.exist(err);
                        res.text.should.containEql('lostElement');
                        done();
                    });
            });
            it('lost password', function(done) {
                request.post('/register')
                    .send({
                        aec: enecc(JSON.stringify({
                            username: 'simon3000',
                            rPassword: '123456'
                        }))
                    })
                    .expect(200, function(err, res) {
                        should.not.exist(err);
                        res.text.should.containEql('lostElement');
                        done();
                    });
            });
            it('lost rPassword', function(done) {
                request.post('/register')
                    .send({
                        aec: enecc(JSON.stringify({
                            username: 'simon3000',
                            password: '123456'
                        }))
                    })
                    .expect(200, function(err, res) {
                        should.not.exist(err);
                        res.text.should.containEql('lostElement');
                        done();
                    });
            });
        })
        describe('should return "illegalUsername" when username is illegal', function() {
            it('中文', function(done) {
                request.post('/register').send({
                    aec: enecc(JSON.stringify({
                        username: '中文',
                        password: '123456',
                        rPassword: '123456'
                    }))
                }).expect(200, function(err, res) {
                    should.not.exist(err);
                    res.text.should.containEql('illegalUsername');
                    done();
                });
            });
            it('spa ce', function(done) {
                request.post('/register').send({
                    aec: enecc(JSON.stringify({
                        username: 'spa ce',
                        password: '123456',
                        rPassword: '123456'
                    }))
                }).expect(200, function(err, res) {
                    should.not.exist(err);
                    res.text.should.containEql('illegalUsername');
                    done();
                });
            });
            it('simon-0', function(done) {
                request.post('/register').send({
                    aec: enecc(JSON.stringify({
                        username: 'simon-0',
                        password: '123456',
                        rPassword: '123456'
                    }))
                }).expect(200, function(err, res) {
                    should.not.exist(err);
                    res.text.should.containEql('illegalUsername');
                    done();
                });
            });
        })
        describe('passwordNotSame', function() {
            it('should return "passwordNotSame" when "password" and "rPassword" is not same', function(done) {
                request.post('/register').send({
                    aec: enecc(JSON.stringify({
                        username: 'simon3000',
                        password: '123456',
                        rPassword: '1234567'
                    }))
                }).expect(200, function(err, res) {
                    should.not.exist(err);
                    res.text.should.containEql('passwordNotSame');
                    done();
                });
            });
        })
        describe('should return "done" when user successfully registered', function() {
            it('simon3000', function(done) {
                request.post('/register').send({
                    aec: enecc(JSON.stringify({
                        username: 'simon3000',
                        password: '123456',
                        rPassword: '123456'
                    }))
                }).expect(200, function(err, res) {
                    should.not.exist(err);
                    res.text.should.containEql('done');
                    done();
                });
            });
            it('kbc_000', function(done) {
                request.post('/register').send({
                    aec: enecc(JSON.stringify({
                        username: 'kbc_000',
                        password: '233-=<<./sNDBd',
                        rPassword: '233-=<<./sNDBd'
                    }))
                }).expect(200, function(err, res) {
                    should.not.exist(err);
                    res.text.should.containEql('done');
                    done();
                });
            });
            it('should return "repeat" when user already registered', function(done) {
                request.post('/register').send({
                    aec: enecc(JSON.stringify({
                        username: 'simon3000',
                        password: '123456',
                        rPassword: '123456'
                    }))
                }).expect(200, function(err, res) {
                    should.not.exist(err);
                    res.text.should.containEql('repeat');
                    done();
                });
            });
        })
    });
});

describe('interface', function() {
    describe('Check register', function() {
        it('should return "false" when username is already been registered', function(done) {
            request.post('/isRegister').send({
                username: 'SIMon3000'
            }).expect(200, function(err, res) {
                should.not.exist(err);
                res.text.should.containEql('false');
                done();
            });
        });
        it('should return "true" when username is not yet been registered', function(done) {
            request.post('/isRegister').send({
                username: 'simon'
            }).expect(200, function(err, res) {
                should.not.exist(err);
                res.text.should.containEql('true');
                done()
            });
        });
    });
    describe('Page setting', function() {
        it('Page title', function(done) {
            request.get('/indexsetting').expect(200, function(err, res) {
                should.not.exist(err)
                var document = {}
                document.head = {}
                document.head.appendChild = function() {}
                document.createElement = function() {
                    return {
                        innerHTML: 233
                    }
                }
                eval(res.text)
                element.innerHTML.should.containEql(setting.interface.title)
                done()
            })
        })
        it('ECCKey', function(done) {
            request.get('/indexsetting').expect(200, function(err, res) {
                should.not.exist(err)
                var document = {}
                document.head = {}
                document.head.appendChild = function() {}
                document.createElement = function() {
                    return {
                        innerHTML: 233
                    }
                }
                eval(res.text)
                ecc.decrypt(db('eccKey').find().dec, ecc.encrypt(ECCKey, 'hello world!')).should.containEql('hello world!')
                done()
            })
        })
    })
})
