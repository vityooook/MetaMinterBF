import { Buffer } from 'buffer';

if (!globalThis.Buffer) {
  globalThis.Buffer = Buffer;
}

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
