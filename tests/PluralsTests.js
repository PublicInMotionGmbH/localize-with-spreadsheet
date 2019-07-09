const androidTransformer = require("../core/Transformer.js")['android'];
const iosTransfomer = require("../core/Transformer.js")['ios'];
const yaml = require('js-yaml');

// Android
exports.android_isPlural_formatPlural = function (test) {
    let result = androidTransformer.transformKeyValue('bookings_seats',
        'one: one seat\n' +
        'two: two seats\n' +
        'other: %d seats');

    test.equal('  <plurals name="bookings_seats">\n' +
        '    <item quantity="one">one seat</item>\n' +
        '    <item quantity="two">two seats</item>\n' +
        '    <item quantity="other">%d seats</item>\n' +
        '  </plurals>', result);

    test.done();
};

exports.android_isPluralWithAdditionalSpaces_formatPlural = function (test) {
    let result = androidTransformer.transformKeyValue('bookings_seats',
        'one  : one seat\n' +
        'two:  two seats\n' +
        'other :   %d seats');

    test.equal('  <plurals name="bookings_seats">\n' +
        '    <item quantity="one">one seat</item>\n' +
        '    <item quantity="two">two seats</item>\n' +
        '    <item quantity="other">%d seats</item>\n' +
        '  </plurals>', result);

    test.done();
};

exports.android_isPluralWithNoSpacesAroundColon_formatPlural = function (test) {
    let result = androidTransformer.transformKeyValue('bookings_seats',
        'one:one seat\n' +
        'two:two seats\n' +
        'other:%d seats');

    test.equal('  <plurals name="bookings_seats">\n' +
        '    <item quantity="one">one seat</item>\n' +
        '    <item quantity="two">two seats</item>\n' +
        '    <item quantity="other">%d seats</item>\n' +
        '  </plurals>', result);

    test.done();
};

exports.android_isPluralWithNoSpacesAroundColonAndMisspellingPresent_throwYamlException = function (test) {
    let transformBlock = () => {
        androidTransformer.transformKeyValue('bookings_seats',
            'onew:one seat\n' +
            'two:two seats\n' +
            'other:%d seats');
    };

    test.throws(transformBlock, function (error) {
        return error instanceof yaml.YAMLException
    });

    test.done();
};

exports.android_hasPluralKeywordInsideButIsNotPlural_doNotFormatPlural = function (test) {
    let result = androidTransformer.transformKeyValue('warning', 'Attenzione: ');

    test.equal('  <string name="warning">Attenzione: </string>', result);

    test.done();
};

// iOS
exports.ios_isPlural_formatPlural = function (test) {
    let result = iosTransfomer.transformKeyValue('bookings_seats',
        'one: one seat\n' +
        'two: two seats\n' +
        'other: %d seats', true);

    test.equal(
        '\t<key>bookings_seats</key>\n' +
        '\t<dict>\n' +
        '\t\t<key>NSStringLocalizedFormatKey</key>\n' +
        '\t\t<string>%#@value@</string>\n' +
        '\t\t<key>value</key>\n' +
        '\t\t<dict>\n' +
        '\t\t\t<key>NSStringFormatSpecTypeKey</key>\n' +
        '\t\t\t<string>NSStringPluralRuleType</string>\n' +
        '\t\t\t<key>NSStringFormatValueTypeKey</key>\n' +
        '\t\t\t<string>d</string>\n' +
        '\t\t\t<key>one</key>\n' +
        '\t\t\t<string>one seat</string>\n' +
        '\t\t\t<key>two</key>\n' +
        '\t\t\t<string>two seats</string>\n' +
        '\t\t\t<key>other</key>\n' +
        '\t\t\t<string>%d seats</string>\n' +
        '\t\t</dict>\n' +
        '\t</dict>', result);

    test.done();
};

exports.ios_isPluralWithAdditionalSpaces_formatPlural = function (test) {
    let result = iosTransfomer.transformKeyValue('bookings_seats',
        'one  : one seat\n' +
        'two:  two seats\n' +
        'other :   %d seats', true);

    test.equal(
        '\t<key>bookings_seats</key>\n' +
        '\t<dict>\n' +
        '\t\t<key>NSStringLocalizedFormatKey</key>\n' +
        '\t\t<string>%#@value@</string>\n' +
        '\t\t<key>value</key>\n' +
        '\t\t<dict>\n' +
        '\t\t\t<key>NSStringFormatSpecTypeKey</key>\n' +
        '\t\t\t<string>NSStringPluralRuleType</string>\n' +
        '\t\t\t<key>NSStringFormatValueTypeKey</key>\n' +
        '\t\t\t<string>d</string>\n' +
        '\t\t\t<key>one</key>\n' +
        '\t\t\t<string>one seat</string>\n' +
        '\t\t\t<key>two</key>\n' +
        '\t\t\t<string>two seats</string>\n' +
        '\t\t\t<key>other</key>\n' +
        '\t\t\t<string>%d seats</string>\n' +
        '\t\t</dict>\n' +
        '\t</dict>', result);

    test.done();
};

exports.ios_isPluralWithNoSpacesAroundColon_formatPlural = function (test) {
    let result = iosTransfomer.transformKeyValue('bookings_seats',
        'one:one seat\n' +
        'two:two seats\n' +
        'other:%d seats', true);

    test.equal(
        '\t<key>bookings_seats</key>\n' +
        '\t<dict>\n' +
        '\t\t<key>NSStringLocalizedFormatKey</key>\n' +
        '\t\t<string>%#@value@</string>\n' +
        '\t\t<key>value</key>\n' +
        '\t\t<dict>\n' +
        '\t\t\t<key>NSStringFormatSpecTypeKey</key>\n' +
        '\t\t\t<string>NSStringPluralRuleType</string>\n' +
        '\t\t\t<key>NSStringFormatValueTypeKey</key>\n' +
        '\t\t\t<string>d</string>\n' +
        '\t\t\t<key>one</key>\n' +
        '\t\t\t<string>one seat</string>\n' +
        '\t\t\t<key>two</key>\n' +
        '\t\t\t<string>two seats</string>\n' +
        '\t\t\t<key>other</key>\n' +
        '\t\t\t<string>%d seats</string>\n' +
        '\t\t</dict>\n' +
        '\t</dict>', result);

    test.done();
};

exports.ios_isPluralWithNoSpacesAroundColonAndMisspellingPresent_throwYamlException = function (test) {
    let transformBlock = () => {
        iosTransfomer.transformKeyValue('bookings_seats',
            'onew:one seat\n' +
            'two:two seats\n' +
            'other:%d seats', true);
    };

    test.throws(transformBlock, function (error) {
        return error instanceof yaml.YAMLException
    });

    test.done();
};

exports.ios_hasPluralKeyWordInsideButIsNotPlural_doNotFormatPlural = function (test) {
    let result = iosTransfomer.transformKeyValue('warning', 'Attenzione: ', false);

    test.equal('"warning" = "Attenzione: ";', result);

    test.done();
};

