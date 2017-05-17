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
        "0": ["FREE", "PHONES", "ADDRESS", "FREE", "PERMISSIONS", "FREE"],
        "1": ["FREE", "PHONES", "ADDRESS", "FREE", "PERMISSIONS", "FREE"],
        "10": ["FREE", "PHONES", "ADDRESS", "FREE", "PERMISSIONS", "FREE"],
        "20": ["FREE", "PHONES", "ADDRESS", "FREE", "PERMISSIONS", "FREE"],
        "30": ["FREE", "PHONES", "ADDRESS", "FREE", "PERMISSIONS", "FREE"]
    },
    cfg: { hidden: " pwd ", readonly: " id lastaccess info note op ", t10: " news ", t20: " utenti tabelle " }
};
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
$(document).delegate('#pmain', 'pagebeforecreate', function initnews() {
    $(".logo").attr('src', SES.logo);
    $(".logo").attr('width', SES.headerwidth);
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
        function ($0, $1, $2, $3) { SES[$1.toLowerCase()] = $3; }
    );
    if (window.location.pathname.indexOf("admin.htm") >= 0) {
        if (SES.id != null) {
            SES.utente = {};
            SES.utente.id = SES.id;
            SES.utente.nome = SES.nome;
            SES.utente.email = "";
            document.title = SES.utente.nome;
            $('.siglaut').text(document.title);
            $('#bchgpwd').show();
        }
    }
}
function breport(tipo) {
    var k, ret, htm, lista = $('#news');
    $.mobile.loading("show");
    $.ajax({
        url: "ajaxvissi.aspx",
        type: "POST",
        dataType: "json",
        data: { op: 0, news: tipo, id: (SES.utente == null || SES.utente.tipo == 0) ? 0 : SES.utente.id }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err != null)
                alert(ret.err);
            else {
                // aggiorna utente loggato
                if (ret.utente != null) {
                    SES.utente = ret.utente;
                    document.title = SES.utente.nome;
                    $('.siglaut').text(document.title);
                }
                // compila la lista
                SES.news = ret.lista;
                htm = "";
                // crea html da iniettare
                for (k = 0; k < SES.news.length; k++) {
                    htm += "<li>";
                    if (SES.news[k].href != '' && SES.news[k].href != null)
                        htm += "<a href='" + SES.news[k].href + "' target='_blank'>";
                    if (SES.news[k].img != '' && SES.news[k].img != null)
                        htm += "<img src='" + SES.news[k].img + "' />";
                    htm += SES.news[k].txt;
                    if (SES.news[k].href != '' && SES.news[k].href != null)
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
            alert("connection error: " + data.responseText);
        }
        $.mobile.loading("hide");
    });
}
function blogin(tagid) {
    var ret, op1 = 1, log = $('#login'), pwd = $('#pwd');
    if (tagid == null && (log.val() == '' || pwd.val() == '')) {
        alert("login and password are required.");
    }
    else {
        if (tagid != null)
            op1 = 2;
        $.mobile.loading("show");
        $.ajax({
            url: "ajaxvissi.aspx",
            type: "POST",
            dataType: "json",
            data: { op: op1, a: log.val(), b: pwd.val(), id: tagid }
        }).complete(function (data) {
            if (data.status == 200 && data.readyState == 4) {
                ret = eval(data.responseText);
                if (ret.err != null)
                    alert(ret.err);
                else {
                    SES.utente = ret;
                    if (SES.utente.id != null) {
                        SES.utente.email = log.val().toUpperCase();
                        document.title = SES.utente.nome;
                        $('.siglaut').text(document.title);
                        $('#bchgpwd').show();
                        SES.classi = null;
                        $.mobile.changePage('#pmain');
                    }
                    else {
                        SES.utente = null;
                        alert('login or password not valid');
                    }
                    log.val('');
                    pwd.val('');
                }
            }
            else
                alert("connection error:" + data.statusText);
            $.mobile.loading("hide");
        });
    }
}
function blogout() {
    var log = $('#login'),
        pwd = $('#pwd');
    SES.utente = null;
    log.val('');
    pwd.val('');
    $('.siglaut').text("...");
    $('#bchangepwd').hide();
    $('#chgpwd').hide();
    $.mobile.loading("show");
    $.ajax({
        url: "ajaxvissi.aspx",
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
            alert("connection error:" + data.statusText);
        }
        $.mobile.loading("hide");
    });
    $.mobile.changePage('#pmain');
}
function changepwd() {
    if (SES.utente != null)
        $('#chgpwd').show();
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
    if (SES.utente == null) {
        alert("Credenziali non valide.");
        return;
    }
    setNews("#tiponews");
    lista = $('#lista');
    $.mobile.changePage("#ptabelle");
    $('#navbar1').show();
    SES.tabella = {};
    lista.empty();
}
function setNews(tn) {
    var k, htm, selected, ret, seltn = $(tn), anno = new Date();
    anno = (anno.getMonth() < 7) ? anno.getFullYear() - 1 : anno.getFullYear();
    $.mobile.loading("show");
    $.ajax({
        url: "ajaxvissi.aspx",
        type: "POST",
        dataType: "json",
        async: false,
        data: { op: 11, abi: SES.utente.abi }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err != null)
                alert(ret.err);
            else {
                SES.tabelle = ret;
                htm = "<option value=''>Category</option>";
                for (k = 0; k < ret.tiponews.length; k++)
                    htm += "<option value='" + k + "'>" + ret.tiponews[k].des + "</option>";
                seltn.empty();
                seltn.append(htm);
            }
        }
        else {
            alert("connection error:" + data.statusText);
        }
        $.mobile.loading("hide");
    });
}
function setTipo(valore) {
    SES.tabella.tipo = valore;
    setReport("#lista");
}
function setTiponews(valore) {
    SES.tabella.tiponews = valore;
    setReport("#lista");
}
function newItem() {
    if (SES.tabella.name == "news") {
        SES.tabella.riga = { id: 0, tipo: (SES.tabella.tiponews == '') ? 0 : SES.tabelle.tiponews[SES.tabella.tiponews].cod, tit: 'title', tags: '', txt: 'description', img: '', href: '', ll: 0, ord: 0, tema: '', dtpub: '', dtexp: '', op: 0 };
        ediRiga();
        rowAdd();
    }
    else if (SES.tabella.name == "utenti") {
        SES.tabella.riga = { id: 0, tagid: '', login: '0.NEW', pwd: '0', tipo: SES.tabella.tipo, accessi: 0, lastaccess: '', matr: 0, cognome: 'insert surname', nome: 'insert name', note: '', info: '' };
        ediRiga();
        rowAdd();
    }
    else if (SES.tabella.name == "tabelle") {
        SES.tabella.riga = { id: 0, tip: 'NEW', cod: '', des: '', info: '' };
        ediRiga();
        rowAdd();
    }
    else {
        alert("you must select a table.");
        return;
    }
}
function setReport(ll) {
    var k, htm, qq, lista = $(ll), filtro = $("#filtro1");
    SES.tabella.filtro = "";
    if (SES.tabella.name == null) {
        alert("you must select a table.");
        return;
    }
    qq = filtro.val();
    if (qq != "" && qq.indexOf("=") < 0 && qq.indexOf("<") < 0 && qq.indexOf(">") < 0 && qq.indexOf("%") < 0) {
        if (SES.tabella.name == "utenti")
            SES.tabella.filtro = "login like '%" + qq + "%' or cognome like '%" + qq + "%' or nome like '%" + qq + "%'";
        else if (SES.tabella.name == "tabelle")
            SES.tabella.filtro = "tip like '%" + qq + "%' or cod like '%" + qq + "%' or des like '%" + qq + "%' or info like '%" + qq + "%'";
        else if (SES.tabella.name == "news")
            SES.tabella.filtro = "tit like '%" + qq + "%' or txt like '%" + qq + "%' or op like '%" + qq + "%'";
    }
    else if (qq != "")
        SES.tabella.filtro = qq;
    else if (SES.tabella.name == "news" && SES.tabella.tiponews != "")
        SES.tabella.filtro = "tipo=" + SES.tabelle.tiponews[SES.tabella.tiponews].cod;
    $.mobile.loading("show");
    $.ajax({
        url: "ajaxvissi.aspx",
        type: "POST",
        dataType: "json",
        data: { op: 4, tab: SES.tabella.name, f: SES.tabella.filtro, abi: SES.utente.abi }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            SES.tabella.data = eval(data.responseText);
            if (SES.tabella.data.err != null)
                alert(SES.tabella.data.err);
            else {
                htm = "<table>" + setHeader();
                for (k = 0; k < SES.tabella.data.length; k++)
                    htm += setRiga(k, SES.tabella.data[k]);
                htm += "</table>";
                lista.empty();
                lista.append(htm);
            }
        }
        else {
            alert("connection error:" + data.statusText);
        }
        $.mobile.loading("hide");
    });
}
function setRiga(k, x) {
    var htm, i, img, odd = (k % 2 == 0) ? "odd" : "even";
    htm = "<tr class='" + odd + "'><td>";
    htm += "<a href='javascript:ediRiga(" + k + ")'><img class='noprint' src='img/modify.png' width='16' title='modifica'/></a></td>";
    htm += "<td></td>";
    for (i = 0; i < SES.tabella.cols.length; i++) {
        if ((SES.tabella.cols[i] == "info" || SES.tabella.cols[i] == "note") && x[i].length > 15)
            htm += "<td>" + x[i].substring(0, 15) + "...</td>";
        else if (SES.cfg.hidden.indexOf(" " + SES.tabella.cols[i] + " ") >= 0)
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
    for (i = 0; i < SES.tabella.cols.length; i++) {
        htm += "<th>" + SES.tabella.cols[i] + "</th>";
    }
    htm += "</tr>";
    return htm;
}
function setTabella(nome) {
    // SES.tabella = { name: nome, nrec: 0, curr: 0, filtro: '', ord: '', cols: [], data: [] };
    if (SES.utente.tipo < 20 && nome != "news") {
        alert("Invalid credentials.");
        return;
    }
    $.mobile.loading("show");
    $.ajax({
        url: "ajaxvissi.aspx",
        type: "POST",
        dataType: "json",
        data: { tab: nome, op: 5 }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err != null)
                alert(ret.err);
            else {
                SES.tabella = ret;
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
            alert("connection error:" + data.statusText);
        }
        $.mobile.loading("hide");
    });
}
// per tabelle
function ediRiga(x) {
    var k, nome, valore, tipo, riga = $("#riga"), htm;
    htm = preparaRiga(x, SES.cfg);
    htm += "</table></td>";
    if (SES.tabella.name == "utenti") {
        htm += "<td width='50%' valign='top' align='center'>" + tabInfo() + tabNote() + "</td>";
    }
    else if (SES.tabella.name == "tabelle") {
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
        SES.tabella.riga = {};
    for (k = 0; k < SES.tabella.cols.length; k++) {
        nome = SES.tabella.cols[k];
        if (x == null)
            valore = SES.tabella.riga[nome];
        else
            valore = bonificaHtml(SES.tabella.data[x][k]);
        SES.tabella.riga[nome] = valore;
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
        url: "ajaxvissi.aspx",
        type: "POST",
        dataType: "json",
        data: { op: 7, tab: SES.tabella.name, riga: SES.tabella.riga }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err == null) {
                if (SES.tabella.riga.id != null) {
                    SES.tabella.riga.id = ret.lastid;
                    $("#i_id").val(ret.lastid);
                }
                setReport("#lista");
                alert("The item has been added.");
            }
            else
                alert("Error: " + ret.err);
        }
        else {
            alert("connection error:" + data.statusText);
        }
    });
}
function rowUpdate() {
    var ret;
    getRiga();
    $.ajax({
        url: "ajaxvissi.aspx",
        type: "POST",
        dataType: "json",
        data: { tab: SES.tabella.name, op: 8, riga: SES.tabella.riga }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err == null) {
                setReport("#lista");
                $.mobile.changePage('#ptabelle');
                //alert("La riga è stata aggiornata.");
            }
            else
                alert("Error: " + ret.err);
        }
        else {
            alert("connection error: " + data.statusText);
        }
    });
}
function rowDelete() {
    getRiga();
    if (!confirm("Confirm the item deletion ?"))
        return;
    $.ajax({
        url: "ajaxvissi.aspx",
        type: "POST",
        dataType: "json",
        data: { tab: SES.tabella.name, op: 6, riga: SES.tabella.riga }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err == null) {
                setReport("#lista");
                $.mobile.changePage('#ptabelle');
                //alert("La riga è stata cancellata.");
            }
            else
                alert("Error: " + ret.err);
        }
        else {
            alert("connection error:" + data.statusText);
        }
    });
}
function getRiga() {
    var k, key, info = "", note = "";
    for (key in SES.tabella.riga) {
        SES.tabella.riga[key] = $("#i_" + key).val();
        if (key == "info" && SES.tabella.name == "tabelle") {
            for (k = 0; k < SES.campitab["0"].length; k++)
                info += $("#yy" + k).val() + "|";
            if (info != "")
                SES.tabella.riga[key] = info.substring(0, info.length - 1);
        }
        if (key == "info" && SES.tabella.name == "utenti") {
            for (k = 0; k < SES.campiinfo[SES.tabella.riga.tipo].length; k++)
                info += $("#qq" + k).val() + "|";
            if (info != "")
                SES.tabella.riga[key] = info.substring(0, info.length - 1);
        }
        if (key == "note" && SES.tabella.name == "utenti") {
            for (k = 0; k < SES.campinote[SES.tabella.riga.tipo].length; k++)
                note += $("#ww" + k).val() + "|";
            if (note != "")
                SES.tabella.riga[key] = note.substring(0, note.length - 1);
        }
    }
    if (SES.tabella.name == "news")
        SES.tabella.riga["op"] = SES.utente.nome;
}
// crea una tabella con i dati di info di tabelle
function tabInfoTabelle(readonly) {
    var k, ro, htm = "<table><tr><th colspan=\"2\">INFO</th></tr>", tipo = "0", qq = SES.tabella.riga.info.split('|');
    if (readonly)
        ro = " readonly";
    else
        ro = "";
    for (k = 0; k < SES.campitab[tipo].length; k++) {
        nome = SES.campitab[tipo][k];
        valore = (qq[k] == null) ? "" : qq[k];
        htm += "<tr><td align=\"right\">" + nome + ": </td><td width=\"100%\"><input type=\"text\" id=\"yy" + k + "\" value=\"" + valore + "\"" + ro + "/></td></tr>";
    }
    htm += "</table>";
    return htm;
}
// crea una tabella con i dati di info di utenti
function tabInfo(readonly) {
    var k, ro, htm = "<table><tr><th colspan=\"2\">INFO</th></tr>", tipo = SES.tabella.riga.tipo, qq = SES.tabella.riga.info.split('|');
    if (readonly)
        ro = " readonly";
    else
        ro = "";
    for (k = 0; k < SES.campiinfo[tipo].length; k++) {
        nome = SES.campiinfo[tipo][k];
        valore = (qq[k] == null) ? "" : qq[k];
        htm += "<tr><td align=\"right\">" + nome + ": </td><td width=\"100%\"><input type=\"text\" id=\"qq" + k + "\" value=\"" + valore + "\"" + ro + "/></td></tr>";
    }
    htm += "</table>";
    return htm;
}
// crea una tabella con i dati di note
function tabNote(readonly) {
    var k, ro, htm = "<table><tr><th colspan=\"2\">NOTE</th></tr>", tipo = SES.tabella.riga.tipo, qq = SES.tabella.riga.note.split('|');
    if (readonly)
        ro = " readonly";
    else
        ro = "";
    for (k = 0; k < SES.campinote[tipo].length; k++) {
        nome = SES.campinote[tipo][k];
        valore = (qq[k] == null) ? "" : qq[k];
        htm += "<tr><td align=\"right\">" + nome + ": </td><td width=\"100%\"><input type=\"text\" id=\"ww" + k + "\" value=\"" + valore + "\"" + ro + "/></td></tr>";
    }
    htm += "</table>";
    return htm;
}
function uploadFile() {
    var par = "";
    if (SES.tabella.name == "news")
        par = "?up=1&txt=" + SES.tabella.riga.link + "&dir=" + SES.tabelle.tiponews[SES.tabella.tiponews].dir.split('|')[0];
    window.open("ajaxvissi.aspx" + par, "myupload");
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
                url: "ajaxvissi.aspx",
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
                    err += "connection error:" + data.statusText + "\n";
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
        alert("DONE!");
}
function bdelTMP() {
    $.mobile.loading("show");
    $.ajax({
        url: "ajaxvissi.aspx",
        type: "POST",
        dataType: "json",
        data: { op: 13 }
    }).complete(function (data) {
        if (data.status == 200 && data.readyState == 4) {
            ret = eval(data.responseText);
            if (ret.err != null)
                alert(ret.err);
            else
                alert("done.");
        }
        else {
            err += "connection error or session expired.\n";
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
    if (SES.tabella.name == "utenti") {
        if (SES.tabella.tipo == 0) {
            par = { op: 1, id: SES.tabella.riga.id };
            gopost(par);
        }
        else if (SES.tabella.tipo == 10) {
            if (SES.utente.tipo != 10 && SES.utente.tipo != 30)
                alert("You are not enabled.");
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
function dochangepwd() {
    var ret, oldpwd = $('#oldpwd'), newpwd1 = $('#newpwd1'), newpwd2 = $('#newpwd2');
    if (oldpwd.val() == '' || newpwd1.val() == '' || newpwd1.val() != newpwd2.val()) {
        alert("type the old password and set new password = confirm new password");
    }
    else {
        $.mobile.loading("show");
        $.ajax({
            url: "ajaxvissi.aspx",
            type: "POST",
            dataType: "json",
            data: { op: 3, a: SES.utente.email, b: oldpwd.val(), b2: newpwd1.val() }
        }).complete(function (data) {
            if (data.status == 200 && data.readyState == 4) {
                ret = eval(data.responseText);
                if (ret.err != null)
                    alert(ret.err);
                else {
                    oldpwd.val('');
                    newpwd1.val('');
                    newpwd2.val('');
                    alert("Password succesfully changed.");
                    blogout();
                    $('#chgpwd').hide();
                    $.mobile.changePage('#login');
                }
            }
            else {
                alert("Connection error:" + data.statusText);
            }
            $.mobile.loading("hide");
        });
    }
}
