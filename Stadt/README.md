# Raumbelegung

Dies ist ein Projekt, das mit [Angular CLI](https://github.com/angular/angular-cli) erstellt wurde.

Diese verhält sich unterschiedlich bei devel und production builds. "production" build sind als iSign Vorlage verwendbar. "devel" builds hingegen können mit dem angular development server verwendet werden (ng serve)

## Entwicklung starten

 1. Install.bat ausführen (Installiert notwendige Komponenten)
 2. Run.bat ausführen (Startet die Seite)

## ZIP zum Verteilen erstellen

 1. Build.bat erstellt die ZIP-Datei
 2. dist/vhs-schwetzingen.zip enthätlt das Ergebnis

## Konfiguration

Die Konfiguration der Seite erfolgt über die config.json Datei. Deren Schema ist in [src/app/config/app-config.model.ts](src/app/config/app-config.model.ts) hinterlegt. In der "devel" Umgebung wird die Datei [src/assets/config/config.dev.json](src/assets/config/config.dev.json) verwendet. In der "production" Umgebung hingegen die Datei [src/assets/config/config.json](src/assets/config/config.json)

## Testlinks

Testlinks für lokales debuggen:

http://localhost:4200?s=test&s/search=qwertz&s/source=test&s/cat=category&s/id=id&s/term1=term1&s/term2=term2