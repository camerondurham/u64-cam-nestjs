import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import toml from 'toml'

const contentDirectory = path.join(process.cwd(), 'content')

export interface PostData {
  slug: string
  title: string
  date?: string
  content: string
  description?: string
  weight?: number
  extra?: {
    link_to?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface ProjectData extends PostData {
  title: string
  description?: string
  date?: string
  weight?: number
  extra?: {
    link_to?: string
    [key: string]: unknown
  }
}

export async function getPostData(section: string, slug: string): Promise<PostData> {
  const fullPath = path.join(contentDirectory, section, `${slug}.md`)

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    // Detect frontmatter type and parse accordingly
    let matterResult
    if (fileContents.startsWith('+++')) {
      matterResult = matter(fileContents, {
        engines: {
          toml: toml.parse.bind(toml)
        },
        delimiters: '+++',
        language: 'toml'
      })
    } else {
      matterResult = matter(fileContents)
    }

    let processedContent = ''
    try {
      const result = await remark()
        .use(html)
        .process(matterResult.content)
      processedContent = result.toString()
    } catch (error) {
      console.error(`Error processing markdown content for ${slug}:`, error)
      // Fallback to raw content if markdown processing fails
      processedContent = matterResult.content || ''
    }

    // Ensure we have at least a title, use filename as fallback
    const title = matterResult.data.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    // Validate and sanitize date field
    let validatedDate = matterResult.data.date
    if (validatedDate && typeof validatedDate === 'string') {
      const dateTest = new Date(validatedDate)
      if (isNaN(dateTest.getTime())) {
        console.warn(`Invalid date format in ${slug}.md: ${validatedDate}`)
        validatedDate = undefined
      }
    } else if (validatedDate && typeof validatedDate !== 'string') {
      console.warn(`Date field in ${slug}.md is not a string, ignoring`)
      validatedDate = undefined
    }

    // Ensure description is a string if present
    let description = matterResult.data.description
    if (description && typeof description !== 'string') {
      console.warn(`Description field in ${slug}.md is not a string, converting to string`)
      description = String(description)
    }

    // Validate weight field
    let weight = matterResult.data.weight
    if (weight !== undefined && (typeof weight !== 'number' || isNaN(weight))) {
      console.warn(`Invalid weight in ${slug}.md: ${weight}, defaulting to 0`)
      weight = 0
    }

    // Validate extra field structure
    let extra = matterResult.data.extra
    if (extra && typeof extra !== 'object') {
      console.warn(`Extra field in ${slug}.md is not an object, ignoring`)
      extra = undefined
    }

    return {
      slug,
      title,
      description,
      date: validatedDate,
      weight,
      extra,
      content: processedContent,
      ...matterResult.data
    } as PostData
  } catch (error) {
    console.error(`Error reading file ${fullPath}:`, error)
    // Return minimal valid data structure for missing or corrupted files
    return {
      slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: undefined,
      date: undefined,
      weight: 0,
      extra: undefined,
      content: ''
    } as PostData
  }
}

export function getAllPosts(section: string): PostData[] {
  const sectionPath = path.join(contentDirectory, section)

  if (!fs.existsSync(sectionPath)) {
    return []
  }

  const fileNames = fs.readdirSync(sectionPath)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md') && !fileName.startsWith('_'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(sectionPath, fileName)

      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        // Detect frontmatter type and parse accordingly
        let matterResult
        if (fileContents.startsWith('+++')) {
          matterResult = matter(fileContents, {
            engines: {
              toml: toml.parse.bind(toml)
            },
            delimiters: '+++',
            language: 'toml'
          })
        } else {
          matterResult = matter(fileContents)
        }

        // Ensure we have at least a title, use filename as fallback
        const title = matterResult.data.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

        // Validate and sanitize date field
        let validatedDate = matterResult.data.date
        if (validatedDate && typeof validatedDate === 'string') {
          // Check if date is in valid format (basic validation)
          const dateTest = new Date(validatedDate)
          if (isNaN(dateTest.getTime())) {
            console.warn(`Invalid date format in ${fileName}: ${validatedDate}`)
            validatedDate = undefined
          }
        } else if (validatedDate && typeof validatedDate !== 'string') {
          console.warn(`Date field in ${fileName} is not a string, ignoring`)
          validatedDate = undefined
        }

        // Ensure description is a string if present
        let description = matterResult.data.description
        if (description && typeof description !== 'string') {
          console.warn(`Description field in ${fileName} is not a string, converting to string`)
          description = String(description)
        }

        // Validate weight field
        let weight = matterResult.data.weight
        if (weight !== undefined && (typeof weight !== 'number' || isNaN(weight))) {
          console.warn(`Invalid weight in ${fileName}: ${weight}, defaulting to 0`)
          weight = 0
        }

        // Validate extra field structure
        let extra = matterResult.data.extra
        if (extra && typeof extra !== 'object') {
          console.warn(`Extra field in ${fileName} is not an object, ignoring`)
          extra = undefined
        }

        return {
          slug,
          title,
          description,
          date: validatedDate,
          weight,
          extra,
          ...matterResult.data
        } as PostData
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error)
        // Return minimal valid data structure for corrupted files
        return {
          slug,
          title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: undefined,
          date: undefined,
          weight: 0,
          extra: undefined
        } as PostData
      }
    })

  return allPostsData.sort((a, b) => {
    // Enhanced sorting with fallback handling
    if (a.date && b.date) {
      return a.date < b.date ? 1 : -1
    }
    // If one has date and other doesn't, prioritize the one with date
    if (a.date && !b.date) return -1
    if (!a.date && b.date) return 1

    // If both have weight, sort by weight
    if (a.weight !== undefined && b.weight !== undefined) {
      return a.weight - b.weight
    }

    // Fallback to alphabetical by title
    return a.title.localeCompare(b.title)
  })
}

export function getAllProjects(): ProjectData[] {
  return getAllPosts('projects') as ProjectData[]
}
