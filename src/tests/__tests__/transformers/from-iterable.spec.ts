import { transformer } from '../../../streams/transformer';
import { range } from '../../../helpers/helper-functions';

describe('fromIterable', () => {
    it('output all data from iterable', async () => {
        const arr = range(8, 1);
        const fromIterableTransform = transformer.fromIterable(arr);

        const result = await fromIterableTransform.toArray();
        expect(result).toEqual(arr);
    });

    it('output all data from sync generator', async () => {
        function* syncGenerator() {
            let i = 1;
            while (true) {
                yield i++;
                if (i === 9) break;
            }
        }
        const fromIterableTransform = transformer.fromIterable(syncGenerator());

        const result = await fromIterableTransform.toArray();
        expect(result).toEqual(range(8, 1));
    });
});

describe('fromIterable (async)', () => {
    it('output all data from async iterable', async () => {
        async function* asyncGenerator() {
            for (let i = 1; i <= 8; i++) {
                yield i;
            }
        }
        const fromIterableTransform = transformer.async.fromIterable(asyncGenerator());

        const result = await fromIterableTransform.toArray();
        expect(result).toEqual(range(8, 1));
    });
});
