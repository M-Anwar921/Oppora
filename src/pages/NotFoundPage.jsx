import { Compass } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'

export default function NotFoundPage() {
  return (
    <div className="py-10">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you're looking for doesn't exist or may have moved."
        ctaLabel="Back to Dashboard"
        ctaTo="/"
      />
    </div>
  )
}
