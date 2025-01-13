// Hämta favoriter från localStorage
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

// Visa favoriter i DOM
function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    const favorites = getFavorites();

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>Du har inga favoriter ännu.</p>';
        return;
    }

    favoritesContainer.innerHTML = '';
    favorites.forEach(movie => {
        const { Title, Year, Poster, Genre, imdbRating } = movie;

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
        favoritesContainer.appendChild(movieCard);
    });
}

// Ladda favoriter när sidan öppnas
document.addEventListener('DOMContentLoaded', displayFavorites);