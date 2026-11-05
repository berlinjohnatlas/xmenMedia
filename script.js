//fetch("https://api.igdb.com/v4/games/")

  //.then(response => response.json())
  //.then(data => console.log(data))
  //.catch(error => console.error("Error fetching games:", error));
const baseURL = "https://api.igdb.com/v4/games/";


const headers = {
    "Authorization": "Bearer 4j91cf8cxglrt2mwilt6400t5n6vuv",
    "Client-ID": "q8z5zmju4txayo1loe0711conu4kfu"
};

const params = new URLSearchParams({
    fields:'*',
    search: 'x-men',
    limit: '10',
    offset: '0',
});
const url = `${baseURL}?${params.toString()}`;

fetch(url, { headers })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error fetching games:", error));

