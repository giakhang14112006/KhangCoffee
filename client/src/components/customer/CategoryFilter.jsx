import React from 'react';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      overflowX: 'auto',
      paddingBottom: '8px',
      margin: '24px 0 36px',
      scrollbarWidth: 'none'
    }}>
      <button
        onClick={() => onSelectCategory(null)}
        style={{
          padding: '10px 22px',
          borderRadius: 'var(--radius-full)',
          fontWeight: '600',
          fontSize: '0.92rem',
          whiteSpace: 'nowrap',
          transition: 'var(--transition-fast)',
          background: selectedCategory === null ? 'var(--color-coffee-dark)' : 'var(--bg-card)',
          color: selectedCategory === null ? '#FFF' : 'var(--color-text-muted)',
          border: selectedCategory === null ? '1px solid var(--color-coffee-dark)' : '1px solid var(--color-border)',
          boxShadow: selectedCategory === null ? 'var(--shadow-sm)' : 'none'
        }}
      >
        Tất Cả Thức Uống
      </button>

      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          style={{
            padding: '10px 22px',
            borderRadius: 'var(--radius-full)',
            fontWeight: '600',
            fontSize: '0.92rem',
            whiteSpace: 'nowrap',
            transition: 'var(--transition-fast)',
            background: selectedCategory === cat.id ? 'var(--color-coffee-dark)' : 'var(--bg-card)',
            color: selectedCategory === cat.id ? '#FFF' : 'var(--color-text-muted)',
            border: selectedCategory === cat.id ? '1px solid var(--color-coffee-dark)' : '1px solid var(--color-border)',
            boxShadow: selectedCategory === cat.id ? 'var(--shadow-sm)' : 'none'
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
