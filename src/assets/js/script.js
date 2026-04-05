document.addEventListener("DOMContentLoaded", function () {
  let lastScrollTop = 0;
  const headerMenu = document.querySelector("header");

  // Hide/Show header on scroll
  window.addEventListener("scroll", function () {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    headerMenu.style.transition = "opacity 0.3s ease";
    if (st > lastScrollTop) {
      headerMenu.style.opacity = "0";
      headerMenu.style.pointerEvents = "none";
    } else {
      headerMenu.style.opacity = "1";
      headerMenu.style.pointerEvents = "auto";
    }
    lastScrollTop = st <= 0 ? 0 : st;
  });

  // Email popup with cookie
  if (!getCookie("emailPopupClosed")) {
    setTimeout(function () {
      const popup = document.getElementById("emailPopup");
      if (popup) popup.style.display = "block";
    }, 4000);
  }

  // Offcanvas
  const openBtns = document.querySelectorAll(".open-canvas");
  const closeBtns = document.querySelectorAll(".close-canvas");
  const canvas = document.getElementById("offcanvas");
  const overlay = document.getElementById("overlay");

  function openCanvas() {
    if (canvas && overlay) {
      canvas.classList.remove("translate-x-full");
      overlay.classList.remove("hidden");
    }
  }
  function closeCanvas() {
    if (canvas && overlay) {
      canvas.classList.add("translate-x-full");
      overlay.classList.add("hidden");
    }
  }

  openBtns.forEach(btn => btn.addEventListener("click", openCanvas));
  closeBtns.forEach(btn => btn.addEventListener("click", closeCanvas));
  if (overlay) overlay.addEventListener("click", closeCanvas);

  // Data links
  document.querySelectorAll("[data-link],[data-url]").forEach(function (el) {
    el.addEventListener("click", function () {
      let url = el.getAttribute("data-link") || el.getAttribute("data-url");
      if (url) window.open(url, "_blank");
    });
  });
});

// --- Cookie functions ---
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
  }
  return null;
}
function closePopup() {
  const popup = document.getElementById("emailPopup");
  if (popup) popup.style.display = "none";
  setCookie("emailPopupClosed", "yes", 7);
}


/*Products purchase start*/
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-prod]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const link = btn.getAttribute("data-prod");
      const title = btn.getAttribute("data-title");
      if (link) {
        sessionStorage.setItem("current_prod", link);
        sessionStorage.setItem("current_prod_title", title);
        window.location.href = "/digital-assets#download"; // clean URL
      }
    });
  });
});
/*Products purchase ends*/


/* Ad load starts */
document.addEventListener("DOMContentLoaded", function () {
  const mainAd = document.getElementById("mainAd");
  const sidebarAd = document.getElementById("sidebarAd");

  // Define the content to append
  const mainAdContent = `
  <a href="https://leadsleap.com/?r=selvaklnc"><img src="https://leadsleap.com/images/b728.90.hd.gif" width="100%"/></a>

  <a href="/web-development-services"><img src="/assets/images/web-development-services.webp" width="100%" class="mt-10"/></a>
  
  `;
  const sidebarAdContent = `
  <a href="https://leadsleap.com/?r=selvaklnc"><img src="https://leadsleap.com/images/b300.250.hd.gif" width="100%"/></a>

  <a href="/web-development-services"><img src="/assets/images/build-website-grow-business-cta.webp" width="100%" class="my-5 bg-gray-100 border border-gray-200"/></a>
  `;

  // Define a handler function
  function appendAds() {
    if (mainAd && !(window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent))) {
      mainAd.innerHTML += mainAdContent;
    }
    
       if (sidebarAd) sidebarAd.innerHTML += sidebarAdContent;

    // Optional: remove listeners if you want it to happen only once
    window.removeEventListener("scroll", appendAds);
    window.removeEventListener("click", appendAds);
    window.removeEventListener("mousemove", appendAds);
  }

  // Add listeners for multiple interactions
  window.addEventListener("scroll", appendAds, { once: true });
  window.addEventListener("click", appendAds, { once: true });
  window.addEventListener("mousemove", appendAds, { once: true });
});
/* Ad load ends */


/* Image slider starts */
document.querySelectorAll('.slider').forEach((slider) => {
  const slides = slider.querySelector('.slides');
  const images = slides.children;
  const nextBtn = slider.querySelector('.next');
  const prevBtn = slider.querySelector('.prev');

  let index = 0;

  function updateSlide() {
    slides.style.transform = `translateX(-${index * 100}%)`;
  }

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % images.length;
    updateSlide();
  });

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length;
    updateSlide();
  });
});
/* Image slider ends*/

/*Code copy starts */
function copyCode(btn) {
  const pre = btn.parentElement?.querySelector('pre');
  if (!pre) return;

  const text = pre.innerText;

  navigator.clipboard.writeText(text).then(() => {
    const original = btn.innerText;
    btn.innerText = 'Copied!';
    btn.classList.add('bg-green-100');

    setTimeout(() => {
      btn.innerText = original;
      btn.classList.remove('bg-green-100');
    }, 1500);
  });
}
/*Code copy ends */

function applyLinkRules(root = document) {
  const links = root.querySelectorAll('a[href]');
  const currentHost = window.location.hostname;

  links.forEach(link => {
    const href = link.getAttribute('href');

    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    try {
      const url = new URL(link.href, window.location.origin);

      if (url.hostname !== currentHost) {
        link.setAttribute('target', '_blank');

        let rel = (link.getAttribute('rel') || '').split(' ').filter(Boolean);

        if (rel.includes('nofollow')) {
          rel = [...new Set([...rel, 'nofollow', 'noopener', 'noreferrer'])];
        } else {
          rel = [...new Set([...rel, 'noopener', 'noreferrer'])];
        }

        link.setAttribute('rel', rel.join(' '));
      }
    } catch (e) {
      // ignore invalid URLs
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyLinkRules();
});
