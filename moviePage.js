// ===== Setup =====
const API_KEY = "7427f08df6685b02831c48a9fefc9f3a";
const BASE_URL = "https://api.themoviedb.org/3";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";    // tall posters
const BACKDROP_URL = "https://image.tmdb.org/t/p/w780";  // wide movie stills
const PATRICK_STEWART_ID = 2387; // Patrick Stewart's ID on TMDB

// Top 6 X-Men movies by worldwide box office (Box Office Mojo), in millions of dollars
const TOP_MOVIES = [
  { title: "X-Men: Days of Future Past", year: 2014, gross: 746 },
  { title: "X-Men: Apocalypse", year: 2016, gross: 544 },
  { title: "X-Men: The Last Stand", year: 2006, gross: 460 },
  { title: "X2", year: 2003, gross: 408 },
  { title: "X-Men: First Class", year: 2011, gross: 353 },
  { title: "X-Men", year: 2000, gross: 296 }
];

// Page elements
const statusText = document.getElementById("status-text");
const movieGrid = document.getElementById("movie-grid");
const resultsTitle = document.getElementById("results-title");
const form = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const eraSelect = document.getElementById("era-select");
const banner = document.getElementById("search-banner");
const bannerText = document.getElementById("banner-text");
const clearButton = document.getElementById("clear-button");

// Patrick Stewart's X-Men movies, saved after the first API call
let stewartMovies = [];


// ===== Stats in the hero =====
function showStats() {
  let total = 0;
  for (let i = 0; i < TOP_MOVIES.length; i++) {
    total = total + TOP_MOVIES[i].gross;
  }

  // 2807 million -> "$2.81B"
  document.getElementById("stat-total").textContent = "$" + (total / 1000).toFixed(2) + "B";
  document.getElementById("stat-best").textContent = "$" + TOP_MOVIES[0].gross + "M";
}


// ===== Carousel: top 6 box office movies =====
const slidesBox = document.getElementById("slides");
const dotsBox = document.getElementById("dots");
let currentSlide = 0;
const slides = []; // each slide's elements and TMDB info

function buildCarousel() {
  for (let i = 0; i < TOP_MOVIES.length; i++) {
    const topMovie = TOP_MOVIES[i];

    const slide = document.createElement("div");
    slide.classList.add("slide");

    // Picture area (shows the movie still, or the trailer when playing)
    const media = document.createElement("div");
    media.classList.add("slide-media");
    const img = document.createElement("img");
    img.src = "images/no-poster.svg";
    img.alt = topMovie.title;
    media.appendChild(img);
    slide.appendChild(media);

    // Words over the bottom of the picture
    const caption = document.createElement("div");
    caption.classList.add("slide-caption");

    const rank = document.createElement("p");
    rank.classList.add("rank");
    rank.textContent = "#" + (i + 1) + " · $" + topMovie.gross + " million worldwide";
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

  // Move the row of slides so the right one shows
  slidesBox.style.transform = "translateX(-" + (index * 100) + "%)";

  for (let i = 0; i < slides.length; i++) {
    slides[i].dot.classList.remove("active");
  }
  slides[index].dot.classList.add("active");
}

// Put the YouTube trailer on the screen
function playTrailer(index) {
  const slide = slides[index];
  if (slide.movieId === null) {
    return; // TMDB hasn't answered yet
  }

  axios.get(BASE_URL + "/movie/" + slide.movieId + "/videos?api_key=" + API_KEY)
    .then(function (response) {
      const key = findTrailerKey(response.data.results);
      if (key === null) {
        return;
      }

      const iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + key + "?autoplay=1";
      iframe.title = TOP_MOVIES[index].title + " trailer";
      iframe.allow = "autoplay; fullscreen";
      iframe.referrerPolicy = "strict-origin-when-cross-origin"; // YouTube needs this to play
      iframe.allowFullscreen = true;

      slide.media.innerHTML = "";
      slide.media.appendChild(iframe);
      slide.media.parentElement.classList.add("playing");
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

// Returns the YouTube key of the first trailer in a list of videos (or null)
function findTrailerKey(videos) {
  for (let i = 0; i < videos.length; i++) {
    if (videos[i].site === "YouTube" && videos[i].type === "Trailer") {
      return videos[i].key;
    }
  }
  return null;
}

document.getElementById("prev-button").addEventListener("click", function () {
  showSlide(currentSlide - 1);
});

document.getElementById("next-button").addEventListener("click", function () {
  showSlide(currentSlide + 1);
});


// ===== Load Patrick Stewart's X-Men movies =====
function loadStewartMovies() {
  statusText.textContent = "Loading from TMDB…";

  axios.get(BASE_URL + "/person/" + PATRICK_STEWART_ID + "/movie_credits?api_key=" + API_KEY)
    .then(function (response) {
      const allMovies = response.data.cast;

      // Keep only the movies where he played Professor X
      const savedIds = []; // so the same movie isn't added twice
      for (let i = 0; i < allMovies.length; i++) {
        const movie = allMovies[i];
        const title = movie.title;
        const character = movie.character || "";

        const isXMovie = title.includes("X-Men") || title === "X2" || title.includes("Wolverine") ||
                         title === "Logan" || title.includes("Multiverse of Madness");
        const playsXavier = character.includes("Xavier") || character.includes("Charles") || character.includes("Professor");

        if (isXMovie && playsXavier && !savedIds.includes(movie.id)) {
          stewartMovies.push(movie);
          savedIds.push(movie.id);
        }
      }

      // Oldest first
      stewartMovies.sort(function (a, b) {
        return (a.release_date || "").localeCompare(b.release_date || "");
      });

      document.getElementById("stat-count").textContent = stewartMovies.length + " Films";
      statusText.textContent = "TMDB API ready";
      showMovies(stewartMovies);
    })
    .catch(function (error) {
      console.log(error);
      statusText.textContent = "TMDB error: check your API key";
    });
}


// ===== The form: search + era filter =====
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const keyword = searchInput.value.trim();
  const era = eraSelect.value;

  // No keyword: just filter Patrick Stewart's movies by era
  if (keyword === "") {
    const filtered = filterByEra(stewartMovies, era);
    resultsTitle.textContent = "🎬 Patrick Stewart's X-Men Films";
    showMovies(filtered);
    showBanner("Showing " + filtered.length + " of his X-Men films for that era.");
    return;
  }

  // Keyword: ask TMDB, then filter the results by era
  statusText.textContent = "Searching TMDB…";

  axios.get(BASE_URL + "/search/movie?api_key=" + API_KEY + "&query=" + encodeURIComponent(keyword))
    .then(function (response) {
      const filtered = filterByEra(response.data.results, era);
      resultsTitle.textContent = '🎬 Tickets for "' + keyword + '"';
      showMovies(filtered);
      showBanner("TMDB found " + filtered.length + " movie ticket(s) for \"" + keyword + "\".");
      statusText.textContent = "TMDB API ready";
    })
    .catch(function (error) {
      console.log(error);
      statusText.textContent = "Search failed. Try again.";
    });
});

// Keep only movies released in the chosen era
function filterByEra(movies, era) {
  const kept = [];

  for (let i = 0; i < movies.length; i++) {
    const year = parseInt(movies[i].release_date); // "2014-05-23" -> 2014

    if (era === "ALL" ||
        (era === "TRILOGY" && year >= 2000 && year <= 2006) ||
        (era === "PREQUEL" && year >= 2011 && year <= 2016) ||
        (era === "LATER" && year >= 2017)) {
      kept.push(movies[i]);
    }
  }

  return kept;
}

function showBanner(text) {
  bannerText.textContent = text;
  banner.classList.remove("hidden");
}

clearButton.addEventListener("click", function () {
  searchInput.value = "";
  eraSelect.value = "ALL";
  banner.classList.add("hidden");
  resultsTitle.textContent = "🎬 Now Showing: Patrick Stewart's X-Men Films";
  showMovies(stewartMovies);
});


// ===== Flip cards =====
function showMovies(movies) {
  movieGrid.innerHTML = ""; // clear old cards

  if (movies.length === 0) {
    const empty = document.createElement("p");
    empty.classList.add("empty");
    empty.textContent = "🎟️ No movie tickets match that search. Try another one.";
    movieGrid.appendChild(empty);
    return;
  }

  for (let i = 0; i < movies.length; i++) {
    movieGrid.appendChild(makeCard(movies[i]));
  }
}

function makeCard(movie) {
  const card = document.createElement("div");
  card.classList.add("flip-card", "pop-in");
  card.tabIndex = 0; // so keyboard users can reach it
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", movie.title + ": flip for details");

  const inner = document.createElement("div");
  inner.classList.add("card-inner");
  card.appendChild(inner);

  // ----- Front: poster ticket -----
  const front = document.createElement("div");
  front.classList.add("card-face", "card-front");

  const posterBox = document.createElement("div");
  posterBox.classList.add("poster-box");

  const img = document.createElement("img");
  if (movie.poster_path) {
    img.src = POSTER_URL + movie.poster_path;
  } else {
    img.src = "images/no-poster.svg";
  }
  img.alt = movie.title + " poster";
  posterBox.appendChild(img);

  const yearBadge = document.createElement("span");
  yearBadge.classList.add("year-badge");
  yearBadge.textContent = movie.release_date ? movie.release_date.slice(0, 4) : "TBA";
  posterBox.appendChild(yearBadge);

  front.appendChild(posterBox);

  const body = document.createElement("div");
  body.classList.add("card-body");

  const h4 = document.createElement("h4");
  h4.textContent = movie.title;
  body.appendChild(h4);

  if (movie.character) {
    const role = document.createElement("p");
    role.classList.add("role");
    role.textContent = "As " + movie.character;
    body.appendChild(role);
  }

  const overview = document.createElement("p");
  overview.classList.add("overview");
  overview.textContent = movie.overview;
  body.appendChild(overview);

  const bottom = document.createElement("div");
  bottom.classList.add("card-bottom");
  const rating = document.createElement("span");
  rating.classList.add("gold");
  rating.textContent = "⭐ " + (movie.vote_average || 0).toFixed(1) + "/10";
  bottom.appendChild(rating);
  const flipText = document.createElement("span");
  flipText.classList.add("cyan");
  flipText.textContent = "Flip for details 🔄";
  bottom.appendChild(flipText);
  body.appendChild(bottom);

  front.appendChild(body);
  inner.appendChild(front);

  // ----- Back: details (filled in by the API when first flipped) -----
  const back = document.createElement("div");
  back.classList.add("card-face", "card-back");
  const backTitle = document.createElement("p");
  backTitle.classList.add("back-title");
  backTitle.textContent = movie.title;
  back.appendChild(backTitle);
  const details = document.createElement("div");
  details.classList.add("details");
  details.textContent = "Loading details…";
  back.appendChild(details);
  const backHint = document.createElement("p");
  backHint.classList.add("back-hint");
  backHint.textContent = "Click to flip back";
  back.appendChild(backHint);
  inner.appendChild(back);

  // ----- Flipping -----
  let loaded = false;

  function flip() {
    card.classList.toggle("flipped");
    if (loaded === false) {
      loaded = true;
      loadDetails(movie, details);
    }
  }

  card.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      return; // let links work without flipping the card
    }
    flip();
  });

  card.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flip();
    }
  });

  return card;
}

// Get more about one movie from TMDB: runtime, director, cast, trailer
function loadDetails(movie, details) {
  axios.get(BASE_URL + "/movie/" + movie.id + "?api_key=" + API_KEY + "&append_to_response=credits,videos")
    .then(function (response) {
      const info = response.data;
      details.innerHTML = "";

      if (info.tagline) {
        addLine(details, "", "“" + info.tagline + "”", "tagline");
      }
      addLine(details, "Released: ", info.release_date || "Unknown", "");
      addLine(details, "Runtime: ", info.runtime ? info.runtime + " min" : "Unknown", "");

      // Director
      let director = "Unknown";
      for (let i = 0; i < info.credits.crew.length; i++) {
        if (info.credits.crew[i].job === "Director") {
          director = info.credits.crew[i].name;
          break;
        }
      }
      addLine(details, "Director: ", director, "");

      // Top 3 cast members
      const cast = [];
      for (let i = 0; i < info.credits.cast.length && i < 3; i++) {
        cast.push(info.credits.cast[i].name);
      }
      addLine(details, "Starring: ", cast.join(", "), "");

      // Links
      const links = document.createElement("p");
      links.classList.add("back-links");

      const tmdbLink = document.createElement("a");
      tmdbLink.href = "https://www.themoviedb.org/movie/" + movie.id;
      tmdbLink.target = "_blank";
      tmdbLink.textContent = "TMDB page";
      links.appendChild(tmdbLink);

      const key = findTrailerKey(info.videos.results);
      if (key !== null) {
        const trailerLink = document.createElement("a");
        trailerLink.href = "https://www.youtube.com/watch?v=" + key;
        trailerLink.target = "_blank";
        trailerLink.textContent = "▶ Trailer";
        links.appendChild(trailerLink);
      }

      details.appendChild(links);
    })
    .catch(function (error) {
      console.log(error);
      details.textContent = "Couldn't load details.";
    });
}

// Adds one "Label: value" line to the back of a card
function addLine(box, label, value, className) {
  const p = document.createElement("p");
  if (className !== "") {
    p.classList.add(className);
  }
  if (label !== "") {
    const strong = document.createElement("strong");
    strong.textContent = label;
    p.appendChild(strong);
  }
  p.appendChild(document.createTextNode(value));
  box.appendChild(p);
}


// ===== Spoken greeting (Web Speech API, built into the browser) =====
document.getElementById("greeting-button").addEventListener("click", function () {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const words = new SpeechSynthesisUtterance(
      "Welcome to Cerebro Cinema, a tribute to Sir Patrick Stewart. Grab your popcorn and enjoy the show."
    );
    words.pitch = 0.9;
    words.rate = 0.95;
    window.speechSynthesis.speak(words);
  } else {
    statusText.textContent = "Your browser can't speak the greeting.";
  }
});


// ===== Popcorn bucket: pops popcorn when the mouse moves over it =====
const popcorn = document.getElementById("popcorn");
const popCount = document.getElementById("pop-count");
let totalPopped = 0;
let lastPopTime = 0;

function popKernel() {
  const kernel = document.createElement("span");
  kernel.classList.add("kernel");
  kernel.style.left = (30 + Math.random() * 40) + "%";
  popcorn.appendChild(kernel);

  // A moment later, send it flying in a random direction
  setTimeout(function () {
    const x = Math.random() * 200 - 100;
    const y = -(90 + Math.random() * 110);
    const spin = Math.random() * 720;
    kernel.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + spin + "deg)";
    kernel.style.opacity = "0";
  }, 20);

  // Remove it after the animation
  setTimeout(function () {
    kernel.remove();
  }, 1000);

  totalPopped = totalPopped + 1;
  popCount.textContent = totalPopped;
  checkEasterEgg();
}


// ===== Easter egg: pop 616 kernels (Earth-616 is Marvel's main universe) =====
const EASTER_EGG_NUMBER = 616;
const overlay = document.getElementById("cerebro-overlay");
const popHint = document.getElementById("pop-hint");
let eggFound = false;

function checkEasterEgg() {
  if (eggFound) {
    return;
  }

  // Small clues as you get closer, and the bucket glows brighter
  if (totalPopped >= 500) {
    popHint.textContent = "Cerebro senses you…";
    setGlow(2);
  } else if (totalPopped >= 300) {
    popHint.textContent = "Something is waking up…";
    setGlow(1);
  }

  if (totalPopped >= EASTER_EGG_NUMBER) {
    eggFound = true;
    setGlow(3);
    activateCerebro();
  }
}

// Make the popcorn bucket glow: level 1 is faint, level 3 is full power
function setGlow(level) {
  popcorn.classList.remove("glow-1", "glow-2", "glow-3");
  popcorn.classList.add("glow-" + level);
}

function activateCerebro() {
  overlay.classList.remove("hidden");
  document.body.classList.add("shake");
  setTimeout(function () {
    document.body.classList.remove("shake");
  }, 600);

  popcornRain();

  // Cerebro speaks (if the browser can)
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const words = new SpeechSynthesisUtterance("Cerebro activated. Six hundred sixteen kernels detected.");
    words.pitch = 0.8;
    words.rate = 0.9;
    window.speechSynthesis.speak(words);
  }

  popHint.textContent = "Cerebro is awake! 🧠";
}

// Make popcorn fall from the top of the whole screen
function popcornRain() {
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("span");
    piece.classList.add("rain-kernel");
    piece.style.left = (Math.random() * 100) + "vw";
    piece.style.animationDuration = (2 + Math.random() * 3) + "s"; // falls in 2 to 5 seconds
    piece.style.animationDelay = (Math.random() * 1.5) + "s";
    document.body.appendChild(piece);

    setTimeout(function () {
      piece.remove();
    }, 7000);
  }
}

function closeCerebro() {
  overlay.classList.add("hidden");
}

document.getElementById("egg-close").addEventListener("click", closeCerebro);

// The Escape key also closes it
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeCerebro();
  }
});

popcorn.addEventListener("mousemove", function () {
  const now = Date.now();
  if (now - lastPopTime > 60) {
    lastPopTime = now;
    popKernel();
  }
});

popcorn.addEventListener("click", function () {
  for (let i = 0; i < 8; i++) {
    popKernel();
  }
});


// ===== Start =====
showStats();
buildCarousel();
loadStewartMovies();