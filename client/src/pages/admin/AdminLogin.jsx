import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Lock, User, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if ((username === 'admin' || username === 'staff') && password === '123456') {
      const role = username === 'admin' ? 'Quản Trị Viên' : 'Nhân Viên';
      const authData = {
        username,
        name: username === 'admin' ? 'Khang (Admin)' : 'Nhân Viên Quán',
        role,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('khangcoffee_admin_auth', JSON.stringify(authData));

      if (username === 'staff') {
        navigate('/admin/orders');
      } else {
        navigate('/admin');
      }
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác! (Mẹo: Dùng admin / 123456 hoặc staff / 123456)');
    }
  };

  const handleQuickLogin = (roleType) => {
    const isAdm = roleType === 'admin';
    const authData = {
      username: isAdm ? 'admin' : 'staff',
      name: isAdm ? 'Khang (Admin)' : 'Nhân Viên Quán',
      role: isAdm ? 'Quản Trị Viên' : 'Nhân Viên',
      isLoggedIn: true,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('khangcoffee_admin_auth', JSON.stringify(authData));
    navigate(isAdm ? '/admin' : '/admin/orders');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #16100C 0%, #2A1C14 100%)',
      color: '#FFF',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#231812',
        border: '1px solid rgba(200, 141, 81, 0.25)',
        borderRadius: '16px',
        padding: '36px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Decorative Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #C88D51, #E5BA8F)'
        }} />

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(200, 141, 81, 0.15)',
            border: '1px solid rgba(200, 141, 81, 0.4)',
            color: 'var(--color-accent)',
            marginBottom: '16px'
          }}>
            <Coffee size={32} />
          </div>
          <h1 className="font-serif" style={{ fontSize: '1.8rem', color: '#FFF', marginBottom: '6px' }}>KhangCoffee Portal</h1>
          <p style={{ color: '#A3968A', fontSize: '0.88rem' }}>Đăng nhập dành cho Admin & Nhân Viên</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            color: '#F87171',
            padding: '12px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#D4C7BC', marginBottom: '6px' }}>
              Tên tài khoản (Username)
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8C7E72' }} />
              <input
                type="text"
                required
                placeholder="Nhập 'admin' hoặc 'staff'"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 42px',
                  background: '#16100C',
                  border: '1px solid #3D2B20',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#D4C7BC', marginBottom: '6px' }}>
              Mật khẩu (Password)
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8C7E72' }} />
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu (Mặc định: 123456)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 42px',
                  background: '#16100C',
                  border: '1px solid #3D2B20',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #C88D51 0%, #A66E38 100%)',
              color: '#FFF',
              fontWeight: '700',
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '10px',
              boxShadow: '0 4px 12px rgba(200, 141, 81, 0.3)'
            }}
          >
            Đăng Nhập Quản Trị <ArrowRight size={18} />
          </button>
        </form>

        {/* QUICK DEMO LOGIN BUTTONS */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #332219' }}>
          <p style={{ fontSize: '0.78rem', color: '#8C7E72', textAlign: 'center', marginBottom: '12px', fontWeight: '600' }}>
            Dành cho Demo nhanh (1-Click Login):
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(200, 141, 81, 0.12)',
                border: '1px solid rgba(200, 141, 81, 0.3)',
                color: 'var(--color-accent)',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={16} /> Admin Mode
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('staff')}
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid #3D2B20',
                color: '#D4C7BC',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <UserCheck size={16} /> Staff Mode
            </button>
          </div>
        </div>

        {/* BACK TO CUSTOMER */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a
            href="/"
            style={{ color: '#8C7E72', fontSize: '0.8rem', textDecoration: 'none' }}
          >
            ← Quay lại trang Khách Hàng
          </a>
        </div>
      </div>
    </div>
  );
}
