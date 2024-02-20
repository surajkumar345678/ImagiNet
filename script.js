const imageWrapper = document.querySelector(".images");
const searchInput = document.querySelector(".search input");
const loadMoreBtn = document.querySelector(".gallery .load-more");
const lightbox = document.querySelector(".lightbox");
const downloadImgBtn = lightbox.querySelector(".fa-download");
const closeImgBtn = lightbox.querySelector(".fa-xmark");

const accessKey = "ex5UyHB148WizUkBFmUIxaJyS_udljr3yPU0hMasVF0";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

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

const showLightbox = (name, img, description) => {
  lightbox.querySelector("img").src = img;
  lightbox.querySelector("span").innerText = name;
  downloadImgBtn.setAttribute("data-img", img);
  lightbox.classList.add("show");
  document.body.style.overflow = "hidden";
};

const hideLightbox = () => {
  lightbox.classList.remove("show");
  document.body.style.overflow = "auto";
};

const generateHTML = (images) => {
  imageWrapper.innerHTML += images
    .map(
      (img) =>
        `<li class="card">
            <img onclick="showLightbox('${img.user.username}', '${img.urls.full}')" src="${img.urls.full}" alt="img">
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

const getImages = (apiURL) => {
  searchInput.blur();
  loadMoreBtn.innerText = "Loading...";
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
      loadMoreBtn.innerText = "Load more...";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch((error) => {
      console.error("Error fetching or displaying images:", error);
      alert("Failed to load images!");
      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
    });
};

const getInitialImages = () => {
  const placeholderQuery = "random";
  const apiUrl = `https://api.unsplash.com/search/photos?page=${currentPage}&per_page=${perPage}&query=${placeholderQuery}`;
  getImages(apiUrl);
};

getInitialImages();

const loadMoreImages = () => {
  currentPage++;
  let apiUrl = `https://api.unsplash.com/search/photos?page=${currentPage}&per_page=${perPage}&query=${searchTerm}`;
  getImages(apiUrl);
};

const loadSearchImages = (e) => {
  if (e.target.value === "") return (searchTerm = null);
  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    imageWrapper.innerHTML = "";
    loadMoreImages();
  }
};

loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeImgBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);
