import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PDFViewer({ pdfPath, onClose }) {
  const [loading, setLoading] = useState(true);
  
  // Convert relative path to absolute URL
  const getPDFUrl = (path) => {
    if (!path) return null;
    // If it's already a full URL, return it
    if (path.startsWith('http')) return path;
    // Otherwise, construct path relative to public folder
    // PDFs are in pdf-import/property-files/
    if (path.startsWith('/')) return path;
    return `/pdf-import/property-files/${path}`;
  };
  
  const pdfUrl = getPDFUrl(pdfPath);
  
  if (!pdfUrl) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        No PDF available for this property
      </div>
    );
  }
  
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 'var(--space-3)',
        borderBottom: '1px solid var(--glass-border)',
        marginBottom: 'var(--space-2)'
      }}>
        <h4 style={{ margin: 0, fontSize: '1rem' }}>Property PDF</h4>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '0 var(--space-2)'
            }}
          >
            ×
          </button>
        )}
      </div>
      <div style={{ flex: 1, position: 'relative', minHeight: '400px' }}>
        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'var(--text-secondary)'
          }}>
            Loading PDF...
          </div>
        )}
        <iframe
          src={pdfUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            opacity: loading ? 0 : 1,
            transition: 'opacity 0.3s'
          }}
          onLoad={() => setLoading(false)}
          title="Property PDF"
        />
      </div>
    </div>
  );
}

export function PDFViewerModal({ pdfPath, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 'var(--space-4)'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-xl)',
              width: '90%',
              maxWidth: '1200px',
              height: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <PDFViewer pdfPath={pdfPath} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

