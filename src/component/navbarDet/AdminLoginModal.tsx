"use client";

interface AdminLoginModalProps {
  showModal: boolean;
  password: string;
  setPassword: (password: string) => void;
  handleCloseModal: () => void;
  handleLogin: () => void;
}

export default function AdminLoginModal({
  showModal,
  password,
  setPassword,
  handleCloseModal,
  handleLogin,
}: AdminLoginModalProps) {
  if (!showModal) return null;

  return (
    // Centralized container for admin login modal
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h2 className="text-center mb-4">ورود به پنل مدیریت</h2>

        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 rounded"
        />

        {/* Cancel and submit action triggers */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleCloseModal}
            className="flex-1 bg-gray-300 p-2 rounded"
          >
            انصراف
          </button>

          <button
            onClick={handleLogin}
            className="flex-1 bg-green-500 text-white p-2 rounded"
          >
            ورود
          </button>
        </div>
      </div>
    </div>
  );
}