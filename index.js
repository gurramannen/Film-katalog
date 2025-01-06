const API_KEY = 'c8ddba06'; // Ersätt med din faktiska API-nyckel
const BASE_URL = 'https://www.omdbapi.com/';

let timeout; // Timeout för debounce

// Hämta filmer baserat på en söksträng
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

// Visa sökresultaten dynamiskt med laddningsindikator
async function updateSearchResults(query) {
    const resultsContainer = document.getElementById('results-container');
    const countContainer = document.getElementById('count-container');
    const loadingIndicator = document.getElementById('loading-indicator');

    resultsContainer.innerHTML = '';
    countContainer.textContent = '';

    if (!query) {
        countContainer.textContent = 'Start typing to search for movies.';
        return;
    }

    loadingIndicator.classList.remove('hidden'); // Visa laddningsindikatorn

    const movies = await fetchMovies(query);
    loadingIndicator.classList.add('hidden'); // Dölj laddningsindikatorn

    if (movies) {
        displayMovies(movies);
        countContainer.textContent = `Found ${movies.length} movies for "${query}".`;
    } else {
        countContainer.textContent = 'No results found.';
    }
}

// Dynamisk uppdatering med debounce
document.getElementById('search-input').addEventListener('input', (event) => {
    const query = event.target.value.trim();

    clearTimeout(timeout); // Rensa tidigare timeout
    timeout = setTimeout(() => {
        updateSearchResults(query); // Uppdatera sökresultat efter debounce-tiden
    }, 300); // Vänta 300ms innan ny API-förfrågan
});

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

// Visa filmerna i DOM med fler detaljer
async function displayMovies(movies) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    for (const movie of movies) {
        // Gör en extra API-förfrågan för att få detaljer om filmen
        const movieDetails = await fetchMovieDetails(movie.imdbID);

        if (movieDetails) {
            const { Title, Year, Poster, Genre, imdbRating } = movieDetails;

            // Skapa ett kort för varje film
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
            `;
            movieCard.addEventListener('click', () => showMovieDetails(movie.imdbID)); // Lägg till klick-event
            resultsContainer.appendChild(movieCard);
        }
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

            // Stäng modalen när användaren klickar på "x"
            const closeButton = modal.querySelector('.close');
            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            // Stäng modalen om användaren klickar utanför innehållet
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    });
}