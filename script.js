NOTES 
//* button.addEventlistener( "click,"
//alert ("welcome!"); 

// element.addEventListener("click", myFunction);

//function myFunction() {
  alert ("Hello World!"); 

function *insertnameoffunctionhere" () = {
const
const
const} // 








// Fetches the list of actor's from the user's search using IMDI data ----------------------------

function async getIMDBApi(new_data) {
  let requestUrl = `https://imdb-api.com/en/API/SearchMovie/k_klb075h2/${new_data}`;
  let response = await fetch(requestUrl);
  let data = await response.json();
  console.log(data);
  movieId = data.results[0].id;
  getActorList(movieId);
}

