var reporter = require('nodeunit').reporters.default;
reporter.run([
    'tests/AndroidTransformerTests.js',
    'tests/iOSTransformerTests.js',
    'tests/LineTests.js',
    'tests/WriterTests.js',
    'tests/PluralsTests.js'
]);
