import {build} from '../src';
import {sleep} from "./utils";

describe('build', () => {

    test('debounce with distinctUntilChanged', async () => {
        const results: number[] = [];
        const applyDebounceDistinctUntilChanged  = build()
            .debounce(10)
            .distinctUntilChanged()
            .callback((i: number) => results.push(i));
        applyDebounceDistinctUntilChanged(1);
        applyDebounceDistinctUntilChanged(2);
        await sleep(50);
        applyDebounceDistinctUntilChanged(3);
        await sleep(50);
        applyDebounceDistinctUntilChanged(3);
        await sleep(50);
        applyDebounceDistinctUntilChanged(4);
        await sleep(50);
        expect(results).toEqual([2, 3, 4])
    });


    test('distinctUntilChanged with latest', async () => {
        let intermediateResults: string[] = [];
        async function* generator(id: number): AsyncIterableIterator<any> {
            yield await sleep(50);
            intermediateResults.push(`started-${id}`);
            yield await sleep(50);
            intermediateResults.push(`continuing-${id}`);
            yield await sleep(50);
            intermediateResults.push(`still-continuing-${id}`);
            yield await sleep(50);
            intermediateResults.push(`done-${id}`);
        }
        const applyDistinctUntilChangedLatest = build()
            .distinctUntilChanged()
            .latest()
            .callback(generator);

        [0, 0].forEach(applyDistinctUntilChangedLatest);
        await sleep(190);
        [1, 1].forEach(applyDistinctUntilChangedLatest);
        await sleep(140);
        [2, 2].forEach(applyDistinctUntilChangedLatest);
        await sleep(90);
        [3, 3].forEach(applyDistinctUntilChangedLatest);
        await sleep(40);
        [3, 3].forEach(applyDistinctUntilChangedLatest);
        await applyDistinctUntilChangedLatest(4);
        expect(intermediateResults).toEqual([
            'started-0',  'continuing-0', 'still-continuing-0',
            'started-1',  'continuing-1',
            'started-2',
            'started-4',  'continuing-4', 'still-continuing-4', 'done-4'
        ])
    });


    test('latest with debounce', async () => {
        let intermediateResults: string[] = [];
        async function* generator(id: number): AsyncIterableIterator<any> {
            yield await sleep(50);
            intermediateResults.push(`started-${id}`);
            yield await sleep(50);
            intermediateResults.push(`continuing-${id}`);
            yield await sleep(50);
            intermediateResults.push(`still-continuing-${id}`);
            yield await sleep(50);
            intermediateResults.push(`done-${id}`);
        }
        const applyLatestDebounce = build()
            .latest()
            .debounce(0)
            .callback(generator);
        [1, 2, 0].forEach(applyLatestDebounce);
        await sleep(190);
        [0, 2, 1].forEach(applyLatestDebounce);
        await sleep(140);
        [0, 1, 2].forEach(applyLatestDebounce);
        await sleep(90);
        [1, 2 ,3].forEach(applyLatestDebounce);
        await sleep(40);
        [2, 3].forEach(applyLatestDebounce);
        await applyLatestDebounce(4);
        expect(intermediateResults).toEqual([
            'started-0',  'continuing-0', 'still-continuing-0',
            'started-1',  'continuing-1',
            'started-2',
            'started-4',  'continuing-4', 'still-continuing-4', 'done-4'
        ])
    });


    test('distinctUntilLatest with latest and debounce', async () => {
        let intermediateResults: string[] = [];
        async function* generator(id: number): AsyncIterableIterator<any> {
            yield await sleep(50);
            intermediateResults.push(`started-${id}`);
            yield await sleep(50);
            intermediateResults.push(`continuing-${id}`);
            yield await sleep(50);
            intermediateResults.push(`still-continuing-${id}`);
            yield await sleep(50);
            intermediateResults.push(`done-${id}`);
        }
        const allCombined = build()
            .distinctUntilChanged()
            .latest()
            .debounce(0)
            .callback(generator);

        [1, 0, 0].forEach(allCombined);
        await sleep(190);
        [0, 1, 1].forEach(allCombined);
        await sleep(140);
        [0, 2, 2].forEach(allCombined);
        await sleep(90);
        [1, 3 ,3].forEach(allCombined);
        await sleep(40);
        [3, 3].forEach(allCombined);
        await allCombined(4);
        expect(intermediateResults).toEqual([
            'started-0',  'continuing-0', 'still-continuing-0',
            'started-1',  'continuing-1',
            'started-2',
            'started-4',  'continuing-4', 'still-continuing-4', 'done-4'
        ])
    });

})
