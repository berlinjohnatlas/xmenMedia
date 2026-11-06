// ===== Setup =====
const API_KEY = "PUT_YOUR_TMDB_API_KEY_HERE";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const PATRICK_STEWART_ID = 2387; // Patrick Stewart's ID on TMDB

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultsTitle = document.getElementById("results-title");
const message = document.getElementById("message");
const trailers = document.getElementById("trailers");

// Top 6 X-Men movies by worldwide box office (Box Office Mojo)
const TOP_MOVIES = [
  { title: "X-Men: Days of Future Past", year: 2014, gross: "$746 million" },
  { title: "X-Men: Apocalypse", year: 2016, gross: "$544 million" },
  { title: "X-Men: The Last Stand", year: 2006, gross: "$460 million" },
  { title: "X2", year: 2003, gross: "$408 million" },
  { title: "X-Men: First Class", year: 2011, gross: "$353 million" },
  { title: "X-Men", year: 2000, gross: "$296 million" }
];


// ===== Trailers: show a YouTube trailer for each top movie =====
function loadTrailers() {
  for (let i = 0; i < TOP_MOVIES.length; i++) {
    const topMovie = TOP_MOVIES[i];

    // Make the box first, so the movies stay in order (#1 to #6)
    const box = document.createElement("div");
    box.classList.add("trailer", "pop-in");

    const h3 = document.createElement("h3");
    h3.textContent = "#" + (i + 1) + " " + topMovie.title + " (" + topMovie.year + ")";
    box.appendChild(h3);

    const gross = document.createElement("p");
    gross.classList.add("year");
    gross.textContent = "Worldwide box office: " + topMovie.gross;
    box.appendChild(gross);

    trailers.appendChild(box);

    // Step 1: search TMDB to get the movie's ID
    axios.get(BASE_URL + "/search/movie?api_key=" + API_KEY +
              "&query=" + encodeURIComponent(topMovie.title) +
              "&primary_release_year=" + topMovie.year)
      .then(function (response) {
        const movieId = response.data.results[0].id;

        // Step 2: get that movie's videos
        return axios.get(BASE_URL + "/movie/" + movieId + "/videos?api_key=" + API_KEY);
      })
      .then(function (response) {
        const videos = response.data.results;

        // Step 3: find the first YouTube trailer
        for (let j = 0; j < videos.length; j++) {
          if (videos[j].site === "YouTube" && videos[j].type === "Trailer") {
            const iframe = document.createElement("iframe");
            iframe.src = "https://www.youtube-nocookie.com/embed/" + videos[j].key;
            iframe.title = topMovie.title + " trailer";
            iframe.allowFullscreen = true;
            box.appendChild(iframe);
            return;
          }
        }

        const none = document.createElement("p");
        none.textContent = "No trailer found.";
        box.appendChild(none);
      })
      .catch(function (error) {
        console.log(error);
        const fail = document.createElement("p");
        fail.textContent = "Couldn't load this trailer.";
        box.appendChild(fail);
      });
  }
}


// ===== Load Patrick Stewart's X-Men movies when the page opens =====
function loadXmenMovies() {
  message.textContent = "Loading...";

  axios.get(BASE_URL + "/person/" + PATRICK_STEWART_ID + "/movie_credits?api_key=" + API_KEY)
    .then(function (response) {
      const allMovies = response.data.cast;
      const xmenMovies = [];

      // Keep only the X-Men movies (plus X2 and Logan)
      for (let i = 0; i < allMovies.length; i++) {
        const title = allMovies[i].title;
        if (title.includes("X-Men") || title === "X2" || title === "Logan") {
          xmenMovies.push(allMovies[i]);
        }
      }

      showMovies(xmenMovies);
    })
    .catch(function (error) {
      console.log(error);
      message.textContent = "Something went wrong. Check your API key.";
    });
}


// ===== Search for any movie when the form is sent =====
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const searchText = input.value.trim();
  if (searchText === "") {
    return;
  }

  message.textContent = "Searching...";
  resultsTitle.textContent = 'Results for "' + searchText + '"';

  axios.get(BASE_URL + "/search/movie?api_key=" + API_KEY + "&query=" + encodeURIComponent(searchText))
    .then(function (response) {
      showMovies(response.data.results);
    })
    .catch(function (error) {
      console.log(error);
      message.textContent = "Something went wrong. Try again.";
    });
});


// ===== Build one card for each movie =====
function showMovies(movies) {
  results.innerHTML = ""; // clear old cards

  if (movies.length === 0) {
    message.textContent = "No movies found. Try another search.";
    return;
  }
  message.textContent = "";

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];

    const card = document.createElement("article");
    card.classList.add("card", "pop-in");

    // Poster (some movies have no poster, so use a placeholder)
    const img = document.createElement("img");
    if (movie.poster_path) {
      img.src = IMAGE_URL + movie.poster_path;
    } else {
      img.src = "images/no-poster.svg";
    }
    img.alt = movie.title + " poster";
    card.appendChild(img);

    // Title
    const h3 = document.createElement("h3");
    h3.textContent = movie.title;
    card.appendChild(h3);

    // Year (release_date looks like "2000-07-13", so take the first 4 letters)
    const year = document.createElement("p");
    year.classList.add("year");
    if (movie.release_date) {
      year.textContent = movie.release_date.slice(0, 4);
    } else {
      year.textContent = "Year unknown";
    }
    card.appendChild(year);

    // His role, only shown on the X-Men list
    if (movie.character) {
      const role = document.createElement("p");
      role.classList.add("role");
      role.textContent = "Played: " + movie.character;
      card.appendChild(role);
    }

    // Short summary
    const overview = document.createElement("p");
    overview.textContent = movie.overview;
    card.appendChild(overview);

    // Buttons
    const links = document.createElement("div");
    links.classList.add("card-links");

    const tmdbLink = document.createElement("a");
    tmdbLink.href = "https://www.themoviedb.org/movie/" + movie.id;
    tmdbLink.target = "_blank";
    tmdbLink.textContent = "More info";
    links.appendChild(tmdbLink);

    const trailerButton = document.createElement("button");
    trailerButton.textContent = "Watch trailer";
    trailerButton.addEventListener("click", function () {
      openTrailer(movie.id);
    });
    links.appendChild(trailerButton);

    card.appendChild(links);
    results.appendChild(card);
  }
}


// ===== Find the YouTube trailer for a movie and open it =====
function openTrailer(movieId) {
  axios.get(BASE_URL + "/movie/" + movieId + "/videos?api_key=" + API_KEY)
    .then(function (response) {
      const videos = response.data.results;

      for (let i = 0; i < videos.length; i++) {
        if (videos[i].site === "YouTube" && videos[i].type === "Trailer") {
          window.open("https://www.youtube.com/watch?v=" + videos[i].key, "_blank");
          return;
        }
      }

      message.textContent = "No trailer found for that movie.";
    })
    .catch(function (error) {
      console.log(error);
      message.textContent = "Couldn't load the trailer.";
    });
}


// ===== Start =====
loadTrailers();
loadXmenMovies();
