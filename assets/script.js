let actorName;
let characterName;
let twitterHandle;
let actorImage;
let movieId;


// When the search button is pressed, user's search adds to search history and triggers the search -------------------------------
$("#search-bttn").click(function () {
    $("#actors-card").removeClass("hide")
    $(".row1").html("")
  console.log("you clicked search ");
  let new_data = $("#search-field").val();
  if (localStorage.getItem("movieSearch") == null) {
    localStorage.setItem("movieSearch", "[]");
  }
  let old_list = JSON.parse(localStorage.getItem("movieSearch"));
  old_list.push(new_data);
  localStorage.setItem("movieSearch", JSON.stringify(old_list));
  let userMovieSearch = JSON.parse(localStorage.getItem("movieSearch"));
  console.log(userMovieSearch);
  $(".search-history-box").append(
    `<li><button class="userMovieSearch hollow button secondary value="${new_data}"> ${new_data} </button></li>`
  );
  getIMDBApi(new_data);
});


$(".userMovieSearch").on("click", event => {
  console.log("Clicked search again")
  // $("#search-field").val("")
  // $("#search-field").val(event.target.value)
  // getIMDBApi()
})


//  Searches for the next for actors once clicked on the "next page button"
let clickCount = 0
$("#next-page").on("click",  async function nextPage() {
  let newClickCount = clickCount++
  let x = (clickCount*4)
    let getFullCast = `https://imdb-api.com/en/API/FullCast/k_d5zx1v7j/${movieId}`;
    let response2 = await fetch(getFullCast);
    let data2 = await response2.json();
    console.log(data2);
    $(".row1").html("")
    for (let i = x; i < (x+4); i++) {
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
  })
  
// Fetches the list of actor's from the user's search using IMDI API ----------------------------
async function getIMDBApi(new_data) {
  try{ 
  let requestUrl = `https://imdb-api.com/en/API/SearchMovie/k_d5z1v7j/${new_data}`;
  let response = await fetch(requestUrl);
  let data = await response.json()

  console.log(data);
  movieId = data.results[0].id;
  getActorList(movieId)
 } catch(showError) {
  console.log("not a film")
  let modal = document.querySelector("#modal_container");
  console.log(modal)
  modal.classList.remove('hide')
  let close =document.getElementById("close");
  close.innerHTML = 'Close'
  close.addEventListener('click', function() {
  console.log('CLICKED')
  modal.classList.add('hide');
})
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
            <span class="image-hover-wrapper-banner">${characterName}</span>
              <a href=""><img src="${actorImage}">
                <span class="image-hover-wrapper-reveal">
                  <p>${twitterHandle}<i class="fab fa-twitter" aria-hidden="true"></i></p><br><br>
                  <p><i class="fab fa-instagram" aria-hidden="true">${instagramHandle}</i></p>
                </span>
              </a>
            </div>
    `;
  $(".row1").append(output);
}
//Modal


// To do:
// Fix the search history function 
// Create a modal 