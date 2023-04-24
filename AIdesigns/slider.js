const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const images = document.querySelectorAll(".slider img");

let index = 0;

function showImage() {
  images.forEach((image) => (image.style.opacity = 0));
  images[index].style.opacity = 1;
}

function prevImage() {
  index--;
  if (index < 0) {
    index = images.length - 1;
  }
  showImage();
}

function nextImage() {
  index++;
  if (index > images.length - 1) {
    index = 0;
  }
  showImage();
}

prevBtn.addEventListener("click", prevImage);
nextBtn.addEventListener("click", nextImage);
