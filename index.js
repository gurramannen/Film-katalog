const API_KEY = 'c8ddba06';
const BASE_URL = 'https://www.omdbapi.com/';

let timeout;

// Lista av IMDb-ID:n för toppfilmer
const topMovies = [
    "tt0111161", "tt0068646", "tt0071562", "tt0468569", "tt0050083",
    "tt0108052", "tt0167260", "tt0110912", "tt0120737", "tt0137523"
];

// Hämta filmdata baserat på titel
async function fetchMovies(query) {
    try {
        const response = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        return data.Response === 'True' ? data.Search : null;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// Hämta detaljer för en enskild film
async function fetchMovieDetails(imdbID) {
    try {
        const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        return data.Response === 'True' ? data : null;
    } catch (error) {
        console.error(`Error fetching details for ${imdbID}:`, error.message);
        return null;
    }
}

// Visa filmer i DOM
async function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
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
            `;
            movieCard.addEventListener('click', () => showMovieDetails(movie.imdbID));
            container.appendChild(movieCard);
        }
    }
}

// Visa modaldetaljer
async function showMovieDetails(imdbID) {
    const movie = await fetchMovieDetails(imdbID);
    if (movie) {
        const modal = document.getElementById('movie-modal');
        const modalContent = document.getElementById('modal-details');

        modalContent.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}">
            <h2>${movie.Title} (${movie.Year})</h2>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
        `;
        
        modal.style.display = 'flex';

        // Stäng modalen om användaren klickar på stängningsknappen
        modal.querySelector('.close').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Stäng modalen om användaren klickar utanför innehållet
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Hämta och visa toppfilmer
async function displayTopMovies() {
    const movieContainer = document.getElementById('movies');
    movieContainer.innerHTML = '<p>Laddar toppfilmer...</p>';
    const moviePromises = topMovies.map(fetchMovieDetails);
    const movies = await Promise.all(moviePromises);
    movieContainer.innerHTML = '';
    movies.forEach(movie => {
        if (movie) {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie');
            movieCard.innerHTML = `
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x225?text=No+Image'}" alt="${movie.Title}">
                <h3>${movie.Title}</h3>
                <p>Year: ${movie.Year}</p>
                <div class="details">
                    <span>Genre: ${movie.Genre.split(', ')[0]}</span>
                    <span>⭐ ${movie.imdbRating !== 'N/A' ? movie.imdbRating : 'N/A'}</span>
                </div>
            `;
            movieCard.addEventListener('click', () => showMovieDetails(movie.imdbID));
            movieContainer.appendChild(movieCard);
        }
    });
}

// Dynamisk uppdatering av sökresultat
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
        displayMovies(movies, 'results-container');
        countContainer.textContent = `Hittade ${movies.length} filmer för sökord "${query}".`;
    } else {
        countContainer.textContent = 'Inga resultat hittades.';
    }
}

document.getElementById('search-input').addEventListener('input', (event) => {
    const query = event.target.value.trim();
    clearTimeout(timeout);
    timeout = setTimeout(() => updateSearchResults(query), 300);
});

// Ladda toppfilmer vid sidans öppning
window.addEventListener('DOMContentLoaded', displayTopMovies);