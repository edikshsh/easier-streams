import { Readable } from 'stream';
import { add } from '../../../helpers/test-helper';
import { range } from '../../../helpers/helper-functions';
import { SimpleTransform } from '../../../streams/transforms/base/simple-transform';

describe('BaseTransform.pipeline', () => {
    it('pipes into a single transform and returns it', async () => {
        const source = Readable.from(range(8, 1));
        const add1 = new SimpleTransform(add(1), { objectMode: true });
        const add2 = new SimpleTransform(add(2), { objectMode: true });

        source.pipe(add1);
        const last = add1.pipeline(add2);

        const result = await last.toArray();
        expect(result).toEqual(range(8, 4)); // 1+1+2=4 .. 8+1+2=11
    });
});

describe('BaseTransform.pipelineMany', () => {
    it('pipes through an array of transforms', async () => {
        const source = Readable.from(range(8, 1));
        const add1 = new SimpleTransform(add(1), { objectMode: true });
        const add2 = new SimpleTransform(add(2), { objectMode: true });
        const add3 = new SimpleTransform(add(3), { objectMode: true });

        source.pipe(add1);
        add1.pipelineMany([add2, add3]);

        const [result2, result3] = await Promise.all([add2.toArray(), add3.toArray()]);
        expect(result2).toEqual(range(8, 4)); // 1+1+2=4 .. 8+1+2=11
        expect(result3).toEqual(range(8, 5)); // 1+1+3=5 .. 8+1+2+3=14
    });
});
