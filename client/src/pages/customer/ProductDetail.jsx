import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingBag, CheckCircle, Coffee } from 'lucide-react';
import { getProductById } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Vừa');
  const [sugar, setSugar] = useState('100% Đường');
  const [ice, setIce] = useState('100% Đá');
  const [note, setNote] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    getProductById(id).then(data => setProduct(data));
  }, [id]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <Coffee size={40} style={{ opacity: 0.5, marginBottom: '16px' }} />
        <p>Đang tải chi tiết món...</p>
      </div>
    );
  }

  const sizePriceBonus = size === 'Lớn' ? 10000 : 0;
  const unitPrice = Number(product.price) + sizePriceBonus;
  const totalPrice = unitPrice * quantity;

  const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, { size, sugar, ice, note, priceWithBonus: unitPrice });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '32px', padding: '8px 18px', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Quay Lại
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '50px',
        background: 'var(--bg-card)',
        padding: '40px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* PRODUCT IMAGE */}
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '420px', background: 'var(--bg-secondary)' }}>
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* DETAILS & OPTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--color-coffee-dark)', marginBottom: '8px' }}>
            {product.name}
          </h1>
          <p style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-accent)', marginBottom: '16px' }}>
            {formatVND(unitPrice)}
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '28px' }}>
            {product.description}
          </p>

          {/* OPTION: SIZE */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: 'var(--color-coffee-dark)', marginBottom: '8px', fontSize: '0.9rem' }}>
              Chọn Kích Thước (Size)
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Vừa', 'Lớn'].map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-sm)',
                    border: size === s ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    background: size === s ? 'var(--bg-secondary)' : '#FFF',
                    fontWeight: '600',
                    color: size === s ? 'var(--color-coffee-dark)' : 'var(--color-text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  Size {s} {s === 'Lớn' ? '(+10.000đ)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* OPTION: SUGAR & ICE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: 'var(--color-coffee-dark)', marginBottom: '8px', fontSize: '0.9rem' }}>
                Mức Đường
              </label>
              <select
                value={sugar}
                onChange={e => setSugar(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
              >
                <option value="100% Đường">100% Đường (Chuẩn)</option>
                <option value="70% Đường">70% Đường (Ít ngọt)</option>
                <option value="50% Đường">50% Đường</option>
                <option value="0% Không Đường">0% Không Đường</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', color: 'var(--color-coffee-dark)', marginBottom: '8px', fontSize: '0.9rem' }}>
                Mức Đá
              </label>
              <select
                value={ice}
                onChange={e => setIce(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
              >
                <option value="100% Đá">100% Đá (Chuẩn)</option>
                <option value="70% Đá">70% Đá (Ít đá)</option>
                <option value="50% Đá">50% Đá</option>
                <option value="0% Không Đá">0% Không Đá</option>
              </select>
            </div>
          </div>

          {/* SPECIAL NOTE */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: 'var(--color-coffee-dark)', marginBottom: '8px', fontSize: '0.9rem' }}>
              Ghi Chú Cho Barista
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Mang ly mang đi, ít cafe..."
              value={note}
              onChange={e => setNote(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
            />
          </div>

          {/* QUANTITY & ADD BUTTON */}
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', background: 'var(--bg-primary)' }}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ padding: '10px 16px', color: 'var(--color-coffee-dark)' }}
              >
                <Minus size={16} />
              </button>
              <span style={{ fontWeight: '700', padding: '0 12px', minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                style={{ padding: '10px 16px', color: 'var(--color-coffee-dark)' }}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-accent"
              style={{ flex: 1, padding: '14px 28px', fontSize: '1rem' }}
            >
              <ShoppingBag size={18} /> Thêm Vào Giỏ - {formatVND(totalPrice)}
            </button>
          </div>

          {addedNotice && (
            <div style={{ marginTop: '16px', color: '#065F46', background: '#D1FAE5', padding: '10px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <CheckCircle size={16} /> Đã thêm sản phẩm vào giỏ hàng thành công!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
