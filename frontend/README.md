# AI Image Detector - Pure Frontend

A complete frontend-only web application to detect AI-generated images using Bytez API directly from the browser.

## ✨ Features

- 🎨 Modern, professional UI
- 📤 Drag & Drop image upload
- 🖼️ Image preview
- 🤖 Direct Bytez API integration (no backend needed!)
- 📊 Detailed real/fake scores
- 📱 Fully responsive
- ⚡ Fast and lightweight

## 🚀 Quick Start

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.js          # Main component with Bytez API integration
│   ├── App.css         # Styles
│   └── index.js        # Entry point
├── public/
├── .env                # Environment variables
└── package.json
```

## 🔑 API Key

The Bytez API key is directly in the code (`App.js` line 5). For production:

1. Move it to `.env`:
```env
REACT_APP_BYTEZ_API_KEY=your_api_key_here
```

2. Update `App.js`:
```javascript
const BYTEZ_API_KEY = process.env.REACT_APP_BYTEZ_API_KEY;
```

## 🌐 How It Works

1. User uploads image
2. Image converted to base64
3. Direct API call to Bytez: `https://api.bytez.com/v1/models/mahsharyahan/vit-ai-detection/run`
4. Response parsed and displayed

**No backend server needed!** Everything runs in the browser.

## 📊 API Response

```json
{
  "prediction": "real",
  "confidence": 0.986,
  "real_score": 0.986,
  "fake_score": 0.014
}
```

## 🛠️ Technologies

- React 18
- Bytez API
- CSS3
- Fetch API

## 📦 Build for Production

```bash
npm run build
```

Deploy the `build/` folder to any static hosting (Vercel, Netlify, GitHub Pages, etc.)

## 🔒 Security Note

For production, store API key securely:
- Use environment variables
- Consider using a proxy/backend for API key protection
- Or use Bytez's client-side authentication if available

## 📝 License

MIT

---

**Pure frontend solution - No backend required!** 🎉
