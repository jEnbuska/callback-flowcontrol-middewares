import {debounce} from '../src'
import {sleep} from './utils';

describe('debounce', () => {
    test('push 3 items without waiting for debounce to finish', async () => {
        const pushed: number[] = [];
        const pusher = debounce((i) => pushed.push(i), 30);
        pusher(0);
        pusher(1);
        pusher(2);
        await sleep(30)
        expect(pushed).toEqual([2])
    });

    test('push second item after waiting the first item to be pushed', async () => {
        const pushed: number[] = [];
        const pusher = debounce((i) => pushed.push(i), 30);
        pusher(0);
        await sleep(30)
        pusher(1);
        await sleep(30)
        expect(pushed).toEqual([0, 1])
    });
})
