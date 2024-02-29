document.title = "Recruiter Dashboard - Hup Indonesia!";

let RECRUITER_ID
let COMPLETION_COUNT = 0
const USER_ID = $("#user_id").text()

$.get(`/api/v1/seeker/${USER_ID}`, async (seekerData) => {
    $(".navbar-dashboard").addClass("selected")
    RECRUITER_ID = seekerData.recruiter.id
    $.get(`/api/v1/recruiter/${RECRUITER_ID}`, async (recruiterData) => {
        $("#dashboard-firstname").text(recruiterData.rec_info_firstname)

        let INTERVIEWS = []
        let APPLICANTS = []
        const RECRUITER_POST_INPROGRESS = recruiterData.posts.filter(post => {
            return post.post_status == "IN-PROGRESS"
        })

        RECRUITER_POST_INPROGRESS.forEach(post => {
            $("#active-post-cards").prepend(activePost(post))
            let applicantInterview = post.applicants.filter(applicant => {
                return applicant.SeekerPost.applicantStatus == "Scheduled"
            })
            APPLICANTS = APPLICANTS.concat(post.applicants)
            INTERVIEWS = INTERVIEWS.concat(applicantInterview)
        })

        INTERVIEWS.forEach(interview => {
            $("#interview-cards").prepend(interviewCard(interview))
        })
        
        APPLICANTS.forEach(applicant => {
            $("#applicant-cards").prepend(applicantCard(applicant))
        })

        $("#interview-count span").text(`(${INTERVIEWS.length})`)
        $("#applicant-count span").text(`(${APPLICANTS.length})`)

    })
})

function startsWithTwo(input) {
    const regex = /^2\d+/; // '^2' menunjukkan input harus dimulai dengan '2', dan '\d+' menunjukkan satu atau lebih digit.
    return regex.test(input);
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

function activePost(post){
    return `
        <div class="post-left-choose w-[336px] flex flex-col gap-2 p-3 rounded-lg cursor-pointer bg-background-grey">
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

function interviewCard(interview){
    return `
        <div class="interview-card flex gap-3 items-center bg-background-grey rounded-lg p-3">
            <div class="w-[40px] h-[40px] rounded-full overflow-hidden bg-white">
                <img id="basic-org-logo" src="${interview.profile_picture}" alt="profile-picture" class="w-full h-full object-cover">
            </div>
            <div class="">
                <div class="flex items-center gap-2">
                    <p class="bg-teal-100 font-second font-medium text-xs text-teal-8 px-2 py-[1px] rounded-lg">TODAY</p>
                    <p class="font-second text-teal-100 font-bold font-bold text-sm">${interview.first_name} ${interview.last_name}</p>
                </div>
                <div class="flex items-center gap-4 mt-2">
                    <p class="text-white-80 font-second text-xs font-medium flex gap-1 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8.66668 7.73334V5.33334C8.66668 5.14445 8.60279 4.98612 8.47501 4.85834C8.34723 4.73057 8.1889 4.66668 8.00001 4.66668C7.81112 4.66668 7.65279 4.73057 7.52501 4.85834C7.39723 4.98612 7.33334 5.14445 7.33334 5.33334V7.98334C7.33334 8.07223 7.35001 8.15834 7.38334 8.24168C7.41668 8.32501 7.46668 8.40001 7.53334 8.46668L9.73334 10.6667C9.85557 10.7889 10.0111 10.85 10.2 10.85C10.3889 10.85 10.5445 10.7889 10.6667 10.6667C10.7889 10.5445 10.85 10.3889 10.85 10.2C10.85 10.0111 10.7889 9.85557 10.6667 9.73334L8.66668 7.73334ZM8.00001 14.6667C7.07779 14.6667 6.21112 14.4917 5.40001 14.1417C4.5889 13.7917 3.88334 13.3167 3.28334 12.7167C2.68334 12.1167 2.20834 11.4111 1.85834 10.6C1.50834 9.7889 1.33334 8.92223 1.33334 8.00001C1.33334 7.07779 1.50834 6.21112 1.85834 5.40001C2.20834 4.5889 2.68334 3.88334 3.28334 3.28334C3.88334 2.68334 4.5889 2.20834 5.40001 1.85834C6.21112 1.50834 7.07779 1.33334 8.00001 1.33334C8.92223 1.33334 9.7889 1.50834 10.6 1.85834C11.4111 2.20834 12.1167 2.68334 12.7167 3.28334C13.3167 3.88334 13.7917 4.5889 14.1417 5.40001C14.4917 6.21112 14.6667 7.07779 14.6667 8.00001C14.6667 8.92223 14.4917 9.7889 14.1417 10.6C13.7917 11.4111 13.3167 12.1167 12.7167 12.7167C12.1167 13.3167 11.4111 13.7917 10.6 14.1417C9.7889 14.4917 8.92223 14.6667 8.00001 14.6667Z" fill="white"/>
                        </svg> 13:30 -- 14:30</p>
                    <p class="text-white-80 font-second text-xs font-medium flex gap-1 items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2.66668 14C2.30001 14 1.98612 13.8695 1.72501 13.6083C1.4639 13.3472 1.33334 13.0333 1.33334 12.6667V5.33334C1.33334 4.96668 1.4639 4.65279 1.72501 4.39168C1.98612 4.13057 2.30001 4.00001 2.66668 4.00001H5.33334V2.66668C5.33334 2.30001 5.4639 1.98612 5.72501 1.72501C5.98612 1.4639 6.30001 1.33334 6.66668 1.33334H9.33334C9.70001 1.33334 10.0139 1.4639 10.275 1.72501C10.5361 1.98612 10.6667 2.30001 10.6667 2.66668V4.00001H13.3333C13.7 4.00001 14.0139 4.13057 14.275 4.39168C14.5361 4.65279 14.6667 4.96668 14.6667 5.33334V12.6667C14.6667 13.0333 14.5361 13.3472 14.275 13.6083C14.0139 13.8695 13.7 14 13.3333 14H2.66668ZM6.66668 4.00001H9.33334V2.66668H6.66668V4.00001Z" fill="white"/>
                    </svg> Software Engineer</p>
                </div>
            </div>
        </div>
    `
}

function applicantCard(applicant){
    return `
        <div class="flex justify-between bg-background-grey rounded-lg p-3">
            <div class="flex gap-3 items-center">
                <div class="min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] rounded-full overflow-hidden bg-white">
                    <img id="basic-org-logo" src="${applicant.profile_picture}" alt="profile-picture" class="w-full h-full object-cover">
                </div>
                <p class="text-white-80 font-second text-sm font-medium"><span class="text-teal-100">${applicant.first_name} ${applicant.last_name}</span> has applied to your <span class="text-teal-100">Software Engineer</span> post.</p>
            </div>
            <p class="basis-1/4 self-start text-center bg-[#343434] font-second font-medium text-xs text-white-60 px-2 py-[1px] rounded-lg">${formatTimeAgo(applicant.SeekerPost.createdAt)}</p>
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

function formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
  
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffMinutes < 60) {
      return `${diffMinutes} MIN AGO`;
    } else if (diffHours < 24) {
      return `${diffHours} HOUR AGO`;
    } else if (diffDays === 1) {
      return 'YESTERDAY';
    } else {
      const day = date.getDate();
      const monthNames = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
      ];
      const month = monthNames[date.getMonth()];
  
      return `${day} ${month}`;
    }
  }