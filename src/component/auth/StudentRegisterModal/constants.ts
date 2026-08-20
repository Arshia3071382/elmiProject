// Validation utilities
export const isValidNationalId = (id: string): boolean => {
  if (!/^\d{10}$/.test(id)) return false;
  if (/^(\d)\1{9}$/.test(id)) return false;
  const check = parseInt(id.substring(9, 10), 10);
  let sum = 0;
  for (let i = 0; i < 9; ++i) {
    sum += parseInt(id.substring(i, i + 1), 10) * (10 - i);
  }
  const rem = sum % 11;
  const computedCheck = rem < 2 ? rem : 11 - rem;
  return computedCheck === check;
};

export const getPasswordStrength = (pass: string) => {
  if (!pass) return { label: "", color: "" };
  const hasLower = /[a-z]/.test(pass);
  const hasUpper = /[A-Z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);

  if (pass.length < 6) {
    return { label: "کوتاه (حداقل ۶ کاراکتر)", color: "text-red-500" };
  }
  if (pass.length > 8) {
    return { label: "حداکثر ۸ کاراکتر مجاز است", color: "text-red-500" };
  }
  if (hasLower && hasUpper && hasNumber && pass.length >= 6 && pass.length <= 8) {
    return { label: "قوی و امن", color: "text-emerald-600" };
  }
  return { label: "متوسط (نیازمند حروف بزرگ/کوچک و عدد)", color: "text-amber-600" };
};