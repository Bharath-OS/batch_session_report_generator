const API_URL = '/api/sheets';

export type StudentStatus = 'Active' | 'N/A';
export type GroupNumber = '1' | '2' | '3';
export type Domain = 'Flutter' | 'MERN' | 'MEAN' | 'Django' | 'Data Science' | 'Cyber Security' | 'Java Spring Boot' | 'Machine Learning' | 'Game Development' | 'DevOps';

export interface Student {
    id: string; // Map from 'Timestamp'
    name: string;
    groupNumber: GroupNumber;
    batch: string;
    domain: Domain;
    status: StudentStatus;
}

// Map Sheet headers to our Student interface
function mapRowToStudent(row: Record<string, unknown>): Student {
    return {
        id: String(row['Timestamp'] || ''),
        name: String(row['Name'] || ''),
        groupNumber: String(row['Group No'] || '1') as GroupNumber,
        batch: String(row['Batch Prefix'] || ''),
        domain: String(row['Domain'] || 'Flutter') as Domain,
        status: String(row['Status'] || 'Active') as StudentStatus,
    };
}

export async function getStudents(): Promise<Student[]> {
    if (!API_URL) return [];
    try {
        const response = await fetch(API_URL);
        const contentType = response.headers.get('content-type');

        if (!response.ok) {
            let errorMessage = `Server Error (${response.status})`;
            try {
                if (contentType && contentType.includes('application/json')) {
                    const errorData = (await response.json()) as { error?: string };
                    console.error('Server Error Details:', errorData);
                    errorMessage = errorData.error || errorMessage;
                } else {
                    const text = await response.text();
                    console.error('Server Error (HTML/Text):', text.substring(0, 500));
                }
            } catch {
                console.error('Failed to parse error response');
            }
            throw new Error(errorMessage);
        }

        if (contentType && contentType.includes('application/json')) {
            const data: unknown = await response.json();
            return Array.isArray(data) ? data.map(row => mapRowToStudent(row as Record<string, unknown>)) : [];
        } else {
            const text = await response.text();
            console.error('Expected JSON but got:', text.substring(0, 500));
            throw new Error('Received non-JSON response from server');
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

export async function addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    if (!API_URL) throw new Error('API URL not configured');

    // TASK 2 VERIFICATION: Simulate a 500 error
    throw new Error('Server Error (500): Failed to add student to roster');
}

export async function updateStudent(id: string, updates: Partial<Omit<Student, 'id'>>): Promise<Student> {
    if (!API_URL) throw new Error('API URL not configured');
    try {
        const payload = {
            action: 'edit',
            timestamp: id,
            ...updates,
            groupNo: updates.groupNumber
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Server Error (${response.status})`);

        return {
            id,
            name: updates.name || '',
            groupNumber: updates.groupNumber || '1',
            batch: updates.batch || '',
            domain: updates.domain || 'Flutter',
            status: updates.status || 'Active'
        };
    } catch (error: any) {
        console.error('Error updating student:', error);
        throw error;
    }
}

export async function deleteStudent(id: string): Promise<boolean> {
    if (!API_URL) throw new Error('API URL not configured');
    try {
        const payload = {
            action: 'delete',
            timestamp: id
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Server Error (${response.status})`);
        return true;
    } catch (error: any) {
        console.error('Error deleting student:', error);
        throw error;
    }
}
