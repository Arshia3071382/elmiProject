// Loading state component
export default function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[var(--color-secondary)] border-r-transparent"></div>
        <p
          className="mt-4 text-[var(--color-text-secondary)]"
          style={{ fontFamily: "iranSans-r" }}
        >
          ...در حال بارگذاری اطلاعات
        </p>
      </div>
    </div>
  );
}