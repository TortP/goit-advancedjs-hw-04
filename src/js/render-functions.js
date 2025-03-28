export function createGalleryMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-item" href="${largeImageURL}">
  <div class="image-wrapper">
    <img src="${webformatURL}" alt="${tags}" />
  </div>
  <div class="info">
              <p>Likes<br><strong>${likes}</strong></p>
              <p>Views<br><strong>${views}</strong></p>
              <p>Comments<br><strong>${comments}</strong></p>
              <p>Downloads<br><strong>${downloads}</strong></p>
            </div>
          </div>
        </li>
      `
    )
    .join('');
}
