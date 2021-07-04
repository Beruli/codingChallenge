let codeChallengeserver = require('../codeChallengeServer')

describe('transformResponse', function() {

    it('should show transform nothing if nothing is entered', function() {
        const testData = { "results": []};

        const result = codeChallengeserver.transformResponse(testData);
        expect(result.length).toBe(0, 'No results expected');
    })

    it('should transform one album', function() {
        const testData = { "results": [
                {
                    "artistName": "Miley Cyrus",
                    "collectionName": "Whatever",
                    "artworkUrl100": "testURL"
                }
            ]};

        const result = codeChallengeserver.transformResponse(testData);
        expect(result.length).toBe(1, 'Exactly one response expected');
        expect(result[0].name).toBe('Miley Cyrus', 'Wrong artist name');
        expect(result[0].album).toBe('Whatever', 'Wrong album name');
        expect(result[0].thumbnail).toBe('testURL', 'Wrong thumbnail URL');
    })

    it('should ignore entries with no album name', function() {
        const testData = { "results": [
                {
                    "artistName": "Miley Cyrus",
                    "noAlbumName": "Whatever",
                    "artworkUrl100": "testURL"
                }
            ]};

        const result = codeChallengeserver.transformResponse(testData);
        console.log(result);
        expect(result.length).toBe(0, 'No results expected');
    })

    it('should ignore entire with no thumbnail', function() {
        const testData = { "results": [
                {
                    "artistName": "Miley Cyrus",
                    "collectionName": "Whatever",
                    "noURL": "testURL"
                }
            ]};

        const result = codeChallengeserver.transformResponse(testData);
        expect(result.length).toBe(0, 'No results expected');
    })

    it('should transform one album', function() {
        const testData = { "results": [
                {
                    "artistName": "Miley Cyrus",
                    "collectionName": "Whatever",
                    "artworkUrl100": "testURL"
                },
                {
                    "artistName": "Miley Cyrus",
                    "collectionName": "Whatever Two",
                    "artworkUrl100": "testURL"
                },
                {
                    "artistName": "Miley Cyrus",
                    "collectionName": "Whatever",
                    "artworkUrl100": "testURL"
                }
            ]};

        const result = codeChallengeserver.transformResponse(testData);
        expect(result.length).toBe(2, 'Exactly two responses expected');
        expect(result[0].name).toBe('Miley Cyrus', 'Wrong artist name');
        expect(result[0].album).toBe('Whatever', 'Wrong album name');
        expect(result[0].thumbnail).toBe('testURL', 'Wrong thumbnail URL');
        expect(result[1].name).toBe('Miley Cyrus', 'Wrong artist name');
        expect(result[1].album).toBe('Whatever Two', 'Wrong album name');
        expect(result[1].thumbnail).toBe('testURL', 'Wrong thumbnail URL');
    })

})
