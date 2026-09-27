import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Award, Sparkles, Truck, QrCode } from 'lucide-react';
import { getProducts, getCategories } from '../../services/api';
import ProductCard from '../../components/customer/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getProducts(null, true).then(data => setFeaturedProducts(data));
    getCategories().then(data => setCategories(data));
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '100px 0 120px',
        background: 'linear-gradient(135deg, #1B130E 0%, #2A1C14 100%)',
        color: '#FFF',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(200, 141, 81, 0.25) 0%, rgba(0,0,0,0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div className="container animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(200, 141, 81, 0.15)',
              border: '1px solid rgba(200, 141, 81, 0.3)',
              color: 'var(--color-accent)',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '24px'
            }}>
              <Sparkles size={14} /> Tinh Hoa Cà Phê Việt & Espresso Ý
            </div>

            <h1 className="font-serif" style={{ fontSize: '3.6rem', fontWeight: '700', lineHeight: '1.15', marginBottom: '24px', letterSpacing: '-1px' }}>
              Khởi Đầu Ngày Mới Với Tách Cà Phê <span style={{ color: 'var(--color-accent)' }}>Đậm Vị.</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: '#A3968A', lineHeight: '1.7', marginBottom: '36px', maxWidth: '480px' }}>
              Mỗi giọt cà phê tại KhangCoffee đều được rang xay tỉ mỉ từ những hạt Robusta & Arabica chọn lọc nhất. Trải nghiệm hương vị đậm đà trong không gian tối giản & hiện đại.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link to="/menu" className="btn btn-accent" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
                Khám Phá Thực Đơn <ArrowRight size={18} />
              </Link>
              <Link to="/menu?table=A1" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#FFF', padding: '16px 28px' }}>
                <QrCode size={18} /> Đặt Tại Bàn
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop"
                alt="KhangCoffee Atmosphere"
                style={{ width: '100%', height: '480px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHT FEATURES */}
      <section style={{ background: 'var(--bg-secondary)', padding: '40px 0', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', boxShadow: 'var(--shadow-sm)' }}>
              <Coffee size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-coffee-dark)' }}>Hạt Rang Nguyên Chất</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Mới mỗi tuần từ nông trại Đắk Lắk</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', boxShadow: 'var(--shadow-sm)' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-coffee-dark)' }}>Giao Hàng Tận Nơi</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Nhanh chóng, giữ trọn độ nóng lạnh</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', boxShadow: 'var(--shadow-sm)' }}>
              <Award size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-coffee-dark)' }}>Barista Chuyên Nghiệp</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Pha chế tinh tế từng chi tiết</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px' }}>
            <h2 className="font-serif" style={{ fontSize: '2.4rem', color: 'var(--color-coffee-dark)', marginBottom: '12px' }}>
              Danh Mục Sản Phẩm
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              Lựa chọn danh mục yêu thích từ các dòng cà phê phin, Espresso tinh tế cho đến trà hoa quả tươi mát.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/menu?category=${cat.id}`}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  height: '240px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '24px',
                  color: '#FFF',
                  textDecoration: 'none'
                }}
              >
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1,
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(27,19,14,0.85) 0%, rgba(27,19,14,0.1) 70%)',
                  zIndex: 2
                }} />
                <div style={{ position: 'relative', zIndex: 3 }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '4px' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#D6C8B4' }}>{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS GRID */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <span style={{ color: 'var(--color-accent)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Dành Cho Bạn</span>
              <h2 className="font-serif" style={{ fontSize: '2.4rem', color: 'var(--color-coffee-dark)', marginTop: '4px' }}>Sản Phẩm Nổi Bật</h2>
            </div>
            <Link to="/menu" className="btn btn-outline">Xem Tất Cả Món <ArrowRight size={16} /></Link>
          </div>

          <div className="grid-products">
            {featuredProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* PROMOTIONAL BANNER */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--color-coffee-dark) 0%, #4A3528 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '60px',
            color: '#FFF',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div>
              <span style={{ background: 'var(--color-accent)', color: '#FFF', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>
                Editorial Brand Story
              </span>
              <h2 className="font-serif" style={{ fontSize: '2.6rem', margin: '20px 0 16px', lineHeight: '1.2' }}>
                Cà Phê Rang Thủ Công Cho Từng Tách Espresso
              </h2>
              <p style={{ color: '#A3968A', fontSize: '1rem', lineHeight: '1.7', marginBottom: '32px' }}>
                Chúng tôi trân trọng giá trị nguyên bản của từng hạt cà phê Việt Nam. Hãy ghé cửa hàng để đắm chìm trong hương thơm nồng nàn và giai điệu nhạc Jazz êm ái.
              </p>
              <Link to="/menu" className="btn btn-accent">
                Đặt Thử Ngay Hôn Nay <ArrowRight size={16} />
              </Link>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700&auto=format&fit=crop"
                alt="Promo Editorial"
                style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
