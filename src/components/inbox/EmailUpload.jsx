import { useRef, useState } from 'react'
import { UploadCloud, File, X } from 'lucide-react'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function EmailUpload({ files, onFilesAdded, onFileRemoved }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    onFilesAdded(Array.from(e.dataTransfer.files))
  }

  return (
    <div>
      <div
        onDragOver={(e) => (e.preventDefault(), setDragOver(true))}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed py-14 px-6 cursor-pointer transition-colors',
          dragOver ? 'border-accent-indigo/60 bg-accent-indigo/5' : 'border-base-border hover:border-base-borderStrong',
        ].join(' ')}
      >
        <div className="w-12 h-12 rounded-xl bg-base-surface ring-1 ring-base-border flex items-center justify-center mb-4">
          <UploadCloud size={20} className="text-accent-cyan" strokeWidth={1.75} />
        </div>
        <p className="text-[14px] font-medium text-ink-primary">Drop email files here</p>
        <p className="text-[12.5px] text-ink-secondary mt-1">or browse files from your device</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".eml,.txt,.msg"
          className="hidden"
          onChange={(e) => onFilesAdded(Array.from(e.target.files))}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2 mt-4">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-base-surface ring-1 ring-base-border">
              <div className="flex items-center gap-2.5 min-w-0">
                <File size={15} className="text-ink-tertiary shrink-0" />
                <span className="text-[13px] text-ink-primary truncate">{file.name}</span>
                <span className="text-[11.5px] text-ink-tertiary shrink-0">{formatSize(file.size)}</span>
              </div>
              <button onClick={() => onFileRemoved(i)} className="text-ink-tertiary hover:text-state-danger transition-colors shrink-0">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
