document.title = "Home - Hup Indonesia!";

$("#im-seeker").click(function(){
    $("#main-seeker").removeClass("hidden")
    $("#main-recruiter").addClass("hidden")
    $("#im-recruiter").removeClass("bg-white text-[#000]").addClass("text-white font-bold")
    $(this).removeClass("text-white").removeClass("text-white").addClass("font-bold bg-white text-[#000]")
    $("#hero").css("background-image", `url('/img/Home-Hero.png')`)
})
$("#im-recruiter").click(function(){
    $("#main-seeker").addClass("hidden")
    $("#main-recruiter").removeClass("hidden")
    $("#im-seeker").removeClass("bg-white text-[#000]").addClass("text-white font-bold")
    $(this).removeClass("text-white").addClass("font-bold bg-white text-[#000]")
    $("#hero").css("background-image", "url('/img/Home-Hero-Rec.png')")
})

$("#burger").click(function(){
    $("#burger-nav").slideToggle()
    $(".burger-button").toggle()
})