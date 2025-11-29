/**
 * Sitemap Generator for Stella Real Estate
 * 
 * This script generates a dynamic sitemap.xml file including all property listings
 * Run this script periodically or after adding new projects to update the sitemap
 * 
 * Usage: node scripts/generate-sitemap.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Dynamic import of Supabase only if credentials are available
let supabase = null
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (supabaseUrl && supabaseKey) {
  const { createClient } = await import('@supabase/supabase-js')
  supabase = createClient(supabaseUrl, supabaseKey)
}

const SITE_URL = 'https://stellareal.com.br'

// Static pages configuration
const staticPages = [
  { url: '/', changefreq: 'daily', priority: '1.0' },
  { url: '/projects', changefreq: 'weekly', priority: '0.9' },
  { url: '/about', changefreq: 'monthly', priority: '0.8' },
  { url: '/list-your-property', changefreq: 'monthly', priority: '0.8' },
  { url: '/members', changefreq: 'monthly', priority: '0.7' },
  { url: '/investors', changefreq: 'monthly', priority: '0.6' },
  { url: '/legal', changefreq: 'yearly', priority: '0.3' },
  { url: '/cookies', changefreq: 'yearly', priority: '0.3' },
]

function generateSitemapXML(urls) {
  const currentDate = new Date().toISOString().split('T')[0]
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`

  urls.forEach(({ url, lastmod, changefreq, priority, images }) => {
    xml += `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${lastmod || currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
`
    
    if (images && images.length > 0) {
      images.forEach(image => {
        xml += `    <image:image>
      <image:loc>${image.url}</image:loc>
      <image:caption>${escapeXml(image.caption || '')}</image:caption>
    </image:image>
`
      })
    }
    
    xml += `  </url>
`
  })

  xml += `</urlset>`
  
  return xml
}

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function makeSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function generateSitemap() {
  console.log('🚀 Starting sitemap generation for StellaReal.com.br...')
  
  try {
    let projects = []
    
    // Fetch projects from database if credentials available
    if (supabase) {
      const { data, error } = await supabase
        .from('listings')
        .select('id, title, city, state_code, media, updated_at, created_at')
        .eq('listing_type', 'new_project')
        .neq('status', 'archived')
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('⚠️  Could not fetch projects from database:', error.message)
        console.log('📝 Generating sitemap with static pages only...')
      } else {
        projects = data || []
      }
    } else {
      console.log('ℹ️  No Supabase credentials found')
      console.log('📝 Generating sitemap with static pages only...')
    }

    console.log(`📋 Found ${projects.length} active projects`)

    // Start with static pages
    const allUrls = [...staticPages]

    // Add project pages
    if (projects.length > 0) {
      projects.forEach(project => {
        const slug = makeSlug(project.title)
        const thumbnail = project.media?.find(m => m.kind === 'thumbnail')?.url
        
        allUrls.push({
          url: `/projects/${slug}-${project.id}`,
          lastmod: project.updated_at?.split('T')[0] || project.created_at?.split('T')[0],
          changefreq: 'weekly',
          priority: '0.9',
          images: thumbnail ? [{
            url: thumbnail,
            caption: `${project.title} - ${project.city}, ${project.state_code}`
          }] : []
        })
      })
    }

    // Generate XML
    const sitemapXML = generateSitemapXML(allUrls)

    // Write to file
    const publicDir = path.join(__dirname, '..', 'public')
    const sitemapPath = path.join(publicDir, 'sitemap.xml')
    
    fs.writeFileSync(sitemapPath, sitemapXML, 'utf-8')

    console.log(`✅ Sitemap generated successfully!`)
    console.log(`📍 Location: ${sitemapPath}`)
    console.log(`📊 Total URLs: ${allUrls.length}`)
    console.log(`   - Static pages: ${staticPages.length}`)
    console.log(`   - Project pages: ${projects.length}`)
    console.log(`\n🌐 Sitemap URL: ${SITE_URL}/sitemap.xml`)
    console.log(`\n💡 Next steps:`)
    console.log(`   1. Deploy the updated sitemap`)
    console.log(`   2. Submit to Google Search Console: https://search.google.com/search-console`)
    console.log(`   3. Submit to Bing Webmaster: https://www.bing.com/webmasters`)
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

// Run the generator
generateSitemap()
