import { getAllPosts, ProjectData } from '@/lib/markdown'
import ProjectCard from '@/components/ProjectCard'

export default function Projects() {
  const projects = getAllPosts('projects') as ProjectData[]
  
  // Sort projects by weight (ascending) then by date (descending)
  const sortedProjects = projects.sort((a, b) => {
    // First sort by weight if both have weight values
    if (a.weight !== undefined && b.weight !== undefined) {
      return a.weight - b.weight
    }
    
    // If only one has weight, prioritize it
    if (a.weight !== undefined) return -1
    if (b.weight !== undefined) return 1
    
    // If neither has weight, sort by date (most recent first)
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    
    // If only one has date, prioritize it
    if (a.date) return -1
    if (b.date) return 1
    
    // Fallback to alphabetical by title
    return a.title.localeCompare(b.title)
  })
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {sortedProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
