import {distinctUntilChanged} from '../src';

describe('distinctUntilChanged', () => {
    test('distinct by default equals comparison', async () => {
        const results: number[] = [];
        const applyDistinctUntilChanged = distinctUntilChanged((i: number) => results.push(i));
        applyDistinctUntilChanged(1);
        applyDistinctUntilChanged(1);
        applyDistinctUntilChanged(2);
        applyDistinctUntilChanged(2);
        applyDistinctUntilChanged(1);
        expect(results).toEqual([1,2,1])
    });

    test('distinct by custom equals comparison', async () => {
        const results: string[] = [];
        const applyDistinctUntilChanged = distinctUntilChanged(
            (next: string) => results.push(next),
            ([a], [b]) => a.toLowerCase() === b.toLowerCase()
        );
        applyDistinctUntilChanged('abc');
        applyDistinctUntilChanged('aBc');
        applyDistinctUntilChanged('xyz');
        applyDistinctUntilChanged('abC');
        applyDistinctUntilChanged('ABC');
        expect(results).toEqual(['abc', 'xyz', 'abC'])
    });

    test('distinct with multiple params', async () => {
        const results: string[] = [];
        const applyDistinctUntilChanged = distinctUntilChanged((...params: string[]) => results.push(...params));
        applyDistinctUntilChanged('123', '123');
        applyDistinctUntilChanged('123', '123');
        applyDistinctUntilChanged('456', '123');
        applyDistinctUntilChanged('111', '222');
        applyDistinctUntilChanged('111', '222');
        expect(results).toEqual(['123','123','456','123','111','222'])
    });
})
