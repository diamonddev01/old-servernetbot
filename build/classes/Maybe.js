"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maybe = void 0;
class Maybe {
    constructor(value, middleware) {
        this.value = value;
        this.middleware = middleware;
    }
    run(fn) {
        var _a;
        if (this.value)
            this.value = fn(this.value);
        (_a = this.middleware) === null || _a === void 0 ? void 0 : _a.call(this, this.value);
        return this;
    }
    runAsync(fn) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Make sure to catch errors
            let worked = true;
            if (this.value)
                this.value = yield fn(this.value).catch((e) => {
                    worked = false;
                    console.error(e);
                });
            (_a = this.middleware) === null || _a === void 0 ? void 0 : _a.call(this, this.value);
            return this;
        });
    }
    checkDefined() {
        return this.value !== undefined;
    }
    convertToType(type) {
        const v = this.value;
        return v;
    }
}
exports.Maybe = Maybe;
