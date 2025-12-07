import pica from "pica";

/**
 * Optimize image using Pica by scaling it down so that
 * the shorter side = maxShortSide (if larger).
 *
 * Returns Blob (JPEG/WebP) depending on browser support.
 */
export async function optimizeImage(
  file: File | Blob,
  maxShortSide: number,
  quality: number | undefined // quality optional
): Promise<Blob> {
  // Read image into HTMLImageElement
  const img = await blobToImage(file);

  // check if scaling needed
  const { width, height } = img;
  const shortSide = Math.min(width, height);

  if (shortSide <= maxShortSide) {
    // no need to rescale → return original
    return file instanceof File ? file : new Blob([file]);
  }

  const scale = maxShortSide / shortSide;
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  // Create canvases
  const srcCanvas = document.createElement("canvas");
  const dstCanvas = document.createElement("canvas");

  srcCanvas.width = width;
  srcCanvas.height = height;
  dstCanvas.width = targetWidth;
  dstCanvas.height = targetHeight;

  const ctx = srcCanvas.getContext("2d");
  if (!ctx) throw new Error("2D context not available");
  ctx.drawImage(img, 0, 0);

  // Pica instance (singleton)
  const p = pica();

  // High quality resize
  await p.resize(srcCanvas, dstCanvas, {
    quality: 3, // high quality
  });

  const blob = await p.toBlob(dstCanvas, "image/jpeg", quality ? quality : 1);

  return blob;
}

// Helper: image loader
async function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}
