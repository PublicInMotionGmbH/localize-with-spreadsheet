var GSReader = require("../core/LineReader.js").GS;

jest.mock('google-spreadsheet');

describe("GSReader", () => {
  test('should use worksheet when empty or null or star', () => {
    expect(GSReader.shouldUseWorksheet('', 'LeTitre', 1)).toBe(true);
    expect(GSReader.shouldUseWorksheet(null, 'LeTitre', 1)).toBe(true);
    expect(GSReader.shouldUseWorksheet('*', 'LeTitre', 1)).toBe(true);
    expect(GSReader.shouldUseWorksheet('a', 'LeTitre', 1)).toBe(false);
  });

  test('should not use worksheet when title not specified', () => {
    expect(GSReader.shouldUseWorksheet(['a', 'b'], 'LeTitre', 1)).toBe(false);
    expect(GSReader.shouldUseWorksheet(['a', 2], 'LeTitre', 1)).toBe(false);
  });

  test('should use worksheet when title or index specified', () => {
    expect(GSReader.shouldUseWorksheet(['a', 'LeTitre'], 'LeTitre', 1)).toBe(true);
    expect(GSReader.shouldUseWorksheet(['a', 1], 'LeTitre', 1)).toBe(true);
  });

  test('extract from worksheet should handle extra lines', () => {
    var reader = new GSReader({'client_email': "mail@to", 'private_key': '3287dfjskh'}, 'api_key', '*');

    var rawWorksheet = [{value: 'Key', rowIndex: 0, columnIndex: 0},
    {value: 'Value_fr', rowIndex: 0, columnIndex: 1},
    {value: 'Value_nl', rowIndex: 0, columnIndex: 2},
    {value: 'MaClé1', rowIndex: 1, columnIndex: 0},
    {value: 'La valeur 1', rowIndex: 1, columnIndex: 1},
    {value: 'De valuue 1', rowIndex: 1, columnIndex: 2},
    {value: 'MaClé2', rowIndex: 2, columnIndex: 0},
    {value: 'La vale de la clé 2', rowIndex: 2, columnIndex: 1},
    {value: 'De valuee van key 2', rowIndex: 2, columnIndex: 2},
    {value: '// un commentaire', rowIndex: 3, columnIndex: 0},
    {value: 'une clée', rowIndex: 4, columnIndex: 0},
    {value: '# un autre commentaire', rowIndex: 6, columnIndex: 0}];

    var result = reader.extractFromWorksheet(rawWorksheet, 'Key', 'Value_fr');

    expect(result.length).toBe(7);
    expect(result[0].getKey()).toBe('MaClé1');
    expect(result[0].getValue()).toBe('La valeur 1');

    expect(result[3].isComment()).toBe(true);
    expect(result[5].isEmpty()).toBe(true);
  });

  test('extract from worksheet when value column does not exist should still work', () => {
    var reader = new GSReader({'client_email': "mail@to", 'private_key': '3287dfjskh'}, 'api_key', '*');

    var rawWorksheet = [{value: 'Key', rowIndex: 0, columnIndex: 0},
    {value: 'Value_fr', rowIndex: 0, columnIndex: 1},
    {value: 'Value_nl', rowIndex: 0, columnIndex: 2},
    {value: 'MaClé1', rowIndex: 1, columnIndex: 0},
    {value: 'La valeur 1', rowIndex: 1, columnIndex: 1},
    {value: 'De valuue 1', rowIndex: 1, columnIndex: 2}];

    var result = reader.extractFromWorksheet(rawWorksheet, 'Key', 'NotExist');

    expect(result.length).toBe(1);
    expect(result[0].getKey()).toBe('MaClé1');
    expect(result[0].getValue()).toBe('');

    expect(result[0].isComment()).toBe(false);
  });
});