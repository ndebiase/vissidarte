// ***********************************************************
// variabili globali
// ***********************************************************
var SES = {
    xscroll: 0,
    headerwidth: 56,
    ajp: { url: "ajaxvissi.aspx", type: "POST", dataType: "text" },
    logo: "img/logoVissi.png",
    campitab: {
        "0": ["INFO1", "INFO2", "INFO3"]
    },
    campinote: {
        "0": ["NOTE"],
        "1": ["NOTE"],
        "10": ["NOTE"],
        "20": ["NOTE"],
        "30": ["NOTE"]
    },
    campiinfo: {
        "0": ["LIBERO", "TELEFONI", "INDIRIZZO", "LIBERO", "ABILITAZIONI", "LIBERO"],
        "1": ["LIBERO", "TELEFONI", "INDIRIZZO", "LIBERO", "ABILITAZIONI", "LIBERO"],
        "10": ["LIBERO", "TELEFONI", "INDIRIZZO", "LIBERO", "ABILITAZIONI", "LIBERO"],
        "20": ["LIBERO", "TELEFONI", "INDIRIZZO", "LIBERO", "ABILITAZIONI", "LIBERO"],
        "30": ["LIBERO", "TELEFONI", "INDIRIZZO", "LIBERO", "ABILITAZIONI", "LIBERO"]
    },
    cfg: { hidden: " pwd ", readonly: " id lastaccess info note ", t10: " news ", t20: " utenti tabelle " }
};

// ***********************************************************
// qui comincia la parte di supporto alla pagina pubblica
// ***********************************************************
function setWait() {
    $("body").css("cursor", "progress");
}
function resetWait() {
    $("body").css("cursor", "default");
}
function setajp(data) {
    SES.ajp.data = data;
}
function setError(data) {
    if (data.err != null)
        alert(data.err);
    else
        alert("connection error: " + data.status + " - " + data.readyState);
}
// entry point
$(window).load(function () {
    $(window).scroll(myscroll);
    $('#myModal').on('shown.bs.modal', function () {
        $('#login').focus()
    })
    $('#myModal').on('show.bs.modal', function () {
        initLogin(SES.utente);
    })
    //bnews(0, 1);
    //headerTransparent();
});
// animazione header e bottone gotop su scroll
function myscroll(ev) {
    var x = $(window).scrollTop(),
        y = $(window).height(),
        w = $(window).width();
    if (x > 0 && SES.xscroll == 0) {
        $("#logo").animate({ height: SES.headerwidth });
        //$(".navbar-default").css("background-color", "rgba(248,248,248,1)");
        //$(".navbar-default").css("border", "1px");
        $("#motto").animate({ top: (w > 767) ? 200 : 150 });
    }
    if (x == 0 && SES.xscroll > 0) {
        $("#motto").animate({ top: 100 });
        //headerTransparent();
    }
    SES.xscroll = x;
}
// imposta trasparenza header per animazione
function headerTransparent() {
    if ($(window).width() > 1200) {
        $(".navbar-default").css("background-color", "rgba(0,0,0,0)");
        $(".navbar-default").css("border", "0px");
    }
}
// smooth scroll to section id
function scrollto(id) {
    var aTag = $(id);
    $("html,body").animate({ scrollTop: aTag.offset().top - SES.headerwidth }, 'slow');
}
function showDetails(k) {
    alert("show detail N." + k);
}
// inietta le news richieste nella pagina web
function bnews(tipo, noscroll) {
    var k, ret, src, htm, txt, lista = $('#news'), limit = 50;
    if (tipo == null) {
        // cerca nelle news
        src = $('#news-search-input').val();
        tipo = -1;
    }
    setajp({ op: 0, news: tipo, src: src, id: (SES.utente == null || SES.utente.tipo == 0) ? 0 : SES.utente.id });
    $.ajax(SES.ajp).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err != null)
                alert(ret.err);
            else {
                // aggiorna utente loggato
                SES.online = ret.online;
                SES.title = ret.title;
                initLogin(ret.utente);
                // compila la lista
                SES.news = ret.lista;
                htm = "";
                if (false) {
                    // template per vissi fatto con mobirise
                    htm += "<div class='mbr-gallery-layout-default'>";
                    // crea html da iniettare
                    for (k = 0; k < SES.news.length; k++) {
                        htm += "<div><div><div class='mbr-gallery-item mbr-gallery-item__mobirise3 mbr-gallery-item--p1' data-tags='" + SES.news[k].tags + "' data-video-url='false'>" +
                            "<div href='#' data-slide-to=" + k + " data-toggle='modal'>" +
                            "<img alt='" + SES.news[k].alt + "' src='data/" + SES.news[k].img + "'><span class='icon-focus'></span>" +
                            "</div></div></div></div><div class='clearfix'></div>";
                        //if (SES.news[k].href != '' && SES.news[k].href != null)
                        //    htm += "<a href='" + SES.news[k].href + "' target='_blank'>";
                        //if (SES.news[k].img != '' && SES.news[k].img != null)
                        //    htm += "<img src='" + SES.news[k].img + "' />";
                        //htm += SES.news[k].txt;
                        //if (SES.news[k].href != '' && SES.news[k].href != null)
                        //    htm += "</a>";
                        //htm += "</li>";
                    }
                    htm += "</div>";
                    // inietta
                    setContent(htm, "#news");
                }
                else {
                    src = "";
                    for (k = 0; k < SES.news.length; k++) {
                        if (SES.news[k].sez != src) {
                            src = SES.news[k].sez;
                            htm += "<div class='col-lg-12 col-md-12 col-sm-12 myitem tema0'><h1 class='page-header'>" + src + "</h1></div>";
                        }
                        flagdata = (SES.news[k].th.toLowerCase().indexOf('data') >= 0) ? true : false;
                        href = "javascript:showDetails(" + k + ")";
                        htm += "<div class='" + setlargclass(SES.news[k].ll, SES.news[k].th) + "'>" +
                            "<div class='media'>";
                        // se c'è l'immagine la mette
                        if (SES.news[k].img != '' && SES.news[k].img != null) {
                            htm += "<div>";
                            // se c'è anche un href lo abbina all'immagine
                            if (href != "")
                                htm += "<a href='" + href + "'>";
                            htm += "<img class='myimg' src='" + SES.news[k].img + "' title='" + SES.news[k].tit + "' />";
                            if (href != "")
                                htm += "</a>";
                            htm += "</div>";
                        }
                        htm += "</div></div>";
                    }
                    lista.empty();
                    lista.append(htm);
                    //lista.listview('refresh');
                    if (noscroll == null)
                        scrollto("#news");
                    $('.collapse').collapse('hide');
                    setTimeout(function () {
                        $('.mygrid').masonry('destroy')
                        $('.mygrid').masonry({ itemSelector: '.myitem', columnWidth: 60 });
                    }, 2000);
                }
            }
        }
        else {
            setError(data);
        }
    });
}
function settitolo(tit) {
    var ret;
    if (tit.indexOf("<") >= 0)
        ret = tit;
    else
        ret = "<h3 class='media-heading'>" + tit + "</h3>";
    return ret;
}
function setlargclass(l, th) {
    var ret;
    if (l == 1)
        ret = "myitem col-lg-1 col-md-1 col-sm-1 col-xs-3";
    else if (l == 2)
        ret = "myitem col-lg-2 col-md-2 col-sm-3 col-xs-4";
    else if (l == 3)
        ret = "myitem col-lg-3 col-md-3 col-sm-5 col-xs-12";
    else if (l == 4)
        ret = "myitem col-lg-4 col-md-4 col-sm-5 col-xs-12";
    else if (l == 5)
        ret = "myitem col-lg-5 col-md-5 col-sm-5 col-xs-12";
    else if (l == 6)
        ret = "myitem col-lg-6 col-md-6 col-sm-12 col-xs-12";
    else if (l == 7)
        ret = "myitem col-lg-7 col-md-7 col-sm-12 col-xs-12";
    else if (l == 8)
        ret = "myitem col-lg-8 col-md-8 col-sm-12 col-xs-12";
    else if (l == 9)
        ret = "myitem col-lg-9 col-md-9 col-sm-12 col-xs-12";
    else if (l == 10)
        ret = "myitem col-lg-10 col-md-10 col-sm-12 col-xs-12";
    else if (l == 11)
        ret = "myitem col-lg-11 col-md-11 col-sm-12 col-xs-12";
    else if (l == 12)
        ret = "myitem col-lg-12 col-md-12 col-sm-12 col-xs-12";
    else
        ret = "myitem col-lg-3 col-md-3 col-sm-5 col-xs-12";
    return ret + " " + th;
}
// apre una pagina web su un'altra scheda
function gopost(par) {
    $.ajax({
        url: "ajaxreport.aspx",
        type: "POST",
        data: par
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            var win = window.open('myReg', 'myReg');
            win.document.open();
            win.document.write(data.responseText);
            win.document.close();
        }
    });
}
// verifica abilitazione della operazione e lancia una pagina web in una nuova scheda
function ckOp() {
    var par;
    if (SES.tabella.name == "utenti") {
        if (SES.tabella.tipo == 0) {
            par = { op: 1, id: SES.tabella.riga.id };
            gopost(par);
        }
        else if (SES.tabella.tipo == 10) {
            if (SES.utente.tipo != 10 && SES.utente.tipo != 30)
                alert("Non sei abilitato.");
            else if (SES.tabella.materia == null)
                alert("Scegli prima una materia.");
            else {
                par = { op: 0, id: SES.tabella.riga.id, m: SES.tabella.materia, c: SES.tabella.classe };
                gopost(par);
            }
        }
    }
}
function setContent(htm, sel) {
    var content = $("#contenitore");
    if (sel != null)
        content = $(sel);
    content.empty();
    content.append(htm);
    content.trigger("create");
}
//****************************************************
// gestione LOGIN
//****************************************************
// aggiusta la form di gestione account e mostra user corrente e numero accessi
function initLogin(utente) {
    if (utente != null) {
        SES.utente = utente;
        $('.siglaut').text(SES.utente.nome);
        $('#blogin,#bregister,#dochgpwd,#bforgotpwd,#bresetpwd').hide();
        $('#blogout,#bchgpwd').show();
    }
    else {
        $('.siglaut').text("Login");
        $('#formlogin,#blogin,#bregister,#bforgotpwd').show();
        $('#blogout,#bchgpwd,#bnewaccount,#bresetpwd,#dochgpwd,#formchgpwd,#formreg,#formforgot').hide();
    }
    $('#online').text(SES.online);
}
// effettua l'autenticazione
function blogin() {
    var ret, op1 = 1, log = $('#login'), pwd = $('#pwd'), cons=$("#cons");
    if (log.val() == '' || pwd.val() == '' || !cons.is(":checked")) {
        alert("Login and password are required. Check 'I agree' to proceed");
    }
    else {
        if (tagid != null)
            op1 = 2;
        setWait();
        setajp({ op: op1, a: log.val(), b: pwd.val() });
        $.ajax(SES.ajp).complete(function (data) {
            if (data.status == 200 && data.readyState == 4) {
                ret = eval(data.responseText);
                if (ret.err != null)
                    alert(ret.err);
                else {
                    SES.utente = ret;
                    if (SES.utente.id != null) {
                        SES.utente.login = log.val().toUpperCase();
                        initLogin(SES.utente);
                    }
                    else {
                        SES.utente = null;
                        alert('login o password non validi');
                    }
                    log.val('');
                    pwd.val('');
                }
            }
            else
                setError(data);
            resetWait();
        });
    }
}
// effettua il logout (anche lato server)
function blogout() {
    var log = $('#login'),
        pwd = $('#pwd');
    SES.utente = null;
    log.val('');
    pwd.val('');
    initLogin();
    setajp({ op: 2 });
    $.ajax(SES.ajp).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err != null)
                alert(ret.err);
        }
        else {
            setError(data);
        }
    });
}
// mostra la form di cambio password
function changepwd() {
    $('#formlogin,#bchgpwd,#blogout').hide();
    $('#formchgpwd').show();
}
// resetta la password
function resetpwd() {
    var ret, email = $('#email1').val();
    if (email == '') {
        alert("type the email that was used in Sign up.");
    }
    else {
        setWait();
        setajp({ op: 25, e: email });
        $.ajax(SES.ajp).complete(function (data) {
            if (data.status == 200 && data.readyState == 4) {
                ret = eval(data.responseText);
                if (ret.err != null)
                    alert(ret.err);
                else {
                    alert("A new password has been sent.");
                }
            }
            else {
                setError(data);
            }
            resetWait();
        });
    }
}
// effettua il cambio password
function dochangepwd() {
    var ret, oldpwd = $('#oldpwd'), newpwd1 = $('#newpwd1'), newpwd2 = $('#newpwd2');
    if (oldpwd.val() == '' || newpwd1.val() == '' || newpwd1.val() != newpwd2.val()) {
        alert("type the old password and set new password = confirm new password");
    }
    else {
        setWait();
        setajp({ op: 3, b: oldpwd.val(), b2: newpwd1.val() });
        $.ajax(SES.ajp).complete(function (data) {
            if (data.status == 200 && data.readyState == 4) {
                ret = eval(data.responseText);
                if (ret.err != null)
                    alert(ret.err);
                else {
                    oldpwd.val('');
                    newpwd1.val('');
                    newpwd2.val('');
                    alert("Password succesfully changed");
                    blogout();
                }
            }
            else {
                setError(data);
            }
            resetWait();
        });
    }
}
// mostra la form di registrazione
function bregister() {
    $('#formlogin,#blogin,#bregister,#bforgotpwd').hide();
    $('#formreg,#bnewaccount').show();
}
// registra un nuovo account
function bnewaccount() {
    setWait();
    setajp({ op: 24, a: { no: $("#name").val(), co: $("#surname").val(), e: $("#email").val()} });
    $.ajax(SES.ajp).complete(function (data) {
        var ret;
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err == null) {
                alert("The registration succeeded. Check the email to get your credentials.");
            }
            else
                setError(ret);
        }
        else
            setError(data);
        resetWait();
    });
}
function forgotpwd() {
    $('#formlogin,#blogin,#bregister,#bforgotpwd').hide();
    $('#formforgot,#bresetpwd').show();
}