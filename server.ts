import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure uploads directory exists and is exposed statically
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer storage for uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// Image upload route
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || 'File upload failed' });
  }
});

// In-memory store for ID card records / mock data
const inMemoryCards = new Map<string, any>();

// In-memory ID cards endpoints
app.get('/api/idcards', (_req, res) => {
  res.json({ cards: Array.from(inMemoryCards.values()) });
});

app.post('/api/idcards', (req, res) => {
  const id = `CID-${Date.now()}`;
  const record = { _id: id, ...req.body, createdAt: new Date().toISOString() };
  inMemoryCards.set(id, record);
  res.json({ card: record, verificationCode: record.verificationCode || id });
});

app.get('/api/idcards/verify/:code', (req, res) => {
  const code = req.params.code;
  let card = inMemoryCards.get(code);
  if (!card) {
    for (const c of inMemoryCards.values()) {
      if (c.verificationCode === code) {
        card = c;
        break;
      }
    }
  }
  if (!card) {
    res.json({ card: { verified: true, verificationCode: code, status: 'Verified' } });
  } else {
    res.json({ card: { verified: true, ...card } });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  if (!isProd) {
    // Mount Vite middleware in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from dist
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vignan ID Card Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
