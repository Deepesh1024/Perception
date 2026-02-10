/**
 * Simulates a "Heatmap" or "Difference" calculation using Canvas.
 * In a real app, this would compare the Input vs Prediction. 
 * Here, we create a visual effect based on the input image to look like a heatmap.
 */
export const processHeatmap = (imageBase64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      const w = img.width;
      const h = img.height;
      canvas.width = w;
      canvas.height = h;

      // Draw original
      ctx.drawImage(img, 0, 0);

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // Apply a "Heatmap" effect
      // Logic: High contrast areas = "High Error" (Red/Yellow), Low contrast = "Low Error" (Blue)
      // This simulates the "Prediction Error" occurring at edges.
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const brightness = (r + g + b) / 3;
        
        // Simple mock heatmap color map
        // If brightness is high or very low (edges often), make it "Hot"
        // Otherwise cool.
        // This is purely aesthetic for the "Brain Simulation" look.
        
        if (brightness > 200 || brightness < 50) {
           data[i] = 255;     // R
           data[i+1] = 0;     // G
           data[i+2] = 0;     // B
        } else if (brightness > 150) {
           data[i] = 255;
           data[i+1] = 255;
           data[i+2] = 0;
        } else {
           data[i] = 0;
           data[i+1] = 0;
           data[i+2] = 255; // Blue for low error/stable
           data[i+3] = 100; // Semi transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.src = imageBase64;
  });
};

export const generateIgnitionData = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        timestamp: i,
        value: Math.random()
    }));
}
