import Link from 'next/link'
import { ProjectData } from '@/lib/markdown'

interface ProjectCardProps {
  project: ProjectData
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const isExternalLink = project.extra?.link_to
  const linkUrl = isExternalLink ? project.extra.link_to : `/projects/${project.slug}`
  
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
    <article className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 ease-in-out bg-[var(--bg-0)] border-[var(--border-color)]">
      <h2 className="text-xl font-semibold mb-3">
        <span className="text-[var(--text-0)] hover:text-[var(--primary-color)] transition-colors duration-200 cursor-pointer">
          {project.title}
        </span>
      </h2>
      
      {project.description && (
        <p className="text-base text-[var(--text-1)] mb-3 leading-relaxed">
          {project.description}
        </p>
      )}
      
      {project.date && (
        <time className="text-sm text-[var(--text-2)] block">
          {formatDate(project.date)}
        </time>
      )}
    </article>
  )

  if (isExternalLink) {
    return (
      <a 
        href={linkUrl} 
        className="block no-underline"
        target="_self"
        rel="noopener"
      >
        <CardContent />
      </a>
    )
  }

  return (
    <Link href={linkUrl} className="block no-underline">
      <CardContent />
    </Link>
  )
}