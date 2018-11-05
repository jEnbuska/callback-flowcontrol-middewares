import {debounce, distinctUntilChanged, latest, } from 'callback-flowcontrol-middewares';

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
        await new Promise(res => setTimeout(res, delays[i]));
    }
}
doStuff();
