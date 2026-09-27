import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getOrders, updateOrderStatus } from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = () => {
    getOrders().then(setOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const filteredOrders = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

  const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--color-coffee-dark)' }}>Quản Lý Đơn Hàng</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Xem danh sách đơn đặt món, thông tin khách hàng và cập nhật trạng thái.</p>
        </div>

        {/* STATUS FILTER BUTTONS */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
          {['all', 'pending', 'preparing', 'completed', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: '600',
                background: filterStatus === st ? 'var(--color-coffee-dark)' : 'transparent',
                color: filterStatus === st ? '#FFF' : 'var(--color-text-muted)',
                transition: 'var(--transition-fast)'
              }}
            >
              {st === 'all' ? 'Tất cả' : st === 'pending' ? 'Chờ duyệt' : st === 'preparing' ? 'Đang pha chế' : st === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredOrders.map(order => (
          <div
            key={order.id}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <div>
                <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--color-coffee-dark)', marginRight: '12px' }}>
                  {order.order_code}
                </span>
                <span className={`badge badge-${order.status}`}>
                  {order.status === 'pending' ? 'Chờ duyệt' : order.status === 'preparing' ? 'Đang pha chế' : order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                </span>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Loại đơn: <strong>{order.order_type === 'table' ? `Tại bàn (${order.table_number || 'A1'})` : 'Giao hàng tận nơi'}</strong> • Thanh toán: {order.payment_method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
                </div>
              </div>

              {/* ACTION SELECTOR */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Cập nhật:</span>
                <select
                  value={order.status}
                  onChange={e => handleStatusChange(order.id, e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontWeight: '600' }}
                >
                  <option value="pending">Chờ duyệt</option>
                  <option value="preparing">Đang pha chế</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Hủy đơn</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Món Đã Đặt:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong>{item.quantity}x</strong> {item.product_name} <small style={{ color: 'var(--color-text-muted)' }}>({item.options})</small></span>
                      <span style={{ fontWeight: '600' }}>{formatVND(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderLeft: '1px dashed var(--color-border)', paddingLeft: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Thông Tin Khách:</h4>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-coffee-dark)' }}>{order.customer_name}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>SĐT: {order.customer_phone}</p>
                {order.delivery_address && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Địa chỉ: {order.delivery_address}</p>
                )}
                <div style={{ marginTop: '12px', fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                  Tổng: {formatVND(order.total_amount)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
