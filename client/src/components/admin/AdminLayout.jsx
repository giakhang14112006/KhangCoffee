import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, LayoutDashboard, Package, Tag, ShoppingBag, Grid, UtensilsCrossed, ExternalLink, LogOut, UserCheck, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const authRaw = localStorage.getItem('khangcoffee_admin_auth');
  let auth = null;
  try {
    auth = authRaw ? JSON.parse(authRaw) : null;
  } catch (e) {
    auth = null;
  }

  const isAdmin = auth?.username === 'admin' || auth?.role === 'Quản Trị Viên';

  const handleLogout = () => {
    localStorage.removeItem('khangcoffee_admin_auth');
    navigate('/admin/login');
  };

  // Staff only has access to Orders, Tables, and Kitchen
  const allNavItems = [
    { path: '/admin', label: 'Tổng Quan', icon: LayoutDashboard, adminOnly: true },
    { path: '/admin/products', label: 'Sản Phẩm', icon: Package, adminOnly: true },
    { path: '/admin/categories', label: 'Danh Mục', icon: Tag, adminOnly: true },
    { path: '/admin/orders', label: 'Đơn Hàng', icon: ShoppingBag, adminOnly: false },
    { path: '/admin/tables', label: 'Quản Lý Bàn', icon: Grid, adminOnly: false },
    { path: '/admin/kitchen', label: 'Màn Hình Bếp', icon: UtensilsCrossed, adminOnly: false }
  ];

  const navItems = isAdmin ? allNavItems : allNavItems.filter(item => !item.adminOnly);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <Coffee size={24} color="var(--color-accent)" />
          <span>KhangCoffee <small style={{ fontSize: '0.7rem', color: 'var(--color-accent)' }}>{isAdmin ? 'ADMIN' : 'STAFF'}</small></span>
        </div>

        {auth && (
          <div style={{
            padding: '12px 14px',
            margin: '0 0 16px 0',
            background: isAdmin ? 'rgba(200, 141, 81, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            border: isAdmin ? '1px solid rgba(200, 141, 81, 0.25)' : '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '8px',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {isAdmin ? <ShieldCheck size={18} color="var(--color-accent)" /> : <UserCheck size={18} color="#60A5FA" />}
            <div>
              <div style={{ fontWeight: '700', color: '#FFF' }}>{auth.name || (isAdmin ? 'Admin' : 'Nhân Viên')}</div>
              <div style={{ color: isAdmin ? 'var(--color-accent)' : '#60A5FA', fontSize: '0.75rem', fontWeight: '600' }}>{auth.role || (isAdmin ? 'Quản Trị Viên' : 'Nhân Viên')}</div>
            </div>
          </div>
        )}

        <nav className="admin-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #2A1C14', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A3968A', fontSize: '0.85rem' }}>
            <ExternalLink size={14} /> Xem Trang Khách Hàng
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#F87171',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: '6px 0',
              textAlign: 'left'
            }}
          >
            <LogOut size={14} /> Đăng Xuất ({isAdmin ? 'Admin' : 'Nhân Viên'})
          </button>
        </div>
      </aside>

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
