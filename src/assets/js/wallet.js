async function claimCredits() {

    const btn = document.getElementById("claimCreditsBtn");

    btn.disabled = true;

    btn.textContent = "Claiming...";

    try {

        const res = await fetch(API_URL + "/wallet/claim", {

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

const wallet = dashboardData.wallet;

if (!wallet)
    return;

const rewards = document.getElementById("pendingRewards");

rewards.innerHTML = "";

for (const [type, value] of Object.entries(wallet.unclaimed)) {

    if (Number(value) <= 0)
        continue;

    rewards.insertAdjacentHTML("beforeend", `

        <div class="d-flex justify-content-between py-2">

            <span>${labels[type]}</span>

            <strong>${Number(value).toFixed(6)}</strong>

        </div>

    `);

}