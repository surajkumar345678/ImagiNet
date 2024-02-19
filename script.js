const accessKey = "ex5UyHB148WizUkBFmUIxaJyS_udljr3yPU0hMasVF0";
const formEl = document.querySelector("form");
const inputEl = document.getElementById("search-input");
const searchResults = document.querySelector(".search-results");
const showMore = document.getElementById("show-more-button");

let inputData = "";
let page = 1;

async function fetchAndDisplayImages() {
  try {
    inputData = inputEl.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.results;

    if (page === 1) {
      searchResults.innerHTML = "";
    }

    for (const result of results) {
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("search-result");

      const image = document.createElement("img");
      image.src = result.urls.small;
      image.alt = result.alt_description;

      const imageLink = document.createElement("a");
      imageLink.href = result.links.html;
      imageLink.target = "_blank";
      imageLink.textContent = result.alt_description;

      imageWrapper.appendChild(image);
      imageWrapper.appendChild(imageLink);
      searchResults.appendChild(imageWrapper);
    }

    page++;
    if (page > 1) {
      showMore.style.display = "block";
    }
  } catch (error) {
    console.error("Error fetching or displaying images:", error);
  }
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  fetchAndDisplayImages();
});

showMore.addEventListener("click", () => {
  fetchAndDisplayImages();
});
