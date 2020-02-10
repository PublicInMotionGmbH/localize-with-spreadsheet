var Line = require('./Line.js');
const {GoogleSpreadsheet} = require('google-spreadsheet');
var Q = require('q');
var EOL = require('os').EOL;

var LineReader = {
    select: function (sheets, keyCol, valCol, cb) {
    }
};

var GSReader = function (credentialsFile, spreadsheetKey, sheetsFilter) {
    this._sheet = new GoogleSpreadsheet(spreadsheetKey);
    this._sheet.useServiceAccountAuth(require(credentialsFile));
    this._sheetsFilter = sheetsFilter;

    this._fetchDeferred = Q.defer();
    this._isFetching = false;
    this._fetchedWorksheets = null;
};

GSReader.prototype.fetchAllCells = async function () {
    var self = this;

    if (self._fetchedWorksheets == null) {

        if (!self._isFetching) {
            self._isFetching = true;

            try {
                await self._sheet.loadInfo();

                var worksheetReader = new WorksheetReader(self._sheetsFilter, self._sheet.sheetsByIndex);
                worksheetReader.read(function (fetchedWorksheets) {
                    self._fetchedWorksheets = fetchedWorksheets;
                    self._fetchDeferred.resolve(self._fetchedWorksheets);
                });
            } catch (error) {
                console.error('Error while fetching the Spreadsheet (' + error + ')');
                console.warn('WARNING! Check that your spreadsheet is "Published" in "File > Publish to the web..."');
                self._fetchDeferred.reject(err);
            }
        }

        return this._fetchDeferred.promise;
    } else {
        return self._fetchedWorksheets;
    }
}

GSReader.prototype.select = function (keyCol, valCol) {
    var deferred = Q.defer();
    var self = this;

    Q.when(self.fetchAllCells(), function (worksheets) {
        var extractedLines = self.extractFromRawData(worksheets, keyCol, valCol);
        deferred.resolve(extractedLines);
    }).fail(function (error) {
        deferred.reject();
    });

    return deferred.promise;
};

GSReader.prototype.extractFromRawData = function (rawWorksheets, keyCol, valCol) {
    var extractedLines = [];
    for (var i = 0; i < rawWorksheets.length; i++) {
        var extracted = this.extractFromWorksheet(rawWorksheets[i], keyCol, valCol);
        extractedLines.push.apply(extractedLines, extracted);
    }

    return extractedLines;
}

GSReader.prototype.extractFromWorksheet = function (rawWorksheet, keyCol, valCol) {
    var results = [];

    var rows = this.flatenWorksheet(rawWorksheet);

    var headers = rows[0];
    if (headers) {
        var keyIndex = -1, valIndex = -1;
        for (var i = 0; i < headers.length; i++) {
            var value = headers[i];
            if (value == keyCol) {
                keyIndex = i;
            }
            if (value == valCol) {
                valIndex = i;
            }
        }
        for (var i = 1; i < rows.length; i++) {
            var row = rows[i];

            if (row) {
                var keyValue = row[keyIndex];
                var valValue = row[valIndex];
                var line = new Line(keyValue, valValue);
                if (line.isComment()) {
                    results.push(new Line("", "\n"))
                }
                if (line.getKey() !== '') {
                    results.push(line);
                }
            }
        }
    }

    return results;
}

GSReader.prototype.flatenWorksheet = function (rawWorksheet) {
    var rows = [];

    for (var i = 0; i < rawWorksheet.length; i++) {
        var cell = rawWorksheet[i];

        var row = rows[cell.rowIndex];
        if (!row) {
            row = rows[cell.rowIndex] = [];
        }
        row[cell.columnIndex] = cell.value;
    }
    return rows;
}

GSReader.isAllSheets = function (sheet) {
    if (!sheet || sheet == '*') {
        return true;
    }
    return false;
};

GSReader.shouldUseWorksheet = function (selectedSheets, title, index) {
    if (GSReader.isAllSheets(selectedSheets)) {
        return true;
    } else {
        var selectedArray = forceArray(selectedSheets);
        for (var i = 0; i < selectedArray.length; i++) {
            var sheetIdentifier = selectedArray[i];

            if (typeof (sheetIdentifier) == "number" && index == sheetIdentifier) {
                return true;
            } else if (typeof (sheetIdentifier) == "string" && title == sheetIdentifier) {
                return true;
            }
        }
        return false;
    }
}

var WorksheetReader = function (filterSheets, worksheets) {
    this._filterSheets = filterSheets;
    this._worksheets = worksheets;
    this._index = 0;

    this._data = [];
}

WorksheetReader.prototype.read = function (cb) {
    this.next(cb);
}

WorksheetReader.prototype.next = async function (cb) {
    var self = this;
    if (this._index < this._worksheets.length) {
        var index = this._index++;
        var currentWorksheet = this._worksheets[index];
        if (GSReader.shouldUseWorksheet(this._filterSheets, currentWorksheet.title, index)) {
            try {
                await currentWorksheet.loadCells();
                self._data.push(self.getCells(currentWorksheet));
            } catch (error) {
                console.error(`Error while loading cells: ${error}`);
            }
            self.next(cb);
        } else {
            this.next(cb);
        }
    } else {
        cb(this._data);
    }
}

WorksheetReader.prototype.getCells = currentWorksheet => {
    const worksheetCells = [];
    [...Array(currentWorksheet.rowCount).keys()].forEach(rowIndex => {
        [...Array(currentWorksheet.columnCount).keys()].forEach(columnIndex => {
            worksheetCells.push(currentWorksheet.getCell(rowIndex, columnIndex));
        });
    });

    return worksheetCells;
}

var FakeReader = function (array) {
    this._array = array;
    this._index = 0;
};

FakeReader.prototype.select = function (sheets, keyCol, keyVal, cb) {
    var self = this;
    var target = [];

    this._array.forEach(function (key) {
        var v = self._array[key];

        target.push(new Line(v[keyCol], v[keyVal]));
    });

    cb(target);
};

var forceArray = function (val) {
    if (Array.isArray(val)) return val;
    if (!val) return [];
    return [val];
}

module.exports = {
    GS: GSReader,
    Fake: FakeReader
}
