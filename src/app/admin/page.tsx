'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Student, getStudents, addStudent, updateStudent, deleteStudent, Domain, GroupNumber, StudentStatus } from '@/lib/sheets';
import { Button, Input, Select, Label } from '@/components/FormElements';

export default function AdminDashboard() {
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form state for adding/editing a student
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        groupNumber: '1' as GroupNumber,
        batch: 'BCR306',
        domain: 'Flutter' as Domain,
        status: 'Active' as StudentStatus,
    });

    useEffect(() => {
        // Check auth
        const auth = localStorage.getItem('adminAuth');
        if (auth !== 'true') {
            router.push('/admin/login');
            return;
        }

        // Load data
        getStudents().then(data => {
            setStudents(data);
            setIsLoading(false);
        });
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        router.push('/admin/login');
    };

    const handleSaveStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (isEditing) {
            const updated = await updateStudent(isEditing, formData);
            if (updated) {
                setStudents(prev => prev.map(s => s.id === isEditing ? updated : s));
            }
            setIsEditing(null);
        } else {
            const added = await addStudent(formData);
            setStudents(prev => [...prev, added]);
        }

        // Reset form
        setFormData({
            name: '',
            groupNumber: '1',
            batch: 'BCR306',
            domain: 'Flutter',
            status: 'Active',
        });
        setIsLoading(false);
    };

    const handleEdit = (student: Student) => {
        setFormData({
            name: student.name,
            groupNumber: student.groupNumber,
            batch: student.batch,
            domain: student.domain,
            status: student.status,
        });
        setIsEditing(student.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this student?')) return;
        setIsLoading(true);
        await deleteStudent(id);
        setStudents(prev => prev.filter(s => s.id !== id));
        setIsLoading(false);
    };

    if (isLoading && students.length === 0) {
        return <div className="text-center py-10">Loading Admin Dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center pb-4 border-b border-secondary-light">
                <h2 className="text-2xl font-bold text-primary-dark">Admin Dashboard</h2>
                <Button variant="secondary" onClick={handleLogout}>Logout</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="card-container md:col-span-1 h-fit">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                        {isEditing ? 'Edit Student' : 'Add New Student'}
                    </h3>
                    <form onSubmit={handleSaveStudent} className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Student Name"
                            />
                        </div>
                        <div>
                            <Label>Group Number</Label>
                            <Select
                                value={formData.groupNumber}
                                onChange={e => setFormData({ ...formData, groupNumber: e.target.value as GroupNumber })}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </Select>
                        </div>
                        <div>
                            <Label>Batch Prefix</Label>
                            <Input
                                value={formData.batch}
                                onChange={e => setFormData({ ...formData, batch: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label>Domain</Label>
                            <Select
                                value={formData.domain}
                                onChange={e => setFormData({ ...formData, domain: e.target.value as Domain })}
                            >
                                <option value="Flutter">Flutter</option>
                                <option value="MERN">MERN</option>
                                <option value="MEAN">MEAN</option>
                                <option value="Django">Django</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Cyber Security">Cyber Security</option>
                                <option value="Java Spring Boot">Java Spring Boot</option>
                                <option value="Machine Learning">Machine Learning</option>
                                <option value="Game Development">Game Development</option>
                            </Select>
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                            >
                                <option value="Active">Active</option>
                                <option value="PRP">PRP</option>
                            </Select>
                        </div>
                        <div className="pt-2 flex gap-2">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Add Student')}
                            </Button>
                            {isEditing && (
                                <Button type="button" variant="secondary" onClick={() => {
                                    setIsEditing(null);
                                    setFormData({ name: '', groupNumber: '1', batch: 'BCR306', domain: 'Flutter', status: 'Active' });
                                }}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="card-container md:col-span-2">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Student Roster</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-secondary-light/50 text-secondary-dark">
                                <tr>
                                    <th className="px-4 py-2 rounded-tl-lg">Name</th>
                                    <th className="px-4 py-2">Group</th>
                                    <th className="px-4 py-2">Domain</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2 rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className="border-b border-secondary-light/50 hover:bg-secondary-light/20 transition-colors">
                                        <td className="px-4 py-3 font-medium text-foreground">{student.name}</td>
                                        <td className="px-4 py-3 text-secondary-dark">{student.groupNumber}</td>
                                        <td className="px-4 py-3 text-secondary-dark">{student.domain}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${student.status === 'Active' ? 'bg-success-light text-success-dark' : 'bg-secondary-light text-secondary-dark'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 space-x-2">
                                            <button onClick={() => handleEdit(student)} className="text-primary hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(student.id)} className="text-danger hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
