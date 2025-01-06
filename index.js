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

// Visa sökresultaten dynamiskt
async function updateSearchResults(query) {
    const resultsContainer = document.getElementById('results-container');
    const countContainer = document.getElementById('count-container');

    resultsContainer.innerHTML = '';
    countContainer.textContent = '';

    if (!query) {
        countContainer.textContent = 'Börja skriva för att söka på filmer.';
        return;
    }

    const movies = await fetchMovies(query);
    if (movies) {
        displayMovies(movies);
        countContainer.textContent = `Hittade ${movies.length} filmer med sökordet "${query}".`;
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

// Visa filmerna i DOM
function displayMovies(movies) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = movies.map(movie => `
        <div class="movie" onclick="showMovieDetails('${movie.imdbID}')">
            <img src="${movie.Poster}" alt="${movie.Title}" />
            <h3>${movie.Title}</h3>
            <p>Year: ${movie.Year}</p>
        </div>
    `).join('');
}

// Funktion för att visa modalen
async function showMovieDetails(imdbID) {
    const modal = document.getElementById('movie-modal');
    const modalDetails = document.getElementById('modal-details');

    const movie = await fetchMovieDetails(imdbID);
    if (movie) {
        modalDetails.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}" />
            <h2>${movie.Title}</h2>
            <p><strong>Year:</strong> ${movie.Year}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
        `;
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}

// Funktion för att stänga modalen
document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('movie-modal');
    modal.style.display = 'none';
});