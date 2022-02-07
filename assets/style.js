$("#search-bttn").click(function () {

    $("#actors-card").removeClass("hide")
    console.log("you clicked search ");
    let new_data = $("#search-field").val();
    if (localStorage.getItem("movieSearch") == null) {
      localStorage.setItem("movieSearch", "[]");
    }

 