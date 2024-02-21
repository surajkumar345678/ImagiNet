// Selecting DOM elements
const imageWrapper = document.querySelector(".images");
const searchInput = document.querySelector(".search input");
const loadMoreBtn = document.querySelector(".gallery .load-more");
const lightbox = document.querySelector(".lightbox");
const downloadImgBtn = lightbox.querySelector(".fa-download");
const closeImgBtn = lightbox.querySelector(".fa-xmark");

// Unsplash API access key and configuration
const accessKey = "ex5UyHB148WizUkBFmUIxaJyS_udljr3yPU0hMasVF0";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

// Function to download an image
const downloadImg = (imgUrl) => {
  fetch(imgUrl)
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download image!"));
};

// Function to show the lightbox with image details
const showLightbox = (name, img, description) => {
  lightbox.querySelector("img").src = img;
  lightbox.querySelector("span").innerText = name;
  lightbox.querySelector(".description").innerText = description || "No description available"; // Assuming you have an element for displaying the description

  downloadImgBtn.setAttribute("data-img", img);
  lightbox.classList.add("show");
  document.body.style.overflow = "hidden";
};

// Function to hide the lightbox
const hideLightbox = () => {
  lightbox.classList.remove("show");
  document.body.style.overflow = "auto";
};

// Function to generate HTML for images
// Function to generate HTML for images
const generateHTML = (images) => {
  imageWrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card">
            <img onclick="showLightbox('${img.user.name}', '${img.urls.full}', '${img.description}')" src="${img.urls.full}" alt="img">
            <div class="details">
                <div class="photographer">
                  <i class="fa-solid fa-camera fa-beat-fade"></i>
                  <span>${img.user.name}</span>
                </div>
                <button onclick="downloadImg('${img.urls.full}');">
                  <i class="fa-solid fa-download fa-beat-fade"></i>
                </button>
            </div>
        </li>`
    )
    .join("");
};


// Function to fetch images from the Unsplash API
const getImages = (apiURL) => {
  searchInput.blur();
  loadMoreBtn.innerHTML = `Loading. . . `;
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      generateHTML(data.results);
      loadMoreBtn.innerHTML = `Load More &nbsp <i class="fa-solid fa-angle-right fa-beat-fade"></i>`;
      loadMoreBtn.classList.remove("disabled");
    })
    .catch((error) => {
      console.error("Error fetching or displaying images:", error);
      alert("Failed to load images!");
      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
    });
};

// Function to get initial images on page load
const getInitialImages = () => {
  const placeholderQuery = "random";
  const apiUrl = `https://api.unsplash.com/search/photos?page=${currentPage}&per_page=${perPage}&query=${placeholderQuery}`;
  getImages(apiUrl);
};

getInitialImages();

// Function to load more images when the "Load More" button is clicked
const loadMoreImages = () => {
  currentPage++;
  let apiUrl = `https://api.unsplash.com/search/photos?page=${currentPage}&per_page=${perPage}&query=${searchTerm}`;
  getImages(apiUrl);
};

// Function to load search images when Enter is pressed in the search input
const loadSearchImages = (e) => {
  if (e.target.value === "") return (searchTerm = null);
  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    imageWrapper.innerHTML = "";
    loadMoreImages();
  }
};

// Event listeners
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeImgBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);
