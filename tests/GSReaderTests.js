var GSReader = require("../core/LineReader.js").GS;

exports.testShouldUseWorksheetWhenEmptyOrNullOrStar = function(test) {
    test.equal(true, GSReader.shouldUseWorksheet('', 'LeTitre', 1));
    test.equal(true, GSReader.shouldUseWorksheet(null, 'LeTitre', 1));
    test.equal(true, GSReader.shouldUseWorksheet('*', 'LeTitre', 1));
    test.equal(false, GSReader.shouldUseWorksheet('a', 'LeTitre', 1));

    test.done();
};

exports.testShouldNotUseWorksheetWhenTitleNotSpecified = function(test) {
    test.equal(false, GSReader.shouldUseWorksheet(['a', 'b'], 'LeTitre', 1));
    test.equal(false, GSReader.shouldUseWorksheet(['a', 2], 'LeTitre', 1));

    test.done();
};

exports.testShouldUseWorksheetWhenTitleOrIndexSpecified = function(test) {
    test.equal(true, GSReader.shouldUseWorksheet(['a', 'LeTitre'], 'LeTitre', 1));
    test.equal(true, GSReader.shouldUseWorksheet(['a', 1], 'LeTitre', 1));

    test.done();
};

exports.testExtractFromWorksheetShouldExtraLines = function(test) {
    var reader = new GSReader('credentials', 'api_key', '*');

    var rawWorksheet = [{ value: 'Key', rowIndex: 0, columnIndex: 0 },
        { value: 'Value_fr', rowIndex: 0, columnIndex: 1 },
        { value: 'Value_nl', rowIndex: 0, columnIndex: 2 },
        { value: 'MaClé1', rowIndex: 1, columnIndex: 0 },
        { value: 'La valeur 1', rowIndex: 1, columnIndex: 1 },
        { value: 'De valuue 1', rowIndex: 1, columnIndex: 2 },
        { value: 'MaClé2', rowIndex: 2, columnIndex: 0 },
        { value: 'La vale de la clé 2', rowIndex: 2, columnIndex: 1 },
        { value: 'De valuee van key 2', rowIndex: 2, columnIndex: 2 },
        { value: '// un commentaire', rowIndex: 3, columnIndex: 0 },
        { value: 'une clée', rowIndex: 4, columnIndex: 0 },
        { value: '# un autre commentaire', rowIndex: 6, columnIndex: 0 }];

    var result = reader.extractFromWorksheet(rawWorksheet, 'Key', 'Value_fr');

    test.equal(7, result.length);
    test.equal('MaClé1', result[0].getKey());
    test.equal('La valeur 1', result[0].getValue());

    test.equal(true, result[3].isComment());
    test.equal(true, result[5].isEmpty());

    test.done();
};

exports.testExtractFromWorksheet_WhenValColumnDontExist_ShouldStillWork = function(test) {
    var reader = new GSReader('credentials', 'api_key', '*');

    var rawWorksheet = [{ value: 'Key', rowIndex: 0, columnIndex: 0 },
        { value: 'Value_fr', rowIndex: 0, columnIndex: 1 },
        { value: 'Value_nl', rowIndex: 0, columnIndex: 2 },
        { value: 'MaClé1', rowIndex: 1, columnIndex: 0 },
        { value: 'La valeur 1', rowIndex: 1, columnIndex: 1 },
        { value: 'De valuue 1', rowIndex: 1, columnIndex: 2 }];

    var result = reader.extractFromWorksheet(rawWorksheet, 'Key', 'NotExist');

    test.equal(1, result.length);
    test.equal('MaClé1', result[0].getKey());
    test.equal('', result[0].getValue());

    test.equal(false, result[0].isComment());

    test.done();
};