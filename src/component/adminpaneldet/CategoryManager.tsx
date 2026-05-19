"use client";

import { useState } from "react";
import { Pencil, Trash2, X, CheckCircle, Layers, Clock, BookOpen, FolderPlus } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

interface Category {
  _id: string;
  name: string;
  createdAt: string;
}

interface CategoryManagerProps {
  categories: Category[];
  coursesCount: (categoryId: string) => number;
  onCategoryUpdate: () => void;
  onShowMessage: (type: 'success' | 'error', text: string) => void;
  onOpenAddModal: () => void;
}

export default function CategoryManager({ 
  categories, 
  coursesCount, 
  onCategoryUpdate, 
  onShowMessage,
  onOpenAddModal 
}: CategoryManagerProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const count = coursesCount(deleteModal.id);
    if (count > 0) {
      onShowMessage('error', `این گروه دارای ${count} دوره است. ابتدا دوره‌ها را حذف یا انتقال دهید.`);
      setDeleteModal({ isOpen: false, id: "", name: "" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/categories?id=${deleteModal.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      
      if (data.success) {
        onShowMessage('success', `گروه "${deleteModal.name}" با موفقیت حذف شد`);
        onCategoryUpdate();
      } else {
        onShowMessage('error', data.error || "خطا در حذف گروه");
      }
    } catch (error) {
      onShowMessage('error', "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
      setDeleteModal({ isOpen: false, id: "", name: "" });
    }
  };

  const handleUpdate = async () => {
    if (!editName.trim()) {
      onShowMessage('error', 'نام گروه نمی‌تواند خالی باشد');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCategory?._id,
          name: editName,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        onShowMessage('success', `گروه "${editName}" با موفقیت ویرایش شد`);
        setEditingCategory(null);
        onCategoryUpdate();
      } else {
        onShowMessage('error', data.error || "خطا در ویرایش گروه");
      }
    } catch (error) {
      onShowMessage('error', "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">گروه‌های آموزشی</h2>
        <button
          onClick={onOpenAddModal}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
        >
          <FolderPlus className="w-5 h-5" /> گروه جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition">
            {editingCategory?._id === cat._id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={handleUpdate} disabled={loading} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> ذخیره
                  </button>
                  <button onClick={() => setEditingCategory(null)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 flex items-center justify-center gap-2">
                    <X className="w-4 h-4" /> انصراف
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Layers className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(cat)} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition" title="ویرایش">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteModal({ isOpen: true, id: cat._id, name: cat.name })} className="p-1 text-red-600 hover:bg-red-50 rounded transition" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{cat.name}</h3>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {coursesCount(cat._id)} دوره
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(cat.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">هیچ گروهی وجود ندارد</p>
          <button onClick={onOpenAddModal} className="mt-4 text-blue-600 hover:text-blue-700">
            اولین گروه را بسازید
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="حذف گروه"
        message={`آیا از حذف گروه "${deleteModal.name}" مطمئن هستید؟`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: "", name: "" })}
        loading={loading}
      />
    </>
  );
}