using System;
using System.Collections;
using System.Configuration;
using System.IO;

using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Security.Cryptography;

namespace vissidarte
{
    public partial class ajaxvissi : System.Web.UI.Page
    {
        dbhelper db = new dbhelper();
        object cnn, rs;
        string op;
        static string
            ordNews = "tipo,ord desc",
            ordUtenti = "cognome,nome",
            ordTabelle = "tip,cod,des",
            tipoStringa = " tagid cognome nome classe login info note tip cod des pwd lastaccess coord rappst rappge doc materia aula link tit txt col img href dtpub dtexp op ";
        string[]
            tabNews = { ordNews, "id", "tipo", "tit", "txt", "img", "href", "ord", "col", "dtpub", "dtexp", "op" },
            tabUtenti = { ordUtenti, "id", "tagid", "login", "pwd", "tipo", "accessi", "lastaccess", "cognome", "nome", "note", "info" },
            tabTabelle = { ordTabelle, "id", "tip", "cod", "des", "info" };
        Hashtable tabs = new Hashtable();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                tabs.Add("utenti", tabUtenti);
                tabs.Add("tabelle", tabTabelle);
                tabs.Add("news", tabNews);

                op = Request["op"];
                if (op != null)
                {
                    if (op == "0")
                        GetNews(Request["news"], Request["src"], Request["id"]);
                    else if (op == "1")
                        Authenticate(Request["a"], Request["b"]);
                    else if (op == "2")
                        Logout();
                    else if (op == "3")
                        ChangePWD(Request["a"], Request["b"], Request["b2"]);
                    else if (op == "4")
                        reportTabelle();
                    else if (op == "5")
                        setTabella();
                    else if (op == "6")
                        deleteRiga();
                    else if (op == "7")
                        insertRiga();
                    else if (op == "8")
                        updateRiga();
                    else if (op == "9")
                        importaUtente();
                    else if (op == "10")
                        esportaUtenti();
                    else if (op == "11")
                        ListaTiponews();
                    else if (op == "15")
                        deleteTabFrontiera();
                    else
                    {
                        Rispondi("{ err: \"Invalid op.\" }");
                    }
                }
                else
                {   // pagina di upload
                    logo1.Src = ConfigurationManager.AppSettings["logo"];
                    op = Request["up"];
                    huptipo.Value = op;
                    if (op == "1")
                    {
                        hdir.Value = Request["dir"];
                        if (hdir.Value != "" && hdir.Value != null)
                            hdir.Value += "/";
                    }
                }
            }
        }
        protected void Logout()
        {
            Session["tipoid"] = null;
            Session["id"] = null;
            Rispondi("{}");
        }
        protected void Authenticate(string login, string pwd)
        {
            char[] vietati = { ' ', '\'' };
            string sql, epwd, json = "{}";
            string[] qq;

            Session["tipoid"] = null;
            //
            // crea la chiave di cifratura
            //
            RijndaelManaged rij = (RijndaelManaged)db.getrij();
            if (rij != null)
            {
                //
                // cifra la password
                //
                epwd = db.encrypt(rij, pwd);

                cnn = db.InitConnection();
                if (cnn != null)
                {
                    if (pwd == null)
                    {
                        sql = "select * from " + db.tb("utenti") + " where tagid='" + login + "'";
                        pwd = "";
                    }
                    else
                        sql = "select * from " + db.tb("utenti") + " where login='" + login + "' and pwd='" + epwd + "'";
                    rs = db.RunSQLrs(sql, cnn);
                    if (login != "" && login.IndexOfAny(vietati) < 0 && pwd.IndexOfAny(vietati) < 0 && rs != null && db.Read(rs))
                    {
                        int conta = Convert.ToInt32(db.gets(rs, "accessi"));
                        string abi = "";
                        // questo consente di mantenere l'autenticazione nella versione PC
                        Session["tipoid"] = db.gets(rs, "tipo");
                        Session["id"] = db.gets(rs, "id");
                        qq = db.gets(rs, "info").Split(';');
                        if (qq.Length > 4)
                            Session["abil"] = abi = qq[4];
                        json = "{id:" + db.gets(rs, "id") + ",abi:\"" + abi + "\",tipo:" + db.gets(rs, "tipo") + ",nome:\"" + db.bonifica(db.gets(rs, "cognome")) + " " + db.bonifica(db.gets(rs, "nome")) + "\"}";
                        db.Close(rs);
                        // aggiorna i dati di log
                        conta++;
                        sql = "update " + db.tb("utenti") + " set accessi=" + conta.ToString() + " ,lastaccess='" +
                            DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss") + "' where id=" + Session["id"];
                        db.RunSQL(sql, cnn);
                    }
                }
                db.CloseConnection(cnn);
            }
            if (db.LastErr != null)
                json = "{ err:\"" + db.bonificajson(db.LastErr) + "\"}";
            Rispondi(json);
        }
        protected void ChangePWD(string login, string pwd, string pwd2)
        {
            string sql, epwd, epwdn, json = "{}";
            char[] vietati = { ' ', '\'' };
            int ret = 0;

            if (Session["id"] != null)
            {
                if ((cnn = db.InitConnection(null)) != null)
                {
                    RijndaelManaged rij = (RijndaelManaged)db.getrij();
                    //
                    // cifra le password
                    //
                    epwd = db.encrypt(rij, pwd);
                    epwdn = db.encrypt(rij, pwd2);
                    sql = "update " + db.tb("utenti") + " set pwd='" + epwdn + "' where login='" + login + "' and pwd='" + epwd + "'";
                    if (login.IndexOfAny(vietati) < 0 && pwd.IndexOfAny(vietati) < 0)
                        ret = db.RunSQL(sql, cnn);
                }
                db.CloseConnection(cnn);
                if (db.LastErr != null)
                    json = "{ err:\"" + db.bonificajson(db.LastErr) + "\"}";
                else if (ret != 1)
                    json = "{ err:\"Cambio password non effettuato.\"}";
            }
            else
                json = "{ err:\"Sessione scaduta o login non effettuato.\"}";
            Rispondi(json);
        }
        protected void reportTabelle()
        {
            string sql, tabname, filtro, sqlwhere = "", abi, qq, json = "[";
            int k;
            cnn = db.InitConnection(null);
            if (cnn != null)
            {
                tabname = Request["tab"];
                filtro = Request["f"];
                abi = Request["abi"];
                string[] f = (string[])tabs[tabname];
                sqlwhere = setFiltro(filtro, tabname, abi);
                sql = "select * from " + db.tb(tabname) + sqlwhere + " order by " + f[0];
                rs = db.RunSQLrs(sql, cnn);
                if (db.LastErr == null)
                {
                    while (rs != null && db.Read(rs))
                    {
                        json += "[";
                        for (k = 1; k < f.Length; k++)
                        {
                            qq = db.gets(rs, f[k]);
                            if (tipoStringa.Contains(" " + f[k] + " "))
                                qq = db.bonificajson(qq);
                            json += "\"" + qq + "\",";
                        }
                        json += "],";
                    }
                }
                db.Close(rs);
                db.CloseConnection(cnn);
            }
            json += "]";
            if (db.LastErr != null)
                json = "{ err:\"" + db.bonificajson(db.LastErr) + "\"}";
            Rispondi(json);
        }
        /// <summary>
        /// imposta un filtro 
        /// </summary>
        /// <returns></returns>
        protected string setFiltro(string filtro, string tabname, string abi)
        {
            string sql = "";
            if (abi == null || abi == "") abi = "999";
            if (filtro != null && filtro != "")
                sql = " where " + filtro;
            if (tabname == "news" && abi.Trim() != "A")
            {
                if (sql == "")
                    sql = " where tipo in (" + abi.Replace("*", ",") + ")";
                else
                    sql += " and tipo in (" + abi.Replace("*", ",") + ")";
            }
            return sql;
        }
        /// <summary>
        /// impostazione del lavoro su una tabella (inizialmente serviva per sapere campi e numero record)
        /// </summary>
        protected void setTabella()
        {
            string sql, tabname, json = "{}";
            int k;
            cnn = db.InitConnection(null);
            if (cnn != null)
            {
                tabname = Request["tab"];
                sql = "select count(*) as k from " + db.tb(tabname);
                rs = db.RunSQLrs(sql, cnn);
                if (rs != null && db.Read(rs))
                {
                    string[] f = (string[])tabs[tabname];
                    json = "{name:\"" + tabname + "\",nrec:" + db.gets(rs, "k") + ",ord:\"" + f[0] + "\",cols:[";
                    for (k = 1; k < f.Length; k++)
                        json += "\"" + f[k] + "\",";
                    json += "]}";
                }
                db.Close(rs);
                db.CloseConnection(cnn);
            }
            Rispondi(json);
        }
        /// <summary>
        /// update di una singola riga di una qualsiasi tabella (vedi tabs)
        /// </summary>
        protected void updateRiga()
        {
            int k;
            string tabname, json = "{}", sql, values = "", id = Request["riga[id]"];
            tabname = Request["tab"];
            if (id == null || id == "")
                json = "{ err: \"invalid record ID\" }";
            else
            {
                cnn = db.InitConnection(null);
                if (cnn != null)
                {
                    string[] f = (string[])tabs[tabname];
                    for (k = 2; k < f.Length; k++)
                    {
                        json = Request["riga[" + f[k] + "]"];
                        if (f[k].Contains("lastaccess"))
                            json = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                        else if (f[k].Contains("pwd"))
                        {
                            if (json == "")
                            {
                                RijndaelManaged rij = (RijndaelManaged)db.getrij();
                                json = db.encrypt(rij, "xxx");
                            }
                        }
                        else if (f[k].Contains("dtexp") || f[k].Contains("dtpub"))
                        {
                            if (json == "")
                                json = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                            else
                                json = DateTime.Parse(json).ToString("yyyy-MM-dd hh:mm:ss");
                        }
                        sql = tipoStringa.Contains(" " + f[k] + " ") ? "'" + db.bonifica(json) + "'" : json;
                        values += ((values == "") ? "" : ",") + f[k] + "=" + sql;
                    }
                    sql = "update " + db.tb(tabname) + " set " + values + " where id=" + id;
                    db.RunSQL(sql, cnn);
                    if (db.LastErr != null)
                        json = "{ err:\"" + db.bonificajson(db.LastErr) + "\"}";
                    else
                        json = "{}";
                    db.CloseConnection(cnn);
                }
            }
            Rispondi(json);
        }
        /// <summary>
        /// nuova riga in qualsiasi tabella
        /// </summary>
        protected void insertRiga()
        {
            int k;
            string lastid, tabname, json = "{}", sql = "", fields = "", values = "";
            tabname = Request["tab"];
            cnn = db.InitConnection(null);
            if (cnn != null)
            {
                string[] f = (string[])tabs[tabname];
                for (k = 2; k < f.Length; k++)
                {
                    fields += ((fields == "") ? "" : ",") + f[k];
                    json = Request["riga[" + f[k] + "]"];
                    if (f[k].Contains("lastaccess"))
                        json = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                    else if (f[k].Contains("pwd"))
                    {
                        if (json == "")
                        {
                            RijndaelManaged rij = (RijndaelManaged)db.getrij();
                            json = db.encrypt(rij, "xxx");
                        }
                    }
                    else if (f[k].Contains("dtexp") || f[k].Contains("dtpub"))
                    {
                        if (json == "")
                        {
                            if (f[k].Contains("dtexp"))
                                json = DateTime.Now.AddYears(10).ToString("yyyy-MM-dd hh:mm:ss");
                            else
                                json = DateTime.Now.ToString("yyyy-MM-dd hh:mm:ss");
                        }
                        else
                            json = DateTime.Parse(json).ToString("yyyy-MM-dd hh:mm:ss");
                    }
                    sql = tipoStringa.Contains(" " + f[k] + " ") ? "'" + db.bonifica(json) + "'" : json;
                    values += ((values == "") ? "" : ",") + sql;
                }
                sql = "insert into " + db.tb(tabname) + " (" + fields + ") values (" + values + ")";
                db.RunSQL(sql, cnn);
                if (db.LastErr != null)
                    json = "{ err:\"" + db.bonificajson(db.LastErr) + "\"}";
                else
                {
                    rs = db.RunSQLrs("select last_insert_id()", cnn);
                    db.Read(rs);
                    lastid = db.gets(rs, "last_insert_id()");
                    json = "{lastid:" + lastid + "}";
                }
                db.CloseConnection(cnn);
            }
            Rispondi(json);
        }
        /// <summary>
        /// cancellazione di una singola riga di qualsiasi tabella.
        /// NB: se cancello un articolo allora cancello anche tutte le sue abilitazioni nei cataloghi. Non lo faccio con un trigger per non dimenticarmene
        /// quando passo da mysql a sqlserver
        /// </summary>
        protected void deleteRiga()
        {
            string okdel = "", tabname, json = "{}", sql = "", id = Request["riga[id]"];
            if (id == null || id == "")
                json = "{ err: \"invalid record ID\" }";
            tabname = Request["tab"];
            //okdel = ckNONcancellabile(id);
            if (okdel == "")
            {
                cnn = db.InitConnection(null);
                if (cnn != null)
                {
                    sql = "delete from " + db.tb(tabname) + " where id=" + id;
                    db.RunSQL(sql, cnn);
                    if (db.LastErr != null)
                        json = "{ err:\"" + db.bonificajson(db.LastErr) + "\"}";
                    else
                        json = "{}";
                    db.CloseConnection(cnn);
                }
                if (tabname == "circolari")
                {
                    string fn = "circolari/archivio/cir-" + id + ".pdf";
                    deletefile(fn);
                }
            }
            else
                json = "{ err:\"Elemento non cancellabile (" + okdel + ").\"}";
            Rispondi(json);
        }
        protected void ListaTiponews()
        {
            string sql, news, json = "{", abi = Request["abi"];

            Response.Clear();
            if ((cnn = db.InitConnection(null)) != null)
            {
                // posso modificare le news solo se sono abilitato
                if (abi != null && abi != "")
                {
                    string[] qq = abi.Split('*');
                    if (qq[0] == "A")
                        news = " ";
                    else
                        news = " and cod in ('" + abi.Replace("*", "','") + "') ";
                }
                else
                    news = " and cod in ('') ";
                sql = "SELECT cod,des,info from " + db.tb("tabelle") + " where tip='NEWS'" + news + "order by des";
                rs = db.RunSQLrs(sql, cnn);
                json += "tiponews: [";
                while (rs != null && db.Read(rs))
                    json += "{ cod:" + db.gets(rs, "cod") + ", des:\"" + db.gets(rs, "des") + "\",dir:\"" + db.gets(rs, "info") + "\"},";
                db.Close(rs);
                json += "],";
                sql = "SELECT cod,des from " + db.tb("tabelle") + " where tip='UTENTE' order by cod";
                rs = db.RunSQLrs(sql, cnn);
                json += "tipout: [";
                while (rs != null && db.Read(rs))
                    json += "{ cod:" + db.gets(rs, "cod") + ", des:\"" + db.gets(rs, "des") + "\"},";
                db.Close(rs);
                json += "]}";
            }
            if (db.LastErr != null)
                json = "{ err: \"" + db.bonificajson(db.LastErr) + "\"}";
            db.CloseConnection(cnn);
            Rispondi(json);
        }
        /// <summary>
        /// Elimina un file (cerca le estensioni .doc, .xls, .pdf, .htm e .ppt)
        /// </summary>
        /// <param name="fn"></param>
        void deletefile(string fn)
        {
            fn = Server.MapPath(fn);
            File.Delete(fn);
            File.Delete(Path.ChangeExtension(fn, ".pdf"));
            File.Delete(Path.ChangeExtension(fn, ".htm"));
            File.Delete(Path.ChangeExtension(fn, ".doc"));
            File.Delete(Path.ChangeExtension(fn, ".xls"));
            File.Delete(Path.ChangeExtension(fn, ".ppt"));
        }
        protected void bup_Click(object sender, ImageClickEventArgs e)
        {
            if (up1.HasFile)
            {
                string fn, qq = up1.PostedFile.FileName.ToLower();
                if (huptipo.Value == "0")
                {
                    if (qq.EndsWith(".pdf"))
                    {
                        fn = Server.MapPath("circolari/archivio/cir-" + hid.Value + ".pdf");
                        up1.PostedFile.SaveAs(fn);
                        msg.Text = "file caricato con successo.";
                    }
                    else
                        msg.Text = "tipo file non valido.";
                }
                else if (huptipo.Value == "1")
                {
                    if (qq.EndsWith(".pdf") || qq.EndsWith(".jpg") || qq.EndsWith(".png") || qq.EndsWith(".gif") || qq.EndsWith(".rar") || qq.EndsWith(".zip") || qq.EndsWith(".doc") || qq.EndsWith(".xls"))
                    {
                        fn = Server.MapPath("file/" + hdir.Value + Path.GetFileName(qq));
                        testCreaDIR("file");
                        if (hdir.Value != "")
                            testCreaDIR("file/" + hdir.Value);
                        up1.PostedFile.SaveAs(fn);
                        msg.Text = "file caricato con successo.";
                    }
                    else
                        msg.Text = "tipo file non valido.";
                }
            }
        }
        /// <summary>
        /// verifica se esiste una directori e, se no, la crea
        /// </summary>
        /// <param name="dir"></param>
        protected void testCreaDIR(string dir)
        {
            string dn = Server.MapPath(dir);
            if (!Directory.Exists(dn))
                Directory.CreateDirectory(dn);
        }
        /// <summary>
        /// insert riga con numero di campi variabile (usato in importazione di massa)
        /// NB: SE ESISTE IL CAMPO id ed è il primo EFFETTUA SOLO UN AGGIORNAMENTO
        /// NB: SE ESISTE IL CAMPO matr ed è il primo EFFETTUA SOLO UN AGGIORNAMENTO
        /// </summary>
        protected void importaUtente()
        {
            int k;
            bool primo = true;
            string json = "{}", sql = "", ff, matr = "", id = "", fields = "", values = "";
            cnn = db.InitConnection(null);
            if (cnn != null)
            {
                string[] f = Request.QueryString.AllKeys;
                for (k = 0; k < f.Length; k++)
                {
                    if (f[k].StartsWith("riga["))
                    {
                        ff = f[k].Substring(5).TrimEnd(']');
                        if (ff == "id" && primo)
                        {
                            id = Request[f[k]];
                        }
                        else if (ff == "matr" && primo)
                        {
                            matr = Request[f[k]];
                        }
                        else
                        {
                            json = Request[f[k]];
                            sql = tipoStringa.Contains(" " + ff + " ") ? "'" + db.bonifica(json) + "'" : json;
                            if (id != "" || matr != "")
                            {
                                fields += ((fields == "") ? "" : ",") + ff;
                                fields += "=" + sql;
                            }
                            else
                            {
                                fields += ((fields == "") ? "" : ",") + ff;
                                values += ((values == "") ? "" : ",") + sql;
                            }
                        }
                        primo = false;
                    }
                }
                if (id != "")
                    sql = "update " + db.tb("utenti") + " set " + fields + " where id=" + id;
                else if (matr != "")
                    sql = "update " + db.tb("utenti") + " set " + fields + " where matr=" + matr;
                else
                    sql = "insert into tmpu(" + fields + ") values (" + values + ")";
                db.RunSQL(sql, cnn);
                if (db.LastErr != null)
                    json = "{ err:\"" + db.bonificajson(db.LastErr) + "\"}";
                else
                    json = "{}";
                db.CloseConnection(cnn);
            }
            Rispondi(json);
        }
        /// <summary>
        /// Azzera la tabella di frontiera
        /// </summary>
        protected void deleteTabFrontiera()
        {
            string json = "{}", sql = "";
            cnn = db.InitConnection(null);
            if (cnn != null)
            {
                sql = "delete from tmpu";
                db.RunSQL(sql, cnn);
                if (db.LastErr != null)
                    json = "{ err:\"" + db.bonificajson(db.LastErr) + "\"}";
                db.CloseConnection(cnn);
            }
            Rispondi(json);
        }
        protected void esportaUtenti()
        {
            string sql, csv = "", fields = Request["c"], ord = Request["o"], filtro = Request["f"], tmp;
            int k;
            string[] qq = fields.Replace("a.", "").Replace("b.", "").Split(',');
            cnn = db.InitConnection(null);
            if (cnn != null)
            {
                sql = "select " + fields + " from " + db.tb("utenti");
                if (filtro != null && filtro != "")
                    sql += " where " + filtro;
                if (ord != null && ord != "")
                    sql += " order by " + ord;
                rs = db.RunSQLrs(sql, cnn);
                if (db.LastErr != null)
                    csv = "ERRORE: " + db.LastErr;
                else
                {
                    // header
                    for (k = 0; k < qq.Length; k++)
                        csv += qq[k] + ";";
                    csv += "\n";
                    // righe
                    while (rs != null && db.Read(rs))
                    {
                        for (k = 0; k < qq.Length; k++)
                        {
                            tmp = db.gets(rs, qq[k]);
                            csv += tmp + ";";
                        }
                        csv += "\n";
                    }
                }
                db.Close(rs);
                db.CloseConnection(cnn);
            }
            Response.Clear();
            Response.ContentType = "application/octet-stream";
            Response.AppendHeader("content-disposition", "attachment; filename=utentibaden.csv");
            Response.Write(csv);
            Response.End();
        }
        /// <summary>
        /// report news
        /// </summary>
        /// <param name="news">-1=ricerca,0=news,1=homesopra1,2=homesotto,3=orientamento,4=albo,10=circolari</param>
        /// <param name="src">parola da cercare</param>
        /// <param name="id">id docente</param>
        protected void GetNews(string news, string src, string id)
        {
            string sql, titolo = "", abi = "", json = "{}", list = "lista: [", user = "";

            if ((cnn = db.InitConnection()) != null)
            {
                // carica la lista
                if (news == "-1")
                {
                    if (src == "")
                        sql = "SELECT n.href, n.tit, n.txt, n.img, n.dtpub, t.des from " + db.tb("news") + " n," + db.tb("tabelle") + " t where n.tipo=t.cod and t.tip='NEWS' and n.tipo=0 and now() >= n.dtpub and now() <= n.dtexp order by n.ord desc";
                    else
                        sql = "SELECT n.href, n.tit, n.txt, n.img, n.dtpub, t.des from " + db.tb("news") + " n," + db.tb("tabelle") + " t " +
                            "where n.tipo=t.cod and t.tip='NEWS' and now() >= n.dtpub and now() <= n.dtexp and " +
                            "(n.tit like '%" + src + "%' or n.txt like '%" + src + "%') " +
                            "order by t.des, n.ord desc";
                }
                else
                    sql = "SELECT n.href, n.tit, n.txt, n.img, n.dtpub, t.des from " + db.tb("news") + " n," + db.tb("tabelle") + " t where n.tipo=t.cod and t.tip='NEWS' and n.tipo=" + news + " and now() >= n.dtpub and now() <= n.dtexp order by n.ord desc";
                rs = db.RunSQLrs(sql, cnn);
                while (rs != null && db.Read(rs))
                {
                    list += "{sez:\"" + db.gets(rs, "des") + "\"," +
                        "img:\"" + db.gets(rs, "img") + "\"," +
                        "dt:\"" + db.gets(rs, "dtpub").Substring(0, 10) + "\"," +
                        "tit:\"" + db.bonificajson(db.gets(rs, "tit")) + "\"," +
                        "txt:\"" + db.bonificajson(db.gets(rs, "txt")) + "\"," +
                        "href:\"" + db.gets(rs, "href") + "\"},";
                }
                db.Close(rs);
                list += "]";
                if (Session["id"] != null)
                {
                    // carica l'utente loggato
                    sql = "select * from " + db.tb("utenti") + " where id=" + Session["id"];
                    rs = db.RunSQLrs(sql, cnn);
                    if (rs != null && db.Read(rs))
                    {
                        string[] qq;
                        qq = db.gets(rs, "info").Split(';');
                        if (qq.Length > 4)
                            abi = qq[4];
                        user = "utente: {id:" + db.gets(rs, "id") + ",abi:\"" + abi + "\",tipo:" + db.gets(rs, "tipo") + ",nome:\"" + db.bonifica(db.gets(rs, "cognome")) + " " + db.bonifica(db.gets(rs, "nome")) + "\"}";
                    }
                    db.Close(rs);
                }
            }
            db.CloseConnection(cnn);
            if (db.LastErr != null)
                json = "{ err:\"" + db.bonificajson(db.LastErr) + "\"}";
            else
                json = "{online:\"" + Application["AccessiContemporanei"].ToString() + "\",title:\"" + titolo + "\"," + list + "," + user + "}";
            Rispondi(json);
        }

        void Rispondi(string json)
        {
            Response.Clear();
            Response.ContentType = "application/json; charset=utf-8";
            Response.Write("(" + json + ")");
            Response.End();
        }
    }
}