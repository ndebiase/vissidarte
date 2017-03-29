using System;
using System.Configuration;
using System.Globalization;
using System.Data;
using System.Data.OleDb;
using MySql.Data.MySqlClient;

using System.Security.Cryptography;
using System.IO;
using System.Text;

namespace vissidarte
{
	/// <summary>
	/// accesso ai database SOLO MySql
	/// </summary>
	class dbhelper
	{
        #region DBHELPER
        //
        // esempi di connessione OLEDB
        //
        // Provider=MSDAORA; Data Source=ORACLE8i7; User ID=OLEDB; Password=OLEDB
        // Provider=Microsoft.Jet.OLEDB.4.0; Data Source=c:\bin\LocalAccess40.mdb;
        // Provider=SQLOLEDB;Data Source=MySQLServer;Integrated Security=SSPI;		
        //
        // esempi di connessione ODBC
        //
        // Driver={SQL Server};Server=MyServer;UID=sa;PWD=sqLs$5xr;Database=Northwind;
        // Driver={Microsoft ODBC for Oracle};Server=ORACLE8i7;UID=odbcuser;PWD=odbc$5xr
        // Driver={Microsoft Access Driver (*.mdb)};DBQ=c:\bin\nwind.mdb
        // Driver={Microsoft Excel Driver (*.xls)};DBQ=c:\bin\book1.xls
        // Driver={Microsoft Text Driver (*.txt; *.csv)};DBQ=c:\bin
        // DSN=dsnname
        string defaultcnnstring = ConfigurationManager.AppSettings["mycnn"];
        CultureInfo neutral = new CultureInfo("");
        public string LastErr;

        public string tb(string originaltabname)
        {
            if (ConfigurationManager.AppSettings[originaltabname + "TAB"] != null)
                return ConfigurationManager.AppSettings[originaltabname + "TAB"];
            else
                return originaltabname;
        }
        /// <summary>
        /// Setup connessione generica ad un database
        /// </summary>
        /// <param name="connstr"></param>
        /// <returns></returns>
        public Object InitConnection()
        {
            return InitConnection(null);
        }
        public Object InitConnection(string connstr)
        {
            Object cnn = null;

            try
            {
                if (connstr == null)
                    connstr = defaultcnnstring;
                if (connstr.ToLower().StartsWith("provider"))
                {
                    cnn = new OleDbConnection(connstr);
                    ((OleDbConnection)cnn).Open();
                }
                else if (connstr.ToLower().EndsWith(".mdb"))
                {
                    cnn = new OleDbConnection("Provider=Microsoft.Jet.OLEDB.4.0; Data Source=" + connstr + ";");
                    ((OleDbConnection)cnn).Open();
                }
                else
                {
                    cnn = new MySqlConnection(connstr);
                    ((MySqlConnection)cnn).Open();
                }
            }
            catch (Exception e)
            {
                LastErr = e.Message;
            }
            return cnn;
        }
		/// <summary>
		/// Chiude la connessione OleDb
		/// </summary>
		/// <param name="cnn"></param>
		public void CloseConnection(OleDbConnection cnn)
		{
			if (cnn != null)
				cnn.Close();
		}
        /// <summary>
        /// Chiude la connessione Generica
        /// </summary>
        /// <param name="cnn"></param>
        public void CloseConnection(Object cnn)
        {
            if (cnn != null)
            {
                if (cnn.GetType() == typeof(OleDbConnection))
                    ((OleDbConnection)cnn).Close();
                else
                    ((MySqlConnection)cnn).Close();
            }
        }
        /// <summary>
        /// effettua una query di selezione con connessione generica
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="cnn"></param>
        /// <returns>null=errore, DataReader altrimenti</returns>
        public Object RunSQLrs(string sql, Object cnn)
        {
            if (cnn.GetType() == typeof(OleDbConnection))
                return RunSQLrs(sql, (OleDbConnection)cnn);
            else
                return RunSQLrs(sql, (MySqlConnection)cnn);
        }
        /// <summary>
        /// effettua una query di selezione con OleDb
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="cnn"></param>
        /// <returns>null=errore, DataReader altrimenti</returns>
        public OleDbDataReader RunSQLrs(string sql, OleDbConnection cnn)
        {
            try
            {
                OleDbCommand cmd = new OleDbCommand(sql, cnn);
                cmd.CommandType = CommandType.Text;
                cmd.Parameters.Clear();
                return cmd.ExecuteReader();
            }
            catch (Exception e)
            {
                LastErr = e.Message;
                return null;
            }
        }
        /// <summary>
        /// effettua una query di selezione con MySql
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="cnn"></param>
        /// <returns>null=errore, DataReader altrimenti</returns>
        public MySqlDataReader RunSQLrs(string sql, MySqlConnection cnn)
        {
            try
            {
                MySqlCommand cmd = new MySqlCommand(sql, cnn);
                cmd.CommandType = CommandType.Text;
                cmd.Parameters.Clear();
                return cmd.ExecuteReader();
            }
            catch (Exception e)
            {
                LastErr = e.Message;
                return null;
            }
        }
        /// <summary>
        /// effettua una query di comando con connessione generica
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="cnn"></param>
        /// <returns>-1=errore, x=numero di righe influenzate</returns>
        public int RunSQL(string sql, Object cnn)
        {
            if (cnn.GetType() == typeof(OleDbConnection))
                return RunSQL(sql, (OleDbConnection)cnn);
            else
                return RunSQL(sql, (MySqlConnection)cnn);
        }
        /// <summary>
		/// effettua una query di comando con ODBC, OLEDB, MySQL
		/// </summary>
		/// <param name="sql"></param>
		/// <param name="cnn"></param>
		/// <returns>-1=errore, x=numero di righe influenzate</returns>
        public int RunSQL(string sql, OleDbConnection cnn)
        {
            try
            {
                OleDbCommand cmd = new OleDbCommand(sql, cnn);
                cmd.CommandType = CommandType.Text;
                cmd.Parameters.Clear();
                return cmd.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                LastErr = e.Message;
                return -1;
            }
        }
        public int RunSQL(string sql, MySqlConnection cnn)
        {
            try
            {
                MySqlCommand cmd = new MySqlCommand(sql, cnn);
                cmd.CommandType = CommandType.Text;
                cmd.Parameters.Clear();
                return cmd.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                LastErr = e.Message;
                return -1;
            }
        }
        /// <summary>
        /// Mappa la read del recordset generico
        /// </summary>
        /// <param name="rs"></param>
        /// <returns></returns>
        public bool Read(Object rs)
        {
            if (rs.GetType() == typeof(OleDbDataReader))
                return ((OleDbDataReader)rs).Read();
            else
                return ((MySqlDataReader)rs).Read();
        }
        /// <summary>
        /// Mappa la close del recordset generico
        /// </summary>
        /// <param name="rs"></param>
        /// <returns></returns>
        public void Close(Object rs)
        {
            if (rs != null)
            {
                if (rs.GetType() == typeof(OleDbDataReader))
                    ((OleDbDataReader)rs).Close();
                else
                    ((MySqlDataReader)rs).Close();
            }
        }
        /// <summary>
        /// legge il campo specificato dal recordset generico
        /// </summary>
        /// <param name="rs"></param>
        /// <param name="fld"></param>
        /// <returns></returns>
        public string gets(Object rs, string fld)
        {
            if (rs.GetType() == typeof(OleDbDataReader))
                return (((OleDbDataReader)rs)[fld] == System.DBNull.Value) ? "" : ((OleDbDataReader)rs)[fld].ToString();
            else
                return (((MySqlDataReader)rs)[fld] == System.DBNull.Value) ? "" : ((MySqlDataReader)rs)[fld].ToString();
        }
        #endregion
        #region SUPPORTO
        /// <summary>
        /// bonifica una stringa
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public string bonifica(string t)
        {
            return t.Replace("\\", "\\\\").Replace("'", "\\\'").Replace("’", "\\\'");
        }
        /// <summary>
        /// chiama bonificajson, inoltre sostituisce tutti i caratteri che danno fastidio
        /// a 3cad come la virgola.
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public string bonificaj3cad(string t)
        {
            string qq = t.Replace(",", ".");
            return bonificajson(qq);
        }
        /// <summary>
        /// consente solo apice singolo. Elimina \n, apici doppi e backtick.
        /// standard JSON vuole apici doppi come delimitatore di stringhe
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public string bonificajson(string t)
        {
            string qq = t.Replace("’", "'").Replace("\"", "\\\"").Replace("\r\n", " ").Replace("\n", " ");
            return qq;
        }
        /// <summary>
        /// Sistema i nomi dei file
        /// </summary>
        /// <param name="fn"></param>
        /// <returns></returns>
        public string bonificafilename(string fn)
        {
            string qq = fn.Trim().Replace(" ", "_").Replace("/", "_").Replace(".", "_").Replace("+", "_").Replace("#", "_");
            return qq;
        }
        public double FromNeutral(string numero)
        {
            try
            {
                return Convert.ToDouble(numero, neutral.NumberFormat);
            }
            catch
            {
                return 0;
            }
        }
        #endregion
        #region CRYPTO
        /// <summary>
        /// cifratura stringa
        /// </summary>
        /// <param name="s">stringa da cifrare</param>
        /// <returns>stringa cifrata</returns>
        public string encrypt(RijndaelManaged rij, string s)
        {
            ICryptoTransform cri = rij.CreateEncryptor();
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, cri, CryptoStreamMode.Write);
            byte[] ba = Encoding.UTF8.GetBytes(s);
            cs.Write(ba, 0, ba.Length);
            cs.FlushFinalBlock();
            return Convert.ToBase64String(ms.ToArray());
        }
        /// <summary>
        /// decifratura stringa
        /// </summary>
        /// <param name="es"></param>
        /// <returns></returns>
        public string decrypt(RijndaelManaged rij, string es)
        {
            byte[] ba = Convert.FromBase64String(es);
            ICryptoTransform decri = rij.CreateDecryptor();
            MemoryStream ms = new MemoryStream(ba);
            CryptoStream cs = new CryptoStream(ms, decri, CryptoStreamMode.Read);
            cs.Read(ba, 0, ba.Length);
            return Encoding.UTF8.GetString(ms.ToArray());
        }
        public object getrij()
        {
            const int L1 = 44;
            string key;
            RijndaelManaged rij = new RijndaelManaged();
            key = ConfigurationManager.AppSettings["mycr"];
            // le righe commentate servono per creare il sale della cifratura 
            // da memorizzare in web.config
            //string qq = Convert.ToBase64String(rij.IV);
            //string aa = Convert.ToBase64String(rij.Key);
            if (key == null)
                return null;
            rij.Key = Convert.FromBase64String(key.Substring(0, L1));
            rij.IV = Convert.FromBase64String(key.Substring(L1));
            return rij;
        }
        #endregion
    }
}
