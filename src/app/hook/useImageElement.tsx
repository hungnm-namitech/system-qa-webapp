import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { blobToBase64, createBase64Url } from '../utilities/blob';

function useImageElement(imageUrl: string) {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [imageType, setTypeImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const imageRef: MutableRefObject<HTMLImageElement | null> =
    useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageUrl) return;
    setLoading(true);
    fetch(imageUrl, {
      cache: 'no-cache',
    })
      .then((data) => data.blob())
      .then((blob) => {
        setTypeImage(blob.type);
        blobToBase64(blob).then(async (res) => {
          const base64Url = createBase64Url(res, blob.type);
          const img = new Image();
          img.src = base64Url;

          img.onload = () => {
            imageRef.current = img;
            setImageElement(img);
          };

          img.onerror = (err) => {
            console.error('Image failed to load', err);
            setError(true);
          };
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [imageUrl]);

  return { imageElement, loading, imageType, error };
}

export default useImageElement;
