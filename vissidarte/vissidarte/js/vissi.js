var REGISTRO = {
    logo: "img/logomobile.png",
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

$(document).delegate('#pmain', 'pagebeforecreate', function initnews() {
    $(".logo").attr('src', REGISTRO.logo);
    $(".logo").attr('width', 200);
    $('#chgpwd').hide();
    $("#bchgpwd").hide();
    //alert($("#dl").value());
    breport(0);
    igetParametri();
});
function igetParametri() {
    var qq, uri = window.location.search;
    uri.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function ($0, $1, $2, $3) { REGISTRO[$1.toLowerCase()] = $3; }
    );
    if (window.location.pathname.indexOf("admin.htm") >= 0) {
        if (REGISTRO.id != null) {
            REGISTRO.utente = {};
            REGISTRO.utente.id = REGISTRO.id;
            REGISTRO.utente.nome = REGISTRO.nome;
            REGISTRO.utente.email = "";
            document.title = REGISTRO.utente.nome;
            $('.siglaut').text(document.title);
            $('#bchgpwd').show();
        }
    }
}
function breport(tipo) {
    var k, ret, htm, lista = $('#news');
    $.mobile.loading("show");
    $.ajax({
        url: "ajaxbaden.aspx",
        type: "POST",
        dataType: "json",
        data: { op: 0, news: tipo, id: (REGISTRO.utente == null || REGISTRO.utente.tipo == 0) ? 0 : REGISTRO.utente.id }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err != null)
                alert(ret.err);
            else {
                // aggiorna utente loggato
                if (ret.utente != null) {
                    REGISTRO.utente = ret.utente;
                    document.title = REGISTRO.utente.nome;
                    $('.siglaut').text(document.title);
                }
                // compila la lista
                REGISTRO.news = ret.lista;
                htm = "";
                // crea html da iniettare
                for (k = 0; k < REGISTRO.news.length; k++) {
                    htm += "<li>";
                    if (REGISTRO.news[k].href != '' && REGISTRO.news[k].href != null)
                        htm += "<a href='" + REGISTRO.news[k].href + "' target='_blank'>";
                    if (REGISTRO.news[k].img != '' && REGISTRO.news[k].img != null)
                        htm += "<img src='" + REGISTRO.news[k].img + "' />";
                    htm += REGISTRO.news[k].txt;
                    if (REGISTRO.news[k].href != '' && REGISTRO.news[k].href != null)
                        htm += "</a>";
                    htm += "</li>";
                }
                // inietta
                lista.empty();
                lista.append(htm);
                lista.listview('refresh');
            }
        }
        else {
            alert("errore di connessione: " + data.responseText);
        }
        $.mobile.loading("hide");
    });
}
function blogin(tagid) {
    var ret, op1 = 1, log = $('#login'), pwd = $('#pwd');
    if (tagid == null && (log.val() == '' || pwd.val() == '')) {
        alert("login e password sono necessarie per accedere");
    }
    else {
        if (tagid != null)
            op1 = 2;
        $.mobile.loading("show");
        $.ajax({
            url: "ajaxbaden.aspx",
            type: "POST",
            dataType: "json",
            data: { op: op1, a: log.val(), b: pwd.val(), id: tagid }
        }).complete(function (data) {
            if (data.status == 200 && data.readyState == 4) {
                ret = eval(data.responseText);
                if (ret.err != null)
                    alert(ret.err);
                else {
                    REGISTRO.utente = ret;
                    if (REGISTRO.utente.id != null) {
                        REGISTRO.utente.email = log.val().toUpperCase();
                        document.title = REGISTRO.utente.nome;
                        $('.siglaut').text(document.title);
                        $('#bchgpwd').show();
                        REGISTRO.classi = null;
                        $.mobile.changePage('#pmain');
                    }
                    else {
                        REGISTRO.utente = null;
                        alert('login o password non validi');
                    }
                    log.val('');
                    pwd.val('');
                }
            }
            else
                alert("errore di connessione:" + data.statusText);
            $.mobile.loading("hide");
        });
    }
}
function blogout() {
    var log = $('#login'),
        pwd = $('#pwd');
    REGISTRO.utente = null;
    log.val('');
    pwd.val('');
    $('.siglaut').text("...");
    $('#bchangepwd').hide();
    $('#chgpwd').hide();
    $.mobile.loading("show");
    $.ajax({
        url: "ajaxbaden.aspx",
        type: "POST",
        dataType: "json",
        data: { op: 2 }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err != null)
                alert(ret.err);
        }
        else {
            alert("Errore di connessione:" + data.statusText);
        }
        $.mobile.loading("hide");
    });
    $.mobile.changePage('#pmain');
}
function changepwd() {
    if (REGISTRO.utente != null)
        $('#chgpwd').show();
}
function dochangepwd() {
    var ret, oldpwd = $('#oldpwd'), newpwd1 = $('#newpwd1'), newpwd2 = $('#newpwd2');
    if (oldpwd.val() == '' || newpwd1.val() == '' || newpwd1.val() != newpwd2.val()) {
        alert("Impostare la vecchia password e nuova password = conferma nuova password");
    }
    else {
        $.mobile.loading("show");
        $.ajax({
            url: "ajaxbaden.aspx",
            type: "POST",
            dataType: "json",
            data: { op: 3, a: REGISTRO.utente.email, b: oldpwd.val(), b2: newpwd1.val() }
        }).complete(function (data) {
            if (data.status == 200 && data.readyState == 4) {
                ret = eval(data.responseText);
                if (ret.err != null)
                    alert(ret.err);
                else {
                    oldpwd.val('');
                    newpwd1.val('');
                    newpwd2.val('');
                    alert("Password cambiata con successo. Rifare il login");
                    blogout();
                    $('#chgpwd').hide();
                    $.mobile.changePage('#login');
                }
            }
            else {
                alert("Errore di connessione:" + data.statusText);
            }
            $.mobile.loading("hide");
        });
    }
}
function loadFB() {
    window.open("https://www.facebook.com/EnteFondazioneBaden?fref=ts");
}
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
function bonificaHtml(value) {
    var ret = value.replace(/\"/g, "&quot;");
    return ret;
}
function btabelle() {
    var lista;
    if (REGISTRO.utente == null) {
        alert("Credenziali non valide.");
        return;
    }
    setNews("#tiponews");
    lista = $('#lista');
    $.mobile.changePage("#ptabelle");
    $('#navbar1').show();
    REGISTRO.tabella = {};
    lista.empty();
}
function setNews(tn) {
    var k, htm, selected, ret, seltn = $(tn), anno = new Date();
    anno = (anno.getMonth() < 7) ? anno.getFullYear() - 1 : anno.getFullYear();
    $.mobile.loading("show");
    $.ajax({
        url: "ajaxbaden.aspx",
        type: "POST",
        dataType: "json",
        async: false,
        data: { op: 11, abi: REGISTRO.utente.abi }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err != null)
                alert(ret.err);
            else {
                REGISTRO.tabelle = ret;
                htm = "<option value=''>Tipo news</option>";
                for (k = 0; k < ret.tiponews.length; k++)
                    htm += "<option value='" + k + "'>" + ret.tiponews[k].des + "</option>";
                seltn.empty();
                seltn.append(htm);
            }
        }
        else {
            alert("errore di connessione:" + data.statusText);
        }
        $.mobile.loading("hide");
    });
}
function setTipo(valore) {
    REGISTRO.tabella.tipo = valore;
    setReport("#lista");
}
function setTiponews(valore) {
    REGISTRO.tabella.tiponews = valore;
    setReport("#lista");
}
function newItem() {
    if (REGISTRO.tabella.name == "news") {
        REGISTRO.tabella.riga = { id: 0, tipo: (REGISTRO.tabella.tiponews == '') ? 0 : REGISTRO.tabelle.tiponews[REGISTRO.tabella.tiponews].cod, tit: '', txt: 'testo della news', img: '', href: '', href2: '', ord: 0, col: '', dtpub: '', dtexp: '', owner: 0 };
        ediRiga();
        rowAdd();
    }
    else if (REGISTRO.tabella.name == "utenti") {
        REGISTRO.tabella.riga = { id: 0, tagid: '', login: '0.NEW', pwd: '0', tipo: REGISTRO.tabella.tipo, accessi: 0, lastaccess: '', matr: 0, cognome: 'inserire cognome', nome: 'inserire nome', note: '', info: '' };
        ediRiga();
        rowAdd();
    }
    else if (REGISTRO.tabella.name == "tabelle") {
        REGISTRO.tabella.riga = { id: 0, tip: 'NEW', cod: '', des: '', info: '' };
        ediRiga();
        rowAdd();
    }
    else {
        alert("scegli una tabella su cui operare.");
        return;
    }
}
function setReport(ll) {
    var k, htm, qq, lista = $(ll), filtro = $("#filtro1");
    REGISTRO.tabella.filtro = "";
    if (REGISTRO.tabella.name == null) {
        alert("scegli una tabella su cui operare.");
        return;
    }
    qq = filtro.val();
    if (qq != "" && qq.indexOf("=") < 0 && qq.indexOf("<") < 0 && qq.indexOf(">") < 0 && qq.indexOf("%") < 0) {
        if (REGISTRO.tabella.name == "utenti")
            REGISTRO.tabella.filtro = "login like '%" + qq + "%' or cognome like '%" + qq + "%' or nome like '%" + qq + "%'";
        else if (REGISTRO.tabella.name == "tabelle")
            REGISTRO.tabella.filtro = "tip like '%" + qq + "%' or cod like '%" + qq + "%' or des like '%" + qq + "%' or info like '%" + qq + "%'";
        else if (REGISTRO.tabella.name == "news")
            REGISTRO.tabella.filtro = "tit like '%" + qq + "%' or txt like '%" + qq + "%' or op like '%" + qq + "%'";
    }
    else if (qq != "")
        REGISTRO.tabella.filtro = qq;
    else if (REGISTRO.tabella.name == "news" && REGISTRO.tabella.tiponews != "")
        REGISTRO.tabella.filtro = "tipo=" + REGISTRO.tabelle.tiponews[REGISTRO.tabella.tiponews].cod;
    $.mobile.loading("show");
    $.ajax({
        url: "ajaxbaden.aspx",
        type: "POST",
        dataType: "json",
        data: { op: 4, tab: REGISTRO.tabella.name, f: REGISTRO.tabella.filtro, abi: REGISTRO.utente.abi }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            REGISTRO.tabella.data = eval(data.responseText);
            if (REGISTRO.tabella.data.err != null)
                alert(REGISTRO.tabella.data.err);
            else {
                htm = "<table>" + setHeader();
                for (k = 0; k < REGISTRO.tabella.data.length; k++)
                    htm += setRiga(k, REGISTRO.tabella.data[k]);
                htm += "</table>";
                lista.empty();
                lista.append(htm);
            }
        }
        else {
            alert("errore di connessione:" + data.statusText);
        }
        $.mobile.loading("hide");
    });
}
function setRiga(k, x) {
    var htm, i, img, odd = (k % 2 == 0) ? "odd" : "even";
    htm = "<tr class='" + odd + "'><td>";
    htm += "<a href='javascript:ediRiga(" + k + ")'><img class='noprint' src='img/modify.png' width='16' title='modifica'/></a></td>";
    htm += "<td></td>";
    for (i = 0; i < REGISTRO.tabella.cols.length; i++) {
        if ((REGISTRO.tabella.cols[i] == "info" || REGISTRO.tabella.cols[i] == "note") && x[i].length > 15)
            htm += "<td>" + x[i].substring(0, 15) + "...</td>";
        else if (REGISTRO.cfg.hidden.indexOf(" " + REGISTRO.tabella.cols[i] + " ") >= 0)
            htm += "<td></td>";
        else
            htm += "<td>" + x[i] + "</td>";
    }
    htm += "</tr>";
    return htm;
}
function setHeader() {
    var htm, i;
    htm = "<tr><td></td><td></td>";
    for (i = 0; i < REGISTRO.tabella.cols.length; i++) {
        htm += "<th>" + REGISTRO.tabella.cols[i] + "</th>";
    }
    htm += "</tr>";
    return htm;
}
function setTabella(nome) {
    // REGISTRO.tabella = { name: nome, nrec: 0, curr: 0, filtro: '', ord: '', cols: [], data: [] };
    if (REGISTRO.utente.tipo < 20 && nome != "news") {
        alert("Credenziali non valide.");
        return;
    }
    $.mobile.loading("show");
    $.ajax({
        url: "ajaxbaden.aspx",
        type: "POST",
        dataType: "json",
        data: { tab: nome, op: 5 }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err != null)
                alert(ret.err);
            else {
                REGISTRO.tabella = ret;
                if (nome == "news") {
                    setTiponews($("#tiponews").val());
                    $("#bupload").show();
                }
                else {
                    setReport("#lista");
                    $('#bupload').hide();
                }
            }
        }
        else {
            alert("Errore di connessione al server:" + data.statusText);
        }
        $.mobile.loading("hide");
    });
}
// per tabelle
function ediRiga(x) {
    var k, nome, valore, tipo, riga = $("#riga"), htm;
    htm = preparaRiga(x, REGISTRO.cfg);
    htm += "</table></td>";
    if (REGISTRO.tabella.name == "utenti") {
        htm += "<td width='50%' valign='top' align='center'>" + tabInfo() + tabNote() + "</td>";
    }
    else if (REGISTRO.tabella.name == "tabelle") {
        htm += "<td width='50%' valign='top' align='center'>" + tabInfoTabelle() + "</td>";
    }
    else {
        htm += "<td></td>";
    }
    htm += "</tr></table>";
    riga.empty();
    riga.append(htm);
    riga.trigger('create');
    $.mobile.changePage('#priga');
}
function preparaRiga(x, cfg) {
    var k, nome, valore, readonly, tipo = "text", htm = "<table width='100%'><tr><td valign='top'><table>";
    if (x != null)
        REGISTRO.tabella.riga = {};
    for (k = 0; k < REGISTRO.tabella.cols.length; k++) {
        nome = REGISTRO.tabella.cols[k];
        if (x == null)
            valore = REGISTRO.tabella.riga[nome];
        else
            valore = bonificaHtml(REGISTRO.tabella.data[x][k]);
        REGISTRO.tabella.riga[nome] = valore;
        if (cfg.readonly.indexOf(" " + nome + " ") >= 0)
            readonly = " readonly";
        else
            readonly = "";
        if (nome == "txt")
            htm += "<tr><td align='right'>" + nome + ": </td><td width=\"100%\"><textarea id=\"i_" + nome + "\" >" + valore + "</textarea></td></tr>";
        else
            htm += "<tr><td align='right'>" + nome + ": </td><td width=\"100%\"><input type=\"" + tipo + "\" id=\"i_" + nome + "\" value=\"" + valore + "\"" + readonly + "/></td></tr>";
    }
    return htm;
}
function rowAdd() {
    var ret;
    getRiga();
    $.ajax({
        url: "ajaxbaden.aspx",
        type: "POST",
        dataType: "json",
        data: { op: 7, tab: REGISTRO.tabella.name, riga: REGISTRO.tabella.riga }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err == null) {
                if (REGISTRO.tabella.riga.id != null) {
                    REGISTRO.tabella.riga.id = ret.lastid;
                    $("#i_id").val(ret.lastid);
                }
                setReport("#lista");
                alert("La riga è stata aggiunta.");
            }
            else
                alert("Errore: " + ret.err);
        }
        else {
            alert("Errore di connessione al server:" + data.statusText);
        }
    });
}
function rowUpdate() {
    var ret;
    getRiga();
    $.ajax({
        url: "ajaxbaden.aspx",
        type: "POST",
        dataType: "json",
        data: { tab: REGISTRO.tabella.name, op: 8, riga: REGISTRO.tabella.riga }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err == null) {
                setReport("#lista");
                $.mobile.changePage('#ptabelle');
                //alert("La riga è stata aggiornata.");
            }
            else
                alert("Errore: " + ret.err);
        }
        else {
            alert("Errore server: " + data.statusText);
        }
    });
}
function rowDelete() {
    getRiga();
    if (!confirm("Confermi la cancellazione della riga ?"))
        return;
    $.ajax({
        url: "ajaxbaden.aspx",
        type: "POST",
        dataType: "json",
        data: { tab: REGISTRO.tabella.name, op: 6, riga: REGISTRO.tabella.riga }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err == null) {
                setReport("#lista");
                $.mobile.changePage('#ptabelle');
                //alert("La riga è stata cancellata.");
            }
            else
                alert("Errore: " + ret.err);
        }
        else {
            alert("Errore di connessione al server:" + data.statusText);
        }
    });
}
function getRiga() {
    var k, key, info = "", note = "";
    for (key in REGISTRO.tabella.riga) {
        REGISTRO.tabella.riga[key] = $("#i_" + key).val();
        if (key == "info" && REGISTRO.tabella.name == "tabelle") {
            for (k = 0; k < REGISTRO.campitab["0"].length; k++)
                info += $("#yy" + k).val() + ";";
            if (info != "")
                REGISTRO.tabella.riga[key] = info.substring(0, info.length - 1);
        }
        if (key == "info" && REGISTRO.tabella.name == "utenti") {
            for (k = 0; k < REGISTRO.campiinfo[REGISTRO.tabella.riga.tipo].length; k++)
                info += $("#qq" + k).val() + ";";
            if (info != "")
                REGISTRO.tabella.riga[key] = info.substring(0, info.length - 1);
        }
        if (key == "note" && REGISTRO.tabella.name == "utenti") {
            for (k = 0; k < REGISTRO.campinote[REGISTRO.tabella.riga.tipo].length; k++)
                note += $("#ww" + k).val() + ";";
            if (note != "")
                REGISTRO.tabella.riga[key] = note.substring(0, note.length - 1);
        }
    }
    if (REGISTRO.tabella.name == "news")
        REGISTRO.tabella.riga["op"] = REGISTRO.utente.nome;
}
// crea una tabella con i dati di info di tabelle
function tabInfoTabelle(readonly) {
    var k, ro, htm = "<table><tr><th colspan=\"2\">INFO</th></tr>", tipo = "0", qq = REGISTRO.tabella.riga.info.split(';');
    if (readonly)
        ro = " readonly";
    else
        ro = "";
    for (k = 0; k < REGISTRO.campitab[tipo].length; k++) {
        nome = REGISTRO.campitab[tipo][k];
        valore = (qq[k] == null) ? "" : qq[k];
        htm += "<tr><td align=\"right\">" + nome + ": </td><td width=\"100%\"><input type=\"text\" id=\"yy" + k + "\" value=\"" + valore + "\"" + ro + "/></td></tr>";
    }
    htm += "</table>";
    return htm;
}
// crea una tabella con i dati di info di utenti
function tabInfo(readonly) {
    var k, ro, htm = "<table><tr><th colspan=\"2\">INFO</th></tr>", tipo = REGISTRO.tabella.riga.tipo, qq = REGISTRO.tabella.riga.info.split(';');
    if (readonly)
        ro = " readonly";
    else
        ro = "";
    for (k = 0; k < REGISTRO.campiinfo[tipo].length; k++) {
        nome = REGISTRO.campiinfo[tipo][k];
        valore = (qq[k] == null) ? "" : qq[k];
        htm += "<tr><td align=\"right\">" + nome + ": </td><td width=\"100%\"><input type=\"text\" id=\"qq" + k + "\" value=\"" + valore + "\"" + ro + "/></td></tr>";
    }
    htm += "</table>";
    return htm;
}
// crea una tabella con i dati di note
function tabNote(readonly) {
    var k, ro, htm = "<table><tr><th colspan=\"2\">NOTE</th></tr>", tipo = REGISTRO.tabella.riga.tipo, qq = REGISTRO.tabella.riga.note.split(';');
    if (readonly)
        ro = " readonly";
    else
        ro = "";
    for (k = 0; k < REGISTRO.campinote[tipo].length; k++) {
        nome = REGISTRO.campinote[tipo][k];
        valore = (qq[k] == null) ? "" : qq[k];
        htm += "<tr><td align=\"right\">" + nome + ": </td><td width=\"100%\"><input type=\"text\" id=\"ww" + k + "\" value=\"" + valore + "\"" + ro + "/></td></tr>";
    }
    htm += "</table>";
    return htm;
}
function uploadFile() {
    var par = "";
    if (REGISTRO.tabella.name == "news")
        par = "?up=1&txt=" + REGISTRO.tabella.riga.link + "&dir=" + REGISTRO.tabelle.tiponews[REGISTRO.tabella.tiponews].dir;
    window.open("ajaxbaden.aspx" + par, "myupload");
}
function bimporta() {
    var err = "", ret, j, k, r, rqq, f, qq, t = $("#ta").val();
    qq = t.split('\n');
    // importa utenti
    f = qq[0].split(';');
    $.mobile.loading("show");
    for (k = 1; k < qq.length; k++) {
        rqq = qq[k].split(';');
        if (f.length <= rqq.length) {
            r = {};
            for (j = 0; j < f.length; j++) {
                // se il nome del campo è uguale al precedente lo concatena
                if (j > 0 && f[j] == f[j - 1])
                    r[f[j]] += ";" + rqq[j];
                else
                    r[f[j]] = rqq[j];
            }
            $.ajax({
                url: "ajaxbaden.aspx",
                type: "GET",
                dataType: "json",
                async: false,
                data: { op: 9, riga: r }
            }).complete(function (data) {
                if (data.status == 200 && data.readyState == 4) {
                    ret = eval(data.responseText);
                    if (ret.err != null) {
                        err += ret.err + " RIGA:" + k;
                    }
                }
                else {
                    err += "Errore di connessione al server:" + data.statusText + "\n";
                }
            });
        }
        if (err != "")
            break;
    }
    $.mobile.loading("hide");
    if (err != "")
        alert(err);
    else
        alert("FINITO!");
}
function bdelTMP() {
    $.mobile.loading("show");
    $.ajax({
        url: "ajaxbaden.aspx",
        type: "POST",
        dataType: "json",
        data: { op: 15 }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err != null)
                alert(ret.err);
            else
                alert("fatto.");
        }
        else {
            err += "Errore di connessione al server o sessione scaduta.\n";
        }
        $.mobile.loading("hide");
    });
}
function besporta() {
    var par, q1 = $('#icampi').val(), q2 = $('#ifiltri').val(), q3 = $('#iord').val();
    if (q2 == "") {
        alert("Non puoi esportare tutto l'archivio.");
        return;
    }
    par = "?op=10&c=" + q1 + "&f=" + q2 + "&o=" + q3;
    window.open("ajaxadmin.aspx" + par, "mydownload");
}
function ckOp() {
    var par;
    if (REGISTRO.tabella.name == "utenti") {
        if (REGISTRO.tabella.tipo == 0) {
            par = { op: 1, id: REGISTRO.tabella.riga.id };
            gopost(par);
        }
        else if (REGISTRO.tabella.tipo == 10) {
            if (REGISTRO.utente.tipo != 10 && REGISTRO.utente.tipo != 30)
                alert("Non sei abilitato.");
            else if (REGISTRO.tabella.materia == null)
                alert("Scegli prima una materia.");
            else {
                par = { op: 0, id: REGISTRO.tabella.riga.id, m: REGISTRO.tabella.materia, c: REGISTRO.tabella.classe };
                gopost(par);
            }
        }
    }
}
function gopost(par) {
    $.ajax({
        url: "ajaxreport.aspx",
        type: "POST",
        data: par
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            var win = window.open('myReg');
            win.document.open();
            win.document.write(data.responseText);
            win.document.close();
        }
    });
}
function setContent(htm, sel) {
    var content = $("#contenitore");
    if (sel != null)
        content = $(sel);
    content.empty();
    content.append(htm);
    content.trigger("create");
}
