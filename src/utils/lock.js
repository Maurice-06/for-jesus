// ─────────────────────────────────────────────────────────────────────────────
// Verrou de l'appli : code (haché, jamais stocké en clair) + Face ID / empreinte.
// C'est un écran de confidentialité : il protège contre quelqu'un qui emprunte
// le téléphone. Les données elles-mêmes ne sont pas chiffrées.
// ─────────────────────────────────────────────────────────────────────────────

export const LOCK_KEY = 'fj_lock'
const ITERATIONS = 210000
const MAX_FREE_ATTEMPTS = 5

const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
const fromB64 = (b64) => Uint8Array.from(atob(b64), c => c.charCodeAt(0))
const randomBytes = (n) => crypto.getRandomValues(new Uint8Array(n))

export function readLock() {
  try { return JSON.parse(localStorage.getItem(LOCK_KEY)) || null } catch { return null }
}
function writeLock(lock) {
  if (lock) localStorage.setItem(LOCK_KEY, JSON.stringify(lock))
  else localStorage.removeItem(LOCK_KEY)
  window.dispatchEvent(new CustomEvent('fj-storage', { detail: { key: LOCK_KEY } }))
}

async function derive(pin, saltB64, iterations) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromB64(saltB64), iterations }, key, 256)
  return toB64(bits)
}

// Comparaison en temps constant
const sameString = (a, b) => {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** Active (ou change) le code. Conserve les autres réglages du verrou. */
export async function setPin(pin) {
  if (!/^\d{4,6}$/.test(pin)) throw new Error('Le code doit contenir 4 à 6 chiffres.')
  const salt = toB64(randomBytes(16))
  const hash = await derive(pin, salt, ITERATIONS)
  const prev = readLock() || {}
  writeLock({
    autoLockMinutes: 1, credentialId: null, ...prev,
    enabled: true, salt, hash, iterations: ITERATIONS, pinLength: pin.length, failures: 0, blockedUntil: 0,
  })
}

/** Temps d'attente restant (ms) après trop d'essais. */
export function blockedFor() {
  const lock = readLock()
  return lock?.blockedUntil ? Math.max(0, lock.blockedUntil - Date.now()) : 0
}

/**
 * Vérifie le code. Après 5 erreurs, attente croissante (30 s, 1 min, 2 min… max 15 min).
 * @returns {Promise<{ok: boolean, waitMs?: number}>}
 */
export async function verifyPin(pin) {
  const lock = readLock()
  if (!lock?.enabled) return { ok: true }
  const wait = blockedFor()
  if (wait > 0) return { ok: false, waitMs: wait }
  const hash = await derive(pin, lock.salt, lock.iterations || ITERATIONS)
  if (sameString(hash, lock.hash)) {
    writeLock({ ...lock, failures: 0, blockedUntil: 0 })
    return { ok: true }
  }
  const failures = (lock.failures || 0) + 1
  const over = failures - MAX_FREE_ATTEMPTS
  const waitMs = over >= 0 ? Math.min(15 * 60000, 30000 * 2 ** over) : 0
  writeLock({ ...lock, failures, blockedUntil: waitMs ? Date.now() + waitMs : 0 })
  return { ok: false, waitMs, remaining: Math.max(0, MAX_FREE_ATTEMPTS - failures) }
}

export function disableLock() {
  writeLock(null)
}

export function setAutoLock(minutes) {
  const lock = readLock()
  if (lock) writeLock({ ...lock, autoLockMinutes: minutes })
}

// ─── Face ID / Touch ID / empreinte (WebAuthn, authentificateur de l'appareil) ──
export async function biometricAvailable() {
  try {
    return !!(window.PublicKeyCredential && window.isSecureContext &&
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
  } catch { return false }
}

/** Enregistre Face ID pour cette appli sur cet appareil. */
export async function enableBiometric() {
  const cred = await navigator.credentials.create({
    publicKey: {
      rp: { name: 'For Jesus', id: window.location.hostname },
      user: { id: randomBytes(16), name: 'for-jesus', displayName: 'For Jesus — verrou' },
      challenge: randomBytes(32),
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
      authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' },
      timeout: 60000,
      attestation: 'none',
    },
  })
  if (!cred) throw new Error('Face ID n’a pas pu être activé.')
  const lock = readLock()
  writeLock({ ...lock, credentialId: toB64(cred.rawId) })
}

export function disableBiometric() {
  const lock = readLock()
  if (lock) writeLock({ ...lock, credentialId: null })
}

/** Demande Face ID. Résout true si l'utilisateur a été reconnu par l'appareil. */
export async function verifyBiometric() {
  const lock = readLock()
  if (!lock?.credentialId) return false
  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: randomBytes(32),
        allowCredentials: [{ type: 'public-key', id: fromB64(lock.credentialId), transports: ['internal'] }],
        userVerification: 'required',
        timeout: 60000,
        rpId: window.location.hostname,
      },
    })
    // L'appareil ne renvoie une réponse qu'après Face ID / empreinte réussi(e)
    const ok = !!assertion && assertion.response?.authenticatorData && (new Uint8Array(assertion.response.authenticatorData)[32] & 0x04) !== 0
    if (ok) writeLock({ ...readLock(), failures: 0, blockedUntil: 0 })
    return ok
  } catch {
    return false
  }
}
