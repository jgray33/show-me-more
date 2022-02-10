let actorName;
let characterName;
let twitterHandle;
let actorImage;
let movieId;

showSearchHistory();

// When the search button is pressed, user's search adds to search history and triggers the search -----------------------------------------

$("#search-bttn").click(function (){
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
})


// function searchAgain(event) {
//   console.log(this.event.target.value)
//   }


// Fetches the list of actor's from the user's search using IMDI API ----------------------------
async function getIMDBApi(new_data) {
  $(".search-history-box").html("")
  showSearchHistory()
  $(".movieSearchList").html("");
    try {
    let requestUrl = `https://imdb-api.com/en/API/SearchMovie/k_d5zx1v7j/${new_data}`;
    let response = await fetch(requestUrl);
    let data = await response.json();
  // Get the alternative searches from the data and add them into the "searches related to/did you mean" search list -------------------------------------------
    let moviesList = data.results;
    for (let i = 0; i < 5; i++) {
      $(".movieSearchList").append(
        `<li><button class="otherMovieTitles hollow button secondary" value="${moviesList[i].title}"> ${moviesList[i].title} ${moviesList[i].description} </button></li>`
      )}
    $(".otherMovieTitles").on("click", (event) => {
      let newSearch = this.event.target.value
      console.log((newSearch));
      $(".row1").html("");
      $(".movieSearchList").html("");
      $("#search-field").val("")
      $("#search-field").val(newSearch)
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

async function getActorList() {
  let getFullCast = `https://imdb-api.com/en/API/FullCast/k_d5zx1v7j/${movieId}`;
  let response2 = await fetch(getFullCast);
  let data2 = await response2.json();
  console.log(data2);

  //   Go through the actor list
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

// Used the TMDB API to get the Actor's ID -----------------------------------------------
async function getActorID(actorFirstName, actorLastName) {
  let requestUrl = `https://api.themoviedb.org/3/search/person?api_key=7fcabf766db7f48c8e77b585913f04f8&query=${actorFirstName}+${actorLastName}`;
  let response = await fetch(requestUrl);
  let data = await response.json();
  console.log(data);
  let actorID = data.results[0].id;
  console.log(actorID);
  await getTwitterID(actorID);
}

// Get the social media handles from the TMDB API ----------------------------------------
async function getTwitterID(actorID) {
  let requestUrl = `https://api.themoviedb.org/3/person/${actorID}/external_ids?api_key=7fcabf766db7f48c8e77b585913f04f8&language=en-US`;
  let response = await fetch(requestUrl);
  let data = await response.json();
  console.log(data);
  instagramHandle = data.instagram_id;
  twitterHandle = data.twitter_id;
  await renderCard();
}

function renderCard() {
  let output = `    <div class=" actor-card image-hover-wrapper column">
            <span class="image-hover-wrapper-banner">Character Name: ${characterName}</span>
              <a href=""><img src="${actorImage}">
                <span class="image-hover-wrapper-reveal">
                  <p><i class="fab fa-twitter" aria-hidden="true"></i>&nbsp;${twitterHandle}</p><br><br>
                  <p><i class="fab fa-instagram" aria-hidden="true">&nbsp;${instagramHandle}</i></p>
                </span>
              </a>
            </div>
    `;
  $(".row1").append(output);
}

//  Searches for the next for actors once clicked on the "next page button"
let clickCount = 0;
$("#next-page").on("click", async function nextPage() {
  let newClickCount = clickCount++;
  let x = clickCount * 4;
  let getFullCast = `https://imdb-api.com/en/API/FullCast/k_d5zx1v7j/${movieId}`;
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
    console.log(uniqueSearches)
    if (uniqueSearches.length > 6) {
      console.log("Too big")
      let newUS = uniqueSearches.slice(-5, uniqueSearches.length);
      console.log(newUS)
        for (let i = 0; i < newUS.length; i++) {
      $(".search-history-box").append(
        `<li><button class="userMovieSearch hollow button secondary value="${newUS[i]}"> ${newUS[i]} </button></li>`
      );
    }
    }
  $(".userMovieSearch").on("click", event => {
    console.log("search history clicked")
    console.log(this.event.target.value)
  })}
}

// To do:
// Fix the search history buttons
// Fix the "did you mean list"
