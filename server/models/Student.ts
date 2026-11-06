import mongoose, { Schema } from 'mongoose';
import { docStore, isMongooseConnected } from '../config/db.js';
import crypto from 'crypto';

export interface IStudent {
  _id: string;
  userId?: string;
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  photograph: string;
  collegeName: string;
  department: string;
  course: string;
  academicYear: string;
  semester: string;
  admissionYear: string;
  graduationYear: string;
  bloodGroup?: string;
  collegeAddress?: string;
  emergencyContact?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: { type: String, ref: 'User' },
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    photograph: { type: String, default: '' },
    collegeName: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    course: { type: String, required: true, trim: true },
    academicYear: { type: String, required: true },
    semester: { type: String, required: true },
    admissionYear: { type: String, required: true },
    graduationYear: { type: String, required: true },
    bloodGroup: { type: String, default: 'O+' },
    collegeAddress: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
  },
  { timestamps: true }
);

export const MongoStudentModel = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export const StudentModel = {
  async find(query: { userId?: string } = {}): Promise<IStudent[]> {
    if (isMongooseConnected) {
      return await MongoStudentModel.find(query).sort({ updatedAt: -1 }).lean();
    }
    const collection = docStore.getCollection('students');
    if (query.userId) {
      return collection.filter((s: IStudent) => s.userId === query.userId);
    }
    return [...collection];
  },

  async findById(id: string): Promise<IStudent | null> {
    if (isMongooseConnected) {
      return await MongoStudentModel.findById(id).lean();
    }
    const collection = docStore.getCollection('students');
    return collection.find((s: IStudent) => s._id === id) || null;
  },

  async create(data: Partial<IStudent>): Promise<IStudent> {
    if (isMongooseConnected) {
      const doc = await MongoStudentModel.create(data);
      return doc.toObject();
    }
    const collection = docStore.getCollection('students');
    const newStudent: IStudent = {
      _id: crypto.randomUUID(),
      userId: data.userId || '',
      name: data.name || '',
      rollNumber: data.rollNumber || '',
      email: (data.email || '').toLowerCase().trim(),
      phone: data.phone || '',
      dateOfBirth: data.dateOfBirth || '',
      gender: data.gender || 'Not Specified',
      photograph: data.photograph || '',
      collegeName: data.collegeName || '',
      department: data.department || '',
      course: data.course || '',
      academicYear: data.academicYear || '',
      semester: data.semester || '1st Semester',
      admissionYear: data.admissionYear || '',
      graduationYear: data.graduationYear || '',
      bloodGroup: data.bloodGroup || 'O+',
      collegeAddress: data.collegeAddress || '',
      emergencyContact: data.emergencyContact || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    collection.unshift(newStudent);
    docStore.save();
    return newStudent;
  },

  async findByIdAndUpdate(id: string, updates: Partial<IStudent>): Promise<IStudent | null> {
    if (isMongooseConnected) {
      return await MongoStudentModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    const collection = docStore.getCollection('students');
    const index = collection.findIndex((s: IStudent) => s._id === id);
    if (index === -1) return null;
    collection[index] = { ...collection[index], ...updates, updatedAt: new Date() };
    docStore.save();
    return collection[index];
  },

  async findByIdAndDelete(id: string): Promise<boolean> {
    if (isMongooseConnected) {
      const res = await MongoStudentModel.findByIdAndDelete(id);
      return !!res;
    }
    const collection = docStore.getCollection('students');
    const index = collection.findIndex((s: IStudent) => s._id === id);
    if (index === -1) return false;
    collection.splice(index, 1);
    docStore.save();
    return true;
  }
};
