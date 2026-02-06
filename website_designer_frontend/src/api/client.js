/**
 * Very small API client wrapper around fetch().
 * The backend OpenAPI currently exposes only a health endpoint (GET /).
 */

const DEFAULT_API_BASE_URL = '';

function getApiBaseUrl() {
  // CRA exposes env vars prefixed with REACT_APP_
  return process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL;
}

// PUBLIC_INTERFACE
export async function apiGet(path) {
  /** Perform a GET request to the backend API. */
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
  }

  // Health endpoint may return empty schema; tolerate empty responses.
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;

  return res.json();
}
