document.title = "Login - Hup Indonesia!";

const registeredEmail = []
    const REGEX_PATTERN = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
    //   Append semua email yang telah terdaftar dalam Database untuk pengecekan lebih lanjut
    $.get("/api/v1/seeker", function(obj){
        const email = obj.datas.forEach(data => {
            registeredEmail.push(data.email)
        })
    })

    // Semua interactive function jquery
    $("#signin-email").click(function(){
        $("#popup").removeClass("hidden")
        $(".popup-signin-email").removeClass("hidden")
        $("body").addClass('no-scroll');
    })
    $("#create-account").click(function(){
        $("#popup").removeClass("hidden")
        $(".popup-create-account").removeClass("hidden")
        $("body").addClass('no-scroll');
    })

    $(".close-x").click(function(){
        $(this).closest('.popup').addClass("hidden")
        $(this).closest('#popup').addClass("hidden")
        $(".body-percent").eq(0).removeClass("hidden")
        $(".body-percent").eq(1).addClass("hidden")
        $(".body-percent").eq(2).addClass("hidden")
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
    })

    if($(".popup-create-account-basic").find("input:empty").length !== 0){
        $("#button-create-account-basic").prop("disabled", true)
    }

    $(".popup-create-account-basic").find("input").on("input",function(){
        const nonEmptyInputs = $(".popup-create-account-basic").find("input").filter(function() {
            return $(this).val().length > 0;
        });
        
        // Check confirm password
        const password = $("#password1").val();
        const confirmPassword = $("#password2").val();
        let passwordMatch = false
        const isValid = REGEX_PATTERN.test(password)

        if(password !== confirmPassword){
            $("#input-confirm-password-create").removeClass("border-0")
            $("#input-confirm-password-create").addClass("border")
            if($("#password-not-match").length == 0){
                $(`<p id="password-not-match" class="mt-2 text-[#FC4545] font-second text-xs font-medium">Password doesn't match</p>`).insertAfter( "#input-confirm-password-create" );
            }
            passwordMatch = false
        }else{
            $("#input-confirm-password-create").removeClass("border")
            $("#input-confirm-password-create").addClass("border-0")
            $("#password-not-match").remove()
            passwordMatch = true
        }


        // Interactive di email untuk melihat apakah ada email yang sama
        let emailAvailable = false
        let emailInput = $("#create-account-email").val()
        if(registeredEmail.includes(emailInput)){
            $("#create-account-email").removeClass("border-0")
            $("#create-account-email").addClass("border")
            if($("#email-used").length == 0){
                $(`<p id="email-used" class="mt-2 text-[#FC4545] font-second text-xs font-medium">Email already used !</p>`).insertAfter( "#create-account-email" );
            }
            emailAvailable = false
        }else{
            $("#create-account-email").removeClass("border")
            $("#create-account-email").addClass("border-0")
            $("#email-used").remove()
            emailAvailable = true
        }


        // disable button next
        console.log(nonEmptyInputs.length);
        if (nonEmptyInputs.length === 10 && passwordMatch && emailAvailable) {
            $("#button-create-account-basic").prop("disabled", false);
        }else{
            $("#button-create-account-basic").prop("disabled", true);
        }
    })

    $("input[type=password]").on("input", function(){
        const password = $("#password1").val();
        const confirmPassword = $("#password2").val();
        const isValid = REGEX_PATTERN.test(password)

        if(!isValid){
            $("#input-password-create").removeClass("border-0")
            $("#input-password-create").addClass("border")
            if($("#password-not-valid").length == 0){
                $(`<p id="password-not-valid" class="mt-2 text-[#FC4545] font-second text-xs font-medium">Password not strong enough</p>`).insertAfter( "#input-password-create" );
            }
        }else{
            $("#input-password-create").removeClass("border")
            $("#input-password-create").addClass("border-0")
            $("#password-not-valid").remove()
        }
    })

    

    // Show Password
    $(document).ready(function () {
    $(".show-password").click(function () {
      const inputId = $(this).data("input");
      const passwordInput = $(inputId);

      if (passwordInput.attr("type") === "password") {
        passwordInput.attr("type", "text");
        $(this).html(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.5 18.8334L13 15.375C12.5139 15.5278 12.0208 15.6424 11.5208 15.7188C11.0208 15.7952 10.5139 15.8334 10 15.8334C8.13889 15.8334 6.4375 15.3334 4.89583 14.3334C3.35417 13.3334 2.14583 12.0139 1.27083 10.375C1.20139 10.25 1.14931 10.1216 1.11458 9.98962C1.07986 9.85768 1.0625 9.72226 1.0625 9.58337C1.0625 9.44449 1.07986 9.30907 1.11458 9.17712C1.14931 9.04518 1.20139 8.91671 1.27083 8.79171C1.57639 8.25004 1.90278 7.72226 2.25 7.20837C2.59722 6.69449 3 6.23615 3.45833 5.83337L1.16667 3.50004L2.33333 2.33337L17.6667 17.6667L16.5 18.8334ZM10 13.3334C10.1528 13.3334 10.2986 13.3264 10.4375 13.3125C10.5764 13.2987 10.7153 13.2709 10.8542 13.2292L6.35417 8.72921C6.3125 8.8681 6.28472 9.00699 6.27083 9.14587C6.25694 9.28476 6.25 9.4306 6.25 9.58337C6.25 10.625 6.61458 11.5105 7.34375 12.2396C8.07292 12.9688 8.95833 13.3334 10 13.3334ZM16.0833 13.7084L13.4375 11.0834C13.5347 10.8473 13.6111 10.6042 13.6667 10.3542C13.7222 10.1042 13.75 9.84726 13.75 9.58337C13.75 8.54171 13.3854 7.65629 12.6562 6.92712C11.9271 6.19796 11.0417 5.83337 10 5.83337C9.73611 5.83337 9.47917 5.86115 9.22917 5.91671C8.97917 5.97226 8.73611 6.0556 8.5 6.16671L6.375 4.04171C6.95833 3.8056 7.55208 3.62851 8.15625 3.51046C8.76042 3.3924 9.375 3.33337 10 3.33337C11.8611 3.33337 13.566 3.83685 15.1146 4.84379C16.6632 5.85074 17.875 7.17365 18.75 8.81254C18.8194 8.92365 18.8715 9.04518 18.9062 9.17712C18.941 9.30907 18.9583 9.44449 18.9583 9.58337C18.9583 9.72226 18.9444 9.85768 18.9167 9.98962C18.8889 10.1216 18.8403 10.2431 18.7708 10.3542C18.4375 11.007 18.0521 11.6181 17.6146 12.1875C17.1771 12.757 16.6667 13.2639 16.0833 13.7084ZM12.2292 9.87504L9.72917 7.37504C10.0903 7.3056 10.441 7.33337 10.7812 7.45837C11.1215 7.58337 11.4097 7.77782 11.6458 8.04171C11.8819 8.29171 12.0521 8.57643 12.1562 8.89587C12.2604 9.21532 12.2847 9.54171 12.2292 9.87504Z" fill="#3DD1DB"/>
                    </svg>`);
      } else {
        passwordInput.attr("type", "password");
        $(this).html(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 13.3333C11.0417 13.3333 11.9271 12.9687 12.6563 12.2396C13.3855 11.5104 13.75 10.625 13.75 9.58333C13.75 8.54166 13.3855 7.65625 12.6563 6.92708C11.9271 6.19791 11.0417 5.83333 10 5.83333C8.95837 5.83333 8.07296 6.19791 7.34379 6.92708C6.61462 7.65625 6.25004 8.54166 6.25004 9.58333C6.25004 10.625 6.61462 11.5104 7.34379 12.2396C8.07296 12.9687 8.95837 13.3333 10 13.3333ZM10 11.8333C9.37504 11.8333 8.84379 11.6146 8.40629 11.1771C7.96879 10.7396 7.75004 10.2083 7.75004 9.58333C7.75004 8.95833 7.96879 8.42708 8.40629 7.98958C8.84379 7.55208 9.37504 7.33333 10 7.33333C10.625 7.33333 11.1563 7.55208 11.5938 7.98958C12.0313 8.42708 12.25 8.95833 12.25 9.58333C12.25 10.2083 12.0313 10.7396 11.5938 11.1771C11.1563 11.6146 10.625 11.8333 10 11.8333ZM10 15.8333C7.97226 15.8333 6.12504 15.2674 4.45837 14.1354C2.79171 13.0035 1.58337 11.4861 0.833374 9.58333C1.58337 7.68055 2.79171 6.16319 4.45837 5.03124C6.12504 3.8993 7.97226 3.33333 10 3.33333C12.0278 3.33333 13.875 3.8993 15.5417 5.03124C17.2084 6.16319 18.4167 7.68055 19.1667 9.58333C18.4167 11.4861 17.2084 13.0035 15.5417 14.1354C13.875 15.2674 12.0278 15.8333 10 15.8333Z" fill="white"/>
                    </svg>`);
      }
    });


  });
    
    const form_login = document.getElementById("form-login-email");
    $("#form-login-email").submit(function(e){
        e.preventDefault();
        let formData = new FormData(form_login);
        $.ajax({
            url: "/api/v1/seeker/login",
            type: "POST",
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            encrypt: "multipart/form-data",
            processData: false,
            success: (response) => {
                if(response.status_code == 200){
                    window.location = "/seeker/profile"
                }
            },
            error: function (request, status, error) {
                alert("Error: " + request.responseJSON.message);
            },
        });
    })

    // Prevent enter untuk sebumit form !!!
    $('form').bind("keypress", function(e) {
        if (e.keyCode == 13) {               
            e.preventDefault();
            return false;
        }
    });


    let VERIFICATION_CODE
    $("#send-verification").click(function(){
        let EMAIL = $("#create-account-email").val()
        $("#signup-email").text(EMAIL)

        $.ajax({
            url: `/api/v1/verification/${EMAIL}`,
            type: "POST",
            async: false,
            cache: false,
            contentType: false,
            encrypt: "multipart/form-data",
            processData: false,
            success: (response) => {
                VERIFICATION_CODE = response
            },
            error: function (request, status, error) {
                alert("Error!")
            },
        });
    })

    $("#button-verify").click(function(){
        const input_verify = $("#input-verify").val()
        if(input_verify !== VERIFICATION_CODE){
            alert("Wrong Verification Code")
        }else{
            const form_signup = document.getElementById("form-signup");
            let formData = new FormData(form_signup);
            $.ajax({
                url: "/api/v1/seeker/register",
                type: "POST",
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                encrypt: "multipart/form-data",
                processData: false,
                success: (response) => {
                    if(response.status_code == 201){
                        window.location = "/seeker/profile"
                    }else{
                        alert(response)
                    }
                },
                error: function (request, status, error) {
                    alert("Error: " + request.responseJSON.message);
                },
            });
        }
    })