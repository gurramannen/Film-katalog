const API_KEY = 'c8ddba06'; // Ersätt med din faktiska API-nyckel
const BASE_URL = 'https://www.omdbapi.com/';

// Hämta filmdata baserat på söksträngen
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

// Hämta detaljer om en specifik film
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
        console.error(error.message);
        return null;
    }
}

// Visa modalen med filmens detaljer
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
        modal.style.display = 'flex'; // Visa modalen
    }
}

// Stäng modalen
document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('movie-modal');
    modal.style.display = 'none';
});

// Hantera sökhändelsen
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value.trim();
    const resultsContainer = document.getElementById('results-container');
    const countContainer = document.getElementById('count-container');

    resultsContainer.innerHTML = '';
    countContainer.textContent = '';

    if (!query) {
        countContainer.textContent = 'Please enter a search term.';
        return;
    }

    const movies = await fetchMovies(query);
    if (movies) {
        displayMovies(movies);
        countContainer.textContent = `Hittaed ${movies.length} filmer för sökordet "${query}".`;
    } else {
        countContainer.textContent = 'No results found.';
    }
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