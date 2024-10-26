export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error('Không thể đọc Blob'));
    };

    reader.readAsDataURL(blob);
  });
};

export const createBase64Url = (
  base64: string,
  mimeType: string = 'image/png',
): string => {
  return `data:${mimeType};base64,${base64}`;
};
