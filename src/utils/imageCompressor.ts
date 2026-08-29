/**
 * Utility to compress images on the client side using HTML5 Canvas.
 * Reduces raw 5-15MB photos down to ~30-60KB WebP/JPEG data URLs,
 * preventing LocalStorage quota exceptions while preserving sharp display quality.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo de imagem'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagem inválido'));
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(width, 1);
          canvas.height = Math.max(height, 1);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Try webp first, fallback to jpeg
          try {
            const dataUrl = canvas.toDataURL('image/webp', quality);
            if (dataUrl.startsWith('data:image/webp')) {
              resolve(dataUrl);
              return;
            }
          } catch {
            // fallback
          }

          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch {
          resolve(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
