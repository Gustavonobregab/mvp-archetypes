export const ROLE_COOKIE = 'demo_role';

export function setRole(role: string): void {
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=2592000; samesite=lax`;
}
