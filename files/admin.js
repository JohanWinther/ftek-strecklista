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
            $("#sendTestEmail").on("click touchend",function (e) {
                e.stopPropagation();
                e.preventDefault();
                if ($(this).attr("disabled") != "disabled") {
                    var to = $("#adminBox input#email").val();
                    if (to != "") {
                        sendEmail(
                            mail_user,
                            mail_pw,
                            mail_name,
                            to,
                            "Testutskick från "+location.href,
                            "Hej!<br><br>Detta meddelande är ett <b>testutskick</b>.<br><br>Med vänlig hälsning<br><a href='"+location.href+"' target='_blank'>"+location.href+"</a>",
                            "0",0);
                    } else {
                        $("#adminBox input#email").focus();
                    }
                }
            });
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
    $("#emailStatus").text("Laddar listan av mail..");
    $("#previewEmails").attr('disabled', true);
    $("#sendEmails").attr('disabled', true);
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
                    sendEmail(mail_user, mail_pw, mail_user, data.emails[e].email, data.emails[e].subject, data.emails[e].body, emailID, 1);
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
            $('html, body').animate({
                scrollTop: $("#sendEmails").offset().top
            }, 500);
        }
        $("#sendEmails").attr('disabled', false);
        $("#previewEmails").attr('disabled', false);
    });
}

// Definiera mailfunktionen
function sendEmail(mail_user, mail_pw, mail_name, to, subject, body, emailID, numberOfTries) {
    console.log(numberOfTries);
    if (numberOfTries <= 3) {
        if (numberOfTries > 0) {
            $("li#"+emailID).find("span.status").text(" - Försöker igen..");
        } else {
            $("#emailList > li#"+emailID).find("span.status").text(" - Skickar..");
        }
        var host = "smtp-mail.outlook.com";
        var port = "587";
        var secure = "tls";
        var url = location.href; // Application url from where the smtp call was made

        // Check if CID and handle server settings
        // User is net.chalmers.se and email can be nothing, student, alumn
        var email = "";
        var regexp = /(.+)@(.*)chalmers\.se/;
        var regArray = regexp.exec(mail_user);
        if (regArray == null || regArray[2] == "net.") {
            email = mail_user;
        } else {
            mail_user = regArray[1]+"@net.chalmers.se";
            email = regArray[1]+"@"+regArray[2]+"chalmers.se";
        }
        console.log(mail_user);
        console.log(email);
        // Add all variables to data string
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
        }, "json");*/

        $.ajax({
            url: "/files/email.php",
            method: "POST",
            data: dataString,
            timeout: 10000,
            dataType: "json"
        }).done(function(data) {
            if (data) {
                $("li#"+emailID).find("span.status").text(" - Klar!");
            } else {
                $("#emailStatus").text("Fel inställningar.");
                sendEmail(mail_user, mail_pw, mail_name, to, subject, body, emailID, numberOfTries+1);
            }
        }).fail(function(data) {
            $("#emailStatus").text("Kunde inte ansluta till servern.");
            sendEmail(mail_user, mail_pw, mail_name, to, subject, body, emailID, numberOfTries+1);
        });
    } else {
        $("li#"+emailID).find("span.status").text(" - Kunde inte skicka!");
    }
}
