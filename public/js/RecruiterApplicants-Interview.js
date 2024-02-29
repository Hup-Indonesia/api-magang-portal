document.title = "Interview Applicants - Hup Indonesia!";

let RECRUITER_ID
let COMPLETION_COUNT = 0
const USER_ID = $("#user_id").text()
const pathSegments = window.location.href.split('/');
const URL_ID = pathSegments[pathSegments.indexOf('applicants') + 1]

$.get(`/api/v1/seeker/${USER_ID}`, async (seekerData) => {
    RECRUITER_ID = seekerData.recruiter.id
    $.get(`/api/v1/recruiter/${RECRUITER_ID}`, async (recruiterData) => {
        if(recruiterData.rec_verified) $("#verified").removeClass("hidden")
        $("#org-name").text(recruiterData.rec_org_name)

        if(recruiterData.rec_org_logo){
            $("#org-logo").attr("src", recruiterData.rec_org_logo);
        }

        updateSeekerData("form-add-post", `/api/v1/recruiter/${RECRUITER_ID}/post`, "POST")
    })
})




$.get(`/api/v1/posts/${URL_ID}`, async (postId) => {
    const POST = postId.datas;
    $("#org-position").text(POST.post_position)
    $("#menu-waiting").prop("href",`/recruiter/applicants/${POST.id}/waiting`)
    $("#menu-shortlisted").prop("href",`/recruiter/applicants/${POST.id}/shortlisted`)
    $("#menu-interview").prop("href",`/recruiter/applicants/${POST.id}/interview`)
    $("#menu-offering").prop("href",`/recruiter/applicants/${POST.id}/offering`)
    $("#menu-rejected").prop("href",`/recruiter/applicants/${POST.id}/rejected`)

    const APPLICANTS_WAITING = POST.applicants.filter(applicant => {
        return applicant.SeekerPost.applicantStatus == "Waiting"
    })
    const APPLICANTS_REVIEWED = POST.applicants.filter(applicant => {
        return applicant.SeekerPost.applicantStatus == "Reviewed"
    })
    const APPLICANTS_REJECTED = POST.applicants.filter(applicant => {
        return applicant.SeekerPost.applicantStatus == "Rejected"
    })
    const APPLICANTS_OFFERED = POST.applicants.filter(applicant => {
        return applicant.SeekerPost.applicantStatus == "Offering"
    })
    const APPLICANTS_INTERVIEW = POST.applicants.filter(applicant => {
        return applicant.SeekerPost.applicantStatus == "Scheduled"
    })

    if(APPLICANTS_INTERVIEW.length !== 0){
        $("#applicants-list").html("")
        APPLICANTS_INTERVIEW.forEach(applicants => {
            $.get(`/api/v1/seekerpost/${applicants.SeekerPost.id}`, async (seekerpostData) => {
                $("#applicants-list").append(applicantsCard(applicants, seekerpostData.datas))
            })
        });
    }

    $("#menu-waiting span").text(`(${APPLICANTS_WAITING.length})`)
    $("#menu-shortlisted span").text(`(${APPLICANTS_REVIEWED.length})`)
    $("#menu-interview span").text(`(${APPLICANTS_INTERVIEW.length})`)
    $("#menu-offering span").text(`(${APPLICANTS_OFFERED.length})`)
    $("#menu-rejected span").text(`(${APPLICANTS_REJECTED.length})`)



    $("#applicants-list").on("click", ".button-process", function(){
        // updateSeekerData($(this).parent()[0], `api/v1/seekerpost`, "PUT")
        const SEEKERPOSTID = $(this).parent().find(".seekerpost-id").text();
        const SEEKERID = $(this).parent().find(".seeker-id").text();
        $("#popup").removeClass("hidden")
        $("#popup-offering-process").removeClass("hidden")
    
        $.get(`/api/v1/seeker/${SEEKERID}`, async (seekerData) => {
            $("#form-process").submit(function(e){
                e.preventDefault();
                let formData = new FormData(this)
                formData.append("rec_org_logo", POST.recruiter[0].rec_org_logo)
                formData.append("rec_org_name", POST.recruiter[0].rec_org_name)
                formData.append("post_position", POST.post_position)
                formData.append("user_email", seekerData.email)
                $.ajax({
                    url: `/api/v1/seekerpost/${SEEKERPOSTID}`,
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
        })
    })


    $("#applicants-list").on("click", ".button-reject", function(){
        $("#popup").removeClass("hidden")
        $("#popup-offering-reject").removeClass("hidden")
        const SEEKERPOSTID = $(this).parent().find(".seekerpost-id").text();
        const SEEKERID = $(this).parent().find(".seeker-id").text();
        $.get(`/api/v1/seeker/${SEEKERID}`, async (seekerData) => {
            $("#form-reject").submit(function(e){
                e.preventDefault();
                let formData = new FormData(this)
                formData.append("applicantStatus", "Rejected")
                formData.append("rec_org_logo", POST.recruiter[0].rec_org_logo)
                formData.append("rec_org_name", POST.recruiter[0].rec_org_name)
                formData.append("post_position", POST.post_position)
                formData.append("user_email", seekerData.email)
                $.ajax({
                    url: `/api/v1/seekerpost/${SEEKERPOSTID}`,
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
        })
    })


    
    $("#process-all").click(function(){
        $("#popup").removeClass("hidden")
        $("#popup-offering-process").removeClass("hidden")

        $("#form-process").submit(function(e){
            e.preventDefault();
            let formData = new FormData(this)
            formData.append("rec_org_logo", POST.recruiter[0].rec_org_logo)
            formData.append("rec_org_name", POST.recruiter[0].rec_org_name)
            formData.append("post_position", POST.post_position)
            // formData.append("user_email", seekerData.email)

            const checkboxStatus = [];

            $(".applicant-checkbox").each(async function(){
                const SEEKERPOSTID = $(this).prop("name");
                await $.get(`/api/v1/seekerpost/${SEEKERPOSTID}`, async function(seekerpostData){
                    await $.get(`/api/v1/seeker/${seekerpostData.datas.SeekerId}`, function(seekerData){
                        formData.append("user_email", seekerData.email)
                        $.ajax({
                            url: `/api/v1/seekerpost/${SEEKERPOSTID}`,
                            type: "PUT",
                            data: formData,
                            async: false,
                            cache: false,
                            contentType: false,
                            encrypt: "multipart/form-data",
                            processData: false,
                            success: (response) => {
                                if(response.status_code == 200){
                                    console.log(response);
                                    checkboxStatus.push(true);
                                }
                            },
                            error: function (request, status, error) {
                                alert("Error!")
                            },
                        });
                    })
                })
            })

            $(document).ajaxStop(function(){
                if (checkboxStatus.length === $(".applicant-checkbox").length) {
                    location.reload();
                }
            });
        })
    })

    $("#reject-all").click(function(){
        $("#popup").removeClass("hidden")
        $("#popup-offering-reject").removeClass("hidden")
    
        $("#form-reject").submit(function(e){
            e.preventDefault();
            let formData = new FormData(this)
            formData.append("applicantStatus", "Rejected")
            formData.append("rec_org_logo", POST.recruiter[0].rec_org_logo)
            formData.append("rec_org_name", POST.recruiter[0].rec_org_name)
            formData.append("post_position", POST.post_position)
            const checkboxStatus = [];

            $(".applicant-checkbox").each(async function(){
                const SEEKERPOSTID = $(this).prop("name");
                await $.get(`/api/v1/seekerpost/${SEEKERPOSTID}`, async function(seekerpostData){
                    await $.get(`/api/v1/seeker/${seekerpostData.datas.SeekerId}`, function(seekerData){
                        formData.append("user_email", seekerData.email)
                        $.ajax({
                            url: `/api/v1/seekerpost/${SEEKERPOSTID}`,
                            type: "PUT",
                            data: formData,
                            async: false,
                            cache: false,
                            contentType: false,
                            encrypt: "multipart/form-data",
                            processData: false,
                            success: (response) => {
                                if(response.status_code == 200){
                                    console.log(response);
                                    checkboxStatus.push(true);
                                }
                            },
                            error: function (request, status, error) {
                                alert("Error!")
                            },
                        });
                    })
                })
            })

            $(document).ajaxStop(function(){
                if (checkboxStatus.length === $(".applicant-checkbox").length) {
                    location.reload();
                }
            });
        })
    })
})




$(".close-x").click(function(){
    $(this).closest('.popup').addClass("hidden")
    $(this).closest('#popup').addClass("hidden")
})

$("#applicants-list").on("click", ".button-edit-interview", function(){
    let SEEKERID = $(this).parent().find(".seeker-id").text()
    let SEEKERPOSTTID = $(this).parent().find(".seekerpost-id").text()

    $.get(`/api/v1/seekerpost/${SEEKERPOSTTID}`, async (seekerpostData) => {
        if(seekerpostData.datas.Scheduled.interviewDate){
            const [datePart, timePart] = seekerpostData.datas.Scheduled.interviewDate.split(' • '); // Memisahkan tanggal dan waktu
            const [time1Part, time2Part] = timePart.split(' - ');
            $("#popup").removeClass("hidden")
            $(".popup-edit-interview").removeClass("hidden")
            $("#form-schedule-interview input,#form-schedule-interview textarea").val("")
            $.get(`/api/v1/seeker/${SEEKERID}`, async (seekerData) => {
                $("#interview-seeker-name-edit").text(`${seekerData.first_name} ${seekerData.last_name}`)
                $("#interview-seeker-img-edit").prop("src", seekerData.profile_picture)
                $("#interviewDate").val(formatDate(datePart))
                $("#interviewStartTime").val(time1Part)
                $("#interviewEndTime").val(time2Part)
                $("input[name=interviewType]").val(seekerpostData.datas.Scheduled.interviewType)
                $("input[name=interviewLink]").val(seekerpostData.datas.Scheduled.interviewLink)
                $("textarea[name=interviewMessage]").text(seekerpostData.datas.Scheduled.interviewMessage)
                $("input[name=seeker_email]").val(seekerData.email)
            })
            updateSeekerData("form-edit-schedule-interview", `/api/v1/seekerpost/interview/${seekerpostData.datas.Scheduled.id}`, "PUT")
        }else{
            $("#popup").removeClass("hidden")
            $(".popup-create-interview").removeClass("hidden")
            $("#form-schedule-interview input,#form-schedule-interview textarea").val("")
            $.get(`/api/v1/seeker/${SEEKERID}`, async (seekerData) => {
                $("#interview-seeker-name").text(`${seekerData.first_name} ${seekerData.last_name}`)
                $("#interview-seeker-img").prop("src", seekerData.profile_picture)
                $("input[name=seeker_email]").val(seekerData.email)
            })
            updateSeekerData("form-schedule-interview", `/api/v1/seekerpost/interview/${seekerpostData.datas.Scheduled.id}`, "PUT")
        }
    })
    
})

$("#popup").click(function(event){
    if($(event.target).is("#popup")){
        $("#popup").addClass("hidden")
        $(".popup-create-interview").addClass("hidden")
        $(".popup-edit-interview").addClass("hidden")
        $("#popup-offering-reject").addClass("hidden")
        $("#popup-offering-process").addClass("hidden")

    }
})



$("#select-all").on("click", function () {
    if (this.checked) {
      // Iterate each checkbox
        $("#items-all").removeClass("hidden")
        $(":checkbox").each(function () {
            this.checked = true;
        });
    } else {
        $("#items-all").addClass("hidden")
        $(":checkbox").each(function () {
            this.checked = false;
        });
    }
});
$("#applicants-list").on("click", ".applicant-checkbox", function () {
    const anyChecked = $(".applicant-checkbox:checked").length > 0;
    anyChecked ? $("#items-all").removeClass("hidden") : $("#items-all").addClass("hidden")
});

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

function applicantsCard(applicants, seekerpost){
    let total_experiences = 0
    if(applicants.experiences.length !== 0){
        let experiences = applicants.experiences.map(exp => {
            if(!exp.exp_enddate){
                return calculateMonthDifference(exp.exp_startdate, getFormattedToday())
            }else{
                return calculateMonthDifference(exp.exp_startdate, exp.exp_enddate)
            }
        })
    
        total_experiences = experiences.reduce((a,b) => a+b)
    }

    return `
        <div class="applicants-grid text-sm px-3 py-2 text-white font-second items-center hover:bg-teal-100/10 group">
            <p><input type="checkbox" name="${seekerpost.id}" id="" class="applicant-checkbox bg-transparent rounded focus:ring-0"></p>
            <div class="w-[24px] h-[24px] rounded-full overflow-hidden bg-gray-200 object-cover">
                <img id="post-img" src="${applicants.profile_picture}" alt="" class="w-full h-full object-cover">
            </div>
            <a target="_blank" href="/recruiter/applicants/${URL_ID}/seeker/${applicants.id}" class="hover:underline font-bold">${applicants.first_name} ${applicants.last_name}</a>
            <p class="${seekerpost.Scheduled.interviewDate? "text-white":"text-red-500"} interview-date">${seekerpost.Scheduled.interviewDate ? seekerpost.Scheduled.interviewDate : "No Date"}</p>
            <p>${total_experiences} months</p>
            <p>${applicants.educations.length !== 0 ? applicants.educations[0].edu_program : "No Education"} <br> <span class="text-xs text-white-60">${applicants.educations.length !== 0 ? applicants.educations[0].edu_institution : "-"}</span></p>
            <p>Freshgraduate</p>
            <form class="flex gap-1 items-center opacity-0 group-hover:opacity-100">
                <p class="hidden seeker-id">${applicants.id}</p>
                <p class="hidden seekerpost-id">${seekerpost.id}</p>
                <button type="button" class="button-edit-interview px-1 py-1 w-[24px] h-[24px] bg-teal-100 rounded-lg font-second text-sm font-normal text-[#FC4545] flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3.33333 14.6667C2.96667 14.6667 2.65278 14.5361 2.39167 14.275C2.13056 14.0139 2 13.7 2 13.3333V4.00001C2 3.63334 2.13056 3.31945 2.39167 3.05834C2.65278 2.79723 2.96667 2.66668 3.33333 2.66668H4V2.00001C4 1.81112 4.06389 1.65279 4.19167 1.52501C4.31944 1.39723 4.47778 1.33334 4.66667 1.33334C4.85556 1.33334 5.01389 1.39723 5.14167 1.52501C5.26944 1.65279 5.33333 1.81112 5.33333 2.00001V2.66668H10.6667V2.00001C10.6667 1.81112 10.7306 1.65279 10.8583 1.52501C10.9861 1.39723 11.1444 1.33334 11.3333 1.33334C11.5222 1.33334 11.6806 1.39723 11.8083 1.52501C11.9361 1.65279 12 1.81112 12 2.00001V2.66668H12.6667C13.0333 2.66668 13.3472 2.79723 13.6083 3.05834C13.8694 3.31945 14 3.63334 14 4.00001V6.68334C14 6.87223 13.9361 7.03057 13.8083 7.15834C13.6806 7.28612 13.5222 7.35001 13.3333 7.35001C13.1444 7.35001 12.9861 7.28612 12.8583 7.15834C12.7306 7.03057 12.6667 6.87223 12.6667 6.68334V6.66668H3.33333V13.3333H7.33333C7.52222 13.3333 7.68056 13.3972 7.80833 13.525C7.93611 13.6528 8 13.8111 8 14C8 14.1889 7.93611 14.3472 7.80833 14.475C7.68056 14.6028 7.52222 14.6667 7.33333 14.6667H3.33333ZM9.33333 14V12.9C9.33333 12.8111 9.35 12.725 9.38333 12.6417C9.41667 12.5583 9.46667 12.4833 9.53333 12.4167L13.0167 8.95001C13.1167 8.85001 13.2278 8.77779 13.35 8.73334C13.4722 8.6889 13.5944 8.66668 13.7167 8.66668C13.85 8.66668 13.9778 8.69168 14.1 8.74168C14.2222 8.79168 14.3333 8.86668 14.4333 8.96668L15.05 9.58334C15.1389 9.68334 15.2083 9.79446 15.2583 9.91668C15.3083 10.0389 15.3333 10.1611 15.3333 10.2833C15.3333 10.4056 15.3111 10.5306 15.2667 10.6583C15.2222 10.7861 15.15 10.9 15.05 11L11.5833 14.4667C11.5167 14.5333 11.4417 14.5833 11.3583 14.6167C11.275 14.65 11.1889 14.6667 11.1 14.6667H10C9.81111 14.6667 9.65278 14.6028 9.525 14.475C9.39722 14.3472 9.33333 14.1889 9.33333 14ZM13.7167 10.9333L14.3333 10.2833L13.7167 9.66668L13.0833 10.3L13.7167 10.9333Z" fill="#243031"/>
                    </svg></button>
                <button type="button" class="button-reject w-[24px] h-[24px] px-1 py-1 bg-[#FC4545]/20 rounded-lg font-second text-sm font-normal text-[#FC4545] flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5.33332 15.8334L4.16666 14.6667L8.83332 10L4.16666 5.33335L5.33332 4.16669L9.99999 8.83335L14.6667 4.16669L15.8333 5.33335L11.1667 10L15.8333 14.6667L14.6667 15.8334L9.99999 11.1667L5.33332 15.8334Z" fill="#FC4545"/>
                    </svg></button>
                <button type="button" class="button-process w-[24px] h-[24px] px-1 py-1 bg-[#2BDE68]/20 rounded-lg font-second text-sm font-normal text-[#2BDE68] flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.95834 15L3.20834 10.25L4.39584 9.06252L7.95834 12.625L15.6042 4.97919L16.7917 6.16669L7.95834 15Z" fill="#2BDE68"/>
                    </svg></button>
            </form>
        </div>
    `
}

function getFormattedToday() {
    const today = new Date();
  
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
  
    // Padding digit bulan dan tanggal dengan '0' jika diperlukan
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
  
    // Menggabungkan tahun, bulan, dan tanggal dengan format yang diinginkan
    const formattedToday = `${year}-${month}-${day}`;
  
    return formattedToday;
}

function calculateMonthDifference(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);

    let totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    return totalMonths;
}

function formatDate(dateString) {
    const [day, month, year] = dateString.split(' ');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = months.indexOf(month) + 1;
  
    return `${year}-${monthIndex.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  