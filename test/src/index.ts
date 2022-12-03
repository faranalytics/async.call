import { Async } from '@faranalytics/async.call';

let async = new Async();

(async () => {

    console.log(Date.now());

    document.addEventListener('keydown', async (event) => {

        if (event.key == 'a') {
            try {
                await async.rejectAll(new Error('Test Error'));
                console.log([...async.ps]);
                console.log("It's OK to do something else now.");
            }
            catch (e) {
                console.error('keydown', e);
            }
        }
    });

    async function count(index: number) {
        for (let i = index; i < 1000000; i++) {
            await new Promise((r, j) => setTimeout(() => r(null), 1)); //  This could be anything async;
            if (i % 1000 == 0) {
                return await async.call(count, ++i);
            }
        }
    }

    try {
        await async.call(count, 0);
        console.log('finally');
    }
    catch (e) {
        console.error('finally', e);
    }
})();