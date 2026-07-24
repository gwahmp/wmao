/**
 * Bonus Rewards Frontend Helpers
 * --------------------------------
 * These helpers are only used to reduce unnecessary API calls.
 * They DO NOT determine actual eligibility.
 * The API always performs the final validation.
 */

/**
 * Returns today's UTC date.
 * Example: 2026-07-22
 */

/**************************************************************************
 * Bonus Reward Constants
 **************************************************************************/

const BONUS_KEYS = {

    DAILY_LOGIN: "daily_login",

    DAILY_ACTIVITY: "daily_activity",

    ACHIEVEMENTS: "achievements",

    MILESTONES: "milestones",

    REFERRAL_BONUSES: "referral_bonuses",

    SPECIAL_EVENTS: "special_events"

};

const BONUS_STORAGE_PREFIX = "wm_bonus_";


/**************************************************************************
 * Bonus Reward Helper Functions
 **************************************************************************/

/**
 * Returns today's UTC date.
 * Example: 2026-07-22
 */
function getTodayUTC() {

    return new Date().toISOString().slice(0, 10);

}

/**
 * Returns the localStorage key for a bonus.
 */
function getBonusStorageKey(bonusKey) {

    return BONUS_STORAGE_PREFIX + bonusKey;

}

/**
 * Returns true if this browser can claim the bonus today.
 * This is only a frontend optimization.
 * The API performs the final verification.
 */
function canClaimBonusToday(bonusKey) {

    return (
        localStorage.getItem(
            getBonusStorageKey(bonusKey)
        ) !== getTodayUTC()
    );

}

/**
 * Saves today's successful claim in localStorage.
 * Call only after the API returns success.
 */
function saveBonusClaimToday(bonusKey) {

    localStorage.setItem(
        getBonusStorageKey(bonusKey),
        getTodayUTC()
    );

}

/**
 * Removes today's local claim.
 * Useful during development/testing.
 */
function clearBonusClaimToday(bonusKey) {

    localStorage.removeItem(
        getBonusStorageKey(bonusKey)
    );

}

/**
 * Enables or disables a claim button.
 */
function updateClaimButton(button, eligible) {

    button.disabled = !eligible;

    if (eligible) {

        button.classList.remove(
            "opacity-50",
            "cursor-not-allowed"
        );

    } else {

        button.textContent = "Already Claimed Today";

        button.classList.add(
            "opacity-50",
            "cursor-not-allowed"
        );

    }

}

/**
 * Generic helper to claim a bonus.
 * Returns the API response object.
 */
async function postBonusClaim(url) {

    try {

        const response = await fetch(API_BASE + url, {
            method: "POST",
            credentials: "include"
        });

        const data = await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.message || "Unable to claim bonus."
            );

        }

        return data;

    } catch (error) {

        return {
            success: false,
            message: error.message
        };

    }

}


/**************************************************************************
 * Daily Login Bonus
 **************************************************************************/

function initDailyLogin() {

    const button = document.getElementById("claim-daily-login");
    const message = document.getElementById("daily-login-message");

    if (!button || !message) {
        return;
    }

    updateClaimButton(
        button,
        canClaimBonusToday(BONUS_KEYS.DAILY_LOGIN)
    );

    if (!canClaimBonusToday(BONUS_KEYS.DAILY_LOGIN)) {

        message.textContent = "You have already claimed today's login bonus.";
        

    }

    button.addEventListener("click", async () => {

        button.disabled = true;
    
        const data =
            await postBonusClaim(
                "/bonus/daily-login"
            );
            if (!data.success) {

                message.textContent = data.message;
            
                // Server confirms today's bonus already exists.
                if (
                    data.message ===
                    "You have already claimed today's login bonus."
                ) {
            
                    saveBonusClaimToday(
                        BONUS_KEYS.DAILY_LOGIN
                    );
            
                    updateClaimButton(
                        button,
                        false
                    );
            
                } else {
            
                    updateClaimButton(
                        button,
                        true
                    );
            
                }
            
                return;
            
            }
    
        saveBonusClaimToday(
            BONUS_KEYS.DAILY_LOGIN
        );
    
        updateClaimButton(
            button,
            false
        );
    
        message.textContent =
            data.message;
    
        if (
            typeof refreshMemberBalance ===
            "function"
        ) {
    
            clearDashboardData();
            refreshMemberBalance();
    
        }
    
    });

}

/**************************************************************************
 * Initialize
 **************************************************************************/

document.addEventListener("DOMContentLoaded", () => {

    initDailyLogin();

});

