
const NOT_SET = Symbol('NOT_SET');

function defaultComparator<T extends any[]>(a: T, b: T){
    if(a.length === b.length){
        for (let i = 0; i <a.length; i++) {
            if(a[i] !== b[i]) return false;
        }
        return true;
    }
    return false;
}


export function distinctUntilChanged<T extends any[]>(cb: (...params: T) => any, equals: (a: T, b: T) => boolean = defaultComparator) {
    let prev: any = NOT_SET;
    return function (...params: T): ReturnType<typeof cb> | void {
        if (prev !== NOT_SET && equals(prev, params)) return;
        prev = params;
        return cb(...params);
    }
}

export function latest<T extends any[]>(cb: (...params: T) => IterableIterator<any> | AsyncIterator<any> | Promise<void> | void) {
    let counter = 0;
    return async function(...params: T)  {
        const execution = ++counter;
        const iterable = await cb(...params);
        if (iterable && iterable.next) {
            let prev: any;
            while (execution === counter) {
                const { value, done }: { value: any, done: boolean } = await iterable.next(prev);
                if (done) return;
                else prev = value;
            }
        }
    };
}

export function debounce<T extends any[]>(cb: (...params: T) => any, ms: number) {
    let counter = 0;
    return async function (...params: T): Promise<void | ReturnType<typeof cb>> {
        let execution = ++counter;
        await new Promise(res => setTimeout(res, ms));
        if (execution === counter) {
            return cb(...params);
        }
    };
}

export type Builder<T extends any[]> = {
    latest: () => Builder<T>;
    debounce: (ms: number) => Builder<T>
    distinctUntilChanged: (equals?: (a: T, b: T) => boolean) => Builder<T>;
    callback: (cb: (...params: T) => any) => (...params: T) => any;
}
export function build<T extends any[]>(acc: any = []): Builder<T> {
    return {
        latest() {
            return build([(cb: any) => latest<T>(cb), ...acc, ]);
        },
        debounce(ms) {
            return build([ (cb: any) => debounce<T>(cb, ms), ...acc, ])
        },
        distinctUntilChanged(equals) {
            return build([ (cb: any) => distinctUntilChanged<T>(cb, equals), ...acc, ]);
        },
        callback(cb) {
            return [...acc].reduce((prev, next) => next(prev), cb)
        }
    }
}
