import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    sort_order: 1
  });

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image_url: '', sort_order: categories.length + 1 });
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description, image_url: cat.image_url, sort_order: cat.sort_order });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingCategory) {
      const updated = await updateCategory(editingCategory.id, formData);
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...updated } : c));
    } else {
      const created = await createCategory(formData);
      setCategories(prev => [...prev, created]);
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--color-coffee-dark)' }}>Quản Lý Danh Mục</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Phân loại các dòng sản phẩm cho thực đơn KhangCoffee.</p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-accent">
          <Plus size={18} /> Thêm Danh Mục
        </button>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left', color: 'var(--color-coffee-dark)' }}>
              <th style={{ padding: '16px' }}>Hình Ảnh</th>
              <th style={{ padding: '16px' }}>Tên Danh Mục</th>
              <th style={{ padding: '16px' }}>Mô Tả</th>
              <th style={{ padding: '16px' }}>Thứ Tự</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <img src={c.image_url} alt={c.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                </td>
                <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--color-coffee-dark)' }}>{c.name}</td>
                <td style={{ padding: '12px 16px', color: 'var(--color-text-muted)' }}>{c.description}</td>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>{c.sort_order}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button onClick={() => handleOpenEdit(c)} style={{ color: 'var(--color-coffee-dark)', padding: '6px', marginRight: '8px' }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} style={{ color: '#B91C1C', padding: '6px' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--color-coffee-dark)', marginBottom: '20px' }}>
              {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Tên Danh Mục *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Hình Ảnh Danh Mục *</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Dán đường dẫn URL hình ảnh (http://... hoặc https://...)"
                    value={formData.image_url}
                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                    style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                  <label className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '9px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Tải Ảnh Từ Máy
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ ...prev, image_url: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Preview Thumbnail */}
                {formData.image_url && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', padding: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Xem trước hình ảnh danh mục</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Mô Tả</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Thứ Tự Hiển Thị</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={e => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Hủy</button>
                <button type="submit" className="btn btn-accent">Lưu Danh Mục</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
