const API_KEY = 'c8ddba06';
const BASE_URL = 'https://www.omdbapi.com/';

let timeout; // Timeout för debounce

// Visa topp 10 filmer när sidan laddas
async function displayTopMovies() {
    const topMovies = [
        "The Shawshank Redemption", "The Godfather", "The Dark Knight", 
        "Pulp Fiction", "The Lord of the Rings: The Return of the King", 
        "Fight Club", "Forrest Gump", "Inception", 
        "The Matrix", "The Empire Strikes Back"
    ];

    try {
        const moviePromises = topMovies.map(title => fetchMovies(title));
        
        const moviesResponses = await Promise.all(moviePromises);
       
        const movies = moviesResponses.flatMap(response => (response && response[0]) ? [response[0]] : []);
      
        displayMovies(movies);
    } catch (error) {
        console.error('Error fetching top movies:', error);
    }
}

// Hämta filmer baserat på sökord
async function fetchMovies(query) {
    try {
        const response = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === 'True') {
            return data.Search;
        } else {
            throw new Error(data.Error);
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Visa sökresultaten dynamiskt
async function updateSearchResults(query) {
    const resultsContainer = document.getElementById('results-container');
    const countContainer = document.getElementById('count-container');
    const loadingIndicator = document.getElementById('loading-indicator');

    resultsContainer.innerHTML = '';
    countContainer.textContent = '';

    if (!query) {
        countContainer.textContent = 'Börja skriva för att söka på filmer.';
        return;
    }

    loadingIndicator.classList.remove('hidden');

    const movies = await fetchMovies(query);
    loadingIndicator.classList.add('hidden');

    if (movies) {
        countContainer.textContent = `Hittade ${movies.length} filmer för sökord "${query}".`;
        displayMovies(movies);
    } else {
        countContainer.textContent = 'Inga resultat hittades.';
    }
}

// Hämta detaljer för en specifik film
async function fetchMovieDetails(imdbID) {
    try {
        const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === 'True') {
            return data;
        } else {
            throw new Error(data.Error);
        }
    } catch (error) {
        console.error(`Error fetching details for ${imdbID}:`, error.message);
        return null;
    }
}

// Visa filmerna i DOM
async function displayMovies(movies) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    for (const movie of movies) {
        const movieDetails = await fetchMovieDetails(movie.imdbID);

        if (movieDetails) {
            const { Title, Year, Poster, Genre, imdbRating } = movieDetails;

            const movieCard = document.createElement('div');
            movieCard.classList.add('movie');
            movieCard.innerHTML = `
                <img src="${Poster !== 'N/A' ? Poster : 'https://via.placeholder.com/150x225?text=No+Image'}" alt="${Title}" />
                <h3>${Title}</h3>
                <p>Year: ${Year}</p>
                <div class="details">
                    <span>Genre: ${Genre.split(', ')[0]}</span>
                    <span>⭐ ${imdbRating !== 'N/A' ? imdbRating : 'N/A'}</span>
                </div>
                <button class="favorite-btn">Lägg till i favoriter</button>
            `;

            // Lägg till klickhändelse för "Lägg till i favoriter"
            movieCard.querySelector('.favorite-btn').addEventListener('click', () => saveToFavorites(movieDetails));

            movieCard.addEventListener('click', () => showMovieDetails(movie.imdbID));

            resultsContainer.appendChild(movieCard);
        }
    }
}

// Spara favoriter till localStorage
function saveToFavorites(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
        favorites.push(movie);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${movie.Title} har lagts till i favoriter!`);
    } else {
        alert(`${movie.Title} finns redan i favoriter.`);
    }
}

// Funktion för att visa filmdetaljer i en modal
function showMovieDetails(imdbID) {
    fetchMovieDetails(imdbID).then((movie) => {
        if (movie) {
            const modal = document.getElementById('movie-modal');
            const modalContent = modal.querySelector('.modal-content');

            modalContent.innerHTML = `
                <span class="close">&times;</span>
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}">
                <h2>${movie.Title} (${movie.Year})</h2>
                <p><strong>Genre:</strong> ${movie.Genre}</p>
                <p><strong>Director:</strong> ${movie.Director}</p>
                <p><strong>Plot:</strong> ${movie.Plot}</p>
                <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
            `;

            modal.style.display = 'flex';

            // Stäng modalen om användaren klickar utanför modalinnehållet
            window.addEventListener('click', closeModalOnOutsideClick);

            // Stäng modalen om användaren klickar på "X"-knappen
            modal.querySelector('.close').addEventListener('click', () => {
                modal.style.display = 'none';
                window.removeEventListener('click', closeModalOnOutsideClick);
            });
        }
    });
}

// Stäng modalen om man klickar utanför modalinnehållet
function closeModalOnOutsideClick(event) {
    const modal = document.getElementById('movie-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
        window.removeEventListener('click', closeModalOnOutsideClick);
    }
}


// Lägg till sök-input-event
document.getElementById('search-input').addEventListener('input', (event) => {
    const query = event.target.value.trim();

    clearTimeout(timeout);
    timeout = setTimeout(() => {
        updateSearchResults(query);
    }, 300);
});

// Visa toppfilmer när sidan laddas
document.addEventListener('DOMContentLoaded', displayTopMovies);
