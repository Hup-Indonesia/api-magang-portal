document.title = "Applied - Hup Indonesia!";

const USER_ID = $("#user_id").text()

$(".close-x").click(function(){
    $(this).closest('#popup').addClass("hidden")
    $("body").removeClass('no-scroll');
})

$(".navbar-internship").addClass("selected")

$.get(`/api/v1/seeker/${USER_ID}`, function(seekerData){
    $("#menu-applied span").text(`(${seekerData.applied.length})`)
    $("#menu-saved span").text(`(${seekerData.saved.length})`)

    const postApplied = seekerData.applied
    if(postApplied.length !== 0){
        $("#cards-grid").html("")
        postApplied.forEach(post => {
            $.get(`/api/v1/seekerpost/${post.SeekerPost.id}`, function(seekerpostData){
                $("#cards-grid").append(addCard(post, seekerpostData.datas))
            })
        })
    } 

    $("input[name=applied_filters], #select-applied-filter").change(function(){
        $("#cards-grid").html("")
        postApplied.forEach(post => {
            if($(this).val() == "All"){
                $.get(`/api/v1/seekerpost/${post.SeekerPost.id}`, function(seekerpostData){
                    $("#cards-grid").append(addCard(post, seekerpostData.datas))
                })
            }
            if(post.SeekerPost.applicantStatus == $(this).val()){
                $.get(`/api/v1/seekerpost/${post.SeekerPost.id}`, function(seekerpostData){
                    $("#cards-grid").append(addCard(post, seekerpostData.datas))
                })
            }
        })
    })

    
})

$("#cards-grid").on("click", ".button-view-detail", function(){
    const SEEKERPOST_ID = $(this).closest(".card").find(".seekerpost-id").text()
    const POST_ID = $(this).closest(".card").find(".post-id").text()

    $.get(`/api/v1/posts/${POST_ID}`, function(postData){
        let POST = postData.datas;
        $("#popup-post-org-logo").prop("src", POST.recruiter[0].rec_org_logo)
        $("#popup-post-org-name").text(POST.recruiter[0].rec_org_name)
        $("#popup-post-position").text(POST.post_position)
    })

    $.get(`/api/v1/seekerpost/${SEEKERPOST_ID}`, function(seekerpostData){
        let SEEKERPOST = seekerpostData.datas
        $("#popup-view-detail-status").html("")

        if(SEEKERPOST.Waiting){
            let waiting = `
            <div class="flex gap-4 items-start">
                <div class="w-[20px] h-[20px] rounded-full bg-teal-100 border-4 border-[#2f4c4e]"></div>
                <div class="">
                    <p class="font-second text-sm font-bold text-teal-100">Your application has been sent</p>
                    <p class="font-second text-xs font-medium text-white mb-1">${SEEKERPOST.Waiting.waitingDate}</p>
                    <p class="font-second text-xs font-medium text-white-60">Sit back and relax.. We'll notify you if the recruiter has viewed your application.</p>
                </div>
            </div>`
            $("#popup-view-detail-status").prepend(waiting)
        }
        if(SEEKERPOST.Reviewed){
            let reviewed = `
            <div class="flex gap-4 items-start">
                <div class="w-[20px] h-[20px] rounded-full bg-teal-100 border-4 border-[#2f4c4e]"></div>
                <div class="">
                    <p class="font-second text-sm font-bold text-teal-100">Recruiter has viewed your application</p>
                    <p class="font-second text-xs font-medium text-white mb-1">${SEEKERPOST.Reviewed.reviewedDate}</p>
                    <p class="font-second text-xs font-medium text-white-60">Any time now! The recruiter has viewed your application and will give a response regardin your application.</p>
                </div>
            </div>`
            $("#popup-view-detail-status").prepend(reviewed)
        }
        if(SEEKERPOST.Scheduled){
            let paragraph = ""
            if(SEEKERPOST.Scheduled.interviewMessage) paragraph = SEEKERPOST.Scheduled.interviewMessage.split('\n').join("</br>")
            let interviewLink = ""
            if(SEEKERPOST.Scheduled.interviewType == "Online"){
                interviewLink = `<div class="">
                                    <p class="text-sm font-normal text-white-60 tracking-[1.4]">LINK</p>
                                    <p class="font-second text-xs font-medium text-teal-100"><a class="font-second text-xs font-medium text-teal-100" href="${SEEKERPOST.Scheduled.interviewLink ? SEEKERPOST.Scheduled.interviewLink : "#"}">${SEEKERPOST.Scheduled.interviewLink ? SEEKERPOST.Scheduled.interviewLink : "Not Set"}</a></p>
                                 </div>`
            }
            let interview = `
            <div class="flex gap-4 items-start">
                <div class="min-w-[20px] min-h-[20px] rounded-full bg-[#2ade68] border-4 border-[#294e37]"></div>
                <div class="">
                    <p class="font-second text-sm font-bold text-[#2ade68]">Scheduled for Interview</p>
                    <p class="font-second text-xs font-medium text-white mb-1">${SEEKERPOST.Scheduled.scheduledDate}</p>
                    <p class="font-second text-xs font-medium text-white-60">The recruiter has scheduled you for an interview at:</p>
                    <div class="flex flex-col gap-4 bg-[#222222] rounded-lg mt-2 p-3 pb-4">
                        <div class="flex gap-10">
                            <div class="">
                                <p class="text-sm font-normal text-white-60 tracking-[1.4]">DATE & TIME</p>
                                <p class="font-second text-xs font-bold text-white">${SEEKERPOST.Scheduled.interviewDate ? SEEKERPOST.Scheduled.interviewDate : "Not Set"}</p>
                            </div>
                            <div class="">
                                <p class="text-sm font-normal text-white-60 tracking-[1.4]">TYPE</p>
                                <p class="font-second text-xs font-bold text-white">${SEEKERPOST.Scheduled.interviewType ? SEEKERPOST.Scheduled.interviewType : "Not Set"}</p>
                            </div>
                            ${interviewLink}
                        </div>
                        <div class="">
                            <p class="text-sm font-normal text-white-60 tracking-[1.4]">MESSAGE</p>
                            <p class="font-second text-xs font-medium text-white">${SEEKERPOST.Scheduled.interviewMessage ? paragraph : "Not Set"}</p>
                        </div>
                    </div>
                </div>
            </div>`
            console.log("YES");
            $("#popup-view-detail-status").prepend(interview)
        }
        if(SEEKERPOST.Offering){
            let offering = `
            <div class="flex gap-4 items-start">
                <div class="min-w-[20px] min-h-[20px] rounded-full bg-[#2ade68] border-4 border-[#294e37]"></div>
                <div class="">
                    <p class="font-second text-sm font-bold text-[#2ade68]">Offering Stage</p>
                    <p class="font-second text-xs font-medium text-white mb-1">${SEEKERPOST.Offering.offeringDate}</p>
                    <p class="font-second text-xs font-medium text-white-60">You're at the final stage! Stay tuned for further contacts from your recruiter.</p>
                </div>
            </div>`
            $("#popup-view-detail-status").prepend(offering)
        }
        if(SEEKERPOST.Rejected){
            let rejected = `
            <div class="flex gap-4 items-start">
                <div class="w-[20px] h-[20px] rounded-full bg-[#FC4545] border-4 border-[#543030]"></div>
                <div class="">
                    <p class="font-second text-sm font-bold text-[#FC4545]">Rejected</p>
                    <p class="font-second text-xs font-medium text-white mb-1">${SEEKERPOST.Rejected.rejectedDate}</p>
                    <p class="font-second text-xs font-medium text-white-60">The recruiter has rejected your application because of the following reason:</p>
                    <p class="font-second text-xs font-bold text-white">${SEEKERPOST.Rejected.rejectedMessage}</p>
                </div>
            </div>`
            $("#popup-view-detail-status").prepend(rejected)
        }
    })

    $("#popup").removeClass("hidden")
    $("#popup-view-detail").removeClass("hidden")
    $("body").addClass('no-scroll');
})

function addCard(post, seekerpost){
    let applicantStatus
    switch (seekerpost.applicantStatus) {
        case "Waiting":
            applicantStatus = `<div class="status flex flex-col lg:flex-row gap-2 p-3 rounded-b-lg bg-darkest-grey w-full lg:w-max"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.2002 11.1333L11.1335 10.2L8.66683 7.73334V4.66668H7.3335V8.26668L10.2002 11.1333ZM8.00016 14.6667C7.07794 14.6667 6.21127 14.4917 5.40016 14.1417C4.58905 13.7917 3.8835 13.3167 3.2835 12.7167C2.6835 12.1167 2.2085 11.4111 1.8585 10.6C1.5085 9.7889 1.3335 8.92223 1.3335 8.00001C1.3335 7.07779 1.5085 6.21112 1.8585 5.40001C2.2085 4.5889 2.6835 3.88334 3.2835 3.28334C3.8835 2.68334 4.58905 2.20834 5.40016 1.85834C6.21127 1.50834 7.07794 1.33334 8.00016 1.33334C8.92238 1.33334 9.78905 1.50834 10.6002 1.85834C11.4113 2.20834 12.1168 2.68334 12.7168 3.28334C13.3168 3.88334 13.7918 4.5889 14.1418 5.40001C14.4918 6.21112 14.6668 7.07779 14.6668 8.00001C14.6668 8.92223 14.4918 9.7889 14.1418 10.6C13.7918 11.4111 13.3168 12.1167 12.7168 12.7167C12.1168 13.3167 11.4113 13.7917 10.6002 14.1417C9.78905 14.4917 8.92238 14.6667 8.00016 14.6667Z" fill="white"/></svg><p class="text-white-80 font-second font-bold text-xs">Sit tight! Your application has not been reviewed by the recruiter yet.</p><p class="button-view-detail cursor-pointer text-xs font-second font-medium text-teal-100">View Details</p></div>`
            break;
        case "Reviewed":
            applicantStatus = `<div class="status flex flex-col lg:flex-row gap-2 p-3 rounded-b-lg bg-teal-8 w-full lg:w-max"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.99984 10.6667C8.83317 10.6667 9.5415 10.375 10.1248 9.79169C10.7082 9.20835 10.9998 8.50002 10.9998 7.66669C10.9998 6.83335 10.7082 6.12502 10.1248 5.54169C9.5415 4.95835 8.83317 4.66669 7.99984 4.66669C7.1665 4.66669 6.45817 4.95835 5.87484 5.54169C5.2915 6.12502 4.99984 6.83335 4.99984 7.66669C4.99984 8.50002 5.2915 9.20835 5.87484 9.79169C6.45817 10.375 7.1665 10.6667 7.99984 10.6667ZM7.99984 9.46669C7.49984 9.46669 7.07484 9.29169 6.72484 8.94169C6.37484 8.59169 6.19984 8.16669 6.19984 7.66669C6.19984 7.16669 6.37484 6.74169 6.72484 6.39169C7.07484 6.04169 7.49984 5.86669 7.99984 5.86669C8.49984 5.86669 8.92484 6.04169 9.27484 6.39169C9.62484 6.74169 9.79984 7.16669 9.79984 7.66669C9.79984 8.16669 9.62484 8.59169 9.27484 8.94169C8.92484 9.29169 8.49984 9.46669 7.99984 9.46669ZM7.99984 12.6667C6.37762 12.6667 4.89984 12.2139 3.5665 11.3084C2.23317 10.4028 1.2665 9.18891 0.666504 7.66669C1.2665 6.14446 2.23317 4.93058 3.5665 4.02502C4.89984 3.11946 6.37762 2.66669 7.99984 2.66669C9.62206 2.66669 11.0998 3.11946 12.4332 4.02502C13.7665 4.93058 14.7332 6.14446 15.3332 7.66669C14.7332 9.18891 13.7665 10.4028 12.4332 11.3084C11.0998 12.2139 9.62206 12.6667 7.99984 12.6667Z" fill="#3DD1DB"/></svg><p class="text-white-80 font-second font-bold text-xs">The recruiter has viewed your application! Stay tuned for further progress.</p><p class="button-view-detail cursor-pointer text-xs font-second font-medium text-teal-100">View Details</p></div>`
            break;
        case "Scheduled":
            applicantStatus = `<div class="status flex flex-col lg:flex-row gap-2 p-3 rounded-b-lg bg-[#2BDE68]/[.08] w-full lg:w-max"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.46686 12L0.700195 8.23334L1.6502 7.3L4.48353 10.1333L5.41686 11.0667L4.46686 12ZM8.23353 12L4.46686 8.23334L5.4002 7.28334L8.23353 10.1167L14.3669 3.98334L15.3002 4.93334L8.23353 12ZM8.23353 8.23334L7.28353 7.3L10.5835 4L11.5335 4.93334L8.23353 8.23334Z" fill="#2BDE68"/></svg><p class="text-white-80 font-second font-bold text-xs">Woohoo! You have been scheduled for interview! Click here to view the details.</p><p class="button-view-detail cursor-pointer text-xs font-second font-medium text-[#2BDE68]">View Details</p></div>`
            break;
        case "Rejected":
            applicantStatus = `<div class="status flex flex-col lg:flex-row gap-2 p-3 rounded-b-lg bg-[#FC4545]/[.08] w-full lg:w-max"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.26683 12.6667L3.3335 11.7333L7.06683 8.00001L3.3335 4.26668L4.26683 3.33334L8.00016 7.06668L11.7335 3.33334L12.6668 4.26668L8.9335 8.00001L12.6668 11.7333L11.7335 12.6667L8.00016 8.93334L4.26683 12.6667Z" fill="#FC4545"/></svg><p class="text-white-80 font-second font-bold text-xs">Sorry, you've got rejected. Click here to view the details.</p><p class="button-view-detail cursor-pointer text-xs font-second font-medium text-[#FC4545]">View Details</p></div>`
            break;
        case "Offering":
            applicantStatus = `<div class="status flex flex-col lg:flex-row gap-2 p-3 rounded-b-lg bg-[#2BDE68]/[.08] w-full lg:w-max"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.46686 12L0.700195 8.23334L1.6502 7.3L4.48353 10.1333L5.41686 11.0667L4.46686 12ZM8.23353 12L4.46686 8.23334L5.4002 7.28334L8.23353 10.1167L14.3669 3.98334L15.3002 4.93334L8.23353 12ZM8.23353 8.23334L7.28353 7.3L10.5835 4L11.5335 4.93334L8.23353 8.23334Z" fill="#2BDE68"/></svg><p class="text-white-80 font-second font-bold text-xs">You are in the offering stage! Click here to view the details.</p><p class="button-view-detail cursor-pointer text-xs font-second font-medium text-[#2BDE68]">View Details</p></div>`
            break;
    
        default:
            applicantStatus = ``
            break;
    }
    const RECRUITER = post.recruiter[0]
    const verified = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.49998 12.8333L2.43332 12.4166C2.31109 12.3944 2.20832 12.3305 2.12498 12.225C2.04165 12.1194 2.01109 12 2.03332 11.8666L2.26665 9.86664L0.949984 8.33331C0.861095 8.24442 0.81665 8.13331 0.81665 7.99998C0.81665 7.86664 0.861095 7.75553 0.949984 7.66664L2.26665 6.14998L2.03332 4.14998C2.01109 4.01664 2.04165 3.8972 2.12498 3.79164C2.20832 3.68609 2.31109 3.6222 2.43332 3.59998L4.49998 3.18331L5.53332 1.39998C5.59998 1.28886 5.69443 1.21109 5.81665 1.16664C5.93887 1.1222 6.06109 1.12775 6.18332 1.18331L7.99998 2.03331L9.81665 1.18331C9.93887 1.12775 10.0639 1.11664 10.1916 1.14998C10.3194 1.18331 10.4111 1.26109 10.4666 1.38331L11.5166 3.18331L13.5666 3.59998C13.6889 3.6222 13.7916 3.68609 13.875 3.79164C13.9583 3.8972 13.9889 4.01664 13.9667 4.14998L13.7333 6.14998L15.05 7.66664C15.1389 7.75553 15.1833 7.86664 15.1833 7.99998C15.1833 8.13331 15.1389 8.24442 15.05 8.33331L13.7333 9.86664L13.9667 11.8666C13.9889 12 13.9583 12.1194 13.875 12.225C13.7916 12.3305 13.6889 12.3944 13.5666 12.4166L11.5166 12.8333L10.4666 14.6166C10.4111 14.7389 10.3194 14.8166 10.1916 14.85C10.0639 14.8833 9.93887 14.8722 9.81665 14.8166L7.99998 13.9666L6.18332 14.8166C6.06109 14.8722 5.93887 14.8778 5.81665 14.8333C5.69443 14.7889 5.59998 14.7111 5.53332 14.6L4.49998 12.8333ZM6.93332 9.86664C7.03332 9.96664 7.14998 10.0166 7.28332 10.0166C7.41665 10.0166 7.53332 9.96664 7.63332 9.86664L10.7167 6.81664C10.8055 6.72775 10.8472 6.61386 10.8417 6.47498C10.8361 6.33609 10.7833 6.21664 10.6833 6.11664C10.5833 6.01664 10.4639 5.96942 10.325 5.97498C10.1861 5.98053 10.0611 6.03331 9.94998 6.13331L7.28332 8.78331L6.06665 7.49998C5.96665 7.38886 5.84165 7.33609 5.69165 7.34164C5.54165 7.3472 5.41665 7.40553 5.31665 7.51664C5.21665 7.62775 5.16387 7.75553 5.15832 7.89998C5.15276 8.04442 5.20554 8.16664 5.31665 8.26664L6.93332 9.86664Z" fill="#3DD1DB"/></svg>`
    return `
    <div class="card">
        <p class="hidden seekerpost-id">${seekerpost.id}</p>
        <p class="hidden post-id">${post.id}</p>
        <div class="bg-card-grey rounded-t-lg lg:rounded-tl-lg lg:rounded-tr-lg lg:rounded-br-lg p-3">
            <div class="flex gap-3">
                <div class="w-[44px] h-[44px] rounded-lg overflow-hidden bg-white">
                    <img src="${RECRUITER.rec_org_logo}" alt="" class="w-full h-full object-cover">
                </div>
                <div class="head">
                    <p class="text-white text-base font-extrabold">${post.post_position}</p>
                    <div class="flex items-center gap-2">
                        <p class="flex items-center gap-1 text-xs font-second font-bold text-white-60">${RECRUITER.rec_org_name}</p>
                        <p class="font-second text-xs text-white-60 font-medium">-</p>
                        <p class="font-second text-xs text-white-60 font-medium">Resp. Time ~3.1 days</p>
                    </div>
                </div>
            </div>
            <div class="status my-3">
                <p class="text-[#FC4545] bg-[#DB3D3D]/20 py-[2px] px-2 inline cursor-default text-xs font-second font-medium">INTERNSHIP</p>
            </div>
            <div class="description flex flex-col lg:flex-row gap-2.5 lg:gap-6">
                <p class="flex items-center gap-3 text-white-60 font-second text-xs font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 14V4.66667H4.66667V2H11.3333V7.33333H14V14H8.66667V11.3333H7.33333V14H2ZM3.33333 12.6667H4.66667V11.3333H3.33333V12.6667ZM3.33333 10H4.66667V8.66667H3.33333V10ZM3.33333 7.33333H4.66667V6H3.33333V7.33333ZM6 10H7.33333V8.66667H6V10ZM6 7.33333H7.33333V6H6V7.33333ZM6 4.66667H7.33333V3.33333H6V4.66667ZM8.66667 10H10V8.66667H8.66667V10ZM8.66667 7.33333H10V6H8.66667V7.33333ZM8.66667 4.66667H10V3.33333H8.66667V4.66667ZM11.3333 12.6667H12.6667V11.3333H11.3333V12.6667ZM11.3333 10H12.6667V8.66667H11.3333V10Z" fill="white" fill-opacity="0.4"/>
                    </svg> ${post.post_location_type} • ${post.post_location}</p>
                <p class="flex items-center gap-3 text-white-60 font-second text-xs font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.2 11.1333L11.1334 10.2L8.66671 7.73331V4.66665H7.33337V8.26665L10.2 11.1333ZM8.00004 14.6666C7.07782 14.6666 6.21115 14.4916 5.40004 14.1416C4.58893 13.7916 3.88337 13.3166 3.28337 12.7166C2.68337 12.1166 2.20837 11.4111 1.85837 10.6C1.50837 9.78887 1.33337 8.9222 1.33337 7.99998C1.33337 7.07776 1.50837 6.21109 1.85837 5.39998C2.20837 4.58887 2.68337 3.88331 3.28337 3.28331C3.88337 2.68331 4.58893 2.20831 5.40004 1.85831C6.21115 1.50831 7.07782 1.33331 8.00004 1.33331C8.92226 1.33331 9.78893 1.50831 10.6 1.85831C11.4112 2.20831 12.1167 2.68331 12.7167 3.28331C13.3167 3.88331 13.7917 4.58887 14.1417 5.39998C14.4917 6.21109 14.6667 7.07776 14.6667 7.99998C14.6667 8.9222 14.4917 9.78887 14.1417 10.6C13.7917 11.4111 13.3167 12.1166 12.7167 12.7166C12.1167 13.3166 11.4112 13.7916 10.6 14.1416C9.78893 14.4916 8.92226 14.6666 8.00004 14.6666Z" fill="white" fill-opacity="0.4"/>
                    </svg> ${post.post_work_time} • ${post.post_work_time_perweek} work week</p>
                <p class="flex items-center gap-3 text-white-60 font-second text-xs font-medium"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="white" fill-opacity="0.4"/>
                    <circle cx="8" cy="8" r="6.5" stroke="#2A2A2A"/>
                    <path d="M4.45459 10H5.22021V8.10645H6.27295L7.27783 10H8.15967L7.05566 7.99023C7.64697 7.78857 8.0127 7.25537 8.0127 6.58545V6.57861C8.0127 5.65234 7.37695 5.06787 6.36865 5.06787H4.45459V10ZM5.22021 7.47754V5.71045H6.27295C6.86084 5.71045 7.22314 6.03857 7.22314 6.58545V6.59229C7.22314 7.15283 6.88477 7.47754 6.29346 7.47754H5.22021Z" fill="#2A2A2A"/>
                    <path d="M8.66553 11.1963H9.40381V9.39502H9.4209C9.63281 9.81201 10.0464 10.0718 10.5557 10.0718C11.458 10.0718 12.0493 9.35059 12.0493 8.20557V8.20215C12.0493 7.05371 11.4614 6.33594 10.5454 6.33594C10.0327 6.33594 9.63623 6.5957 9.4209 7.02295H9.40381V6.4043H8.66553V11.1963ZM10.354 9.43604C9.79688 9.43604 9.40039 8.95068 9.40039 8.20557V8.20215C9.40039 7.45361 9.79346 6.96826 10.354 6.96826C10.9316 6.96826 11.2974 7.43652 11.2974 8.20215V8.20557C11.2974 8.96436 10.9351 9.43604 10.354 9.43604Z" fill="#2A2A2A"/>
                    </svg> Rp${post.post_thp}</p>
            </div>
        </div>
        ${applicantStatus}
    </div>
    `
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