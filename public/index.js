currentUser = new ReactiveVar({});

function ECCencrypt(value) {
    return ecc.encrypt(ECCKey, value)
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

Template.cover.helpers({
    notLogin: function() {
        return !currentUser.get().username
    }
});

Template.main.events({
    'click .loginBtn': function(e) {
        e.preventDefault()
        $('.content').css('-webkit-animation-name', 'blurin')
        $('.content').css('-webkit-animation-duration', '300ms')
        $('.content').css('-webkit-animation-timing-function', 'ease-out')
        $('.content').css('animation-fill-mode', 'forwards')
        $('.cover').fadeIn(250)
    },
    'click .cover': function(e) {
        e.preventDefault()
        $('.content').css('-webkit-animation-name', 'blurout')
        $('.content').css('-webkit-animation-duration', '250ms')
        $('.cover').fadeOut(300)
    }
});
