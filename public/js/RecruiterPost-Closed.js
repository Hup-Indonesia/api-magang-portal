document.title = "Recruiter Posts - Hup Indonesia!";

let RECRUITER_ID
let COMPLETION_COUNT = 0
const USER_ID = $("#user_id").text()

$.get(`/api/v1/seeker/${USER_ID}`, async (seekerData) => {
    RECRUITER_ID = seekerData.recruiter.id

    $.get(`/api/v1/recruiter/${RECRUITER_ID}`, async (recruiterData) => {

        if(recruiterData.rec_verified) $("#verified").removeClass("hidden")
        
        const RECRUITER_POST_INPROGRESS = recruiterData.posts.filter(post => {
            return post.post_status == "IN-PROGRESS"
        })
        const RECRUITER_POST_CLOSED = recruiterData.posts.filter(post => {
            return post.post_status == "CLOSED"
        })

        if(recruiterData.rec_org_logo){
            $("#nav-allpost").text(`(${recruiterData.posts.length})`)
            $("#nav_inprogress").text(`(${RECRUITER_POST_INPROGRESS.length})`)
        }


        $(".close-x").click(function(){
            $(this).closest('.popup').addClass("hidden")
            $(this).closest('#popup').addClass("hidden")
            $("body").removeClass('no-scroll');
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
            $("#card-post-org").text(recruiterData.rec_org_name.length < 15 ? recruiterData.rec_org_name : recruiterData.rec_org_name.slice(0,15) + "..")
            if(recruiterData.rec_org_logo){
                $("#card-post-photo").prop('src', recruiterData.rec_org_logo)
            }
            $(".popup-create-post .card-status").text($("select[name=post_type]").val().toUpperCase())
            $("#card-post-location").text(`${$("select[name=post_location_type]").val()} • ${$("input[name=post_location]").val()}`)
            $("#card-post-worktime").text(`${$("select[name=post_work_time]").val()} • ${$("select[name=post_work_time_perweek]").val()} work week`)
            if($("input[name=post_thp_min]").val() && $("input[name=post_thp_max]").val()) $("#card-post-salary").text(`Rp.${$("input[name=post_thp_min]").val()}-Rp.${$("input[name=post_thp_max]").val()}`)
            if($("input[name=post_thp_min]").val() && !$("input[name=post_thp_max]").val()) $("#card-post-salary").text(`Rp.${$("input[name=post_thp_min]").val()}+`)
            if(!$("input[name=post_thp_min]").val() && $("input[name=post_thp_max]").val()) $("#card-post-salary").text(`Rp.0-Rp.${$("input[name=post_thp_max]").val()}`)
            
            if($("#popup-thp-type").val() == "Undisclosed") $("#card-post-salary").text(`Undisclosed`)

            $("#post-applied-before").text(`Apply before ${formatDate($("input[name=post_deadline]").val())}`)
            $("#popup-recruiter-bar-text").text(`${(body_percent_idx+1) * 25}%`)
            $("#popup-recruiter-bar-progress").css("width", `${(body_percent_idx+1) * 25}%`)
        })

        $(".button-next-popup").click(function(){
            let body_percent_idx = $(".popup-edit-post .body-percent").index($(this).closest(".body-percent"))
            // console.log(body_percent_idx);
            $(".popup-edit-post .body-percent").eq(body_percent_idx).addClass("hidden")
            $(".popup-edit-post .body-percent").eq(body_percent_idx+1).removeClass("hidden")
    
            $(".popup-edit-post #card-post-position").text($(".popup-edit-post input[name=post_position]").val())
            $(".popup-edit-post #card-post-org").text(recruiterData.rec_org_name.length < 15 ? recruiterData.rec_org_name : recruiterData.rec_org_name.slice(0,15) + "..")
            if(recruiterData.rec_org_logo){
                $(".popup-edit-post #card-post-photo").prop('src', recruiterData.rec_org_logo)
            }
            $(".popup-edit-post .card-status").text($(".popup-edit-post select[name=post_type]").val().toUpperCase())
            $(".popup-edit-post #card-post-location").text(`${$(".popup-edit-post select[name=post_location_type]").val()} • ${$(".popup-edit-post input[name=post_location]").val()}`)
            $(".popup-edit-post #card-post-worktime").text(`${$(".popup-edit-post select[name=post_work_time]").val()} • ${$(".popup-edit-post select[name=post_work_time_perweek]").val()} work week`)
            if($(".popup-edit-post input[name=post_thp_min]").val() && $(".popup-edit-post input[name=post_thp_max]").val()) $(".popup-edit-post #card-post-salary").text(`Rp.${$(".popup-edit-post input[name=post_thp_min]").val()}-Rp.${$(".popup-edit-post input[name=post_thp_max]").val()}`)
            if($(".popup-edit-post input[name=post_thp_min]").val() && !$(".popup-edit-post input[name=post_thp_max]").val()) $(".popup-edit-post #card-post-salary").text(`Rp.${$(".popup-edit-post input[name=post_thp_min]").val()}+`)
            if(!$(".popup-edit-post input[name=post_thp_min]").val() && $(".popup-edit-post input[name=post_thp_max]").val()) $(".popup-edit-post #card-post-salary").text(`Rp.0-Rp.${$(".popup-edit-post input[name=post_thp_max]").val()}`)
            if(!$(".popup-edit-post input[name=post_thp_min]").val() && !$(".popup-edit-post input[name=post_thp_max]").val()) $(".popup-edit-post #card-post-salary").text(`Undisclosed`)
            $(".popup-edit-post #post-applied-before").text(`Apply before ${formatDate($(".popup-edit-post input[name=post_deadline]").val())}`)
            $(".popup-edit-post #popup-recruiter-bar-text").text(`${(body_percent_idx+1) * 25}%`)
            $(".popup-edit-post #popup-recruiter-bar-progress").css("width", `${(body_percent_idx+1) * 25}%`)
        })

        if(RECRUITER_POST_CLOSED.length !== 0){
            $("#posts-box").remove()
            $("#posts-grid").removeClass("hidden")
            RECRUITER_POST_CLOSED.forEach((data) => {
                $("#posts-left").append(postLeftDetail(data))
                $("#posts-right").append(postRightDetail(data, recruiterData))
            })
            $(".posts-detailed").eq(0).removeClass("hidden")
            $(".post-left-choose").eq(0).addClass("border-teal-100 bg-teal-8")
        }

        $("#posts-grid").on("click",".post-left-choose", function(){
            const post_left_active = $(this).index();
            $(".posts-detailed").each(function(){
                $(this).addClass("hidden")
            })
            $(".post-left-choose").each(function(){
                $(this).removeClass("border-teal-100 bg-teal-8")
            })
            $(".posts-detailed").eq(post_left_active).removeClass("hidden")
            $(this).addClass("border border-teal-100 bg-teal-8")
        })

        $(".post-status").each(function(){
            const POST_STATUS = $(this).parent().find("span")
            const POST_TOGGLE = $(this)
            if(POST_STATUS.text() == "CLOSED"){
                POST_TOGGLE.prop("checked", false)
                POST_STATUS.removeClass("text-green-500").addClass("text-red-500")
            }
        })

        $(".copy-link").click(function(){
            const POST_ID = $(this).closest(".posts-detailed").find(".post-id").text()
            const URL = `${window.location.origin}/posts/${POST_ID}`
            navigator.clipboard.writeText(URL).then(function() {
                $("#popup-copylink").removeClass("invisible")
                setTimeout(function() {
                    $("#popup-copylink").addClass("invisible");
                }, 2500);
            }, function() {
                alert('Copy error')
            });
        })


        updateSeekerData("form-add-post", `/api/v1/recruiter/${RECRUITER_ID}/post`, "POST")

    })
})

// $("#post-basic-info").find('input[required]').on("input", function(){
//     let allRequiredFilled = true;

//     // Periksa setiap elemen required
//     $("#post-basic-info input[required]").each(function() {
//         if ($(this).val() == '') {
//             allRequiredFilled = false;
//             return false; // Keluar dari loop jika ada input yang kosong
//         }
//     });

//     // Aktifkan tombol jika semua required telah diisi
//     if (allRequiredFilled) {
//         $('#button-next-post-basic').prop('disabled', false);
//     } else {
//         $('#button-next-post-basic').prop('disabled', true);
//     }
// })
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


$('input[name=post_thp_max], input[name=post_thp_min]').on('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Hanya menerima angka
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Format ribuan
    $(this).val(value);
});
$("#popup-thp-type").change(function(){
    $('#thp_max, #thp_min').val("")
})


$("#posts-right").on("click", ".button-edit-post", function(){
    const POST_ID = $(this).closest(".job-button").find(".post-id").text()
    $("#popup").removeClass("hidden")
    $(".popup-edit-post").removeClass("hidden")
    $(".edit-post-id").text(POST_ID)

    $.get(`/api/v1/posts/${POST_ID}`, function(postData){
        postData = postData.datas;
        $(".popup-edit-post input").val("")
        $(".popup-edit-post input[name=post_position").val(postData.post_position)
        $(".popup-edit-post select[name=post_need").val(postData.post_need)
        $(".popup-edit-post select[name=post_type").val(postData.post_type)
        $(".popup-edit-post select[name=post_work_time").val(postData.post_work_time)
        $(".popup-edit-post select[name=post_work_time_perweek").val(postData.post_work_time_perweek)
        $(".popup-edit-post select[name=post_thp_type").val(postData.post_thp_type)
        $(".popup-edit-post select[name=post_location_type").val(postData.post_location_type)
        $(".popup-edit-post input[name=post_location").val(postData.post_location)
        if(postData.post_resume_req) $(".popup-edit-post input[name=post_resume_req").val("on")
        if(postData.post_portfolio_req) $(".popup-edit-post input[name=post_portfolio_req").val("on")
        $(".popup-edit-post select[name=post_contract_duration").val(postData.post_contract_duration)
        postData.post_resume_req ? $(".popup-edit-post input[name=post_resume_req").prop("checked", true).val("on") : $(".popup-edit-post input[name=post_resume_req").prop("checked", false)
        postData.post_portfolio_req ? $(".popup-edit-post input[name=post_portfolio_req").prop("checked", true).val("on") : $(".popup-edit-post input[name=post_portfolio_req").prop("checked", false)
        $(".popup-edit-post input[name=post_deadline").val(postData.post_deadline)

        let thp_type = $(".popup-edit-post select[name=post_thp_type").val()
        switch (thp_type) {
            case "Range (Min & Max)":
                $(".popup-edit-post .thp_type_min").removeClass("hidden")
                $(".popup-edit-post .thp_type_max").removeClass("hidden")
                const [lowerBound, upperBound] = postData.post_thp.split('-');
                $(".popup-edit-post input[name=post_thp_max]").val(upperBound.replace("Rp.",''))
                $(".popup-edit-post input[name=post_thp_min]").val(lowerBound.replace("Rp.",''))
                break;
            case "Maximum":
                $(".popup-edit-post .thp_type_max").removeClass("hidden")
                $(".popup-edit-post .thp_type_min").addClass("hidden")
                $(".popup-edit-post input[name=post_thp_max]").val(postData.post_thp.split('-Rp.')[1])
                break;
            case "Minimum":
                $(".popup-edit-post .thp_type_max").addClass("hidden")
                $(".popup-edit-post .thp_type_min").removeClass("hidden")
                $(".popup-edit-post input[name=post_thp_min]").val(postData.post_thp.replace('Rp.', '').replace('+', ''))
                break;
            case "Undisclosed":
                $(".popup-edit-post .thp_type_max").addClass("hidden")
                $(".popup-edit-post .thp_type_min").addClass("hidden")
                break;
        }

        $(".popup-edit-post select[name=post_thp_type]").change(function(){
            let org_size = $(".popup-edit-post select[name=post_thp_type").val()
            $(".popup-edit-post input[name=post_thp_max]").val("")
            $(".popup-edit-post input[name=post_thp_min]").val("")
            switch (org_size) {
                case "Range (Min & Max)":
                    $(".popup-edit-post .thp_type_min").removeClass("hidden")
                    $(".popup-edit-post .thp_type_max").removeClass("hidden")
                    break;
                case "Maximum":
                    $(".popup-edit-post .thp_type_max").removeClass("hidden")
                    $(".popup-edit-post .thp_type_min").addClass("hidden")
                    break;
                case "Minimum":
                    $(".popup-edit-post .thp_type_max").addClass("hidden")
                    $(".popup-edit-post .thp_type_min").removeClass("hidden")
                    break;
                case "Undisclosed":
                    $(".popup-edit-post .thp_type_max").addClass("hidden")
                    $(".popup-edit-post .thp_type_min").addClass("hidden")
                    break;
                default:
                    break;
            }
        })
        $(".popup-edit-post input[type=checkbox]").change(function(){
            if($(this).is(":checked")){
                $(this).val("on")
            }else{
                $(this).val("")
            }
        })

        $("textarea[name=post_overview]").text(postData.post_overview)
        $("textarea[name=post_responsibility]").text(postData.post_responsibility)
        $("textarea[name=post_requirement]").text(postData.post_requirement)

        
        updateSeekerData("form-edit-post", `/api/v1/recruiter/${RECRUITER_ID}/post/${postData.id}`, "PUT")
    })
})


$(".direct-list").on('keydown', function(e){
    if (e.key === 'Enter') {
    e.preventDefault(); // Mencegah newline karakter
    const text = $(this).val();
    if (text.trim() !== '') {
        $(this).val($(this).val()+'\n• ');
    }
}
})

$(".navbar-post").addClass("selected")

$("#button-create-jobpost, #button-add-post").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-create-post").removeClass("hidden")
    $(".popup-create-post input").val("")
    $(".popup-create-post textarea").text("•")
    $("body").addClass('no-scroll');
})

$("#popup-thp-type").change(function(){
    let org_size = $("#popup-thp-type").val()
    switch (org_size) {
        case "Range (Min & Max)":
            $("#thp_max").closest(".thp_type").removeClass("hidden")
            $("#thp_min").closest(".thp_type").removeClass("hidden")
            break;
        case "Maximum":
            $("#thp_max").closest(".thp_type").removeClass("hidden")
            $("#thp_min").closest(".thp_type").addClass("hidden")
            break;
        case "Minimum":
            $("#thp_max").closest(".thp_type").addClass("hidden")
            $("#thp_min").closest(".thp_type").removeClass("hidden")
            break;
        case "Undisclosed":
            $("#thp_max").closest(".thp_type").addClass("hidden")
            $("#thp_min").closest(".thp_type").addClass("hidden")
            break;
        default:
            break;
    }
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

function postLeftDetail(post){
    return`
    <div class="post-left-choose w-100 flex flex-col gap-2 p-3 border border-[#3b3b3b] rounded-lg cursor-pointer">
        <div class="flex justify-between">
            <p class="font-second text-xs font-medium text-intern-red bg-[#DB3D3D]/20 py-0.5 px-2">${post.post_type.toUpperCase()}</p>
            <div class="flex items-center gap-1.5 py-0.5 px-2 bg-[#343434] rounded-lg">
                <p class="text-white-60 font-second text-xs font-medium">${post.post_status}</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="10" viewBox="0 0 8 10" fill="none">
                    <path d="M0.666656 9.66665V0.333313L7.99999 4.99998L0.666656 9.66665Z" fill="white"/>
                </svg>
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <p class="font-extrabold text-base text-white">${post.post_position}</p>
            <div class="flex gap-1">
                <p class="text-white-80 font-bold font-second text-xs">${timeAgo(post.post_postdate)}</p>
                <p class="text-white-60 font-medium font-second text-xs">Until ${formatDate(post.post_deadline)}</p>
            </div>
        </div>
        <div class="left-post-view flex gap-3 px-2 py-1.5 bg-card-grey rounded-lg">
            <p class="flex gap-1 text-white items-center font-second font-bold text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                <path d="M0.666656 11.9667C0.666656 11.5889 0.763879 11.2417 0.958323 10.925C1.15277 10.6083 1.4111 10.3667 1.73332 10.2C2.42221 9.85556 3.12221 9.59723 3.83332 9.425C4.54443 9.25278 5.26666 9.16667 5.99999 9.16667C6.73332 9.16667 7.45555 9.25278 8.16666 9.425C8.87777 9.59723 9.57777 9.85556 10.2667 10.2C10.5889 10.3667 10.8472 10.6083 11.0417 10.925C11.2361 11.2417 11.3333 11.5889 11.3333 11.9667V12.5C11.3333 12.8667 11.2028 13.1806 10.9417 13.4417C10.6805 13.7028 10.3667 13.8333 9.99999 13.8333H1.99999C1.63332 13.8333 1.31943 13.7028 1.05832 13.4417C0.797212 13.1806 0.666656 12.8667 0.666656 12.5V11.9667ZM12.3 13.8333C12.4222 13.6333 12.5139 13.4194 12.575 13.1917C12.6361 12.9639 12.6667 12.7333 12.6667 12.5V11.8333C12.6667 11.3444 12.5305 10.875 12.2583 10.425C11.9861 9.975 11.6 9.58889 11.1 9.26667C11.6667 9.33334 12.2 9.44723 12.7 9.60834C13.2 9.76945 13.6667 9.96667 14.1 10.2C14.5 10.4222 14.8055 10.6694 15.0167 10.9417C15.2278 11.2139 15.3333 11.5111 15.3333 11.8333V12.5C15.3333 12.8667 15.2028 13.1806 14.9417 13.4417C14.6805 13.7028 14.3667 13.8333 14 13.8333H12.3ZM5.99999 8.5C5.26666 8.5 4.63888 8.23889 4.11666 7.71667C3.59443 7.19445 3.33332 6.56667 3.33332 5.83334C3.33332 5.1 3.59443 4.47223 4.11666 3.95001C4.63888 3.42778 5.26666 3.16667 5.99999 3.16667C6.73332 3.16667 7.3611 3.42778 7.88332 3.95001C8.40555 4.47223 8.66666 5.1 8.66666 5.83334C8.66666 6.56667 8.40555 7.19445 7.88332 7.71667C7.3611 8.23889 6.73332 8.5 5.99999 8.5ZM12.6667 5.83334C12.6667 6.56667 12.4055 7.19445 11.8833 7.71667C11.3611 8.23889 10.7333 8.5 9.99999 8.5C9.87777 8.5 9.72221 8.48612 9.53332 8.45834C9.34443 8.43056 9.18888 8.4 9.06666 8.36667C9.36666 8.01112 9.59721 7.61667 9.75832 7.18334C9.91943 6.75 9.99999 6.3 9.99999 5.83334C9.99999 5.36667 9.91943 4.91667 9.75832 4.48334C9.59721 4.05001 9.36666 3.65556 9.06666 3.30001C9.22221 3.24445 9.37777 3.20834 9.53332 3.19167C9.68888 3.17501 9.84443 3.16667 9.99999 3.16667C10.7333 3.16667 11.3611 3.42778 11.8833 3.95001C12.4055 4.47223 12.6667 5.1 12.6667 5.83334Z" fill="white"/>
            </svg> <span>${post.applicants.length}</span> Applicants</p>
        </div>
    </div>
    `
}

function postRightDetail(post, recruiter){
    let overview = post.post_overview.split('\n')
    let responsibility = post.post_responsibility.split('\n')
    let requirement = post.post_requirement.split('\n')
    let require_resume = `
    <div class="flex items-center gap-1 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
            <path d="M9 11C9.4125 11 9.76563 10.8531 10.0594 10.5594C10.3531 10.2656 10.5 9.9125 10.5 9.5C10.5 9.0875 10.3531 8.73437 10.0594 8.44062C9.76563 8.14687 9.4125 8 9 8C8.5875 8 8.23437 8.14687 7.94062 8.44062C7.64687 8.73437 7.5 9.0875 7.5 9.5C7.5 9.9125 7.64687 10.2656 7.94062 10.5594C8.23437 10.8531 8.5875 11 9 11ZM6 14H12V13.5687C12 13.2687 11.9187 12.9937 11.7563 12.7437C11.5938 12.4937 11.3687 12.3062 11.0812 12.1812C10.7562 12.0437 10.4219 11.9375 10.0781 11.8625C9.73438 11.7875 9.375 11.75 9 11.75C8.625 11.75 8.26562 11.7875 7.92188 11.8625C7.57812 11.9375 7.24375 12.0437 6.91875 12.1812C6.63125 12.3062 6.40625 12.4937 6.24375 12.7437C6.08125 12.9937 6 13.2687 6 13.5687V14ZM13.875 17H4.125C3.825 17 3.5625 16.8875 3.3375 16.6625C3.1125 16.4375 3 16.175 3 15.875V3.125C3 2.825 3.1125 2.5625 3.3375 2.3375C3.5625 2.1125 3.825 2 4.125 2H10.05C10.2 2 10.3469 2.03125 10.4906 2.09375C10.6344 2.15625 10.7563 2.2375 10.8563 2.3375L14.6625 6.14375C14.7625 6.24375 14.8438 6.36562 14.9062 6.50937C14.9688 6.65312 15 6.8 15 6.95V15.875C15 16.175 14.8875 16.4375 14.6625 16.6625C14.4375 16.8875 14.175 17 13.875 17Z" fill="#A5A5A5"/>
        </svg>
        <p class="font-second text-sm font-normal text-white">Resume</p>
    </div>
    `
    let require_portfolio = `
    <div class="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
            <path d="M10.6875 8.075L12 7.26875L13.3125 8.075C13.4125 8.1375 13.5094 8.14063 13.6031 8.08438C13.6969 8.02813 13.7438 7.94375 13.7438 7.83125V3.125H10.2563V7.83125C10.2563 7.94375 10.3031 8.02813 10.3969 8.08438C10.4906 8.14063 10.5875 8.1375 10.6875 8.075ZM4.875 14.75C4.575 14.75 4.3125 14.6375 4.0875 14.4125C3.8625 14.1875 3.75 13.925 3.75 13.625V3.125C3.75 2.825 3.8625 2.5625 4.0875 2.3375C4.3125 2.1125 4.575 2 4.875 2H15.375C15.675 2 15.9375 2.1125 16.1625 2.3375C16.3875 2.5625 16.5 2.825 16.5 3.125V13.625C16.5 13.925 16.3875 14.1875 16.1625 14.4125C15.9375 14.6375 15.675 14.75 15.375 14.75H4.875ZM2.625 17C2.325 17 2.0625 16.8875 1.8375 16.6625C1.6125 16.4375 1.5 16.175 1.5 15.875V4.8125C1.5 4.65 1.55313 4.51563 1.65938 4.40938C1.76563 4.30313 1.9 4.25 2.0625 4.25C2.225 4.25 2.35938 4.30313 2.46562 4.40938C2.57187 4.51563 2.625 4.65 2.625 4.8125V15.875H13.6875C13.85 15.875 13.9844 15.9281 14.0906 16.0344C14.1969 16.1406 14.25 16.275 14.25 16.4375C14.25 16.6 14.1969 16.7344 14.0906 16.8406C13.9844 16.9469 13.85 17 13.6875 17H2.625Z" fill="#AAAAAA"/>
            </svg>
        <p class="font-second text-sm font-normal text-white">Portfolio</p>
    </div>
    `
    let verified = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4.50001 12.8333L2.43335 12.4166C2.31113 12.3944 2.20835 12.3305 2.12501 12.225C2.04168 12.1194 2.01113 12 2.03335 11.8666L2.26668 9.86664L0.950014 8.33331C0.861125 8.24442 0.816681 8.13331 0.816681 7.99998C0.816681 7.86664 0.861125 7.75553 0.950014 7.66664L2.26668 6.14998L2.03335 4.14998C2.01113 4.01664 2.04168 3.8972 2.12501 3.79164C2.20835 3.68609 2.31113 3.6222 2.43335 3.59998L4.50001 3.18331L5.53335 1.39998C5.60001 1.28886 5.69446 1.21109 5.81668 1.16664C5.9389 1.1222 6.06112 1.12775 6.18335 1.18331L8.00001 2.03331L9.81668 1.18331C9.9389 1.12775 10.0639 1.11664 10.1917 1.14998C10.3195 1.18331 10.4111 1.26109 10.4667 1.38331L11.5167 3.18331L13.5667 3.59998C13.6889 3.6222 13.7917 3.68609 13.875 3.79164C13.9583 3.8972 13.9889 4.01664 13.9667 4.14998L13.7333 6.14998L15.05 7.66664C15.1389 7.75553 15.1833 7.86664 15.1833 7.99998C15.1833 8.13331 15.1389 8.24442 15.05 8.33331L13.7333 9.86664L13.9667 11.8666C13.9889 12 13.9583 12.1194 13.875 12.225C13.7917 12.3305 13.6889 12.3944 13.5667 12.4166L11.5167 12.8333L10.4667 14.6166C10.4111 14.7389 10.3195 14.8166 10.1917 14.85C10.0639 14.8833 9.9389 14.8722 9.81668 14.8166L8.00001 13.9666L6.18335 14.8166C6.06112 14.8722 5.9389 14.8778 5.81668 14.8333C5.69446 14.7889 5.60001 14.7111 5.53335 14.6L4.50001 12.8333ZM6.93335 9.86664C7.03335 9.96664 7.15001 10.0166 7.28335 10.0166C7.41668 10.0166 7.53335 9.96664 7.63335 9.86664L10.7167 6.81664C10.8056 6.72775 10.8472 6.61386 10.8417 6.47498C10.8361 6.33609 10.7833 6.21664 10.6833 6.11664C10.5833 6.01664 10.4639 5.96942 10.325 5.97498C10.1861 5.98053 10.0611 6.03331 9.95001 6.13331L7.28335 8.78331L6.06668 7.49998C5.96668 7.38886 5.84168 7.33609 5.69168 7.34164C5.54168 7.3472 5.41668 7.40553 5.31668 7.51664C5.21668 7.62775 5.1639 7.75553 5.15835 7.89998C5.15279 8.04442 5.20557 8.16664 5.31668 8.26664L6.93335 9.86664Z" fill="#3DD1DB"/>
                    </svg>`

    return`
    <div class="posts-detailed w-100 rounded-lg p-4 bg-card-grey hidden">
        <div class="flex gap-4">
            <div class="w-[60px] h-[60px] rounded-lg overflow-hidden bg-gray-200 object-cover">
                <img src="${recruiter.rec_org_logo}" alt="" class="w-full h-full object-cover">
            </div>
            <div class="">
                <div class="flex items-center gap-3 text-xl text-white font-bold">${post.post_position} <p class="font-second text-xs font-medium text-intern-red bg-[#DB3D3D]/20 py-0.5 px-2">${post.post_type.toUpperCase()}</p></div>
                <div class="flex gap-2 items-center">
                    <p class="text-white-60 font-second font-bold text-sm">${recruiter.rec_org_name}</p>
                    ${recruiter.rec_verified ? verified : ""}
                </div>
            </div>
        </div>
        <div class="mt-4 grid grid-cols-[450px_1fr] gap-3">
            <div class="job-detail w-100 flex flex-col gap-4">
                <div class="rounded-lg border-2 border-[#222] p-4">
                    <p class="text-white font-bold tracking-[1.6px] text-base mb-1">About The Job</p>
                    <p class="text-white-80 font-second text-sm font-normal leading-5">${overview.join("</br>")}
                    </p>
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
                            <p class="text-white text-sm font-bold font-bold font-second">${post.post_thp}</p>
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
                </div>
                <div class="p-4 rounded-lg border-2 border-[#222]">
                    <p class="text-white font-bold tracking-[1.6px] text-base mb-3">RESPONSIBILITIES</p>
                    <p class="font-second text-white-80 text-sm font-normal">
                        ${responsibility.join("</br>")}
                    </p>
                </div>
                <div class="p-4 rounded-lg border-2 border-[#222]">
                    <p class="text-white font-bold tracking-[1.6px] text-base mb-3">REQUIREMENTS</p>
                    <p class="font-second text-white-80 text-sm font-normal">
                        ${requirement.join("</br>")}
                    </p>
                </div>
            </div>
            <div class="job-button w-100 divide-header divide-y">
                <div class="pb-3">
                    <form id="form-update-post-status">
                        <p class="post-id" style="display: none;">${post.id}</p>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input id="post-status" name="post_status" type="checkbox" value="" class="post-status sr-only peer" checked>
                            <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                            <span id="active-post-status" class="ml-2 text-green-500 font-second text-sm font-semibold">${post.post_status}</span>
                        </label>
                    </form>
                </div>
                <div class="w-100 flex flex-col gap-2 py-4">
                    <button class="button-edit-post gap-2 flex m-auto w-full py-3 text-white font-second text-xs font-medium justify-center rounded-lg bg-[#343434]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12.8667 5.94998L10.0333 3.14998L10.9667 2.21665C11.2222 1.96109 11.5361 1.83331 11.9083 1.83331C12.2806 1.83331 12.5944 1.96109 12.85 2.21665L13.7833 3.14998C14.0389 3.40554 14.1722 3.71387 14.1833 4.07498C14.1944 4.43609 14.0722 4.74442 13.8167 4.99998L12.8667 5.94998ZM11.9 6.93331L4.83333 14H2V11.1666L9.06667 4.09998L11.9 6.93331Z" fill="white"/>
                        </svg> Edit Post</button>
                    <a terget="_blank" href="/posts/${post.id}/recruiter"><button class="gap-2 flex m-auto w-full py-3 text-white font-second text-xs font-medium justify-center rounded-lg bg-[#343434]"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                        <path d="M8.49999 10.6667C9.33332 10.6667 10.0417 10.375 10.625 9.79166C11.2083 9.20832 11.5 8.49999 11.5 7.66666C11.5 6.83332 11.2083 6.12499 10.625 5.54166C10.0417 4.95832 9.33332 4.66666 8.49999 4.66666C7.66666 4.66666 6.95832 4.95832 6.37499 5.54166C5.79166 6.12499 5.49999 6.83332 5.49999 7.66666C5.49999 8.49999 5.79166 9.20832 6.37499 9.79166C6.95832 10.375 7.66666 10.6667 8.49999 10.6667ZM8.49999 9.46666C7.99999 9.46666 7.57499 9.29166 7.22499 8.94166C6.87499 8.59166 6.69999 8.16666 6.69999 7.66666C6.69999 7.16666 6.87499 6.74166 7.22499 6.39166C7.57499 6.04166 7.99999 5.86666 8.49999 5.86666C8.99999 5.86666 9.42499 6.04166 9.77499 6.39166C10.125 6.74166 10.3 7.16666 10.3 7.66666C10.3 8.16666 10.125 8.59166 9.77499 8.94166C9.42499 9.29166 8.99999 9.46666 8.49999 9.46666ZM8.49999 12.6667C6.87777 12.6667 5.39999 12.2139 4.06666 11.3083C2.73332 10.4028 1.76666 9.18888 1.16666 7.66666C1.76666 6.14443 2.73332 4.93055 4.06666 4.02499C5.39999 3.11943 6.87777 2.66666 8.49999 2.66666C10.1222 2.66666 11.6 3.11943 12.9333 4.02499C14.2667 4.93055 15.2333 6.14443 15.8333 7.66666C15.2333 9.18888 14.2667 10.4028 12.9333 11.3083C11.6 12.2139 10.1222 12.6667 8.49999 12.6667Z" fill="white"/>
                        </svg> View as Seeker</button></a>
                    <button class="copy-link gap-2 flex m-auto w-full py-3 text-white font-second text-xs font-medium justify-center rounded-lg bg-[#343434]"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                        <path d="M12.5 14.6667C11.9444 14.6667 11.4722 14.4722 11.0833 14.0833C10.6944 13.6945 10.5 13.2222 10.5 12.6667C10.5 12.5889 10.5056 12.5083 10.5167 12.425C10.5278 12.3417 10.5444 12.2667 10.5667 12.2L5.86667 9.46668C5.67778 9.63334 5.46667 9.7639 5.23333 9.85834C5 9.95279 4.75556 10 4.5 10C3.94444 10 3.47222 9.80556 3.08333 9.41668C2.69444 9.02779 2.5 8.55557 2.5 8.00001C2.5 7.44445 2.69444 6.97223 3.08333 6.58334C3.47222 6.19445 3.94444 6.00001 4.5 6.00001C4.75556 6.00001 5 6.04723 5.23333 6.14168C5.46667 6.23612 5.67778 6.36668 5.86667 6.53334L10.5667 3.80001C10.5444 3.73334 10.5278 3.65834 10.5167 3.57501C10.5056 3.49168 10.5 3.41112 10.5 3.33334C10.5 2.77779 10.6944 2.30557 11.0833 1.91668C11.4722 1.52779 11.9444 1.33334 12.5 1.33334C13.0556 1.33334 13.5278 1.52779 13.9167 1.91668C14.3056 2.30557 14.5 2.77779 14.5 3.33334C14.5 3.8889 14.3056 4.36112 13.9167 4.75001C13.5278 5.1389 13.0556 5.33334 12.5 5.33334C12.2444 5.33334 12 5.28612 11.7667 5.19168C11.5333 5.09723 11.3222 4.96668 11.1333 4.80001L6.43333 7.53334C6.45556 7.60001 6.47222 7.67501 6.48333 7.75834C6.49444 7.84168 6.5 7.92223 6.5 8.00001C6.5 8.07779 6.49444 8.15834 6.48333 8.24168C6.47222 8.32501 6.45556 8.40001 6.43333 8.46668L11.1333 11.2C11.3222 11.0333 11.5333 10.9028 11.7667 10.8083C12 10.7139 12.2444 10.6667 12.5 10.6667C13.0556 10.6667 13.5278 10.8611 13.9167 11.25C14.3056 11.6389 14.5 12.1111 14.5 12.6667C14.5 13.2222 14.3056 13.6945 13.9167 14.0833C13.5278 14.4722 13.0556 14.6667 12.5 14.6667Z" fill="white"/>
                        </svg> Share Link</button>
                    <div class="p-3 pb-4 bg-teal-8 rounded-lg">
                        <a href="/recruiter/applicants/${post.id}/waiting" class="text-teal-100 font-second text-xs font-bold">View Applicants ></a>
                        <div class="flex items-center gap-2">
                            <p class="text-white text-2xl font-bold">${post.applicants.length}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M0.666656 11.4667C0.666656 11.0889 0.763879 10.7417 0.958323 10.425C1.15277 10.1083 1.4111 9.86666 1.73332 9.69999C2.42221 9.35555 3.12221 9.09721 3.83332 8.92499C4.54443 8.75277 5.26666 8.66666 5.99999 8.66666C6.73332 8.66666 7.45555 8.75277 8.16666 8.92499C8.87777 9.09721 9.57777 9.35555 10.2667 9.69999C10.5889 9.86666 10.8472 10.1083 11.0417 10.425C11.2361 10.7417 11.3333 11.0889 11.3333 11.4667V12C11.3333 12.3667 11.2028 12.6805 10.9417 12.9417C10.6805 13.2028 10.3667 13.3333 9.99999 13.3333H1.99999C1.63332 13.3333 1.31943 13.2028 1.05832 12.9417C0.797212 12.6805 0.666656 12.3667 0.666656 12V11.4667ZM12.3 13.3333C12.4222 13.1333 12.5139 12.9194 12.575 12.6917C12.6361 12.4639 12.6667 12.2333 12.6667 12V11.3333C12.6667 10.8444 12.5305 10.375 12.2583 9.92499C11.9861 9.47499 11.6 9.08888 11.1 8.76666C11.6667 8.83332 12.2 8.94721 12.7 9.10832C13.2 9.26943 13.6667 9.46666 14.1 9.69999C14.5 9.92221 14.8055 10.1694 15.0167 10.4417C15.2278 10.7139 15.3333 11.0111 15.3333 11.3333V12C15.3333 12.3667 15.2028 12.6805 14.9417 12.9417C14.6805 13.2028 14.3667 13.3333 14 13.3333H12.3ZM5.99999 7.99999C5.26666 7.99999 4.63888 7.73888 4.11666 7.21666C3.59443 6.69443 3.33332 6.06666 3.33332 5.33332C3.33332 4.59999 3.59443 3.97221 4.11666 3.44999C4.63888 2.92777 5.26666 2.66666 5.99999 2.66666C6.73332 2.66666 7.3611 2.92777 7.88332 3.44999C8.40555 3.97221 8.66666 4.59999 8.66666 5.33332C8.66666 6.06666 8.40555 6.69443 7.88332 7.21666C7.3611 7.73888 6.73332 7.99999 5.99999 7.99999ZM12.6667 5.33332C12.6667 6.06666 12.4055 6.69443 11.8833 7.21666C11.3611 7.73888 10.7333 7.99999 9.99999 7.99999C9.87777 7.99999 9.72221 7.9861 9.53332 7.95832C9.34443 7.93054 9.18888 7.89999 9.06666 7.86666C9.36666 7.5111 9.59721 7.11666 9.75832 6.68332C9.91943 6.24999 9.99999 5.79999 9.99999 5.33332C9.99999 4.86666 9.91943 4.41666 9.75832 3.98332C9.59721 3.54999 9.36666 3.15555 9.06666 2.79999C9.22221 2.74443 9.37777 2.70832 9.53332 2.69166C9.68888 2.67499 9.84443 2.66666 9.99999 2.66666C10.7333 2.66666 11.3611 2.92777 11.8833 3.44999C12.4055 3.97221 12.6667 4.59999 12.6667 5.33332Z" fill="#3DD1DB"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="py-4 flex flex-col gap-3">
                    <div class="bg-background-grey p-3 pb-4 rounded-lg">
                        <p class="text-white-60 font-second text-xs font-bold mb-3">Required Files</p>
                        ${post.post_resume_req?require_resume:""}
                        ${post.post_portfolio_req?require_portfolio:""}
                    </div>
                    <div class="bg-background-grey p-3 pb-4 rounded-lg">
                        <p class="text-white-60 font-second text-xs font-bold mb-3">Posted Date</p>
                        <p class="font-second text-sm font-normal text-white">${formatDateFull(post.post_postdate)}</p>
                    </div>
                    <div class="bg-background-grey p-3 pb-4 rounded-lg">
                        <p class="text-white-60 font-second text-xs font-bold mb-3">Deadline</p>
                        <p class="font-second text-sm font-normal text-white">${formatDateFull(post.post_deadline)}</p>
                    </div>
                    <div class="bg-background-grey p-3 pb-4 rounded-lg">
                        <p class="text-white-60 font-second text-xs font-bold mb-3">Number of Positions</p>
                        <p class="font-second text-sm font-normal text-white">${post.post_need}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
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

function timeAgo(date) {
    const currentDate = new Date();
    const postedDate = new Date(date);
  
    const timeDifference = currentDate.getTime() - postedDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
  
    if (daysDifference === 0) {
      return 'Posted today';
    } else if (daysDifference === 7) {
      return 'Posted 1 week ago';
    } else if (daysDifference === 14) {
      return 'Posted 2 weeks ago';
    } else {
      return 'Posted ' + daysDifference + ' days ago';
    }
}