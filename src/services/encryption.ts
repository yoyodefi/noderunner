export class EncryptionService {
  private static instance: EncryptionService;
  private encoder: TextEncoder;
  private decoder: TextDecoder;

  private constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  private async getKey(): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(ENCRYPTION_KEY),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.encoder.encode('ai-node-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  public async encrypt(data: string): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      this.encoder.encode(data)
    );

    const encryptedArray = new Uint8Array(encryptedContent);
    const buffer = new Uint8Array(iv.length + encryptedArray.length);
    buffer.set(iv, 0);
    buffer.set(encryptedArray, iv.length);

    return this.arrayBufferToBase64(buffer);
  }

  public async decrypt(encryptedData: string): Promise<string> {
    const key = await this.getKey();
    const data = this.base64ToUint8Array(encryptedData);
    const iv = data.slice(0, 12);
    const content = data.slice(12);

    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      content
    );

    return this.decoder.decode(decryptedContent);
  }

  private arrayBufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}

const ENCRYPTION_KEY = 'ai-node-platform-v1';