$ip = Get-Content "$PSScriptRoot\..\Windows\ip.txt"

(Get-Content "$PSScriptRoot\..\Windows\DEMSFRONT\config.js") `
-replace "API_URL", "http://$ip:3000" |
Set-Content "$PSScriptRoot\..\Windows\DEMSFRONT\config.js"