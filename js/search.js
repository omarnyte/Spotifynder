const searchForm = document.querySelector(".search-form");

searchForm.addEventListener("submit", e => {
  e.preventDefault();

  const searchQuery = document.querySelector(".search-bar");
  searchQuery.value = ""; 
});
