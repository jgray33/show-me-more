console.log("connected")
// Fetches the IMDI data ----------------------------

async function getIMDBApi() {
    let requestUrl = "https://imdb-api.com/en/API/FullCast/k_faz1hkma/Annie"
    const response = await fetch(requestUrl)
    const data = await response.json()
    console.log(data)
}

getIMDBApi()
 