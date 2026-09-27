import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, DollarSign, UtensilsCrossed, Grid, ArrowRight, Package } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getOrders, getProducts, getTables } from '../../services/api';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    getOrders().then(setOrders);
    getProducts().then(setProducts);
    getTables().then(setTables);
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;

  const formatVND = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--color-coffee-dark)' }}>Tổng Quan Cửa Hàng</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Theo dõi doanh thu, trạng thái đơn hàng và công suất bàn hoạt động.</p>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Tổng Doanh Thu</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--color-coffee-dark)' }}>{formatVND(totalRevenue)}</h2>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Đơn Đang Chờ / Pha Chế</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UtensilsCrossed size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--color-coffee-dark)' }}>{pendingOrders} đơn</h2>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Bàn Đang Có Khách</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FEE2E2', color: '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Grid size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--color-coffee-dark)' }}>{occupiedTables} / {tables.length} bàn</h2>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Tổng Món Đang Bán</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#D1FAE5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--color-coffee-dark)' }}>{products.length} món</h2>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--color-coffee-dark)' }}>Đơn Hàng Gần Đây</h3>
          <Link to="/admin/orders" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            Xem Tất Cả <ArrowRight size={14} />
          </Link>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
              <th style={{ padding: '12px' }}>Mã Đơn</th>
              <th style={{ padding: '12px' }}>Loại Đơn</th>
              <th style={{ padding: '12px' }}>Khách Hàng</th>
              <th style={{ padding: '12px' }}>Tổng Tiền</th>
              <th style={{ padding: '12px' }}>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>{o.order_code}</td>
                <td style={{ padding: '12px' }}>{o.order_type === 'table' ? `Tại bàn ${o.table_number || ''}` : 'Giao hàng'}</td>
                <td style={{ padding: '12px' }}>{o.customer_name} ({o.customer_phone})</td>
                <td style={{ padding: '12px', fontWeight: '600', color: 'var(--color-accent)' }}>{formatVND(o.total_amount)}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${o.status}`}>
                    {o.status === 'pending' ? 'Chờ duyệt' : o.status === 'preparing' ? 'Đang chế biến' : o.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
