import { Request, Response } from 'express';
import { IDCardModel, IIDCard } from '../models/IDCard.js';
import { StudentModel } from '../models/Student.js';
import { AuthRequest } from '../middleware/auth.js';

export async function createIDCard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      studentId,
      studentData,
      template,
      theme,
      cardLayout,
      fontStyle,
      collegeLogo,
      signatureText,
      status,
      cardValidity,
    } = req.body;

    let finalStudentData = studentData;
    let finalStudentId = studentId;

    // If studentId was provided but studentData wasn't fully supplied, populate from Student model
    if (studentId && (!finalStudentData || Object.keys(finalStudentData).length === 0)) {
      const student = await StudentModel.findById(studentId);
      if (student) {
        finalStudentData = student;
      }
    }

    // If studentData was provided but no studentId, create a Student record or use an ephemeral ID
    if (!finalStudentId && finalStudentData?.name) {
      const createdStudent = await StudentModel.create({
        ...finalStudentData,
        userId: req.user?.id || 'guest',
      });
      finalStudentId = createdStudent._id;
      finalStudentData = createdStudent;
    }

    if (!finalStudentData?.name || !finalStudentData?.rollNumber) {
      res.status(400).json({
        success: false,
        message: 'Student name and roll number are required to generate an identity card.',
      });
      return;
    }

    // Generate unique verification code
    const randPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    const yearPart = new Date().getFullYear();
    const verificationCode = `CID-${yearPart}-${randPart}`;

    const hostUrl = process.env.APP_URL || '';
    const verifyUrl = `${hostUrl}/verify/${verificationCode}`;

    const qrPayload = JSON.stringify({
      issuer: 'CampusID Verification Authority',
      code: verificationCode,
      name: finalStudentData.name,
      roll: finalStudentData.rollNumber,
      college: finalStudentData.collegeName,
      department: finalStudentData.department,
      validity: cardValidity || `${finalStudentData.admissionYear || '2024'} - ${finalStudentData.graduationYear || '2028'}`,
      verifyUrl,
    });

    const newCard = await IDCardModel.create({
      userId: req.user?.id || 'guest',
      studentId: finalStudentId || 'student-auto',
      studentData: finalStudentData,
      template: template || 'classic-blue',
      theme: theme || { primaryColor: '#1e3a8a', accentColor: '#3b82f6', secondaryColor: '#f8fafc' },
      cardLayout: cardLayout || 'vertical',
      fontStyle: fontStyle || 'modern',
      collegeLogo: collegeLogo || '',
      signatureText: signatureText || 'Authorized Registrar',
      verificationCode,
      qrPayload,
      status: status || 'Saved',
      cardValidity: cardValidity || `${finalStudentData.admissionYear || '2024'} – ${finalStudentData.graduationYear || '2028'}`,
    });

    res.status(201).json({
      success: true,
      message: 'ID Card generated and saved successfully',
      card: newCard,
    });
  } catch (error) {
    console.error('Error generating ID card:', error);
    res.status(500).json({ success: false, message: 'Server error generating ID card' });
  }
}

export async function getIDCards(req: AuthRequest, res: Response): Promise<void> {
  try {
    const search = req.query.search as string;
    const userId = req.user?.id;
    // If authenticated, filter by user; otherwise return cards matching query or demo list
    const cards = await IDCardModel.find({
      userId: userId ? userId : undefined,
      search,
    });

    res.json({
      success: true,
      count: cards.length,
      cards,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve ID cards' });
  }
}

export async function getIDCardById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const card = await IDCardModel.findById(req.params.id);
    if (!card) {
      res.status(404).json({ success: false, message: 'ID Card not found' });
      return;
    }
    res.json({ success: true, card });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving ID card' });
  }
}

export async function updateIDCard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const updated = await IDCardModel.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'ID Card not found' });
      return;
    }
    res.json({
      success: true,
      message: 'ID Card updated successfully',
      card: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating ID card' });
  }
}

export async function deleteIDCard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const deleted = await IDCardModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'ID Card not found' });
      return;
    }
    res.json({ success: true, message: 'ID Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting ID card' });
  }
}

export async function verifyIDCardByCode(req: Request, res: Response): Promise<void> {
  try {
    const { code } = req.params;
    const card = await IDCardModel.findByVerificationCode(code);
    if (!card) {
      res.status(404).json({
        success: false,
        verified: false,
        message: 'No active student identity card matches this verification code.',
      });
      return;
    }

    // Only expose approved, safe, non-sensitive student information
    const safeData = {
      verified: true,
      verificationCode: card.verificationCode,
      studentName: card.studentData?.name,
      rollNumber: card.studentData?.rollNumber,
      collegeName: card.studentData?.collegeName,
      department: card.studentData?.department,
      course: card.studentData?.course,
      academicYear: card.studentData?.academicYear,
      semester: card.studentData?.semester,
      validity: card.cardValidity,
      photograph: card.studentData?.photograph,
      collegeLogo: card.collegeLogo,
      issuedAt: card.createdAt,
      status: card.status,
    };

    res.json({
      success: true,
      verified: true,
      card: safeData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying ID card' });
  }
}
