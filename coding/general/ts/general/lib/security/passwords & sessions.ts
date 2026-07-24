import * as argon2 from 'argon2';

// KV keys
const PASSWORD_HASH_KEY = 'auth:password_hash';
const SESSION_PREFIX = 'session:';

// Session duration: 7 days
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// =============================================================================
// Password utilities
// =============================================================================

/**
 * Hash a password for storage
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

/**
 * Verify a password against a stored hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return argon2.verify(password, hash);
}

/**
 * Get the stored password hash from KV
 */
export async function getStoredPasswordHash(passwordHashCb: Function): Promise<string | null> {
  return passwordHashCb();
  // return kv.get(PASSWORD_HASH_KEY);
}

/**
 * Set the password hash in KV (for initial setup or password change)
 */
export async function setPasswordHash(setPasswordHashCb: Function, hash: string): Promise<void> {
  await setPasswordHashCb(hash);
  // await kv.put(PASSWORD_HASH_KEY, hash);
}

/**
 * Check if a password has been set up
 */
export async function isPasswordConfigured(passwordHashCb: Function): Promise<boolean> {
  const hash = await getStoredPasswordHash(passwordHashCb);
  return hash !== null;
}

// =============================================================================
// Session utilities
// =============================================================================

/**
 * Generate a cryptographically secure random session ID
 */
function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create an HMAC signature for a session token
 */
async function signToken(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify an HMAC signature
 */
async function verifySignature(data: string, signature: string, secret: string): Promise<boolean> {
  const expectedSignature = await signToken(data, secret);
  // Constant-time comparison
  if (signature.length !== expectedSignature.length) return false;
  let result = 0;
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }
  return result === 0;
}

export interface SessionData {
  sessionId: string;
  expiresAt: number;
}

/**
 * Create a new session and return the session token
 */
export async function createSession(setSessionSecretCb: Function, secret: string): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = Date.now() + SESSION_DURATION_MS;

  // Store session in KV with TTL
  await setSessionSecretCb(
    `${SESSION_PREFIX}${sessionId}`,
    JSON.stringify({ createdAt: Date.now() }),
    { expirationTtl: Math.floor(SESSION_DURATION_MS / 1000) }
  );
  // await kv.put(
  //   `${SESSION_PREFIX}${sessionId}`,
  //   JSON.stringify({ createdAt: Date.now() }),
  //   { expirationTtl: Math.floor(SESSION_DURATION_MS / 1000) }
  // );

  // Create signed token: sessionId.expiresAt.signature
  const data = `${sessionId}.${expiresAt}`;
  const signature = await signToken(data, secret);

  return `${data}.${signature}`;
}

/**
 * Verify a session token and return session data if valid
 */
export async function verifySession(
  token: string,
  getSessionDataCb: Function,
  secret: string
): Promise<SessionData | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [sessionId, expiresAtStr, signature] = parts;
  const data = `${sessionId}.${expiresAtStr}`;

  // Verify signature
  const isValid = await verifySignature(data, signature, secret);
  if (!isValid) return null;

  // Check expiration
  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

  // Check if session exists in KV (not revoked)
  const sessionData = await getSessionDataCb(`${SESSION_PREFIX}${sessionId}`);
  // const sessionData = await kv.get(`${SESSION_PREFIX}${sessionId}`);
  if (!sessionData) return null;

  return { sessionId, expiresAt };
}

/**
 * Invalidate a session (logout)
 */
export async function invalidateSession(token: string, secret: string, getSessionDataCb: Function, deleteSessionCb: Function): Promise<void> {
  const session = await verifySession(token, getSessionDataCb, secret);
  if (session) {
    await deleteSessionCb(`${SESSION_PREFIX}${session.sessionId}`);
    // await kv.delete(`${SESSION_PREFIX}${session.sessionId}`);
  }
}

// =============================================================================
// Cookie utilities
// =============================================================================

const SESSION_COOKIE_NAME = 'session';

/**
 * Create a Set-Cookie header value for the session
 */
export function createSessionCookie(token: string, secure: boolean = true): string {
  const maxAge = Math.floor(SESSION_DURATION_MS / 1000);
  const parts = [
    `${SESSION_COOKIE_NAME}=${token}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

/**
 * Create a Set-Cookie header to clear the session cookie
 */
export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`;
}

/**
 * Extract session token from cookie header
 */
export function getSessionFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map((c) => c.trim());
  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.split('=');
    if (name === SESSION_COOKIE_NAME) {
      return valueParts.join('=') || null;
    }
  }
  return null;
}

// =============================================================================
// JWT utilities
// =============================================================================

export interface JWTPayload {
  sub: number;
  username: string;
  display: string | null;
  colour: string;
  system_role: string;
  iat: number;
  exp: number;
}

const JWT_DURATION_S = 7 * 24 * 60 * 60; // 7 days
const JWT_COOKIE_NAME = 'token';

function bytesToBase64url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function strToBase64url(str: string): string {
  return bytesToBase64url(new TextEncoder().encode(str));
}

function base64urlToStr(str: string): string {
  const normalized = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - (normalized.length % 4)) % 4;
  return atob(normalized + '='.repeat(padding));
}

/**
 * Create a signed JWT containing user info
 */
export async function createJWT(
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  secret: string
): Promise<string> {
  const header = strToBase64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const body = strToBase64url(
    JSON.stringify({ ...payload, iat: now, exp: now + JWT_DURATION_S })
  );
  const data = `${header}.${body}`;
  const sigHex = await signToken(data, secret);
  const sigBytes = new Uint8Array(sigHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
  return `${data}.${bytesToBase64url(sigBytes)}`;
}

/**
 * Verify a JWT and return its payload, or null if invalid/expired
 */
export async function verifyJWT(token: string, secret: string): Promise<JWTPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, sig] = parts;
  const data = `${header}.${body}`;

  const expectedHex = await signToken(data, secret);
  const expectedBytes = new Uint8Array(expectedHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
  const expectedSig = bytesToBase64url(expectedBytes);

  // Constant-time comparison
  if (sig.length !== expectedSig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
  }
  if (diff !== 0) return null;

  const decoded = JSON.parse(base64urlToStr(body)) as JWTPayload;
  if (Date.now() / 1000 > decoded.exp) return null;

  return decoded;
}

/**
 * Create a Set-Cookie header value for the JWT
 */
export function createJWTCookie(token: string, secure = true): string {
  const parts = [
    `${JWT_COOKIE_NAME}=${token}`,
    `Max-Age=${JWT_DURATION_S}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

/**
 * Create a Set-Cookie header to clear the JWT cookie
 */
export function clearJWTCookie(): string {
  return `${JWT_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`;
}

/**
 * Extract JWT from cookie header
 */
export function getJWTFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  for (const cookie of cookies) {
    const [name, ...valueParts] = cookie.split('=');
    if (name === JWT_COOKIE_NAME) {
      return valueParts.join('=') || null;
    }
  }
  return null;
}
