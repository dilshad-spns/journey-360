// Screenshot utility using html-to-image (supports modern CSS)

export async function captureElementScreenshot(
  element: HTMLElement,
  backgroundColor: string
): Promise<Blob> {
  const { toPng } = await import('html-to-image');
  
  try {
    console.log('[Screenshot] Capturing with html-to-image...');
    
    // html-to-image handles CSS variables and modern color functions natively
    const dataUrl = await toPng(element, {
      backgroundColor: backgroundColor,
      quality: 1.0,
      pixelRatio: 2,
      cacheBust: true,
      style: {
        margin: '0',
        padding: '0',
      }
    });
    
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    console.log('[Screenshot] Success!');
    return blob;
    
  } catch (error) {
    console.error('[Screenshot] Error:', error);
    throw error;
  }
}
