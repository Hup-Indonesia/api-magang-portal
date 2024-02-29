let RECRUITER_ID
let COMPLETION_COUNT = 0

$.get(`/api/v1/posts`, function(postsData){
    $("#applicants-list").empty()

    const sortedPosts = postsData.datas.sort((a, b) => {
        const positionA = a.post_position.toUpperCase(); // Konversi ke huruf besar untuk memastikan urutan yang konsisten
        const positionB = b.post_position.toUpperCase();
      
        if (positionA < positionB) {
          return -1;
        }
        if (positionA > positionB) {
          return 1;
        }
        return 0; // Kedua elemen sama
    });

    sortedPosts.forEach(function(post){
        $("#applicants-list").append(applicantsCard(post))
    })
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

$('#recruiter-select, #recruiter-select-edit').select2({
    placeholder: 'Select'
});
$.get("/api/v1/recruiter", function(recruiterData){
    const filteredRecruiter = recruiterData.datas.filter(recruiter => recruiter.rec_mode == "External")
    filteredRecruiter.forEach(recruiter => {
        $("#recruiter-select, #recruiter-select-edit").append(`<option value="${recruiter.id}">${recruiter.rec_org_name}</option>`)
    })

    $("#applicants-list").on("click", ".button-edit", function(){
        const POSTID = $(this).parent().find(".post-id").text();
        const RECRUITERID = $(this).parent().find(".recruiter-id").text();
        $("#popup").removeClass("hidden")
        $(".popup-edit-post").removeClass("hidden")
    
        $.get(`/api/v1/posts/${POSTID}`, function(postData){
            postData = postData.datas
            $("#recruiter-select-edit").val(RECRUITERID).trigger('change')
            $(".popup-edit-post input[name=post_position]").val(postData.post_position)
            $(".popup-edit-post select[name=post_need]").val(postData.post_need)
            $(".popup-edit-post input[name=post_link]").val(postData.post_link)
            $(".popup-edit-post select[name=post_type]").val(postData.post_type)
            $(".popup-edit-post select[name=post_work_time]").val(postData.post_work_time)
            $(".popup-edit-post select[name=post_work_time_perweek]").val(postData.post_work_time_perweek)
            $(".popup-edit-post select[name=post_thp_type]").val(postData.post_thp_type)
            $(".popup-edit-post select[name=post_location_type]").val(postData.post_location_type)
            $(".popup-edit-post input[name=post_location]").val(postData.post_location)
            $(".popup-edit-post select[name=post_contract_duration]").val(postData.post_contract_duration)
            $(".popup-edit-post input[name=post_deadline]").val(postData.post_deadline)
            postData.post_resume_req ? $(".popup-edit-post input[name=post_resume_req").prop("checked", true).val("on") : $(".popup-edit-post input[name=post_resume_req").prop("checked", false)
            postData.post_portfolio_req ? $(".popup-edit-post input[name=post_portfolio_req").prop("checked", true).val("on") : $(".popup-edit-post input[name=post_portfolio_req").prop("checked", false)
        
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
            updateSeekerData("form-edit-post-external", `/api/v1/recruiter/${RECRUITERID}/post/${postData.id}`, "PUT")
        })
    })
})


$("#button-create-post").click(function(){
    $("#popup").removeClass("hidden")
    $(".popup-create-post").removeClass("hidden")
})

$("#applicants-list").on("click", ".button-delete", function(e){
    e.preventDefault()
    const POSTID = $(this).parent().find(".post-id").text();
    $.ajax({
        url: `/api/v1/posts/${POSTID}`,
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

$("#select-all").on("click", function () {
    if (this.checked) {
      // Iterate each checkbox
        $("#items-all").removeClass("hidden")
        $("#button-create-post").removeClass("hidden")
        $(":checkbox").each(function () {
            this.checked = true;
        });
    } else {
        $("#items-all").addClass("hidden")
        $("#button-create-post").addClass("hidden")
        $(":checkbox").each(function () {
            this.checked = false;
        });
    }
});
$("#applicants-list").on("click", ".applicant-checkbox", function () {
    const anyChecked = $(".applicant-checkbox:checked").length > 0;
    anyChecked ? $("#items-all").removeClass("hidden") : $("#items-all").addClass("hidden")
    anyChecked ? $("#button-create-post").addClass("hidden") : $("#button-create-post").removeClass("hidden")
});

$("#popup-thp-type").change(function(){
    $('#thp_max, #thp_min').val("")
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
$(".direct-list").on('keydown', function(e){
    if (e.key === 'Enter') {
    e.preventDefault(); // Mencegah newline karakter
    const text = $(this).val();
    if (text.trim() !== '') {
        $(this).val($(this).val()+'\n• ');
    }
}
})
$('input[name=post_thp_max], input[name=post_thp_min]').on('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Hanya menerima angka
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Format ribuan
    $(this).val(value);
});




updateSeekerData("form-add-post-external", `/api/v1/posts/external`,"POST")


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

function applicantsCard(post){
    const EXTERNAL = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.33333 14C2.96667 14 2.65278 13.8694 2.39167 13.6083C2.13056 13.3472 2 13.0333 2 12.6667V3.33333C2 2.96667 2.13056 2.65278 2.39167 2.39167C2.65278 2.13056 2.96667 2 3.33333 2H7.33333C7.52222 2 7.68056 2.06389 7.80833 2.19167C7.93611 2.31944 8 2.47778 8 2.66667C8 2.85556 7.93611 3.01389 7.80833 3.14167C7.68056 3.26944 7.52222 3.33333 7.33333 3.33333H3.33333V12.6667H12.6667V8.66667C12.6667 8.47778 12.7306 8.31944 12.8583 8.19167C12.9861 8.06389 13.1444 8 13.3333 8C13.5222 8 13.6806 8.06389 13.8083 8.19167C13.9361 8.31944 14 8.47778 14 8.66667V12.6667C14 13.0333 13.8694 13.3472 13.6083 13.6083C13.3472 13.8694 13.0333 14 12.6667 14H3.33333ZM12.6667 4.26667L6.93333 10C6.81111 10.1222 6.65556 10.1833 6.46667 10.1833C6.27778 10.1833 6.12222 10.1222 6 10C5.87778 9.87778 5.81667 9.72222 5.81667 9.53333C5.81667 9.34444 5.87778 9.18889 6 9.06667L11.7333 3.33333H10C9.81111 3.33333 9.65278 3.26944 9.525 3.14167C9.39722 3.01389 9.33333 2.85556 9.33333 2.66667C9.33333 2.47778 9.39722 2.31944 9.525 2.19167C9.65278 2.06389 9.81111 2 10 2H14V6C14 6.18889 13.9361 6.34722 13.8083 6.475C13.6806 6.60278 13.5222 6.66667 13.3333 6.66667C13.1444 6.66667 12.9861 6.60278 12.8583 6.475C12.7306 6.34722 12.6667 6.18889 12.6667 6V4.26667Z" fill="#3DD1DB"/></svg>`
    return `
    <div class="jobpost-grid text-sm px-3 py-2.5 text-white font-second items-center hover:bg-teal-100/10 group">
        <p><input type="checkbox" name="${post.id}" id="" class="applicant-checkbox bg-transparent rounded focus:ring-0"></p>
        <p class="font-bold hover:underline group-hover:text-teal-100 text-xs"><a href="#">${post.post_position}</a></p>
        <p class="text-xs"><a href="#" class="flex items-center gap-2">${post.recruiter[0].rec_org_name} ${post.post_mode == "External" ? EXTERNAL : ""}</a></p>
        <p class="text-sm">${post.post_status}</p>
        <p class="text-sm">${post.post_type}</p>
        <p class="text-sm">${post.post_deadline}</p>
        <p class="text-sm">${post.applicants.length}</p>
        <p>0</p>
        <form class="flex gap-1 items-center opacity-0 group-hover:opacity-100">
            <p class="hidden post-id">${post.id}</p>
            <p class="hidden recruiter-id">${post.recruiter[0].id}</p>
            <button type="button" class="button-delete w-[24px] h-[24px] px-1 py-1 bg-[#FC4545]/20 rounded-lg font-second text-sm font-normal text-[#FC4545] flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4.66669 14C4.30002 14 3.98613 13.8694 3.72502 13.6083C3.46391 13.3472 3.33335 13.0333 3.33335 12.6667V4H2.66669V2.66667H6.00002V2H10V2.66667H13.3334V4H12.6667V12.6667C12.6667 13.0333 12.5361 13.3472 12.275 13.6083C12.0139 13.8694 11.7 14 11.3334 14H4.66669ZM6.00002 11.3333H7.33335V5.33333H6.00002V11.3333ZM8.66669 11.3333H10V5.33333H8.66669V11.3333Z" fill="#FC4545"/>
            </svg></button>
            ${post.post_mode == "External" ? `<button type="button" class="button-edit w-[24px] h-[24px] px-1 py-1 bg-teal-100/20 rounded-lg font-second text-sm font-normal text-[#2BDE68] flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
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