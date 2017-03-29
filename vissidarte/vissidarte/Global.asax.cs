using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace vissidarte
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            Application.Lock();
            System.Configuration.Configuration cc = System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration(null);
            Application["AccessiContemporanei"] = 0;
            Application.UnLock();
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            Application.Lock();
            Application["AccessiContemporanei"] = Convert.ToInt32(Application["AccessiContemporanei"]) + 1;
            Application.UnLock();
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {
            Application.Lock();
            Application["AccessiContemporanei"] = Convert.ToInt32(Application["AccessiContemporanei"]) - 1;
            Application.UnLock();
        }

        protected void Application_End(object sender, EventArgs e)
        {
        }
    }
}