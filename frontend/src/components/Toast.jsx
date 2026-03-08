import { useEffect, useState } from 'react';

export default function Toast({ message }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className={`toast-container${visible ? ' show' : ''}`}>
      <i className="fas fa-info-circle"></i>
      <span>{message}</span>
    </div>
  );
}
