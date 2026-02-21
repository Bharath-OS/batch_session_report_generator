'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Student,
    getStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    Domain,
    GroupNumber,
    StudentStatus,
} from '@/lib/sheets';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const EditIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const DeleteIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const FilterIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

const ChevronIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

// ─── Types & Constants ────────────────────────────────────────────────────────
const emptyForm = {
    name: '',
    groupNumber: '1' as GroupNumber,
    batch: 'BCR306',
    domain: 'Flutter' as Domain,
    status: 'Active' as StudentStatus,
};

const DOMAINS: Domain[] = ['Flutter', 'MERN', 'MEAN', 'Django', 'Data Science', 'Cyber Security', 'Java Spring Boot', 'Machine Learning', 'Game Development', 'DevOps'];
const GROUPS: GroupNumber[] = ['1', '2', '3'];
const STATUSES: StudentStatus[] = ['Active', 'N/A'];

type FormErrors = Partial<Record<'name' | 'batch', string>>;

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, type = 'success', onDone }: { message: string; type?: 'success' | 'danger'; onDone: () => void }) {
    const [exiting, setExiting] = useState(false);
    useEffect(() => {
        const hide = setTimeout(() => setExiting(true), 2800);
        const done = setTimeout(onDone, 3200);
        return () => { clearTimeout(hide); clearTimeout(done); };
    }, [onDone]);
    return (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold w-max max-w-xs bg-foreground text-white border border-white/10 ${exiting ? 'toast-exit' : 'toast-enter'} ${type === 'danger' ? 'bg-danger border-danger-dark' : ''}`}>
            {type === 'success' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
                <DeleteIcon />
            )}
            {message}
        </div>
    );
}

// ─── Filter Dropdown ──────────────────────────────────────────────────────────
function FilterDropdown<T extends string>({
    label, options, value, onChange,
}: { label: string; options: T[]; value: T | 'all'; onChange: (v: T | 'all') => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    const active = value !== 'all';
    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${active
                    ? 'bg-primary text-white border-primary-dark shadow-sm'
                    : 'bg-white text-secondary-dark border-secondary/20 hover:border-secondary/40 hover:bg-secondary-light'
                    }`}
            >
                <FilterIcon /> {label}{active ? `: ${value}` : ''} <ChevronIcon />
            </button>
            {open && (
                <div className="absolute top-full mt-1.5 left-0 bg-white border border-secondary-light rounded-xl shadow-xl z-50 overflow-hidden min-w-[120px]">
                    <button
                        onClick={() => { onChange('all'); setOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-secondary-light transition-colors ${value === 'all' ? 'text-primary font-semibold' : 'text-secondary-dark'}`}
                    >
                        All
                    </button>
                    {options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-secondary-light transition-colors ${value === opt ? 'text-primary font-semibold bg-primary-light/50' : 'text-secondary-dark'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({ student, onConfirm, onCancel, isDeleting }: {
    student: Student; onConfirm: () => void; onCancel: () => void; isDeleting: boolean;
}) {
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [onCancel]);
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-danger-light flex items-center justify-center text-danger shrink-0">
                        <DeleteIcon />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-foreground">Remove Student</h3>
                        <p className="text-sm text-secondary mt-1">
                            Are you sure you want to remove <span className="font-semibold text-foreground">{student.name}</span> from the roster? This action cannot be undone.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onCancel} className="btn-secondary flex-1 text-sm py-2">Cancel</button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 bg-danger hover:bg-danger-dark text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-60"
                    >
                        {isDeleting ? 'Removing…' : 'Yes, Remove'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Student Form Modal ───────────────────────────────────────────────────────
function StudentFormModal({ isOpen, onClose, onSave, editStudent, isSaving }: {
    isOpen: boolean; onClose: () => void;
    onSave: (data: typeof emptyForm) => Promise<void>;
    editStudent: Student | null; isSaving: boolean;
}) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [errorBanner, setErrorBanner] = useState('');
    const nameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        setForm(editStudent
            ? { name: editStudent.name, groupNumber: editStudent.groupNumber, batch: editStudent.batch, domain: editStudent.domain, status: editStudent.status }
            : emptyForm);
        setErrors({}); setErrorBanner('');
        setTimeout(() => nameRef.current?.focus(), 60);
    }, [isOpen, editStudent]);

    useEffect(() => {
        if (!isOpen) return;
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [isOpen, onClose]);

    useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);

    const validate = () => {
        const e: FormErrors = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.batch.trim()) e.batch = 'Batch Prefix is required';
        setErrors(e);
        if (Object.keys(e).length) { setErrorBanner(Object.values(e)[0] as string); setTimeout(() => setErrorBanner(''), 3500); return false; }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!validate()) return; await onSave(form); };

    if (!isOpen) return null;

    const fc = (f: keyof FormErrors) => `input-field${errors[f] ? ' input-error' : ''}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col" role="dialog" aria-modal="true">
                {/* Header */}
                <div className="px-6 py-4 border-b border-secondary-light flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-foreground">{editStudent ? 'Edit Student' : 'Add New Student'}</h2>
                        <p className="text-xs text-secondary mt-0.5">{editStudent ? 'Update the student information below' : 'Fill in the details to add to the roster'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-secondary hover:text-foreground hover:bg-secondary-light transition-all"><XIcon /></button>
                </div>

                {/* Error banner */}
                {errorBanner && (
                    <div className="mx-6 mt-4 flex items-center gap-2 bg-danger-light border border-danger/20 text-danger-dark text-sm px-4 py-2.5 rounded-xl">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {errorBanner}
                    </div>
                )}

                {/* Form body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto">
                    <div>
                        <label className="label-text">Name</label>
                        <input ref={nameRef} value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                            placeholder="Student Name" className={fc('name')} />
                        {errors.name && <p className="mt-1 text-xs text-danger">⚠ {errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label-text">Group</label>
                            <select value={form.groupNumber} onChange={e => setForm(p => ({ ...p, groupNumber: e.target.value as GroupNumber }))} className="input-field appearance-none cursor-pointer">
                                {GROUPS.map(g => <option key={g} value={g}>Group {g}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label-text">Batch Prefix</label>
                            <input value={form.batch} onChange={e => { setForm(p => ({ ...p, batch: e.target.value })); setErrors(p => ({ ...p, batch: '' })); }}
                                placeholder="e.g. BCR306" className={fc('batch')} />
                            {errors.batch && <p className="mt-1 text-xs text-danger">⚠ {errors.batch}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="label-text">Domain</label>
                        <select value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value as Domain }))} className="input-field appearance-none cursor-pointer">
                            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Status</label>
                        <div className="flex gap-3 mt-1">
                            {STATUSES.map(s => (
                                <label key={s} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-semibold select-none ${form.status === s
                                    ? s === 'Active' ? 'bg-success-light border-success text-success-dark' : 'bg-secondary-light border-secondary text-secondary-dark'
                                    : 'border-secondary-light text-secondary hover:border-secondary/40'}`}>
                                    <input type="radio" name="status" value={s} checked={form.status === s} onChange={() => setForm(p => ({ ...p, status: s }))} className="sr-only" />
                                    {s === 'Active' ? '●' : '◌'} {s}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-secondary-light">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 text-sm">Cancel</button>
                        <button type="submit" disabled={isSaving} className="btn-primary flex-1 text-sm">
                            {isSaving ? 'Saving…' : editStudent ? 'Save Changes' : 'Add Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const router = useRouter();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Modals
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Student | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

    // Toast
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'danger' } | null>(null);

    // Filters
    const [filterGroup, setFilterGroup] = useState<GroupNumber | 'all'>('all');
    const [filterDomain, setFilterDomain] = useState<Domain | 'all'>('all');
    const [filterStatus, setFilterStatus] = useState<StudentStatus | 'all'>('all');
    const [filterBatch, setFilterBatch] = useState<string | 'all'>('all');

    useEffect(() => {
        const auth = localStorage.getItem('adminAuth');
        if (auth !== 'true') { router.push('/admin/login'); return; }
        getStudents().then(data => { setStudents(data); setIsLoading(false); });
    }, [router]);

    const lastUpdated = students.length > 0
        ? new Date(Math.max(...students.map(s => {
            const d = new Date(s.id);
            return isNaN(d.getTime()) ? 0 : d.getTime();
        }))).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
        : 'None';

    const handleLogout = () => { localStorage.removeItem('adminAuth'); router.push('/admin/login'); };

    // Unique batch values for filter
    const allBatches = [...new Set(students.map(s => s.batch))];

    // Filtered list
    const filtered = students.filter(s =>
        (filterGroup === 'all' || s.groupNumber === filterGroup) &&
        (filterDomain === 'all' || s.domain === filterDomain) &&
        (filterStatus === 'all' || s.status === filterStatus) &&
        (filterBatch === 'all' || s.batch === filterBatch)
    );

    const hasFilters = filterGroup !== 'all' || filterDomain !== 'all' || filterStatus !== 'all' || filterBatch !== 'all';
    const clearFilters = () => { setFilterGroup('all'); setFilterDomain('all'); setFilterStatus('all'); setFilterBatch('all'); };

    const showToast = (msg: string, type: 'success' | 'danger' = 'success') => setToast({ msg, type });

    const handleSave = async (form: typeof emptyForm) => {
        setIsSaving(true);
        if (editTarget) {
            const updated = await updateStudent(editTarget.id, form);
            if (updated) setStudents(prev => prev.map(s => s.id === editTarget.id ? updated : s));
            showToast(`${form.name} has been updated`);
        } else {
            const added = await addStudent(form);
            setStudents(prev => [...prev, added]);
            showToast(`${form.name} is added to the list`);
        }
        setIsSaving(false);
        setFormOpen(false);
        setEditTarget(null);
    };

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        await deleteStudent(deleteTarget.id);
        const name = deleteTarget.name;
        setStudents(prev => prev.filter(s => s.id !== deleteTarget.id));
        setDeleteTarget(null);
        setIsDeleting(false);
        showToast(`${name} has been removed from the roster`, 'danger');
    }, [deleteTarget]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-3 text-secondary">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Loading dashboard…</span>
                </div>
            </div>
        );
    }

    return (
        <>
            {toast && <Toast key={toast.msg + Date.now()} message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

            <StudentFormModal
                isOpen={formOpen}
                onClose={() => { setFormOpen(false); setEditTarget(null); }}
                onSave={handleSave}
                editStudent={editTarget}
                isSaving={isSaving}
            />

            {deleteTarget && (
                <DeleteConfirmModal
                    student={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    isDeleting={isDeleting}
                />
            )}

            <div className="space-y-1">
                {/* Page title */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Admin Dashboard</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <h3 className="text-base font-semibold text-secondary">All Students</h3>
                            <span className="text-[10px] bg-primary/10 text-primary-dark px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                                Last Updated: {lastUpdated}
                            </span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn-secondary text-sm shrink-0 mt-1">Logout</button>
                </div>

                {/* Card */}
                <div className="card-container !p-0 overflow-hidden">
                    {/* Toolbar */}
                    <div className="px-5 py-3.5 border-b border-secondary-light/70 flex flex-wrap items-center gap-2">
                        {/* Filter label */}
                        <span className="text-xs font-semibold text-secondary uppercase tracking-wider mr-1">Filter:</span>

                        <FilterDropdown label="Group" options={GROUPS} value={filterGroup} onChange={setFilterGroup} />
                        <FilterDropdown label="Domain" options={DOMAINS} value={filterDomain} onChange={setFilterDomain} />
                        <FilterDropdown label="Status" options={STATUSES} value={filterStatus} onChange={setFilterStatus} />
                        <FilterDropdown<string> label="Batch" options={allBatches} value={filterBatch} onChange={setFilterBatch} />

                        {hasFilters && (
                            <button onClick={clearFilters} className="text-xs text-secondary hover:text-foreground underline underline-offset-2 transition-colors ml-1">
                                Clear all
                            </button>
                        )}

                        <div className="flex-1" />

                        {/* Count badge */}
                        <span className="text-xs text-secondary bg-secondary-light px-3 py-1 rounded-full font-medium">
                            {filtered.length} / {students.length}
                        </span>

                        {/* Add button */}
                        <button
                            onClick={() => { setEditTarget(null); setFormOpen(true); }}
                            className="btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5"
                        >
                            <PlusIcon /> Add Student
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-secondary-light/40 text-secondary text-xs uppercase tracking-wider border-b border-secondary-light/50">
                                    <th className="px-5 py-3 text-left font-semibold w-10">#</th>
                                    <th className="px-5 py-3 text-left font-semibold">Name</th>
                                    <th className="px-5 py-3 text-left font-semibold">Group</th>
                                    <th className="px-5 py-3 text-left font-semibold">Batch</th>
                                    <th className="px-5 py-3 text-left font-semibold">Domain</th>
                                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                                    <th className="px-5 py-3 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-light/40">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-16 text-secondary text-sm">
                                            {hasFilters ? 'No students match the current filters.' : 'No students in the roster yet.'}
                                        </td>
                                    </tr>
                                ) : filtered.map((student, idx) => (
                                    <tr key={student.id} className="hover:bg-secondary-light/20 transition-colors">
                                        <td className="px-5 py-3 text-secondary text-xs">{idx + 1}</td>
                                        <td className="px-5 py-3 font-semibold text-foreground">{student.name}</td>
                                        <td className="px-5 py-3">
                                            <span className="inline-flex items-center justify-center w-7 h-7 bg-primary-light text-primary-dark rounded-lg text-xs font-bold">
                                                {student.groupNumber}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-secondary-dark">{student.batch}</td>
                                        <td className="px-5 py-3 text-secondary-dark">{student.domain}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${student.status === 'Active' ? 'bg-success-light text-success-dark' : 'bg-secondary-light text-secondary-dark'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`} />
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => { setEditTarget(student); setFormOpen(true); }}
                                                    className="icon-btn-edit" title="Edit student"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(student)}
                                                    className="icon-btn-delete" title="Remove student"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
