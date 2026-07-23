function getCookie(name) {

    const cookie = document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="));

    return cookie
        ? decodeURIComponent(cookie.split("=")[1])
        : null;

}


ifMember(() => {

    document
    .getElementById(
        'googleButton'
    )
    .innerHTML =
        `
        <div class="text-center">
            <p class="font-medium mb-2">Welcome, <strong> ${member.name} </strong></p>
            <p class="text-green-900">

                You are already signed in.

            </p>

            <a
                href="/app"
                class="btn
                    inline-block
                    px-10
                    py-2
                    my-4
                    mt-5
                    bg-wmblue
                    text-white
                ">

                Go to App Home

            </a>

        </div>
        `;

});

ifGuest(() => {

    const script =
        document.createElement(
            'script'
        );

    script.src =
        'https://accounts.google.com/gsi/client';

    script.defer =
        true;

    script.onload =
        initGoogle;

    document.body.appendChild(
        script
    );

});


function initGoogle() {

    google.accounts.id.initialize({

        client_id:
            '69794757092-emuuqmul46p24bre1qsim9veuf5hdnoh.apps.googleusercontent.com',

        callback:
            handleGoogle

    });

    google.accounts.id.renderButton(

        document.getElementById(
            'googleButton'
        ),

        {
            theme:
                'outline',

            size:
                'large'
        }

    );

}

async function handleGoogle(
    response
) {

    const r =
        await fetch(
            'https://api.wikimint.com/google-login',
            {
                method:
                    'POST',

                credentials:
                    'include',

                headers:
                {
                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify({

                        credential:
                            response.credential

                    })

            }
        );

    const data =
        await r.json();

    if (
        data.success
    ) {

        await setAuth();
        location =
            '/app';

        return;

    }

    if (
        data.needAccount
    ) {

        profile =
            data.profile;

        document
            .getElementById(
                'createBox'
            )
            .style.display =
                'block';

    }

}

document
    .getElementById(
        'createAccount'
    )
    ?.addEventListener(
        'click',

        async () => {

            const referrer = getCookie("referrer");
            const r =
                await fetch(
                    'https://api.wikimint.com/google-register',
                    {
                        method:
                            'POST',

                        credentials:
                            'include',

                        headers:
                        {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify({
                            ...profile,
                            referrer
                        })

                    }
                );

            const data =
                await r.json();

            if (
                data.success
            ) {
                document.cookie =
                "referrer=; Path=/; Max-Age=0; SameSite=Lax; Secure";
        
                await setAuth();
        
                location = "/app";
            }

        }
    );



    
async function setAuth() {

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
        if (needVerify) {

            try {
    
                const response =
                    await fetch(
    
                        'https://api.wikimint.com/me',
    
                        {
                            credentials:
                                'include'
                        }
                    );
    
                const result =
                    await response.json();
    
                if (
                    !result.loggedIn
                ) {
    
                    localStorage.removeItem(
                        CACHE_KEY
                    );
    
                    localStorage.removeItem(
                        VERIFY_KEY
                    );
    
                    localStorage.setItem(
                        'loggedIn',
                        false
                    );
    
    
                    return;
                }
    
                member =
                    result.member;
    
                localStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify(
                        member
                    )
                );
    
                localStorage.setItem(
                    VERIFY_KEY,
                    Date.now()
                );
    
                localStorage.setItem(
                    'loggedIn',
                    true
                );
    
                document.addEventListener(
                    'DOMContentLoaded',
                    () => {
                renderMember(member);
                    });
    
            } catch {
    
               
            }
        }    

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

}
