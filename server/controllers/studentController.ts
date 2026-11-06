import { Response } from 'express';
import { StudentModel } from '../models/Student.js';
import { AuthRequest } from '../middleware/auth.js';

export async function createStudent(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      name,
      rollNumber,
      email,
      phone,
      dateOfBirth,
      gender,
      photograph,
      collegeName,
      department,
      course,
      academicYear,
      semester,
      admissionYear,
      graduationYear,
      bloodGroup,
      collegeAddress,
      emergencyContact,
    } = req.body;

    if (!name || !rollNumber || !email || !collegeName || !department || !course) {
      res.status(400).json({
        success: false,
        message: 'Missing mandatory fields: Name, Roll Number, Email, College, Department, and Course are required.',
      });
      return;
    }

    const newStudent = await StudentModel.create({
      userId: req.user?.id || 'guest',
      name,
      rollNumber,
      email,
      phone: phone || '',
      dateOfBirth: dateOfBirth || '',
      gender: gender || 'Not Specified',
      photograph: photograph || '',
      collegeName,
      department,
      course,
      academicYear: academicYear || '2025-2026',
      semester: semester || 'Semester 1',
      admissionYear: admissionYear || '2024',
      graduationYear: graduationYear || '2028',
      bloodGroup: bloodGroup || 'O+',
      collegeAddress: collegeAddress || '',
      emergencyContact: emergencyContact || '',
    });

    res.status(201).json({
      success: true,
      message: 'Student record saved successfully',
      student: newStudent,
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ success: false, message: 'Server error saving student record' });
  }
}

export async function getStudents(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const students = await StudentModel.find(userId ? { userId } : {});
    res.json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch student records' });
  }
}

export async function getStudentById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) {
      res.status(404).json({ success: false, message: 'Student record not found' });
      return;
    }
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving student record' });
  }
}

export async function updateStudent(req: AuthRequest, res: Response): Promise<void> {
  try {
    const updated = await StudentModel.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Student record not found' });
      return;
    }
    res.json({
      success: true,
      message: 'Student record updated successfully',
      student: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating student record' });
  }
}

export async function deleteStudent(req: AuthRequest, res: Response): Promise<void> {
  try {
    const deleted = await StudentModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Student record not found' });
      return;
    }
    res.json({ success: true, message: 'Student record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting student record' });
  }
}
