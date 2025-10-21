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
    <main className="min-h-screen bg-background-off-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-1 mb-4">Kunskap & Insikter</h1>
          <p className="text-lg text-text-gray max-w-2xl mx-auto">
            Läs våra guider, nyheter och insikter om företagsöverlåtelser. 
            Få kunskap som hjälper dig göra bättre affärer.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-gray" />
            <input
              type="text"
              placeholder="Sök artiklar, taggar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Featured Posts */}
        {!searchQuery && selectedCategory === 'all' && (
          <div className="mb-16">
            <h2 className="heading-2 mb-8">Utvalda artiklar</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <article key={post.id} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all group">
                  <div className="h-48 bg-gradient-to-br from-light-blue to-primary-blue/20"></div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-text-gray mb-3">
                      <span className="px-3 py-1 bg-light-blue rounded-full text-primary-blue font-medium">
                        {post.category === 'guide' ? 'Guide' : 
                         post.category === 'news' ? 'Nyhet' :
                         post.category === 'insights' ? 'Insikt' : 'Case Study'}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime} min läsning
                      </span>
                    </div>
                    
                    <h3 className="heading-3 mb-3 group-hover:text-primary-blue transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-text-gray mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-text-gray">
                        <User className="w-4 h-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <Link 
                        href={`/blogg/${post.id}`}
                        className="text-primary-blue font-medium flex items-center hover:gap-2 transition-all"
                      >
                        Läs mer <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Categories */}
            <div className="bg-white p-6 rounded-2xl shadow-card mb-6">
              <h3 className="font-semibold text-text-dark mb-4">Kategorier</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-xl transition-all flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-primary-blue text-white'
                        : 'hover:bg-gray-50 text-text-gray'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className={`text-sm ${
                      selectedCategory === category.id ? 'text-white/80' : 'text-text-gray'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white p-6 rounded-2xl shadow-card">
              <h3 className="font-semibold text-text-dark mb-4">Populära taggar</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 bg-gray-100 text-text-gray rounded-full text-sm hover:bg-primary-blue hover:text-white transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-primary-blue text-white p-6 rounded-2xl mt-6">
              <h3 className="font-semibold mb-2">Nyhetsbrev</h3>
              <p className="text-sm mb-4 opacity-90">
                Få våra bästa tips och senaste nyheter direkt i inkorgen.
              </p>
              <button className="btn-secondary bg-white text-primary-blue hover:bg-gray-100 w-full text-sm">
                Prenumerera
              </button>
            </div>
          </aside>

          {/* Blog Posts Grid */}
          <div className="lg:col-span-3">
            {filteredPosts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-card text-center">
                <p className="text-text-gray">
                  Inga artiklar matchade din sökning. Prova att söka på något annat.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredPosts.map(post => (
                  <article key={post.id} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all group">
                    <div className="h-40 bg-gradient-to-br from-light-blue to-primary-blue/20"></div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-sm text-text-gray mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date.toLocaleDateString('sv-SE')}</span>
                        <span>•</span>
                        <span>{post.readTime} min</span>
                      </div>
                      
                      <h3 className="font-semibold text-text-dark mb-2 group-hover:text-primary-blue transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-sm text-text-gray mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-text-gray">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link 
                          href={`/blogg/${post.id}`}
                          className="text-primary-blue text-sm font-medium flex items-center hover:gap-2 transition-all"
                        >
                          Läs mer <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredPosts.length > 6 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 transition-all">
                    Föregående
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-primary-blue text-white">
                    1
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 transition-all">
                    2
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 transition-all">
                    3
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-white hover:bg-gray-50 transition-all">
                    Nästa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
