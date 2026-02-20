// Mock data layer representing our future Google Sheets connection

export type StudentStatus = 'Active' | 'PRP';
export type GroupNumber = '1' | '2' | '3';
export type Domain = 'Flutter' | 'MERN' | 'MEAN' | 'Django' | 'Data Science' | 'Cyber Security' | 'Java Spring Boot' | 'Machine Learning' | 'Game Development';

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
    { id: '4', name: 'Bob Williams', groupNumber: '2', batch: 'BCR306', domain: 'MEAN', status: 'PRP' },
    { id: '5', name: 'Charlie Brown', groupNumber: '3', batch: 'BCR306', domain: 'Django', status: 'Active' },
    { id: '6', name: 'Diana Prince', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'PRP' },
    { id: '7', name: 'Bharath', groupNumber: '1', batch: 'BCR306', domain: 'Java Spring Boot', status: 'Active' },
    { id: '8', name: 'Kavya', groupNumber: '1', batch: 'BCR306', domain: 'Cyber Security', status: 'Active' },
    { id: '9', name: 'Sanjay', groupNumber: '2', batch: 'BCR306', domain: 'Machine Learning', status: 'Active' },
    { id: '10', name: 'Priya', groupNumber: '2', batch: 'BCR306', domain: 'Game Development', status: 'Active' },
    { id: '11', name: 'Arun', groupNumber: '3', batch: 'BCR306', domain: 'MERN', status: 'Active' },
    { id: '12', name: 'Megha', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '13', name: 'Vignesh', groupNumber: '1', batch: 'BCR306', domain: 'Django', status: 'Active' },
    { id: '14', name: 'Divya', groupNumber: '1', batch: 'BCR306', domain: 'Data Science', status: 'Active' },
    { id: '15', name: 'Suresh', groupNumber: '2', batch: 'BCR306', domain: 'Cyber Security', status: 'Active' },
    { id: '16', name: 'Anitha', groupNumber: '2', batch: 'BCR306', domain: 'Machine Learning', status: 'Active' },
    { id: '17', name: 'Ravi', groupNumber: '3', batch: 'BCR306', domain: 'Game Development', status: 'Active' },
    { id: '18', name: 'Kiran', groupNumber: '3', batch: 'BCR306', domain: 'MERN', status: 'Active' },
    { id: '19', name: 'Deepa', groupNumber: '1', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '20', name: 'Manoj', groupNumber: '1', batch: 'BCR306', domain: 'Django', status: 'Active' },
    { id: '21', name: 'Sunitha', groupNumber: '2', batch: 'BCR306', domain: 'Data Science', status: 'Active' },
    { id: '22', name: 'Gowtham', groupNumber: '2', batch: 'BCR306', domain: 'Cyber Security', status: 'Active' },
    { id: '23', name: 'Nisha', groupNumber: '3', batch: 'BCR306', domain: 'Machine Learning', status: 'Active' },
    { id: '24', name: 'Sathish', groupNumber: '3', batch: 'BCR306', domain: 'Game Development', status: 'Active' },
    { id: '25', name: 'Latha', groupNumber: '1', batch: 'BCR306', domain: 'MERN', status: 'Active' },
    { id: '26', name: 'Karthik', groupNumber: '1', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '27', name: 'Pooja', groupNumber: '2', batch: 'BCR306', domain: 'Django', status: 'Active' },
    { id: '28', name: 'Sandeep', groupNumber: '2', batch: 'BCR306', domain: 'Data Science', status: 'Active' },
    { id: '29', name: 'Anjali', groupNumber: '3', batch: 'BCR306', domain: 'Cyber Security', status: 'Active' },
    { id: '30', name: 'Ramesh', groupNumber: '3', batch: 'BCR306', domain: 'Machine Learning', status: 'Active' },
    { id: '31', name: 'Shilpa', groupNumber: '1', batch: 'BCR306', domain: 'Game Development', status: 'Active' },
    { id: '32', name: 'Venkatesh', groupNumber: '1', batch: 'BCR306', domain: 'MERN', status: 'Active' },
    { id: '33', name: 'Madhu', groupNumber: '2', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '34', name: 'Suma', groupNumber: '2', batch: 'BCR306', domain: 'Django', status: 'Active' },
    { id: '35', name: 'Naveen', groupNumber: '3', batch: 'BCR306', domain: 'Data Science', status: 'Active' },
    { id: '36', name: 'Kavitha', groupNumber: '3', batch: 'BCR306', domain: 'Cyber Security', status: 'Active' },
    { id: '37', name: 'Srinivas', groupNumber: '1', batch: 'BCR306', domain: 'Machine Learning', status: 'Active' },
    { id: '38', name: 'Lekha', groupNumber: '1', batch: 'BCR306', domain: 'Game Development', status: 'Active' },
    { id: '39', name: 'Pradeep', groupNumber: '2', batch: 'BCR306', domain: 'MERN', status: 'Active' },
    { id: '40', name: 'Sujatha', groupNumber: '2', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '41', name: 'Manish', groupNumber: '3', batch: 'BCR306', domain: 'Django', status: 'Active' },
    { id: '42', name: 'Priya', groupNumber: '3', batch: 'BCR306', domain: 'Data Science', status: 'Active' },
    { id: '43', name: 'Sanjay', groupNumber: '1', batch: 'BCR306', domain: 'Cyber Security', status: 'Active' },
    { id: '44', name: 'Kavya', groupNumber: '1', batch: 'BCR306', domain: 'Machine Learning', status: 'Active' },
    { id: '45', name: 'Bharath', groupNumber: '2', batch: 'BCR306', domain: 'Game Development', status: 'Active' },
    { id: '46', name: 'Diana', groupNumber: '2', batch: 'BCR306', domain: 'MERN', status: 'Active' },
    { id: '47', name: 'Charlie', groupNumber: '3', batch: 'BCR306', domain: 'MEAN', status: 'Active' },
    { id: '48', name: 'Alice', groupNumber: '3', batch: 'BCR306', domain: 'Django', status: 'Active' },
    { id: '49', name: 'Bob', groupNumber: '1', batch: 'BCR306', domain: 'Data Science', status: 'Active' },
    { id: '50', name: 'Jane', groupNumber: '1', batch: 'BCR306', domain: 'Cyber Security', status: 'Active' },
    { id: '51', name: 'John', groupNumber: '2', batch: 'BCR306', domain: 'Machine Learning', status: 'Active' },
    { id: '52', name: 'Smith', groupNumber: '2', batch: 'BCR306', domain: 'Game Development', status: 'Active' },
    { id: '53', name: 'Williams', groupNumber: '3', batch: 'BCR306', domain: 'Java Spring Boot', status: 'Active' },
];

export async function getStudents(): Promise<Student[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
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
