<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ajaxvissi.aspx.cs" Inherits="vissidarte.ajaxvissi" ValidateRequest="false" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>UPLOAD FILES</title>
    <meta http-equiv="pragma" content="no-cache" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href='lib/jquery.mobile-1.4.5.min.css' />
    <link rel="stylesheet" href='lib/baden.css' />
    <script type="text/javascript" src="lib/jquery-1.11.3.min.js"></script>
    <script type="text/javascript" src="lib/jquery.mobile-1.4.5.min.js"></script>
</head>
<body>
    <form id="form1" runat="server" data-ajax="false">
        <asp:HiddenField ID="huptipo" runat="server" Value="" />
        <asp:HiddenField ID="hid" runat="server" Value="" />
        <asp:HiddenField ID="hdir" runat="server" Value="" />
        <div data-role="header" data-position="fixed" data-theme="d">
            <img id="logo1" runat="server" src="img/smartschool1.png" />
            <a href="javascript:window.close()" data-icon="delete" class="ui-btn-right">CLOSE</a>
        </div>
        <div data-role="content">
            <table>
                <tr>
                    <td colspan="3">Pagina di upload file. I file possono essere immagini, documenti pdf o file .zip e .rar associati alla news, alla circolare, o alla classe/materia visualizzata. 
                            I formati supportati sono .jpg, .png, .pdf, .doc, .xls, .zip e .rar. I file caricati finiscono nella cartella <b>FILE</b>, tranne le circolari che finiscono in una cartella a parte.
                        Si consiglia di usare nomi di file che siano chiari, senza spazi e caratteri strani. I File devono essere PICCOLI: fino a 1Mb va bene, 4Mb sono troppi!
                            <ol>
                                <li>Predisponi l'immagine o il file da caricare</li>
                                <li>Premi il bottone <i>Browse(Sfoglia)</i> e scegli il file da caricare</li>
                                <li>Premi il bottone
                                    <img src="img/associa.png" width="32" />
                                    per caricare il file sul server</li>
                            </ol>
                        Se non appare il messaggio <i>File caricato con successo</i> oppure appare un altro messaggio di errore ripeti l'operazione. Se l'errore persiste contatta il webmaster.
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <asp:FileUpload runat="server" ID="up1"></asp:FileUpload></td>
                    <td>
                        <asp:ImageButton runat="server" ID="bup" ImageUrl="img/associa.png" Width="64" ToolTip="Upload" OnClick="bup_Click"></asp:ImageButton></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <asp:Label ID="msg" runat="server" Text="..." ForeColor="Blue"></asp:Label></td>
                    <td></td>
                </tr>
            </table>
        </div>
    </form>
</body>
</html>
