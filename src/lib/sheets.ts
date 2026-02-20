// Mock data layer representing our future Google Sheets connection

export type StudentStatus = 'Active' | 'PRP';
export type GroupNumber = '1' | '2' | '3';
export type Domain = 'Flutter' | 'MERN' | 'MEAN' | 'Django' | 'Data Science' | 'UI/UX' | 'Cyber Security';

export interface Student {
    id: string; // Used internally, e.g., row number
    name: string;
    groupNumber: GroupNumber;
    batch: string;
    domain: Domain;
    status: StudentStatus;
}

// Initial Mock Data
let mockStudents: Student[] = [
    { id: '1', name: 'John Doe', groupNumber: '1', batch: 'BCR306', domain: 'MERN', status: 'Active' },
    { id: '2', name: 'Jane Smith', groupNumber: '1', batch: 'BCR306', domain: 'Flutter', status: 'Active' },
    { id: '3', name: 'Alice Johnson', groupNumber: '2', batch: 'BCR306', domain: 'Data Science', status: 'Active' },
    { id: '4', name: 'Bob Williams', groupNumber: '2', batch: 'BCR306', domain: 'UI/UX', status: 'PRP' },
    { id: '5', name: 'Charlie Brown', groupNumber: '3', batch: 'BCR306', domain: 'Django', status: 'Active' },
    { id: '6', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '7', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '8', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '9', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '10', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '11', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '12', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '13', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '14', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '15', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '16', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '17', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '18', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '19', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '20', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '21', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '22', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '23', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '24', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '25', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '26', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '27', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '28', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '29', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '30', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },

];

export async function getStudents(): Promise<Student[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockStudents];
}

export async function addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStudent: Student = {
        ...student,
        id: Date.now().toString(),
    };
    mockStudents.push(newStudent);
    return newStudent;
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStudents.findIndex(s => s.id === id);
    if (index === -1) return null;

    mockStudents[index] = { ...mockStudents[index], ...updates };
    return mockStudents[index];
}

export async function deleteStudent(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const initialLength = mockStudents.length;
    mockStudents = mockStudents.filter(s => s.id !== id);
    return mockStudents.length < initialLength;
}
