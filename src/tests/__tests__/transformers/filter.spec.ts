import { Readable } from 'stream';
import { transformer } from '../../../streams/transformer';
import { range, streamEnd } from '../../../helpers/helper-functions';
import { DEFAULT_ERROR_TEXT, filterOutOddsAsync, filterOutOddsSync } from '../../../helpers/test-helper';

describe('filter', () => {
    describe('sync', () => {
        it('should filter out correctly', async () => {
            const source = Readable.from(range(8, 1));
            const filterTransform = source.pipe(transformer.filter(filterOutOddsSync));

            const result = await filterTransform.toArray();
            expect(result).toEqual([2, 4, 6, 8]);
        });

        it('should filter out on crash when considerErrorAsFilterOut is true', async () => {
            const source = Readable.from(range(8, 1));
            const filterTransform = source.pipe(
                transformer.filter(filterOutOddsSync, { considerErrorAsFilterOut: true }),
            );
            const result = await filterTransform.toArray();
            expect(result).toEqual([2, 4, 6, 8]);
        });

        it('should crash on error when considerErrorAsFilterOut is false', async () => {
            const source = Readable.from(range(8, 1));
            const filterOutOdds = (n: number) => {
                if (n % 2 === 0) {
                    throw Error(DEFAULT_ERROR_TEXT);
                }
                return true;
            };
            const filterTransform = source.pipe(transformer.filter(filterOutOdds, { considerErrorAsFilterOut: false }));

            const result: number[] = [];
            filterTransform.on('data', (data: number) => result.push(data));

            const streamPromise = streamEnd(filterTransform);
            await expect(streamPromise).rejects.toThrow(DEFAULT_ERROR_TEXT);
            expect(result).toEqual([1]);
        });

    });

    describe('async', () => {
        it('should filter out correctly', async () => {
            const source = Readable.from(range(8, 1));
            const filterOutOdds = async (n: number) => n % 2 === 0;
            const filterTransform = source.pipe(transformer.async.filter(filterOutOdds));

            const result = await filterTransform.toArray();
            expect(result).toEqual([2, 4, 6, 8]);
        });

        it('should filter out on crash when considerErrorAsFilterOut is true', async () => {
            const source = Readable.from(range(8, 1));

            const filterTransform = source.pipe(
                transformer.async.filter(filterOutOddsAsync(), { considerErrorAsFilterOut: true }),
            );

            const result = await filterTransform.toArray();
            expect(result).toEqual([2, 4, 6, 8]);
        });

        it('should crash on error when considerErrorAsFilterOut is false', async () => {
            const source = Readable.from(range(8, 1));
            const filterOutOdds = async (n: number) => {
                if (n % 2 === 0) {
                    throw Error(DEFAULT_ERROR_TEXT);
                }
                return true;
            };
            const filterTransform = source.pipe(
                transformer.async.filter(filterOutOdds, { considerErrorAsFilterOut: false }),
            );

            const result: number[] = [];
            filterTransform.on('data', (data: number) => result.push(data));

            await expect(streamEnd(filterTransform)).rejects.toThrow(DEFAULT_ERROR_TEXT);
            expect(result).toEqual([1]);
        });
    });
});
