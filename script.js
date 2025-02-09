function navigateToGenrePage(genre) {
  // Dynamically change the location to include the genre in the query string
  window.location.href = `${genre.toLowerCase()}.html?genre=${genre}`;
}
