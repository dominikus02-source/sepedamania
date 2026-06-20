import { generateSecret, generateURI, generateSync, verifySync } from 'otplib';
import { NobleCryptoPlugin } from '@otplib/plugin-crypto-noble';
import { ScureBase32Plugin } from '@otplib/plugin-base32-scure';
import QRCode from 'qrcode';

const APP_NAME = 'SEPEDAMANIA';

const crypto = new NobleCryptoPlugin();
const base32 = new ScureBase32Plugin();
const pluginOptions = { crypto, base32 };

export function generateTotpSecret(): string {
  return generateSecret(pluginOptions);
}

export function getTotpUri(secret: string, email: string): string {
  return generateURI({ issuer: APP_NAME, label: email, secret, digits: 6, period: 30, ...pluginOptions });
}

export function generateTotpToken(secret: string): string {
  return generateSync({ secret, ...pluginOptions });
}

export async function generateQrCode(uri: string): Promise<string> {
  try {
    return await QRCode.toDataURL(uri);
  } catch {
    return '';
  }
}

export function verifyTotp(token: string, secret: string): boolean {
  try {
    const result = verifySync({ token, secret, ...pluginOptions });
    return result.valid;
  } catch {
    return false;
  }
}
