const API_URL = '/api/sheets';

export type StudentStatus = 'Active' | 'PRP';
export type GroupNumber = '1' | '2' | '3';
export type Domain = 'Flutter' | 'MERN' | 'MEAN' | 'Django' | 'Data Science' | 'UI/UX' | 'Cyber Security';

export interface Student {
    id: string; // Map from 'Timestamp'
    name: string;
    groupNumber: GroupNumber;
    batch: string;
    domain: Domain;
    status: StudentStatus;
}

// Map Sheet headers to our Student interface
function mapRowToStudent(row: any): Student {
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
                    const errorData = await response.json();
                    console.error('Server Error Details:', errorData);
                    errorMessage = errorData.error || errorMessage;
                } else {
                    const text = await response.text();
                    console.error('Server Error (HTML/Text):', text.substring(0, 500));
                }
            } catch (e) {
                console.error('Failed to parse error response');
            }
            throw new Error(errorMessage);
        }

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return Array.isArray(data) ? data.map(mapRowToStudent) : [];
        } else {
            const text = await response.text();
            console.error('Expected JSON but got:', text.substring(0, 500));
            throw new Error('Received non-JSON response from server');
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}

export async function addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    if (!API_URL) throw new Error('API URL not configured');

    const payload = {
        action: 'add',
        name: student.name,
        groupNo: student.groupNumber,
        batchPrefix: student.batch,
        domain: student.domain,
        status: student.status
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to add student');

    // Since add doesn't return the new object with timestamp, we might need to re-fetch
    // Or we can just return a temporary object. But let's assume we re-fetch in the UI.
    return { ...student, id: new Date().toISOString() };
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student | null> {
    if (!API_URL) throw new Error('API URL not configured');

    const payload = {
        action: 'edit',
        timestamp: id,
        name: updates.name,
        groupNo: updates.groupNumber,
        batchPrefix: updates.batch,
        domain: updates.domain,
        status: updates.status
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (!response.ok) return null;

        const result = await response.json();
        // The proxy returns { message: "...", sentBody: ... }
        if (result.message !== 'Success') {
            console.error('Update failed:', result.message);
            return null;
        }

        return { id, ...updates } as Student;
    } catch (e) {
        console.error('Update error:', e);
        return null;
    }
}

export async function deleteStudent(id: string): Promise<boolean> {
    if (!API_URL) throw new Error('API URL not configured');

    const payload = {
        action: 'delete',
        timestamp: id,
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    return response.ok;
}
