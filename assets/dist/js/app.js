

//Cloud variables
var publicKey    = '...', privateKey   = '...', token        = '...', tokenSecret  = '...', cloud;

//Init
var TelldusHome = {};

//Init event widget
TelldusHome = TelldusHome || {};

TelldusHome.ApiHandler = Event.ApiHandler || {};

//Component
Event.ApiHandler.Login = (function ($) {

    var protocol            = 'http';

    function Login() {
        this.init();
    }

    Login.prototype.signIn = function () {

        if(this.isAuthenticated()) {
            cloud = new TelldusAPI.TelldusAPI({ publicKey  : publicKey, privateKey : privateKey }).login(function(token, tokenSecret, function(err, user)) {
                if (!!err) {
                    console.log('login error: ' + err.message);
                } else {
                    console.log('user: '); console.log(user);
                    this.storeAuthentication(publicKey,privateKey);
                    this.initApp();
                }
            }).on('error', function(err) {
                console.log('background error: ' + err.message);
            });
        } else {
            this.initApp();
        }
    };

    Login.prototype.storeAuthentication = function () {
        localStorage.setItem('telldusHomeLoginDetails', {publicKey: publicKey, privateKey: privateKey});
    };

    Login.prototype.isAuthenticated = function() {
        if(localStorage.getItem('telldusHomeLoginDetails').publicKey !== null && localStorage.getItem('telldusHomeLoginDetails').privateKey !== null ) {
            return true;
        } else {
            return false;
        }
    };

    Login.prototype.initApp = function() {
        alert("Yay!");
    };

    return new Login();

})(jQuery);
