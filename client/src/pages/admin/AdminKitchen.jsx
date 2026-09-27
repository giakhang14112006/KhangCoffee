import React, { useEffect, useState } from 'react';
import { UtensilsCrossed, Clock, Check, ArrowRight, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getOrders, updateOrderStatus } from '../../services/api';

export default function AdminKitchen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    getOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrders();
    // Auto refresh every 10 seconds for real-time kitchen tracking
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvanceStatus = async (orderId, currentStatus) => {
    let nextStatus = 'preparing';
    if (currentStatus === 'preparing') nextStatus = 'completed';
    await updateOrderStatus(orderId, nextStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--color-coffee-dark)' }}>
            Màn Hình Pha Chế / Bếp
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Cập nhật đơn hàng thời gian thực cho nhân viên Barista.</p>
        </div>
        <button onClick={fetchOrders} className="btn btn-outline" style={{ padding: '8px 16px' }}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Tải Lại
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        
        {/* COLUMN 1: PENDING ORDERS */}
        <div>
          <div style={{ background: '#FEF3C7', color: '#B45309', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontWeight: '700', fontSize: '1rem', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span>CHỜ PHA CHẾ</span>
            <span>{pendingOrders.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingOrders.map(order => (
              <div key={order.id} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '2px solid #F59E0B', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{order.order_code}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-coffee-dark)' }}>
                    {order.order_type === 'table' ? `BÀN ${order.table_number}` : 'GIAO HÀNG'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{item.quantity}x {item.product_name}</div>
                      {item.options && <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: '600', marginTop: '2px' }}>{item.options}</div>}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleAdvanceStatus(order.id, 'pending')}
                  className="btn btn-accent"
                  style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
                >
                  Bắt Đầu Pha Chế <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: PREPARING ORDERS */}
        <div>
          <div style={{ background: '#E0F2FE', color: '#0369A1', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontWeight: '700', fontSize: '1rem', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span>ĐANG PHA CHẾ</span>
            <span>{preparingOrders.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {preparingOrders.map(order => (
              <div key={order.id} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '2px solid #0284C7', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{order.order_code}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-coffee-dark)' }}>
                    {order.order_type === 'table' ? `BÀN ${order.table_number}` : 'GIAO HÀNG'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{item.quantity}x {item.product_name}</div>
                      {item.options && <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: '600', marginTop: '2px' }}>{item.options}</div>}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleAdvanceStatus(order.id, 'preparing')}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.9rem', background: '#047857' }}
                >
                  <Check size={16} /> Hoàn Thành Đơn
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 3: COMPLETED ORDERS */}
        <div>
          <div style={{ background: '#D1FAE5', color: '#047857', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontWeight: '700', fontSize: '1rem', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span>ĐÃ HOÀN THÀNH</span>
            <span>{completedOrders.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {completedOrders.slice(0, 5).map(order => (
              <div key={order.id} style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', opacity: 0.8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '700' }}>
                  <span>{order.order_code}</span>
                  <span>{order.order_type === 'table' ? `Bàn ${order.table_number}` : 'Giao hàng'}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  {order.items?.map(i => `${i.quantity}x ${i.product_name}`).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
