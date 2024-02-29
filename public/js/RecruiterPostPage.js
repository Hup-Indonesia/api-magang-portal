document.title = "Post Preview - Hup Indonesia!";

let RECRUITER_ID
let COMPLETION_COUNT = 0
const USER_ID = $("#user_id").text()
const URL_ID = window.location.href.split("/")[4];

$("#seeker-applied-date span").text(getFormattedToday())

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
        $("#navbar-org-logo").attr("src", seekerData.recruiter.rec_org_logo)
        $("#navbar-org-name").text(seekerData.recruiter.rec_org_name)
    }
    
    $("#navbar-seeker-logo").attr("src", seekerData.profile_picture)
    $("#navbar-seeker-name").text(`${seekerData.first_name} ${seekerData.last_name}`)
    // $("#navbar-seeker").removeClass("hidden")
    $("#navbar-recruiter").removeClass("hidden")

    RECRUITER_ID = seekerData.recruiter.id
    $.get(`/api/v1/recruiter/${RECRUITER_ID}`, async (recruiterData) => {
        if(recruiterData.rec_org_logo){
            $("#nav-allpost").text(`(${recruiterData.posts.length})`)
        }


        $(".close-x").click(function(){
            $(this).closest('.popup').addClass("hidden")
            $(this).closest('#popup').addClass("hidden")
        })
        $(".back-x").click(function(){
            let body_percent_idx = $(".body-percent").index($(this).closest(".body-percent"))
            $(".body-percent").eq(body_percent_idx).addClass("hidden")
            $(".body-percent").eq(body_percent_idx-1).removeClass("hidden")
        })
        $(".button-next").click(function(){
            let body_percent_idx = $(".body-percent").index($(this).closest(".body-percent"))
            $(".body-percent").eq(body_percent_idx).addClass("hidden")
            $(".body-percent").eq(body_percent_idx+1).removeClass("hidden")
    
            $("#card-post-position").text($("input[name=post_position]").val())
            $("#card-post-org").text(recruiterData.rec_org_name)
            $("#card-post-location-type").text($("input[name=post_location_type]").val())
            $("#card-post-location").text($("input[name=post_location]").val())
            $("#card-post-work-time").text($("input[name=post_work_time]").val())
            $("#card-post-work-time-perweek").text($("input[name=post_work_time_perweek]").val())
        })



        updateSeekerData("form-add-post", `/api/v1/recruiter/${RECRUITER_ID}/post`, "POST")
    })
})

$.get(`/api/v1/posts/${URL_ID}`, async (postData) => {
    const Post = postData.datas
    const responsibility = Post.post_responsibility.split('\n')
    const requirement = Post.post_requirement.split('\n')
    const overview = Post.post_overview.split('\n')
    
    const RECRUITER = Post.recruiter[0]
    const rec_overview = RECRUITER.rec_description? RECRUITER.rec_description.split('\n') : []

    let resume = `<p class="text-white flex gap-2 items-center font-second font-normal text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none"><path d="M9 11C9.4125 11 9.76563 10.8531 10.0594 10.5594C10.3531 10.2656 10.5 9.9125 10.5 9.5C10.5 9.0875 10.3531 8.73437 10.0594 8.44062C9.76563 8.14687 9.4125 8 9 8C8.5875 8 8.23437 8.14687 7.94062 8.44062C7.64687 8.73437 7.5 9.0875 7.5 9.5C7.5 9.9125 7.64687 10.2656 7.94062 10.5594C8.23437 10.8531 8.5875 11 9 11ZM6 14H12V13.5687C12 13.2687 11.9187 12.9937 11.7563 12.7437C11.5938 12.4937 11.3687 12.3062 11.0812 12.1812C10.7562 12.0437 10.4219 11.9375 10.0781 11.8625C9.73438 11.7875 9.375 11.75 9 11.75C8.625 11.75 8.26562 11.7875 7.92188 11.8625C7.57812 11.9375 7.24375 12.0437 6.91875 12.1812C6.63125 12.3062 6.40625 12.4937 6.24375 12.7437C6.08125 12.9937 6 13.2687 6 13.5687V14ZM13.875 17H4.125C3.825 17 3.5625 16.8875 3.3375 16.6625C3.1125 16.4375 3 16.175 3 15.875V3.125C3 2.825 3.1125 2.5625 3.3375 2.3375C3.5625 2.1125 3.825 2 4.125 2H10.05C10.2 2 10.3469 2.03125 10.4906 2.09375C10.6344 2.15625 10.7563 2.2375 10.8563 2.3375L14.6625 6.14375C14.7625 6.24375 14.8438 6.36562 14.9062 6.50937C14.9688 6.65312 15 6.8 15 6.95V15.875C15 16.175 14.8875 16.4375 14.6625 16.6625C14.4375 16.8875 14.175 17 13.875 17Z" fill="#A5A5A5"/></svg> Resume</p>`
    let portfolio = `<p class="text-white flex gap-2 items-center font-second font-normal text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none"><path d="M9.6875 6.075L11 5.26875L12.3125 6.075C12.4125 6.1375 12.5094 6.14063 12.6031 6.08438C12.6969 6.02813 12.7438 5.94375 12.7438 5.83125V1.125H9.25625V5.83125C9.25625 5.94375 9.30313 6.02813 9.39688 6.08438C9.49063 6.14063 9.5875 6.1375 9.6875 6.075ZM3.875 12.75C3.575 12.75 3.3125 12.6375 3.0875 12.4125C2.8625 12.1875 2.75 11.925 2.75 11.625V1.125C2.75 0.825 2.8625 0.5625 3.0875 0.3375C3.3125 0.1125 3.575 0 3.875 0H14.375C14.675 0 14.9375 0.1125 15.1625 0.3375C15.3875 0.5625 15.5 0.825 15.5 1.125V11.625C15.5 11.925 15.3875 12.1875 15.1625 12.4125C14.9375 12.6375 14.675 12.75 14.375 12.75H3.875ZM1.625 15C1.325 15 1.0625 14.8875 0.8375 14.6625C0.6125 14.4375 0.5 14.175 0.5 13.875V2.8125C0.5 2.65 0.553125 2.51563 0.659375 2.40938C0.765625 2.30313 0.9 2.25 1.0625 2.25C1.225 2.25 1.35938 2.30313 1.46562 2.40938C1.57187 2.51563 1.625 2.65 1.625 2.8125V13.875H12.6875C12.85 13.875 12.9844 13.9281 13.0906 14.0344C13.1969 14.1406 13.25 14.275 13.25 14.4375C13.25 14.6 13.1969 14.7344 13.0906 14.8406C12.9844 14.9469 12.85 15 12.6875 15H1.625Z" fill="#AAAAAA"/></svg> Portfolio</p>`

    $("#post-position").text(Post.post_position)
    $("#post-overview").html(overview.join("</br>"))
    $(".about-job").append(aboutInfo(Post))
    $("#responsibility").html(responsibility.join("</br>"))
    $("#requirement").html(requirement.join("</br>"))
    $("#rec-org-name").text(RECRUITER.rec_org_name)
    $("#post-img").attr("src", RECRUITER.rec_org_logo)
    if(Post.post_resume_req) $("#required-file").append(resume)
    if(Post.post_portfolio_req) $("#required-file").append(portfolio)
    
    
    $("#org-name").text(RECRUITER.rec_org_name)
    $("#org-desc").html(rec_overview.join("</br>"))
    $("#org-img").attr("src", RECRUITER.rec_org_logo)

})

$("#posts-grid").on("change",".post-status", function(){
    $(this).val($(this).is(":checked"))
    const form_update = $(this).closest("form");
    const POST_ID = form_update.find(".post-id").text()
    const formData = new FormData(form_update[0])
    if($(this).val() == "false") formData.append("post_status", "CLOSED")
    if($(this).val() == "true") formData.set("post_status", "IN-PROGRESS")
    
    $.ajax({
        url: `/api/v1/posts/${POST_ID}`,
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
                alert("Error!")
            },
        });
    })
}

function formatDate(inputDate) {
    // Parse tanggal dalam format "YYYY-MM-DD"
    const dateParts = inputDate.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
  
    // Daftar nama bulan
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
  
    // Konversi komponen bulan ke nama bulan
    const formattedMonth = monthNames[parseInt(month, 10) - 1];
    // Gabungkan komponen-komponen dalam format yang diinginkan
    const formattedDate = `${day} ${formattedMonth}`;
  
    return formattedDate;
}

function formatDateFull(inputDate) {
    // Parse tanggal dalam format "YYYY-MM-DD"
    const dateParts = inputDate.split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
  
    // Daftar nama bulan
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ];
  
    // Konversi komponen bulan ke nama bulan
    const formattedMonth = monthNames[parseInt(month, 10) - 1];
  
    // Gabungkan komponen-komponen dalam format yang diinginkan
    const formattedDate = `${day} ${formattedMonth} ${year}`;
  
    return formattedDate;
}

function aboutInfo(post){
    return `
        <div class="grid grid-cols-2 mt-5 gap-y-5">
            <div class="flex flex-col gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21V7H7V3H17V11H21V21H13V17H11V21H3ZM5 19H7V17H5V19ZM5 15H7V13H5V15ZM5 11H7V9H5V11ZM9 15H11V13H9V15ZM9 11H11V9H9V11ZM9 7H11V5H9V7ZM13 15H15V13H13V15ZM13 11H15V9H13V11ZM13 7H15V5H13V7ZM17 19H19V17H17V19ZM17 15H19V13H17V15Z" fill="white" fill-opacity="0.4"/>
                </svg>
                <p class="text-white text-sm font-bold font-bold font-second">${post.post_location_type} • ${post.post_location}</p>
                <p class="font-second text-white-60 text-xs font-medium">Location</p>
            </div>
            <div class="flex flex-col gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="white" fill-opacity="0.4"/>
                    <circle cx="12" cy="12" r="10" stroke="#2A2A2A"/>
                    <path d="M6.68188 15H7.83032V12.1597H9.40942L10.9167 15H12.2395L10.5835 11.9854C11.4705 11.6829 12.019 10.8831 12.019 9.87817V9.86792C12.019 8.47852 11.0654 7.60181 9.55298 7.60181H6.68188V15ZM7.83032 11.2163V8.56567H9.40942C10.2913 8.56567 10.8347 9.05786 10.8347 9.87817V9.88843C10.8347 10.7292 10.3271 11.2163 9.44019 11.2163H7.83032Z" fill="#2A2A2A"/>
                    <path d="M12.9983 16.7944H14.1057V14.0925H14.1313C14.4492 14.718 15.0696 15.1077 15.8335 15.1077C17.187 15.1077 18.074 14.0259 18.074 12.3083V12.3032C18.074 10.5806 17.1921 9.50391 15.8181 9.50391C15.0491 9.50391 14.4543 9.89355 14.1313 10.5344H14.1057V9.60645H12.9983V16.7944ZM15.531 14.1541C14.6953 14.1541 14.1006 13.426 14.1006 12.3083V12.3032C14.1006 11.1804 14.6902 10.4524 15.531 10.4524C16.3975 10.4524 16.946 11.1548 16.946 12.3032V12.3083C16.946 13.4465 16.4026 14.1541 15.531 14.1541Z" fill="#2A2A2A"/>
                    </svg>
                <p class="text-white text-sm font-bold font-bold font-second">Rp${post.post_thp}</p>
                <p class="font-second text-white-60 text-xs font-medium">Take-home Pay</p>
            </div>
            <div class="flex flex-col gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15.3 16.7L16.7 15.3L13 11.6V7H11V12.4L15.3 16.7ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22Z" fill="white" fill-opacity="0.4"/>
                    </svg>
                <p class="text-white text-sm font-bold font-bold font-second">${post.post_work_time} • ${post.post_work_time_perweek}/week</p>
                <p class="font-second text-white-60 text-xs font-medium">Work Time</p>
            </div>
            <div class="flex flex-col gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M19.65 20.35L20.35 19.65L18.5 17.8V15H17.5V18.2L19.65 20.35ZM10 6H14V4H10V6ZM18 23C16.6167 23 15.4375 22.5125 14.4625 21.5375C13.4875 20.5625 13 19.3833 13 18C13 16.6167 13.4875 15.4375 14.4625 14.4625C15.4375 13.4875 16.6167 13 18 13C19.3833 13 20.5625 13.4875 21.5375 14.4625C22.5125 15.4375 23 16.6167 23 18C23 19.3833 22.5125 20.5625 21.5375 21.5375C20.5625 22.5125 19.3833 23 18 23ZM4 21C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V8C2 7.45 2.19583 6.97917 2.5875 6.5875C2.97917 6.19583 3.45 6 4 6H8V4C8 3.45 8.19583 2.97917 8.5875 2.5875C8.97917 2.19583 9.45 2 10 2H14C14.55 2 15.0208 2.19583 15.4125 2.5875C15.8042 2.97917 16 3.45 16 4V6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V12.275C21.4167 11.8583 20.7833 11.5417 20.1 11.325C19.4167 11.1083 18.7167 11 18 11C16.0667 11 14.4167 11.6833 13.05 13.05C11.6833 14.4167 11 16.0667 11 18C11 18.5167 11.0542 19.0292 11.1625 19.5375C11.2708 20.0458 11.4417 20.5333 11.675 21H4Z" fill="#7F7F7F"/>
                    </svg>
                <p class="text-white text-sm font-bold font-bold font-second">${post.post_contract_duration}</p>
                <p class="font-second text-white-60 text-xs font-medium">Duration</p>
            </div>
        </div>
    `
}

function getFormattedToday() {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const today = new Date();
    const year = today.getFullYear();
    const monthIndex = today.getMonth();
    const month = months[monthIndex];
    const day = today.getDate();

    // Menggabungkan tanggal, bulan, dan tahun dengan format yang diinginkan
    const formattedToday = `${day} ${month} ${year}`;

    return formattedToday;
}