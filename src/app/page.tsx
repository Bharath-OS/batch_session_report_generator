'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { getStudents, Student, GroupNumber } from '@/lib/sheets';
import { Input, Select, Label, Textarea } from '@/components/FormElements';
import Toast from '@/components/Toast';

function buildReportText(params: {
  selectedGroup: GroupNumber;
  date: string;
  trainer: string;
  coordinators: string;
  preparedBy: string;
  overview: string;
  presentStudents: Student[];
  absentStudents: Student[];
  naStudents: Student[];
  tldvLink: string;
}): string {
  const { selectedGroup, date, trainer, coordinators, preparedBy, overview, presentStudents, absentStudents, naStudents, tldvLink } = params;

  const presentList = [...presentStudents].sort((a, b) => a.name.localeCompare(b.name));
  const absentList = [...absentStudents].sort((a, b) => a.name.localeCompare(b.name));
  const naList = [...naStudents].sort((a, b) => a.name.localeCompare(b.name));

  const [yyyy, mm, dd] = date.split('-');
  const formattedDate = `${dd}-${mm}-${yyyy}`;

  let text = `📘 *BCR 306 Session Report* 📘\n\n`;
  text += `📌 *Group Number:* Group ${selectedGroup}\n`;
  text += `📅 *Date:* ${formattedDate}\n`;
  text += `👨‍🏫 *Trainer Name:* ${trainer || '___________'}\n`;
  text += `🧑‍🤝‍🧑 *Coordinators:* ${coordinators || '___________'}\n`;
  text += `✍️ *Prepared By:* ${preparedBy || '___________'}\n\n`;
  text += `📝 *Session Overview:*\n`;
  text += `${overview || 'No session summary provided yet...'}\n\n`;
  text += `───────────────\n`;
  text += `✅ *Present:*\n`;
  text += presentList.length > 0 ? presentList.map((s, i) => `${i + 1}. ${s.name}`).join('\n') : 'None';
  text += `\n\n❌ *Absent:*\n`;
  text += absentList.length > 0 ? absentList.map((s, i) => `${i + 1}. ${s.name}`).join('\n') : 'None';
  text += `\n\n⚪ *N/A:*\n`;
  text += naList.length > 0 ? naList.map((s, i) => `${i + 1}. ${s.name}`).join('\n') : 'None';
  text += `\n───────────────\n`;
  text += tldvLink ? `🔗 *TLDV Link:* ${tldvLink}` : '🔗 *TLDV Link:* ___';

  return text;
}

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
  const [aiPrompt, setAiPrompt] = useState('');
  const [tldvLink, setTldvLink] = useState('');

  // AI summary
  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const lastGeneratedPrompt = useRef('');

  // Attendance
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set());
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Copy feedback
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudents()
      .then(data => {
        setStudents(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load students');
        setIsLoading(false);
      });
  }, []);

  // Filter students based on group
  const groupStudents = students.filter(s => s.groupNumber === selectedGroup);
  const activeStudents = groupStudents.filter(s => s.status === 'Active');
  const naStudents = groupStudents.filter(s => s.status === 'N/A');

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

  const handleGenerateSummary = async () => {
    if (!aiPrompt.trim()) return;
    if (aiPrompt.trim() === lastGeneratedPrompt.current) {
      setToast({ msg: 'Prompt unchanged — already generated for this text.', type: 'info' });
      return;
    }
    setIsGenerating(true);
    setAiSummary('');
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate summary');
      lastGeneratedPrompt.current = aiPrompt.trim();
      setAiSummary(data.summary);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate summary';
      setToast({ msg, type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const overview = aiSummary;

  const previewText = useMemo(() => buildReportText({
    selectedGroup,
    date,
    trainer,
    coordinators,
    preparedBy,
    overview,
    presentStudents,
    absentStudents,
    naStudents,
    tldvLink,
  }), [selectedGroup, date, trainer, coordinators, preparedBy, overview, presentStudents, absentStudents, naStudents, tldvLink]);

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(previewText);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2000);
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
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* ─── Sidebar: Session Details ─────────────────────────────────── */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="card-container">
          <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary-light text-primary rounded-lg flex items-center justify-center text-sm">📋</span>
            Session Details
          </h2>

          <div className="space-y-4">
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

            <div>
              <Label>Session Summary Prompt</Label>
              <Textarea
                value={aiPrompt}
                onChange={e => { setAiPrompt(e.target.value); setAiSummary(''); }}
                placeholder="Provide a brief summary or bullet points about what was covered in today's session. The AI will use this to generate a well-written session overview for the report."
                rows={4}
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={isGenerating || !aiPrompt.trim()}
              className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating…
                </>
              ) : (
                'Generate Session Summary'
              )}
            </button>

            <div>
              <Label>TLDV Recording Link</Label>
              <Input
                type="url"
                value={tldvLink}
                onChange={e => setTldvLink(e.target.value)}
                placeholder="https://tldv.io/…"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* ── Preview ──────────────────────────────────────────── */}
        <div className="card-container">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-light text-primary rounded-lg flex items-center justify-center text-sm">👁️</span>
              Report Preview
            </h2>
            <button
              type="button"
              onClick={handleCopyPreview}
              className={`text-sm px-4 py-2 rounded-lg font-semibold transition-all ${copiedPreview ? 'bg-success-light text-success-dark' : 'bg-primary text-white hover:bg-primary-dark shadow-sm'}`}
            >
              {copiedPreview ? 'Copied!' : 'Copy Report'}
            </button>
          </div>
          <div className="bg-secondary-light/30 rounded-xl p-4 border border-secondary-light max-h-[50vh] overflow-y-auto whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
            {previewText}
          </div>
        </div>

        {/* ── Attendance (Accordion) ────────────────────────────── */}
        <div className="card-container">
          <button
            type="button"
            onClick={() => setIsAttendanceOpen(o => !o)}
            className="w-full flex justify-between items-center mb-2"
          >
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-light text-primary rounded-lg flex items-center justify-center text-sm">✅</span>
              Attendance
            </h2>
            <div className="flex items-center gap-3">
              {!isAttendanceOpen && (
                <span className="text-xs text-secondary bg-secondary-light px-2.5 py-1 rounded-full font-medium">
                  {presentStudents.length} present / {absentStudents.length} absent
                </span>
              )}
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                className={`text-secondary transition-transform duration-200 ${isAttendanceOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </button>

          {isAttendanceOpen && (
            <div className="overflow-hidden">
              <p className="text-xs text-secondary mb-4">Click a name to toggle between Present and Absent.</p>

              <div className="flex items-center gap-2 mb-4">
                <button type="button" onClick={handleInvert} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                  Invert
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                        className={`cursor-pointer bg-white px-3 py-2 rounded-lg text-sm text-foreground shadow-sm hover:shadow-md border border-transparent hover:border-danger-light transition-all select-none truncate`}
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

              {naStudents.length > 0 && (
                <div className="mt-4 bg-secondary-light/30 rounded-xl p-3 border border-secondary-light">
                  <h3 className="font-semibold text-secondary-dark mb-2 text-xs uppercase tracking-wider">N/A — Not Active</h3>
                  <div className="flex flex-wrap gap-2">
                    {naStudents.map(student => (
                      <span key={student.id} className="text-xs bg-white text-secondary-dark px-2.5 py-1 rounded-lg border border-secondary-light shadow-sm">
                        {student.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {toast && <Toast key={toast.msg + Date.now()} message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}
