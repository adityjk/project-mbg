import { useState } from 'react';
import { MdRequestPage, MdFastfood, MdCheck, MdAdd, MdRemove } from 'react-icons/md';

// Demo page - skeleton for future implementation
export default function RequestMenu() {
  const [requests, setRequests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const popularSuggestions = [
    'Ayam Goreng',
    'Ikan Bakar',
    'Sayur Lodeh',
    'Tempe Goreng',
    'Soto Ayam',
    'Nasi Goreng',
    'Rendang',
    'Capcay'
  ];

  const handleAddRequest = () => {
    if (inputValue.trim() && !requests.includes(inputValue.trim())) {
      setRequests([...requests, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveRequest = (item: string) => {
    setRequests(requests.filter(r => r !== item));
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!requests.includes(suggestion)) {
      setRequests([...requests, suggestion]);
    }
  };

  const handleSubmit = () => {
    if (requests.length > 0) {
      // Demo: just show success
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="fade-in" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <MdCheck style={{ fontSize: '48px', color: 'var(--primary)' }} />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
          Request Diterima!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '16px', maxWidth: '400px' }}>
          Terima kasih atas request menu kamu. Tim dapur akan mempertimbangkan masukan ini.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
          (Ini adalah fitur demo)
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setSubmitted(false);
            setRequests([]);
          }}
        >
          Request Menu Lain
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <MdRequestPage style={{ fontSize: '48px', color: 'var(--accent)', marginBottom: '12px' }} />
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 700, 
          color: 'var(--accent-dark)',
          marginBottom: '8px'
        }}>
          Request Menu
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Mau menu apa besok? Sampaikan request kamu!
        </p>
        <span style={{
          display: 'inline-block',
          marginTop: '12px',
          padding: '6px 12px',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '20px',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          🚧 Fitur Demo
        </span>
      </div>

      <div className="grid-2">
        {/* Request Input */}
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Tambah Request</h2>
          
          {/* Input */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Ketik nama menu..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRequest()}
              style={{ flex: 1 }}
            />
            <button 
              className="btn btn-primary"
              onClick={handleAddRequest}
            >
              <MdAdd />
            </button>
          </div>

          {/* Popular Suggestions */}
          <div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Atau pilih dari saran populer:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {popularSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: requests.includes(suggestion) ? '2px solid var(--primary)' : '2px solid #E8F0E8',
                    background: requests.includes(suggestion) ? '#E8F5E9' : 'white',
                    color: requests.includes(suggestion) ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <MdFastfood style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Request List */}
        <div className="card">
          <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>
            Request Kamu ({requests.length})
          </h2>
          
          {requests.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 24px',
              color: 'var(--text-muted)'
            }}>
              <MdFastfood style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }} />
              <p>Belum ada request menu</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {requests.map((request) => (
                  <div 
                    key={request}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'var(--bg-main)',
                      borderRadius: '12px'
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{request}</span>
                    <button
                      onClick={() => handleRemoveRequest(request)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#FFEBEE',
                        color: 'var(--error)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <MdRemove />
                    </button>
                  </div>
                ))}
              </div>
              
              <button 
                className="btn btn-primary"
                onClick={handleSubmit}
                style={{ width: '100%' }}
              >
                Kirim Request
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
