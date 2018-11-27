import {debounce, distinctUntilChanged, latest, build} from 'callback-flowcontrol-middewares';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
async function doStuff(){
    const debouncer = debounce((text: string) => console.log(text), 100)
    debouncer('text');
    const distinctCallback = distinctUntilChanged((text: string) => console.log('changed', text))
    distinctCallback('1');
    distinctCallback('1');
    distinctCallback('2');
    distinctCallback('3');
    const latestCallback = latest(async function * (execution: number): any{
        console.log('proceed 0', execution);
        yield await new Promise(res => setTimeout(res, 100))
        console.log('proceed 1', execution);
        yield await new Promise(res => setTimeout(res, 100))

        console.log('proceed 2', execution);
        yield await new Promise(res => setTimeout(res, 100))
        console.log('done', execution);
    })
    const delays = [250, 150, 50];
    for (let i = 0; i <3 ; i++) {
        latestCallback(i);
        await sleep(delays[i]);
    }

    const combined = build()
        .debounce(20)
        .distinctUntilChanged()
        .latest()
        .callback(async function * (str: string): any{
            console.log('proceed 0', str);
            yield await new Promise(res => setTimeout(res, 100))
            console.log('proceed 1', str);
            yield await new Promise(res => setTimeout(res, 100))

            console.log('proceed 2', str);
            yield await new Promise(res => setTimeout(res, 100))
            console.log('done', str);
        });

    const delays2= [10, 150, 50];
    const strings = ['a','b','c']
    for (let i = 0; i <3 ; i++) {
        combined(strings[i]);
        await sleep(delays2[i]);
    }
}
doStuff();
