import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Clock, QrCode, Home, Coffee, PhoneCall } from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order || {
    order_code: 'KC-' + Math.floor(1000 + Math.random() * 9000),
    total_amount: 81000,
    customer_name: 'Khách hàng',
    order_type: 'table',
    table_number: 'A1',
    payment_method: 'cash'
  };

  const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val) || 0);
  };

  return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: '640px' }}>
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        textAlign: 'center',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: '#D1FAE5',
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <CheckCircle size={40} />
        </div>

        <span style={{
          background: 'var(--bg-secondary)',
          color: 'var(--color-coffee-dark)',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: '700',
          letterSpacing: '1px'
        }}>
          MÃ ĐƠN HÀNG: {order.order_code}
        </span>

        <h1 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--color-coffee-dark)', margin: '16px 0 8px' }}>
          Đặt Hàng Thành Công!
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '28px' }}>
          Cảm ơn bạn <strong>{order.customer_name}</strong>. Đơn hàng của bạn đã được chuyển tới quầy Barista của KhangCoffee.
        </p>

        {/* ORDER DETAILS SUMMARY */}
        <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '28px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Hình thức:</span>
            <strong style={{ textTransform: 'uppercase' }}>
              {order.order_type === 'table' ? `Tại bàn (Bàn ${order.table_number || 'A1'})` : 'Giao hàng tận nơi'}
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Thanh toán:</span>
            <strong>{order.payment_method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản Ngân hàng'}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '700', borderTop: '1px dashed var(--color-border)', paddingTop: '10px', marginTop: '10px' }}>
            <span>Tổng tiền:</span>
            <span style={{ color: 'var(--color-accent)' }}>{formatVND(order.total_amount)}</span>
          </div>
        </div>

        {order.payment_method === 'transfer' && (
          <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '28px', textAlign: 'center' }}>
            <h4 style={{ color: '#92400E', fontSize: '0.95rem', marginBottom: '8px' }}>Thông Tin Chuyển Khoản VietQR</h4>
            <p style={{ fontSize: '0.85rem', color: '#78350F', marginBottom: '12px' }}>
              Ngân hàng: <strong>MBBank</strong> • STK: <strong>0901234567</strong> • Chủ TK: <strong>KHANG COFFEE SHOP</strong>
            </p>
            <p style={{ fontSize: '0.85rem', color: '#78350F' }}>
              Nội dung chuyển khoản: <strong>{order.order_code}</strong>
            </p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--color-coffee-dark)', fontSize: '0.9rem', marginBottom: '32px' }}>
          <Clock size={16} color="var(--color-accent)" /> Thời gian chờ dự kiến: <strong>10 - 15 phút</strong>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-outline" style={{ padding: '12px 24px' }}>
            <Home size={16} /> Trang Chủ
          </Link>
          <Link to="/menu" className="btn btn-accent" style={{ padding: '12px 24px' }}>
            <Coffee size={16} /> Đặt Thêm Món
          </Link>
        </div>
      </div>
    </div>
  );
}
