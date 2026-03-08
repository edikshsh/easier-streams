import { Readable } from 'stream';
import { transformer } from '../../../streams/transformer';

describe('pickElementFromArray', () => {
    it('should pick the correct element', async () => {
        const source = Readable.from([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8],
        ]);
        const pickFromArrayTransform = source.pipe(transformer.pickElementFromArray<number>(0));

        const result = await pickFromArrayTransform.toArray();
        expect(result).toEqual([1, 4, 7]);
    });

    it('should filter out chunks where the index is out of bounds', async () => {
        const source = Readable.from([
            [1, 2, 3],
            [4, 5],
            [6],
        ]);
        const pickThirdElement = source.pipe(transformer.pickElementFromArray<number>(2));

        const result = await pickThirdElement.toArray();
        expect(result).toEqual([3]); // only first array has index 2; undefined is not pushed
    });
});
