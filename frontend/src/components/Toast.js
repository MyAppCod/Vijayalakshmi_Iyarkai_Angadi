const Toast = ({ message, type = 'success' }) => {
  const colors = {
    success: { bg: '#2e7d32', icon: '✓' },
    danger: { bg: '#c62828', icon: '✕' },
    warning: { bg: '#e65100', icon: '⚠' },
    info: { bg: '#0277bd', icon: 'ℹ' }
  };
  const { bg, icon } = colors[type] || colors.success;

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 9999,
      background: bg,
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      maxWidth: '320px',
      animation: 'slideIn 0.3s ease'
    }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <span style={{ fontSize: '14px' }}>{message}</span>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
};

export default Toast;
