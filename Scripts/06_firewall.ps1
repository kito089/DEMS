New-NetFirewallRule -DisplayName "DESM Backend" `
-Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow