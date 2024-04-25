# Raumbelegung

Dies ist ein Projekt, das mit [Angular CLI](https://github.com/angular/angular-cli) erstellt wurde.


## Lokale tests

Die Vorlage kann lokal getestet werden mit dem Befehl `ng test` wird der Testserver gestartet. Unter `assets/test-services` werden die zu verwendenden Server eingtragen. Zu beachten ist, dass der Idenditätsserver für den lokalen Test freigeschaltet werden muss dies geschieht mit dem Befehl `issrvconfig.exe apply default --forms:additionalRedirectUris:0=http://localhost:4200` auf dem Server.

## Testlinks

Feste texte
http://localhost:4200/?s=raumbelegung2021_free&s/qr=test&s/title=title&s/subtitile=subtitle&s/from=from&s/to=to&s/participants=participants

Ohne qr code
http://localhost:4200/?s=raumbelegung2021A&s/s=test&s/title=title&s/subtitile=subtitle&s/from=from&s/to=to&s/participants=participants

Mit qr code
http://localhost:4200/?s=raumbelegung2021A&s/qr=qr&s/s=test&s/title=title&s/subtitile=subtitle&s/from=from&s/to=to&s/participants=participants
