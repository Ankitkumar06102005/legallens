import React, { useRef, useState } from 'react';
import axios from 'axios';

export default function UploadForm({ onUploaded }: { onUploaded: (text: string) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!inputRef.current || !inputRef.current.files || inputRef.current.files.length === 0) return;
    const file = inputRef.current.files[0];
    const formData = new FormData();
    formData.append('document', file);
    setUploading(true);
    setError(null);
    try {
      const resp = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploaded(resp.data.text);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input ref={inputRef} type="file" accept=".pdf,.txt" />
      <button onClick={handleUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
      {error && <span style={{ color: '#b00020' }}>{error}</span>}
    </div>
  );
}
