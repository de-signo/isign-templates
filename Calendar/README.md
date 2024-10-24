# Raumbelegung

Dies ist ein Projekt, das mit [Angular CLI](https://github.com/angular/angular-cli) erstellt wurde.

Diese verhält sich unterschiedlich bei devel und production builds. "production" build sind als iSign Vorlage verwendbar. "devel" builds hingegen können mit dem angular development server verwendet werden (ng serve)

## Entwicklung starten

 1. 'npm install' ausführen (Installiert notwendige Komponenten)
 2. 'ng serve --open' ausführen (Startet die Seite)

## ZIP zum Verteilen erstellen

 1. 'npm run zip' erstellt die ZIP-Datei
 2. dist/calendar.zip enthätlt das Ergebnis


## Testlinks

http://localhost:4200/?s=test&s/header=CALENDAR&s/days=1&s/startt=8&s/endt=18&s/source=test&s/begin=from&s/end=to&s/name1=title
http://localhost:4200/?s=test&s/header=CALENDAR&s/days=MO-SA&s/startt=8&s/endt=18&s/source=test&s/begin=from&s/end=to&s/name1=title
