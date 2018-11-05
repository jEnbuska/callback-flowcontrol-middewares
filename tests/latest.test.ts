import {latest} from '../src';
import {sleep} from "./utils";

describe('latest', () => {
    test('latest should push back the same value callback yielded', async () => {
        let intermediateResult: any;
        function* generator(): IterableIterator<string> {
            intermediateResult = yield 'yielded-result';
        }
        await latest(generator)();
        expect(intermediateResult).toEqual('yielded-result')
    });

    test('push second item after waiting the first item to be pushed', async () => {
        let intermediateResults: string[] = [];
        function* generator(id: number): IterableIterator<void> {
            intermediateResults.push(`started-${id}`);
            yield;
            intermediateResults.push(`ending-${id}`);
        }
        const applyLatest = latest(generator);
        await Promise.all([applyLatest(0), applyLatest(1)]);

        expect(intermediateResults).toContain('ending-1');
        expect(intermediateResults).not.toContain('ending-0');
    });

    test('cancel multiple executions by applying next', async () => {
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
        const applyLatest = latest(generator);
        applyLatest(0);
        await sleep(190);
        applyLatest(1);
        await sleep(140);
        applyLatest(2);
        await sleep(90);
        applyLatest(3);
        await sleep(40);
        await applyLatest(4);
        expect(intermediateResults).toEqual([
            'started-0',  'continuing-0', 'still-continuing-0',
            'started-1',  'continuing-1',
            'started-2',
            'started-4',  'continuing-4', 'still-continuing-4', 'done-4'
        ])
    });
})
