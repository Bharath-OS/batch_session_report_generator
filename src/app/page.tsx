'use client';

import { useState, useEffect } from 'react';
import { getStudents, Student, GroupNumber } from '@/lib/sheets';
import { Button, Input, Select, Label, Textarea } from '@/components/FormElements';
import Modal from '@/components/Modal';

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selection
  const [selectedGroup, setSelectedGroup] = useState<GroupNumber>('1');

  // Form Data
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [trainer, setTrainer] = useState('');
  const [coordinators, setCoordinators] = useState('');
  const [preparedBy, setPreparedBy] = useState('');
  const [overview, setOverview] = useState('');
  const [tldvLink, setTldvLink] = useState('');

  // Attendance
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set());

  // Modal & Final Report Output
  const [showModal, setShowModal] = useState(false);
  const [reportOutput, setReportOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getStudents().then(data => {
      setStudents(data);
      setIsLoading(false);
    });
  }, []);

  // Filter students based on group
  const groupStudents = students.filter(s => s.groupNumber === selectedGroup);
  const activeStudents = groupStudents.filter(s => s.status === 'Active');
  const prpStudents = groupStudents.filter(s => s.status === 'PRP');

  // Reset attendance when group changes
  useEffect(() => {
    setPresentIds(new Set());
  }, [selectedGroup]);

  // Derived state for the two columns
  const presentStudents = activeStudents.filter(s => presentIds.has(s.id));
  const absentStudents = activeStudents.filter(s => !presentIds.has(s.id));

  const toggleAttendance = (id: string) => {
    setPresentIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleInvert = () => {
    setPresentIds(prev => {
      const next = new Set<string>();
      activeStudents.forEach(s => {
        if (!prev.has(s.id)) {
          next.add(s.id);
        }
      });
      return next;
    });
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();

    const presentList = [...presentStudents].sort((a, b) => a.name.localeCompare(b.name));
    const absentList = [...absentStudents].sort((a, b) => a.name.localeCompare(b.name));
    const prpList = [...prpStudents].sort((a, b) => a.name.localeCompare(b.name));

    const [yyyy, mm, dd] = date.split('-');
    const formattedDate = `${dd}-${mm}-${yyyy}`;

    const reportText = `📘 *BCR 306 Session Report* 📘

📌 *Group Number:* Group ${selectedGroup}
📅 *Date:* ${formattedDate}
👨‍🏫 *Trainer Name:* ${trainer}
🧑‍🤝‍🧑 *Coordinators:* ${coordinators}
✍️ *Prepared By:* ${preparedBy}

📝 *Session Overview:*
${overview}

───────────────
✅ *Present:*
${presentList.length > 0 ? presentList.map((s, i) => `${i + 1}. ${s.name}`).join('\n') : 'None'}

❌ *Absent:*
${absentList.length > 0 ? absentList.map((s, i) => `${i + 1}. ${s.name}`).join('\n') : 'None'}

⚪ *N/A:*
${prpList.length > 0 ? prpList.map((s, i) => `${i + 1}. ${s.name}`).join('\n') : 'None'}
───────────────
${tldvLink ? `🔗 *TLDV Link:* ${tldvLink}` : ''}
`;

    setReportOutput(reportText);
    setCopied(false);
    setShowModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-secondary">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading student roster…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      {/* Session Details Card */}
      <div className="card-container">
        <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
          <span className="w-7 h-7 bg-primary-light text-primary rounded-lg flex items-center justify-center text-sm">📋</span>
          Session Details
        </h2>

        <form id="report-form" onSubmit={handleCreateReport} className="space-y-4">
          {/* Group + Date row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Select Group</Label>
              <Select
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value as GroupNumber)}
              >
                <option value="1">Group 1</option>
                <option value="2">Group 2</option>
                <option value="3">Group 3</option>
              </Select>
            </div>

            {/* Modern Date Picker */}
            <div>
              <Label>Date</Label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="input-field pl-10 cursor-pointer font-medium"
                />
              </div>
            </div>
          </div>

          {/* Trainer + Coordinators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Trainer Name</Label>
              <Input
                value={trainer}
                onChange={e => setTrainer(e.target.value)}
                required
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <Label>Coordinators</Label>
              <Input
                value={coordinators}
                onChange={e => setCoordinators(e.target.value)}
                required
                placeholder="e.g. Jane Smith"
              />
            </div>
          </div>

          <div>
            <Label>Prepared By</Label>
            <Input
              value={preparedBy}
              onChange={e => setPreparedBy(e.target.value)}
              required
              placeholder="Your Name"
            />
          </div>

          <div>
            <Label>Session Overview</Label>
            <Textarea
              value={overview}
              onChange={e => setOverview(e.target.value)}
              required
              placeholder="Brief summary of what was covered…"
            />
          </div>

          <div>
            <Label>TLDV Recording Link <span className="font-normal text-secondary">(Optional)</span></Label>
            <Input
              type="url"
              value={tldvLink}
              onChange={e => setTldvLink(e.target.value)}
              placeholder="https://tldv.io/…"
            />
          </div>
        </form>
      </div>

      {/* Attendance Card */}
      <div className="card-container">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="w-7 h-7 bg-primary-light text-primary rounded-lg flex items-center justify-center text-sm">✅</span>
            Attendance
          </h2>
          <button type="button" onClick={handleInvert} className="btn-secondary text-xs px-3 py-1.5">
            🔄 Invert
          </button>
        </div>
        <p className="text-xs text-secondary mb-4">Click a name to toggle between Present and Absent.</p>

        {/* Two-column attendance grid — fixed height with scroll */}
        <div className="grid grid-cols-2 gap-4">
          {/* Present Column */}
          <div className="bg-success-light/30 border border-success-light rounded-xl p-3 flex flex-col">
            <h3 className="font-semibold text-success-dark mb-3 flex items-center justify-between text-sm shrink-0">
              <span>✅ Present</span>
              <span className="text-xs bg-success-light text-success-dark px-2 py-0.5 rounded-full font-bold">{presentStudents.length}</span>
            </h3>
            <ul className="space-y-1.5 overflow-y-auto max-h-56 pr-1 custom-scroll">
              {presentStudents.map(student => (
                <li
                  key={student.id}
                  onClick={() => toggleAttendance(student.id)}
                  className="cursor-pointer bg-white px-3 py-2 rounded-lg text-sm text-foreground shadow-sm hover:shadow-md border border-transparent hover:border-success-light transition-all select-none truncate"
                  title={student.name}
                >
                  {student.name}
                </li>
              ))}
              {presentStudents.length === 0 && (
                <li className="text-xs text-secondary text-center py-6 italic">No one marked present</li>
              )}
            </ul>
          </div>

          {/* Absent Column */}
          <div className="bg-danger-light/30 border border-danger-light rounded-xl p-3 flex flex-col">
            <h3 className="font-semibold text-danger-dark mb-3 flex items-center justify-between text-sm shrink-0">
              <span>❌ Absent</span>
              <span className="text-xs bg-danger-light text-danger-dark px-2 py-0.5 rounded-full font-bold">{absentStudents.length}</span>
            </h3>
            <ul className="space-y-1.5 overflow-y-auto max-h-56 pr-1 custom-scroll">
              {absentStudents.map(student => (
                <li
                  key={student.id}
                  onClick={() => toggleAttendance(student.id)}
                  className="cursor-pointer bg-white px-3 py-2 rounded-lg text-sm text-foreground shadow-sm hover:shadow-md border border-transparent hover:border-danger-light transition-all select-none truncate"
                  title={student.name}
                >
                  {student.name}
                </li>
              ))}
              {absentStudents.length === 0 && (
                <li className="text-xs text-secondary text-center py-6 italic">No one absent</li>
              )}
            </ul>
          </div>
        </div>

        {/* PRP Section */}
        {prpStudents.length > 0 && (
          <div className="mt-4 bg-secondary-light/30 rounded-xl p-3 border border-secondary-light">
            <h3 className="font-semibold text-secondary-dark mb-2 text-xs uppercase tracking-wider">N/A — PRP / Not Active</h3>
            <div className="flex flex-wrap gap-2">
              {prpStudents.map(student => (
                <span key={student.id} className="text-xs bg-white text-secondary-dark px-2.5 py-1 rounded-lg border border-secondary-light shadow-sm">
                  {student.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button type="submit" form="report-form" className="btn-primary w-full text-base py-3.5 rounded-xl">
        Create Report ✨
      </button>

      {/* Report Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Session Report Ready">
        <div className="space-y-4">
          <p className="text-sm text-secondary-dark text-center">
            Review your formatted report below and click Copy to send it in WhatsApp.
          </p>
          <div className="bg-secondary-light/30 rounded-xl p-4 border border-secondary-light max-h-[50vh] overflow-y-auto whitespace-pre-wrap font-mono text-xs text-foreground leading-relaxed">
            {reportOutput}
          </div>
          <Button
            className="w-full relative whitespace-pre flex justify-center items-center gap-2"
            onClick={handleCopy}
            variant={copied ? 'secondary' : 'primary'}
          >
            {copied ? '✅  Copied to Clipboard!' : '📋  Copy Report to Clipboard'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
