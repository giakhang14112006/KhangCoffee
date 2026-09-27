import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QrCode, Search, Coffee } from 'lucide-react';
import { getCategories, getProducts } from '../../services/api';
import ProductCard from '../../components/customer/ProductCard';
import CategoryFilter from '../../components/customer/CategoryFilter';
import { useCart } from '../../context/CartContext';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const categoryParam = searchParams.get('category');
  const selectedCategory = categoryParam ? Number(categoryParam) : null;
  const { activeTable } = useCart();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCategories(),
      getProducts(selectedCategory)
    ]).then(([catData, prodData]) => {
      setCategories(catData);
      setProducts(prodData);
      setLoading(false);
    });
  }, [selectedCategory]);

  const handleSelectCategory = (catId) => {
    if (catId === null) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '60px 24px' }}>
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          {activeTable && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-coffee-dark)', color: '#FFF', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', marginBottom: '12px' }}>
              <QrCode size={14} color="var(--color-accent)" /> Đang thực đơn phục vụ tại bàn: <strong>{activeTable}</strong>
            </div>
          )}
          <h1 className="font-serif" style={{ fontSize: '2.8rem', color: 'var(--color-coffee-dark)' }}>Thực Đơn KhangCoffee</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginTop: '4px' }}>
            Khám phá hương vị cà phê phin, Espresso Ý cùng bánh ngọt thơm ngậy.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            placeholder="Tìm kiếm thức uống..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              background: 'var(--bg-card)',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
          <Search size={18} color="var(--color-text-light)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* PRODUCT LIST GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
          <Coffee size={36} className="animate-spin" style={{ opacity: 0.5, marginBottom: '12px' }} />
          <p>Đang tải danh sách món ăn...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>Không tìm thấy sản phẩm phù hợp.</p>
        </div>
      ) : (
        <div className="grid-products">
          {filteredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
