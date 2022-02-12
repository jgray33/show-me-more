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

// function searchAgain(event) {
//   console.log(this.event.target.value)
//   }

// Fetches the movie ID user's search using IMDI API ----------------------------
async function getIMDBApi(new_data) {
  $(".search-history-box").html("");
  showSearchHistory();
  $(".movieSearchList").html("");
  try {
    let requestUrl = `https://imdb-api.com/en/API/SearchMovie/k_faz1hkma/${new_data}`;
    let response = await fetch(requestUrl);
    let data = await response.json();
    // Get the alternative searches from the data and add them into the "searches related to/did you mean" search list -------------------------------------------
    let moviesList = data.results;
    for (let i = 0; i < 5; i++) {
      $(".movieSearchList").append(
        `<li><button class="otherMovieTitles hollow button secondary" value="${moviesList[i].title}"> ${moviesList[i].title} ${moviesList[i].description} </button></li>`
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
  let getFullCast = `https://imdb-api.com/en/API/FullCast/k_faz1hkma/${movieId}`;
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

    let output = `    <div class="orbit-wrapper">
            <div class="orbit-controls">
              <button class="orbit-previous"><span class="show-for-sr">Previous Slide</span>&#9664;&#xFE0E;</button>
              <button class="orbit-next"><span class="show-for-sr">Next Slide</span>&#9654;&#xFE0E;</button>
            </div>
  
           <div class=" actor-card image-hover-wrapper column">
            <span class="image-hover-wrapper-banner">${characterName}</span>
              <a href=""><img src="${actorImage}">
                <span class="image-hover-wrapper-reveal">
                <h2>${actorName}</h2>
                  <p><i class="fab fa-twitter" aria-hidden="true"></i>&nbsp;${twitterHandle}</p><br><br>
                  <p><i class="fa-solid fa-caret-right" aria-hidden="true">&nbsp;${instagramHandle}</i></p>
                </span>
              </a>
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
  let getFullCast = `https://imdb-api.com/en/API/FullCast/k_faz1hkma/${movieId}`;
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
  let getFullCast = `https://imdb-api.com/en/API/FullCast/k_faz1hkma/${movieId}`;
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
        $(".search-history-box").append(
          `<li><button class="userMovieSearch hollow button secondary" value="${newUS[i]}"> ${newUS[i]} </button></li>`
        );
      }
    }
    $(".userMovieSearch").on("click", (event) => {
      console.log("search history clicked");
      $("#search-field").val("");
      $("#search-field").val(this.event.target.value);
      getIMDBApi(this.event.target.value);
    });
  }
}
