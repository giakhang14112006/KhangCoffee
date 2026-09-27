import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, QrCode, CreditCard, DollarSign, CheckCircle2, User, Phone, MapPin, FileText } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalAmount, activeTable, clearCart } = useCart();

  const [orderType, setOrderType] = useState(activeTable ? 'table' : 'delivery');
  const [tableNumber, setTableNumber] = useState(activeTable || 'A1');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [submitting, setSubmitting] = useState(false);

  const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
      return;
    }
    if (orderType === 'delivery' && !address) {
      alert('Vui lòng nhập Địa chỉ giao hàng!');
      return;
    }

    setSubmitting(true);
    const orderPayload = {
      order_type: orderType,
      table_number: orderType === 'table' ? tableNumber : null,
      customer_name: name,
      customer_phone: phone,
      delivery_address: orderType === 'delivery' ? address : null,
      note,
      payment_method: paymentMethod,
      total_amount: totalAmount,
      items: cart.map(item => {
        const optionsText = [
          item.options?.size ? `Size ${item.options.size}` : null,
          item.options?.sugar,
          item.options?.ice,
          item.options?.note
        ].filter(Boolean).join(' • ');

        return {
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          options: optionsText
        };
      })
    };

    try {
      const response = await createOrder(orderPayload);
      clearCart();
      navigate('/order-success', { state: { order: response } });
    } catch (err) {
      alert('Đã xảy ra lỗi khi gửi đơn hàng. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '50px 24px 80px' }}>
      <h1 className="font-serif" style={{ fontSize: '2.4rem', color: 'var(--color-coffee-dark)', marginBottom: '32px' }}>
        Xác Nhận Đặt Hàng
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '40px' }}>
        {/* LEFT COLUMN: FORM DETAILS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* ORDER TYPE TOGGLE */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <label style={{ display: 'block', fontWeight: '600', color: 'var(--color-coffee-dark)', marginBottom: '16px' }}>
              Hình Thức Nhận Món
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: orderType === 'delivery' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  background: orderType === 'delivery' ? 'var(--bg-secondary)' : '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontWeight: '600',
                  color: orderType === 'delivery' ? 'var(--color-coffee-dark)' : 'var(--color-text-muted)'
                }}
              >
                <Truck size={20} color="var(--color-accent)" /> Giao Hàng Tận Nơi
              </button>

              <button
                type="button"
                onClick={() => setOrderType('table')}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: orderType === 'table' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  background: orderType === 'table' ? 'var(--bg-secondary)' : '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontWeight: '600',
                  color: orderType === 'table' ? 'var(--color-coffee-dark)' : 'var(--color-text-muted)'
                }}
              >
                <QrCode size={20} color="var(--color-accent)" /> Đặt Tận Bàn (QR Code)
              </button>
            </div>
          </div>

          {/* CUSTOMER INFORMATION */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-coffee-dark)', marginBottom: '20px' }}>
              Thông Tin Khách Hàng
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                  <User size={14} /> Họ và Tên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                  <Phone size={14} /> Số Điện Thoại *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ví dụ: 0901234567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                />
              </div>
            </div>

            {orderType === 'delivery' ? (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                  <MapPin size={14} /> Địa Chỉ Giao Hàng *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                  <QrCode size={14} /> Chọn Bàn Phục Vụ *
                </label>
                <select
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                >
                  {['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3'].map(tb => (
                    <option key={tb} value={tb}>Bàn {tb}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                <FileText size={14} /> Ghi Chú Đơn Hàng (Nếu có)
              </label>
              <input
                type="text"
                placeholder="Ghi chú địa điểm giao, yêu cầu đặc biệt..."
                value={note}
                onChange={e => setNote(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
              />
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-coffee-dark)', marginBottom: '16px' }}>
              Phương Thức Thanh Toán
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: paymentMethod === 'cash' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={e => setPaymentMethod(e.target.value)}
                />
                <DollarSign size={18} color="var(--color-accent)" />
                <span style={{ fontWeight: '500' }}>Tiền mặt / Thanh toán khi nhận hàng (COD / Tại bàn)</span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                border: paymentMethod === 'transfer' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  checked={paymentMethod === 'transfer'}
                  onChange={e => setPaymentMethod(e.target.value)}
                />
                <CreditCard size={18} color="var(--color-accent)" />
                <span style={{ fontWeight: '500' }}>Chuyển khoản Ngân hàng (Mã QR VietQR)</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER REVIEW & SUBMIT */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '28px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          height: 'fit-content',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--color-coffee-dark)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            Chi Tiết Đơn Hàng ({cart.length} món)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '240px', overflowY: 'auto' }}>
            {cart.map(item => (
              <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--color-coffee-dark)' }}>{item.quantity}x {item.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{item.options?.size ? `Size ${item.options.size}` : ''}</div>
                </div>
                <div style={{ fontWeight: '600' }}>{formatVND(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--color-border)', paddingTop: '16px', marginBottom: '24px', fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-coffee-dark)' }}>
            <span>Tổng Tiền</span>
            <span style={{ color: 'var(--color-accent)' }}>{formatVND(totalAmount)}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-accent"
            style={{ width: '100%', padding: '14px' }}
          >
            {submitting ? 'Đang Xử Lý...' : 'Gửi Đơn Đặt Món'} <CheckCircle2 size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
