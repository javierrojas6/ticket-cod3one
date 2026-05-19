const safeJSON = requireUnit('lib-app/safe-json', {});

describe('safeJSON library', function () {

    it('should parse valid json values', function () {
        expect(safeJSON.parse('{"id": 10, "name": "test"}')).to.deep.equal({
            id: 10,
            name: 'test'
        });
    });

    it('should return fallback for invalid or empty json values', function () {
        expect(safeJSON.parse('{invalid', [])).to.deep.equal([]);
        expect(safeJSON.parse('', [])).to.deep.equal([]);
        expect(safeJSON.parse(null, [])).to.deep.equal([]);
    });
});