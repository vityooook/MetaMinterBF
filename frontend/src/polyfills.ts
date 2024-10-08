import { Buffer } from 'buffer';

globalThis.Buffer = Buffer;
(window as any).global = window;

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
