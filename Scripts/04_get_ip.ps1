$ip = (Get-NetIPAddress -AddressFamily IPv4 |
Where-Object {$_.InterfaceAlias -notlike "*Loopback*"}).IPAddress

Set-Content "$PSScriptRoot\..\Windows\ip.txt" $ip