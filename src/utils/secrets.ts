const SECRET_CONFIG = {
  VERIFICATION_CODE: import.meta.env.VITE_CODE,
} as const;

export function isCorrectCode(code: string): boolean {
  return code === SECRET_CONFIG.VERIFICATION_CODE;
}
