java -jar yuicompressor-2.4.7.jar -o 'min/vissiadmin.js' vissidarte/js/vissiadmin.js
java -jar yuicompressor-2.4.7.jar -o 'min/vissi.js' vissidarte/js/vissi.js
java -jar yuicompressor-2.4.7.jar -o 'min/vissi.css' vissidarte/js/vissi.css

Write-Host "Press any key to continue ..."
$x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
