import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, QrCode, Calendar, Clock, User, Phone, CheckCircle, Coffee, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { getTables, updateTableStatus } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function TableReservation() {
  const navigate = useNavigate();
  const { setActiveTable } = useCart();

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form states for table reservation
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [reservationDate, setReservationDate] = useState(new Date().toISOString().split('T')[0]);
  const [reservationTime, setReservationTime] = useState('18:00');
  const [note, setNote] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    getTables().then(data => {
      // Enrich table data with floor zones if not present
      const enriched = data.map((t, idx) => ({
        ...t,
        zone: idx < 3 ? 'Khu Trong Nhà (Máy Lạnh)' : idx < 6 ? 'Khu Sân Vườn & Cửa Sổ' : 'Khu VIP / Góc Yên Tĩnh'
      }));
      setTables(enriched);
      setLoading(false);
    });
  }, []);

  const handleSelectTable = (table) => {
    setSelectedTable(table);
    setGuestCount(table.seating_capacity || 2);
    setShowModal(true);
  };

  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Vui lòng điền đầy đủ Họ tên và Số điện thoại!');
      return;
    }

    if (selectedTable) {
      await updateTableStatus(selectedTable.id, 'reserved');
      setActiveTable(selectedTable.table_number);
      setTables(prev => prev.map(t => t.id === selectedTable.id ? { ...t, status: 'reserved' } : t));
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setShowModal(false);
      }, 2000);
    }
  };

  const handleOrderMenuForTable = () => {
    if (selectedTable) {
      setActiveTable(selectedTable.table_number);
      navigate(`/menu?table=${selectedTable.table_number}`);
    }
  };

  const availableCount = tables.filter(t => t.status === 'available').length;
  const occupiedCount = tables.filter(t => t.status === 'occupied').length;
  const reservedCount = tables.filter(t => t.status === 'reserved').length;

  const filteredTables = tables.filter(t => {
    if (selectedZone === 'indoor') return t.zone.includes('Trong Nhà');
    if (selectedZone === 'outdoor') return t.zone.includes('Sân Vườn');
    if (selectedZone === 'vip') return t.zone.includes('VIP');
    return true;
  });

  return (
    <div className="container" style={{ padding: '50px 24px 80px' }}>
      
      {/* HEADER TITLE */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-secondary)',
          color: 'var(--color-accent)',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          <Sparkles size={14} /> Sơ Đồ Chỗ Ngồi Thời Gian Thực
        </div>
        <h1 className="font-serif" style={{ fontSize: '2.8rem', color: 'var(--color-coffee-dark)', marginBottom: '12px' }}>
          Đặt Bàn KhangCoffee
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Xem ngay vị trí bàn trống, lựa chọn không gian yêu thích và đặt trước chỗ ngồi hoặc gọi món trực tiếp tại bàn.
        </p>
      </div>

      {/* STATUS BADGES COUNTER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        background: 'var(--bg-card)',
        padding: '16px 28px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--color-border)',
        margin: '0 auto 36px',
        width: 'fit-content',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#059669' }}></span>
          <span>Bàn Trống: <strong style={{ color: '#059669' }}>{availableCount}</strong></span>
        </div>
        <div style={{ height: '16px', width: '1px', background: 'var(--color-border)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#DC2626' }}></span>
          <span>Có Khách: <strong style={{ color: '#DC2626' }}>{occupiedCount}</strong></span>
        </div>
        <div style={{ height: '16px', width: '1px', background: 'var(--color-border)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#D97706' }}></span>
          <span>Đã Đặt: <strong style={{ color: '#D97706' }}>{reservedCount}</strong></span>
        </div>
      </div>

      {/* ZONE TABS FILTER */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '36px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'Tất Cả Khu Vực' },
          { id: 'indoor', label: 'Khu Trong Nhà (Máy Lạnh)' },
          { id: 'outdoor', label: 'Khu Sân Vườn & Cửa Sổ' },
          { id: 'vip', label: 'Khu VIP / Góc Yên Tĩnh' }
        ].map(zone => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone.id)}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'var(--transition-fast)',
              background: selectedZone === zone.id ? 'var(--color-coffee-dark)' : 'var(--bg-card)',
              color: selectedZone === zone.id ? '#FFF' : 'var(--color-text-muted)',
              border: selectedZone === zone.id ? '1px solid var(--color-coffee-dark)' : '1px solid var(--color-border)'
            }}
          >
            {zone.label}
          </button>
        ))}
      </div>

      {/* COFFEE SHOP FLOOR PLAN MAP */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '36px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-coffee-dark)', fontFamily: 'var(--font-serif)' }}>
            <Coffee color="var(--color-accent)" size={22} /> Sơ Đồ Không Gian Quán KhangCoffee
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>* Nhấp vào bàn còn trống để tiến hành đặt giữ chỗ</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            <Coffee size={32} className="animate-spin" style={{ opacity: 0.5, marginBottom: '12px' }} />
            <p>Đang tải sơ đồ bàn...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {filteredTables.map(t => {
              const isAvailable = t.status === 'available';
              const isOccupied = t.status === 'occupied';
              const isReserved = t.status === 'reserved';

              const statusColor = isAvailable ? '#059669' : isOccupied ? '#DC2626' : '#D97706';
              const statusBg = isAvailable ? '#D1FAE5' : isOccupied ? '#FEE2E2' : '#FEF3C7';
              const statusLabel = isAvailable ? 'Bàn Trống' : isOccupied ? 'Có Khách' : 'Đã Đặt';

              return (
                <div
                  key={t.id}
                  onClick={() => isAvailable && handleSelectTable(t)}
                  style={{
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${isAvailable ? 'var(--color-border)' : statusColor}`,
                    padding: '24px',
                    transition: 'var(--transition-normal)',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    opacity: isOccupied ? 0.75 : 1,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '180px'
                  }}
                  onMouseOver={e => {
                    if (isAvailable) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'var(--color-accent)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }
                  }}
                  onMouseOut={e => {
                    if (isAvailable) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--color-coffee-dark)', margin: 0 }}>
                        Bàn {t.table_number}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px', display: 'block' }}>
                        {t.zone}
                      </span>
                    </div>
                    <span style={{
                      background: statusBg,
                      color: statusColor,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {statusLabel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: '12px 0' }}>
                    <Users size={16} color="var(--color-accent)" /> Sức chứa: <strong>{t.seating_capacity || 4} chỗ ngồi</strong>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px dashed var(--color-border)' }}>
                    {isAvailable ? (
                      <button className="btn btn-accent" style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}>
                        <QrCode size={14} /> Bấm Đặt Bàn Này
                      </button>
                    ) : (
                      <div style={{ textAlign: 'center', fontSize: '0.82rem', color: statusColor, fontWeight: '600' }}>
                        {isOccupied ? 'Bàn đang phục vụ khách' : 'Bàn đã có khách đặt trước'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RESERVATION MODAL */}
      {showModal && selectedTable && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <div>
                <span className="badge badge-available">Đang chọn đặt</span>
                <h2 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--color-coffee-dark)', marginTop: '4px' }}>
                  Xác Nhận Đặt Bàn {selectedTable.table_number}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)', background: 'none' }}>×</button>
            </div>

            {successMsg ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle size={48} color="#059669" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-coffee-dark)', marginBottom: '8px' }}>Đặt Giữ Bàn Thành Công!</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Bàn {selectedTable.table_number} đã được giữ chỗ cho bạn.</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                      <User size={14} /> Họ và Tên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                      <Phone size={14} /> Số Điện Thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0901234567"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                      <Users size={14} /> Số Khách
                    </label>
                    <select
                      value={guestCount}
                      onChange={e => setGuestCount(Number(e.target.value))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                        <option key={n} value={n}>{n} người</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                      <Calendar size={14} /> Ngày Đến
                    </label>
                    <input
                      type="date"
                      value={reservationDate}
                      onChange={e => setReservationDate(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                      <Clock size={14} /> Giờ Đến
                    </label>
                    <input
                      type="time"
                      value={reservationTime}
                      onChange={e => setReservationTime(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Ghi Chú Đặc Biệt</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Cần ghế trẻ em, góc yên tĩnh gần cửa sổ..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                  <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '12px' }}>
                    <CheckCircle size={18} /> Xác Nhận Đặt Giữ Bàn {selectedTable.table_number}
                  </button>

                  <button
                    type="button"
                    onClick={handleOrderMenuForTable}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px' }}
                  >
                    <Coffee size={18} /> Đặt Món Trước Cho Bàn Này <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
