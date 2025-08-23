import { getAllPosts } from '@/lib/markdown'
import Link from 'next/link'
import Image from 'next/image'

export default function Photos() {
  const photos = getAllPosts('photos')

  // Filter out photos that don't have valid image URLs
  const photosWithImages = photos.filter((photo) => {
    const extra = photo.extra as { remote_image?: string; local_image?: string } | undefined
    const imageUrl = extra?.remote_image || extra?.local_image
    return imageUrl && imageUrl.trim() !== ''
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Photos</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {photosWithImages.map((photo) => {
          // Get image URL from either remote_image or local_image in extra field
          const extra = photo.extra as { remote_image?: string; local_image?: string } | undefined
          const imageUrl = extra?.remote_image || extra?.local_image

          return (
            <article key={photo.slug} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <Link href={`/photos/${photo.slug}`}>
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={imageUrl!}
                    alt={photo.title}
                    width={600}
                    height={450}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-purple-600 mb-2">
                    # {photo.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {photo.description}
                  </p>
                </div>
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
