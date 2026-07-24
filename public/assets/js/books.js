const books = JSON.parse(`{JSON.stringify(books)}`);
let visible = 12;

const bookList = document.getElementById("list");
const loadMoreBtn = document.getElementById("load-more");

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    const nextBooks = books.slice(visible, visible + 12);
    nextBooks.forEach(book => {
      const li = document.createElement("li");
      li.className = "bg-white p-4 rounded-lg shadow hover:shadow-md transition";
      li.innerHTML = `
        <a href="/books/${book.slug}">
          <img width="100" height="100" src="/assets/images/books/200/${book.data.image}" 
               alt="${book.data.alt}" 
               class="w-full object-cover rounded" loading="lazy" />
          <h3 class="mt-2 text-lg font-semibold">${book.data.title}</h3>
        </a>`;
      bookList.appendChild(li);
    });
    visible += 12;
    if (visible >= books.length) {
      loadMoreBtn.style.display = "none";
    }
  });
}