// Selectors
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const searchbtn = document.querySelector('.submit-btn');
const prevBtns = document.querySelectorAll('.prev-btn');
const currentBtns = document.querySelectorAll('.current-btn');
const nextBtns = document.querySelectorAll('.next-btn');

// Variables
// The api key for pexels
const auth = '563492ad6f917000010000018692c4d62eb0496abef68367cc670154';
const baseURL = 'https://api.pexels.com/v1';
let isSearching = false;
let currentQuery;
let currentPage = 1;
let pictureAmount = 20;
let photoSize = 'large';

// Event listeners
searchbtn.addEventListener('click', e => {
  e.preventDefault();
  gallery.innerHTML = '';
  currentPage = 1;
  isSearching = true;
  currentQuery = searchInput.value;
  getSearched(currentQuery);
  searchInput.value = '';
});

prevBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentPage -= 1;
    gallery.innerHTML = '';
    if (isSearching) {
      getSearched(currentQuery);
    } else {
      getCurated();
    }
    window.scrollTo(0, 0);
  });
});

nextBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentPage += 1;
    gallery.innerHTML = '';
    if (isSearching) {
      getSearched(currentQuery);
    } else {
      getCurated();
    }
    window.scrollTo(0, 0);
  });
});

// Functions
//* fetch data from pexels.com
async function fetchData(url) {
  const dataFetch = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: auth,
    },
  });
  return dataFetch.json();
}

//* create an image container for the gallery
function createImage(photo) {
  console.log(photo);
  // Create the card for the image and add it to gallery
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');
  imageContainer.innerHTML = `<img src="${photo.src.medium}"></img>`;
  const resolution = document.createElement('p');
  resolution.innerHTML = `Resolution: ${photo.height}x${photo.width}`;
  imageContainer.appendChild(resolution);
  const photographerParagraph = document.createElement('p');
  photographerParagraph.innerHTML = `Photographer: <span class="photographer">${photo.photographer}</span>`;
  imageContainer.appendChild(photographerParagraph);
  const photographerUrl = document.createElement('p');
  photographerUrl.innerHTML = `url: <br><span class="photographer-url"><a href="${photo.url}">${photo.url}</a></span>`;
  imageContainer.appendChild(photographerUrl);
  // Opens a new window with the image in original size where user can download
  const downloadBtn = document.createElement('a');
  downloadBtn.href = photo.src.original;
  downloadBtn.setAttribute('target', '_blank');
  downloadBtn.innerHTML = `<button>Download</button>`;
  imageContainer.appendChild(downloadBtn);

  gallery.appendChild(imageContainer);
}

//* Get the current curated photos from pexels.com, 15 at a time
async function getCurated() {
  let curatedURL = baseURL + `/curated?per_page=${pictureAmount}&page=${currentPage}`;
  // console.log(curatedURL);
  data = await fetchData(curatedURL);
  updateNav();
  data.photos.forEach(photo => createImage(photo));
}

//* Search for new photos
async function getSearched(query) {
  // console.log(query);
  let searchURL = baseURL + `/search?query=${query}&per_page=${pictureAmount}&page=${currentPage}`;
  // console.log(searchURL);
  data = await fetchData(searchURL);
  // console.log(data);
  // Find out how many pages there are and put that number on the button reflecting the current page
  let pages = Math.ceil(data.total_results / data.per_page);
  updateNav(pages);
  data.photos.forEach(photo => createImage(photo));
  // console.log(data);
}

//* update the nav buttons depending on the current page and how many pages there are
function updateNav(pages = 0) {
  // console.log('updateNav() is run');
  currentBtns.forEach(btn => {
    if (pages > 0) {
      btn.innerHTML = `${currentPage} of ${pages}`;
    } else {
      btn.innerHTML = `${currentPage}`;
    }
  });
  if (currentPage == 1) {
    prevBtns.forEach(btn => {
      btn.classList.add('inactive');
    });
  } else {
    prevBtns.forEach(btn => {
      btn.classList.remove('inactive');
    });
  }
  if (currentPage >= pages && isSearching) {
    nextBtns.forEach(btn => {
      btn.classList.add('inactive');
    });
  } else {
    nextBtns.forEach(btn => {
      btn.classList.remove('inactive');
    });
  }
}

getCurated();
