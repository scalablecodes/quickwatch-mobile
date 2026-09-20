const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s()-]{7,20}$/;

export const isValidEmail = (value: string) => EMAIL.test(value.trim());
export const isValidPhone = (value: string) => PHONE.test(value.trim());
export const isValidPassword = (value: string) => value.length >= 6;
export const isValidZip = (value: string) => value.trim().length >= 3;

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

/** Returns the first error message or undefined for each rule that fails. */
export function validate<T extends string>(rules: Record<T, string | undefined>): FieldErrors<T> {
  const errors: FieldErrors<T> = {};
  for (const key of Object.keys(rules) as T[]) {
    if (rules[key]) errors[key] = rules[key];
  }
  return errors;
}
