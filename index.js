const API_KEY = 'c8ddba06'; // Ersätt med din faktiska API-nyckel
const BASE_URL = 'https://www.omdbapi.com/';

async function fetchMovies(query) {
    try {
        const response = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        switch (data.Response) {
            case 'True':
                return data.Search; // Returnera filmerna
            case 'False':
                throw new Error(data.Error); // T.ex. "Movie not found!"
            default:
                throw new Error('Unexpected API response.');
        }
    } catch (error) {
        switch (error.message) {
            case 'Failed to fetch':
                console.error('Network error: Unable to reach the server. Please check your internet connection.');
                break;
            case 'Movie not found!':
                console.error('No movies found for the given search query.');
                break;
            default:
                console.error(`An unknown error occurred: ${error.message}`);
        }
        return null; // Returnera null vid fel
    }
}

// Hantera sökhändelsen
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value.trim();
    const resultsContainer = document.getElementById('results-container');
    const countContainer = document.getElementById('count-container');

    resultsContainer.innerHTML = ''; // Rensa tidigare resultat
    countContainer.textContent = ''; // Rensa tidigare räknare

    if (!query) {
        countContainer.textContent = 'Please enter a search term.';
        return;
    }

    const movies = await fetchMovies(query);
    if (movies) {
        displayMovies(movies);
        countContainer.textContent = `Found ${movies.length} movies for "${query}".`;
    } else {
        countContainer.textContent = 'No results found.';
    }
});

// Funktion för att visa filmer i DOM
function displayMovies(movies) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = movies.map(movie => `
        <div class="movie">
            <img src="${movie.Poster}" alt="${movie.Title}" />
            <h3>${movie.Title}</h3>
            <p>Year: ${movie.Year}</p>
        </div>
    `).join('');
}