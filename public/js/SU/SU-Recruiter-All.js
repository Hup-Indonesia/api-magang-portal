let RECRUITER_ID

$.get(`/api/v1/recruiter`, function(recruiterData){
    $("#applicants-list").empty()

    const sortedRecruiters = recruiterData.datas.sort((a, b) => {
        const positionA = a.rec_org_name.toUpperCase(); // Konversi ke huruf besar untuk memastikan urutan yang konsisten
        const positionB = b.rec_org_name.toUpperCase();
      
        if (positionA < positionB) {
          return -1;
        }
        if (positionA > positionB) {
          return 1;
        }
        return 0; // Kedua elemen sama
    });

    sortedRecruiters.forEach(function(recruiter){
        $("#applicants-list").append(applicantsCard(recruiter))
    })
})


$("#button-create-recruiter").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-basic").removeClass("hidden")
})

$("#button-org-logo-create").click(() => $("#input-org-logo-create").click())
$("#input-org-logo-create").change(function(){
    const selectedImage = this.files[0];
    if (selectedImage) {
        if(selectedImage.size > 2097152){
            $("#input-org-logo-create").prop("type","text").prop("type","file")
            $("#file-too-large").removeClass("invisible")
            setTimeout(function() {
                $("#file-too-large").addClass("invisible");
            }, 2500);
        }else{
            const imageUrl = URL.createObjectURL(selectedImage);
            $("#popup-org-logo-create").attr("src", imageUrl);
        }
    } else {
        $("#popup-org-logo-create").attr("src", "/img/Ellipse 3.svg");
    }
})

$("#button-org-logo-edit").click(() => $("#input-org-logo-edit").click())
$("#input-org-logo-edit").change(function(){
    const selectedImage = this.files[0];
    if (selectedImage) {
        if(selectedImage.size > 2097152){
            $("#input-org-logo-edit").prop("type","text").prop("type","file")
            $("#file-too-large").removeClass("invisible")
            setTimeout(function() {
                $("#file-too-large").addClass("invisible");
            }, 2500);
        }else{
            const imageUrl = URL.createObjectURL(selectedImage);
            $("#popup-org-logo-edit").attr("src", imageUrl);
        }
    } else {
        $("#popup-org-logo-edit").attr("src", "/img/Ellipse 3.svg");
    }
})

$(".button-next").click(function(){
    let body_percent_idx = $(".body-percent").index($(this).closest(".body-percent"))
    $(".body-percent").eq(body_percent_idx).addClass("hidden")
    $(".body-percent").eq(body_percent_idx+1).removeClass("hidden")
})
$(".button-back").click(function(){
    let body_percent_idx = $(".body-percent").index($(this).closest(".body-percent"))
    $(".body-percent").eq(body_percent_idx).addClass("hidden")
    $(".body-percent").eq(body_percent_idx-1).removeClass("hidden")
})
$(".close-x").click(function(){
    $(this).closest('.popup').addClass("hidden")
    $(this).closest('#popup').addClass("hidden")
    $("body").removeClass('no-scroll');
})



$("#applicants-list").on("click", ".button-edit", function(){
    const RECRUITERID = $(this).parent().find(".recruiter-id").text();
    $("#popup").removeClass("hidden")
    $(".popup-basic-edit").removeClass("hidden")

    $.get(`/api/v1/recruiter/${RECRUITERID}`, function(recruiterData){
        $(".popup-basic-edit #popup-org-logo-edit").prop("src", recruiterData.rec_org_logo)
        $(".popup-basic-edit input[name=rec_org_name]").val(recruiterData.rec_org_name)
        $(".popup-basic-edit input[name=rec_org_desc]").val(recruiterData.rec_org_desc)
        $(".popup-basic-edit select[name=rec_org_size]").val(recruiterData.rec_org_size)
        $(".popup-basic-edit input[name=rec_org_year]").val(recruiterData.rec_org_year)
        $(".popup-basic-edit input[name=rec_org_address]").val(recruiterData.rec_org_address)
        $(".popup-basic-edit input[name=rec_org_website]").val(recruiterData.rec_org_website)
        $(".popup-basic-edit textarea[name=rec_description]").val(recruiterData.rec_description)

        updateSeekerData("form-edit-recruiter", `/api/v1/recruiter/${RECRUITERID}`,"PUT")
    })
})

$("#applicants-list").on("click", ".button-delete", function(e){
    e.preventDefault()
    const RECRUITERID = $(this).parent().find(".recruiter-id").text();
    $.ajax({
        url: `/api/v1/recruiter/${RECRUITERID}`,
        type: "DELETE",
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



$("#popup").click(function(event){
    if($(event.target).is("#popup")){
        $("#popup").addClass("hidden")
        $(".popup-basic").addClass("hidden")
        $(".popup-basic-edit").addClass("hidden")
    }
})

// $("#select-all").on("click", function () {
//     if (this.checked) {
//       // Iterate each checkbox
//         $("#items-all").removeClass("hidden")
//         $("#button-create-recruiter").removeClass("hidden")
//         $(":checkbox").each(function () {
//             this.checked = true;
//         });
//     } else {
//         $("#items-all").addClass("hidden")
//         $("#button-create-recruiter").addClass("hidden")
//         $(":checkbox").each(function () {
//             this.checked = false;
//         });
//     }
// });
// $("#applicants-list").on("click", ".applicant-checkbox", function () {
//     const anyChecked = $(".applicant-checkbox:checked").length > 0;
//     anyChecked ? $("#items-all").removeClass("hidden") : $("#items-all").addClass("hidden")
//     anyChecked ? $("#button-create-recruiter").addClass("hidden") : $("#button-create-recruiter").removeClass("hidden")
// });




updateSeekerData("form-create-recruiter", `/api/v1/recruiter/external`,"POST")




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
                if(response.status_code == 201 || response.status_code == 200){
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

function applicantsCard(recruiter){
    const ACTIVE_POST = recruiter.posts.filter(post => post.post_status == "IN-PROGRESS")
    let TOTAL_APPLICANTS = 0
    recruiter.posts.forEach(a => {
        TOTAL_APPLICANTS += a.applicants.length
    })
    let EXTERNAL = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M1.33333 12C0.966667 12 0.652778 11.8694 0.391667 11.6083C0.130556 11.3472 0 11.0333 0 10.6667V1.33333C0 0.966667 0.130556 0.652778 0.391667 0.391667C0.652778 0.130556 0.966667 0 1.33333 0H5.33333C5.52222 0 5.68056 0.0638889 5.80833 0.191667C5.93611 0.319444 6 0.477778 6 0.666667C6 0.855556 5.93611 1.01389 5.80833 1.14167C5.68056 1.26944 5.52222 1.33333 5.33333 1.33333H1.33333V10.6667H10.6667V6.66667C10.6667 6.47778 10.7306 6.31944 10.8583 6.19167C10.9861 6.06389 11.1444 6 11.3333 6C11.5222 6 11.6806 6.06389 11.8083 6.19167C11.9361 6.31944 12 6.47778 12 6.66667V10.6667C12 11.0333 11.8694 11.3472 11.6083 11.6083C11.3472 11.8694 11.0333 12 10.6667 12H1.33333ZM10.6667 2.26667L4.93333 8C4.81111 8.12222 4.65556 8.18333 4.46667 8.18333C4.27778 8.18333 4.12222 8.12222 4 8C3.87778 7.87778 3.81667 7.72222 3.81667 7.53333C3.81667 7.34444 3.87778 7.18889 4 7.06667L9.73333 1.33333H8C7.81111 1.33333 7.65278 1.26944 7.525 1.14167C7.39722 1.01389 7.33333 0.855556 7.33333 0.666667C7.33333 0.477778 7.39722 0.319444 7.525 0.191667C7.65278 0.0638889 7.81111 0 8 0H12V4C12 4.18889 11.9361 4.34722 11.8083 4.475C11.6806 4.60278 11.5222 4.66667 11.3333 4.66667C11.1444 4.66667 10.9861 4.60278 10.8583 4.475C10.7306 4.34722 10.6667 4.18889 10.6667 4V2.26667Z" fill="#3DD1DB"/></svg>`
    return `
    <div class="recruiter-grid text-sm px-3 py-2.5 text-white font-second items-center hover:bg-teal-100/10 group">
        <p><input type="checkbox" name="${recruiter.id}" id="" class="applicant-checkbox bg-transparent rounded focus:ring-0"></p>
        <p class="font-bold hover:underline group-hover:text-teal-100"><a href="${recruiter.rec_org_website}" class="flex gap-2 items-center">${recruiter.rec_org_name} ${recruiter.rec_mode == "External" ? EXTERNAL : ""}</a></p>
        <p>${recruiter.rec_mode}</p>
        <p>${ACTIVE_POST.length}</p>
        <p>${recruiter.posts.length}</p>
        <p>${formatISODate(recruiter.createdAt)}</p>
        <p>${TOTAL_APPLICANTS}</p>
        <p>0</p>
        <form class="flex gap-1 items-center opacity-0 group-hover:opacity-100">
            <p class="hidden recruiter-id">${recruiter.id}</p>
            ${recruiter.rec_mode == "External" ? `<button type="button" class="button-delete w-[24px] h-[24px] px-1 py-1 bg-[#FC4545]/20 rounded-lg font-second text-sm font-normal text-[#FC4545] flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4.66669 14C4.30002 14 3.98613 13.8694 3.72502 13.6083C3.46391 13.3472 3.33335 13.0333 3.33335 12.6667V4H2.66669V2.66667H6.00002V2H10V2.66667H13.3334V4H12.6667V12.6667C12.6667 13.0333 12.5361 13.3472 12.275 13.6083C12.0139 13.8694 11.7 14 11.3334 14H4.66669ZM6.00002 11.3333H7.33335V5.33333H6.00002V11.3333ZM8.66669 11.3333H10V5.33333H8.66669V11.3333Z" fill="#FC4545"/>
            </svg></button>` : ""}
            ${recruiter.rec_mode == "External" ? `<button type="button" class="button-edit w-[24px] h-[24px] px-1 py-1 bg-teal-100/20 rounded-lg font-second text-sm font-normal text-[#2BDE68] flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12.8667 5.95004L10.0333 3.15004L10.9667 2.21671C11.2222 1.96115 11.5361 1.83337 11.9083 1.83337C12.2806 1.83337 12.5944 1.96115 12.85 2.21671L13.7833 3.15004C14.0389 3.4056 14.1722 3.71393 14.1833 4.07504C14.1944 4.43615 14.0722 4.74448 13.8167 5.00004L12.8667 5.95004ZM11.9 6.93337L4.83333 14H2V11.1667L9.06667 4.10004L11.9 6.93337Z" fill="#3DD1DB"/>
            </svg></button>` : ""}
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

function formatISODate(inputDate) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateObject = new Date(inputDate);
    return dateObject.toLocaleDateString('id-ID', options);
}