document.addEventListener(
    "DOMContentLoaded",
    initWithdrawals
);

async function initWithdrawals() {

    await loadDashboardData();

    renderWalletSummary();

    renderPaymentMethod();

    bindEvents();

    renderWithdrawalInfo();


}

function renderWithdrawalInfo() {


    const wallet =
        dashboardData.wallet || {};


    const input =
        document.getElementById(
            "withdrawCredits"
        );

    input.max =
        wallet.withdrawableCredits ?? 0;

    input.value =
        wallet.withdrawableCredits ?? 0;

    document.getElementById(
        "withdrawInfo"
    ).innerHTML = `

Minimum withdrawal:
<b>

${Number(
        wallet.minimumWithdrawal
    ).toFixed(6)}

Credits

</b>

<br>

Withdrawable balance:
<b>

${Number(
        wallet.withdrawableCredits
    ).toFixed(6)}

Credits

</b>

`;

}

function renderWalletSummary() {

    const wallet =
        window.dashboardData.wallet || {};

    document.getElementById(
        "availableCredits"
    ).textContent =
        Number(
            wallet.availableCredits || 0
        ).toFixed(6);

    document.getElementById(
        "pendingWithdrawals"
    ).textContent =
        Number(
            wallet.pendingWithdrawals || 0
        ).toFixed(6);

    document.getElementById(
        "withdrawableCredits"
    ).textContent =
        Number(
            wallet.withdrawableCredits || 0
        ).toFixed(6);

}

function renderPaymentMethod() {

    const payment =
        dashboardData.payment || {};

    const container =
        document.getElementById(
            "paymentMethodContent"
        );

    if (!payment.method) {

        container.innerHTML = `

<div class="text-center py-8">

    <p class="text-gray-500 mb-4">

        No payment method added.

    </p>

    <button
        id="addPaymentMethod"
        class="btn">

        Add Payment Method

    </button>

</div>

`;

        return;

    }

    container.innerHTML = `

<div class="flex items-center justify-between">

    <div>

        <div class="text-sm text-gray-500">

            Payment Method

        </div>

        <div class="text-lg font-semibold">

            ${payment.method}

        </div>

        <div class="text-gray-600 mt-1">

            ${payment.paymentDetails}

        </div>

    </div>

    <button
        id="editPaymentMethod"
        class="btn-ol">

        Edit

    </button>

</div>

`;

}

function bindEvents() {

    document.addEventListener(
        "click",
        handleClick
    );

}

function handleClick(
    event
) {
    if (
        event.target.id ===
        "closeWithdrawalModal"
    ) {

        closeModal();

    }

    if (
        event.target.id ===
        "confirmWithdrawal"
    ) {

        submitWithdrawal(
            Number(
                event.target.dataset.credits
            )
        );

    }

    if (
        event.target.id ===
        "requestWithdrawal"
    ) {

        requestWithdrawal();

    }

    if (

        event.target.id ===
        "addPaymentMethod"

    ) {

        openPaymentMethodModal();

    }

    if (

        event.target.id ===
        "editPaymentMethod"

    ) {

        openPaymentMethodModal();

    }

    if (
        event.target.id ===
        "closePaymentModal"
    ) {

        closeModal();

    }

    if (
        event.target.id ===
        "savePaymentMethod"
    ) {

        savePaymentMethod();

    }

}



function openPaymentMethodModal() {

    const payment =
        dashboardData.payment || {};

    openModal(

        "Payment Method",

        `

<div class="space-y-4">

<div>

<label
class="mb-1 block text-sm font-medium">

Payment Method

</label>

<select
id="paymentMethod"
class="w-full rounded-lg border p-2">

<option value="paypal"
${payment.method === "paypal" ? "selected" : ""}>

PayPal

</option>

<option value="upi"
${payment.method === "upi" ? "selected" : ""}>

UPI

</option>

</select>

</div>

<div>

<label
class="mb-1 block text-sm font-medium">

Payment Details

</label>

<input

id="paymentDetails"

class="w-full rounded-lg border p-2"

placeholder="Email or UPI ID"

value="${payment.paymentDetails ?? ""}">

</div>

<div class="flex justify-end gap-2">

<button

id="closePaymentModal"

class="btn-lg">

Cancel

</button>

<button

id="savePaymentMethod"

class="btn">

Save

</button>

</div>

</div>

`

    );

}

async function savePaymentMethod() {

    const method =
        document.getElementById(
            "paymentMethod"
        ).value;

    const paymentDetails =
        document.getElementById(
            "paymentDetails"
        ).value.trim();

    if (!paymentDetails) {

        alert(
            "Please enter your payment details."
        );

        return;

    }

    try {

        const response =
            await fetch(
                API_BASE +
                "/withdrawals/payment-method", {
                method: "POST",

                credentials: "include",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    method,

                    paymentDetails

                })

            }
            );

        const data =
            await response.json();

        if (!data.success) {

            alert(
                data.message
            );

            return;

        }

        await loadDashboardData(
            true
        );

        renderPaymentMethod();

        closeModal();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to save payment method."
        );

    }

}

function requestWithdrawal() {

    const wallet =
        dashboardData.wallet || {};

    const payment =
        dashboardData.payment || {};

    if (!payment.method) {

        alert(
            "Please add a payment method first."
        );

        return;

    }

    const credits =
        Number(
            document.getElementById(
                "withdrawCredits"
            ).value
        );

    if (
        Number.isNaN(credits)
    ) {

        alert(
            "Enter a valid amount."
        );

        return;

    }

    if (
        credits <
        wallet.minimumWithdrawal
    ) {

        alert(
            `Minimum withdrawal is ${wallet.minimumWithdrawal} credits.`
        );

        return;

    }

    if (
        credits >
        wallet.withdrawableCredits
    ) {

        alert(
            "Insufficient withdrawable balance."
        );

        return;

    }

    openWithdrawalConfirmation(
        credits
    );

}

function openWithdrawalConfirmation(
    credits
) {

    const payment =
        dashboardData.payment;

    openModal(

        "Confirm Withdrawal",

        `
<div class="space-y-5">

<p>

Please confirm your withdrawal request.

</p>

<div>

<strong>Credits</strong>

<br>

${credits.toFixed(6)}

</div>

<div>

<strong>Method</strong>

<br>

${payment.method}

</div>

<div>

<strong>Account</strong>

<br>

${payment.paymentDetails}

</div>

<div class="flex justify-end gap-3">

<button
id="closeWithdrawalModal"
class="rounded-lg border px-5 py-2">

Cancel

</button>

<button
id="confirmWithdrawal"
data-credits="${credits}"
class="rounded-lg bg-green-600 px-5 py-2 text-white">

Confirm

</button>

</div>

</div>
`

    );

}


async function submitWithdrawal(
    credits
) {

    const button =
        document.getElementById(
            "confirmWithdrawal"
        );

    button.disabled = true;
    button.textContent = "Submitting...";

    try {

        const response =
            await fetch(

                API_BASE +
                "/withdrawals/request",

                {

                    method: "POST",

                    credentials: "include",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        credits

                    })

                }

            );

        const data =
            await response.json();

        if (!data.success) {

            alert(data.message);

            button.disabled = false;
            button.textContent = "Confirm";

            return;

        }

        closeModal();

        await loadDashboardData(true);

        renderWalletSummary();

        renderWithdrawalInfo();

        await loadWithdrawals();

        alert(
            "Withdrawal request submitted successfully."
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to submit withdrawal."
        );

    }

}


async function loadWithdrawals() {

    try {

        const response =
            await fetch(

                API_BASE +
                "/withdrawals",

                {

                    method: "POST",

                    credentials: "include"

                }

            );

        const data =
            await response.json();

        renderWithdrawals(data);

    }

    catch (error) {

        console.error(error);

    }

}

function renderWithdrawals(
    data
) {

    const container =
        document.getElementById(
            "withdrawalHistory"
        );

    if (

        !data.success ||

        !data.withdrawals.length

    ) {

        container.innerHTML = `

<p class="text-center text-gray-500">

No withdrawals yet.

</p>

`;

        return;

    }

    container.innerHTML = data.withdrawals

        .map(item => `

<div
class="flex items-center justify-between border-b py-4">

<div>

<div class="font-medium">

${Number(item.credits).toFixed(6)}

Credits

</div>

<div
class="text-sm text-gray-500">

${new Date(
            item.requested_at * 1000
        ).toLocaleDateString()}

</div>

</div>

<div>

${statusBadge(item.status)}

</div>

</div>

`)

        .join("");

}


function statusBadge(
    status
) {

    switch (status) {

        case "pending":

            return `
<span class="rounded bg-yellow-100 px-3 py-1 text-yellow-700">

Pending

</span>`;

        case "approved":

            return `
<span class="rounded bg-blue-100 px-3 py-1 text-blue-700">

Approved

</span>`;

        case "paid":

            return `
<span class="rounded bg-green-100 px-3 py-1 text-green-700">

Paid

</span>`;

        case "rejected":

            return `
<span class="rounded bg-red-100 px-3 py-1 text-red-700">

Rejected

</span>`;

        default:

            return status;

    }

}

await loadWithdrawals();