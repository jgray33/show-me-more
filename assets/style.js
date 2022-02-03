console.log("connected")
// Fetches the IMDI data ----------------------------

let movieSearch = "inception"

async function getIMDBApi(new_data) {
    let requestUrl = `https://imdb-api.com/en/API/SearchMovie/k_faz1hkma/${new_data}`
    let response = await fetch(requestUrl)
    let data = await response.json()
    console.log(data)
    let movieId = data.results[0].id
    console.log(movieId)
    let getFullCast = `https://imdb-api.com/en/API/FullCast/k_faz1hkma/${movieId}`
    let response2 = await fetch(getFullCast)
    let data2 = await response2.json()
    console.log(data2)
    console.log(data2.actors[0])
    let characterName = data2.actors[0].asCharacter
    let actorName = (data2.actors[0].name)
    $("#actor-info").append(`<li>Character name: ${characterName}</li>`,`<li>${actorName}</li>` )

}


$("#search-bttn").click(function(){
    console.log("you clicked search ")
    let new_data = $("#search-field").val()
    if (localStorage.getItem("movieSearch") == null) {
        localStorage.setItem("movieSearch", "[]");
      }
      let old_list = JSON.parse(localStorage.getItem("movieSearch"));
      old_list.push(new_data);
      localStorage.setItem("movieSearch", JSON.stringify(old_list));
      let userMovieSearch = JSON.parse(localStorage.getItem("movieSearch"));
      console.log(userMovieSearch);    
      $(".search-history-box").append(
          `<li><button id="movieSearch" value=${new_data}> ${new_data} </button></li>`
      )
      getIMDBApi(new_data)
})



    // $("#searchList").append(
    //   `<li><button id="citySearch btn btn-outline-primary" value=${new_data}> ${new_data} </button></li>`
    // );
    

 