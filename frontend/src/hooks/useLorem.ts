// src/hooks/useLorem.ts
import { useEffect, useState } from 'react';

import { fetchLoremText } from '../services/api/services/loremService';

export const useLorem = () => {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLoremText = async () => {
      setLoading(true);
      try {
        const data = await fetchLoremText();
        setText(data);
      } catch (err) {
        setError('Não foi possível carregar o texto' + err);
      } finally {
        setLoading(false);
      }
    };

    getLoremText();
  }, []);

  return { text, loading, error };
};
