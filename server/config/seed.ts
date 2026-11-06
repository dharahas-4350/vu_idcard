import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { StudentModel } from '../models/Student.js';
import { IDCardModel } from '../models/IDCard.js';

export async function seedDemoData() {
  try {
    const existingCards = await IDCardModel.find();
    if (existingCards.length > 0) {
      return; // already seeded or has data
    }

    console.log('Seeding initial CampusID demo data...');

    // 1. Seed demo user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const user = await UserModel.create({
      name: 'Maya Lin',
      email: 'student@campusid.edu',
      password: hashedPassword,
      role: 'student',
      collegeName: 'Stanford Institute of Technology',
    });

    // 2. Seed demo student
    const student1 = await StudentModel.create({
      userId: user._id,
      name: 'Maya Lin',
      rollNumber: 'CS-2024-0482',
      email: 'maya.lin@stanford.edu',
      phone: '+1 (555) 234-8901',
      dateOfBirth: '2004-06-15',
      gender: 'Female',
      photograph: '/src/assets/images/student_portrait_avatar_1793772629050.jpg',
      collegeName: 'Stanford Institute of Technology',
      department: 'Computer Science & Engineering',
      course: 'Bachelor of Science (B.S.) in Computer Science',
      academicYear: '2025-2026',
      semester: 'Semester 4',
      admissionYear: '2024',
      graduationYear: '2028',
      bloodGroup: 'O+',
      collegeAddress: '450 Jane Stanford Way, Stanford, CA 94305',
      emergencyContact: '+1 (555) 987-6543 (Parent)',
    });

    // 3. Seed demo ID Card 1 (Classic Blue)
    const cardCode1 = 'CID-2026-8942A';
    const hostUrl = process.env.APP_URL || '';
    await IDCardModel.create({
      userId: user._id,
      studentId: student1._id,
      studentData: student1,
      template: 'classic-blue',
      theme: {
        primaryColor: '#1e3a8a',
        accentColor: '#3b82f6',
        secondaryColor: '#f0f9ff',
      },
      cardLayout: 'vertical',
      fontStyle: 'modern',
      collegeLogo: '/src/assets/images/university_crest_logo_1793772629151.jpg',
      signatureText: 'Dean of Academic Affairs',
      verificationCode: cardCode1,
      qrPayload: JSON.stringify({
        issuer: 'CampusID Verification Authority',
        code: cardCode1,
        name: student1.name,
        roll: student1.rollNumber,
        college: student1.collegeName,
        department: student1.department,
        validity: '2024 – 2028',
        verifyUrl: `${hostUrl}/verify/${cardCode1}`,
      }),
      status: 'Saved',
      cardValidity: '2024 – 2028',
    });

    // 4. Seed demo ID Card 2 (Modern Purple)
    const student2 = await StudentModel.create({
      userId: user._id,
      name: 'Alexander Chen',
      rollNumber: 'ENG-2023-1109',
      email: 'a.chen@campusid.edu',
      phone: '+1 (555) 412-9988',
      dateOfBirth: '2003-11-20',
      gender: 'Male',
      photograph: '',
      collegeName: 'Metropolitan University of Technology',
      department: 'Robotics & Automation',
      course: 'M.Tech in Autonomous Systems',
      academicYear: '2025-2026',
      semester: 'Semester 2',
      admissionYear: '2025',
      graduationYear: '2027',
      bloodGroup: 'B+',
      collegeAddress: '88 Tech Boulevard, Innovation District',
      emergencyContact: '+1 (555) 332-1100',
    });

    const cardCode2 = 'CID-2026-4417B';
    await IDCardModel.create({
      userId: user._id,
      studentId: student2._id,
      studentData: student2,
      template: 'modern-purple',
      theme: {
        primaryColor: '#581c87',
        accentColor: '#8b5cf6',
        secondaryColor: '#faf5ff',
      },
      cardLayout: 'vertical',
      fontStyle: 'geometric',
      collegeLogo: '/src/assets/images/university_crest_logo_1793772629151.jpg',
      signatureText: 'Registrar General',
      verificationCode: cardCode2,
      qrPayload: JSON.stringify({
        issuer: 'CampusID Verification Authority',
        code: cardCode2,
        name: student2.name,
        roll: student2.rollNumber,
        college: student2.collegeName,
        department: student2.department,
        validity: '2025 – 2027',
        verifyUrl: `${hostUrl}/verify/${cardCode2}`,
      }),
      status: 'Generated',
      cardValidity: '2025 – 2027',
    });

    console.log('CampusID demo data seeded successfully.');
  } catch (err) {
    console.error('Error seeding demo data:', err);
  }
}
