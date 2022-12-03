export class Async {

    ps: Array<Promise<any>>;
    er: Error | null;

    constructor() {

        this.call = this.call.bind(this);
        this.rejectAll = this.rejectAll.bind(this);

        this.ps = [];
        this.er = null;
    }

    call(fn: (...as:Array<any>)=>any, ...as: Array<any>) {
        let pr = new Promise((r, j) => {
            setTimeout(async () => {
                try {
                    if (this.er) {
                        j(this.er);
                    }
                    else {

                        let rt = await fn(...as);

                        if (this.er) {
                            j(this.er);
                        }
                        else {
                            r(rt);
                        }
                    }
                }
                catch (er) {
                    j(er);
                }
                finally {
                    this.ps = this.ps.filter((p) => p != pr);
                }
            });
        });
        this.ps.push(pr);
        return pr;
    }

    async rejectAll(error = new Error()) {
        this.er = error;
        console.log([...this.ps]);
        await Promise.allSettled(this.ps);
        this.er = null;
    }
}
