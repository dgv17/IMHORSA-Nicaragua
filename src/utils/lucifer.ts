function feistelRound(left: number, right: number, keyPart: number): [number, number] {
  const f = (right ^ keyPart) >>> 0;
  const newLeft = right;
  const newRight = (left ^ f) >>> 0;
  return [newLeft, newRight];
}

function generateSubKeys(key: string, rounds = 16): number[] {
  const subKeys: number[] = [];
  for (let i = 0; i < rounds; i++) {
    const charCode = key.charCodeAt(i % key.length);
    const subKey = (charCode * (i + 1) * 2654435761) >>> 0;
    subKeys.push(subKey);
  }
  return subKeys;
}

function textToHex(text: string): string {
  return Array.from(text)
    .map(ch => ch.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

export function encryptLucifer(text: string, key: string): string {
  let hexString = textToHex(text).padEnd(16, "0");
  let left = parseInt(hexString.substring(0, 8), 16) >>> 0;
  let right = parseInt(hexString.substring(8, 16), 16) >>> 0;
  const subKeys = generateSubKeys(key, 16);
  for (let i = 0; i < 16; i++) {
    [left, right] = feistelRound(left, right, subKeys[i]);
  }
  return left.toString(16).padStart(8, "0") + right.toString(16).padStart(8, "0");
}

export function decryptLucifer(cipherHex: string, key: string): string {
  let left = parseInt(cipherHex.substring(0, 8), 16) >>> 0;
  let right = parseInt(cipherHex.substring(8, 16), 16) >>> 0;
  const subKeys = generateSubKeys(key, 16);
  for (let i = 15; i >= 0; i--) {
    const f = (left ^ subKeys[i]) >>> 0;
    const newRight = left;
    const newLeft = (right ^ f) >>> 0;
    left = newLeft;
    right = newRight;
  }
  const hexString = left.toString(16).padStart(8, "0") + right.toString(16).padStart(8, "0");
  let result = "";
  for (let i = 0; i < hexString.length; i += 2) {
    result += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
  }
  return result.trim();
}

export function encryptLuciferBlocks(text: string, key: string): string {
  const blocks: string[] = [];
  for (let i = 0; i < text.length; i += 8) {
    const chunk = text.substring(i, i + 8);
    blocks.push(encryptLucifer(chunk, key));
  }
  return blocks.join("");
}
export function decryptLuciferBlocks(cipher: string, key: string): string {
  const blocks: string[] = [];
  for (let i = 0; i < cipher.length; i += 16) {
    const chunk = cipher.substring(i, i + 16);
    blocks.push(decryptLucifer(chunk, key));
  }
  return blocks.join("");
}
