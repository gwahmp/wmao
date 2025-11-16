document.addEventListener("DOMContentLoaded", () => {
  const postBody = document.querySelector(".post-content");
  const tocContainer = document.getElementById("wmdTOC");
  const toggle = document.getElementById("Tog");
  if (!postBody || !tocContainer) return;

  const headings = postBody.querySelectorAll("h2, h3, h4, h5, h6");
  if (!headings.length) return;

  // Root list
  const rootOl = document.createElement("ol");
  let currentLevel = 2; // start at H2
  const stack = [rootOl];
  let counter = 0;

  const slugify = (txt) =>
    txt.trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

  headings.forEach((h) => {
    const level = parseInt(h.tagName[1], 10);
    const text = h.textContent || "";
    const id = `${slugify(text)}-${++counter}`;
    h.id = id;

    // climb up or down the stack
    if (level > currentLevel) {
      for (let i = 0; i < level - currentLevel; i++) {
        // ensure there is a <li> to nest under
        const parentList = stack[stack.length - 1];
        let parentLi = parentList.lastElementChild;
        if (!parentLi) {
          parentLi = document.createElement("li");
          parentList.appendChild(parentLi);
        }
        const newOl = document.createElement("ol");
        parentLi.appendChild(newOl);
        stack.push(newOl);
      }
    } else if (level < currentLevel) {
      for (let i = 0; i < currentLevel - level; i++) stack.pop();
    }
    currentLevel = level;

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.rel = "nofollow";
    a.textContent = text;
    li.appendChild(a);
    stack[stack.length - 1].appendChild(li);
  });

  tocContainer.innerHTML = "";
  tocContainer.appendChild(rootOl);

  // toggle
  toggle.addEventListener("click", function () {
    const visible = tocContainer.style.display !== "none";
    tocContainer.style.display = visible ? "none" : "block";
    this.textContent = visible ? "Show" : "Hide";
  });
});