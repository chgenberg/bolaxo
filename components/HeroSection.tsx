'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-neutral-white">
      {/* Desktop Hero */}
      <div className="hidden md:block relative h-screen w-full">
        <div className="absolute inset-0 flex items-center">
          {/* Content - Left side */}
          <div className="w-1/2 px-8 lg:px-16 z-10">
            <div className="max-w-xl">
              {/* Main Headline */}
              <h1 className="text-6xl lg:text-7xl font-bold text-accent-orange leading-tight mb-6">
                Handla nu.
                <br />
                Betala senare.
              </h1>

              {/* Subheading */}
              <p className="text-xl text-primary-navy leading-relaxed mb-8">
                Upplev friheten att betala på dina villkor. Enkelt, tryggt och smoooth — både online och i butik.
              </p>

              {/* Primary CTA */}
              <Link
                href="/kopare/start"
                className="inline-flex items-center gap-3 px-8 py-4 bg-accent-pink text-primary-navy font-bold rounded-lg hover:shadow-lg transition-all duration-200 text-lg"
              >
                Kom igång nu
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Secondary CTAs */}
              <div className="flex gap-6 mt-8">
                <Link
                  href="/sok"
                  className="text-primary-navy font-semibold hover:text-accent-orange transition-colors"
                >
                  Sök företag →
                </Link>
                <Link
                  href="/vardering"
                  className="text-primary-navy font-semibold hover:text-accent-orange transition-colors"
                >
                  Gratis värdering →
                </Link>
              </div>
            </div>
          </div>

          {/* Background Image - Right side */}
          <div className="w-1/2 relative h-full">
            <Image
              src="/hero_photo.png"
              alt="Hero"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-neutral-white pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mobile Hero */}
      <div className="md:hidden relative min-h-screen flex flexlex-col justify-center w-full">
        {/* Mobile Image */}
        <div className="relative h-96 w-full mb-8">
          <Image
            src="/hero_photo_mobile.png"
            alt="Hero"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-white" />
        </div>

        {/* Mobile Content */}
        <div className="px-4 py-8">
          {/* Main Headline */}
          <h1 className="text-4xl font-bold text-accent-orange leading-tight mb-4">
            Handla nu.
            <br />
            Betala senare.
          </h1>

          {/* Subheading */}
          <p className="text-lg text-primary-navy leading-relaxed mb-6">
            Upplev friheten att betala på dina villkor. Enkelt, tryggt och smoooth — både online och i butik.
          </p>

          {/* Primary CTA */}
          <Link
            href="/kopare/start"
            className="block w-full py-4 bg-accent-pink text-primary-navy font-bold rounded-lg text-center hover:shadow-lg transition-all duration-200 mb-4"
          >
            Kom igång nu
          </Link>

          {/* Secondary CTAs */}
          <div className="space-y-3">
            <Link
              href="/sok"
              className="block text-center text-primary-navy font-semibold hover:text-accent-orange transition-colors py-3 border border-primary-navy rounded-lg"
            >
              Sök företag
            </Link>
            <Link
              href="/vardering"
              className="block text-center text-primary-navy font-semibold hover:text-accent-orange transition-colors py-3 border border-primary-navy rounded-lg"
            >
              Gratis värdering
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
