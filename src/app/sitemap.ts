import type { MetadataRoute } from 'next'
import { getAllPackages, getCategories } from '@/lib/data-service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webinstall-ui.vercel.app'
  
  try {
    const [packages, categories] = await Promise.all([
      getAllPackages(),
      getCategories()
    ])

    // Main pages
    const routes = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
    ]

    // Package pages
    const packageRoutes = packages.map((pkg) => ({
      url: `${baseUrl}/package/${pkg.name}`,
      lastModified: new Date(pkg.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Category pages (future implementation)
    const categoryRoutes = categories.map((category) => ({
      url: `${baseUrl}/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...routes, ...packageRoutes, ...categoryRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return basic sitemap if data fetching fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
    ]
  }
}