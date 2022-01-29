console.log("connected")
// Fetches the IMDI data ----------------------------

let movieSearch = "inception"

async function getIMDBApi() {
    let requestUrl = `https://imdb-api.com/en/API/SearchMovie/k_faz1hkma/${movieSearch}`
    let response = await fetch(requestUrl)
    let data = await response.json()
    console.log(data)
    let movieId = data.results[0].id
    console.log(movieId)
    let getFullCast = `https://imdb-api.com/en/API/FullCast/k_faz1hkma/${movieId}`
    let response2 = await fetch(getFullCast)
    let data2 = await response2.json()
    console.log(data2)
}

getIMDBApi()


 