// ===== Setup =====
const API_KEY = "PUT_YOUR_TMDB_API_KEY_HERE";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";     // posters
const BACKDROP_URL = "https://image.tmdb.org/t/p/w780";  // wide movie stills
const PATRICK_STEWART_ID = 2387; // Patrick Stewart's ID on TMDB

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const resultsTitle = document.getElementById("results-title");
const message = document.getElementById("message");

// Top 6 X-Men movies by worldwide box office (Box Office Mojo)
const TOP_MOVIES = [
  { title: "X-Men: Days of Future Past", year: 2014, gross: "$746 million" },
  { title: "X-Men: Apocalypse", year: 2016, gross: "$544 million" },
  { title: "X-Men: The Last Stand", year: 2006, gross: "$460 million" },
  { title: "X2", year: 2003, gross: "$408 million" },
  { title: "X-Men: First Class", year: 2011, gross: "$353 million" },
  { title: "X-Men", year: 2000, gross: "$296 million" }
];


// ===== Carousel =====
const slidesBox = document.getElementById("slides");
const dotsBox = document.getElementById("dots");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const beam = document.getElementById("beam");

let currentSlide = 0;
const slides = [];   // each slide's elements and TMDB info

// Build one slide (and one dot) for each top movie
function buildCarousel() {
  for (let i = 0; i < TOP_MOVIES.length; i++) {
    const topMovie = TOP_MOVIES[i];

    const slide = document.createElement("div");
    slide.classList.add("slide");

    // The picture area (shows the movie still, or the trailer when playing)
    const media = document.createElement("div");
    media.classList.add("slide-media");
    const img = document.createElement("img");
    img.src = "images/no-poster.svg";
    img.alt = topMovie.title;
    media.appendChild(img);
    slide.appendChild(media);

    // Caption at the bottom of the screen
    const caption = document.createElement("div");
    caption.classList.add("slide-caption");

    const rank = document.createElement("p");
    rank.classList.add("rank");
    rank.textContent = "#" + (i + 1) + " at the box office · " + topMovie.gross + " worldwide";
    caption.appendChild(rank);

    const h3 = document.createElement("h3");
    h3.textContent = topMovie.title + " (" + topMovie.year + ")";
    caption.appendChild(h3);

    const playButton = document.createElement("button");
    playButton.type = "button";
    playButton.textContent = "▶ Play trailer";
    playButton.addEventListener("click", function () {
      playTrailer(i);
    });
    caption.appendChild(playButton);

    slide.appendChild(caption);
    slidesBox.appendChild(slide);

    // Dot under the screen
    const dot = document.createElement("button");
    dot.type = "button";
    dot.classList.add("dot");
    dot.setAttribute("aria-label", "Show movie " + (i + 1));
    dot.addEventListener("click", function () {
      showSlide(i);
    });
    dotsBox.appendChild(dot);

    slides.push({ media: media, img: img, dot: dot, movieId: null });

    // Ask TMDB for this movie's ID and wide picture
    axios.get(BASE_URL + "/search/movie?api_key=" + API_KEY +
              "&query=" + encodeURIComponent(topMovie.title) +
              "&primary_release_year=" + topMovie.year)
      .then(function (response) {
        const movie = response.data.results[0];
        slides[i].movieId = movie.id;
        if (movie.backdrop_path) {
          img.src = BACKDROP_URL + movie.backdrop_path;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  showSlide(0);
}

// Slide the carousel to one movie
function showSlide(index) {
  // Wrap around: after the last movie, go back to the first
  if (index < 0) {
    index = slides.length - 1;
  }
  if (index >= slides.length) {
    index = 0;
  }

  stopTrailer(currentSlide);
  currentSlide = index;

  // Move the row of slides so the right one is on the screen
  slidesBox.style.transform = "translateX(-" + (index * 100) + "%)";

  // Light up the matching dot
  for (let i = 0; i < slides.length; i++) {
    slides[i].dot.classList.remove("active");
  }
  slides[index].dot.classList.add("active");

  // Make the projector beam flicker
  beam.classList.remove("flicker");
  setTimeout(function () {
    beam.classList.add("flicker");
  }, 10);
}

// Put the YouTube trailer on the screen
function playTrailer(index) {
  const slide = slides[index];
  if (slide.movieId === null) {
    return; // TMDB hasn't answered yet
  }

  axios.get(BASE_URL + "/movie/" + slide.movieId + "/videos?api_key=" + API_KEY)
    .then(function (response) {
      const videos = response.data.results;

      for (let i = 0; i < videos.length; i++) {
        if (videos[i].site === "YouTube" && videos[i].type === "Trailer") {
          const iframe = document.createElement("iframe");
          iframe.src = "https://www.youtube-nocookie.com/embed/" + videos[i].key + "?autoplay=1";
          iframe.title = TOP_MOVIES[index].title + " trailer";
          iframe.allow = "autoplay; fullscreen";
          iframe.allowFullscreen = true;

          slide.media.innerHTML = "";
          slide.media.appendChild(iframe);
          slide.media.parentElement.classList.add("playing");
          return;
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Take the trailer off the screen and put the picture back
function stopTrailer(index) {
  const slide = slides[index];
  if (slide && slide.media.querySelector("iframe")) {
    slide.media.innerHTML = "";
    slide.media.appendChild(slide.img);
    slide.media.parentElement.classList.remove("playing");
  }
}

prevButton.addEventListener("click", function () {
  showSlide(currentSlide - 1);
});

nextButton.addEventListener("click", function () {
  showSlide(currentSlide + 1);
});


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


// ===== Build one card (film frame) for each movie =====
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
    overview.classList.add("overview");
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
    trailerButton.textContent = "Trailer";
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


// ===== Popcorn bucket: pops popcorn when the mouse moves over it =====
const popcorn = document.getElementById("popcorn");
const popCount = document.getElementById("pop-count");
let totalPopped = 0;
let lastPopTime = 0;

function popKernel() {
  // Make one piece of popcorn at the top of the bucket
  const kernel = document.createElement("span");
  kernel.classList.add("kernel");
  kernel.style.left = (30 + Math.random() * 40) + "%"; // random spot across the top
  popcorn.appendChild(kernel);

  // A moment later, send it flying in a random direction
  setTimeout(function () {
    const x = Math.random() * 200 - 100;   // left or right
    const y = -(90 + Math.random() * 110); // always up
    const spin = Math.random() * 720;
    kernel.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + spin + "deg)";
    kernel.style.opacity = "0";
  }, 20);

  // Remove it after the animation so the page doesn't fill up
  setTimeout(function () {
    kernel.remove();
  }, 1000);

  totalPopped = totalPopped + 1;
  popCount.textContent = totalPopped;
}

// Mouse moving over the bucket: pop one piece (at most every 60ms)
popcorn.addEventListener("mousemove", function () {
  const now = Date.now();
  if (now - lastPopTime > 60) {
    lastPopTime = now;
    popKernel();
  }
});

// Click or tap (for phones, which have no hover): pop a handful
popcorn.addEventListener("click", function () {
  for (let i = 0; i < 8; i++) {
    popKernel();
  }
});


// ===== Start =====
buildCarousel();
loadXmenMovies();
