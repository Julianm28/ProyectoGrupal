// Escaneo con BarcodeDetector nativo; fallback a input manual.
async function initScanner(videoEl, onCode) {
  const hasDetector = 'BarcodeDetector' in window;
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    videoEl.srcObject = stream;
    await videoEl.play();
  } catch (e) {
    console.warn('No camera access', e);
  }

  if (hasDetector) {
    const detector = new BarcodeDetector({ formats: ['code_128', 'ean_13', 'ean_8', 'upc_e', 'upc_a', 'code_39', 'qr_code'] });
    const loop = async () => {
      if (videoEl.readyState >= 2) {
        try {
          const codes = await detector.detect(videoEl);
          if (codes.length) {
            onCode(codes[0].rawValue);
            return;
          }
        } catch (e) {
          console.warn('Detector error', e);
        }
      }
      requestAnimationFrame(loop);
    };
    loop();
  } else {
    console.log('BarcodeDetector no soportado. Usa input manual.');
  }
}

// Ejemplo de uso:
// const video = document.getElementById('videoScan');
// initScanner(video, code => { console.log('Código:', code); /* llamar a tu API */ });