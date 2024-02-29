let RECRUITER_ID
let COMPLETION_COUNT = 0
const USER_ID = $("#user_id").text()
const URL_ID = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);

$.get(`/api/v1/seeker/${USER_ID}`, async (seekerData) => {

    if(seekerData.recruiter){
        RECRUITER_ID = seekerData.recruiter.id
        $.get(`/api/v1/recruiter/${RECRUITER_ID}`, async (recruiterData) => {
            if(recruiterData.rec_org_logo){
                $("#nav-allpost").text(`(${recruiterData.posts.length})`)
            }
            updateSeekerData("form-add-post", `/api/v1/recruiter/${RECRUITER_ID}/post`, "POST")
        })
    }

    $(".close-x").click(function(){
        $(this).closest('.popup').addClass("hidden")
        $(this).closest('#popup').addClass("hidden")
        $("body").removeClass('no-scroll');
    })

    if(seekerData.attachment){
        let atc_resume = seekerData.attachment.atc_resume
        if(atc_resume){
            // ON POPUP
            $("#filled-resume").removeClass("hidden")
            $("#unfilled-resume").addClass("hidden")

            $("#filled-resume a").prop("href", seekerData.attachment.atc_resume).text(atc_resume.split("uploads/")[1])
            $("#filled-resume p span").text(formatDate(getFormattedDate()))
            $("#button-submit-apply").prop("disabled", false)
        } 
        if(seekerData.attachment.atc_portfolio){
            $("#popup-required-portfolio").val(seekerData.attachment.atc_portfolio)
            $("#button-submit-apply").prop("disabled", false)
        }
    }

    


    $.get(`/api/v1/posts/${URL_ID}`, async (postData) => {

        const SAVED_ID = postData.datas.saved.map(saved => saved.id)
        if(SAVED_ID.includes(seekerData.id)){
            $(".utils-container").removeClass("gap-6").addClass("gap-4")
            $(".love-label input").prop("checked", true)
            $(".love-label img").prop("src", "/img/Love-Loved.svg")
            if($(window).width() > 720) $(".love-label img").prop("width", 20)
        }

        const Post = postData.datas
        const responsibility = Post.post_responsibility.split('\n')
        const requirement = Post.post_requirement.split('\n')
        const overview = Post.post_overview.split('\n')
        
        const RECRUITER = Post.recruiter[0]
        const rec_overview = RECRUITER.rec_description ? RECRUITER.rec_description.split('\n') : []
    
        let resume = `<p class="text-white flex gap-2 items-center font-second font-normal text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none"><path d="M9 11C9.4125 11 9.76563 10.8531 10.0594 10.5594C10.3531 10.2656 10.5 9.9125 10.5 9.5C10.5 9.0875 10.3531 8.73437 10.0594 8.44062C9.76563 8.14687 9.4125 8 9 8C8.5875 8 8.23437 8.14687 7.94062 8.44062C7.64687 8.73437 7.5 9.0875 7.5 9.5C7.5 9.9125 7.64687 10.2656 7.94062 10.5594C8.23437 10.8531 8.5875 11 9 11ZM6 14H12V13.5687C12 13.2687 11.9187 12.9937 11.7563 12.7437C11.5938 12.4937 11.3687 12.3062 11.0812 12.1812C10.7562 12.0437 10.4219 11.9375 10.0781 11.8625C9.73438 11.7875 9.375 11.75 9 11.75C8.625 11.75 8.26562 11.7875 7.92188 11.8625C7.57812 11.9375 7.24375 12.0437 6.91875 12.1812C6.63125 12.3062 6.40625 12.4937 6.24375 12.7437C6.08125 12.9937 6 13.2687 6 13.5687V14ZM13.875 17H4.125C3.825 17 3.5625 16.8875 3.3375 16.6625C3.1125 16.4375 3 16.175 3 15.875V3.125C3 2.825 3.1125 2.5625 3.3375 2.3375C3.5625 2.1125 3.825 2 4.125 2H10.05C10.2 2 10.3469 2.03125 10.4906 2.09375C10.6344 2.15625 10.7563 2.2375 10.8563 2.3375L14.6625 6.14375C14.7625 6.24375 14.8438 6.36562 14.9062 6.50937C14.9688 6.65312 15 6.8 15 6.95V15.875C15 16.175 14.8875 16.4375 14.6625 16.6625C14.4375 16.8875 14.175 17 13.875 17Z" fill="#A5A5A5"/></svg> Resume</p>`
        let portfolio = `<p class="text-white flex gap-2 items-center font-second font-normal text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none"><path d="M9.6875 6.075L11 5.26875L12.3125 6.075C12.4125 6.1375 12.5094 6.14063 12.6031 6.08438C12.6969 6.02813 12.7438 5.94375 12.7438 5.83125V1.125H9.25625V5.83125C9.25625 5.94375 9.30313 6.02813 9.39688 6.08438C9.49063 6.14063 9.5875 6.1375 9.6875 6.075ZM3.875 12.75C3.575 12.75 3.3125 12.6375 3.0875 12.4125C2.8625 12.1875 2.75 11.925 2.75 11.625V1.125C2.75 0.825 2.8625 0.5625 3.0875 0.3375C3.3125 0.1125 3.575 0 3.875 0H14.375C14.675 0 14.9375 0.1125 15.1625 0.3375C15.3875 0.5625 15.5 0.825 15.5 1.125V11.625C15.5 11.925 15.3875 12.1875 15.1625 12.4125C14.9375 12.6375 14.675 12.75 14.375 12.75H3.875ZM1.625 15C1.325 15 1.0625 14.8875 0.8375 14.6625C0.6125 14.4375 0.5 14.175 0.5 13.875V2.8125C0.5 2.65 0.553125 2.51563 0.659375 2.40938C0.765625 2.30313 0.9 2.25 1.0625 2.25C1.225 2.25 1.35938 2.30313 1.46562 2.40938C1.57187 2.51563 1.625 2.65 1.625 2.8125V13.875H12.6875C12.85 13.875 12.9844 13.9281 13.0906 14.0344C13.1969 14.1406 13.25 14.275 13.25 14.4375C13.25 14.6 13.1969 14.7344 13.0906 14.8406C12.9844 14.9469 12.85 15 12.6875 15H1.625Z" fill="#AAAAAA"/></svg> Portfolio</p>`
    
        document.title = `${Post.post_position} - Hup Indonesia!`;

        $("#button-apply, #button-apply-mobile").prop("href", `${Post.post_link}`)
        $("#post-position").text(Post.post_position)
        $("#post-type").text(Post.post_type.toUpperCase())
        $("#post-overview, #post-overview-mobile").html(overview.join("</br>"))
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

        $("#apply-before-text").text(formatDateFull(Post.post_deadline))
        $("#apply-before-left").text(hitungSelisihHari(Post.post_deadline))

        $(".love-button").click(function(){
            const POST_ID = Post.id

            const newValue = $(this).is(":checked");
            $(this).val(newValue);

            const formData = new FormData($(this).closest("form")[0])
            if($(this).val() == "false") formData.append("loved", false)
            formData.set("post_id", POST_ID)

            $.ajax({
                url: `/api/v1/seeker/${USER_ID}/save-post`,
                type: "POST",
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

        $(".copy-link").click(function(){
            const POST_ID = Post.id
            const URL = `${window.location.origin}/posts/redirect/${POST_ID}`
            navigator.clipboard.writeText(URL).then(function() {
                $("#popup-copylink").removeClass("invisible")
                setTimeout(function() {
                    $("#popup-copylink").addClass("invisible");
                }, 2500);
            }, function() {
                alert('Copy error')
            });
        })
    })

    $.get(`/api/v1/posts/`, async (postsData) => {
        const filteredExcludeUser = (postsData.datas.filter(data => {
            return data.recruiter[0].id !== seekerData.id
        })).slice(0,3)
        filteredExcludeUser.forEach(post => {
            $("#cards-grid").append(addCard(post))
        })
    })
})



$("#button-input-resume").click(function(){
    $("#custom-input-resume").click()
})
$("#custom-input-resume").change(function(){
    const selectedFile = this.files[0];
    if (selectedFile) {
        $("#unfilled-resume").addClass("hidden")
        $("#filled-resume").removeClass("hidden")
        const fileURL = URL.createObjectURL(selectedFile);
        const date = new Date(selectedFile.lastModifiedDate);
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        $("#filled-resume a").prop("href", fileURL).text(selectedFile.name)
        $("#filled-resume p span").text(formattedDate)
        $("#button-submit-apply").prop("disabled", false)
    }
})
$("#filled-resume-delete").click(function(){
    $("#custom-input-resume").val("")
    $("#unfilled-resume").removeClass("hidden")
    $("#filled-resume").addClass("hidden")
    $("#button-submit-apply").prop("disabled", true)
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
                    window.location = "/internships"
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
    <div class="grid grid-cols-2 mt-5 gap-3 lg:gap-x-0 lg:gap-y-5">
        <div class="flex flex-col gap-1 p-3 lg:p-0 bg-[#2A2A2A] lg:bg-transparent rounded-lg lg:rounded-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 21V7H7V3H17V11H21V21H13V17H11V21H3ZM5 19H7V17H5V19ZM5 15H7V13H5V15ZM5 11H7V9H5V11ZM9 15H11V13H9V15ZM9 11H11V9H9V11ZM9 7H11V5H9V7ZM13 15H15V13H13V15ZM13 11H15V9H13V11ZM13 7H15V5H13V7ZM17 19H19V17H17V19ZM17 15H19V13H17V15Z" fill="white" fill-opacity="0.4"/>
            </svg>
            <div class="flex flex-col-reverse lg:flex-col gap-1.5 lg:gap-0">
                <p class="text-white text-sm font-bold font-bold font-second">${post.post_location_type} • ${post.post_location}</p>
                <p class="font-second text-white-60 text-xs font-medium">Location</p>
            </div>
        </div>
        <div class="flex flex-col gap-1 p-3 lg:p-0 bg-[#2A2A2A] lg:bg-transparent rounded-lg lg:rounded-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="white" fill-opacity="0.4"/>
                <circle cx="12" cy="12" r="10" stroke="#2A2A2A"/>
                <path d="M6.68188 15H7.83032V12.1597H9.40942L10.9167 15H12.2395L10.5835 11.9854C11.4705 11.6829 12.019 10.8831 12.019 9.87817V9.86792C12.019 8.47852 11.0654 7.60181 9.55298 7.60181H6.68188V15ZM7.83032 11.2163V8.56567H9.40942C10.2913 8.56567 10.8347 9.05786 10.8347 9.87817V9.88843C10.8347 10.7292 10.3271 11.2163 9.44019 11.2163H7.83032Z" fill="#2A2A2A"/>
                <path d="M12.9983 16.7944H14.1057V14.0925H14.1313C14.4492 14.718 15.0696 15.1077 15.8335 15.1077C17.187 15.1077 18.074 14.0259 18.074 12.3083V12.3032C18.074 10.5806 17.1921 9.50391 15.8181 9.50391C15.0491 9.50391 14.4543 9.89355 14.1313 10.5344H14.1057V9.60645H12.9983V16.7944ZM15.531 14.1541C14.6953 14.1541 14.1006 13.426 14.1006 12.3083V12.3032C14.1006 11.1804 14.6902 10.4524 15.531 10.4524C16.3975 10.4524 16.946 11.1548 16.946 12.3032V12.3083C16.946 13.4465 16.4026 14.1541 15.531 14.1541Z" fill="#2A2A2A"/>
            </svg>
            <div class="flex flex-col-reverse lg:flex-col gap-1.5 lg:gap-0">
                <p class="text-white text-sm font-bold font-bold font-second">${post.post_thp}</p>
                <p class="font-second text-white-60 text-xs font-medium">Take-home Pay</p>
            </div>
        </div>
        <div class="flex flex-col gap-1 p-3 lg:p-0 bg-[#2A2A2A] lg:bg-transparent rounded-lg lg:rounded-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15.3 16.7L16.7 15.3L13 11.6V7H11V12.4L15.3 16.7ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22Z" fill="white" fill-opacity="0.4"/>
            </svg>
            <div class="flex flex-col-reverse lg:flex-col gap-1.5 lg:gap-0">
                <p class="text-white text-sm font-bold font-bold font-second">${post.post_work_time} • ${post.post_work_time_perweek}/week</p>
                <p class="font-second text-white-60 text-xs font-medium">Work Time</p>
            </div>
        </div>
        <div class="flex flex-col gap-1 p-3 lg:p-0 bg-[#2A2A2A] lg:bg-transparent rounded-lg lg:rounded-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19.65 20.35L20.35 19.65L18.5 17.8V15H17.5V18.2L19.65 20.35ZM10 6H14V4H10V6ZM18 23C16.6167 23 15.4375 22.5125 14.4625 21.5375C13.4875 20.5625 13 19.3833 13 18C13 16.6167 13.4875 15.4375 14.4625 14.4625C15.4375 13.4875 16.6167 13 18 13C19.3833 13 20.5625 13.4875 21.5375 14.4625C22.5125 15.4375 23 16.6167 23 18C23 19.3833 22.5125 20.5625 21.5375 21.5375C20.5625 22.5125 19.3833 23 18 23ZM4 21C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V8C2 7.45 2.19583 6.97917 2.5875 6.5875C2.97917 6.19583 3.45 6 4 6H8V4C8 3.45 8.19583 2.97917 8.5875 2.5875C8.97917 2.19583 9.45 2 10 2H14C14.55 2 15.0208 2.19583 15.4125 2.5875C15.8042 2.97917 16 3.45 16 4V6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V12.275C21.4167 11.8583 20.7833 11.5417 20.1 11.325C19.4167 11.1083 18.7167 11 18 11C16.0667 11 14.4167 11.6833 13.05 13.05C11.6833 14.4167 11 16.0667 11 18C11 18.5167 11.0542 19.0292 11.1625 19.5375C11.2708 20.0458 11.4417 20.5333 11.675 21H4Z" fill="#7F7F7F"/>
            </svg>
            <div class="flex flex-col-reverse lg:flex-col gap-1.5 lg:gap-0">
                <p class="text-white text-sm font-bold font-bold font-second">${post.post_contract_duration}</p>
                <p class="font-second text-white-60 text-xs font-medium">Duration</p>
            </div>
        </div>
    </div>
    `
}

function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Dapat ditambahkan 1 karena bulan dimulai dari 0.
    const day = String(today.getDate()).padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

function addCard(post){
    const EXTERNAL = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.33333 14C2.96667 14 2.65278 13.8694 2.39167 13.6083C2.13056 13.3472 2 13.0333 2 12.6667V3.33333C2 2.96667 2.13056 2.65278 2.39167 2.39167C2.65278 2.13056 2.96667 2 3.33333 2H7.33333C7.52222 2 7.68056 2.06389 7.80833 2.19167C7.93611 2.31944 8 2.47778 8 2.66667C8 2.85556 7.93611 3.01389 7.80833 3.14167C7.68056 3.26944 7.52222 3.33333 7.33333 3.33333H3.33333V12.6667H12.6667V8.66667C12.6667 8.47778 12.7306 8.31944 12.8583 8.19167C12.9861 8.06389 13.1444 8 13.3333 8C13.5222 8 13.6806 8.06389 13.8083 8.19167C13.9361 8.31944 14 8.47778 14 8.66667V12.6667C14 13.0333 13.8694 13.3472 13.6083 13.6083C13.3472 13.8694 13.0333 14 12.6667 14H3.33333ZM12.6667 4.26667L6.93333 10C6.81111 10.1222 6.65556 10.1833 6.46667 10.1833C6.27778 10.1833 6.12222 10.1222 6 10C5.87778 9.87778 5.81667 9.72222 5.81667 9.53333C5.81667 9.34444 5.87778 9.18889 6 9.06667L11.7333 3.33333H10C9.81111 3.33333 9.65278 3.26944 9.525 3.14167C9.39722 3.01389 9.33333 2.85556 9.33333 2.66667C9.33333 2.47778 9.39722 2.31944 9.525 2.19167C9.65278 2.06389 9.81111 2 10 2H14V6C14 6.18889 13.9361 6.34722 13.8083 6.475C13.6806 6.60278 13.5222 6.66667 13.3333 6.66667C13.1444 6.66667 12.9861 6.60278 12.8583 6.475C12.7306 6.34722 12.6667 6.18889 12.6667 6V4.26667Z" fill="#3DD1DB"/></svg>`
    const SAVED_ID = post.saved.map(save => save.id)
    let USER_ID = $("#user_id").text()

    let nolove = `<input name="loved" type="checkbox" value="" class="sr-only peer card-love">
                    <img src="/img/Nolove.png" alt="" class="cursor-pointer">`
    let withlove = `<input name="loved" type="checkbox" value="" class="sr-only peer card-love" checked>
                    <img src="/img/Loved.png" alt="" class="cursor-pointer">`
    let verified = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4.49998 12.8333L2.43332 12.4166C2.31109 12.3944 2.20832 12.3305 2.12498 12.225C2.04165 12.1194 2.01109 12 2.03332 11.8666L2.26665 9.86664L0.949984 8.33331C0.861095 8.24442 0.81665 8.13331 0.81665 7.99998C0.81665 7.86664 0.861095 7.75553 0.949984 7.66664L2.26665 6.14998L2.03332 4.14998C2.01109 4.01664 2.04165 3.8972 2.12498 3.79164C2.20832 3.68609 2.31109 3.6222 2.43332 3.59998L4.49998 3.18331L5.53332 1.39998C5.59998 1.28886 5.69443 1.21109 5.81665 1.16664C5.93887 1.1222 6.06109 1.12775 6.18332 1.18331L7.99998 2.03331L9.81665 1.18331C9.93887 1.12775 10.0639 1.11664 10.1916 1.14998C10.3194 1.18331 10.4111 1.26109 10.4666 1.38331L11.5166 3.18331L13.5666 3.59998C13.6889 3.6222 13.7916 3.68609 13.875 3.79164C13.9583 3.8972 13.9889 4.01664 13.9667 4.14998L13.7333 6.14998L15.05 7.66664C15.1389 7.75553 15.1833 7.86664 15.1833 7.99998C15.1833 8.13331 15.1389 8.24442 15.05 8.33331L13.7333 9.86664L13.9667 11.8666C13.9889 12 13.9583 12.1194 13.875 12.225C13.7916 12.3305 13.6889 12.3944 13.5666 12.4166L11.5166 12.8333L10.4666 14.6166C10.4111 14.7389 10.3194 14.8166 10.1916 14.85C10.0639 14.8833 9.93887 14.8722 9.81665 14.8166L7.99998 13.9666L6.18332 14.8166C6.06109 14.8722 5.93887 14.8778 5.81665 14.8333C5.69443 14.7889 5.59998 14.7111 5.53332 14.6L4.49998 12.8333ZM6.93332 9.86664C7.03332 9.96664 7.14998 10.0166 7.28332 10.0166C7.41665 10.0166 7.53332 9.96664 7.63332 9.86664L10.7167 6.81664C10.8055 6.72775 10.8472 6.61386 10.8417 6.47498C10.8361 6.33609 10.7833 6.21664 10.6833 6.11664C10.5833 6.01664 10.4639 5.96942 10.325 5.97498C10.1861 5.98053 10.0611 6.03331 9.94998 6.13331L7.28332 8.78331L6.06665 7.49998C5.96665 7.38886 5.84165 7.33609 5.69165 7.34164C5.54165 7.3472 5.41665 7.40553 5.31665 7.51664C5.21665 7.62775 5.16387 7.75553 5.15832 7.89998C5.15276 8.04442 5.20554 8.16664 5.31665 8.26664L6.93332 9.86664Z" fill="#3DD1DB"/>
                    </svg>`

    return `
    <a href=${post.post_mode == "External" ? `/posts/redirect/${post.id}` : `/posts/${post.id}`}>
        <div class="bg-card-grey hover:bg-[#3b3b3b] rounded-lg p-3">
            <div class="flex gap-3">
                <div class="min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] rounded-lg overflow-hidden bg-white">
                    <img src="${post.recruiter[0].rec_org_logo}" alt="" class="w-full h-full object-cover">
                </div>
                <div class="head">
                    <p id="card-post-position" class="text-white text-base font-extrabold">${post.post_position}</p>
                    <div class="flex items-center gap-2">
                        <p class="flex items-center gap-1 text-xs font-second font-bold text-white-60"><span id="card-post-org">${post.recruiter[0].rec_org_name.length < 10 ? post.recruiter[0].rec_org_name : post.recruiter[0].rec_org_name.slice(0,10) + ".."}</span>${post.recruiter[0].rec_verified ? verified : ""} ${post.post_mode == "External" ? EXTERNAL : ""}</p>
                        <p class="font-second text-xs text-white-60 font-medium">-</p>
                        <p class="font-second text-xs text-white-60 font-medium">Resp. Time ~3.1 days</p>
                    </div>
                </div>
            </div>
            <div class="status my-3">
                <p class="text-[#FC4545] bg-[#DB3D3D]/20 py-[2px] px-2 inline cursor-default text-xs font-second font-medium">INTERNSHIP</p>
            </div>
            <div class="description flex flex-col gap-2">
                <p class="flex items-center gap-3 text-white-60 font-second text-xs font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 14V4.66667H4.66667V2H11.3333V7.33333H14V14H8.66667V11.3333H7.33333V14H2ZM3.33333 12.6667H4.66667V11.3333H3.33333V12.6667ZM3.33333 10H4.66667V8.66667H3.33333V10ZM3.33333 7.33333H4.66667V6H3.33333V7.33333ZM6 10H7.33333V8.66667H6V10ZM6 7.33333H7.33333V6H6V7.33333ZM6 4.66667H7.33333V3.33333H6V4.66667ZM8.66667 10H10V8.66667H8.66667V10ZM8.66667 7.33333H10V6H8.66667V7.33333ZM8.66667 4.66667H10V3.33333H8.66667V4.66667ZM11.3333 12.6667H12.6667V11.3333H11.3333V12.6667ZM11.3333 10H12.6667V8.66667H11.3333V10Z" fill="white" fill-opacity="0.4"/>
                </svg>${post.post_location_type} • ${post.post_location}</p>
                <p class="flex items-center gap-3 text-white-60 font-second text-xs font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.2 11.1333L11.1334 10.2L8.66671 7.73331V4.66665H7.33337V8.26665L10.2 11.1333ZM8.00004 14.6666C7.07782 14.6666 6.21115 14.4916 5.40004 14.1416C4.58893 13.7916 3.88337 13.3166 3.28337 12.7166C2.68337 12.1166 2.20837 11.4111 1.85837 10.6C1.50837 9.78887 1.33337 8.9222 1.33337 7.99998C1.33337 7.07776 1.50837 6.21109 1.85837 5.39998C2.20837 4.58887 2.68337 3.88331 3.28337 3.28331C3.88337 2.68331 4.58893 2.20831 5.40004 1.85831C6.21115 1.50831 7.07782 1.33331 8.00004 1.33331C8.92226 1.33331 9.78893 1.50831 10.6 1.85831C11.4112 2.20831 12.1167 2.68331 12.7167 3.28331C13.3167 3.88331 13.7917 4.58887 14.1417 5.39998C14.4917 6.21109 14.6667 7.07776 14.6667 7.99998C14.6667 8.9222 14.4917 9.78887 14.1417 10.6C13.7917 11.4111 13.3167 12.1166 12.7167 12.7166C12.1167 13.3166 11.4112 13.7916 10.6 14.1416C9.78893 14.4916 8.92226 14.6666 8.00004 14.6666Z" fill="white" fill-opacity="0.4"/>
                </svg>${post.post_work_time} • ${post.post_work_time_perweek} work week</p>
                <p class="flex items-center gap-3 text-white-60 font-second text-xs font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="white" fill-opacity="0.4"/>
                    <circle cx="8" cy="8" r="6.5" stroke="#2A2A2A"/>
                    <path d="M4.45459 10H5.22021V8.10645H6.27295L7.27783 10H8.15967L7.05566 7.99023C7.64697 7.78857 8.0127 7.25537 8.0127 6.58545V6.57861C8.0127 5.65234 7.37695 5.06787 6.36865 5.06787H4.45459V10ZM5.22021 7.47754V5.71045H6.27295C6.86084 5.71045 7.22314 6.03857 7.22314 6.58545V6.59229C7.22314 7.15283 6.88477 7.47754 6.29346 7.47754H5.22021Z" fill="#2A2A2A"/>
                    <path d="M8.66553 11.1963H9.40381V9.39502H9.4209C9.63281 9.81201 10.0464 10.0718 10.5557 10.0718C11.458 10.0718 12.0493 9.35059 12.0493 8.20557V8.20215C12.0493 7.05371 11.4614 6.33594 10.5454 6.33594C10.0327 6.33594 9.63623 6.5957 9.4209 7.02295H9.40381V6.4043H8.66553V11.1963ZM10.354 9.43604C9.79688 9.43604 9.40039 8.95068 9.40039 8.20557V8.20215C9.40039 7.45361 9.79346 6.96826 10.354 6.96826C10.9316 6.96826 11.2974 7.43652 11.2974 8.20215V8.20557C11.2974 8.96436 10.9351 9.43604 10.354 9.43604Z" fill="#2A2A2A"/>
                </svg>${post.post_thp}</p>
            </div>
            <div class="period flex justify-between items-center mt-3">
                <div class="flex gap-1">
                    <p class="text-white-80 font-second text-xs font-bold">Posted ${formatDate(post.post_postdate)}</p>
                    <p class="text-white-60 font-second text-xs font-bold">Apply before ${formatDate(post.post_deadline)}</p>
                </div>
                <form>
                    <label class="relative inline-flex items-center cursor-pointer">
                        ${SAVED_ID.includes(+USER_ID)? withlove : nolove}
                        <p id="card_id" style="display: none;">${post.id}</p>
                    </label>
                </form>
            </div>
        </div>
    </a>
    `
}

function hitungSelisihHari(inputTanggal) {
    // Mengubah input tanggal menjadi objek Date
    const targetDate = new Date(inputTanggal);
  
    // Mendapatkan tanggal saat ini
    const currentDate = new Date();
  
    // Menghitung selisih dalam milidetik
    const selisihMillis = targetDate - currentDate;
  
    // Menghitung selisih dalam hari
    const selisihHari = Math.ceil(selisihMillis / (1000 * 60 * 60 * 24));
  
    // Menentukan pesan berdasarkan selisih hari
    let pesan = '';
    if (selisihHari > 0) {
      pesan = `${selisihHari} days left`;
    } else if (selisihHari === 0) {
      pesan = 'Today';
    } else {
      pesan = `${Math.abs(selisihHari)} days ago`;
    }
  
    return pesan;
}