"use client";
import { useState, useEffect } from "react";

export default function AdminShowcasePanel() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState("");
  const [showcases, setShowcases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // استیت برای مدیریت حالت ویرایش
  const [editingId, setEditingId] = useState<string | null>(null);

  // استیت‌های مربوط به مودال حذف
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  // دریافت لیست آلبوم‌های موجود
  const fetchShowcases = async () => {
    try {
      const res = await fetch("/api/showcase");
      const data = await res.json();
      if (data.success) {
        setShowcases(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShowcases();
  }, []);

  // افزودن لینک عکس به لیست
  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    if (images.includes(imageUrlInput.trim())) return;

    const updatedImages = [...images, imageUrlInput.trim()];
    setImages(updatedImages);

    if (!coverImage) {
      setCoverImage(imageUrlInput.trim());
    }
    setImageUrlInput("");
  };

  // حذف عکس از لیست
  const handleRemoveImage = (url: string) => {
    const updated = images.filter((img) => img !== url);
    setImages(updated);
    if (coverImage === url) {
      setCoverImage(updated.length > 0 ? updated[0] : "");
    }
  };

  // بارگذاری اطلاعات آلبوم برای ویرایش
  const handleEditClick = (item: any) => {
    setEditingId(item._id);
    setTitle(item.title || "");
    setSlug(item.slug || "");
    setDescription(item.description || "");
    setDate(item.date || "");
    setImages(item.images || []);
    setCoverImage(item.coverImage || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // لغو حالت ویرایش و پاک کردن فرم
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setDate("");
    setImages([]);
    setCoverImage("");
  };

  // باز کردن مودال حذف
  const openDeleteModal = (id: string, albumTitle: string) => {
    setItemToDelete({ id, title: albumTitle });
    setDeleteModalOpen(true);
  };

  // تأیید نهایی حذف از طریق مودال
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`/api/showcase/${itemToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchShowcases();
        if (editingId === itemToDelete.id) handleCancelEdit();
      } else {
        alert(data.error || "خطا در حذف آلبوم");
      }
    } catch (err) {
      console.error(err);
      alert("خطا در ارتباط با سرور");
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // ثبت نهایی یا ویرایش آلبوم
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || images.length === 0 || !coverImage) {
      alert("لطفاً عنوان، حداقل یک عکس و انتخاب کاور را بررسی کنید.");
      return;
    }

    setLoading(true);
    try {
      const url = editingId ? `/api/showcase/${editingId}` : "/api/showcase";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, description, date, coverImage, images }),
      });

      const data = await res.json();
      if (data.success) {
        alert(editingId ? "آلبوم با موفقیت ویرایش شد!" : "آلبوم با موفقیت ثبت شد!");
        handleCancelEdit();
        fetchShowcases();
      } else {
        alert(data.error || "خطایی رخ داد.");
      }
    } catch (err) {
      console.error(err);
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-right" dir="rtl">
      <h2 className="text-2xl font-bold mb-6">
        {editingId ? "ویرایش آلبوم ویترین" : "مدیریت ویترین و آلبوم‌ها"}
      </h2>

      {/* فرم ایجاد / ویرایش آلبوم */}
      <form
        onSubmit={handleSubmit}
        className={`bg-white p-6 rounded-xl shadow-md space-y-4 mb-8 border ${
          editingId ? "border-amber-500 ring-2 ring-amber-100" : "border-gray-100"
        }`}
      >
        {editingId && (
          <div className="bg-amber-50 p-3 rounded-lg flex justify-between items-center text-amber-800 text-sm">
            <span>در حال ویرایش آلبوم مورد نظر هستید...</span>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs bg-amber-200 hover:bg-amber-300 px-2.5 py-1 rounded transition"
            >
              لغو ویرایش
            </button>
          </div>
        )}

        <div>
          <label className="block mb-2 font-medium">عنوان آلبوم</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded-lg"
            placeholder="مثلاً: اردوهای آموزشی تابستان"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            اسلاگ (شناسه یکتا در URL - اختیاری)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border p-2 rounded-lg text-left"
            dir="ltr"
            placeholder="مثلاً: summer-camp"
          />
          <span className="text-xs text-gray-500 mt-1 block">
            اگر خالی بگذارید، سیستم به طور خودکار از روی عنوان می‌سازد.
          </span>
        </div>

        <div>
          <div>
            <label className="block mb-2 font-medium">تاریخ (به فارسی)</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border p-2 rounded-lg"
              placeholder="مثلاً: ۱۵ شهریور ۱۴۰۵"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">توضیحات آلبوم</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded-lg"
            rows={3}
            placeholder="توضیحاتی درباره این آلبوم یا رویداد..."
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            افزودن لینک پابلیک عکس (URL)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 border p-2 rounded-lg"
              placeholder="https://.../n2.jpg"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              افزودن عکس
            </button>
          </div>
        </div>

        {images.length > 0 && (
          <div className="space-y-2">
            <label className="block font-medium">
              عکس‌های آلبوم (برای انتخاب کاور روی آن کلیک کنید):
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((url, idx) => (
                <div
                  key={idx}
                  className={`border rounded-lg p-2 relative cursor-pointer flex flex-col items-center ${
                    coverImage === url
                      ? "border-green-600 ring-2 ring-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setCoverImage(url)}
                >
                  <img
                    src={url}
                    alt="preview"
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <span className="text-xs truncate w-full text-center">
                    {url.split("/").pop()}
                  </span>

                  {coverImage === url && (
                    <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                      کاور
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(url);
                    }}
                    className="mt-2 text-xs text-red-600 hover:underline"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition ${
            editingId ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading
            ? "در حال پردازش..."
            : editingId
            ? "ذخیره تغییرات آلبوم"
            : "تایید و ثبت نهایی آلبوم"}
        </button>
      </form>

      {/* لیست آلبوم‌های ثبت شده همراه با دکمه ویرایش و حذف */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4">آلبوم‌های ثبت‌شده ({showcases.length})</h3>

        {showcases.length === 0 ? (
          <p className="text-gray-500 text-sm">هنوز هیچ آلبومی ثبت نشده است.</p>
        ) : (
          <div className="space-y-4">
            {showcases.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border p-4 rounded-xl gap-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.coverImage || "/placeholder.jpg"}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.date ? `تاریخ: ${item.date}` : "بدون تاریخ"} | {item.images?.length || 0} تصویر
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleEditClick(item)}
                    className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-600 transition"
                  >
                    ویرایش
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(item._id, item.title)}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- مودال تأیید حذف سفارشی --- */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-gray-900">حذف آلبوم</h3>
              <p className="text-sm text-gray-500">
                آیا از حذف آلبوم <span className="font-bold text-gray-800">«{itemToDelete?.title}»</span> اطمینان دارید؟ این عمل قابل بازگشت نیست.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition text-sm"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition text-sm shadow-lg shadow-red-600/20"
              >
                بله، حذف شود
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}