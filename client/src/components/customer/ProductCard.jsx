import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1, { size: 'Vừa', sugar: '100% Đường', ice: '100% Đá' });
  };

  return (
    <div className="product-card" onClick={() => navigate(`/menu/${product.id}`)}>
      <div className="product-card-img-wrapper">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop'}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />
        {product.is_featured === 1 && (
          <span style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'var(--color-accent)',
            color: '#FFF',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <Star size={12} fill="#FFF" /> Signature
          </span>
        )}
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-desc">{product.description}</p>

        <div className="product-card-footer">
          <span className="product-card-price">{formatVND(product.price)}</span>
          <button
            onClick={handleQuickAdd}
            className="btn btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            title="Thêm nhanh vào giỏ hàng"
          >
            <Plus size={16} /> Thêm Món
          </button>
        </div>
      </div>
    </div>
  );
}
