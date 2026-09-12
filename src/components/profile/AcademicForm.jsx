const DEGREES = ['BS', 'BSc', 'BE', 'MS', 'MSc']

export default function AcademicForm({ value, onChange }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value })

  const cgpaValid = value.cgpa >= 0 && value.cgpa <= 4

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-[14.4px] text-ink-secondary block mb-1.5">Degree</label>
        <select
          value={value.degree}
          onChange={set('degree')}
          className="w-full px-3.5 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border focus:ring-accent-indigo/50 outline-none text-[15.5px] text-ink-primary"
        >
          {DEGREES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-[14.4px] text-ink-secondary block mb-1.5">Program</label>
        <input
          value={value.program}
          onChange={set('program')}
          placeholder="Computer Science"
          className="w-full px-3.5 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border focus:ring-accent-indigo/50 outline-none text-[15.5px] text-ink-primary placeholder:text-ink-tertiary"
        />
      </div>

      <div>
        <label className="text-[14.4px] text-ink-secondary block mb-1.5">Semester</label>
        <input
          type="number"
          min={1}
          max={12}
          value={value.semester}
          onChange={(e) => onChange({ ...value, semester: Number(e.target.value) })}
          className="w-full px-3.5 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border focus:ring-accent-indigo/50 outline-none text-[15.5px] text-ink-primary tabular"
        />
      </div>

      <div>
        <label className="text-[14.4px] text-ink-secondary block mb-1.5">CGPA</label>
        <input
          type="number"
          step="0.01"
          min={0}
          max={4}
          value={value.cgpa}
          onChange={(e) => onChange({ ...value, cgpa: Number(e.target.value) })}
          className={`w-full px-3.5 py-2.5 rounded-lg bg-base-surface ring-1 outline-none text-[15.5px] text-ink-primary tabular ${
            cgpaValid ? 'ring-base-border focus:ring-accent-indigo/50' : 'ring-state-danger/50'
          }`}
        />
        <p className={`text-[13.2px] mt-1.5 ${cgpaValid ? 'text-ink-tertiary' : 'text-state-danger'}`}>
          {cgpaValid ? `${value.cgpa} / 4.00` : 'CGPA must be between 0.00 and 4.00'}
        </p>
      </div>
    </div>
  )
}
