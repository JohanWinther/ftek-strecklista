// Sätt globala variabler (dessa hamnar under window)
var email_str = "";
var emailIdx = 0;
var emailState = [];
var preview = false;
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
                if (dragging) {
                    dragging = false;
                    return;
                }
                if ($(this).attr("disabled") != "disabled") {
                    var to = $("#adminBox input#email").val();
                    if (to != "") {
                        $("#emailList").slideUp(500);
                        $("#emailList").html("");
                        sendEmail(
                            mail_user,
                            mail_pw,
                            mail_name,
                            to,
                            "Testutskick från "+location.href,
                            "Hej!<br><br>Detta meddelande är ett <b>testutskick</b>.<br><br>Med vänlig hälsning<br><a href='"+location.href+"' target='_blank'>"+location.href+"</a>",
                            "0",0);
                        $("#adminBox input#email").val("");
                    } else {
                        $("#adminBox input#email").focus();
                    }
                }
            });
            $("#previewEmails").on("click touchend",function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (dragging) {
                    dragging = false;
                    return;
                }
                if ($(this).attr("disabled") != "disabled") {
                    preview = true;
                    sendEmails();
                }
            });
            $("#sendEmails").on("click touchend",function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (dragging) {
                    dragging = false;
                    return;
                }
                if ($(this).attr("disabled") != "disabled") {
                    preview = false;
                    sendEmails();
                }
            });

            $(document).ajaxStop(function() {
                if (email_str!="") {
                    if (preview) {
                        $("#emailStatus").text("Sändningsadress "+mail_user+" ("+mail_name+")");
                        email_str = "";
                        $("#sendEmails").attr('disabled', false);
                        $("#previewEmails").attr('disabled', false);
                        $('html, body').animate({
                            scrollTop: $("#sendEmails").offset().top
                        }, 500);
                    } else {
                        if (emailState.every(function(el){return el==1})) {
                            $("#emailStatus").text("Klar!");
                            email_str = "";
                            emailState = [];
                            $("#sendEmails").attr('disabled', false);
                            $("#previewEmails").attr('disabled', false);
                            $('html, body').animate({
                                scrollTop: $("#sendEmails").offset().top
                            }, 500);
                        } else {
                            $("#emailStatus").text("Skickar mail (stäng inte sidan!)..");
                        }
                    }
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

function sendEmails() {
    $("#emailStatus").text("Laddar listan av mail..");
    $("#previewEmails").attr('disabled', true);
    $("#sendEmails").attr('disabled', true);
    $.getJSON(macroURL+"?prefix=getEmails&pin="+enterCode+"&password="+password+"&preview="+preview+"&callback=?")
    .done(function (data) {
        $("#emailList").html("");
        $("#emailList").slideUp(500);
        email_str = "";
        emailIdx = 0;
        if (!preview) {
            emailState = Array.apply(null, Array(data.emails.length)).map(Number.prototype.valueOf,0);
        }

        for (e in data.emails) {
            if (data.emails[e].email != "") {
                emailID = "email"+emailIdx;
                email_str += '<li id="'+emailID+'">';
                email_str += '<span class="to"><a href="mailto:'+data.emails[e].email+'" target="_blank">'+data.emails[e].email+'</a> ('+data.emails[e].nick+')</span><span class="status"></span>';
                if (preview) {
                    email_str += '<br>';
                    email_str += '<span class="subject">' + data.emails[e].subject + '</span>';
                    email_str += '<br>';
                    email_str += '<span class="body">' + data.emails[e].body + '</span>';
                }
                email_str += '</li>';
                if (!preview) {
                    // create a closure to preserve the value of "i"
                    (function(e,emailIdx){
                        window.setTimeout(function(){
                            sendEmail(mail_user, mail_pw, mail_name, data.emails[e].email, data.emails[e].subject, data.emails[e].body, emailIdx, 0);
                        }, e * 2000);
                    }(e,emailIdx));
                }
                emailIdx++;
            }
        }
        if (email_str=="") {
            $("#emailStatus").text("Inga mail.");
        } else {
            $("#emailList").html(email_str);
            $("#emailList").fadeIn(500);
            if (!preview) {
                $("#emailStatus").text("Skickar mail (stäng inte sidan)..");
            }
        }
    })
    .fail(function (data) {
        $("#emailStatus").text("Kunde inte ansluta till servern!");
    });
}

// Definiera mailfunktionen
function sendEmail(mail_user, mail_pw, mail_name, to, subject, body, emailIdx, numberOfTries) {
    if (numberOfTries <= 3) {
        if (numberOfTries > 0) {
            $("li#email"+emailIdx).find("span.status").text(" - Försök nr "+numberOfTries+"..");
        } else {
            $("#emailList > li#email"+emailIdx).find("span.status").text(" - Skickar..");
        }
        var host = "smtp-mail.outlook.com";
        var port = "587";
        var secure = "tls";
        var url = location.href; // Application url from where the smtp call was made

        // If CID use net.chalmers.se and email student.chalmers.se
        var email = "";
        var regexp = /(.+)@(.*)chalmers\.se/;
        var regArray = regexp.exec(mail_user);
        if (regArray == null) {
            email = mail_user;
        } else {
            mail_user = regArray[1]+"@net.chalmers.se";
            email = regArray[1]+"@student.chalmers.se";
        }

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

        $.ajax({
            url: "/resources/php/email.php",
            method: "POST",
            data: dataString,
            timeout: 10000,
            dataType: "json"
        }).done(function(data) {
            console.log(data);
            if (data) {
                $("li#email"+emailIdx).find("span.status").text(" - Klar!");
                emailState[emailIdx] = 1;
            } else if (data.statusText == undefined) {
                sendEmail(mail_user, mail_pw, mail_name, to, subject, body, emailIdx, numberOfTries+1);
            } else {
                $("li#"+emailIdx).find("span.status").text(" - Klar!");
                emailState[emailIdx] = 1;
            }
        }).fail(function(data) {
            console.log(data);
            sendEmail(mail_user, mail_pw, mail_name, to, subject, body, emailIdx, numberOfTries+1);
        });
    } else {
        $("li#email"+emailIdx).find("span.status").text(" - Kunde inte skicka!");
    }
}