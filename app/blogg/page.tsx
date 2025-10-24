'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, User, Tag, Search } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: Date
  readTime: number
  category: 'guide' | 'news' | 'insights' | 'case-study'
  image: string
  tags: string[]
  featured: boolean
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Så värderar du ditt företag inför försäljning',
    excerpt: 'En komplett guide till företagsvärdering. Lär dig de vanligaste värderingsmetoderna och vad som påverkar priset.',
    content: '',
    author: 'Anna Andersson',
    date: new Date('2024-03-15'),
    readTime: 8,
    category: 'guide',
    image: '/blog/vardering.jpg',
    tags: ['värdering', 'försäljning', 'due diligence'],
    featured: true
  },
  {
    id: '2',
    title: '5 vanliga misstag vid företagsförsäljning',
    excerpt: 'Undvik de klassiska fallgroparna. Vi går igenom de vanligaste misstagen säljare gör och hur du undviker dem.',
    content: '',
    author: 'Erik Johansson',
    date: new Date('2024-03-10'),
    readTime: 5,
    category: 'insights',
    image: '/blog/misstag.jpg',
    tags: ['tips', 'försäljning', 'strategi'],
    featured: true
  },
  {
    id: '3',
    title: 'Rekordmånga företagsaffärer 2024',
    excerpt: 'Marknaden för företagsöverlåtelser har aldrig varit hetare. Vi summerar Q1 2024 och blickar framåt.',
    content: '',
    author: 'Maria Lindberg',
    date: new Date('2024-03-05'),
    readTime: 4,
    category: 'news',
    image: '/blog/marknad.jpg',
    tags: ['marknad', 'statistik', 'trender'],
    featured: false
  },
  {
    id: '4',
    title: 'Case: Från startup till exit på 3 år',
    excerpt: 'Läs om hur techbolaget Digitala Lösningar AB gick från 0 till 50 miljoner i exit-värde.',
    content: '',
    author: 'Johan Berg',
    date: new Date('2024-02-28'),
    readTime: 10,
    category: 'case-study',
    image: '/blog/case-study.jpg',
    tags: ['case study', 'tech', 'exit'],
    featured: false
  },
  {
    id: '5',
    title: 'Due Diligence - Komplett checklista',
    excerpt: 'Vad tittar köpare på? Här är den kompletta checklistan för due diligence-processen.',
    content: '',
    author: 'Anna Andersson',
    date: new Date('2024-02-20'),
    readTime: 12,
    category: 'guide',
    image: '/blog/due-diligence.jpg',
    tags: ['due diligence', 'köpare', 'checklista'],
    featured: false
  },
  {
    id: '6',
    title: 'Så förbereder du datarum för försäljning',
    excerpt: 'Ett välorganiserat datarum kan vara skillnaden mellan en snabb affär och månader av förhandlingar.',
    content: '',
    author: 'Erik Johansson',
    date: new Date('2024-02-15'),
    readTime: 7,
    category: 'guide',
    image: '/blog/datarum.jpg',
    tags: ['datarum', 'förberedelse', 'tips'],
    featured: false
  }
]

const categories = [
  { id: 'all', label: 'Alla artiklar', count: blogPosts.length },
  { id: 'guide', label: 'Guider', count: blogPosts.filter(p => p.category === 'guide').length },
  { id: 'news', label: 'Nyheter', count: blogPosts.filter(p => p.category === 'news').length },
  { id: 'insights', label: 'Insikter', count: blogPosts.filter(p => p.category === 'insights').length },
  { id: 'case-study', label: 'Case Studies', count: blogPosts.filter(p => p.category === 'case-study').length },
]

const popularTags = ['värdering', 'due diligence', 'försäljning', 'köpare', 'tips', 'marknad']

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const featuredPosts = blogPosts.filter(post => post.featured)

  return (
    <main className="bg-neutral-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-accent-orange/10 to-accent-pink/10 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-accent-orange mb-6 uppercase">
            Kunskap & Insikter
          </h1>
          <p className="text-2xl text-primary-navy leading-relaxed">
            Läs våra guider, nyheter och insikter om företagsöverlåtelser. Få kunskap som hjälper dig göra bättre affärer.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Featured Posts */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-accent-orange mb-12 uppercase">Utvalda artiklar</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {blogPosts.slice(0, 2).map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="relative h-48 bg-gradient-to-br from-accent-pink/10 to-accent-orange/10 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20">📰</span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-white bg-accent-pink px-3 py-1 rounded-full uppercase">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-600">{post.readTime} min läsning</span>
                  </div>

                  <h3 className="text-2xl font-bold text-accent-orange mb-3 group-hover:text-accent-pink transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-700 mb-6 line-clamp-2">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <div className="font-semibold text-primary-navy">{post.author}</div>
                      <div>{post.date.toLocaleDateString('sv-SE')}</div>
                    </div>
                    <span className="text-accent-pink text-lg">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-primary-navy mb-6 uppercase">Kategorier</h2>
          <div className="flex flex-wrap gap-3">
            <div className="px-6 py-2 bg-accent-pink text-primary-navy font-bold rounded-full">
              Alla artiklar
            </div>
            {['Guider', 'Nyheter', 'Insikter', 'Case Studies'].map((cat) => (
              <div
                key={cat}
                className="px-6 py-2 border-2 border-gray-200 text-primary-navy font-semibold rounded-full hover:border-accent-pink transition-colors cursor-pointer"
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-primary-navy mb-6 uppercase">Populära taggar</h2>
          <div className="flex flex-wrap gap-2">
            {['värdering', 'due diligence', 'försäljning', 'köpare', 'tips', 'marknad'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-neutral-off-white text-primary-navy rounded-full text-sm font-medium hover:bg-accent-pink/20 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-accent-pink rounded-lg p-12 mb-16 text-center">
          <h2 className="text-3xl font-bold text-primary-navy mb-4 uppercase">Nyhetsbrev</h2>
          <p className="text-lg text-primary-navy mb-6">
            Få våra bästa tips och senaste nyheter direkt i inkorgen.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="din@email.se"
              className="flex-1 px-6 py-3 rounded-lg border-2 border-primary-navy text-primary-navy placeholder-gray-500 focus:outline-none focus:border-primary-navy"
            />
            <button className="px-8 py-3 bg-primary-navy text-white font-bold rounded-lg hover:shadow-lg transition-all">
              Prenumerera
            </button>
          </div>
        </div>

        {/* All Articles */}
        <div>
          <h2 className="text-4xl font-bold text-accent-orange mb-12 uppercase">Senaste artiklarna</h2>

          <div className="space-y-6">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold bg-accent-pink text-white px-3 py-1 rounded-full uppercase">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-600">{post.readTime} min</span>
                      <span className="text-xs text-gray-600">
                        {post.date.toLocaleDateString('sv-SE')}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-accent-orange mb-3 group-hover:text-accent-pink transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-700 mb-4">{post.excerpt}</p>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-primary-navy font-semibold">
                    {post.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
