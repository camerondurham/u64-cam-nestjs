import Link from 'next/link'
import { ProjectData } from '@/lib/markdown'

interface ProjectCardProps {
  project: ProjectData
}

export default function ProjectCard({ project }: ProjectCardProps) {
  // Handle completely invalid or null project data
  if (!project || typeof project !== 'object') {
    console.error('ProjectCard received invalid project data:', project)
    return (
      <article className="border rounded-lg p-6 bg-[var(--bg-0)] border-[var(--border-color)] opacity-50">
        <h2 className="text-xl font-semibold mb-3 text-[var(--text-2)]">
          Invalid Project Data
        </h2>
        <p className="text-base text-[var(--text-2)]">
          This project could not be loaded due to invalid data.
        </p>
      </article>
    )
  }
  // Validate project data and provide fallbacks
  const safeProject = {
    title: project?.title || 'Untitled Project',
    description: project?.description && typeof project.description === 'string' ? project.description.trim() : undefined,
    date: project?.date && typeof project.date === 'string' ? project.date : undefined,
    slug: project?.slug || 'unknown',
    extra: project?.extra && typeof project.extra === 'object' ? project.extra : undefined
  }

  // Determine if this project has an external link with validation
  const externalLink = safeProject.extra?.link_to
  const hasExternalLink = Boolean(
    externalLink && 
    typeof externalLink === 'string' && 
    externalLink.trim().length > 0 &&
    (externalLink.startsWith('http://') || externalLink.startsWith('https://'))
  )

  // Generate the appropriate URL based on link type with fallback
  const linkUrl = hasExternalLink ? externalLink! : `/projects/${safeProject.slug}`

  const formatDate = (dateString?: string) => {
    if (!dateString || typeof dateString !== 'string') return null

    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date format: ${dateString}`)
        return dateString // Return raw string as fallback
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      console.warn(`Error formatting date ${dateString}:`, error)
      // Fallback to raw string if date parsing fails
      return dateString
    }
  }

  const CardContent = () => {
    const formattedDate = formatDate(safeProject.date)
    
    return (
      <article className="group border rounded-lg p-6 bg-[var(--bg-0)] border-[var(--border-color)] transition-all duration-200 ease-in-out hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] hover:border-[var(--primary-color)] focus-within:ring-2 focus-within:ring-[var(--primary-color)] focus-within:ring-opacity-50">
        <h2 className="text-xl font-semibold mb-3">
          <span className="text-[var(--text-0)] group-hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer underline-offset-4 hover:underline focus:underline focus:outline-none">
            {safeProject.title}
          </span>
        </h2>

        {safeProject.description && safeProject.description.length > 0 && (
          <p className="text-base text-[var(--text-1)] mb-3 leading-relaxed group-hover:text-[var(--text-0)] transition-colors duration-200">
            {safeProject.description}
          </p>
        )}

        {formattedDate && (
          <time className="text-sm text-[var(--text-2)] block group-hover:text-[var(--text-1)] transition-colors duration-200">
            {formattedDate}
          </time>
        )}
      </article>
    )
  }

  // Use external link with regular anchor tag for external URLs
  if (hasExternalLink) {
    return (
      <a
        href={linkUrl}
        className="block no-underline focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50 rounded-lg"
        target="_self"
        rel="noopener noreferrer"
        aria-label={`Visit ${safeProject.title} project (external link)`}
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
      aria-label={`View ${safeProject.title} project details`}
    >
      <CardContent />
    </Link>
  )
}