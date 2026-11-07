// Java script functions and variables for the moment of silence timer
  const display = document.getElementById("display");
  const alarm = new Audio("audio/TNG.mp3");
  let hasPlayed= false;
  let timer = null;
  let startTime = 0;
  let elapsedTime = 0;
  let isRunning = false;

function start()  //start timer
  {

        if(!isRunning)
        {
            startTime = Date.now() - elapsedTime;
            timer = setInterval(update, 10);
            isRunning = true;

            document.body.classList.add("fade"); //start fade effect for minute of silence
        }
  }

function stop() //stop timer and alarm
  {
    if (isRunning) 
    {
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        isRunning = false;
    }
    alarm.pause();
    alarm.currentTime = 0;

    document.body.style.transition = "none";

  }


function reset() {  //reset function for moment of silence timer, resets background color
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    hasPlayed = false;
    display.textContent = "00:00:00:00";

    document.body.style.transition = "none";
    document.body.classList.remove("fade");

    void document.body.offsetWidth;
    document.body.style.transition = "background-color 60s linear";

}

        function update() {  //function that pulls from date.now to get the increment of time in ms
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime;
        if(elapsedTime >= 60000 && !hasPlayed) {
            alarm.play();
            hasPlayed = true;
        }

        let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
        let seconds = Math.floor(elapsedTime / 1000 % 60);
        let milliseconds = Math.floor(elapsedTime % 1000 / 10);

        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');
        milliseconds = String(milliseconds).padStart(2, '0');

        display.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
    }


    const header = document.querySelector("header");  //messing around with tracking mouse movement to make a shiny look

    header.addEventListener("mousemove", (e) => {
    const rect = header.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    header.style.setProperty("--x", `${x}%`);
    header.style.setProperty("--y", `${y}%`);
});
    header.addEventListener("mouseleave", () => {
    header.style.setProperty("--x", "50%");
    header.style.setProperty("--y", "50%");
});

async function searchGames(query) {  //attempt to use the igdb api to search for x-men games, but it is not working due to CORS issues and the need for a server-side proxy
    const response = await fetch("https://api.igdb.com/v4/games", {
        method: "POST",
        headers: {
            "Client-ID": "YOUR_CLIENT_ID",
            "Authorization": "Bearer YOUR_ACCESS_TOKEN",
            "Content-Type": "text/plain"
        },
        body: `
            search "${query}";
            fields id, name, first_release_date, total_rating, summary, cover.*;
        `
    });

    if (!response.ok) {
        throw new Error(`IGDB API Error: ${response.status}`);
    }

    return await response.json();
}

// Search for X-Men games
    searchGames("X-Men")
    .then(games => console.log(games))
    .catch(error => console.error(error));

var searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", function() {
    var query = document.getElementById("searchInput").value;
    searchGames(query)
        .then(games => console.log(games))
        .catch(error => console.error(error));
});





