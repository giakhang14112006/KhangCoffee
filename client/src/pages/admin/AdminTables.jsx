import React, { useEffect, useState } from 'react';
import { QrCode, Plus, Users, ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getTables, updateTableStatus } from '../../services/api';

export default function AdminTables() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    getTables().then(setTables);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateTableStatus(id, newStatus);
    setTables(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--color-coffee-dark)' }}>Quản Lý Trạng Thái Bàn</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Theo dõi bàn trống, bàn đang phục vụ và liên kết QR đặt món tại bàn.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
        {tables.map(table => (
          <div
            key={table.id}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: table.status === 'occupied' ? '2px solid #EF4444' : table.status === 'reserved' ? '2px solid #F59E0B' : '1px solid var(--color-border)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--color-coffee-dark)' }}>
                Bàn {table.table_number}
              </h3>
              <span className={`badge badge-${table.status}`}>
                {table.status === 'available' ? 'Bàn Trống' : table.status === 'occupied' ? 'Có Khách' : 'Đã Đặt'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              <Users size={16} /> Sức chứa: <strong>{table.seating_capacity || 4} người</strong>
            </div>

            {/* STATUS SWITCH BUTTONS */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                <button
                  onClick={() => handleStatusChange(table.id, 'available')}
                  style={{
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: table.status === 'available' ? '#047857' : 'var(--bg-primary)',
                    color: table.status === 'available' ? '#FFF' : 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  Trống
                </button>

                <button
                  onClick={() => handleStatusChange(table.id, 'occupied')}
                  style={{
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: table.status === 'occupied' ? '#B91C1C' : 'var(--bg-primary)',
                    color: table.status === 'occupied' ? '#FFF' : 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  Có Khách
                </button>

                <button
                  onClick={() => handleStatusChange(table.id, 'reserved')}
                  style={{
                    padding: '6px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: table.status === 'reserved' ? '#B45309' : 'var(--bg-primary)',
                    color: table.status === 'reserved' ? '#FFF' : 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  Đã Đặt
                </button>
              </div>

              <a
                href={`/menu?table=${table.table_number}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--color-coffee-dark)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  marginTop: '8px',
                  textDecoration: 'none'
                }}
              >
                <QrCode size={14} /> Mở Trang QR Bàn <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
