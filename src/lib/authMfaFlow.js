import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';

const PKCE_KEY = () => `app-mfa-pkce:${appParams.appId}`;
const encode = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export class MfaError extends Error {
  constructor(message, status, retryAfter) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
  }
  get mustSignInAgain() {
    return this.status === 401;
  }
}

function authPath(suffix) {
  if (!/^[a-f0-9]{24}$/i.test(appParams.appId)) throw new Error('Invalid app ID');
  return `/api/apps/${appParams.appId}/auth/${suffix}`;
}

async function request(suffix, { method = 'POST', body, token, headers } = {}) {
  const response = await fetch(authPath(suffix), {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = result.error?.message || result.detail || 'Something went wrong. Try again.';
    throw new MfaError(message, response.status, Number(response.headers.get('Retry-After')) || null);
  }
  return result;
}

export function mfaSession(challenge) {
  let credential = challenge.mfa_session_token;
  const call = async (suffix, body, method) => {
    const result = await request(`mfa/${suffix}`, { method, body, token: credential });
    if (result.mfa_management_token) credential = result.mfa_management_token;
    if (result.access_token) base44.auth.setToken(result.access_token);
    return result;
  };
  return {
    verify: (code, method, rememberDevice) => call('verify', { code, method, remember_device: rememberDevice }),
    sendSignInCode: () => call('resend'),
    setupAuthenticator: () => call('totp/setup', {}),
    confirmAuthenticator: (code, rememberDevice = false) => call('totp/verify', { code, remember_device: rememberDevice }),
    sendPhoneCode: phoneNumber => call('sms/send-code', { phone_number: phoneNumber }),
    confirmPhone: (code, rememberDevice = false) => call('sms/verify', { code, remember_device: rememberDevice }),
    status: () => call('status', undefined, 'GET'),
    sendProofCode: () => call('sms/send-code', { phone_number: '' }),
    removeMethod: (method, code, proofMethod) => call('disable', { method, code, verification_method: proofMethod }),
    forgetDevices: (code, proofMethod) => call('trusted-devices/clear', { code, method: proofMethod }),
  };
}

export function signInToManageMfa(email, password) {
  return request('login', { body: { email, password }, headers: { 'X-App-Mfa-Action': 'manage' } });
}

let resumed;

export function resumeMfa() {
  resumed ||= (async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('mfa_code');
    if (!code) return null;
    const verifier = sessionStorage.getItem(PKCE_KEY());
    sessionStorage.removeItem(PKCE_KEY());
    params.delete('mfa_code');
    const rest = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${rest ? `?${rest}` : ''}`);
    const result = await request('mfa/exchange', { body: { code, code_verifier: verifier } });
    if (result.access_token) base44.auth.setToken(result.access_token);
    return result;
  })();
  return resumed;
}

const isInAppBrowser = () => /LinkedIn|Twitter/i.test(navigator.userAgent);

export async function loadSignInOptions() {
  const response = await fetch(`/api/apps/public/login-info/by-id/${appParams.appId}`);
  if (!response.ok) throw new Error('Unable to load sign-in options');
  return response.json();
}

export async function signInWithProvider(provider, returnTo, { manage = false } = {}) {
  const info = await loadSignInOptions();
  if (!manage && (info.auth_config?.mfa_policy !== 'required' || provider === 'sso')) {
    return base44.auth.loginWithProvider(provider, returnTo);
  }
  if (isInAppBrowser()) {
    const url = new URL('/auth/mfa', window.location.origin);
    url.search = new URLSearchParams({ app_id: appParams.appId, oauth_start: provider, from_url: returnTo, ...(manage ? { security: '1' } : {}) });
    window.location.assign(url.href);
    return;
  }
  const verifier = encode(crypto.getRandomValues(new Uint8Array(32)));
  const challenge = encode(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
  sessionStorage.setItem(PKCE_KEY(), verifier);
  const workspaceSso = provider === 'sso' && info.auth_config?.use_workspace_sso && info.organization_id;
  const path = provider === 'sso'
    ? (workspaceSso ? `/api/apps/${info.organization_id}/${appParams.appId}/auth/sso/login` : `/api/apps/${appParams.appId}/auth/sso/login`)
    : `/api/apps/auth${provider === 'google' ? '' : `/${provider}`}/login`;
  const url = new URL(path, window.location.origin);
  url.search = new URLSearchParams({
    from_url: new URL(returnTo, window.location.origin).href,
    ...(workspaceSso ? {} : { app_id: appParams.appId }),
    ...(manage ? { app_mfa_action: 'manage' } : {}),
    app_mfa_code_challenge: challenge,
    app_mfa_return: '/mfa',
  });
  window.location.assign(url.href);
}

export function finishSignIn(accessToken, returnTo) {
  if (new URLSearchParams(window.location.search).get('popup') === '1' && window.opener) {
    window.opener.postMessage({ access_token: accessToken }, window.location.origin);
    window.close();
    return;
  }
  window.location.href = returnTo;
}
