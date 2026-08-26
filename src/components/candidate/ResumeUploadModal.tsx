import { useState } from 'react'
import {
  extractProfileFromResume,
  type ParsedCandidateResume,
} from '../../services/aiAssistanceService'

interface ResumeUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyExtracted: (parsed: ParsedCandidateResume) => void
}

const SAMPLE_RESUME_TEXT = `Ananya Krishnan
Chennai, India | ananya@example.com | +91 98765 43210
Target Role: Data Analyst / BI Specialist

Professional Summary:
Analytics graduate with strong Python, SQL, and Power BI skills. 6 months internship experience building automated retail dashboards and analyzing digital campaign lift.

Education:
B.Sc. Statistics — University of Madras (2025)
Coursework in statistical inference, databases, and applied data analytics.

Technical Skills:
SQL (Advanced / Expert), Python (Proficient), Excel (Advanced), Power BI (Proficient), Communication, Data Modeling

Projects:
1. Retail Demand Forecasting: Built SQL models and Power BI dashboards for 12 store locations.
2. Campaign Lift Analysis: Extracted 100k+ customer records with Python & SQL to measure cohort retention.

Experience:
Analytics Intern at Coastal Retail Labs (Jan 2026 – Jun 2026)
- Owned weekly category performance reporting.
- Wrote parameterized SQL queries reducing manual compilation time by 80%.`

export function ResumeUploadModal({ isOpen, onClose, onApplyExtracted }: ResumeUploadModalProps) {
  const [text, setText] = useState('')
  const [parsed, setParsed] = useState<ParsedCandidateResume | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)

  if (!isOpen) return null

  function handleRunExtraction() {
    if (!text.trim()) return
    setIsExtracting(true)
    setTimeout(() => {
      const result = extractProfileFromResume(text)
      setParsed(result)
      setIsExtracting(false)
    }, 400)
  }

  function handleConfirm() {
    if (!parsed) return
    onApplyExtracted(parsed)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm animate-fade-up">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-line bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="font-serif text-2xl tracking-tight text-ink">
              Resume Upload & AI Extraction
            </h2>
            <p className="text-xs text-mute">
              Extract skills, education, experience, and projects directly into your Talent Profile.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-mute hover:bg-paper hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-mute">Paste Resume Text or Bio</label>
              <button
                type="button"
                onClick={() => setText(SAMPLE_RESUME_TEXT)}
                className="text-[11px] font-medium text-teal hover:underline"
              >
                Insert Sample Resume
              </button>
            </div>
            <textarea
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw resume text, markdown, or profile summary here..."
              className="mt-1.5 w-full rounded-2xl border border-line bg-paper p-3.5 text-xs text-ink outline-none focus:border-teal"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!text.trim() || isExtracting}
              onClick={handleRunExtraction}
              className="rounded-full bg-teal px-5 py-2 text-xs font-medium text-white transition hover:bg-teal/90 disabled:opacity-50"
            >
              {isExtracting ? 'Extracting with AI...' : '✨ Run AI Skill Extraction'}
            </button>
          </div>

          {/* Extracted Preview Drawer */}
          {parsed && (
            <div className="rounded-2xl border border-teal/30 bg-teal/5 p-5 animate-fade-up">
              <h3 className="font-serif text-lg text-ink">Extracted Profile Summary</h3>
              <p className="text-xs text-mute">Review extracted parameters before updating your profile.</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <span className="text-mute">Detected Name:</span>
                  <p className="font-medium text-ink">{parsed.name || 'Not detected'}</p>
                </div>
                <div>
                  <span className="text-mute">Detected Role:</span>
                  <p className="font-medium text-ink">{parsed.role || 'Data Analyst'}</p>
                </div>
                <div>
                  <span className="text-mute">Location:</span>
                  <p className="font-medium text-ink">{parsed.location || 'Chennai'}</p>
                </div>
                <div>
                  <span className="text-mute">Education:</span>
                  <p className="font-medium text-ink">{parsed.education?.degree || 'Bachelor Degree'}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-teal/20 pt-3">
                <span className="text-xs font-medium text-mute">Extracted Skills ({parsed.skills.length}):</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {parsed.skills.map((s) => (
                    <span key={s.name} className="rounded-md bg-teal/20 px-2 py-0.5 text-xs text-teal font-medium">
                      {s.name} ({s.level})
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-line px-4 py-1.5 text-xs text-mute hover:border-ink"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="rounded-full bg-ink px-5 py-1.5 text-xs font-medium text-mist hover:bg-ink-2"
                >
                  Confirm & Update Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
