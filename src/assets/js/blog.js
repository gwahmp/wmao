
const postsContainer = document.getElementById("posts-container");
const loadMoreBtn = document.getElementById("load-more");

let allPosts = [];
let currentIndex = 6; // already rendered 6
const perPage = 6;

async function fetchPosts() {
  if (allPosts.length === 0) {
    const res = await fetch("/posts.json");
    allPosts = await res.json();
  }
}

function renderPost(post) {
let rawImage = "";

if (post.data && post.data.image) {
  rawImage = post.data.image;
} else if (post.image) {
  rawImage = post.image;
}

const imageSrc = rawImage && rawImage.trim() !== ""
  ? (rawImage.startsWith("http")
      ? rawImage
      : `/assets/images/blog/200/${rawImage}`)
  : "/assets/images/business-motivation-marketing-strategy-personal-finance-strategy.webp";

return `
  <li class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 max-w-7xl mx-auto">
    <div class="col-span-12 md:col-span-4">
      <img loading="lazy" src="${imageSrc}" 
           alt="${post.title || "Post"}" 
           class="w-full h-full object-cover rounded-lg" />
    </div>
    <div class="col-span-12 md:col-span-8">
      
        <a href="/${post.slug}" class="hover:text-wmblue">
          <h3 class="text-xl font-medium mb-1 text-black line-clamp-2">
          ${post.title || ""}
        </h3>
          </a>
      
      <p class="text-sm text-gray-500 mb-2">
        By ${post.author || "Unknown"} · ${post.date ? new Date(post.date).toDateString() : ""}
      </p>
      <p class="text-base text-gray-700 line-clamp-2">${post.description || ""}</p>
    </div>
  </li>`;
}



async function loadPosts() {
  await fetchPosts();
  const slice = allPosts.slice(currentIndex, currentIndex + perPage);
  slice.forEach((post) => {
    postsContainer.insertAdjacentHTML("beforeend", renderPost(post));
  });
  currentIndex += perPage;

  // hide button when no more posts
  if (currentIndex >= allPosts.length) {
    loadMoreBtn.style.display = "none";
  }
}

// ✅ Load posts only on button click
loadMoreBtn.addEventListener("click", loadPosts);