console.log("Manage Profile Loaded");
var profile;

let promotionalLinks = [];

let editingLink = -1;

ifMember(() => {

    var muSession = sessionStorage.getItem("mp-"+userid);
if(muSession){
    profile = JSON.parse(muSession);
    loadFields();
    console.log(profile);
}else{
    loadProfile(userid);
    console.log("no session");
}

});

async function loadProfile() {

    try {

        const response = await fetch(
            "https://api.wikimint.com/profile/me",
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        profile = data.profile;

        sessionStorage.setItem("mp-"+userid,JSON.stringify(profile));

        console.log("Rendering profile");
        loadFields()

       

    }
    catch (err) {

        console.error(err);

    }

}

function loadFields(){
    // document.getElementById("photo").src =
    // profile.photo || "/assets/images/wikimint.webp";

document.getElementById("userid").value =
    profile.userid;

document.getElementById("email").value =
    profile.email;

document.getElementById("name").value =
    profile.name;

document.getElementById("headline").value =
    profile.headline;
    document.getElementById("description").value =
    profile.description;

updateDescriptionCounter();

document.getElementById("company").value =
profile.company;

document.getElementById("website").value =
profile.website;

document.getElementById("location").value =
profile.location;

loadCountries(
    profile.country ||
    data.detectedCountryCode
);

document.getElementById("services").value =
profile.services;

document.getElementById("skills").value =
profile.skills;

document.getElementById("facebook").value =
profile.facebook;

document.getElementById("linkedin").value =
profile.linkedin;

document.getElementById("github").value =
profile.github;

document.getElementById("youtube").value =
profile.youtube;

document.getElementById("twitter").value =
profile.twitter;

document.getElementById("profile_visibility").value =
profile.profile_visibility || "public";

document.getElementById("profile_category").value = profile.profile_category || "professional";

promotionalLinks =
    profile.recommended_links || [];

renderLinks();

}


const description =
    document.getElementById("description");

description.addEventListener(
    "input",
    updateDescriptionCounter
);

function updateDescriptionCounter() {

    document.getElementById(
        "descriptionCount"
    ).textContent =
        `${description.value.length} / 1000`;

}

const countries = await fetch("/assets/data/countries.json")
    .then(r => r.json());

    async function loadCountries(selectedCountry = "") {

        const response =
            await fetch("/assets/data/countries.json");
    
        const countries =
            await response.json();
    
        const country =
            document.getElementById("country");
    
        country.innerHTML =
            `<option value="">Select Country</option>`;
    
        countries.forEach(item => {
    
            const option =
                document.createElement("option");
    
            option.value =
                item.code;
    
            option.textContent =
                item.name;
    
            if (item.code === selectedCountry) {
    
                option.selected = true;
    
            }
    
            country.appendChild(option);
    
        });
    
    }


        document
    .getElementById("addLinkBtn")
    .addEventListener(
        "click",
        addLink
    );

    function addLink() {

        const title =
            document
                .getElementById("linkTitle")
                .value
                .trim();
    
        const url =
            document
                .getElementById("linkUrl")
                .value
                .trim();
    
        if (!title) {
    
            alert("Enter link title.");
    
            return;
    
        }
    
        if (!url) {
    
            alert("Enter link URL.");
    
            return;
    
        }
    
        if (editingLink === -1) {
    
            if (promotionalLinks.length >= 20) {
    
                alert("Maximum 20 links allowed.");
    
                return;
    
            }
    
            promotionalLinks.push({
    
                title,
                url
    
            });

            console.log("After push:", promotionalLinks);
    
        }
        else {
    
            promotionalLinks[editingLink] = {
    
                title,
                url
    
            };
    
            editingLink = -1;
    
            document.getElementById("addLinkBtn").textContent =
                "+ Add";
    
        }
    
        document.getElementById("linkTitle").value = "";
    
        document.getElementById("linkUrl").value = "";
    
        renderLinks();
    
    }

    function renderLinks() {

        const list =
            document.getElementById("linksList");
    
        if (promotionalLinks.length === 0) {
    
            list.innerHTML = `
                <div class="text-gray-500">
                    No promotional links added.
                </div>
            `;
    
            return;
    
        }
    
        list.innerHTML = "";
    
        promotionalLinks.forEach(
    
            (link, index) => {
    
                list.insertAdjacentHTML(

                    "beforeend",
                
                    `
                    <div class="border rounded-lg p-4 flex justify-between items-center">
                
                        <div>
                
                            <div class="font-semibold">
                
                                ${link.title}
                
                            </div>
                
                            <div class="text-sm text-blue-600 break-all">
                
                                ${link.url}
                
                            </div>
                
                        </div>
                
                        <div class="flex gap-3">
                
                            <button
                                type="button"
                                class="text-blue-600 hover:text-blue-700"
                                onclick="editLink(${index})"
                            >
                
                                Edit
                
                            </button>
                
                            <button
                                type="button"
                                class="text-red-600 hover:text-red-700"
                                onclick="deleteLink(${index})"
                            >
                
                                Delete
                
                            </button>
                
                        </div>
                
                    </div>
                    `
                
                );
    
            }
    
        );
    
    }

    window.deleteLink = function(index) {

        promotionalLinks.splice(index, 1);
    
        if (editingLink === index) {
    
            editingLink = -1;
    
            document.getElementById("linkTitle").value = "";
    
            document.getElementById("linkUrl").value = "";
    
            document.getElementById("addLinkBtn").textContent =
                "+ Add";
    
        }
    
        renderLinks();
    
    }
    window.editLink = function(index) {

        const link =
            promotionalLinks[index];
    
        document.getElementById("linkTitle").value =
            link.title;
    
        document.getElementById("linkUrl").value =
            link.url;
    
        editingLink =
            index;
    
        document.getElementById("addLinkBtn").textContent =
            "Update";
    
        document
            .getElementById("linkTitle")
            .focus();
    
    }

    document
    .getElementById("resetProfileBtn")
    .addEventListener(
        "click",
        () => {

            if (
                confirm(
                    "Discard all unsaved changes?"
                )
            ) {

                loadProfile();

            }

        }
    );

document
    .getElementById("saveProfileBtn")
    .addEventListener(
        "click",
        saveProfile
    );


    function setDirty() {

        document
            .getElementById("saveStatus")
            .textContent =
            "Unsaved changes";
    
    }

async function saveProfile() {

    const profile = {

        name:
            document.getElementById("name").value.trim(),

        headline:
            document.getElementById("headline").value.trim(),

        description:
            document.getElementById("description").value.trim(),

        company:
            document.getElementById("company").value.trim(),

        website:
            document.getElementById("website").value.trim(),

        location:
            document.getElementById("location").value.trim(),

        country:
            document.getElementById("country").value,

        services:
            document.getElementById("services").value.trim(),

        skills:
            document.getElementById("skills").value.trim(),

        facebook:
            document.getElementById("facebook").value.trim(),

        linkedin:
            document.getElementById("linkedin").value.trim(),

        github:
            document.getElementById("github").value.trim(),

        youtube:
            document.getElementById("youtube").value.trim(),

        twitter:
            document.getElementById("twitter").value.trim(),

            recommended_links:
            promotionalLinks,
        
        profile_visibility:
            document.getElementById("profile_visibility").value,
        
        profile_category:
            document.getElementById("profile_category").value,
                       

    };

    console.log("Saving links:", promotionalLinks);

    try {

        document.getElementById("saveProfileBtn").disabled = true;

        document.getElementById("saveStatus").textContent =
            "Saving...";

        const response =
            await fetch(
                "https://api.wikimint.com/profile/update",
                {
                    method: "POST",

                    credentials: "include",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(profile)

                }
            );

        const data =
            await response.json();

        if (!data.success) {

            throw new Error(
                data.message
            );

        }

        document.getElementById("saveStatus").textContent =
            "Profile saved successfully";

        alert("Profile updated successfully.");

        sessionStorage.removeItem("mp-"+userid);
        sessionStorage.removeItem("pp-"+userid);

        await loadProfile();

    }
    catch (err) {

        document.getElementById("saveStatus").textContent =
            "Save failed";

        alert(err.message);

    }
    finally {

        document.getElementById("saveProfileBtn").disabled = false;

    }

}


document.querySelectorAll('.delete').forEach(btn => {
    btn.onclick = async () => {
        
                    const confirmation =
                        prompt(
                            'This action permanently deletes your account.\n\nType DELETE to continue.'
                        );
        
                        if (
                            confirmation
                                ?.trim()
                                .toLowerCase()
                            !==
                            'delete'
                        ) {
        
                        alert(
                            'Account deletion cancelled.'
                        );
        
                        return;
                    }
        
                    await fetch(
                        'https://api.wikimint.com/delete-account',
                        {
                            method:
                                'POST',
        
                            credentials:
                                'include'
                        }
                    );
        
 // Clear local data only after successful server logout
 localStorage.removeItem(CACHE_KEY);
 localStorage.removeItem(VERIFY_KEY);
 localStorage.setItem('loggedIn', 'false');
 localStorage.clear();
 sessionStorage.clear();
 WMAuth.loggedIn = false;
 WMAuth.member = null;

window.location.reload();
                }
            }
            );