// Form input field
interface FormInputProps {
  label: string;
  type?: "text" | "url" | "email" | "number";
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  min?: number;
}

export default function FormInput({
  label,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
  helper,
  min,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-xs font-['iranBold'] text-[var(--color-primary)] mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] focus:outline-none"
        placeholder={placeholder}
      />
      {helper && (
        <p className="text-[9px] text-[var(--color-text-secondary)] mt-1">
          {helper}
        </p>
      )}
    </div>
  );
}