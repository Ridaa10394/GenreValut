const apiKey = "AIzaSyCBwFuRyPL09NGWXq4tycLBEQNgAu7pS18";
const urlParams = new URLSearchParams(window.location.search);
let genre = urlParams.get("genre") || "Fiction";

// Function to search books
function searchBooks() {
  const query = document.getElementById("searchBar").value;

  if (!query) {
    alert("Please enter a search query.");
    return;
  }

  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}+subject:${encodeURIComponent(genre)}&maxResults=10&key=${apiKey}`;
  console.log("Fetching from API:", apiUrl);
  
  //Fetches the Book from the API
    fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const resultsDiv = document.getElementById("bookResults");
      resultsDiv.innerHTML = ""; // Clears the previous results

      if (data.items) {
        data.items.forEach((book) => {
          const bookTitle = book.volumeInfo.title;
          const authors = book.volumeInfo.authors
            ? book.volumeInfo.authors.join(", ")
            : "Unknown Author";
          const thumbnail =
            book.volumeInfo.imageLinks?.thumbnail || "placeholder.jpg";

          const bookDiv = document.createElement("div");
          bookDiv.classList.add("book");
          bookDiv.innerHTML = `
                      <img src="${thumbnail}" alt="Book Cover">
                      <h3 id="title">${bookTitle}</h3>
                      <p id="author">${authors}</p>
                      <button id="wtr" onclick="moveToCategory('Want To Read', '${bookTitle}')">Want to Read</button>
                      <button id='reading' onclick="moveToCategory('Reading', '${bookTitle}')">Reading</button>
                      <button id="completed" onclick="moveToCategory('Completed', '${bookTitle}')">Completed</button>
                  `;
          resultsDiv.appendChild(bookDiv);
        });
      } else {
        resultsDiv.innerHTML = "<p>No books found.</p>";
      }
    })
    .catch((err) => {
      console.error("Error fetching books:", err);
      document.getElementById("bookResults").innerHTML =
        "<p>Failed to fetch books.</p>";
    });
}

// Function to move a book to a new category
function moveToCategory(newCategory, bookTitle) {
  const categories = ["Want To Read", "Reading", "Completed"];
  categories.forEach((category) => {
    if (category !== newCategory) {
      let books =
        JSON.parse(localStorage.getItem(`books_${genre}_${category}`)) || [];
      books = books.filter((title) => title !== bookTitle);
      localStorage.setItem(`books_${genre}_${category}`, JSON.stringify(books));
    }
  });
  let newBooks =
    JSON.parse(localStorage.getItem(`books_${genre}_${newCategory}`)) || [];
  if (!newBooks.includes(bookTitle)) {
    newBooks.push(bookTitle);
    localStorage.setItem(
      `books_${genre}_${newCategory}`,
      JSON.stringify(newBooks)
    );
  }
  displayStoredBooks(); // Refresh displayed lists
}

// Function to display stored books for the specific genre
function displayStoredBooks() {
  ["Want To Read", "Reading", "Completed"].forEach((category) => {
    const storageKey = `books_${genre}_${category}`;
    const categoryBox = document.getElementById(category);

    if (categoryBox) {
      categoryBox.innerHTML = `<h2>${category}</h2>`; // Set category title

      let books = JSON.parse(localStorage.getItem(storageKey)) || [];
      books.forEach((bookTitle) => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("stored-book");
        bookItem.textContent = bookTitle;

        // Add remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.onclick = () => removeBook(category, bookTitle);

        bookItem.appendChild(removeBtn);
        categoryBox.appendChild(bookItem);
      });
    }
  });
}

// Function to remove a book from a category
function removeBook(category, bookTitle) {
  const storageKey = `books_${genre}_${category}`;
  let books = JSON.parse(localStorage.getItem(storageKey)) || [];
  books = books.filter((title) => title !== bookTitle);
  localStorage.setItem(storageKey, JSON.stringify(books));

  displayStoredBooks(); // Refresh displayed lists
}

// Load stored books when the page loads
window.onload = () => {
  if (genre) {
    displayStoredBooks();
  } else {
    console.error("Genre not found in URL.");
  }
};
