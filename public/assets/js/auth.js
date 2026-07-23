window.WMAuth = {
    loggedIn: false,
    member: null,
    ready: false
};
let member = null;
let profile = null;
let CACHE_KEY;
let VERIFY_KEY;

(async () => {

    const CACHE_KEY =
        'wm_member';

    const VERIFY_KEY =
        'wm_verified';

    const cached =
        localStorage.getItem(
            CACHE_KEY
        );

    const verified =
        parseInt(
            localStorage.getItem(
                VERIFY_KEY
            ) || '0'
        );

    //
    // use cached member immediately
    //

    if (cached) {

        member =
            JSON.parse(
                cached
            );

    }

    //
    // verify only once every 24 hours
    //

    const needVerify =
        !cached
        ||
        (
            Date.now()
            -
            verified
            >
            86400000
        );
  

    //
    // already logged in
    //

    if (
        member && !needVerify
    ) {
        WMAuth.loggedIn = true;
        WMAuth.member = member;
    }
    else {
        WMAuth.loggedIn = false;
        WMAuth.member = null;
    }


    document.body.classList.remove(
        "g",
        "m"
    );

    document.body.classList.add(
        WMAuth.loggedIn
            ? "m"
            : "g"
    );

    WMAuth.ready = true;

})();

window.callWhenAuthReady = function(callback) {

    const wait = setInterval(() => {

        if (!WMAuth.ready) {

            return;

        }

        clearInterval(wait);

        callback(WMAuth);

    }, 20);

};

window.ifMember = function(callback) {

    callWhenAuthReady(auth => {

        if (auth.loggedIn) {

            callback(auth.member);

        }

    });

};

window.ifGuest = function(callback) {

    callWhenAuthReady(auth => {

        if (!auth.loggedIn) {

            callback();

        }

    });

};



document.querySelectorAll('.login').forEach(btn =>btn.onclick = () => {location.href = "/app/signin"});

document.querySelectorAll('.logout').forEach(btn => {
    btn.onclick = async () => {
        try {
            const response = await fetch(
                'https://api.wikimint.com/logout',
                {
                    method: 'POST',
                    credentials: 'include'
                }
            );
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Logout failed');
            }
            // Clear local data only after successful server logout
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(VERIFY_KEY);
            localStorage.setItem('loggedIn', 'false');
            localStorage.clear();
            sessionStorage.clear();
            WMAuth.loggedIn = false;
            WMAuth.member = null;

           window.location.reload();
        } catch (error) {
            alert('Unable to log out. Please try again.');
        }
    };
});