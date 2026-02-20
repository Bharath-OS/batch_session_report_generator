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

    // Sort students alphabetically for the report
    const presentList = [...presentStudents].sort((a, b) => a.name.localeCompare(b.name));
    const absentList = [...absentStudents].sort((a, b) => a.name.localeCompare(b.name));
    const prpList = [...prpStudents].sort((a, b) => a.name.localeCompare(b.name));

    // Construct the WhatsApp text block
    const reportText = `📘 *BCR 306 Session Report* 📘

📌 *Group Number:* Group ${selectedGroup}
📅 *Date:* ${date}
👨‍🏫 *Trainer Name:* ${trainer}
🧑‍🤝‍🧑 *Coordinators:* ${coordinators}

📝 *Session Overview:*
${overview}

${tldvLink ? `🔗 *TLDV Link:* ${tldvLink}\n` : ''}
───────────────
✅ *Present:*
${presentList.length > 0 ? presentList.map((s, i) => `${i + 1}. ${s.name} (${s.domain})`).join('\n') : 'None'}

❌ *Absent:*
${absentList.length > 0 ? absentList.map((s, i) => `${i + 1}. ${s.name} (${s.domain})`).join('\n') : 'None'}

⚪ *N/A (PRP):*
${prpList.length > 0 ? prpList.map((s, i) => `${i + 1}. ${s.name}`).join('\n') : 'None'}
───────────────
🤝 *Prepared By:* ${preparedBy}
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
    return <div className="text-center py-10">Loading student roster...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card-container">
        <h2 className="text-xl font-bold text-primary-dark mb-4 border-b border-light/50 pb-2">Session Details</h2>

        <form id="report-form" onSubmit={handleCreateReport} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
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

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

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

          <div>
            <Label>Prepared By</Label>
            <Input
              value={preparedBy}
              onChange={e => setPreparedBy(e.target.value)}
              required
              placeholder="Your Name"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Session Overview</Label>
            <Textarea
              value={overview}
              onChange={e => setOverview(e.target.value)}
              required
              placeholder="Brief summary of what was covered..."
            />
          </div>

          <div className="md:col-span-2 border-b border-secondary-light/50 pb-4 mb-2">
            <Label>TLDV Recording Link (Optional)</Label>
            <Input
              type="url"
              value={tldvLink}
              onChange={e => setTldvLink(e.target.value)}
              placeholder="https://tldv.io/..."
            />
          </div>
        </form>
      </div>

      <div className="card-container">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary-dark">Attendance Selection</h2>
          <Button type="button" variant="secondary" onClick={handleInvert} className="text-xs px-3 py-1.5">
            🔄 Invert Selection
          </Button>
        </div>

        <p className="text-sm text-secondary-dark mb-4">Click on a name to move them between Present and Absent columns.</p>

        <div className="grid grid-cols-2 gap-4">
          {/* Present Column */}
          <div className="bg-success-light/30 border border-success-light rounded-xl p-3 min-h-[200px]">
            <h3 className="font-semibold text-success-dark mb-3 flex items-center justify-between">
              <span>Present ✅</span>
              <span className="text-xs bg-success-light px-2 py-0.5 rounded-full">{presentStudents.length}</span>
            </h3>
            <ul className="space-y-1.5">
              {presentStudents.map(student => (
                <li
                  key={student.id}
                  onClick={() => toggleAttendance(student.id)}
                  className="cursor-pointer bg-white px-3 py-2 rounded-lg text-sm text-foreground shadow-sm hover:shadow-md hover:border-success-light border border-transparent transition-all select-none"
                >
                  {student.name}
                </li>
              ))}
              {presentStudents.length === 0 && (
                <li className="text-sm text-secondary-dark text-center py-4 italic">No one present</li>
              )}
            </ul>
          </div>

          {/* Absent Column */}
          <div className="bg-danger-light/30 border border-danger-light rounded-xl p-3 min-h-[200px]">
            <h3 className="font-semibold text-danger-dark mb-3 flex items-center justify-between">
              <span>Absent ❌</span>
              <span className="text-xs bg-danger-light px-2 py-0.5 rounded-full">{absentStudents.length}</span>
            </h3>
            <ul className="space-y-1.5">
              {absentStudents.map(student => (
                <li
                  key={student.id}
                  onClick={() => toggleAttendance(student.id)}
                  className="cursor-pointer bg-white px-3 py-2 rounded-lg text-sm text-foreground shadow-sm hover:shadow-md hover:border-danger-light border border-transparent transition-all select-none"
                >
                  {student.name}
                </li>
              ))}
              {absentStudents.length === 0 && (
                <li className="text-sm text-secondary-dark text-center py-4 italic">No one absent</li>
              )}
            </ul>
          </div>
        </div>

        {/* PRP Section (Read only) */}
        {prpStudents.length > 0 && (
          <div className="mt-6 bg-secondary-light/30 rounded-xl p-3 border border-secondary-light">
            <h3 className="font-semibold text-secondary-dark mb-2 text-sm">N/A (PRP / Not Active)</h3>
            <div className="flex flex-wrap gap-2">
              {prpStudents.map(student => (
                <span key={student.id} className="text-xs bg-white text-secondary-dark px-2.5 py-1 rounded border border-secondary-light shadow-sm">
                  {student.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2">
        <Button type="submit" form="report-form" className="w-full text-lg py-3">
          Generate Report
        </Button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Session Report Ready">
        <div className="space-y-4">
          <p className="text-sm text-secondary-dark text-center">
            Review your formatted report below and click Copy to send it in WhatsApp.
          </p>
          <div className="bg-secondary-light/30 rounded-xl p-4 border border-secondary-light max-h-[50vh] overflow-y-auto whitespace-pre-wrap font-sans text-sm text-foreground">
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
