var fs = require('fs');

try {
    fs.statSync('db.json')
} catch (e) {
    fs.writeFileSync('db.json', '');
}
fs.unlinkSync('db.json')

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
        it('should return lostElement when lostElement username', function(done) {
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
        it('should return lostElement when lostElement password', function(done) {
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
        it('should return lostElement when lostElement rPassword', function(done) {
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
        it('should return done when user successfully registered', function(done) {
            request.post('/register')
                .send({
                    aec: enecc(JSON.stringify({
                        username: 'simon3000',
                        password: '123456',
                        rPassword: '123456'
                    }))
                })
                .expect(200, function(err, res) {
                    should.not.exist(err);
                    res.text.should.containEql('done');
                    done();
                });
        });
        it('should return "false" when username is unable to register', function(done) {
            request.post('/isRegister')
                .send({
                    username: 'simon3000'
                })
                .expect(200, function(err, res) {
                    should.not.exist(err);
                    res.text.should.containEql('false');
                    done();
                });
        });
        it('should return "true" when username is able to register', function(done) {
            request.post('/isRegister')
                .send({
                    username: 'simon'
                })
                .expect(200, function(err, res) {
                    should.not.exist(err);
                    res.text.should.containEql('true');
                    done();
                });
        });
    });
});
