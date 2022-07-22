export class Maybe {
    value: any;
    middleware?: (value: any) => void;

    constructor(value: any, middleware?: (value: any) => void) {
        this.value = value;
        this.middleware = middleware;
    }

    run(fn: (value: any) => any) {
        if (this.value) this.value = fn(this.value);

        this.middleware?.(this.value);
        return this;
    }

    async runAsync(fn: (value: any) => any | Promise<any>) {
        // Make sure to catch errors
        let worked = true;
        if (this.value) this.value = await fn(this.value).catch((e: any) => {
            worked = false;
            console.error(e);
        });

        this.middleware?.(this.value);
        return this;
    }

    checkDefined() {
        return this.value !== undefined;
    }

    convertToType(type: any) {
        const v = <typeof type>this.value;

        return v;
    }
}