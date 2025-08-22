import Link from 'next/link'
import { ProjectData } from '@/lib/markdown'

interface ProjectCardProps {
  project: ProjectData
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Determine if this project has an external link
  const externalLink = project.extra?.link_to
  const hasExternalLink = Boolean(externalLink && typeof externalLink === 'string')

  // Generate the appropriate URL based on link type
  const linkUrl = hasExternalLink ? externalLink! : `/projects/${project.slug}`

  const formatDate = (dateString?: string) => {
    if (!dateString) return null

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      // Fallback to raw string if date parsing fails
      return dateString
    }
  }

  const CardContent = () => (
    <article className="group border rounded-lg p-6 bg-[var(--bg-0)] border-[var(--border-color)] transition-all duration-200 ease-in-out hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] hover:border-[var(--primary-color)] focus-within:ring-2 focus-within:ring-[var(--primary-color)] focus-within:ring-opacity-50">
      <h2 className="text-xl font-semibold mb-3">
        <span className="text-[var(--text-0)] group-hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer underline-offset-4 hover:underline focus:underline focus:outline-none">
          {project.title}
        </span>
      </h2>

      {project.description && (
        <p className="text-base text-[var(--text-1)] mb-3 leading-relaxed group-hover:text-[var(--text-0)] transition-colors duration-200">
          {project.description}
        </p>
      )}

      {project.date && (
        <time className="text-sm text-[var(--text-2)] block group-hover:text-[var(--text-1)] transition-colors duration-200">
          {formatDate(project.date)}
        </time>
      )}
    </article>
  )

  // Use external link with regular anchor tag for external URLs
  if (hasExternalLink) {
    return (
      <a
        href={linkUrl}
        className="block no-underline focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50 rounded-lg"
        target="_self"
        rel="noopener noreferrer"
        aria-label={`Visit ${project.title} project (external link)`}
      >
        <CardContent />
      </a>
    )
  }

  // Use Next.js Link component for internal routing
  return (
    <Link
      href={linkUrl}
      className="block no-underline focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50 rounded-lg"
      aria-label={`View ${project.title} project details`}
    >
      <CardContent />
    </Link>
  )
}