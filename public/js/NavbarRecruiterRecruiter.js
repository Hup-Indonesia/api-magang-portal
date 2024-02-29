$.get(`/api/v1/seeker/${USER_ID}`, async (seekerData) => {
    if(seekerData.role == "recruiter"){
        // $("#navbar-recruiter-recruiter").remove()
        $("#navbar-recruiter-recruiter").removeClass("hidden")
        $("#navbar-recruiter-seeker").remove()
        $("#navbar-seeker-only").remove()
    }else{
        $("#navbar-recruiter-recruiter").remove()
        $("#navbar-recruiter-seeker").remove()
    }

    if(seekerData.recruiter){
        if(seekerData.recruiter.rec_org_logo){
            $("#navbar-org-logo").attr("src", seekerData.recruiter.rec_org_logo)
        }
        $("#navbar-org-name").text(seekerData.recruiter.rec_org_name.length <= 15 ? seekerData.recruiter.rec_org_name : seekerData.recruiter.rec_org_name.slice(0,15) + "..")
    }
    
    $("#navbar-seeker-logo, #navbar-seeker-logo-mobile").attr("src", seekerData.profile_picture)
    $("#navbar-seeker-name, #navbar-seeker-name-mobile").text(`${seekerData.first_name} ${seekerData.last_name}`)
    // $("#navbar-seeker").removeClass("hidden")
    $("#navbar-recruiter").removeClass("hidden")

    
    $("#burger").click(function(){
        $("#burger-nav").slideToggle()
        $(".burger-button").toggle()
    })
})