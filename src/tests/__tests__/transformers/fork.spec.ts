import { PassThrough, pipeline as nodePipeline } from 'stream';
import { noop, range, streamEnd } from '../../../helpers/helper-functions';
import { transformer } from '../../../streams/transformer';
import { filterOutOddsSync } from '../../../helpers/test-helper';
import { FORK_OUTPUT_ERROR } from '../../../streams/transforms/utility/fork-transform';

describe('fork', () => {
    describe('sync', () => {
        it('should pass kept values to one stream, and discard values to another', async () => {
            const keptValues: number[] = [];
            const filteredValues: number[] = [];
            const source = transformer.fromIterable(range(8, 1));
            const fork = transformer.fork(filterOutOddsSync);
            source.pipeline(fork);

            fork.filterTrueTransform.on('data', (evenNumber) => keptValues.push(evenNumber));
            fork.filterFalseTransform.on('data', (oddNumber) => filteredValues.push(oddNumber));

            await Promise.all([streamEnd(fork.filterTrueTransform), streamEnd(fork.filterFalseTransform)]);

            expect(keptValues).toEqual([2, 4, 6, 8]);
            expect(filteredValues).toEqual([1, 3, 5, 7]);
        });
    });

    describe('one-sided routing', () => {
        it('filterFalseTransform is empty when all items match the filter', async () => {
            const source = transformer.fromIterable([2, 4, 6, 8]);
            const fork = transformer.fork(filterOutOddsSync); // keeps evens
            source.pipeline(fork);

            const [trueResult, falseResult] = await Promise.all([
                fork.filterTrueTransform.toArray(),
                fork.filterFalseTransform.toArray(),
            ]);

            expect(trueResult).toEqual([2, 4, 6, 8]);
            expect(falseResult).toEqual([]);
        });

        it('filterTrueTransform is empty when no items match the filter', async () => {
            const source = transformer.fromIterable([1, 3, 5, 7]);
            const fork = transformer.fork(filterOutOddsSync); // keeps evens
            source.pipeline(fork);

            const [trueResult, falseResult] = await Promise.all([
                fork.filterTrueTransform.toArray(),
                fork.filterFalseTransform.toArray(),
            ]);

            expect(trueResult).toEqual([]);
            expect(falseResult).toEqual([1, 3, 5, 7]);
        });
    });

    describe('pipe restrictions', () => {
        it('should throw when .pipe() is called on the fork', () => {
            const fork = transformer.fork(filterOutOddsSync);
            expect(() => fork.pipe(new PassThrough())).toThrow(FORK_OUTPUT_ERROR);
        });

        it('should throw when .pipeline() is called on the fork', () => {
            const fork = transformer.fork(filterOutOddsSync);
            expect(() => (fork as any).pipeline(new PassThrough())).toThrow(FORK_OUTPUT_ERROR);
        });

        it('should throw when used as a readable in Node pipeline()', () => {
            const source = transformer.fromIterable(range(8, 1));
            const fork = transformer.fork(filterOutOddsSync);
            const dest = new PassThrough({ objectMode: true });
            expect(() => nodePipeline(source, fork as any, dest, noop)).toThrow(FORK_OUTPUT_ERROR);
        });
    });

    describe('asyncFork', () => {
        it('should pass kept values to one stream, and discard values to another', async () => {
            const source = transformer.fromIterable(range(8, 1));
            const filterOutOdds = async (n: number) => n % 2 === 0;
            const fork = transformer.async.fork(filterOutOdds);
            source.pipeline(fork);

            const [keptValues, filteredValues] = await Promise.all([
                fork.filterTrueTransform.toArray(),
                fork.filterFalseTransform.toArray(),
            ]);

            expect(keptValues).toEqual([2, 4, 6, 8]);
            expect(filteredValues).toEqual([1, 3, 5, 7]);
        });
    });
});
