document.title = "Offered Applicants - Hup Indonesia!";

let RECRUITER_ID
let COMPLETION_COUNT = 0
const USER_ID = $("#user_id").text()
const pathSegments = window.location.href.split('/');
const URL_ID = pathSegments[pathSegments.indexOf('applicants') + 1]

$(".navbar-post").addClass("selected")

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

    if(APPLICANTS_OFFERED.length !== 0){
        $("#applicants-list").html("")
        APPLICANTS_OFFERED.forEach(applicants => {
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

$("#applicants-list").on("click", ".button-offering-status", function(){
    $("#popup").removeClass("hidden")
    $("#popup-offering-status").removeClass("hidden")
    let SEEKERPOSTTID = $(this).parent().find(".seekerpost-id").text()
    $.get(`/api/v1/seekerpost/${SEEKERPOSTTID}`, async (seekerpostData) => {
        updateSeekerData(`form-offering-status`, `/api/v1/seekerpost/offering/${seekerpostData.datas.Offering.id}`, "PUT")
    })
})

$("#popup").click(function(event){
    if($(event.target).is("#popup")){
        $("#popup").addClass("hidden")
        $("#popup-offering-status").addClass("hidden")
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

function applicantsCard(applicants, seekerpost){

    console.log(seekerpost.Offering.offeringStatus);
    if(seekerpost.Offering.offeringStatus){
        $(`input[value=${seekerpost.Offering.offeringStatus}]`).prop("checked", true)
    }

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
        <p><input type="checkbox" name="${applicants.SeekerPost.id}" id="" class="applicant-checkbox bg-transparent rounded focus:ring-0"></p>
        <div class="w-[24px] h-[24px] rounded-full overflow-hidden bg-gray-200 object-cover">
            <img id="post-img" src="${applicants.profile_picture}" alt="" class="w-full h-full object-cover">
        </div>
        <a target="_blank" href="/recruiter/applicants/${URL_ID}/seeker/${applicants.id}" class="hover:underline font-bold">${applicants.first_name} ${applicants.last_name}</a>
        <p class="${seekerpost.Offering.offeringStatus? "text-white":"text-red-500"} interview-date">${seekerpost.Offering.offeringStatus ? seekerpost.Offering.offeringStatus : "Not Sent"}</p>
        <p>${total_experiences} months</p>
        <p>${applicants.educations.length !== 0 ? applicants.educations[0].edu_program : "No Education"} <br> <span class="text-xs text-white-60">${applicants.educations.length !== 0 ? applicants.educations[0].edu_institution : "-"}</span></p>
        <p>Freshgraduate</p>
        <form class="flex gap-1 items-center opacity-0 group-hover:opacity-100">
            <p class="hidden seeker-id">${applicants.id}</p>
            <p class="hidden seekerpost-id">${applicants.SeekerPost.id}</p>
            <button type="button" class="button-offering-status px-1 py-1 w-[24px] h-[24px] bg-teal-100 rounded-lg font-second text-sm font-normal text-[#FC4545] flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2.66667 14C2.47778 14 2.31944 13.9361 2.19167 13.8083C2.06389 13.6806 2 13.5222 2 13.3333V11.7167C2 11.5389 2.03333 11.3694 2.1 11.2083C2.16667 11.0472 2.26111 10.9056 2.38333 10.7833L10.8 2.38333C10.9222 2.26111 11.0667 2.16667 11.2333 2.1C11.4 2.03333 11.5722 2 11.75 2C11.9278 2 12.0972 2.03333 12.2583 2.1C12.4194 2.16667 12.5667 2.26667 12.7 2.4L13.6167 3.33333C13.75 3.45556 13.8472 3.59722 13.9083 3.75833C13.9694 3.91944 14 4.08889 14 4.26667C14 4.43333 13.9694 4.6 13.9083 4.76667C13.8472 4.93333 13.75 5.08333 13.6167 5.21667L5.21667 13.6167C5.09444 13.7389 4.95278 13.8333 4.79167 13.9C4.63056 13.9667 4.46111 14 4.28333 14H2.66667ZM11.7333 5.2L12.6667 4.26667L11.7333 3.33333L10.8 4.26667L11.7333 5.2Z" fill="#243031"/>
            </svg></button>
            <button type="button" class="button-reject w-[24px] h-[24px] px-1 py-1 bg-[#FC4545]/20 rounded-lg font-second text-sm font-normal text-[#FC4545] flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.33332 15.8334L4.16666 14.6667L8.83332 10L4.16666 5.33335L5.33332 4.16669L9.99999 8.83335L14.6667 4.16669L15.8333 5.33335L11.1667 10L15.8333 14.6667L14.6667 15.8334L9.99999 11.1667L5.33332 15.8334Z" fill="#FC4545"/>
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