const API_BASE = "https://api.wikimint.com";
const FETCH_OPTIONS = {
    credentials: "include"
};
const CREDIT_DECIMALS = 6;

ifMember(() => {
    renderMember(member);
    referralLinks();
});


function renderMember(
    member
) {
    document.querySelectorAll(".dname").forEach(el => {el.textContent =member.name;});
    document.querySelectorAll(".dname").forEach(el => {el.setAttribute("title",member.name);});
    document.querySelectorAll(".murl").forEach(el => {el.setAttribute("href","/profile?u="+member.userid);});


         }


//referral link
function referralLinks(){
const userid =
    member.userid;
document.querySelector(".uid").innerHTML=userid;
var referral =
    `https://wikimint.com?r=${userid}`;

document
    .getElementById(
        'referralLink'
    )
    .value =
        referral;

document
    .getElementById(
        'copyReferral'
    )
    .onclick =
        async () => {

            await navigator
                .clipboard
                .writeText(
                    referral
                );

            const toast =
                document.getElementById(
                    'toast'
                );

            toast.classList.remove(
                'opacity-0'
            );

            setTimeout(
                () => {

                    toast.classList.add(
                        'opacity-0'
                    );

                },
                2000
            );
        };
    }
//referral link

window.addEventListener('load', () => {
    document.querySelector('.lph')?.remove();
});

function referrerCookie(){
    const params = new URLSearchParams(window.location.search);

    const referrer = params.get("r");
    const profile = params.get("u");
    
    const validUserId = /^[a-z0-9]{10}$/;
    
    // Read existing referral cookie
    const existingReferrer = document.cookie
        .split("; ")
        .find(c => c.startsWith("referrer="))
        ?.split("=")[1];
    
    // 1. Explicit referral link (?r=)
    // Always overwrite
    if (referrer && validUserId.test(referrer)) {
    
        document.cookie =
            `referrer=${encodeURIComponent(referrer)}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
    
    }
    
    // 2. Member profile (?u=)
    // Only set if no referral cookie exists
    else if (
        profile &&
        validUserId.test(profile) &&
        !existingReferrer
    ) {
    
        document.cookie =
            `referrer=${encodeURIComponent(profile)}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
    
    }
}referrerCookie();

function getBrowserId() {

    let id = localStorage.getItem("browserid");

    if (!id) {
        id = crypto.randomUUID();

        localStorage.setItem("browserid",id);

    }

    return id;

}

// Visit Types
const VISIT_TYPES = {

    PROFILE:
        "profile",

    PUBLISHER:
        "publisher",

    DAILY_LOGIN:
        "daily_login",

    AD_VIEW:
        "ad_view"

};

// Visit Durations
const VISIT_DURATION = {

    MINUTE: 60,

    HOUR: 3600,

    DAY: 86400

};

async function recordUniqueVisit({
    visitorid,
    targetid,
    type,
    duration
}) {

    if (!visitorid)
        throw new Error("visitorid required");

    if (!targetid)
        throw new Error("targetid required");

    if (!type)
        throw new Error("type required");

    if (!duration)
        throw new Error("duration required");

    const now =
        Math.floor(Date.now() / 1000);

    const key =
        `visit:${type}:${visitorid}:${targetid}`;

    // Occasionally cleanup old records
    if (Math.random() < 0.01) {

        for (let i = 0; i < localStorage.length; i++) {

            const storageKey =
                localStorage.key(i);

            if (
                !storageKey?.startsWith("visit:")
            )
                continue;

            const time =
                Number(
                    localStorage.getItem(storageKey)
                );

            if (
                now - time >= 86400
            ) {

                localStorage.removeItem(storageKey);

                i--;

            }

        }

    }

    const lastVisit =
        Number(
            localStorage.getItem(key)
        );

    if (
        lastVisit &&
        now - lastVisit < duration
    ) {

        return false;

    }

    localStorage.setItem(
        key,
        now
    );

    return true;

}

let interacted = false;

function markInteraction() {
    if (
        document.visibilityState !== "visible"
    )
        return;

    interacted = true;
}

[
    "pointerdown",
    "pointermove",
    "click",
    "touchstart",
    "touchmove",
    "keydown",
    "scroll",
    "wheel"
].forEach(event => {

    window.addEventListener(
        event,
        markInteraction,
        {
            passive: true,
            once: false
        }
    );

});

function hasUserInteracted() {

    return interacted;

}

function resetUserInteraction() {

    interacted = false;

}
