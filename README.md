# xmenMedia
Exploration of the X-men in Comics Film and Video Games, plus a tribute to Patrick Stewart

🧬 X-Men: A History in Key Issues created by Warren Green

An interactive, comic-book-inspired timeline exploring over 60 years of X-Men history through some of the most important issues in Marvel Comics.

From the original team's debut in 1963 to the Krakoa era in 2019, this project highlights the landmark stories, characters, and events that shaped the X-Men franchise.

📖 Project Overview
X-Men: A History in Key Issues is an interactive website that presents significant moments in X-Men comic book history in chronological order.

Users can explore different eras of the franchise, read summaries of influential comic issues, and select individual entries to view additional information and comic cover artwork retrieved through the ComicVine API.

The website uses a colorful comic-book aesthetic inspired by classic superhero comics.

✨ Features
Interactive Timeline: Explore important X-Men comic issues spanning six decades.
Era Filtering: Filter the timeline by five historical periods:
Silver Age
The All-New, All-Different X-Men
Claremont at His Peak
The 1990s
2000s and Beyond
Comic Issue Details: Each entry includes its publication year, comic title, issue number, publication date, story summary, and historical significance.
Comic Cover Artwork: Retrieve comic cover images through the ComicVine API.
Detailed Issue View: Select a comic entry to open a modal containing additional information, cover artwork, and a link to its ComicVine listing.
API Response Caching: Cache previously retrieved issues to reduce unnecessary API requests.
Sequential Cover Loading: Load covers one at a time to help avoid overwhelming the ComicVine API.
Responsive Design: Adapt the timeline and issue details to different screen sizes.
Accessibility: Includes accessible button labels, keyboard focus indicators, and reduced-motion support.
🦸 Featured Comic Eras

Era	Description
Silver Age	The original X-Men team and the introduction of mutantkind.
All-New, All-Different	The international team that relaunched the franchise in 1975.
Claremont at His Peak	Iconic stories such as Dark Phoenix and Days of Future Past.
The 1990s	Major events including Age of Apocalypse and Onslaught.
2000s and Beyond	Modern reinventions, House of M, and the Krakoa era.
🛠️ Technologies Used
HTML5 – Website structure and content.
CSS3 – Styling, layouts, responsive design, and comic-inspired visual effects.
JavaScript – Dynamic timeline rendering, filtering, modal interactions, and API requests.
ComicVine API – Comic issue information and cover artwork.
Google Fonts – Bangers and Comic Neue typography.






Movies (moviePage.html) by Eric Robinson
Function: "Cerebro Cinema", a movie theater-themed showcase of Patrick Stewart's X-Men films. It has:
a carousel of the six highest-grossing X-Men movies, with trailers you can play,
stats worked out from live data: how many X-Men films he was in, the box office total of the top six, and the biggest hit,
flip-card "tickets" for each of his X-Men films,
a popcorn bucket with a hidden Easter egg.
Form: The Box Office Ticket Counter.
Input: a search word (any movie title or keyword) and a film era from a dropdown (All, Original trilogy 2000–2006, Prequel era 2011–2016, Logan and beyond 2017+).
Output: a grid of flip cards for the movies that match. If the search box is empty, the page filters Patrick Stewart's own X-Men films by era. A banner shows how many tickets were found, with a button to clear the filter.
API: The page uses the TMDB (The Movie Database) API, called with axios:
/person/2387/movie_credits gets Patrick Stewart's film credits. The page keeps only the X-Men films where he played Charles Xavier, then builds the cards and the film count.
/search/movie (with the title and release year) gets each top-six movie's ID and wide picture for the carousel. Without the year, it runs the search from the form.
/movie/{id}/videos finds a movie's YouTube trailer, which plays right inside the carousel.
/movie/{id}?append_to_response=credits,videos runs the first time a ticket is flipped. It loads the tagline, release date, runtime, director, top three cast members and a trailer link.
Poster and movie still images come from image.tmdb.org. Box office numbers come from Box Office Mojo.
Animations and styles:
Look: a dark Cerebro theme in cyan and gold, with the Orbitron, Inter and Fira Code fonts. The title is filled with a gradient, faint TV scan lines run over the hero panel, and soft glows sit behind it.
Moving parts: a pulsing red "live" dot, the carousel sliding between movies (a transform transition), cards that flip in 3D (perspective and rotateY), posters that zoom on hover, and new cards that "pop in".
Popcorn: the bucket wiggles on hover and pops popcorn that flies off in random directions. As the count climbs, it starts to glow (at 300 and again at 500). At 616 kernels (a nod to Earth-616), "Cerebro" activates: a full-screen takeover with pulsing rings, popcorn raining down, the page shaking, and a spoken message (using the browser's Web Speech API).
Responsive: the layout uses Grid and Flexbox and adjusts at 900px and 600px. It goes from 3 cards per row to 2 to 1, the hero stacks, and the nav wraps on phones.



🎮 X-Men Gaming Mag
Insert Coin. Press Start. Cheat.

Welcome to X-Men Gaming Mag, a retro-inspired digital gaming magazine celebrating the history of X-Men video games across arcade machines, home consoles, and 3D gaming platforms.

This website explores the evolution of X-Men gaming, highlighting classic titles, memorable gameplay, visual design, and hidden cheat codes from some of the franchise's most iconic games.

🌟 Project Overview
X-Men Gaming Mag is designed to look and feel like a classic gaming magazine, combining bold typography, vibrant colors, animated game imagery, and editorial-style content.

The website takes visitors on a journey through the history of X-Men video games, from the 1990s arcade era to more modern console experiences.

✨ Features
1. Retro Magazine Design
Bold, arcade-inspired visual presentation.
Neon color palette featuring cyan, pink, yellow, and purple.
Custom typography using Google Fonts:
Anton
Orbitron
Roboto Condensed
Responsive magazine-style layout.
Animated GIFs showcasing classic X-Men gameplay.
2. Featured Arcade Coverage
Highlights X-Men: Children of the Atom, showcasing Capcom's interpretation of the classic 1990s X-Men characters.

Includes:

Character selection imagery.
Historical background on Capcom's CPS-2 arcade hardware.
Links to additional game information.
3. Arcade and Console Game Reviews
Features several classic X-Men video games, including:


Game	Platform
X-Men Arcade	Arcade
X-Men: Mutant Apocalypse	Super Nintendo
X-Men	Sega Genesis
X-Men 2: Clone Wars	Sega Genesis
X-Men: Children of the Atom	Arcade
Each game entry includes imagery, a short description, and a fun-factor rating.

4. Modern 3D X-Men Games
Explores the transition from traditional 2D arcade games to 3D console experiences.

Includes coverage of:

X-Men Legends.
X-Men: The Official Game.
YouTube gameplay video embeds.
Discussion of multiplayer experiences and character abilities.
5. Cheat Code Corner
A dedicated section featuring secrets and cheat codes for classic X-Men games.

Includes:

Sega Genesis X-Men level selection and cheat instructions.
Super Nintendo X-Men: Mutant Apocalypse passwords.
Character combinations for accessing specific levels.
🛠️ Technologies Used
HTML5 – Website structure and content.
CSS3 – Styling, layouts, animations, and responsive design.
JavaScript – External script integration through script.js.
Google Fonts – Custom typography.
Animated GIFs – Retro gaming visuals.
YouTube Embeds – Gameplay video demonstrations.
GitHub – Project hosting.
📁 Project Structure
The project uses the following file organization:


text
XMen-Gaming-Mag by John Berlin
│
├── index.html
├── comicPage.html
├── moviePage.html
├── videogamePage.html
├── patstewTRIB.html
│
├── script.js
│
├── images/
│   ├── cotaCharacterSelect.gif
│   ├── xmenArcadeDynamic.gif
│   ├── sentinalSmash.gif
│   ├── magnetoLeadingSentinals.gif
│   ├── mutantApocalypse1.gif
│   ├── XmenSega.gif
│   └── xmen2Sega3.gif
│
└── README.md
