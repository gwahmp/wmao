

const sidebar = document.getElementById('sidebar');
const open = document.getElementById('openMenu');
const close = document.getElementById('closeMenu');

open.onclick = () => {

    sidebar.classList.add('open');

    window.scrollTo(0, 0);

};
close.onclick = () => sidebar.classList.remove('open');


/* Menu start */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        //
        // Get 3rd directory
        // /app/menu-sample
        //

        const menuItem = (
            location.pathname + location.hash
        )
            .split('/')
            .filter(Boolean)[1];

        if (!menuItem) return;

        //
        // Find matching menu
        //

        const menu =
            document.querySelector(
                `[data-menu="${menuItem}"]`
            );
        if (!menu) return;

        //
        // Highlight active menu
        //
        document.querySelectorAll("[data-menu]").forEach(el => {el.classList.remove('active');});
        menu.classList.add(
            'active'
        );

        //
        // Open parent accordion
        //

        const group =
        menu
        .closest('.acc-menu-item')
        ?.querySelector('.menu-group');
        if (group) {
            
            group.click();

        }

    }
);

document
    .querySelectorAll(
        '.acc-menu-content a'
    )
    .forEach(link => {

        link.addEventListener(
            'click',
            () => {

                document
                    .querySelectorAll(
                        '.acc-menu-content a.active'
                    )
                    .forEach(a =>
                        a.classList.remove(
                            'active'
                        )
                    );

                link.classList.add(
                    'active'
                );

            }
        );

    });

document
    .querySelectorAll(
        '.acc-menu input'
    )
    .forEach(input => {

        input.addEventListener(
            'change',
            () => {

                if (!input.checked)
                    return;

                document
                    .querySelectorAll(
                        '.acc-menu input'
                    )
                    .forEach(other => {

                        if (other !== input) {

                            other.checked = false;

                        }

                    });

            });

    });

    document
    .querySelectorAll(
        'a.uc'
    )
    .forEach(link => {

        link.addEventListener(
            'click',
            () => {
alert("This feature is under construction");
            })});
/* Menu ends */

//referral link
function referralLinks(){
    const userid =
        member.userid;
    document.querySelectorAll(".uid").forEach(el => {el.innerHTML = userid;});
    
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

    
/*Dashboard data starts*/

const DASHBOARD_CACHE_KEY = "wm_dashboard";

let dashboardData = {};

function getDashboardData() {

    const cache = localStorage.getItem(
        DASHBOARD_CACHE_KEY
    );

    if (!cache)
        return null;

    try {

        return JSON.parse(cache);

    } catch {

        localStorage.removeItem(
            DASHBOARD_CACHE_KEY
        );

        return null;

    }

}

function setDashboardData(data) {

    localStorage.setItem(

        DASHBOARD_CACHE_KEY,

        JSON.stringify(data)

    );

}


function clearDashboardData() {

    localStorage.removeItem(
        DASHBOARD_CACHE_KEY
    );

}

async function fetchDashboardData() {

    const response = await fetch(

        API_BASE + "/member/dashboard",

        {
            credentials: "include"
        }

    );

    if (!response.ok)
        return null;

    const json = await response.json();

    if (!json.success)
        return null;

    setDashboardData(json);

    return json;

}

async function loadDashboardData() {

    const cache = getDashboardData();

    if (cache) {

        dashboardData = cache;

        return cache;

    }

    const fresh = await fetchDashboardData();

    if (!fresh)
        return null;

    dashboardData = fresh;

    return fresh;

}

async function initMember() {

    const dashboard = await loadDashboardData();

    if (!dashboard) {
        return;
    }

    window.dashboardData = dashboard;
    console.log(window.dashboardData);

    // Initialize all dashboard sections

}

document.addEventListener("DOMContentLoaded", initMember);
/*Dashboard data ends*/