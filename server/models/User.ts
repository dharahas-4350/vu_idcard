import mongoose, { Schema } from 'mongoose';
import { docStore, isMongooseConnected } from '../config/db.js';
import crypto from 'crypto';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'admin' | 'faculty';
  collegeName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin', 'faculty'], default: 'student' },
    collegeName: { type: String, default: '' },
  },
  { timestamps: true }
);

export const MongoUserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Universal model interface matching Mongoose API
export const UserModel = {
  async findOne(query: { email?: string; _id?: string }): Promise<IUser | null> {
    if (isMongooseConnected) {
      return await MongoUserModel.findOne(query).lean();
    }
    const collection = docStore.getCollection('users');
    if (query.email) {
      return collection.find((u: IUser) => u.email.toLowerCase() === query.email?.toLowerCase()) || null;
    }
    if (query._id) {
      return collection.find((u: IUser) => u._id === query._id) || null;
    }
    return null;
  },

  async findById(id: string): Promise<IUser | null> {
    if (isMongooseConnected) {
      return await MongoUserModel.findById(id).lean();
    }
    const collection = docStore.getCollection('users');
    return collection.find((u: IUser) => u._id === id) || null;
  },

  async create(data: Partial<IUser>): Promise<IUser> {
    if (isMongooseConnected) {
      const doc = await MongoUserModel.create(data);
      return doc.toObject();
    }
    const collection = docStore.getCollection('users');
    const newUser: IUser = {
      _id: crypto.randomUUID(),
      name: data.name || '',
      email: (data.email || '').toLowerCase().trim(),
      password: data.password || '',
      role: data.role || 'student',
      collegeName: data.collegeName || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    collection.push(newUser);
    docStore.save();
    return newUser;
  },

  async update(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    if (isMongooseConnected) {
      return await MongoUserModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    const collection = docStore.getCollection('users');
    const index = collection.findIndex((u: IUser) => u._id === id);
    if (index === -1) return null;
    collection[index] = { ...collection[index], ...updates, updatedAt: new Date() };
    docStore.save();
    return collection[index];
  }
};
