var currentUser = new ReactiveVar(undefined);
var register = new ReactiveVar(false);
var usernameCheck = new ReactiveVar(undefined)
var password2Check = new ReactiveVar(undefined)

var socket = io();

socket.on('setting', function(e) {
    var element = document.createElement("title")
    element.innerHTML = e.title
    document.head.appendChild(element)
    ECCKey = e.ECCKey
    doneProgress();
})

function ECCencrypt(value) {
    return ecc.encrypt(ECCKey, value)
}

function closeLoginForm(e) {
    e.preventDefault()
    $('.content').css('animation-name', 'blurout')
    $('.content').css('animation-duration', '220ms')
    $('.content').css('-webkit-animation-name', 'blurout')
    $('.content').css('-webkit-animation-duration', '220ms')
    $('.cover').fadeOut(250)
    $('.usernameForm').popover('destroy')
    $('.passwordForm').popover('destroy')
    $('.password2Form').popover('destroy')
}

function login(aec) {
    socket.emit('login', aec, function(e) {
        if (typeof e == 'object') {
            password2Check.set(true)
            usernameCheck.set(true)
            currentUser.set(e)
            $('#closeLogin').click()
        } else if (e == 'bad') {
            password2Check.set(false)
            usernameCheck.set(false)
            $('.passwordForm').popover({
                content: '用户名或密码错误',
                container: 'body',
                trigger: 'manual',
                placement: 'up',
                animation: false
            })
            $('.passwordForm').popover('show')
        }
    })
}

function checkPassword() {
    if ($('#password').val() == $('#password2').val()) {
        password2Check.set(true)
        $('.password2Form').popover('destroy')
        return true
    } else if (password2Check.get() === true) {
        password2Check.set(false)
        $('.password2Form').popover({
            content: '两次密码不一样',
            container: 'body',
            placement: 'up',
            animation: false
        })
        $('.password2Form').popover('show')
    }
    return false
}

function lock(ele) {
    $(ele).attr('disabled', '')
}

function unlock(ele) {
    $(ele).removeAttr('disabled')
}

function checkUsername() {
    if ($('#username').val() === '') {
        $('.usernameForm').popover('destroy')
        usernameCheck.set(false)
        $('.usernameForm').popover({
            content: '这你必须写',
            container: 'body',
            trigger: 'manual',
            placement: 'up',
            animation: false
        })
        $('.usernameForm').popover('show')
    } else if (!$('#username').val().match(/^\w+$/)) {
        $('.usernameForm').popover('destroy')
        usernameCheck.set(false)
        $('.usernameForm').popover({
            content: '用户名只能包含字母, 数字和下划线',
            container: 'body',
            trigger: 'manual',
            placement: 'up',
            animation: false
        })
        $('.usernameForm').popover('show')
    } else {
        $('.usernameForm').popover('destroy')
        usernameCheck.set('post')
        socket.emit('isRegister', $('#username').val(), function(e) {
            usernameCheck.set(e)
            if (e === false) {
                $('.usernameForm').popover({
                    content: '用户名已被注册',
                    container: 'body',
                    trigger: 'manual',
                    placement: 'up',
                    animation: false
                })
                $('.usernameForm').popover('show')
            } else {
                $('.usernameForm').popover('destroy')
            }
        })
    }
}

Template.header.helpers({
    loginBtn: function() {
        if (!currentUser.get()) {
            return '注册/登陆'
        } else {
            return currentUser.get().username
        }
    }
});

Template.login.helpers({
    notLogin: function() {
        return !currentUser.get()
    },
    register: function() {
        return register.get()
    },
    usernameCheck: function() {
        if (usernameCheck.get() === undefined) {
            return ''
        } else if (usernameCheck.get() == 'post') {
            return 'has-warning'
        } else if (usernameCheck.get()) {
            return 'has-success'
        } else {
            return 'has-error'
        }
    },
    password2Check: function() {
        if (password2Check.get() === undefined) {
            return ''
        } else if (password2Check.get()) {
            return 'has-success'
        } else {
            return 'has-error'
        }
    }
});

Template.main.events({
    'click .loginBtn': function(e) {
        e.preventDefault()
        $('.content').css('-webkit-filter', 'blur(0px)')
        $('.content').css('filter', 'blur(0px)')
        $('.content').css('animation-name', 'blurin')
        $('.content').css('animation-duration', '250ms')
        $('.content').css('animation-timing-function', 'ease-out')
        $('.content').css('animation-fill-mode', 'forwards')
        $('.content').css('-webkit-animation-name', 'blurin')
        $('.content').css('-webkit-animation-duration', '250ms')
        $('.content').css('-webkit-animation-timing-function', 'ease-out')
        $('.content').css('-webkit-animation-fill-mode', 'forwards')
        $('.cover').fadeIn(220)
    }
});

Template.cover.events({
    'click .cover': closeLoginForm
});

Template.login.events({
    'click #closeLogin': closeLoginForm,
    'blur #username': function(e) {
        if (register.get()) {
            checkUsername()
        }
    },
    'click .newUser': function(e) {
        e.preventDefault()
        $('#username').val('')
        register.set(!register.get())
        usernameCheck.set(undefined)
    },
    'input .password': function(e) {
        if ($('#password2').val() !== '' && $('#password').val() !== '') {
            checkPassword()
        } else {
            password2Check.set(undefined)
            $('.password2Form').popover('destroy')
        }
    },
    'submit .loginForm': function(e) {
        e.preventDefault()
        var storage = sessionStorage
        if ($('#jizhu').is(':checked')) {
            storage = localStorage
        }


        if (register.get()) {
            if (!$('#username').val().match(/^\w+$/)) {
                checkUsername()
            } else if (checkPassword()) {
                ['#username', '#password', '#password2', '#submitLogin'].forEach(lock)
                socket.emit('register', ECCencrypt(JSON.stringify({
                    username: $('#username').val(),
                    password: $('#password').val(),
                    rPassword: $('#password2').val()
                })), function(e) {
                    ['#username', '#password', '#password2', '#submitLogin'].forEach(unlock)
                    if (typeof e == 'object') {
                        storage.setItem('login', ECCencrypt(JSON.stringify({
                            username: $('#username').val(),
                            password: $('#password').val()
                        })))
                        currentUser.set(e)
                        $('#closeLogin').click()
                    }
                })
            }
        } else {
            storage.setItem('login', ECCencrypt(JSON.stringify({
                username: $('#username').val(),
                password: $('#password').val()
            })))
            login(storage.login)
        }
    }
});
