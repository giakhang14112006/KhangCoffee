import React from 'react';
import { useLocation } from 'react-router-dom';
import { Coffee, MapPin, Phone, Clock, Heart } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer-dark">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', paddingBottom: '40px', borderBottom: '1px solid #2C2018' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', fontWeight: '700', fontFamily: 'var(--font-serif)', color: '#FFF', marginBottom: '16px' }}>
              <Coffee size={24} color="var(--color-accent)" /> KhangCoffee
            </div>
            <p style={{ color: '#A3968A', fontSize: '0.9rem', lineHeight: '1.7' }}>
              Cà phê nguyên bản phong cách Editorial & Minimal. Đậm đà từng giọt phin, tinh tế từng tách Espresso.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontSize: '1.05rem', marginBottom: '16px' }}>Giờ Mở Cửa</h4>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#A3968A', fontSize: '0.9rem', marginBottom: '8px' }}>
              <Clock size={18} color="var(--color-accent)" />
              <div>
                <p>Thứ 2 - Thứ 6: 07:00 - 22:30</p>
                <p>Thứ 7 - Chủ Nhật: 06:30 - 23:00</p>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFF', fontSize: '1.05rem', marginBottom: '16px' }}>Liên Hệ & Địa Chỉ</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#A3968A', fontSize: '0.9rem', marginBottom: '10px' }}>
              <MapPin size={18} color="var(--color-accent)" />
              <span>123 Nguyễn Thị Minh Khai, Q.3, TP.HCM</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#A3968A', fontSize: '0.9rem' }}>
              <Phone size={18} color="var(--color-accent)" />
              <span>0901 234 567 - 028 3822 9999</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '24px', color: '#8C7E72', fontSize: '0.85rem' }}>
          <p>© 2026 KhangCoffee. Tất cả quyền được bảo lưu.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Thiết kế với <Heart size={14} color="var(--color-accent)" fill="var(--color-accent)" /> cho trải nghiệm cà phê hoàn hảo.
          </p>
        </div>
      </div>
    </footer>
  );
}
