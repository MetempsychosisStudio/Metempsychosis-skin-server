var currentUser = new ReactiveVar({});
var register = new ReactiveVar(false);
var usernameCheck = new ReactiveVar(undefined);
var password2Check = new ReactiveVar(undefined)
var passwordCheck = new ReactiveVar(undefined)

function ECCencrypt(value) {
    return ecc.encrypt(ECCKey, value)
}

function checkPassword() {
    if ($('#password').val() == $('#password2').val()) {
        password2Check.set(true)
        $('.password2Form').popover('destroy')
    } else {
        if (password2Check.get() !== false) {
            $('.password2Form').popover({
                content: '两次密码不一样',
                container: 'body',
                trigger: 'click hover focus'
            })
            $('.password2Form').popover('show')
        }
        password2Check.set(false)
    }
}

Template.header.helpers({
    loginBtn: function() {
        if (!currentUser.get().username) {
            return '注册/登陆'
        } else {
            return currentUser.get().username
        }
    }
});

Template.login.helpers({
    notLogin: function() {
        return !currentUser.get().username
    },
    register: function() {
        return register.get()
    },
    usernameCheck: function() {
        if (usernameCheck.get() == undefined) {
            return ''
        } else if (usernameCheck.get() == 'true') {
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
    },
    passwordCheck: function() {
        if (passwordCheck.get() === undefined) {
            return ''
        } else if (passwordCheck.get()) {
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
    'click .cover': function(e) {
        $('.content').css('animation-name', 'blurout')
        $('.content').css('animation-duration', '220ms')
        $('.content').css('-webkit-animation-name', 'blurout')
        $('.content').css('-webkit-animation-duration', '220ms')
        $('.cover').fadeOut(250)
    }
});

Template.login.events({
    'change #username': function(e) {
        if (register.get()) {
            if ($('#username').val() != '') {
                $('.usernameForm').popover('destroy')
                $.post('isRegister', {
                    username: $('#username').val()
                }, function(e) {
                    usernameCheck.set(e)
                    if (e == 'false') {
                        $('.usernameForm').popover({
                            content: '用户名已被注册',
                            container: 'body',
                            trigger: 'click hover focus'
                        })
                        $('.usernameForm').popover('show')
                    } else {
                        $('.usernameForm').popover('destroy')
                    }
                })
            } else {
                //usernameCheck.set('false')
                //$('.usernameForm').popover('destroy')
                //$('.usernameForm').popover({
                //    content: '你至少得写一个吧(╯‵□′)╯︵┻━┻',
                //    container: 'body',
                //    trigger: 'click hover focus'
                //})
                //$('.usernameForm').popover('show')
            }
        }
    },
    'click .newUser': function(e) {
        e.preventDefault()
        $('#username').val('')
        register.set(!register.get())
        usernameCheck.set(undefined)
        passwordCheck.set(undefined)
        $('.passwordForm').popover('destroy')
    },
    'change .password': function(e) {
        if ($('#password2').val() != '' && $('#password').val() != '') {
            checkPassword()
        } else {
            password2Check.set(undefined)
            $('.password2Form').popover('destroy')
        }
        if ($('#password').val() == '' && register.get()) {
            passwordCheck.set(false)
            $('.passwordForm').popover({
                content: '您至少得写一个吧(╯‵□′)╯︵┻━┻',
                container: 'body',
                trigger: 'click hover focus'
            })
            $('.passwordForm').popover('show')
        } else {
            passwordCheck.set(undefined)
            $('.passwordForm').popover('destroy')
        }
    },
    'keyup .password': function(e) {
        if ($('#password2').val() != '' && $('#password').val() != '') {
            checkPassword()
        } else {
            password2Check.set(undefined)
            $('.password2Form').popover('destroy')
        }
    },
    'submit .loginForm': function(e) {
        e.preventDefault()
        if ($('#jizhu:checked').val() == 'on') {

        } else {

        }
        if (register.get()) {
            checkPassword()
            if ($('#username').val() != '') {
                $.post('register', {
                    aec: ecc.encrypt(ECCKey, JSON.stringify({
                        username: $('#username').val(),
                        password: $('#password').val(),
                        rPassword: $('#password2').val()
                    }))
                }, function(e) {
                    console.log(e);
                })
            } else {

            }
        } else {

        }
    }
});
