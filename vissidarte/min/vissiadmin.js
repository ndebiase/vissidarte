var SES={xscroll:0,headerwidth:56,ajp:{url:"ajaxvissi.aspx",type:"POST",dataType:"text"},logo:"img/logoVissi.png",campitab:{"0":["INFO1","INFO2","INFO3"]},campinote:{"0":["NOTE"],"1":["NOTE"],"10":["NOTE"],"20":["NOTE"],"30":["NOTE"]},campiinfo:{"0":["FREE","PHONES","ADDRESS","FREE","PERMISSIONS","FREE"],"1":["FREE","PHONES","ADDRESS","FREE","PERMISSIONS","FREE"],"10":["FREE","PHONES","ADDRESS","FREE","PERMISSIONS","FREE"],"20":["FREE","PHONES","ADDRESS","FREE","PERMISSIONS","FREE"],"30":["FREE","PHONES","ADDRESS","FREE","PERMISSIONS","FREE"]},cfg:{hidden:" pwd ",readonly:" id lastaccess info note op ",t10:" news ",t20:" utenti tabelle "}};function setWait(){$("body").css("cursor","progress")}function resetWait(){$("body").css("cursor","default")}function setajp(a){SES.ajp.data=a}function setError(a){if(a.err!=null){alert(a.err)}else{alert("connection error: "+a.status+" - "+a.readyState)}}$(document).delegate("#pmain","pagebeforecreate",function initnews(){$(".logo").attr("src",SES.logo);$(".logo").attr("width",SES.headerwidth);$("#chgpwd").hide();$("#bchgpwd").hide();breport(0);igetParametri()});function igetParametri(){var a,b=window.location.search;b.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"),function(d,c,f,e){SES[c.toLowerCase()]=e});if(window.location.pathname.indexOf("admin.htm")>=0){if(SES.id!=null){SES.utente={};SES.utente.id=SES.id;SES.utente.nome=SES.nome;SES.utente.email="";document.title=SES.utente.nome;$(".siglaut").text(document.title);$("#bchgpwd").show()}}}function breport(tipo){var k,ret,htm,lista=$("#news");$.mobile.loading("show");$.ajax({url:"ajaxvissi.aspx",type:"POST",dataType:"json",data:{op:0,news:tipo,id:(SES.utente==null||SES.utente.tipo==0)?0:SES.utente.id}}).complete(function(data){if(data.status==200&&data.readyState==4){ret=eval(data.responseText);if(ret.err!=null){alert(ret.err)}else{if(ret.utente!=null){SES.utente=ret.utente;document.title=SES.utente.nome;$(".siglaut").text(document.title)}SES.news=ret.lista;htm="";for(k=0;k<SES.news.length;k++){htm+="<li>";if(SES.news[k].href!=""&&SES.news[k].href!=null){htm+="<a href='"+SES.news[k].href+"' target='_blank'>"}if(SES.news[k].img!=""&&SES.news[k].img!=null){htm+="<img src='"+SES.news[k].img+"' />"}htm+=SES.news[k].txt;if(SES.news[k].href!=""&&SES.news[k].href!=null){htm+="</a>"}htm+="</li>"}lista.empty();lista.append(htm);lista.listview("refresh")}}else{alert("connection error: "+data.responseText)}$.mobile.loading("hide")})}function blogin(tagid){var ret,op1=1,log=$("#login"),pwd=$("#pwd");if(tagid==null&&(log.val()==""||pwd.val()=="")){alert("login and password are required.")}else{if(tagid!=null){op1=2}$.mobile.loading("show");$.ajax({url:"ajaxvissi.aspx",type:"POST",dataType:"json",data:{op:op1,a:log.val(),b:pwd.val(),id:tagid}}).complete(function(data){if(data.status==200&&data.readyState==4){ret=eval(data.responseText);if(ret.err!=null){alert(ret.err)}else{SES.utente=ret;if(SES.utente.id!=null){SES.utente.email=log.val().toUpperCase();document.title=SES.utente.nome;$(".siglaut").text(document.title);$("#bchgpwd").show();SES.classi=null;$.mobile.changePage("#pmain")}else{SES.utente=null;alert("login or password not valid")}log.val("");pwd.val("")}}else{alert("connection error:"+data.statusText)}$.mobile.loading("hide")})}}function blogout(){var log=$("#login"),pwd=$("#pwd");SES.utente=null;log.val("");pwd.val("");$(".siglaut").text("...");$("#bchangepwd").hide();$("#chgpwd").hide();$.mobile.loading("show");$.ajax({url:"ajaxvissi.aspx",type:"POST",dataType:"json",data:{op:2}}).complete(function(data){if(data.status==200&&data.readyState==4){ret=eval(data.responseText);if(ret.err!=null){alert(ret.err)}}else{alert("connection error:"+data.statusText)}$.mobile.loading("hide")});$.mobile.changePage("#pmain")}function changepwd(){if(SES.utente!=null){$("#chgpwd").show()}}function gopost(a){$.ajax({url:"ajaxreport.aspx",type:"POST",data:a}).complete(function(b){if(b.status==200&&b.readyState==4){var c=window.open("myReg","myReg");c.document.open();c.document.write(b.responseText);c.document.close()}})}function bonificaHtml(b){var a=b.replace(/\"/g,"&quot;");return a}function btabelle(){var a;if(SES.utente==null){alert("Credenziali non valide.");return}setNews("#tiponews");a=$("#lista");$.mobile.changePage("#ptabelle");$("#navbar1").show();SES.tabella={};a.empty()}function setNews(tn){var k,htm,selected,ret,seltn=$(tn),anno=new Date();anno=(anno.getMonth()<7)?anno.getFullYear()-1:anno.getFullYear();$.mobile.loading("show");$.ajax({url:"ajaxvissi.aspx",type:"POST",dataType:"json",async:false,data:{op:11,abi:SES.utente.abi}}).complete(function(data){if(data.status==200&&data.readyState==4){ret=eval(data.responseText);if(ret.err!=null){alert(ret.err)}else{SES.tabelle=ret;htm="<option value=''>Category</option>";for(k=0;k<ret.tiponews.length;k++){htm+="<option value='"+k+"'>"+ret.tiponews[k].des+"</option>"}seltn.empty();seltn.append(htm)}}else{alert("connection error:"+data.statusText)}$.mobile.loading("hide")})}function setTipo(a){SES.tabella.tipo=a;setReport("#lista")}function setTiponews(a){SES.tabella.tiponews=a;setReport("#lista")}function newItem(){if(SES.tabella.name=="news"){SES.tabella.riga={id:0,tipo:(SES.tabella.tiponews=="")?0:SES.tabelle.tiponews[SES.tabella.tiponews].cod,tit:"title",tags:"",txt:"description",img:"",href:"",ll:0,ord:0,tema:"",dtpub:"",dtexp:"",op:0};ediRiga();rowAdd()}else{if(SES.tabella.name=="utenti"){SES.tabella.riga={id:0,tagid:"",login:"0.NEW",pwd:"0",tipo:SES.tabella.tipo,accessi:0,lastaccess:"",matr:0,cognome:"insert surname",nome:"insert name",note:"",info:""};ediRiga();rowAdd()}else{if(SES.tabella.name=="tabelle"){SES.tabella.riga={id:0,tip:"NEW",cod:"",des:"",info:""};ediRiga();rowAdd()}else{alert("you must select a table.");return}}}}function setReport(ll){var k,htm,qq,lista=$(ll),filtro=$("#filtro1");SES.tabella.filtro="";if(SES.tabella.name==null){alert("you must select a table.");return}qq=filtro.val();if(qq!=""&&qq.indexOf("=")<0&&qq.indexOf("<")<0&&qq.indexOf(">")<0&&qq.indexOf("%")<0){if(SES.tabella.name=="utenti"){SES.tabella.filtro="login like '%"+qq+"%' or cognome like '%"+qq+"%' or nome like '%"+qq+"%'"}else{if(SES.tabella.name=="tabelle"){SES.tabella.filtro="tip like '%"+qq+"%' or cod like '%"+qq+"%' or des like '%"+qq+"%' or info like '%"+qq+"%'"}else{if(SES.tabella.name=="news"){SES.tabella.filtro="tit like '%"+qq+"%' or txt like '%"+qq+"%' or op like '%"+qq+"%'"}}}}else{if(qq!=""){SES.tabella.filtro=qq}else{if(SES.tabella.name=="news"&&SES.tabella.tiponews!=""){SES.tabella.filtro="tipo="+SES.tabelle.tiponews[SES.tabella.tiponews].cod}}}$.mobile.loading("show");$.ajax({url:"ajaxvissi.aspx",type:"POST",dataType:"json",data:{op:4,tab:SES.tabella.name,f:SES.tabella.filtro,abi:SES.utente.abi}}).complete(function(data){if(data.status==200&&data.readyState==4){SES.tabella.data=eval(data.responseText);if(SES.tabella.data.err!=null){alert(SES.tabella.data.err)}else{htm="<table>"+setHeader();for(k=0;k<SES.tabella.data.length;k++){htm+=setRiga(k,SES.tabella.data[k])}htm+="</table>";lista.empty();lista.append(htm)}}else{alert("connection error:"+data.statusText)}$.mobile.loading("hide")})}function setRiga(c,a){var d,e,b,f=(c%2==0)?"odd":"even";d="<tr class='"+f+"'><td>";d+="<a href='javascript:ediRiga("+c+")'><img class='noprint' src='img/modify.png' width='16' title='modifica'/></a></td>";d+="<td></td>";for(e=0;e<SES.tabella.cols.length;e++){if((SES.tabella.cols[e]=="info"||SES.tabella.cols[e]=="note")&&a[e].length>15){d+="<td>"+a[e].substring(0,15)+"...</td>"}else{if(SES.cfg.hidden.indexOf(" "+SES.tabella.cols[e]+" ")>=0){d+="<td></td>"}else{d+="<td>"+a[e]+"</td>"}}}d+="</tr>";return d}function setHeader(){var a,b;a="<tr><td></td><td></td>";for(b=0;b<SES.tabella.cols.length;b++){a+="<th>"+SES.tabella.cols[b]+"</th>"}a+="</tr>";return a}function setTabella(nome){if(SES.utente.tipo<20&&nome!="news"){alert("Invalid credentials.");return}$.mobile.loading("show");$.ajax({url:"ajaxvissi.aspx",type:"POST",dataType:"json",data:{tab:nome,op:5}}).complete(function(data){if(data.status==200&&data.readyState==4){ret=eval(data.responseText);if(ret.err!=null){alert(ret.err)}else{SES.tabella=ret;if(nome=="news"){setTiponews($("#tiponews").val());$("#bupload").show()}else{setReport("#lista");$("#bupload").hide()}}}else{alert("connection error:"+data.statusText)}$.mobile.loading("hide")})}function ediRiga(b){var d,c,a,f,g=$("#riga"),e;e=preparaRiga(b,SES.cfg);e+="</table></td>";if(SES.tabella.name=="utenti"){e+="<td width='50%' valign='top' align='center'>"+tabInfo()+tabNote()+"</td>"}else{if(SES.tabella.name=="tabelle"){e+="<td width='50%' valign='top' align='center'>"+tabInfoTabelle()+"</td>"}else{e+="<td></td>"}}e+="</tr></table>";g.empty();g.append(e);g.trigger("create");$.mobile.changePage("#priga")}function preparaRiga(b,c){var f,e,a,d,h="text",g="<table width='100%'><tr><td valign='top'><table>";if(b!=null){SES.tabella.riga={}}for(f=0;f<SES.tabella.cols.length;f++){e=SES.tabella.cols[f];if(b==null){a=SES.tabella.riga[e]}else{a=bonificaHtml(SES.tabella.data[b][f])}SES.tabella.riga[e]=a;if(c.readonly.indexOf(" "+e+" ")>=0){d=" readonly"}else{d=""}if(e=="txt"){g+="<tr><td align='right'>"+e+': </td><td width="100%"><textarea id="i_'+e+'" >'+a+"</textarea></td></tr>"}else{g+="<tr><td align='right'>"+e+': </td><td width="100%"><input type="'+h+'" id="i_'+e+'" value="'+a+'"'+d+"/></td></tr>"}}return g}function rowAdd(){var ret;getRiga();$.ajax({url:"ajaxvissi.aspx",type:"POST",dataType:"json",data:{op:7,tab:SES.tabella.name,riga:SES.tabella.riga}}).complete(function(data){if(data.status==200&&data.readyState==4){ret=eval(data.responseText);if(ret.err==null){if(SES.tabella.riga.id!=null){SES.tabella.riga.id=ret.lastid;$("#i_id").val(ret.lastid)}setReport("#lista");alert("The item has been added.")}else{alert("Error: "+ret.err)}}else{alert("connection error:"+data.statusText)}})}function rowUpdate(){var ret;getRiga();$.ajax({url:"ajaxvissi.aspx",type:"POST",dataType:"json",data:{tab:SES.tabella.name,op:8,riga:SES.tabella.riga}}).complete(function(data){if(data.status==200&&data.readyState==4){ret=eval(data.responseText);if(ret.err==null){setReport("#lista");$.mobile.changePage("#ptabelle")}else{alert("Error: "+ret.err)}}else{alert("connection error: "+data.statusText)}})}function rowDelete(){getRiga();if(!confirm("Confirm the item deletion ?")){return}$.ajax({url:"ajaxvissi.aspx",type:"POST",dataType:"json",data:{tab:SES.tabella.name,op:6,riga:SES.tabella.riga}}).complete(function(data){if(data.status==200&&data.readyState==4){ret=eval(data.responseText);if(ret.err==null){setReport("#lista");$.mobile.changePage("#ptabelle")}else{alert("Error: "+ret.err)}}else{alert("connection error:"+data.statusText)}})}function getRiga(){var a,b,d="",c="";for(b in SES.tabella.riga){SES.tabella.riga[b]=$("#i_"+b).val();if(b=="info"&&SES.tabella.name=="tabelle"){for(a=0;a<SES.campitab["0"].length;a++){d+=$("#yy"+a).val()+"|"}if(d!=""){SES.tabella.riga[b]=d.substring(0,d.length-1)}}if(b=="info"&&SES.tabella.name=="utenti"){for(a=0;a<SES.campiinfo[SES.tabella.riga.tipo].length;a++){d+=$("#qq"+a).val()+"|"}if(d!=""){SES.tabella.riga[b]=d.substring(0,d.length-1)}}if(b=="note"&&SES.tabella.name=="utenti"){for(a=0;a<SES.campinote[SES.tabella.riga.tipo].length;a++){c+=$("#ww"+a).val()+"|"}if(c!=""){SES.tabella.riga[b]=c.substring(0,c.length-1)}}}if(SES.tabella.name=="news"){SES.tabella.riga.op=SES.utente.nome}}function tabInfoTabelle(c){var b,f,d='<table><tr><th colspan="2">INFO</th></tr>',e="0",a=SES.tabella.riga.info.split("|");if(c){f=" readonly"}else{f=""}for(b=0;b<SES.campitab[e].length;b++){nome=SES.campitab[e][b];valore=(a[b]==null)?"":a[b];d+='<tr><td align="right">'+nome+': </td><td width="100%"><input type="text" id="yy'+b+'" value="'+valore+'"'+f+"/></td></tr>"}d+="</table>";return d}function tabInfo(c){var b,f,d='<table><tr><th colspan="2">INFO</th></tr>',e=SES.tabella.riga.tipo,a=SES.tabella.riga.info.split("|");if(c){f=" readonly"}else{f=""}for(b=0;b<SES.campiinfo[e].length;b++){nome=SES.campiinfo[e][b];valore=(a[b]==null)?"":a[b];d+='<tr><td align="right">'+nome+': </td><td width="100%"><input type="text" id="qq'+b+'" value="'+valore+'"'+f+"/></td></tr>"}d+="</table>";return d}function tabNote(c){var b,f,d='<table><tr><th colspan="2">NOTE</th></tr>',e=SES.tabella.riga.tipo,a=SES.tabella.riga.note.split("|");if(c){f=" readonly"}else{f=""}for(b=0;b<SES.campinote[e].length;b++){nome=SES.campinote[e][b];valore=(a[b]==null)?"":a[b];d+='<tr><td align="right">'+nome+': </td><td width="100%"><input type="text" id="ww'+b+'" value="'+valore+'"'+f+"/></td></tr>"}d+="</table>";return d}function uploadFile(){var a="";if(SES.tabella.name=="news"){a="?up=1&txt="+SES.tabella.riga.link+"&dir="+SES.tabelle.tiponews[SES.tabella.tiponews].dir.split("|")[0]}window.open("ajaxvissi.aspx"+a,"myupload")}function bimporta(){var err="",ret,j,k,r,rqq,f,qq,t=$("#ta").val();qq=t.split("\n");f=qq[0].split(";");$.mobile.loading("show");for(k=1;k<qq.length;k++){rqq=qq[k].split(";");if(f.length<=rqq.length){r={};for(j=0;j<f.length;j++){if(j>0&&f[j]==f[j-1]){r[f[j]]+=";"+rqq[j]}else{r[f[j]]=rqq[j]}}$.ajax({url:"ajaxvissi.aspx",type:"GET",dataType:"json",async:false,data:{op:9,riga:r}}).complete(function(data){if(data.status==200&&data.readyState==4){ret=eval(data.responseText);if(ret.err!=null){err+=ret.err+" RIGA:"+k}}else{err+="connection error:"+data.statusText+"\n"}})}if(err!=""){break}}$.mobile.loading("hide");if(err!=""){alert(err)}else{alert("DONE!")}}function bdelTMP(){$.mobile.loading("show");$.ajax({url:"ajaxvissi.aspx",type:"POST",dataType:"json",data:{op:13}}).complete(function(data){if(data.status==200&&data.readyState==4){ret=eval(data.responseText);if(ret.err!=null){alert(ret.err)}else{alert("done.")}}else{err+="connection error or session expired.\n"}$.mobile.loading("hide")})}function besporta(){var b,a=$("#icampi").val(),d=$("#ifiltri").val(),c=$("#iord").val();if(d==""){alert("Non puoi esportare tutto l'archivio.");return}b="?op=10&c="+a+"&f="+d+"&o="+c;window.open("ajaxadmin.aspx"+b,"mydownload")}function ckOp(){var a;if(SES.tabella.name=="utenti"){if(SES.tabella.tipo==0){a={op:1,id:SES.tabella.riga.id};gopost(a)}else{if(SES.tabella.tipo==10){if(SES.utente.tipo!=10&&SES.utente.tipo!=30){alert("You are not enabled.")}else{if(SES.tabella.materia==null){alert("Scegli prima una materia.")}else{a={op:0,id:SES.tabella.riga.id,m:SES.tabella.materia,c:SES.tabella.classe};gopost(a)}}}}}}function setContent(a,c){var b=$("#contenitore");if(c!=null){b=$(c)}b.empty();b.append(a);b.trigger("create")}function dochangepwd(){var ret,oldpwd=$("#oldpwd"),newpwd1=$("#newpwd1"),newpwd2=$("#newpwd2");if(oldpwd.val()==""||newpwd1.val()==""||newpwd1.val()!=newpwd2.val()){alert("type the old password and set new password = confirm new password")}else{$.mobile.loading("show");$.ajax({url:"ajaxvissi.aspx",type:"POST",dataType:"json",data:{op:3,a:SES.utente.email,b:oldpwd.val(),b2:newpwd1.val()}}).complete(function(data){if(data.status==200&&data.readyState==4){ret=eval(data.responseText);if(ret.err!=null){alert(ret.err)}else{oldpwd.val("");newpwd1.val("");newpwd2.val("");alert("Password succesfully changed.");blogout();$("#chgpwd").hide();$.mobile.changePage("#login")}}else{alert("Connection error:"+data.statusText)}$.mobile.loading("hide")})}};