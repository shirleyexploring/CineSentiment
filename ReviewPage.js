const API_ROOT = '/api/v1/reviews';   // ← single source of truth
let   movieId; 

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    movieId = params.get('id');
    const title = decodeURIComponent(params.get('title') || '');
    const posterPath = decodeURIComponent(params.get('poster_path') || '');
    const overview = decodeURIComponent(params.get('overview') || '');

    document.querySelector('h1').textContent = `Movie Review: ${title}`;
    const posterImage = document.querySelector('.movie-poster');
    if (posterImage) {
        posterImage.src = `https://image.tmdb.org/t/p/w500${posterPath}`;
        posterImage.alt = title;
    }
    document.querySelector('.review-content h2').textContent = title;
    document.querySelector('.overview').textContent = "Overview: " + overview;

    // const APILINK = `http://localhost:8000/api/v1/reviews/movie/${movieId}`;
    // fetchReviews(APILINK);
    fetchReviews(`${API_ROOT}/movie/${movieId}`);
    fetchMovieDetails(movieId)

    fetchTMDbReviews(movieId).then(tmdReviews => {
        displayTMDbReviews(tmdReviews);
    });
});

const API_KEY = "0f1436fdefc31fce455b3c38c8f81abd"
const main = document.querySelector(".user-reviews"); 
const TMDB_REVIEW_API_BASE = "https://api.themoviedb.org/3/movie/";

async function fetchReviews(url) {
    try {
        const response = await fetch(url);
        console.log('Response:', response); // Log the raw response

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data:', data); // Log the parsed JSON data

        if (data.length === 0) {
            const noReviews = document.createElement('p');
            noReviews.textContent = "No reviews available for this movie.";
            main.appendChild(noReviews);
        } else {
            data.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                reviewCard.id = review._id;

                reviewCard.innerHTML = `
                    <p><strong>Review: </strong>${review.review}</p>
                    <p><strong>User: </strong>${review.user}</p>
                    <p><strong>Date: </strong>${new Date(review.date).toLocaleDateString()}</p>
                    <p><a href="#"onclick="editReview('${review._id}','${review.review}', '${review.user}')">✏️</a> <a href="#" onclick="deleteReview('${review._id}')">🗑</a></p>
                `;

                main.appendChild(reviewCard);
            });
        }
    } catch (error) {
        console.error('Error fetching the reviews:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = "Error fetching reviews. Please try again later.";
        main.appendChild(errorMessage);
    }
}

async function fetchTMDbReviews(movieId) {
    const reviewsUrl = `${TMDB_REVIEW_API_BASE}${movieId}/reviews?api_key=${API_KEY}`;
    try {
        const response = await fetch(reviewsUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching reviews from TMDb:', error);
        return [];
    }
}

  function displayTMDbReviews(reviews) {
    if (reviews.length === 0) {
        const noReviews = document.createElement('p');
        noReviews.textContent = "No TMDb reviews available for this movie.";
        main.appendChild(noReviews);
    } else {
        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';

            reviewCard.innerHTML = `
                <p><strong>Review: </strong>${review.content}</p>
                <p><strong>User: </strong>${review.author}</p>
                <p><strong>Date: </strong>${new Date(review.created_at).toLocaleDateString()}</p>
            `;

            main.appendChild(reviewCard);
        });
    }
}

function fetchMovieDetails(movieId) {
    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`;
    fetch(detailsUrl).then(res => res.json())
        .then(data => {
            // Update the director's name and release date
            const director = data.credits.crew.find(member => member.job === 'Director');
            document.getElementById('director-name').textContent = director ? director.name : 'N/A';
            document.getElementById('release-date').textContent = data.release_date || 'N/A';
        }).catch(error => {
            console.error('Error fetching the movie details:', error);
        });
}

function editReview(id, review, user) {
    console.log('editReview called with:', id, review, user);

    const element = document.getElementById(id);

    console.log('Element found:', element); 

    if (!element) {
        console.error(`Element with ID ${id} not found.`);
        return;
    }

    const reviewInputId = "review" + id
    const userInputId = "user" + id

    console.log('Generated input IDs:', reviewInputId, userInputId);
    
    element.innerHTML = `
        <p><strong>Review: </strong>
          <input type="text" id="${reviewInputId}" value="${review}">
        </p>
        <p><strong>User: </strong>
          <input type="text" id="${userInputId}" value="${user}">
        </p>
        <p><a href="#" onclick="saveReview('${reviewInputId}', '${userInputId}', '${id}')">💾</a></p>
    `;
  }
  
  function saveReview(reviewInputId, userInputId, id="") {
    const review = document.getElementById(reviewInputId).value;
    const user = document.getElementById(userInputId).value;
    const APILINK = API_ROOT + '/';   // '' → '/api/v1/reviews/'
  
    if (id) {
      fetch(APILINK + id, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"user": user, "review": review})
      }).then(res => res.json())
        .then(res => {
          console.log(res)
          location.reload();
        });        
    } else {
      fetch(APILINK + "new", {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"user": user, "review": review, "movieId": movieId})
      }).then(res => res.json())
        .then(res => {
          console.log(res)
          location.reload();
        });
    }
  }

  function deleteReview(id) {

    const APILINK = API_ROOT + '/';

    fetch(APILINK + id, {
      method: 'DELETE'
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        location.reload();
      });    
  }

  document.getElementById('btnAdd').addEventListener('click', () => {
    const user   = document.getElementById('newUser').value.trim();
    const review = document.getElementById('newText').value.trim();
  
    if (!user || !review) return alert('Both fields are required 🙂');
  
    // reuse the universal saveReview() helper you already wrote
    saveReview('newText', 'newUser');   // (no id → POST /new)
  });


// returnMovies(APILINK)

// function returnMovies(url) {
//     fetch(url).then(res => res.json())
//     .then(function(data) {
//         data.forEach(review => {
//             const div_card = document.createElement('div');
//             div_card.innerHTML = `
//             <div class="row">
//               <div class="column">
//                 <div class="card" id="${review._id}">
//                   <p><strong>Review: </strong>${review.review}</p>
//                   <p><strong>User: </strong>${review.user}</p>
//                   <p><a href="#"onclick="editReview('${review._id}','${review.review}', '${review.user}')">✏️</a> <a href="#" onclick="deleteReview('${review._id}')">🗑</a></p>
//                 </div>
//               </div>
//             </div>
//           `
//             main.appendChild(div_card); // Add movie item directly to the grid container
//         });
//     }).catch(error => {
//         console.error('Error fetching the movies:', error);
//     });
// }