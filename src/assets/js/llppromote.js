document.addEventListener("DOMContentLoaded", function () {

  // Get llpu parameter
  var llpu = new URLSearchParams(window.location.search).get("llpu");

  if (!llpu) return;

  // Replace referral username in links
  document.querySelectorAll("a.llpu").forEach(link => {
      link.href = link.href
          .replace(/\?r=selvaklnc/i, "?r=" + encodeURIComponent(llpu))
          .replace(/&r=selvaklnc/i, "&r=" + encodeURIComponent(llpu));
  });


  var popup = document.getElementById("iframePopup");
  var iframe = popup.querySelector("iframe#llpcoop");

  // Get llpu parameter
  var llpu = new URLSearchParams(window.location.search).get("llpu") || "selvaklnc";

  // Set iframe URL
  iframe.src = "https://leadsleap.com/?r=" + encodeURIComponent(llpu);


});



document.addEventListener("DOMContentLoaded", function () {

  let popupShown = false;
  
  function showPopup() {
  
  
  
      if (popupShown) return;
      popupShown = true;
  
      const popup = document.getElementById("iframePopup");
      const iframe = popup.querySelector("iframe#llpcoop");
      const closeBtn = document.getElementById("popupCloseBtn");
  
      // Get llpu parameter
      var llpu = new URLSearchParams(window.location.search).get("llpu") || "selvaklnc";
  
      // Set iframe URL
      iframe.src = "https://lltrco.com/?r=" + encodeURIComponent(llpu);
  
      document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  
      // Show as overlay popup
      popup.style.display = "flex";
      popup.style.position = "fixed";
      popup.style.bottom = "40px";
      popup.style.left = "0";
      popup.style.width = "100%";
      popup.style.height = "100%";
      popup.style.background = "rgba(0,0,0,0.1)";
      popup.style.justifyContent = "center";
      popup.style.alignItems = "end";
      popup.style.zIndex = "999999";
  
      let seconds = 6;
  
      closeBtn.style.display = "block";
      closeBtn.disabled = true;
      closeBtn.textContent = `Wait ${seconds} seconds`;
  
      const countdown = setInterval(function () {
  
          seconds--;
  
          if (seconds > 0) {
  
              closeBtn.textContent = `Wait ${seconds} seconds`;
  
          } else {
  
              clearInterval(countdown);
  
              closeBtn.textContent = "X Close";
              closeBtn.disabled = false;
              closeBtn.style.cursor = "pointer";
  
              closeBtn.addEventListener("click", function () {
  
                  closeBtn.style.display = "none";
  
                  popup.style.display = "";
                  popup.style.position = "";
                  popup.style.top = "";
                  popup.style.left = "";
                  popup.style.width = "";
                  popup.style.height = "";
                  popup.style.background = "";
                  popup.style.justifyContent = "";
                  popup.style.alignItems = "";
                  popup.style.zIndex = "";
                  iframe.style.width = "100%";

                  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  
              }, { once: true });
  
          }
  
      }, 1000);
  }
  
  // Show popup on first downward scroll
  window.addEventListener("scroll", function () {
  
      if (window.scrollY > 100) {
          showPopup();
      }
  
  }, { passive: true });
  
  });