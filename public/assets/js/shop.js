(function () {
  const allowedHosts = ["www.wikimint.com", "app.wikimint.com", "127.0.0.1", "wikimint.serveo.net"];
  if (!allowedHosts.includes(location.hostname)) window.stop();
})();

const productData = JSON.parse(document.getElementById('productData').textContent);
let displayedCount = 0;
const BATCH_SIZE = 10;

function renderProduct(product, includeControls = true) {
  const [id, category, tag, img, alt, title, name, link] = product;
  const favIds = JSON.parse(localStorage.getItem('favourites') || '[]');
  const isFav = favIds.includes(String(id));

  const controls = includeControls ? `
    <div class="mt-4">
      <!-- Icons Row -->
      <div class="flex justify-center items-center gap-4 mb-3">
        <i class="bi ${isFav ? 'bi-heart-fill text-[#ED4956]' : 'bi-heart text-gray-600 hover:text-red-500'} 
           favorite-btn cursor-pointer text-xl transition-colors duration-200" 
           data-id="${id}" title="Add to favorites"></i>

        <i class="bi bi-share share-btn cursor-pointer text-gray-600 hover:text-blue-600 
           text-xl transition-colors duration-200" 
           data-id="${id}" title="Share"></i>
      </div>

      <!-- Full-width Button -->
      <button data-link="${link}" 
        class="btn w-full">
        Buy Now
      </button>
    </div>` : '';

  return `
    <div id="${id}" 
         class="product-card border border-gray-200 rounded-xl bg-gray-100 shadow-sm hover:shadow-md 
                transition-all duration-300 text-center flex flex-col justify-between"
         data-id="${id}" data-category="${category}" data-tag="${tag}">

      <a href="/recommended?id=${id}" class="block">
        <div class="product-image">
          <img loading="lazy" src="${img}" alt="${alt}" title="${title}" 
               class="w-full h-36 md:h-40 object-contain rounded-t-xl bg-white p-3" />
        </div>
        <div class="product-title text-base md:text-lg font-semibold mt-3 mb-2 px-3 text-gray-800">
          ${name}
        </div>
      </a>

      ${controls}
    </div>`;
}


function renderMainProduct(product, includeControls = true) {
  const [id, category, tag, img, alt, title, name, link] = product;
  const favIds = JSON.parse(localStorage.getItem('favourites') || '[]');
  const isFav = favIds.includes(String(id));

  const controls = includeControls ? `
    <div class="flex flex-wrap items-center gap-4 mt-5">
      <i class="bi ${isFav ? 'bi-heart-fill text-[#ED4956]' : 'bi-heart text-gray-600 hover:text-red-500'} 
         favorite-btn cursor-pointer text-2xl transition-colors duration-200" 
         data-id="${id}" title="Add to favorites"></i>

      <i class="bi bi-share share-btn cursor-pointer text-gray-600 hover:text-blue-600 
         text-2xl transition-colors duration-200" 
         data-id="${id}" title="Share"></i>

      <a href="${link}" target="_blank" 
         class="btn w-full">
        Buy Now
      </a>
    </div>` : '';

  return `
    <div class="max-w-7xl mx-auto my-10 ">
      <h1 class="text-2xl md:text-3xl font-bold mb-8 text-gray-800">${name}</h1>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">

        <!-- Left Column: Image -->
        <div class="col-span-12 md:col-span-6">
          <img loading="lazy" src="${img}" alt="${alt}" title="${title}"
               class="w-full max-h-96 object-contain rounded-xl border border-gray-200 bg-gray-50 shadow-sm" />
        </div>

        <!-- Right Column: Product Details -->
        <div class="col-span-12 md:col-span-6">
          <h2 class="text-xl md:text-2xl font-semibold mb-4 text-gray-900">${title}</h2>
          <p class="text-gray-700 leading-relaxed mb-6">${alt}</p>
          <hr class="border-gray-200 mb-6"/>
          ${controls}

          <div class="bg-gray-300 w-full mt-12"><a href="https://leadsleap.com/?r=selvaklnc" target="_blank"><img src="https://leadsleap.com/images/b300.250.hd.gif" style="max-width:300px;" class="mx-auto"/></a></div>


        </div>
      </div>
    </div>`;
}


function loadProducts(batch = true, filterFn = () => true) {
  const grid = $('#productGrid');
  if (!batch) grid.empty(), displayedCount = 0;

  const toRender = productData.filter(filterFn).slice(displayedCount, displayedCount + BATCH_SIZE);
  toRender.forEach(p => grid.append(renderProduct(p)));
  displayedCount += toRender.length;

  $('#loadMore').toggle(displayedCount < productData.filter(filterFn).length);
}

function filterProducts() {
  const query = $('#search').val().toLowerCase();
  const cat = $('#categoryFilter').val();
  const filterFn = p =>
    (cat === '' || p[1] === cat) &&
    p[6].toLowerCase().includes(query);

  loadProducts(false, filterFn);
}

function renderFavourites() {
  const favIds = JSON.parse(localStorage.getItem('favourites') || '[]');
  const area = $('#favouriteGrid');
  area.empty();

  let hasItems = false;

  favIds.forEach(id => {
    const p = productData.find(prod => String(prod[0]) === String(id));
    if (p) {
      area.append(renderProduct(p));
      hasItems = true;
    }
  });

  if (!hasItems) {
    area.append(`
      <div class="col-span-12 text-center bg-gray-100 text-black border border-gray-300 py-10 text-lg">
        No items found in favourites
      </div>
    `);
  }
}


function renderSingleProduct(id) {
  const product = productData.find(p => String(p[0]) === String(id));
  if (product) $('#product').html(renderMainProduct(product, true));
}

$(document).ready(function () {
  // Filter bar setup
  $('#filterBar').addClass('flex flex-wrap gap-3 mb-6');
  $('#search').addClass('border border-gray-300 rounded-md  py-2 flex-1 min-w-[200px]');
  $('#categoryFilter').addClass('border border-gray-300 rounded-md  py-2');

  // Grid setup
  $('#productGrid, #favouriteGrid').addClass('grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 mb-16');

  // Load more button
  $('#loadMore').addClass('btn mx-auto block');

  // Populate categories
  [...new Set(productData.map(p => p[1]))].forEach(cat =>
    $('#categoryFilter').append(`<option value="${cat}">${cat}</option>`));

  loadProducts();
  renderFavourites();

  $('#search').on('input', filterProducts);
  $('#categoryFilter').on('change', filterProducts);
  $('#loadMore').on('click', () => loadProducts(true));

  // Favorites toggle
  $(document).on('click', '.favorite-btn', function () {
    const id = String($(this).data('id'));
    let favs = JSON.parse(localStorage.getItem('favourites') || '[]');
    if (!favs.includes(id)) favs.push(id);
    else favs = favs.filter(i => i !== id);
    localStorage.setItem('favourites', JSON.stringify(favs));
    renderFavourites();
    filterProducts();
  });

  // Share button logic
  $(document).on('click', '.share-btn', function () {
    const id = $(this).data('id');
    const product = productData.find(p => String(p[0]) === String(id));
    if (!product) return;

    const title = product[1];
    const url = window.location.href.split('?')[0] + '?id=' + product[0];
    const text = `Check out this product: ${title}`;

    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      navigator.share({ title, text, url }).catch(err => console.log('Share failed:', err));
    } else {
      const shareMenu = `
        <div class="share-dropdown absolute bg-white border border-gray-300 rounded-md shadow-lg p-5 z-50 mt-2 text-left text-sm">
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="flex items-center gap-2 hover:text-blue-600 my-3  py-2"><i class="bi bi-facebook"></i> Facebook</a>
          <a href="https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}" target="_blank" class="flex items-center gap-2 hover:text-green-600 my3 py-2"><i class="bi bi-whatsapp"></i> WhatsApp</a>
          <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}" target="_blank" class="flex items-center gap-2 hover:text-black my-3 py-2"><i class="bi bi-twitter-x"></i> Twitter</a>
          <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}" target="_blank" class="flex items-center gap-2 hover:text-[#0077b5] my-3 py-2"><i class="bi bi-linkedin"></i> LinkedIn</a>
        </div>`;
      $('.share-dropdown').remove();
      const $btn = $(this);
      $btn.after(shareMenu);
    }
  });

  // Close dropdown when clicking outside
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.share-btn, .share-dropdown').length) {
      $('.share-dropdown').remove();
    }
  });

  // Affiliate click tracking
  $(document).on('click', '.buy-btn', function () {
    const link = $(this).data('link');
    const id = $(this).closest('.product-card').data('id');
    console.log(`Affiliate click: ${id}`);
    window.open(link, '_blank');
  });

  // Load product from ?id= URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('id');
  if (idParam) renderSingleProduct(idParam);
});
