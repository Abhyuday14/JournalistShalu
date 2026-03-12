import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const SignedImage = ({ src, alt, className }: { src: string, alt?: string, className?: string }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;
    if (src.startsWith('http') || src.startsWith('data:')) {
      setImgSrc(src);
      return;
    }

    const fetchSignedUrl = async () => {
      const { data, error } = await supabase.storage.from('app-files').createSignedUrl(src, 60 * 60 * 24 * 365); // 1 year
      if (data?.signedUrl) {
        setImgSrc(data.signedUrl);
      } else {
        console.error('Error fetching signed URL:', error);
        setImgSrc(src); // fallback
      }
    };

    fetchSignedUrl();
  }, [src]);

  if (!imgSrc) return <div className={`bg-gray-200 animate-pulse ${className}`}></div>;

  return <img src={imgSrc} alt={alt} className={className} referrerPolicy="no-referrer" />;
};
