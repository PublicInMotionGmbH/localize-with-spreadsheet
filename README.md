# Convert a Google Spreadsheet to a localization file


## Installation
	npm install localize-with-spreadsheet

## Example
Given a Google Spreadsheet like this:  
![Spreadsheet example](https://github.com/xavierha/localize-with-spreadsheet/raw/master/doc/spreadsheet-example.png)

The tool fetch the spreadsheet and write the result to a file in the Android or iOS format:

![Result android](https://github.com/xavierha/localize-with-spreadsheet/raw/master/doc/result-android.png) ![Result iOS](https://github.com/xavierha/localize-with-spreadsheet/raw/master/doc/result-ios.png)

Create a file update-localization.js

	var Localize = require("localize-with-spreadsheet");
    var transformer = Localize.fromGoogleSpreadsheet(/credentials/, /spreadsheetId/, '*');
    transformer.setKeyCol('KEY');

    transformer.save("values/strings.xml", { valueCol: "NL", format: "android" });
    transformer.save("values-fr/strings.xml", { valueCol: "FR", format: "android" });

    transformer.save("nl.lproj/Localizable.strings", { valueCol: "NL", format: "ios" });
    transformer.save("fr.lproj/Localizable.strings", { valueCol: "FR", format: "ios" });

Run it with

    node update-localization.js

## Advanced
You can filter the worksheets to include with the second parameter of 'fromGoogleSpreadsheet'
Ex:

    Localize.fromGoogleSpreadsheet("<Key>", '*');
    Localize.fromGoogleSpreadsheet("<Key>", ['HomeScreen, 'ContactScreen']);
    Localize.fromGoogleSpreadsheet("<Key>", [0, 2]);

## Notes
- The script will preserve everything that is above the tags: < !-- AUTO-GENERATED --> or // AUTO-GENERATED
- From Google Sheets API v4 update, account credentials needs to be passed. They must contain private key and client email in the form of JSON object.

## Tests
Tests are localized under `tests/` directory. Some of them are written in [nodeunit](https://www.npmjs.com/package/nodeunit) (package is already deprecated). 
To run `nodeunit` tests execute:

    node tests/all.js

There are some already migrated to the [jest](https://jestjs.io/en/) tool. To run them execute:

`npm test` or `yarn test`