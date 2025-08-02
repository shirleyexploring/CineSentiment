const API_KEY = "0f1436fdefc31fce455b3c38c8f81abd"
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=0f1436fdefc31fce455b3c38c8f81abd&query=";


const form = document.getElementById("form");
const search = document.getElementById("query");
const main = document.getElementById("movieGrid"); 

const params = new URLSearchParams(window.location.search);
const genreId = params.get('genre');
const searchQuery = params.get('search');

let APILINK = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;
if (genreId) {
    APILINK += `&with_genres=${genreId}`;
} else if (searchQuery) {
    APILINK = `${SEARCHAPI}${searchQuery}`;
}

returnMovies(APILINK)
function returnMovies(url) {
    fetch(url).then(res => res.json())
    .then(function(data) {
        data.results.forEach(element => {
            const movieItem = document.createElement('div');
            movieItem.className = 'movie-item';

            // Creating an anchor element to wrap the image
            const link = document.createElement('a');
            link.href = `ReviewPage.html?id=${element.id}&title=${encodeURIComponent(element.title)}&poster_path=${encodeURIComponent(element.poster_path)}&overview=${encodeURIComponent(element.overview)}`;
            link.title = `View details for ${element.title}`;

            const image = document.createElement('img');
            image.className = 'movie-poster';
            image.src = IMG_PATH + element.poster_path;
            image.alt = element.title;

            // Append the image to the link, then the link to the movie item
            link.appendChild(image);

            const title = document.createElement('h3');
            title.className = 'movie-title';
            title.textContent = element.title;

            movieItem.appendChild(link);
            movieItem.appendChild(title);

            main.appendChild(movieItem); // Add movie item directly to the grid container
        });
    }).catch(error => {
        console.error('Error fetching the movies:', error);
    });
}

function renderReviewCard({ user, review, sentiment }) {
    const card = document.createElement('div');
    card.className = 'review-card';
  
    // mood badge
    const badge = document.createElement('span');
    badge.className = `mood ${sentiment.label}`;   // positive | negative
    badge.textContent = sentiment.label;           // or emoji map
    card.appendChild(badge);
  
    // review text
    const p = document.createElement('p');
    p.textContent = review;
    card.appendChild(p);
  
    // …append card to the feed…
  }
  


form.addEventListener("submit", (e) => {
e.preventDefault();
main.innerHTML = '';

const searchItem = search.value;

if (searchItem) {
  returnMovies(SEARCHAPI + searchItem);
    search.value = "";
}
});
