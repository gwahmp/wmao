async function claimCredits() {

    const btn = document.getElementById("claimCreditsBtn");

    btn.disabled = true;

    btn.textContent = "Claiming...";

    try {

        const res = await fetch(API_BASE + "/wallet/claim", {

            method: "POST",

            credentials: "include"

        });

        const data = await res.json();

        alert(data.message);

        if (data.success) {

            await loadWallet();

        }

    } finally {

        btn.disabled = false;

        btn.textContent = "Claim All Credits";

    }

}


document
    .getElementById("claimCreditsBtn")
    .addEventListener("click", claimCredits);


const labels = {

    profile_visit: "Profile Visits",

    shortlinks_visit: "Shortlink Visits"

};

function loadWallet() {

    const wallet = dashboardData.wallet;
    console.log(dashboardData);
    if (!wallet) {
        return;
    }
    const rewards = document.getElementById("pendingRewards");

    rewards.innerHTML = "";

    for (const [type, value] of Object.entries(wallet.unclaimed || {})) {

        if (Number(value) <= 0)
            continue;

        rewards.insertAdjacentHTML("beforeend", `

            <div class="d-flex justify-content-between py-2">

                <span>${labels[type] || type}</span>

                <strong>${Number(value).toFixed(6)}</strong>

            </div>

        `);

    }

}

(async () => {
    if (!await checkAuth()) { return; }


    document.addEventListener("DOMContentLoaded", loadWallet);
    /*Dashboard data ends*/

})();
