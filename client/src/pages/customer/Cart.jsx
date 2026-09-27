import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, QrCode } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalAmount, activeTable } = useCart();
  const navigate = useNavigate();

  const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--color-accent)' }}>
          <ShoppingBag size={36} />
        </div>
        <h2 className="font-serif" style={{ fontSize: '2rem', color: 'var(--color-coffee-dark)', marginBottom: '12px' }}>Giỏ Hàng Đang Trống</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Bạn chưa lựa chọn món ăn nào. Hãy khám phá thực đơn thơm lừng nhé!</p>
        <Link to="/menu" className="btn btn-accent" style={{ padding: '14px 32px' }}>
          Xem Thực Đơn Ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '50px 24px 80px' }}>
      <h1 className="font-serif" style={{ fontSize: '2.4rem', color: 'var(--color-coffee-dark)', marginBottom: '32px' }}>
        Giỏ Hàng Của Bạn
      </h1>

      {activeTable && (
        <div style={{ background: 'var(--color-coffee-dark)', color: '#FFF', padding: '14px 20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <QrCode size={20} color="var(--color-accent)" />
          <span>Bạn đang chọn món cho <strong>Bàn {activeTable}</strong> tại quán.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        {/* ITEM LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.map(item => {
            const optionsText = [
              item.options?.size ? `Size ${item.options.size}` : null,
              item.options?.sugar,
              item.options?.ice,
              item.options?.note ? `Ghi chú: ${item.options.note}` : null
            ].filter(Boolean).join(' • ');

            return (
              <div
                key={item.cartItemId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  background: 'var(--bg-card)',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-coffee-dark)' }}>{item.name}</h3>
                  {optionsText && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{optionsText}</p>
                  )}
                  <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-accent)', marginTop: '6px' }}>
                    {formatVND(item.price)}
                  </p>
                </div>

                {/* QUANTITY CONTROL */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', background: 'var(--bg-primary)' }}>
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} style={{ padding: '6px 12px' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ fontWeight: '600', padding: '0 8px', fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} style={{ padding: '6px 12px' }}>
                    <Plus size={14} />
                  </button>
                </div>

                {/* REMOVE BUTTON */}
                <button onClick={() => removeFromCart(item.cartItemId)} style={{ color: 'var(--color-text-light)', padding: '8px' }} title="Xóa">
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '28px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          height: 'fit-content',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--color-coffee-dark)', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            Tóm Tắt Đơn Hàng
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
            <span>Tạm tính ({cart.reduce((s, i) => s + i.quantity, 0)} món)</span>
            <span>{formatVND(totalAmount)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
            <span>Phí phục vụ / Giao hàng</span>
            <span style={{ color: '#065F46', fontWeight: '500' }}>Miễn phí</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--color-border)', paddingTop: '16px', marginBottom: '28px', fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-coffee-dark)' }}>
            <span>Tổng cộng</span>
            <span style={{ color: 'var(--color-accent)' }}>{formatVND(totalAmount)}</span>
          </div>

          <button onClick={() => navigate('/checkout')} className="btn btn-accent" style={{ width: '100%', padding: '14px' }}>
            Tiến Hành Đặt Hàng <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
