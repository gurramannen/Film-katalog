const API_KEY = 'c8ddba06'; // Replace with your actual API key
const BASE_URL = 'https://www.omdbapi.com/';

document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!query) {
        resultsContainer.textContent = 'Please enter a search term.';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === 'True') {
            const movies = data.Search;
            resultsContainer.innerHTML = movies.map(movie => `
                <div class="movie">
                    <img src="${movie.Poster}" alt="${movie.Title}" />
                    <h3>${movie.Title}</h3>
                    <p>Year: ${movie.Year}</p>
                </div>
            `).join('');
        } else {
            resultsContainer.textContent = data.Error;
        }
    } catch (error) {
        resultsContainer.textContent = 'An error occurred. Please try again later.';
        console.error(error);
    }
});