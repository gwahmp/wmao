const profileName = document.getElementById("profileName");

const params = new URLSearchParams(window.location.search);

const userid = (params.get("u") || "").trim();

if (!/^[a-z0-9]{10}$/.test(userid)) {

    profileName.textContent = "Profile Not Found";

    console.warn("Invalid User ID:", userid);

} else {
console.log("user ID validated");
var puSession = sessionStorage.getItem("pp-"+userid);
if(puSession){
    var sProfile = JSON.parse(puSession);

    profile = sProfile;
    
    loadHero(profile);
    
    startWaitForInteraction();    
    console.log(profile);
}else{
    loadProfile(userid);
    console.log("no session");
}

}

async function loadProfile(userid) {

    // fetch API here
    
fetch(`https://api.wikimint.com/profile?u=${userid}`).then(res => res.json())

.then(data => {
    console.log("data fetched");

    if (!data.success) {

        document.getElementById("profileName").textContent = "Profile Not Found";

        return;

    }

    profile = data.profile;

    sessionStorage.setItem("pp-"+userid,JSON.stringify(profile));

    console.log("Rendering profile");

    loadHero(profile);

    startWaitForInteraction();    

});


}

function loadHero(profile)
{

    document.querySelector('.lph')?.remove();

    document.getElementById("profileArea").classList.remove("hidden");

         document.querySelectorAll(".pname").forEach(el => {el.textContent =profile.name;});
    

    
        document.getElementById("description").textContent =
        profile.description || "Not Available";   
        
        document.getElementById("headline").textContent =
        profile.headline || "Headline Not Available"; 

        document.getElementById("cat").textContent =
        profile.profile_category
            ? profile.profile_category
                .replace(/-/g, " ")
                .replace(/\b\w/g, c => c.toUpperCase())
            : "Not Available";

        document.getElementById("views").textContent =
        profile.profile_views || "0"; 

        document.getElementById("skills").textContent =
        profile.skills || "Not Available"; 

        document.getElementById("services").textContent =
        profile.services || "Not Available"; 

        document.getElementById("location").textContent =
    (profile.location || "Not Available") +
    ", " +
    (profile.country || "Not Available");

   /* if(profile.photo)
    {
        document.getElementById("profilePhoto").src =
            profile.photo;
    }*/

    document.querySelector("#created_at").textContent =
    profile.created_at
        ? new Date(profile.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long"
          })
        : "";


    const socialContainer =
    document.getElementById("socialLinks");

socialContainer.innerHTML = "";

const socials = [

    {
        name: "Facebook",
        url: profile.facebook,
        icon: "/assets/svg/facebook.svg"
    },

    {
        name: "LinkedIn",
        url: profile.linkedin,
        icon: "/assets/svg/linkedin.svg"
    },

    {
        name: "GitHub",
        url: profile.github,
        icon: "/assets/svg/github.svg"
    },

    {
        name: "YouTube",
        url: profile.youtube,
        icon: "/assets/svg/youtube.svg"
    },

    {
        name: "Twitter",
        url: profile.twitter,
        icon: "/assets/svg/x.svg"
    }

];

const activeSocials =
    socials.filter(s => s.url);

if (activeSocials.length > 0) {

    const list =
        document.createElement("div");

    list.className =
        "flex gap-6 mb-4";

    socialContainer.appendChild(list);

    activeSocials.forEach(social => {

        const a =
            document.createElement("a");

        a.href =
            social.url;

        a.target =
            "_blank";

        a.rel =
            "nofollow noopener noreferrer";

        a.title =   `${social.name}`;  

        a.innerHTML = 
        `
        <img
            loading="lazy"
            src="${social.icon}"
            alt="${social.name}"
            width="30"
            height="30"
            class="w-10 h-10 flex-shrink-0"
            style="margin-top:5px!important;margin-bottom:0!important;"
        />
        `;

        list.appendChild(a);

    });

    socialContainer.classList.remove("hidden");

}
else {

    socialContainer.classList.add("hidden");

}

    if(profile.website)
    {

      document.getElementById("website").textContent= profile.website
      .replace(/^https?:\/\//i, "")
      .split("/")[0];;

       document.getElementById("websiteLink").href = profile.website;

         document
            .getElementById("websiteContainer")
            .classList
            .remove("hidden");

    }



    const rlcontainer =
    document.getElementById("recommendedLinks");

rlcontainer.innerHTML = "";

if (profile.recommended_links.length > 0) {

    const rlH2 =
        document.createElement("h2");

    rlH2.textContent =
        "Recommended Links";

    rlcontainer.appendChild(rlH2);

    const rlOl =
        document.createElement("ol");

    rlOl.className =
        "list-decimal list-inside space-y-2";

    rlcontainer.appendChild(rlOl);

    profile.recommended_links.forEach(link => {

        const li =
            document.createElement("li");

        const a =
            document.createElement("a");

        a.href =
            link.url;

        a.title =
            link.title;

        a.target =
            "_blank";

        a.rel =
            "nofollow noopener noreferrer";

        a.textContent =
            link.title;

        a.className =
            "text-blue-600 hover:underline";

        li.appendChild(a);

        rlOl.appendChild(li);

    });

    rlcontainer.classList.remove("hidden");

}
else {

    rlcontainer.classList.add("hidden");

}


    
const description = profile.description || "Not Available";

const descEl = document.getElementById("description");
const btn = document.getElementById("showMoreBtn");

const maxChars = 275;

if (description.length <= maxChars) {
    descEl.textContent = description;
} else {
    descEl.textContent = description.substring(0, maxChars) + "...";
    btn.classList.remove("hidden");

    btn.addEventListener("click", () => {
        if (btn.textContent === "Show More") {
            descEl.textContent = description;
            btn.textContent = "Show Less";
            descEl.style.whiteSpace = "pre-line";
                        } else {
            descEl.textContent = description.substring(0, maxChars) + "...";
            btn.textContent = "Show More";
            descEl.style.whiteSpace = "";
                        }
    });
}



}


async function recordProfileView() {

    if (!profile?.userid) {

        return;

    }

    if (!hasUserInteracted()) {

        return;

    }

    const unique = await recordUniqueVisit({

        visitorid: getBrowserId(),

        targetid: profile.userid,

        type: VISIT_TYPES.PROFILE,

        duration: VISIT_DURATION.DAY

    });

    if (!unique) {

        return;

    }

    try {

        const response = await fetch(

            "https://api.wikimint.com/profile/view",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({
                    userid: profile.userid,
                    visitorid: getBrowserId()
                })

            }

        );

        const result = await response.json();

        if (!result.success) {

            return;

        }

        profile.profile_views++;

        document.getElementById("views").textContent =
            profile.profile_views;

    }

    catch (err) {

        console.error(err);

    }

}