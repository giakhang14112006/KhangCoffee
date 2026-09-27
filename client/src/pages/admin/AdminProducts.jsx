import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Star, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category_id: 1,
    price: '',
    description: '',
    image_url: '',
    is_featured: false,
    is_available: true
  });

  const loadData = () => {
    getProducts().then(setProducts);
    getCategories().then(setCategories);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id || 1,
      price: '',
      description: '',
      image_url: '',
      is_featured: false,
      is_available: true
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category_id: prod.category_id,
      price: prod.price,
      description: prod.description,
      image_url: prod.image_url,
      is_featured: Boolean(prod.is_featured),
      is_available: Boolean(prod.is_available)
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, formData);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...updated } : p));
    } else {
      const created = await createProduct(formData);
      setProducts(prev => [created, ...prev]);
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa món này không?')) {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--color-coffee-dark)' }}>Quản Lý Sản Phẩm</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Thêm mới, chỉnh sửa thông tin giá và hình ảnh đồ uống.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-accent">
          <Plus size={18} /> Thêm Sản Phẩm Mới
        </button>
      </div>

      {/* PRODUCTS TABLE */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left', color: 'var(--color-coffee-dark)' }}>
              <th style={{ padding: '16px' }}>Hình Ảnh</th>
              <th style={{ padding: '16px' }}>Tên Sản Phẩm</th>
              <th style={{ padding: '16px' }}>Giá Bán</th>
              <th style={{ padding: '16px' }}>Nổi Bật</th>
              <th style={{ padding: '16px' }}>Trạng Thái</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 16px' }}>
                  <img src={p.image_url} alt={p.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                </td>
                <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--color-coffee-dark)' }}>{p.name}</td>
                <td style={{ padding: '12px 16px', color: 'var(--color-accent)', fontWeight: '700' }}>{formatVND(p.price)}</td>
                <td style={{ padding: '12px 16px' }}>
                  {p.is_featured ? (
                    <span style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: '600' }}>
                      <Star size={14} fill="var(--color-accent)" /> Nổi bật
                    </span>
                  ) : '-'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {p.is_available ? (
                    <span style={{ color: '#047857', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}>
                      <CheckCircle size={14} /> Đang bán
                    </span>
                  ) : (
                    <span style={{ color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}>
                      <XCircle size={14} /> Hết hàng
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <button onClick={() => handleOpenEditModal(p)} style={{ color: 'var(--color-coffee-dark)', padding: '6px', marginRight: '8px' }} title="Chỉnh sửa">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ color: '#B91C1C', padding: '6px' }} title="Xóa">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--color-coffee-dark)', marginBottom: '20px' }}>
              {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Tên Sản Phẩm *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Danh Mục *</label>
                  <select
                    value={formData.category_id}
                    onChange={e => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Giá Bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Hình Ảnh Sản Phẩm *</label>
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

                {/* Preset image suggestions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Chọn nhanh ảnh mẫu:</span>
                  {[
                    { label: 'Phin Đen', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop' },
                    { label: 'Bạc Xỉu', url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop' },
                    { label: 'Cold Brew', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop' },
                    { label: 'Trà Trái Cây', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop' },
                    { label: 'Bánh Ngọt', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop' }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: preset.url })}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        background: 'var(--bg-secondary)',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>

                {/* Preview Thumbnail */}
                {formData.image_url && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', padding: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Xem trước hình ảnh sẽ hiển thị trên thực đơn</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Mô Tả Sản Phẩm</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                  />
                  <span>Sản phẩm Nổi Bật</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={e => setFormData({ ...formData, is_available: e.target.checked })}
                  />
                  <span>Sẵn sàng bán</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Hủy
                </button>
                <button type="submit" className="btn btn-accent">
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
