import mongoose, { Schema } from 'mongoose';
import { docStore, isMongooseConnected } from '../config/db.js';
import crypto from 'crypto';
import { IStudent } from './Student.js';

export interface IIDCard {
  _id: string;
  userId?: string;
  studentId: string;
  studentData: Partial<IStudent>;
  template: 'classic-blue' | 'modern-purple' | 'minimal-white' | 'premium-black' | 'university-green';
  theme: {
    primaryColor?: string;
    accentColor?: string;
    secondaryColor?: string;
  };
  cardLayout: 'vertical' | 'horizontal';
  fontStyle: 'modern' | 'classic' | 'geometric';
  collegeLogo: string;
  signatureText?: string;
  verificationCode: string;
  qrPayload: string;
  status: 'Draft' | 'Generated' | 'Saved';
  cardValidity: string;
  createdAt: Date;
  updatedAt: Date;
}

const IDCardSchema = new Schema<IIDCard>(
  {
    userId: { type: String, ref: 'User' },
    studentId: { type: String, ref: 'Student', required: true },
    studentData: { type: Object, default: {} },
    template: {
      type: String,
      enum: ['classic-blue', 'modern-purple', 'minimal-white', 'premium-black', 'university-green'],
      default: 'classic-blue',
    },
    theme: {
      primaryColor: { type: String, default: '#1e3a8a' },
      accentColor: { type: String, default: '#3b82f6' },
      secondaryColor: { type: String, default: '#f8fafc' },
    },
    cardLayout: { type: String, enum: ['vertical', 'horizontal'], default: 'vertical' },
    fontStyle: { type: String, enum: ['modern', 'classic', 'geometric'], default: 'modern' },
    collegeLogo: { type: String, default: '' },
    signatureText: { type: String, default: 'Authorized Registrar' },
    verificationCode: { type: String, required: true, unique: true },
    qrPayload: { type: String, required: true },
    status: { type: String, enum: ['Draft', 'Generated', 'Saved'], default: 'Saved' },
    cardValidity: { type: String, default: 'Valid for current academic session' },
  },
  { timestamps: true }
);

export const MongoIDCardModel = mongoose.models.IDCard || mongoose.model<IIDCard>('IDCard', IDCardSchema);

export const IDCardModel = {
  async find(query: { userId?: string; search?: string } = {}): Promise<IIDCard[]> {
    if (isMongooseConnected) {
      const filter: any = {};
      if (query.userId) filter.userId = query.userId;
      return await MongoIDCardModel.find(filter).sort({ updatedAt: -1 }).lean();
    }
    const collection = docStore.getCollection('idcards');
    let cards = collection;
    if (query.userId) {
      cards = cards.filter((c: IIDCard) => c.userId === query.userId);
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      cards = cards.filter((c: IIDCard) => {
        const name = c.studentData?.name?.toLowerCase() || '';
        const roll = c.studentData?.rollNumber?.toLowerCase() || '';
        const college = c.studentData?.collegeName?.toLowerCase() || '';
        const vCode = c.verificationCode?.toLowerCase() || '';
        return name.includes(q) || roll.includes(q) || college.includes(q) || vCode.includes(q);
      });
    }
    return [...cards];
  },

  async findById(id: string): Promise<IIDCard | null> {
    if (isMongooseConnected) {
      return await MongoIDCardModel.findById(id).lean();
    }
    const collection = docStore.getCollection('idcards');
    return collection.find((c: IIDCard) => c._id === id) || null;
  },

  async findByVerificationCode(code: string): Promise<IIDCard | null> {
    if (isMongooseConnected) {
      return await MongoIDCardModel.findOne({ verificationCode: code }).lean();
    }
    const collection = docStore.getCollection('idcards');
    return collection.find((c: IIDCard) => c.verificationCode?.toUpperCase() === code.toUpperCase()) || null;
  },

  async create(data: Partial<IIDCard>): Promise<IIDCard> {
    const vCode = data.verificationCode || `CID-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const qrPayload = data.qrPayload || JSON.stringify({
      app: 'CampusID',
      verify: vCode,
      student: data.studentData?.name || 'Student',
      roll: data.studentData?.rollNumber || '',
      college: data.studentData?.collegeName || '',
    });

    if (isMongooseConnected) {
      const doc = await MongoIDCardModel.create({
        ...data,
        verificationCode: vCode,
        qrPayload,
      });
      return doc.toObject();
    }

    const collection = docStore.getCollection('idcards');
    const newCard: IIDCard = {
      _id: crypto.randomUUID(),
      userId: data.userId || '',
      studentId: data.studentId || '',
      studentData: data.studentData || {},
      template: data.template || 'classic-blue',
      theme: data.theme || { primaryColor: '#1e3a8a', accentColor: '#3b82f6', secondaryColor: '#f8fafc' },
      cardLayout: data.cardLayout || 'vertical',
      fontStyle: data.fontStyle || 'modern',
      collegeLogo: data.collegeLogo || '',
      signatureText: data.signatureText || 'Authorized Registrar',
      verificationCode: vCode,
      qrPayload,
      status: data.status || 'Saved',
      cardValidity: data.cardValidity || 'Valid for academic year',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    collection.unshift(newCard);
    docStore.save();
    return newCard;
  },

  async findByIdAndUpdate(id: string, updates: Partial<IIDCard>): Promise<IIDCard | null> {
    if (isMongooseConnected) {
      return await MongoIDCardModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    const collection = docStore.getCollection('idcards');
    const index = collection.findIndex((c: IIDCard) => c._id === id);
    if (index === -1) return null;
    collection[index] = { ...collection[index], ...updates, updatedAt: new Date() };
    docStore.save();
    return collection[index];
  },

  async findByIdAndDelete(id: string): Promise<boolean> {
    if (isMongooseConnected) {
      const res = await MongoIDCardModel.findByIdAndDelete(id);
      return !!res;
    }
    const collection = docStore.getCollection('idcards');
    const index = collection.findIndex((c: IIDCard) => c._id === id);
    if (index === -1) return false;
    collection.splice(index, 1);
    docStore.save();
    return true;
  }
};
