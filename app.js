var userProfile;

$(document).ready(function () {
    var dev_lock = new Auth0Lock(
        AUTH0_DEV_CLIENT_ID,
        AUTH0_DEV_DOMAIN
        );
    var prod_lock = new Auth0Lock(
        AUTH0_PROD_CLIENT_ID,
        AUTH0_PROD_DOMAIN
        );
        
    

        var dev_hash = dev_lock.parseHash();
        if (dev_hash) {
            if (dev_hash.error) {
                console.log("There was an error logging in", dev_hash.error);
            } else {
                dev_lock.getProfile(dev_hash.id_token, authCallback);
            }
        }
    
        var prod_hash = prod_lock.parseHash();
        if (prod_hash) {
            if (prod_hash.error) {
                console.log("There was an error logging in", prod_hash.error);
            } else {
                prod_lock.getProfile(prod_hash.id_token, authCallback);
            }
        }
    
    $('.btn-dev-login').click(function (e) {
        e.preventDefault();
        dev_lock.showSignin(
            {
                popup: false,
                responseType: 'token',
                callbackUrl: 'http://localhost:3000/',
                authParams: {
                    scope: 'openid profile'
                }
            })
    });

    $('.btn-prod-login').click(function (e) {
        e.preventDefault();
        prod_lock.showSignin(
            {
                popup: false,
                responseType: 'token',
                callbackUrl: 'http://localhost:3000/',
                authParams: {
                    scope: 'openid profile'
                }
            })
    });


    $.ajaxSetup({
        'beforeSend': function (xhr) {
            if (localStorage.getItem('userToken')) {
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + localStorage.getItem('userToken'));
            }
        }
    });

    $('.btn-api').click(function (e) {
        // Just call your API here. The header will be sent
        $.ajax({
            url: 'http://localhost:3001/secured/ping',
            method: 'GET'
        }).then(function (data, textStatus, jqXHR) {
            alert("The request to the secured enpoint was successfull");
        }, function () {
            alert("You need to download the server seed and start it to call this API");
        });
    });


});

function authCallback(err, profile, token) {
    if (err) {
        // Error callback
        console.log("There was an error");
        alert("There was an error logging in");
    } else {
        // Success calback

        // Save the JWT token.
        localStorage.setItem('userToken', token);

        // Save the profile
        userProfile = profile;

        $('.login-box').hide();
        $('.logged-in-box').show();
        $('.fullname').text(profile.name);
        $('.user-name').text(profile.name);
        $('.user-id').text(profile.user_id);
        $('.user-nameid').text(profile.nameid);
        $('.user-ssn').text(profile.socialno);
    }
}

