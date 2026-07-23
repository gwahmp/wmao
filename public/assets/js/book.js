document.addEventListener("DOMContentLoaded", () => {
    const readBtn = document.getElementById("readBook");
    const downloadBtn = document.getElementById("downloadBook");
    const modal = document.getElementById("pdfModal");
    const closeModal = document.getElementById("closeModal");
    const pdfViewer = document.getElementById("pdfViewer");

    // Get current slug (last part of URL)
    const slug = window.location.pathname.split("/").filter(Boolean).pop();
    const pdfFile = `https://s.wikimint.com/ebooks/${slug}.pdf`; // <-- Adjust folder path

    // READ (Open Modal with PDF)
    readBtn.addEventListener("click", () => {
      pdfViewer.src = pdfFile;
      modal.classList.remove("hidden");
      document.body.classList.add("overflow-hidden"); // 🔒 disable scroll
    });

    // CLOSE MODAL
    closeModal.addEventListener("click", () => {
      modal.classList.add("hidden");
      pdfViewer.src = ""; // clear to stop loading
      document.body.classList.remove("overflow-hidden"); // 🔓 re-enable scroll
    });

// DOWNLOAD
downloadBtn.addEventListener("click", async () => {
    const originalText = downloadBtn.innerHTML;
    downloadBtn.textContent = "Downloading...";
    downloadBtn.disabled = true;
  
    try {
      // Fetch the PDF file
      const response = await fetch(pdfFile);
      if (!response.ok) throw new Error("Failed to fetch PDF");
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
  
      // Create a hidden link for download
      const link = document.createElement("a");
      link.href = url;
      link.download = slug + ".pdf"; // force download filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Cleanup
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Sorry, the file couldn't be downloaded. Please try again.");
    }
  
    setTimeout(() => {
      // Reset button
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    }, 3000);
  });
  
  });