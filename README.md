# AI Image Detector - Frontend

A modern web application frontend for detecting whether an image is AI-generated (synthetic) or real.

## Features

- 🎨 **Modern UI/UX** - Clean, professional interface with gradient designs
- 📤 **Drag & Drop Upload** - Easy image upload with drag and drop support
- 🖼️ **Image Preview** - Preview images before analysis
- 📊 **Result Display** - Beautiful result cards with confidence scores
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast & Lightweight** - Optimized React application

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main application component
│   ├── App.css             # Application styles
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
└── package.json            # Dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional):
Edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAX_FILE_SIZE=10485760
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Integrating Your Backend/Model

The frontend is designed to work with any backend. To integrate your model:

### Option 1: Modify the API Call

In `src/App.js`, locate the `handleSubmit` function (around line 70):

```javascript
const handleSubmit = async () => {
  // Your custom logic here
  const formData = new FormData();
  formData.append('image', selectedImage);

  try {
    // Replace this with your API endpoint or model inference
    const response = await axios.post(`${API_URL}/api/predict`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setResult(response.data);
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to analyze image');
  } finally {
    setLoading(false);
  }
};
```

### Option 2: Direct Model Integration

If you're using TensorFlow.js or ONNX.js for client-side inference:

```javascript
import * as tf from '@tensorflow/tfjs';

// Load your model
const model = await tf.loadLayersModel('path/to/model.json');

// In handleSubmit function
const handleSubmit = async () => {
  setLoading(true);
  setError(null);

  try {
    // Preprocess image
    const img = new Image();
    img.src = preview;
    await img.decode();
    
    const tensor = tf.browser.fromPixels(img)
      .resizeBilinear([224, 224])
      .div(255.0)
      .expandDims(0);
    
    // Make prediction
    const prediction = await model.predict(tensor);
    const score = await prediction.data();
    
    // Set result
    setResult({
      prediction: score[0] > 0.5 ? 'synthetic' : 'real',
      confidence: score[0] > 0.5 ? score[0] : 1 - score[0],
      score: score[0]
    });
    
    // Cleanup
    tensor.dispose();
    prediction.dispose();
  } catch (err) {
    setError('Failed to analyze image');
  } finally {
    setLoading(false);
  }
};
```

### Option 3: Custom API Integration

Replace the API URL in `.env`:
```env
REACT_APP_API_URL=https://your-api-endpoint.com
```

Expected API response format:
```json
{
  "prediction": "synthetic" | "real",
  "confidence": 0.95,
  "score": 0.95
}
```

## Customization

### Changing Colors

Edit `src/App.css` to modify the color scheme:
- Primary gradient: `#667eea` to `#764ba2`
- Success color: `#27ae60`
- Error color: `#e74c3c`

### Modifying Upload Limits

Change `REACT_APP_MAX_FILE_SIZE` in `.env` (in bytes):
```env
REACT_APP_MAX_FILE_SIZE=10485760  # 10MB
```

### Adding New Features

The component structure is modular. Key sections:
- **Header** - Lines 95-110
- **Hero Section** - Lines 113-145
- **Upload Area** - Lines 150-195
- **Results Display** - Lines 220-265
- **Footer** - Lines 270-310

## Technologies Used

- **React 18** - UI framework
- **Axios** - HTTP client
- **CSS3** - Styling with gradients and animations
- **HTML5** - Drag & drop API

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## File Size Limits

Default maximum file size: **10MB**

Supported formats:
- JPG/JPEG
- PNG
- GIF
- WebP
- BMP

## Troubleshooting

### Port Already in Use

If port 3000 is busy:
```bash
PORT=3001 npm start
```

### Build Errors

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues

If connecting to external API, ensure CORS is enabled on your backend.

## License

MIT License - Feel free to use this in your projects!

## Contributing

Feel free to submit issues and enhancement requests!

---

**Note:** This is a frontend-only application. You need to integrate your own model/backend for actual image detection functionality.
