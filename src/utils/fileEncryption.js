const PBKDF2_ITERATIONS = 100000;

// Base64 to ArrayBuffer
export function base64ToBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// ArrayBuffer to Base64
export function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binaryString = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
}

export async function deriveKey(password, salt, usage) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    usage
  );
}

export async function encryptFile(file, password) {
  if (!password) {
    throw new Error("Password/Key is required for encryption.");
  }
  
  const fileBuffer = await file.arrayBuffer();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const aesKey = await deriveKey(password, salt, ["encrypt"]);
  
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
      tagLength: 128
    },
    aesKey,
    fileBuffer
  );
  
  const encryptedBlob = new Blob([ciphertextBuffer], { type: file.type });
  
  return {
    encryptedBlob,
    salt: bufferToBase64(salt),
    iv: bufferToBase64(iv),
    contentType: file.type,
    originalFileName: file.name
  };
}

export async function decryptFile(encryptedBlob, password, saltBase64, ivBase64) {
  if (!password) {
    throw new Error("Password/Key is required for decryption.");
  }
  
  const encryptedBuffer = await encryptedBlob.arrayBuffer();
  const salt = new Uint8Array(base64ToBuffer(saltBase64));
  const iv = new Uint8Array(base64ToBuffer(ivBase64));
  
  const aesKey = await deriveKey(password, salt, ["decrypt"]);
  
  return window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
      tagLength: 128
    },
    aesKey,
    encryptedBuffer
  );
}

export const getEncryptionSecret = () => {
  if (window.__opulenza_encryption_secret) {
    return window.__opulenza_encryption_secret;
  }
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  ) {
    console.warn("Using temporary development encryption key on localhost.");
    return "OpulenzaLocalDevKey123!";
  }
  throw new Error("Encryption key/secret is not configured. Please set window.__opulenza_encryption_secret or hook into a secure key management system.");
};
