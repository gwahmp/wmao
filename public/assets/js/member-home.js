// ----------------------
// Dashboard Welcome
// ----------------------

ifMember(() => { console.log('member'); });
ifGuest(() => { console.log('guest');  });

let dashboard;

async function initMember() {

    dashboard = await loadDashboardData();

    if (!dashboard) {
        return;
    }

    window.dashboardData = dashboard;
    console.log(window.dashboardData);

    // Initialize all dashboard sections



// ----------------------
// Member Name
// ----------------------

document.querySelectorAll(".member-name").forEach(el => {

    el.textContent = member.name || "Member";

});

// ----------------------
// Membership
// ----------------------
if(member){
const badge = document.getElementById("membershipBadge");

const membership = member.membership || "FREE";

badge.textContent = membership + " MEMBER";

if (membership === "PRO") {

    badge.className =
        "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700";

}

// ----------------------
// Last Login
// ----------------------

if (member.lastLogin) {

    document.getElementById("lastLogin").textContent =
        member.lastLogin;

}

// ----------------------
// Greeting
// ----------------------

const hour = new Date().getHours();

let greeting = "Good Evening";

if (hour < 12)
    greeting = "Good Morning";

else if (hour < 17)
    greeting = "Good Afternoon";

document.getElementById("dashboardGreeting").textContent =
    greeting + ",";

// ----------------------
// Date
// ----------------------

const dateOptions = {

    weekday: "long",

    day: "numeric",

    month: "long",

    year: "numeric"

};

document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString(
        undefined,
        dateOptions
    );

// ----------------------
// Random Subtitle
// ----------------------

const subtitles = [

    "Let's grow your online business today.",

    "Your marketing dashboard is ready.",

    "Keep building your online presence.",

    "Review today's progress and opportunities.",

    "Every small step moves your business forward.",

    "Check your latest earnings and referrals.",

    "You're one step closer to your next milestone."

];

document.getElementById("dashboardSubtitle").textContent =
    subtitles[
        Math.floor(
            Math.random() * subtitles.length
        )
    ];

// ======================================================
// Overview Statistics
// ======================================================

const wallet = dashboard.wallet || {};
const portfolio = dashboard.portfolio || {};
var referral = dashboard.referral || {};
console.log(member);
document.querySelector(".credits").textContent =
    (wallet.availableCredits ?? 0).toLocaleString();

document.querySelector(".creditsChange").textContent =
    "+" + (wallet.todayCredits ?? 0) + " today";

document.querySelector(".growthUnits").textContent =
    (portfolio.units ?? 0).toLocaleString();

document.querySelector(".growthValue").textContent =
    "Portfolio $" + (portfolio.value ?? 0);

document.querySelector(".portfolioValue").textContent =
    "$" + (portfolio.value ?? 0);

document.querySelector(".portfolioChange").textContent =
    (portfolio.change ?? 0) + "%";

document.querySelector(".earnings").textContent =
    "$" + (wallet.earnings ?? 0);

document.querySelector(".pending").textContent =
    "Pending $" + (wallet.pending ?? 0);

document.querySelector(".referrals").textContent =
    referral.total ?? 0;

document.querySelector(".proReferrals").textContent =
    (referral.pro ?? 0) + " Pro Members";

document.querySelector(".membership").textContent =
    member.membership || "FREE";

document.querySelector(".membershipExpiry").textContent =
    member.membership === "PRO"
        ? "Renew in 25 days"
        : "Upgrade Available";    

}
}

document.addEventListener("DOMContentLoaded", initMember);
