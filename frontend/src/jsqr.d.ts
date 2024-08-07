// src/jsqr.d.ts
declare module 'jsqr' {
    function jsQR(data: Uint8ClampedArray, width: number, height: number): { data: string };
    export default jsQR;
  }
  //this is a library for QR code scanning