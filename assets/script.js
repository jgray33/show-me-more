let apiKey = "k_faz1hkma"

let actorName;
let characterName;
let twitterHandle;
let actorImage;
let movieId;
let actorBday;
let actorPOB;

showSearchHistory();

// When the search button is pressed, user's search adds to search history and triggers the search -----------------------------------------
$("#search-bttn").click(function () {
  // ------ Getting the user's search, adding it into local storage, adding it into search history, then plugging into the get IMDBApi ------
  $(".row1").html("");
  $("#actors-card").removeClass("hide")
  console.log("you clicked search ");
  let new_data = $("#search-field").val();
  // Setting local storage
  if (localStorage.getItem("movieSearch") == null) {
    localStorage.setItem("movieSearch", "[]");
  }
  let old_list = JSON.parse(localStorage.getItem("movieSearch"));
  old_list.push(new_data);
  localStorage.setItem("movieSearch", JSON.stringify(old_list));
  let userMovieSearch = JSON.parse(localStorage.getItem("movieSearch"));
  console.log(userMovieSearch);
  getIMDBApi(new_data);
});


// Fetches the movie ID user's search using IMDI API ----------------------------
async function getIMDBApi(new_data) {
  $(".search-history").html("");
  showSearchHistory();
  $(".movieSearchList").html("");
  try {
    let requestUrl = `https://imdb-api.com/en/API/SearchMovie/${apiKey}/${new_data}`;
    let response = await fetch(requestUrl);
    let data = await response.json();
    // Get the alternative searches from the data and add them into the "searches related to/did you mean" search list -------------------------------------------
    let moviesList = data.results;
    for (let i = 0; i < 5; i++) {
      $(".movieSearchList").append(
        `<button class="otherMovieTitles" value="${moviesList[i].title}"> ${moviesList[i].title} ${moviesList[i].description} </button>`
      );
    }
    $(".otherMovieTitles").on("click", (event) => {
      let newSearch = this.event.target.value;
      console.log(newSearch);
      $(".row1").html("");
      $(".movieSearchList").html("");
      $("#search-field").val("");
      $("#search-field").val(newSearch);
          getIMDBApi($("#search-field").val());
    });
    console.log(data);
    console.log(data.results);
    movieId = data.results[0].id;
    getActorList(movieId);
  } catch (showError) {
    console.log(showError);
    console.log("not a film");
  }
}

// Using the Movie ID, fetches the list of actors in that movie from IMDB API ------------------------------------------------------------
async function getActorList() {
  let getFullCast = `https://imdb-api.com/en/API/FullCast/${apiKey}/${movieId}`;
  let response2 = await fetch(getFullCast);
  let data2 = await response2.json();
  console.log(data2);

  //   Go through the actor list from the movie and attains their first name and last name ---------------------------------------------------
  for (let i = 0; i < 4; i++) {
    characterName = data2.actors[i].asCharacter;
    actorName = data2.actors[i].name;
    actorImage = data2.actors[i].image;
    console.log(actorName);
    let actorNameArray = actorName.split(" ");
    console.log(actorNameArray);
    let actorFirstName = actorNameArray[0];
    let actorLastName = actorNameArray.slice(-1);
    console.log(actorLastName);
    await getActorID(actorFirstName, actorLastName);
  }
}

// Using the actor's name, fetches the actor's ID from TBDM API -----------------------------------------------
async function getActorID(actorFirstName, actorLastName) {
  let requestUrl = `https://api.themoviedb.org/3/search/person?api_key=7fcabf766db7f48c8e77b585913f04f8&query=${actorFirstName}+${actorLastName}`;
  let response = await fetch(requestUrl);
  let data = await response.json();
  console.log(data);
  let actorID = data.results[0].id;
  console.log(actorID);
  await getTwitterID(actorID);
}

// Get the social media handles from the TMDB API using the actor's ID ----------------------------------------
async function getTwitterID(actorID) {
  let requestUrl = `https://api.themoviedb.org/3/person/${actorID}/external_ids?api_key=7fcabf766db7f48c8e77b585913f04f8&language=en-US`;
  let response = await fetch(requestUrl);
  let data = await response.json();
  console.log(data);
  instagramHandle = data.instagram_id;
  twitterHandle = data.twitter_id;

  let requestUrl2 = `https://api.themoviedb.org/3/person/${actorID}?api_key=7fcabf766db7f48c8e77b585913f04f8&language=en-US`;
  let response2 = await fetch(requestUrl2);
  let data2 = await response2.json();
  console.log(data2);
  actorBday = data2.birthday;
  actorPOB = data2.place_of_birth;
  console.log(actorBday);
  console.log(actorPOB);
  await renderCard();
}

// Renders the actor's card pulling in all the information fetched from the APIs
function renderCard() {

    let output = `
        <div class="card" style="width: 250px;">
      <div class="card-divider">
        <h4>${characterName}</h4>
      </div>
      <div class="container">
        <img src=${actorImage}>
      </div>
        <div class="card-section">
        <p><b> Actor name:</b> ${actorName}</p>
        <p><b> Age: </b> </p>
        <p><b> Date of birth:</b> ${actorBday}</p>
        <p><b> Place of birth:</b> ${actorPOB}</p>
        <p><b> Twitter:</b><a href="https://twitter.com/${twitterHandle}" target="_blank"> ${twitterHandle}</a></p>
        <p><b> Instagram:</b><a href="https://instagram.com/${instagramHandle}" target="_blank"> ${instagramHandle}</a></p>
      </div>
    </div>
               `;
  $(".row1").append(output);
}

//  Searches for the next actors once clicked on the "next page button" --------------------------------------------
let clickCount = 0;
$("#next-page").on("click", async function nextPage() {
  let newClickCount = clickCount++;
  let x = clickCount * 4;
  let getFullCast = `https://imdb-api.com/en/API/FullCast/${apiKey}/${movieId}`;
  let response2 = await fetch(getFullCast);
  let data2 = await response2.json();
  console.log(data2);
  $(".row1").html("");
  for (let i = x; i < x + 4; i++) {
    characterName = data2.actors[i].asCharacter;
    actorName = data2.actors[i].name;
    actorImage = data2.actors[i].image;
    console.log(actorName);
    let actorNameArray = actorName.split(" ");
    console.log(actorNameArray);
    let actorFirstName = actorNameArray[0];
    let actorLastName = actorNameArray.slice(-1);
    console.log(actorLastName);
    await getActorID(actorFirstName, actorLastName);
  }
});


$("#previous-page").on("click", async function previousPage() {
  let newClickCount = clickCount--;
  let x = clickCount * 4;
  let getFullCast = `https://imdb-api.com/en/API/FullCast/${apiKey}/${movieId}`;
  let response2 = await fetch(getFullCast);
  let data2 = await response2.json();
  console.log(data2);
  $(".row1").html("");
  for (let i = x; i < x + 4; i++) {
    characterName = data2.actors[i].asCharacter;
    actorName = data2.actors[i].name;
    actorImage = data2.actors[i].image;
    console.log(actorName);
    let actorNameArray = actorName.split(" ");
    console.log(actorNameArray);
    let actorFirstName = actorNameArray[0];
    let actorLastName = actorNameArray.slice(-1);
    console.log(actorLastName);
    await getActorID(actorFirstName, actorLastName);
  }
});

// Loads the user's search history and removes duplicates -------------------------------------------
function showSearchHistory() {
  let userMovieSearch = JSON.parse(localStorage.getItem("movieSearch"));
  if (userMovieSearch == null) {
    console.log("no previous searches");
  } else {
    let uniqueSearches = [];
    userMovieSearch.forEach((element) => {
      if (!uniqueSearches.includes(element)) {
        uniqueSearches.push(element);
      }
    });
    console.log(uniqueSearches);
    if (uniqueSearches.length > 6) {
      console.log("Too big");
      let newUS = uniqueSearches.slice(-5, uniqueSearches.length);
      console.log(newUS);
      for (let i = 0; i < newUS.length; i++) {
        $(".search-history").append(
          `<button class="userMovieSearch" value="${newUS[i]}"> ${newUS[i]} </button>`
        );
      } 
    }
    $(".userMovieSearch").on("click", (event) => {
      console.log("search history clicked");
      $("#search-field").val("");
      $("#search-field").val(this.event.target.value);
      $("#actors-card").removeClass("hide")
      getIMDBApi(this.event.target.value);
    });
  }
}
