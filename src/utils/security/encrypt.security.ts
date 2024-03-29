import { int64 } from './int64.class';

import * as CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('JMEI-123');
const iv = CryptoJS.enc.Utf8.parse('7061737323313233');

export function encrypt(text: string) {
  return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
}

export function decrypt(encrypted: any) {
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

export class Encrypt64 {
  public toBase64fromsha512(entry: string): string {
    const secretKey = process.env.SECRET_KEY;
    return this.b64_sha512(entry + secretKey);
  }

  private b64_sha512(s): string {
    const str_utf = this.str2rstr_utf8(s);
    const rstr = this.rstr_sha512(str_utf);
    const result = this.rstr2b64(rstr);
    return result;
  }

  private rstr_sha512(s) {
    return this.binb2rstr(this.binb_sha512(this.rstr2binb(s), s.length * 8));
  }

  private rstr2b64(input) {
    let b64pad = '=';
    try {
      b64pad;
    } catch (e) {
      b64pad = '';
    }
    const tab =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    const len = input.length;
    for (let i = 0; i < len; i += 3) {
      const triplet =
        (input.charCodeAt(i) << 16) |
        (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) |
        (i + 2 < len ? input.charCodeAt(i + 2) : 0);
      for (let j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > input.length * 8) output += b64pad;
        else output += tab.charAt((triplet >>> (6 * (3 - j))) & 0x3f);
      }
    }
    return output;
  }

  /*
   * Encode a string as utf-8.
   * For efficiency, this assumes the input is valid utf-16.
   */
  private str2rstr_utf8(input) {
    let output = '';
    let i = -1;
    let x, y;

    while (++i < input.length) {
      /* Decode utf-16 surrogate pairs */
      x = input.charCodeAt(i);
      y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
      if (0xd800 <= x && x <= 0xdbff && 0xdc00 <= y && y <= 0xdfff) {
        x = 0x10000 + ((x & 0x03ff) << 10) + (y & 0x03ff);
        i++;
      }

      /* Encode output as utf-8 */
      if (x <= 0x7f) output += String.fromCharCode(x);
      else if (x <= 0x7ff)
        output += String.fromCharCode(
          0xc0 | ((x >>> 6) & 0x1f),
          0x80 | (x & 0x3f),
        );
      else if (x <= 0xffff)
        output += String.fromCharCode(
          0xe0 | ((x >>> 12) & 0x0f),
          0x80 | ((x >>> 6) & 0x3f),
          0x80 | (x & 0x3f),
        );
      else if (x <= 0x1fffff)
        output += String.fromCharCode(
          0xf0 | ((x >>> 18) & 0x07),
          0x80 | ((x >>> 12) & 0x3f),
          0x80 | ((x >>> 6) & 0x3f),
          0x80 | (x & 0x3f),
        );
    }
    return output;
  }

  /*
   * Convert a raw string to an array of big-endian words
   * Characters >255 have their high-byte silently ignored.
   */
  private rstr2binb(input) {
    const output = Array(input.length >> 2);
    for (let i = 0; i < output.length; i++) output[i] = 0;
    for (let i = 0; i < input.length * 8; i += 8)
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (24 - (i % 32));
    return output;
  }

  /*
   * Convert an array of big-endian words to a string
   */
  private binb2rstr(input) {
    let output = '';
    for (let i = 0; i < input.length * 32; i += 8)
      output += String.fromCharCode((input[i >> 5] >>> (24 - (i % 32))) & 0xff);
    return output;
  }

  /*
   * Calculate the SHA-512 of an array of big-endian dwords, and a bit length
   */
  private binb_sha512(x, len) {
    let sha512_k;
    if (sha512_k == undefined) {
      //SHA512 constants
      sha512_k = [
        new int64(0x428a2f98, -685199838),
        new int64(0x71374491, 0x23ef65cd),
        new int64(-1245643825, -330482897),
        new int64(-373957723, -2121671748),
        new int64(0x3956c25b, -213338824),
        new int64(0x59f111f1, -1241133031),
        new int64(-1841331548, -1357295717),
        new int64(-1424204075, -630357736),
        new int64(-670586216, -1560083902),
        new int64(0x12835b01, 0x45706fbe),
        new int64(0x243185be, 0x4ee4b28c),
        new int64(0x550c7dc3, -704662302),
        new int64(0x72be5d74, -226784913),
        new int64(-2132889090, 0x3b1696b1),
        new int64(-1680079193, 0x25c71235),
        new int64(-1046744716, -815192428),
        new int64(-459576895, -1628353838),
        new int64(-272742522, 0x384f25e3),
        new int64(0xfc19dc6, -1953704523),
        new int64(0x240ca1cc, 0x77ac9c65),
        new int64(0x2de92c6f, 0x592b0275),
        new int64(0x4a7484aa, 0x6ea6e483),
        new int64(0x5cb0a9dc, -1119749164),
        new int64(0x76f988da, -2096016459),
        new int64(-1740746414, -295247957),
        new int64(-1473132947, 0x2db43210),
        new int64(-1341970488, -1728372417),
        new int64(-1084653625, -1091629340),
        new int64(-958395405, 0x3da88fc2),
        new int64(-710438585, -1828018395),
        new int64(0x6ca6351, -536640913),
        new int64(0x14292967, 0xa0e6e70),
        new int64(0x27b70a85, 0x46d22ffc),
        new int64(0x2e1b2138, 0x5c26c926),
        new int64(0x4d2c6dfc, 0x5ac42aed),
        new int64(0x53380d13, -1651133473),
        new int64(0x650a7354, -1951439906),
        new int64(0x766a0abb, 0x3c77b2a8),
        new int64(-2117940946, 0x47edaee6),
        new int64(-1838011259, 0x1482353b),
        new int64(-1564481375, 0x4cf10364),
        new int64(-1474664885, -1136513023),
        new int64(-1035236496, -789014639),
        new int64(-949202525, 0x654be30),
        new int64(-778901479, -688958952),
        new int64(-694614492, 0x5565a910),
        new int64(-200395387, 0x5771202a),
        new int64(0x106aa070, 0x32bbd1b8),
        new int64(0x19a4c116, -1194143544),
        new int64(0x1e376c08, 0x5141ab53),
        new int64(0x2748774c, -544281703),
        new int64(0x34b0bcb5, -509917016),
        new int64(0x391c0cb3, -976659869),
        new int64(0x4ed8aa4a, -482243893),
        new int64(0x5b9cca4f, 0x7763e373),
        new int64(0x682e6ff3, -692930397),
        new int64(0x748f82ee, 0x5defb2fc),
        new int64(0x78a5636f, 0x43172f60),
        new int64(-2067236844, -1578062990),
        new int64(-1933114872, 0x1a6439ec),
        new int64(-1866530822, 0x23631e28),
        new int64(-1538233109, -561857047),
        new int64(-1090935817, -1295615723),
        new int64(-965641998, -479046869),
        new int64(-903397682, -366583396),
        new int64(-779700025, 0x21c0c207),
        new int64(-354779690, -840897762),
        new int64(-176337025, -294727304),
        new int64(0x6f067aa, 0x72176fba),
        new int64(0xa637dc5, -1563912026),
        new int64(0x113f9804, -1090974290),
        new int64(0x1b710b35, 0x131c471b),
        new int64(0x28db77f5, 0x23047d84),
        new int64(0x32caab7b, 0x40c72493),
        new int64(0x3c9ebe0a, 0x15c9bebc),
        new int64(0x431d67c4, -1676669620),
        new int64(0x4cc5d4be, -885112138),
        new int64(0x597f299c, -60457430),
        new int64(0x5fcb6fab, 0x3ad6faec),
        new int64(0x6c44198c, 0x4a475817),
      ];
    }

    //Initial hash values
    const H = [
      new int64(0x6a09e667, -205731576),
      new int64(-1150833019, -2067093701),
      new int64(0x3c6ef372, -23791573),
      new int64(-1521486534, 0x5f1d36f1),
      new int64(0x510e527f, -1377402159),
      new int64(-1694144372, 0x2b3e6c1f),
      new int64(0x1f83d9ab, -79577749),
      new int64(0x5be0cd19, 0x137e2179),
    ];

    const T1 = new int64(0, 0),
      T2 = new int64(0, 0),
      a = new int64(0, 0),
      b = new int64(0, 0),
      c = new int64(0, 0),
      d = new int64(0, 0),
      e = new int64(0, 0),
      f = new int64(0, 0),
      g = new int64(0, 0),
      h = new int64(0, 0),
      //Temporary variables not specified by the document
      s0 = new int64(0, 0),
      s1 = new int64(0, 0),
      Ch = new int64(0, 0),
      Maj = new int64(0, 0),
      r1 = new int64(0, 0),
      r2 = new int64(0, 0),
      r3 = new int64(0, 0);
    let j, i;
    const W = new Array(80);
    for (i = 0; i < 80; i++) W[i] = new int64(0, 0);

    // append padding to the source string. The format is described in the FIPS.
    x[len >> 5] |= 0x80 << (24 - (len & 0x1f));
    x[(((len + 128) >> 10) << 5) + 31] = len;

    for (
      i = 0;
      i < x.length;
      i += 32 //32 dwords is the block size
    ) {
      this.int64copy(a, H[0]);
      this.int64copy(b, H[1]);
      this.int64copy(c, H[2]);
      this.int64copy(d, H[3]);
      this.int64copy(e, H[4]);
      this.int64copy(f, H[5]);
      this.int64copy(g, H[6]);
      this.int64copy(h, H[7]);

      for (j = 0; j < 16; j++) {
        W[j].h = x[i + 2 * j];
        W[j].l = x[i + 2 * j + 1];
      }

      for (j = 16; j < 80; j++) {
        //sigma1
        this.int64rrot(r1, W[j - 2], 19);
        this.int64revrrot(r2, W[j - 2], 29);
        this.int64shr(r3, W[j - 2], 6);
        s1.l = r1.l ^ r2.l ^ r3.l;
        s1.h = r1.h ^ r2.h ^ r3.h;
        //sigma0
        this.int64rrot(r1, W[j - 15], 1);
        this.int64rrot(r2, W[j - 15], 8);
        this.int64shr(r3, W[j - 15], 7);
        s0.l = r1.l ^ r2.l ^ r3.l;
        s0.h = r1.h ^ r2.h ^ r3.h;

        this.int64add4(W[j], s1, W[j - 7], s0, W[j - 16]);
      }

      for (j = 0; j < 80; j++) {
        //Ch
        Ch.l = (e.l & f.l) ^ (~e.l & g.l);
        Ch.h = (e.h & f.h) ^ (~e.h & g.h);

        //Sigma1
        this.int64rrot(r1, e, 14);
        this.int64rrot(r2, e, 18);
        this.int64revrrot(r3, e, 9);
        s1.l = r1.l ^ r2.l ^ r3.l;
        s1.h = r1.h ^ r2.h ^ r3.h;

        //Sigma0
        this.int64rrot(r1, a, 28);
        this.int64revrrot(r2, a, 2);
        this.int64revrrot(r3, a, 7);
        s0.l = r1.l ^ r2.l ^ r3.l;
        s0.h = r1.h ^ r2.h ^ r3.h;

        //Maj
        Maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l);
        Maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h);

        this.int64add5(T1, h, s1, Ch, sha512_k[j], W[j]);
        this.int64add(T2, s0, Maj);

        this.int64copy(h, g);
        this.int64copy(g, f);
        this.int64copy(f, e);
        this.int64add(e, d, T1);
        this.int64copy(d, c);
        this.int64copy(c, b);
        this.int64copy(b, a);
        this.int64add(a, T1, T2);
      }
      this.int64add(H[0], H[0], a);
      this.int64add(H[1], H[1], b);
      this.int64add(H[2], H[2], c);
      this.int64add(H[3], H[3], d);
      this.int64add(H[4], H[4], e);
      this.int64add(H[5], H[5], f);
      this.int64add(H[6], H[6], g);
      this.int64add(H[7], H[7], h);
    }

    //represent the hash as an array of 32-bit dwords
    const hash = new Array(16);
    for (i = 0; i < 8; i++) {
      hash[2 * i] = H[i].h;
      hash[2 * i + 1] = H[i].l;
    }
    return hash;
  }

  //Copies src into dst, assuming both are 64-bit numbers
  private int64copy(dst, src) {
    dst.h = src.h;
    dst.l = src.l;
  }

  //Right-rotates a 64-bit number by shift
  //Won't handle cases of shift>=32
  //The private revrrot() is for that
  private int64rrot(dst, x, shift) {
    dst.l = (x.l >>> shift) | (x.h << (32 - shift));
    dst.h = (x.h >>> shift) | (x.l << (32 - shift));
  }

  //Reverses the dwords of the source and then rotates right by shift.
  //This is equivalent to rotation by 32+shift
  private int64revrrot(dst, x, shift) {
    dst.l = (x.h >>> shift) | (x.l << (32 - shift));
    dst.h = (x.l >>> shift) | (x.h << (32 - shift));
  }

  //Bitwise-shifts right a 64-bit number by shift
  //Won't handle shift>=32, but it's never needed in SHA512
  private int64shr(dst, x, shift) {
    dst.l = (x.l >>> shift) | (x.h << (32 - shift));
    dst.h = x.h >>> shift;
  }

  //Adds two 64-bit numbers
  //Like the original implementation, does not rely on 32-bit operations
  private int64add(dst, x, y) {
    const w0 = (x.l & 0xffff) + (y.l & 0xffff);
    const w1 = (x.l >>> 16) + (y.l >>> 16) + (w0 >>> 16);
    const w2 = (x.h & 0xffff) + (y.h & 0xffff) + (w1 >>> 16);
    const w3 = (x.h >>> 16) + (y.h >>> 16) + (w2 >>> 16);
    dst.l = (w0 & 0xffff) | (w1 << 16);
    dst.h = (w2 & 0xffff) | (w3 << 16);
  }

  //Same, except with 4 addends. Works faster than adding them one by one.
  private int64add4(dst, a, b, c, d) {
    const w0 =
      (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff);
    const w1 =
      (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (w0 >>> 16);
    const w2 =
      (a.h & 0xffff) +
      (b.h & 0xffff) +
      (c.h & 0xffff) +
      (d.h & 0xffff) +
      (w1 >>> 16);
    const w3 =
      (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (w2 >>> 16);
    dst.l = (w0 & 0xffff) | (w1 << 16);
    dst.h = (w2 & 0xffff) | (w3 << 16);
  }

  //Same, except with 5 addends
  private int64add5(dst, a, b, c, d, e) {
    const w0 =
      (a.l & 0xffff) +
      (b.l & 0xffff) +
      (c.l & 0xffff) +
      (d.l & 0xffff) +
      (e.l & 0xffff);
    const w1 =
      (a.l >>> 16) +
      (b.l >>> 16) +
      (c.l >>> 16) +
      (d.l >>> 16) +
      (e.l >>> 16) +
      (w0 >>> 16);
    const w2 =
      (a.h & 0xffff) +
      (b.h & 0xffff) +
      (c.h & 0xffff) +
      (d.h & 0xffff) +
      (e.h & 0xffff) +
      (w1 >>> 16);
    const w3 =
      (a.h >>> 16) +
      (b.h >>> 16) +
      (c.h >>> 16) +
      (d.h >>> 16) +
      (e.h >>> 16) +
      (w2 >>> 16);
    dst.l = (w0 & 0xffff) | (w1 << 16);
    dst.h = (w2 & 0xffff) | (w3 << 16);
  }
}
