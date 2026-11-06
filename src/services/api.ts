import { StudentData, IDCardRecord, UserProfile, VerificationResult } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('campusid_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(name: string, email: string, password: string, collegeName?: string): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, collegeName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getMe(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
    return data.user;
  },

  // Students
  async createStudent(student: Partial<StudentData>): Promise<StudentData> {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(student),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create student');
    return data.student;
  },

  async getStudents(): Promise<StudentData[]> {
    const res = await fetch(`${API_BASE}/students`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch students');
    return data.students || [];
  },

  // ID Cards
  async getIDCards(search?: string): Promise<IDCardRecord[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`${API_BASE}/idcards${query}`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch ID cards');
    return data.cards || [];
  },

  async getIDCardById(id: string): Promise<IDCardRecord> {
    const res = await fetch(`${API_BASE}/idcards/${id}`, {
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch ID card');
    return data.card;
  },

  async createIDCard(payload: Partial<IDCardRecord>): Promise<IDCardRecord> {
    const res = await fetch(`${API_BASE}/idcards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create ID card');
    return data.card;
  },

  async updateIDCard(id: string, updates: Partial<IDCardRecord>): Promise<IDCardRecord> {
    const res = await fetch(`${API_BASE}/idcards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update ID card');
    return data.card;
  },

  async deleteIDCard(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/idcards/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete ID card');
  },

  // Verification API
  async verifyCode(code: string): Promise<VerificationResult> {
    const res = await fetch(`${API_BASE}/idcards/verify/${encodeURIComponent(code)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Verification failed');
    return data.card;
  },

  // Upload image via Multer
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Image upload failed');
    return data.url;
  },
};
