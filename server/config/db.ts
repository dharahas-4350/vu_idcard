import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'campusid_db.json');

// Initial default seed store if needed
interface DBState {
  users: any[];
  students: any[];
  idcards: any[];
}

// In-memory + persistent file store for maximum resilience and zero downtime
class DocumentStore {
  private state: DBState = {
    users: [],
    students: [],
    idcards: [],
  };
  private isLoaded = false;

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.state = JSON.parse(raw);
      } else {
        this.save();
      }
      this.isLoaded = true;
    } catch (e) {
      console.warn('DocumentStore: Error loading DB file, starting fresh', e);
      this.state = { users: [], students: [], idcards: [] };
    }
  }

  public save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (e) {
      console.error('DocumentStore: Failed to persist DB', e);
    }
  }

  public getCollection(name: 'users' | 'students' | 'idcards') {
    if (!this.state[name]) {
      this.state[name] = [];
    }
    return this.state[name];
  }
}

export const docStore = new DocumentStore();

export let isMongooseConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      await mongoose.connect(uri);
      isMongooseConnected = true;
      console.log('MongoDB connected successfully via Mongoose.');
      return;
    } catch (err) {
      console.warn('Mongoose connection failed, falling back to local persistent DocumentStore:', err);
    }
  } else {
    console.log('No MONGODB_URI provided. Using local persistent DocumentStore with Mongoose schemas.');
  }
}
