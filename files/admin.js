// Sätt globala variabler (dessa hamnar under window)
var email_str = "";
var emailIdx = 0;
var mail_user = "";
var mail_pw = "";
var password = "";

function adminLogin() {
    $("#loginMessage").text("Loggar in..");
    $("#loginBtn").attr('disabled', true);
    password = $("input#password").val();
    $.getJSON(macroURL+"?prefix=adminLogin&pin="+enterCode+"&password="+encodeURIComponent(password)+"&callback=?")
    .done(function(data) {
        if (data != "") {
            mail_user = data.mail_user;
            mail_pw = data.mail_pw;
            mail_name = data.mail_name;
            $("#loginBox").hide();
            $("#adminBox").fadeIn(500);
            $("#previewEmails").on("click touchend",function (e) {
                e.stopPropagation();
                e.preventDefault();
                if ($(this).attr("disabled") != "disabled") {
                    sendEmails(1);
                }
            });
            $("#sendEmails").on("click touchend",function (e) {
                e.stopPropagation();
                e.preventDefault();
                if ($(this).attr("disabled") != "disabled") {
                    sendEmails(0);
                }
            });
        } else {
            $('#loginMessage').text("Fel lösenord.")
            $("#loginBtn").attr('disabled', false);
        }
    })
    .fail(function(data) {
        $("#loginMessage").text("Kunde inte ansluta till servern!");
        $("#loginBtn").attr('disabled', false);
    });
}

function sendEmails(preview) {
    $("#emailStatus").text("Laddar maillista..");
    $("#previewEmails").attr('disabled', true);
    $("#sendEmails").attr('disabled', true);
    }
    $.getJSON(macroURL+"?prefix=getEmails&pin="+enterCode+"&password="+password+"&preview="+preview+"&callback=?")
    .done(function (data) {
        $("#emailList").html("");
        email_str = "";
        emailIdx = 0;
        for (e in data.emails) {
            if (data.emails[e].email != "") {
                emailID = "email"+emailIdx;
                email_str += '<li id="'+emailID+'">';
                email_str += '<span class="to"><a href="mailto:'+data.emails[e].email+'" target="_blank">'+data.emails[e].email+'</a></span><span class="status"></span>';
                if (preview) {
                    email_str += '<br>';
                    email_str += '<span class="subject">' + data.emails[e].subject + '</span>';
                    email_str += '<br>';
                    email_str += '<span class="body">' + data.emails[e].body + '</span>';
                }
                email_str += '</li>';
                if (!preview) {
                    sendEmail(mail_user, mail_pw, mail_user, data.emails[e].email, data.emails[e].subject, data.emails[e].body, emailID);
                }
                emailIdx++;
            }
        }
        if (email_str=="") {
            $("#emailStatus").text("Inga mail skickade.");
        } else {
            $("#emailList").html(email_str);
        }
    })
    .fail(function (data) {
        $("#emailStatus").text("Kunde inte ansluta till servern!");
    });

    $(document).ajaxStop(function() {
        if (email_str!="") {
            if (preview) {
                $("#emailStatus").text("Förhandsgranskning nedan:");
            } else {
                $("#emailStatus").text("Klar!");
            }
        }
        $("#sendEmails").attr('disabled', false);
        $("#previewEmails").attr('disabled', false);
    });
}

// Definiera mailfunktionen
function sendEmail(mail_user, mail_pw, mail_name, to, subject, body, emailID) {
    $("#emailList > ul > li#"+emailID).find("span.status").text(" - Skickar..");
    var host = "smtp-mail.outlook.com",
        port = "587",
        secure = "tls",
        email = mail_user,
        url = location.href;
    dataString = "host="+encodeURIComponent(host);
    dataString += "&port="+encodeURIComponent(port);
    dataString += "&secure="+encodeURIComponent(secure);
    dataString += "&user="+encodeURIComponent(mail_user);
    dataString += "&password="+encodeURIComponent(mail_pw);
    dataString += "&email="+encodeURIComponent(email);
    dataString += "&to="+encodeURIComponent(to);
    dataString += "&from="+encodeURIComponent(mail_name);
    dataString += "&subject="+encodeURIComponent(subject);
    dataString += "&body="+encodeURIComponent(body);
    /*$.post("/files/email.php", dataString, function(data, textStatus) {
        if (textStatus == "success" && data) {
            $("li#"+emailID).find("span.status").text(" - Klar!");
        } else {
            sendEmail(mail_user, mail_pw, mail_name, to, subject, body, emailID);
        }
    }, "json");
    */
    $.ajax({
        url: "/files/email.php",
        method: "POST",
        data: dataString,
        dataType: "json"
    }).done(function(data) {
        console.log(data);
            /*if (textStatus == "success" && data) {
                $("li#"+emailID).find("span.status").text(" - Klar!");
            } else {
                sendEmail(mail_user, mail_pw, mail_name, to, subject, body, emailID);
            }*/
    }).fail(function(data) {
        console.log(data);
    });
}
