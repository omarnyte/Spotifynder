export default class relatedArtists {
  constructor(relatedArtistsObject){
    this.render(relatedArtistsObject);
  }

  render(relatedArtistsObject) {
    const relatedArtistsDiv = document.querySelector(".related-artists-div");

    const h1 = document.createElement("h1");
    h1.textContent = "Related Artists";
    relatedArtistsDiv.appendChild(h1);

    const ul = document.createElement("ul");
    relatedArtistsDiv.appendChild(ul);

    relatedArtistsObject.artists.forEach(function(artist, idx) {
      const div = document.createElement("div");
      div.className = 'related-artists-item-div';
      relatedArtistsDiv.appendChild(div);

      const img = document.createElement("img");
      img.className = 'related-artist-thumbnail';
      img.src = selectImageThumbnail(artist.images);
      div.appendChild(img);

      const span = document.createElement("span");
      span.textContent = artist.name;
      span.className = 'related-artist-names';
      div.appendChild(span);
    });

    // Selects the first image whose height/width ratio is 1/1. Otherwise,
    // selects the image closest to 1.
    function selectImageThumbnail(images) {
      let imageRatios = [];
      for(let i = 0; i<images.length; i++ ) {
        if (images[i].height === images[i].width) {
          return images[i].url;
        } else {
          return images[0].url;
        }
      }
    }
  }
}
