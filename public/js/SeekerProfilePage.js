document.title = `Profile Page - Hup Indonesia!`;

const USER_ID = $("#user_id").text()

$.get(`/api/v1/seeker/${USER_ID}`, async (seekerData) => {
    $("#header-firstname").text(`Hi, ${seekerData.first_name}`)
    $("#basic-fullname").text(`${seekerData.first_name} ${seekerData.last_name}`)
    $("#basic-email").text(`${seekerData.email}`)
    $("#basic-mobile").text(`${seekerData.mobile ? seekerData.mobile : "-"}`)
    $("#basic-birthdate").text(`${seekerData.date_of_birth ? formatDate(seekerData.date_of_birth) : "-"}`)
    $("#basic-domicile").text(`${seekerData.domicile ? seekerData.domicile : '-'}`)
    $("#basic-sex").text(seekerData.sex ? seekerData.sex : "-")

    $("#popup-firstname").val(`${seekerData.first_name}`)
    $("#popup-lastname").val(`${seekerData.last_name}`)
    $("#popup-email").val(`${seekerData.email}`)
    $("#popup-mobile").val(`${seekerData.mobile ? seekerData.mobile : ""}`)
    $("#popup-birthdate").val(`${seekerData.date_of_birth}`)
    $("#popup-domicile").val(`${seekerData.domicile ? seekerData.domicile : ""}`)
    $(`input[name=sex][value=${seekerData.sex}]`).prop("checked",true);
    $("#profile-viewers").text(seekerData.profile_viewers)

    seekerData.educations.length !== 0 ? $("#basic-current-position").text(`${seekerData.educations[0].edu_program} Student at ${seekerData.educations[0].edu_institution}`) : $("#basic-current-position").text("")

    if(seekerData.profile_picture){
        $("#basic-profile-pic").attr("src", seekerData.profile_picture);
        $("#popup-profile-pic").attr("src", seekerData.profile_picture);
    }

    if(seekerData.role == "recruiter"){
        $(".recruiter-profile").remove()
    }

    let completion_rate = 0
    if(seekerData.profile_picture) {
        $("#completion-profile-picture").remove()
        $("#completion-profile-picture-mobile").remove()
        completion_rate+= 20
    }
    if(seekerData.profile_summary){
        $("#completion-profile-summary").remove()
        $("#completion-profile-summary-mobile").remove()
        completion_rate+= 20
    }
    if(seekerData.experiences.length !== 0){
        $("#completion-experiences").remove()
        $("#completion-experiences-mobile").remove()
        completion_rate+= 20
    }
    if(seekerData.educations.length !== 0){
        $("#completion-education").remove()
        $("#completion-education-mobile").remove()
        completion_rate+= 20
    }
    if(seekerData.attachment){
        if(seekerData.attachment.atc_resume){
            $("#completion-resume").remove()
            $("#completion-resume-mobile").remove()
            completion_rate+= 20
        }
    }

    if(completion_rate == 100) $(".profie-completion").remove()
    if(completion_rate == 100) $("#for-mobile-completion").remove()
    $("#completion_rate").text(completion_rate)
    $("#completion_rate-mobile").text(completion_rate)
    
    
    // PROFILE SUMMARY
    if(seekerData.profile_summary){
      let paragraph = seekerData.profile_summary.split('\n')
      $("#profile-summary").html(paragraph.join("</br>")).addClass("font-second text-sm text-white-80 font-medium")
      $("#popup-summary-textarea").val(`${seekerData.profile_summary}`)
    }

    // EXPERIENCES
    if(seekerData.experiences.length !== 0){
        const EXPERIENCES = seekerData.experiences
        $("#experiences").html("")
        $("#experiences").removeClass("p-5")
        $("#experiences").addClass("pt-2 px-5")
        EXPERIENCES.forEach(experience => {
            $("#experiences").append(experience_html(experience))
            $("#popup-body-experiences").append(experience_html_edit(experience))
        })

        // Editing Experiences
        $("#popup").on("click", ".edit-svg-button", function(){
            $("#registered-experience").addClass("hidden")
            $("#editing-experience").removeClass("hidden")
            
            const CARD_EXPERIENCE_ID = $(this).closest(".card-experience").find(".id").text()
            let obj = EXPERIENCES.find(exp => exp.id === CARD_EXPERIENCE_ID)
            $("#editing-experience input[name=exp_position]").val(obj.exp_position)
            $("#editing-experience input[name=exp_orgname]").val(obj.exp_orgname)
            $("#editing-experience select[name=exp_type]").val(obj.exp_type)
            $("#editing-experience select[name=exp_time]").val(obj.exp_time)
            $("#editing-experience input[name=exp_startdate]").val(obj.exp_startdate)
            if(obj.exp_enddate){
                $("#editing-experience input[name=exp_enddate]").val(obj.exp_enddate)
            } else{
                $("#editing-experience input[name=exp_enddate]").prop("disabled", true)
                $("#editing-experience input[type=checkbox]").prop("checked", true)
            }
            $("#editing-experience select[name=exp_status]").val(obj.exp_status)
            $("#editing-experience input[name=exp_location]").val(obj.exp_location)
            $("#editing-experience textarea[name=exp_description]").val(obj.exp_description)

            $("#editing-experience input[type=checkbox]").change(function(){
                if($(this).is(":checked")){
                    $("#editing-experience input[name=exp_enddate]").prop("disabled", true)
                    $("#editing-experience input[name=exp_enddate]").val("")
                }else{
                    $("#editing-experience input[name=exp_enddate]").prop("disabled", false)
                }
            })

            $(".cancle-edit").click(function(){
                $(this).closest("#editing-experience").addClass("hidden")
                $("#registered-experience").removeClass("hidden")
            })

            // UPDATE
            updateSeekerData("form-editing-experience", `/api/v1/seeker/${USER_ID}/experience/${CARD_EXPERIENCE_ID}`, "PUT")
        })
    }

    // EDUCATIONS
    if(seekerData.educations.length !== 0){
        const EDUCATIONS = seekerData.educations
        $("#educations").html("")
        $("#educations").removeClass("p-5")
        $("#educations").addClass("pt-2 px-5")
        EDUCATIONS.forEach(education => {
            $("#educations").append(education_html(education))
            $("#popup-body-educations").append(education_html_menu(education))
        })
        
        // Editing Education
        $("#popup").on("click", ".edit-svg-button-edu", function(){
            $("#registered-education").addClass("hidden")
            $("#editing-education").removeClass("hidden")
            
            const CARD_EDUCATION_ID = $(this).closest(".card-education").find(".id").text()
            let obj = EDUCATIONS.find(exp => exp.id === CARD_EDUCATION_ID)
            $("#editing-education input[name=edu_program]").val(obj.edu_program)
            $("#editing-education input[name=edu_institution]").val(obj.edu_institution)
            $("#editing-education select[name=edu_type]").val(obj.edu_type)
            $("#editing-education input[name=edu_gpa]").val(obj.edu_gpa)
            $("#editing-education input[name=edu_startdate]").val(obj.edu_startdate)
            $("#editing-education input[name=edu_enddate]").val(obj.edu_enddate)
            $("#editing-education input[name=edu_status]").val(obj.edu_status)
            $("#editing-education input[name=edu_location]").val(obj.edu_location)
            $("#editing-education textarea[name=edu_description]").val(obj.edu_description)

            $(".cancle-edit").click(function(){
                $(this).closest("#editing-education").addClass("hidden")
                $("#registered-education").removeClass("hidden")
            })
            
            // UPDATE
            updateSeekerData("form-editing-education", `/api/v1/seeker/${USER_ID}/education/${CARD_EDUCATION_ID}`, "PUT")
        })
    }

    // ATTACHMENTS
    if(seekerData.attachment){
        let atc_portfolio = seekerData.attachment.atc_portfolio;
        let atc_resume = seekerData.attachment.atc_resume
        if(atc_portfolio){
            $("#portfolio span, #portfolio-mobile span").text(`${atc_portfolio.length > 28 ? atc_portfolio.substring(0, 28) + "..." : atc_portfolio}`)
            $("#portfolio, #portfolio-mobile").attr("href", `${atc_portfolio}`)
            $("#portfolio-type, #portfolio-type-mobile").text(getDomainName(atc_portfolio))
            $("#popup-body-portfolio").val(atc_portfolio)
        }
        if(atc_resume){
            atc_resume = atc_resume.split("uploads/")[1]
            $("#resume, #resume-mobile").text(atc_resume)
            $("#resume, #resume-mobile").attr("href", `${seekerData.attachment.atc_resume}`)
            $("#resume-date, #resume-date-mobile").text(`1mb • ${formatDate(getFormattedDate())}`)

            // ON POPUP
            $("#filled-resume").removeClass("hidden")
            $("#unfilled-resume").addClass("hidden")

            $("#filled-resume a").prop("href", seekerData.attachment.atc_resume).text(atc_resume)
            $("#filled-resume p span").text(formatDate(getFormattedDate()))
        }
    }

    if(seekerData.active_search){
        $("#active-search").prop("checked", true)
        $("#active-search-status").text("ActiveSearch is on.")
        $("#active-search-status").addClass("text-green-500").removeClass("text-red-500")
    }else{
        $("#active-search").prop("checked", false)
        $("#active-search-status").text("ActiveSearch is off.")
        $("#active-search-status").removeClass("text-green-500").addClass("text-red-500")
    }
})


// Open popup on edit button and profile completion

$("#edit-basic-info, #completion-profile-picture").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-basic").removeClass("hidden")
    $("body").addClass('no-scroll');
})
$("#edit-profile-summary, #completion-profile-summary, #button-profile-summary").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-summary").removeClass("hidden")
    $("body").addClass('no-scroll');
})
$("#edit-experiences, #completion-experiences, #button-experiences").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-experiences").removeClass("hidden")
    $("body").addClass('no-scroll');
})
$("#edit-education, #completion-education, #button-education").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-education").removeClass("hidden")
    $("body").addClass('no-scroll');
})
$("#edit-attachment, #completion-resume").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-attachments").removeClass("hidden")
    $("body").addClass('no-scroll');
})
$("#button-recruiter").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-recruiter").removeClass("hidden")
    $("body").addClass('no-scroll');
})

// Close button to close popup

$(".close-x").click(function(){
    $(this).closest('.popup').addClass("hidden")
    $(this).closest('#popup').addClass("hidden")
    $("body").removeClass('no-scroll');
})

$("#navbar-seeker").removeClass("hidden")

$("#add-experience, #add-experience-mobile").click(function(){
    $("#registered-experience").addClass("hidden")
    $("#adding-new-experience").removeClass("hidden")
})

$("#add-education, #add-education-mobile").click(function(){
    $("#registered-education").addClass("hidden")
    $("#adding-new-education").removeClass("hidden")
})

$(".button-next").click(function(){
    let body_percent_idx = $(".body-percent").index($(this).closest(".body-percent"))
    $(".body-percent").eq(body_percent_idx).addClass("hidden")
    $(".body-percent").eq(body_percent_idx+1).removeClass("hidden")
    $("#popup-recruiter-bar-text").text(`${(body_percent_idx+1) * 20}%`)
    $("#popup-recruiter-bar-progress").css("width", `${(body_percent_idx+1) * 20}%`)
})

$(".button-back").click(function(){
    let body_percent_idx = $(".body-percent").index($(this).closest(".body-percent"))
    $(".body-percent").eq(body_percent_idx).addClass("hidden")
    $(".body-percent").eq(body_percent_idx-1).removeClass("hidden")
})

$(".cancle-add").click(function(){
    $(this).closest(".body").find(".additional-popup").addClass("hidden")
    $(this).closest(".body").find(".main-popup").removeClass('hidden')
})

$("#still-work-here").change(function(){
    if($(this).is(":checked")){
        $("input[name=exp_enddate]").prop("disabled", true)
    }else{
        $("input[name=exp_enddate]").prop("disabled", false)
    }
})

$("#active-search").change(function(){
    $(this).val($(this).is(":checked"))
    const form_update = document.getElementById("form-update-active-search");
    const formData = new FormData(form_update)
    if($(this).val() == "false") formData.append("active_search", false)
    
    $.ajax({
        url: `/api/v1/seeker/${USER_ID}`,
        type: "PUT",
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        encrypt: "multipart/form-data",
        processData: false,
        success: (response) => {
            if(response.status_code == 200){
                location.reload()
            }
        },
        error: function (request, status, error) {
            alert("Error!")
        },
    });
})

$("#button-profile-pic").click(function(){
    $("#custom-input-file").click()
})

$("#button-input-resume").click(function(){
    $("#custom-input-resume").click()
})

$("#custom-input-resume").change(function(){
    const selectedFile = this.files[0];
    if (selectedFile) {
        if(selectedFile.size >= 2097152){
            $("#custom-input-resume").prop("type","text").prop("type","file")
            $("#file-too-large").removeClass("invisible")
            setTimeout(function() {
                $("#file-too-large").addClass("invisible");
            }, 2500);
        }else{
            $("#unfilled-resume").addClass("hidden")
            $("#filled-resume").removeClass("hidden")
            const fileURL = URL.createObjectURL(selectedFile);
            const date = new Date(selectedFile.lastModifiedDate);
            const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
    
            $("#filled-resume a").prop("href", fileURL).text(selectedFile.name)
            $("#filled-resume p span").text(formattedDate)
        }
    }
})

$("#filled-resume-delete").click(function(){
    $("#custom-input-resume").val("")
    $("#unfilled-resume").removeClass("hidden")
    $("#filled-resume").addClass("hidden")
})

$("#custom-input-file").on("change", function() {
    const selectedImage = this.files[0];
    if (selectedImage) {
        if(selectedImage.size > 2097152){
            $("#custom-input-file").prop("type","text").prop("type","file")
            $("#file-too-large").removeClass("invisible")
            setTimeout(function() {
                $("#file-too-large").addClass("invisible");
            }, 2500);
        }else{
            const imageUrl = URL.createObjectURL(selectedImage);
            $("#popup-profile-pic").attr("src", imageUrl);
        }
    } else {
        $("#popup-profile-pic").attr("src", "/img/Ellipse 3.svg");
    }
});

$(".delete-attachment").click(function(){
    const ATTACHMENT_NAME = $(this).closest(".attachment-body").find(".field_name").text()
    updateSeekerDataWithoutForm(`/api/v1/seeker/${USER_ID}/attachment/${ATTACHMENT_NAME}`, "DELETE")
})

$("#popup-recruiter-org").find("input").on("input", function(){
    const nonEmptyInputs = $("#popup-recruiter-org").find("input").filter(function() {
        return $(this).val().length > 0;
    });

    if(nonEmptyInputs.length === 5){
        $("#button-recruiter-org").prop("disabled", false)
    }else{
        $("#button-recruiter-org").prop("disabled", true)
    }
})

$("#popup-recruiter-info").find("input").on("input", function(){
    const nonEmptyInputs = $("#popup-recruiter-info").find("input").filter(function() {
        return $(this).val().length > 0;
    });

    if(nonEmptyInputs.length === 4){
        $("#button-recruiter-info").prop("disabled", false)
    }else{
        $("#button-recruiter-info").prop("disabled", true)
    }
})
    






// -------- update basic information data -------- 
updateSeekerData("form-basic-information", `/api/v1/seeker/${USER_ID}`,"PUT")


// -------- update profile summary data -------- 
updateSeekerData("form-profile-summary", `/api/v1/seeker/${USER_ID}`,"PUT")


// -------- update profile experiences -------- 
// ADD
updateSeekerData("form-add-experience", `/api/v1/seeker/${USER_ID}/experience`, "POST")


// -------- add profile educations -------- 
// ADD
updateSeekerData("form-add-education", `/api/v1/seeker/${USER_ID}/education`, "POST")


// -------- add attachment -------- 
updateSeekerData("form-add-attachment", `/api/v1/seeker/${USER_ID}/attachment`, "POST")

// -------- Delete EDUCATION || EXPERIENCE ---------
$("#popup").on("click", ".delete-svg-button", function(){
    const CARD_EXPERIENCE_ID = $(this).closest(".card-experience").find(".id").text()
    const CARD_EDUCATION_ID = $(this).closest(".card-education").find(".id").text()
    let confirmDeletion = confirm("Are you sure?")
    if(CARD_EDUCATION_ID && confirmDeletion){
        updateSeekerDataWithoutForm(`/api/v1/seeker/${USER_ID}/education/${CARD_EDUCATION_ID}`, "DELETE")
    }
    if(CARD_EXPERIENCE_ID && confirmDeletion){
        updateSeekerDataWithoutForm(`/api/v1/seeker/${USER_ID}/experience/${CARD_EXPERIENCE_ID}`, "DELETE")
    }
})

updateSeekerData("form-register-recruiter", `/api/v1/seeker/${USER_ID}/recruiter`, "POST")



function updateSeekerData(formId, URL, method){
    const form_update = document.getElementById(formId);
    $(`#${formId}`).submit(function(e){
        e.preventDefault();
        let formData = new FormData(form_update)
        $.ajax({
            url: URL,
            type: method,
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            encrypt: "multipart/form-data",
            processData: false,
            success: (response) => {
                if(response.status_code == 200){
                    location.reload()
                }
            },
            error: function (request, status, error) {
                // alert("Error!")
            },
        });
    })
}

function updateSeekerDataWithoutForm(URL, method){
    $.ajax({
        url: URL,
        type: method,
        success: function (response) {
            if(startsWithTwo(response.status_code)){
                location.reload()
            }
        },
        error: function (error) {
            // alert("Error")
        }
    });
}

function startsWithTwo(input) {
    const regex = /^2\d+/; // '^2' menunjukkan input harus dimulai dengan '2', dan '\d+' menunjukkan satu atau lebih digit.
    return regex.test(input);
}



function formatDate(inputDate) {
    // Parse tanggal dalam format "YYYY-MM-DD"
    const dateParts = inputDate.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
  
    // Daftar nama bulan
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
  
    // Konversi komponen bulan ke nama bulan
    const formattedMonth = monthNames[parseInt(month, 10) - 1];
  
    // Gabungkan komponen-komponen dalam format yang diinginkan
    const formattedDate = `${day} ${formattedMonth} ${year}`;
  
    return formattedDate;
}

function formatDateMonth(inputDate) {
    // Parse tanggal dalam format "YYYY-MM-DD"
    const dateParts = inputDate.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
  
    // Daftar nama bulan
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
  
    // Konversi komponen bulan ke nama bulan
    const formattedMonth = monthNames[parseInt(month, 10) - 1];
  
    // Gabungkan komponen-komponen dalam format yang diinginkan
    const formattedDate = `${formattedMonth} ${year}`;
  
    return formattedDate;
}

function calculateMonthDifference(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);

    let yearDiff = end.getFullYear() - start.getFullYear();
    let monthDiff = end.getMonth() - start.getMonth();

    if (monthDiff < 0) {
        yearDiff -= 1;
        monthDiff += 12;
    }

    if (yearDiff === 0) {
        return `${monthDiff} Month`;
    } else if (yearDiff === 1) {
        return `1 Year ${monthDiff} Month`;
    } else {
        return `${yearDiff} Years ${monthDiff} Month`;
    }
}

function getDomainName(url) {
    // Hapus protokol (http://, https://) jika ada
  const withoutProtocol = url.replace(/(^\w+:|^)\/\//, '');

  // Pisahkan berdasarkan tanda '/' pertama
  const parts = withoutProtocol.split('/');

  // Ambil bagian pertama setelah pemisahan
  const domainWithExtension = parts[0];

  // Hapus ekstensi jika ada
  const domainWithoutExtension = domainWithExtension.replace(/\.[^.]*$/, '');

  return domainWithoutExtension.charAt(0).toUpperCase() + domainWithoutExtension.slice(1);;
}

function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Dapat ditambahkan 1 karena bulan dimulai dari 0.
    const day = String(today.getDate()).padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

function experience_html(experience){
    let paragraph = experience.exp_description.split('\n')
    return `
        <div class="w-full py-4">
            <div class="head lg:flex justify-between">
                <div class="">
                    <p class="text-[#FC4545] bg-[#DB3D3D]/20 py-[2px] px-2 inline cursor-default text-xs font-second font-medium">${experience.exp_type.toUpperCase()}</p>
                    <p class="font-bold text-lg text-white">${experience.exp_position}</p>
                    <p class="font-semibold text-sm text-white-80 font-second">${experience.exp_orgname} • ${experience.exp_time} • ${experience.exp_status} (${experience.exp_location}) </p>
                </div>
                <div class="text-left mt-1 lg:mt-0 lg:text-right flex gap-2 lg:block">
                    <p class="font-second text-xs font-normal text-white">${formatDateMonth(experience.exp_startdate)} - ${experience.exp_enddate? formatDateMonth(experience.exp_enddate) : "Now"}</p>
                    <p class="text-xs font-semibold text-[#A5A5A5]">${calculateMonthDifference(experience.exp_startdate, experience.exp_enddate?experience.exp_enddate:getFormattedDate()).toUpperCase()}</p>
                </div>
            </div>
            <div class="body flex">
                <p class="font-second text-sm text-white-60 font-normal mt-3">${paragraph.join("</br>")}</p>
            </div>
        </div>
    `
} 

function experience_html_edit(experience){
    let paragraph = experience.exp_description.split('\n')
    return `
        <div class="card-experience bg-[#2a2a2a] p-4 lg:p-0 rounded-lg">
            <div class="relative flex gap-4">
                <div class="hidden lg:block">
                    <svg class="cursor-grab" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 20C8.45 20 7.97917 19.8042 7.5875 19.4125C7.19583 19.0208 7 18.55 7 18C7 17.45 7.19583 16.9792 7.5875 16.5875C7.97917 16.1958 8.45 16 9 16C9.55 16 10.0208 16.1958 10.4125 16.5875C10.8042 16.9792 11 17.45 11 18C11 18.55 10.8042 19.0208 10.4125 19.4125C10.0208 19.8042 9.55 20 9 20ZM15 20C14.45 20 13.9792 19.8042 13.5875 19.4125C13.1958 19.0208 13 18.55 13 18C13 17.45 13.1958 16.9792 13.5875 16.5875C13.9792 16.1958 14.45 16 15 16C15.55 16 16.0208 16.1958 16.4125 16.5875C16.8042 16.9792 17 17.45 17 18C17 18.55 16.8042 19.0208 16.4125 19.4125C16.0208 19.8042 15.55 20 15 20ZM9 14C8.45 14 7.97917 13.8042 7.5875 13.4125C7.19583 13.0208 7 12.55 7 12C7 11.45 7.19583 10.9792 7.5875 10.5875C7.97917 10.1958 8.45 10 9 10C9.55 10 10.0208 10.1958 10.4125 10.5875C10.8042 10.9792 11 11.45 11 12C11 12.55 10.8042 13.0208 10.4125 13.4125C10.0208 13.8042 9.55 14 9 14ZM15 14C14.45 14 13.9792 13.8042 13.5875 13.4125C13.1958 13.0208 13 12.55 13 12C13 11.45 13.1958 10.9792 13.5875 10.5875C13.9792 10.1958 14.45 10 15 10C15.55 10 16.0208 10.1958 16.4125 10.5875C16.8042 10.9792 17 11.45 17 12C17 12.55 16.8042 13.0208 16.4125 13.4125C16.0208 13.8042 15.55 14 15 14ZM9 8C8.45 8 7.97917 7.80417 7.5875 7.4125C7.19583 7.02083 7 6.55 7 6C7 5.45 7.19583 4.97917 7.5875 4.5875C7.97917 4.19583 8.45 4 9 4C9.55 4 10.0208 4.19583 10.4125 4.5875C10.8042 4.97917 11 5.45 11 6C11 6.55 10.8042 7.02083 10.4125 7.4125C10.0208 7.80417 9.55 8 9 8ZM15 8C14.45 8 13.9792 7.80417 13.5875 7.4125C13.1958 7.02083 13 6.55 13 6C13 5.45 13.1958 4.97917 13.5875 4.5875C13.9792 4.19583 14.45 4 15 4C15.55 4 16.0208 4.19583 16.4125 4.5875C16.8042 4.97917 17 5.45 17 6C17 6.55 16.8042 7.02083 16.4125 7.4125C16.0208 7.80417 15.55 8 15 8Z" fill="white" fill-opacity="0.6"/>
                    </svg>
                </div>
                <div class="w-full">
                    <div class="head lg:flex justify-between">
                        <div class="">
                            <p class="id" style="display: none;">${experience.id}</p>
                            <p class="text-[#FC4545] bg-[#DB3D3D]/20 py-[2px] px-2 inline cursor-default text-xs font-second font-medium">${experience.exp_type.toUpperCase()}</p>
                            <p class="font-bold text-lg text-white mt-2 lg:mt-0">${experience.exp_position}</p>
                            <p class="font-semibold text-sm text-white-80 font-second">${experience.exp_orgname} • ${experience.exp_time} • ${experience.exp_status} (${experience.exp_location}) </p>
                        </div>
                        <div class="text-left mt-1 lg:mt-0 lg:text-right flex gap-2 lg:block">
                            <p class="font-second text-xs font-normal text-white">${formatDateMonth(experience.exp_startdate)} - ${experience.exp_enddate?formatDateMonth(experience.exp_enddate):"Now"}</p>
                            <p class="text-xs font-semibold text-[#A5A5A5]">${calculateMonthDifference(experience.exp_startdate, experience.exp_enddate?experience.exp_enddate:getFormattedDate()).toUpperCase()}</p>
                        </div>
                    </div>
                    <div <div class="body flex">
                        <p class="font-second text-sm text-white-60 font-normal mt-3">${paragraph.join("</br>")}</p>
                    </div>
                </div>
                <div class="absolute lg:static right-0 flex lg:flex-col flex-row-reverse gap-4 lg:gap-2">
                    <svg class="cursor-pointer edit-svg-button" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM4 21C3.71667 21 3.47917 20.9042 3.2875 20.7125C3.09583 20.5208 3 20.2833 3 20V17.175C3 17.0417 3.025 16.9125 3.075 16.7875C3.125 16.6625 3.2 16.55 3.3 16.45L13.6 6.15L17.85 10.4L7.55 20.7C7.45 20.8 7.3375 20.875 7.2125 20.925C7.0875 20.975 6.95833 21 6.825 21H4Z" fill="#A5A5A5"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer delete-svg-button" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6.525 21C6.125 21 5.775 20.85 5.475 20.55C5.175 20.25 5.025 19.9 5.025 19.5V5.25H4.75C4.53333 5.25 4.35417 5.17917 4.2125 5.0375C4.07083 4.89583 4 4.71667 4 4.5C4 4.28333 4.07083 4.10417 4.2125 3.9625C4.35417 3.82083 4.53333 3.75 4.75 3.75H8.7C8.7 3.53333 8.77083 3.35417 8.9125 3.2125C9.05417 3.07083 9.23333 3 9.45 3H14.55C14.7667 3 14.9458 3.07083 15.0875 3.2125C15.2292 3.35417 15.3 3.53333 15.3 3.75H19.25C19.4667 3.75 19.6458 3.82083 19.7875 3.9625C19.9292 4.10417 20 4.28333 20 4.5C20 4.71667 19.9292 4.89583 19.7875 5.0375C19.6458 5.17917 19.4667 5.25 19.25 5.25H18.975V19.5C18.975 19.9 18.825 20.25 18.525 20.55C18.225 20.85 17.875 21 17.475 21H6.525ZM9.175 16.6C9.175 16.8167 9.24583 16.9958 9.3875 17.1375C9.52917 17.2792 9.70833 17.35 9.925 17.35C10.1417 17.35 10.3208 17.2792 10.4625 17.1375C10.6042 16.9958 10.675 16.8167 10.675 16.6V8.125C10.675 7.90833 10.6042 7.72917 10.4625 7.5875C10.3208 7.44583 10.1417 7.375 9.925 7.375C9.70833 7.375 9.52917 7.44583 9.3875 7.5875C9.24583 7.72917 9.175 7.90833 9.175 8.125V16.6ZM13.325 16.6C13.325 16.8167 13.3958 16.9958 13.5375 17.1375C13.6792 17.2792 13.8583 17.35 14.075 17.35C14.2917 17.35 14.4708 17.2792 14.6125 17.1375C14.7542 16.9958 14.825 16.8167 14.825 16.6V8.125C14.825 7.90833 14.7542 7.72917 14.6125 7.5875C14.4708 7.44583 14.2917 7.375 14.075 7.375C13.8583 7.375 13.6792 7.44583 13.5375 7.5875C13.3958 7.72917 13.325 7.90833 13.325 8.125V16.6Z" fill="#A5A5A5"/>
                    </svg>
                </div>
            </div>
        </div>
    `
}

function education_html(education){
    let paragraph = education.edu_description.split('\n')
    return `
        <div class="w-full py-4">
            <div class="head lg:flex justify-between">
                <div class="">
                    <div class="flex items-center gap-2">
                        <p class="text-teal-100 bg-[#3DD1DB]/20 py-[2px] px-2 inline cursor-default text-xs font-second font-medium">${education.edu_type.toUpperCase()}</p>
                        <p class="text-white bg-white/30 py-[2px] px-2 inline cursor-default text-xs font-second font-medium">GPA ${education.edu_gpa}</p>
                    </div>
                    <p class="font-bold text-lg text-white">${education.edu_program}</p>
                    <p class="font-semibold text-sm text-white-80 font-second">${education.edu_institution} • ${education.edu_status} (${education.edu_location}) </p>
                </div>
                <div class="text-left mt-1 lg:mt-0 lg:text-right flex gap-2 lg:block">
                    <p class="font-second text-xs font-normal text-white">${formatDateMonth(education.edu_startdate)} - ${formatDateMonth(education.edu_enddate)}</p>
                    <p class="text-xs font-semibold text-[#A5A5A5]">${calculateMonthDifference(education.edu_startdate, education.edu_enddate).toUpperCase()}</p>
                </div>
            </div>
            <div class="body flex">
                <p class="font-second text-sm text-white-60 font-normal mt-3">${paragraph.join("</br>")}</p>
            </div>
        </div>
    `
}

function education_html_menu(education){
    let paragraph = education.edu_description.split('\n')
    return `
        <div class="card-education bg-[#2a2a2a] p-4 lg:p-0 rounded-lg">
            <div class="relative flex gap-4">
                <div class="hidden lg:block">
                    <svg class=" cursor-grab" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 20C8.45 20 7.97917 19.8042 7.5875 19.4125C7.19583 19.0208 7 18.55 7 18C7 17.45 7.19583 16.9792 7.5875 16.5875C7.97917 16.1958 8.45 16 9 16C9.55 16 10.0208 16.1958 10.4125 16.5875C10.8042 16.9792 11 17.45 11 18C11 18.55 10.8042 19.0208 10.4125 19.4125C10.0208 19.8042 9.55 20 9 20ZM15 20C14.45 20 13.9792 19.8042 13.5875 19.4125C13.1958 19.0208 13 18.55 13 18C13 17.45 13.1958 16.9792 13.5875 16.5875C13.9792 16.1958 14.45 16 15 16C15.55 16 16.0208 16.1958 16.4125 16.5875C16.8042 16.9792 17 17.45 17 18C17 18.55 16.8042 19.0208 16.4125 19.4125C16.0208 19.8042 15.55 20 15 20ZM9 14C8.45 14 7.97917 13.8042 7.5875 13.4125C7.19583 13.0208 7 12.55 7 12C7 11.45 7.19583 10.9792 7.5875 10.5875C7.97917 10.1958 8.45 10 9 10C9.55 10 10.0208 10.1958 10.4125 10.5875C10.8042 10.9792 11 11.45 11 12C11 12.55 10.8042 13.0208 10.4125 13.4125C10.0208 13.8042 9.55 14 9 14ZM15 14C14.45 14 13.9792 13.8042 13.5875 13.4125C13.1958 13.0208 13 12.55 13 12C13 11.45 13.1958 10.9792 13.5875 10.5875C13.9792 10.1958 14.45 10 15 10C15.55 10 16.0208 10.1958 16.4125 10.5875C16.8042 10.9792 17 11.45 17 12C17 12.55 16.8042 13.0208 16.4125 13.4125C16.0208 13.8042 15.55 14 15 14ZM9 8C8.45 8 7.97917 7.80417 7.5875 7.4125C7.19583 7.02083 7 6.55 7 6C7 5.45 7.19583 4.97917 7.5875 4.5875C7.97917 4.19583 8.45 4 9 4C9.55 4 10.0208 4.19583 10.4125 4.5875C10.8042 4.97917 11 5.45 11 6C11 6.55 10.8042 7.02083 10.4125 7.4125C10.0208 7.80417 9.55 8 9 8ZM15 8C14.45 8 13.9792 7.80417 13.5875 7.4125C13.1958 7.02083 13 6.55 13 6C13 5.45 13.1958 4.97917 13.5875 4.5875C13.9792 4.19583 14.45 4 15 4C15.55 4 16.0208 4.19583 16.4125 4.5875C16.8042 4.97917 17 5.45 17 6C17 6.55 16.8042 7.02083 16.4125 7.4125C16.0208 7.80417 15.55 8 15 8Z" fill="white" fill-opacity="0.6"/>
                    </svg>
                </div>  
                <div class="w-full">
                    <div class="head lg:flex justify-between">
                        <div class="">
                            <div class="flex items-center gap-2">
                                <p class="id" style="display: none;">${education.id}</p>
                                <p class="text-teal-100 bg-[#3DD1DB]/20 py-[2px] px-2 inline cursor-default text-xs font-second font-medium">${education.edu_type.toUpperCase()}</p>
                                <p class="text-white bg-white/30 py-[2px] px-2 inline cursor-default text-xs font-second font-medium">GPA ${education.edu_gpa}</p>
                            </div>
                            <p class="font-bold text-lg text-white">${education.edu_program}</p>
                            <p class="font-semibold text-sm text-white-80 font-second">${education.edu_institution} • ${education.edu_status} (${education.edu_location}) </p>
                        </div>
                        <div class="text-left mt-1 lg:mt-0 lg:text-right flex gap-2 lg:block">
                            <p class="font-second text-xs font-normal text-white">${formatDateMonth(education.edu_startdate)} - ${formatDateMonth(education.edu_enddate)}</p>
                            <p class="text-xs font-semibold text-[#A5A5A5]">${calculateMonthDifference(education.edu_startdate, education.edu_enddate).toUpperCase()}</p>
                        </div>
                    </div>
                    <div class="body flex">
                        <p class="font-second text-sm text-white-60 font-normal mt-3">${paragraph.join("</br>")}</p>
                    </div>
                </div>
                <div class="absolute lg:static right-0 flex lg:flex-col flex-row-reverse gap-4 lg:gap-2">
                    <svg class="cursor-pointer edit-svg-button-edu" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM4 21C3.71667 21 3.47917 20.9042 3.2875 20.7125C3.09583 20.5208 3 20.2833 3 20V17.175C3 17.0417 3.025 16.9125 3.075 16.7875C3.125 16.6625 3.2 16.55 3.3 16.45L13.6 6.15L17.85 10.4L7.55 20.7C7.45 20.8 7.3375 20.875 7.2125 20.925C7.0875 20.975 6.95833 21 6.825 21H4Z" fill="#A5A5A5"/>
                    </svg>
                    <svg class="cursor-pointer delete-svg-button" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6.525 21C6.125 21 5.775 20.85 5.475 20.55C5.175 20.25 5.025 19.9 5.025 19.5V5.25H4.75C4.53333 5.25 4.35417 5.17917 4.2125 5.0375C4.07083 4.89583 4 4.71667 4 4.5C4 4.28333 4.07083 4.10417 4.2125 3.9625C4.35417 3.82083 4.53333 3.75 4.75 3.75H8.7C8.7 3.53333 8.77083 3.35417 8.9125 3.2125C9.05417 3.07083 9.23333 3 9.45 3H14.55C14.7667 3 14.9458 3.07083 15.0875 3.2125C15.2292 3.35417 15.3 3.53333 15.3 3.75H19.25C19.4667 3.75 19.6458 3.82083 19.7875 3.9625C19.9292 4.10417 20 4.28333 20 4.5C20 4.71667 19.9292 4.89583 19.7875 5.0375C19.6458 5.17917 19.4667 5.25 19.25 5.25H18.975V19.5C18.975 19.9 18.825 20.25 18.525 20.55C18.225 20.85 17.875 21 17.475 21H6.525ZM9.175 16.6C9.175 16.8167 9.24583 16.9958 9.3875 17.1375C9.52917 17.2792 9.70833 17.35 9.925 17.35C10.1417 17.35 10.3208 17.2792 10.4625 17.1375C10.6042 16.9958 10.675 16.8167 10.675 16.6V8.125C10.675 7.90833 10.6042 7.72917 10.4625 7.5875C10.3208 7.44583 10.1417 7.375 9.925 7.375C9.70833 7.375 9.52917 7.44583 9.3875 7.5875C9.24583 7.72917 9.175 7.90833 9.175 8.125V16.6ZM13.325 16.6C13.325 16.8167 13.3958 16.9958 13.5375 17.1375C13.6792 17.2792 13.8583 17.35 14.075 17.35C14.2917 17.35 14.4708 17.2792 14.6125 17.1375C14.7542 16.9958 14.825 16.8167 14.825 16.6V8.125C14.825 7.90833 14.7542 7.72917 14.6125 7.5875C14.4708 7.44583 14.2917 7.375 14.075 7.375C13.8583 7.375 13.6792 7.44583 13.5375 7.5875C13.3958 7.72917 13.325 7.90833 13.325 8.125V16.6Z" fill="#A5A5A5"/>
                    </svg>
                </div>
            </div>
        </div>
    `
}
  

