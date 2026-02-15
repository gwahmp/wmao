(function () {
  const url = new URL(window.location.href);
  const pc = url.searchParams.get("pc");

  if (pc && /^\d{6}$/.test(pc)) {
    // Store PIN
    localStorage.setItem("pc", pc);

    // Remove pc from URL
    url.searchParams.delete("pc");

    // Clean URL without reloading
    window.history.replaceState({}, document.title, url.pathname + url.hash);
  }
})();

document.addEventListener("DOMContentLoaded", () => {
    const productLink = sessionStorage.getItem("current_prod");
    const productTitle = sessionStorage.getItem("current_prod_title");
    const purchaseCode = localStorage.getItem("pc");
    const area = document.getElementById("download-area");
    const downloadBtn = document.getElementById("download-btn");
    const downloadTitle = document.getElementById("download-title");
    const otherDownloads = document.getElementById("other-downloads");
    const pcode = 563124;

    if (productLink && purchaseCode && (purchaseCode==pcode)) {
        downloadBtn.setAttribute("href",productLink);
        downloadTitle.innerHTML = "<h3>" + productTitle + "</h3> <span>Product Direct Link:<br/></span><code>" + productLink + "</code><br/><span style='color:green;'>If below download button blocks pop-up, visit above link directly to download the product.</span><br/><span class='mb-6 block'>If still any issue with the products, chat with me through <a href='https://wa.me/919976126754?text=Hi, Regarding digital assets products download.' target='_blank'>WhatsApp here</a>.</span>";
        downloadBtn.style.display = "block";
        downloadTitle.style.display = "block";
        area.style.display = "none";
        otherDownloads.style.display = "none";
    }else if(!productLink && purchaseCode){
        downloadBtn.style.display = "none";
        downloadTitle.style.display = "none";
        area.style.display = "none";
        otherDownloads.style.display = "block";

    }else{
        downloadBtn.style.display = "none";
        downloadTitle.style.display = "none";
        otherDownloads.style.display = "none";
        area.style.display = "block";
    }


      document.getElementById("save-code-btn").addEventListener("click", () => {
        const code = document.getElementById("purchase-code-input").value.trim();
        if (code && (code==pcode)) {
          localStorage.setItem("pc", code);
          location.reload(); // Reload to show download button
        } else {
          alert("Please enter a valid purchase code.");
        }
      });
      
    


    document.getElementById("download-btn").addEventListener("click", () => {
        sessionStorage.removeItem("current_prod"); 
        sessionStorage.removeItem("current_prod_title"); 
        location.reload();
      });





  });
