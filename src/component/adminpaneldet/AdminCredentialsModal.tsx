"use client";

import { X, UserCog, KeyRound } from "lucide-react";
import CredentialsTab from "./CredentialsTab";
import SecurityPinTab from "./SecurityPinTab";

interface AdminCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSubTab: "credentials" | "securityPin";
  onSubTabChange: (tab: "credentials" | "securityPin") => void;

  credentialForm: { oldUsername: string; oldPassword: string; newUsername: string; newPassword: string };
  credentialLoading: boolean;
  credentialMessage: { text: string; type: string };
  showOldPassword: boolean;
  showNewPassword: boolean;
  onToggleOldPassword: () => void;
  onToggleNewPassword: () => void;
  onCredentialChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCredentialSubmit: (e: React.FormEvent) => void;

  pinForm: { oldPin: string; newPin: string; confirmPin: string };
  pinLoading: boolean;
  pinMessage: { text: string; type: string };
  showOldPin: boolean;
  showNewPin: boolean;
  showConfirmPin: boolean;
  onToggleOldPin: () => void;
  onToggleNewPin: () => void;
  onToggleConfirmPin: () => void;
  onPinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPinSubmit: (e: React.FormEvent) => void;
}

export default function AdminCredentialsModal(props: AdminCredentialsModalProps) {
  const { isOpen, onClose, activeSubTab, onSubTabChange } = props;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-gray-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sub-tab switcher */}
        <div className="flex border-b border-gray-200 mb-4 text-right">
          <button
            type="button"
            onClick={() => onSubTabChange("credentials")}
            className={`flex-1 pb-3 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === "credentials"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400"
            }`}
          >
            <UserCog className="w-4 h-4" />
            <span>نام کاربری و رمز</span>
          </button>
          <button
            type="button"
            onClick={() => onSubTabChange("securityPin")}
            className={`flex-1 pb-3 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === "securityPin"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>کد امنیتی ۸ رقمی تب‌ها</span>
          </button>
        </div>

        {activeSubTab === "credentials" ? (
          <CredentialsTab
            form={props.credentialForm}
            loading={props.credentialLoading}
            message={props.credentialMessage}
            showOld={props.showOldPassword}
            showNew={props.showNewPassword}
            onToggleOld={props.onToggleOldPassword}
            onToggleNew={props.onToggleNewPassword}
            onChange={props.onCredentialChange}
            onSubmit={props.onCredentialSubmit}
          />
        ) : (
          <SecurityPinTab
            form={props.pinForm}
            loading={props.pinLoading}
            message={props.pinMessage}
            showOld={props.showOldPin}
            showNew={props.showNewPin}
            showConfirm={props.showConfirmPin}
            onToggleOld={props.onToggleOldPin}
            onToggleNew={props.onToggleNewPin}
            onToggleConfirm={props.onToggleConfirmPin}
            onChange={props.onPinChange}
            onSubmit={props.onPinSubmit}
          />
        )}
      </div>
    </div>
  );
}