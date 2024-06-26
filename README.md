# isign-standardvorlagen

This project contains templates for iSign. Visit [DE SIGNO](https://de-signo.de) for information about iSign.

## License

This project is dual-licensed, allowing you to choose between the following licenses:

### Affero General Public License (AGPL)

The source code in this repository is made available under the terms of the AGPL. You are free to use, modify, distribute, and sublicense the code under the AGPL, as long as you adhere to the terms of the license. Please see the [LICENSE-AGPL](LICENSE-AGPL) file for more details.

### Proprietary License

In addition to the AGPL, the software is also available under a proprietary license for commercial use. If you prefer to use the software under the proprietary license, please contact [info@de-signo.de](info@de-signo.de) for more information and licensing options.

Please note that if you choose to use the software under the proprietary license, it may have different terms and conditions than the AGPL.

## Getting Started

Requirements:

- nodejs v18
- npm 8

To build thee project you must first bild the libs. Then you can build each template separately.

```
npm install

pushd lib
ng build
popd

pushd Raumbelegung
npm run zip
popd

pushd Stadt
npm run zip
popd

pushd Calendar
npm run zip
popd

pushd door1
npm run zip
popd

pushd time
npm run zip
popd
```

Use the files in the `dist` folder to install in iSign.

---

# isign-standarvorlagen

Dieses Projekt enthält Vorlagen für iSign. Besuchen Sie [DE SIGNO](https://de-signo.de) für Infomationen über iSign.

## Lizenz

Dieses Projekt wird unter einer Dual-Lizenz angeboten, sodass Sie zwischen den folgenden Lizenzen wählen kannst:

### Affero General Public License (AGPL)

Der Quellcode in diesem Repository steht unter den Bedingungen der AGPL zur Verfügung. Sie können den Code gemäß der AGPL verwenden, modifizieren, verbreiten und unterlizenzieren, solange Sie sich an die Bestimmungen der Lizenz halten. Weitere Informationen finden Sie in der Datei [LICENSE-AGPL](LICENSE-AGPL).

### Proprietäre Lizenz

Zusätzlich zur AGPL steht die Software auch unter einer proprietären Lizenz für kommerzielle Nutzung zur Verfügung. Wenn Sie die Software lieber unter der proprietären Lizenz verwenden möchten, kontaktieren Sie bitte [info@de-signo.de](info@de-signo.de) für weitere Informationen und Lizenzierungsoptionen.

Bitte beachten Sie, dass die proprietäre Lizenz möglicherweise andere Bedingungen hat als die AGPL.
