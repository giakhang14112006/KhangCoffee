import React, { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Coffee, ShoppingBag, QrCode, UserCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { totalCount, activeTable, setActiveTable } = useCart();

  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setActiveTable(tableParam);
    }
  }, [searchParams, setActiveTable]);

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return null;
  }

  return (
    <header className="header-glass">
      <div className="container header-content">
        <Link to="/" className="logo">
          <span className="logo-badge">KC</span>
          <span>KhangCoffee</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Trang Chủ</Link>
          <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Thực Đơn</Link>
          <Link to="/tables" className={`nav-link ${location.pathname === '/tables' ? 'active' : ''}`}>Đặt Bàn</Link>

          {activeTable && (
            <div className="table-banner">
              <QrCode size={14} /> Bàn {activeTable}
            </div>
          )}

          <Link to="/cart" className="btn btn-primary" style={{ position: 'relative', padding: '10px 20px' }}>
            <ShoppingBag size={18} />
            <span>Giỏ Hàng</span>
            {totalCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'var(--color-accent)',
                color: '#FFF',
                fontSize: '0.75rem',
                fontWeight: '700',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}>
                {totalCount}
              </span>
            )}
          </Link>

          <Link to="/admin" title="Truy cập Admin" style={{ color: 'var(--color-text-light)', padding: '6px' }}>
            <UserCheck size={20} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
