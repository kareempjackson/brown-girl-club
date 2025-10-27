import { Card } from "@/components/ui/card";

export default function BrandGuidePage() {
  return (
    <div className="bg-[var(--color-porcelain)]">
      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="kicker mb-6">Brand Guide</p>
          <h1 className="text-serif text-6xl lg:text-7xl text-[var(--color-accent)] mb-8 leading-tight max-w-4xl">
            Modern identity. Holistic approach.
          </h1>
          <p className="text-2xl text-[var(--color-ink)]/80 max-w-2xl leading-relaxed">
            Warm, editorial, refined. A system built for clarity and craft.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 lg:py-32 border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-serif text-4xl text-[var(--color-accent)] mb-6">
                Design principles.
              </h2>
              <p className="text-lg text-[var(--color-ink)]/70 leading-relaxed">
                Every element serves a purpose. White space is not empty—it's intentional. 
                Typography leads. Color supports. Elevation whispers, never shouts.
              </p>
            </div>
            <div>
              <h2 className="text-serif text-4xl text-[var(--color-accent)] mb-6">
                Voice & tone.
              </h2>
              <p className="text-lg text-[var(--color-ink)]/70 leading-relaxed">
                Confident without ego. Clear without complexity. 
                We speak to value, not volume. Benefits over features. Ritual over technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Color System */}
      <section className="py-20 lg:py-32 border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-serif text-5xl text-[var(--color-accent)] mb-4">Palette.</h2>
          <p className="text-lg text-[var(--color-ink)]/60 mb-12 max-w-2xl">
            Five colors. Use sparingly. Espresso for emphasis. Porcelain for warmth.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <ColorBlock 
              name="Espresso" 
              hex="#4B2E22"
              usage="Accent"
              bgClass="bg-[#4B2E22]"
              textClass="text-white"
            />
            <ColorBlock 
              name="Porcelain" 
              hex="#F2E4D2"
              usage="Surface"
              bgClass="bg-[#F2E4D2]"
              textClass="text-[var(--color-ink)]"
            />
            <ColorBlock 
              name="Oat" 
              hex="#D9BE8A"
              usage="Accent 2"
              bgClass="bg-[#D9BE8A]"
              textClass="text-[var(--color-ink)]"
            />
            <ColorBlock 
              name="Ink" 
              hex="#292929"
              usage="Text"
              bgClass="bg-[#292929]"
              textClass="text-white"
            />
            <ColorBlock 
              name="White" 
              hex="#FFFFFF"
              usage="Base"
              bgClass="bg-white border border-ink/10"
              textClass="text-[var(--color-ink)]"
            />
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="py-20 lg:py-32 border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-serif text-5xl text-[var(--color-accent)] mb-4">Typography.</h2>
          <p className="text-lg text-[var(--color-ink)]/60 mb-12 max-w-2xl">
            Two families. Display serif for voice. Sans for clarity.
          </p>
          
          <div className="space-y-16">
            {/* Display */}
            <div>
              <p className="text-sm text-[var(--color-ink)]/50 mb-6 uppercase tracking-wider">Mailendra — Display</p>
              <div className="space-y-8 border-l-2 border-[var(--color-accent)]/20 pl-8">
                <div>
                  <p className="text-serif text-6xl text-[var(--color-accent)] leading-tight">
                    Modern identity.
                  </p>
                  <p className="text-xs text-[var(--color-ink)]/50 mt-2">Hero — 5xl / 3.40rem</p>
                </div>
                <div>
                  <p className="text-serif text-5xl text-[var(--color-accent)] leading-tight">
                    Holistic approach.
                  </p>
                  <p className="text-xs text-[var(--color-ink)]/50 mt-2">Display — 4xl / 2.80rem</p>
                </div>
                <div>
                  <p className="text-serif text-4xl text-[var(--color-ink)] leading-snug">
                    Quality, consistency, craft.
                  </p>
                  <p className="text-xs text-[var(--color-ink)]/50 mt-2">Headline — 3xl / 2.20rem</p>
                </div>
              </div>
            </div>
            
            {/* Sans */}
            <div>
              <p className="text-sm text-[var(--color-ink)]/50 mb-6 uppercase tracking-wider">Frank Ruhl Libre — Sans</p>
              <div className="space-y-6 border-l-2 border-oat/30 pl-8">
                <div>
                  <p className="text-2xl font-bold text-[var(--color-ink)]">
                    Section headings and titles
                  </p>
                  <p className="text-xs text-[var(--color-ink)]/50 mt-2">H2 — 2xl / 1.80rem</p>
                </div>
                <div>
                  <p className="text-xl text-[var(--color-ink)]">
                    Subsection headings for hierarchy
                  </p>
                  <p className="text-xs text-[var(--color-ink)]/50 mt-2">H3 — xl / 1.44rem</p>
                </div>
                <div>
                  <p className="text-lg text-[var(--color-ink)]/80 leading-relaxed max-w-2xl">
                    Lead paragraph styling for introductions and emphasis. 
                    Comfortable line length. Generous spacing.
                  </p>
                  <p className="text-xs text-[var(--color-ink)]/50 mt-2">Lead — lg / 1.20rem</p>
                </div>
                <div>
                  <p className="text-base text-[var(--color-ink)] leading-relaxed max-w-2xl">
                    Body text for reading. Clear hierarchy. Optimal readability. 
                    This is where most content lives.
                  </p>
                  <p className="text-xs text-[var(--color-ink)]/50 mt-2">Body — base / 1.00rem</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-ink)]/60">
                    Small text for captions, hints, and supportive information.
                  </p>
                  <p className="text-xs text-[var(--color-ink)]/50 mt-2">Caption — sm / 0.90rem</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Elevation */}
      <section className="py-20 lg:py-32 border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-serif text-5xl text-[var(--color-accent)] mb-4">Elevation.</h2>
          <p className="text-lg text-[var(--color-ink)]/60 mb-12 max-w-2xl">
            Subtle depth. Soft shadows. Tactile surfaces.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-white border border-ink/10 rounded-xl p-8 h-32 mb-4"></div>
              <p className="text-sm font-bold text-[var(--color-ink)] mb-1">Flat</p>
              <p className="text-xs text-[var(--color-ink)]/60">Minimal border only</p>
            </div>
            <div>
              <div className="card h-32 mb-4"></div>
              <p className="text-sm font-bold text-[var(--color-ink)] mb-1">Soft</p>
              <p className="text-xs text-[var(--color-ink)]/60">Gentle ambient shadow</p>
            </div>
            <div>
              <div className="card-surface h-32 mb-4"></div>
              <p className="text-sm font-bold text-[var(--color-ink)] mb-1">Surface</p>
              <p className="text-xs text-[var(--color-ink)]/60">Tinted background</p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="py-20 lg:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-serif text-5xl text-[var(--color-accent)] mb-12">In practice.</h2>
          
          <div className="space-y-8">
            <Card>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 flex-shrink-0"></span>
                  <p className="text-base text-[var(--color-ink)]">
                    <strong>Lead with benefit.</strong> Not "Advanced payment processing" but "Get paid faster."
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 flex-shrink-0"></span>
                  <p className="text-base text-[var(--color-ink)]">
                    <strong>Respect white space.</strong> Breathing room is not wasted space. It's focus.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 flex-shrink-0"></span>
                  <p className="text-base text-[var(--color-ink)]">
                    <strong>Use color with intent.</strong> Espresso for key actions. Porcelain for warmth. Everything else, restrained.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 flex-shrink-0"></span>
                  <p className="text-base text-[var(--color-ink)]">
                    <strong>Typography is hierarchy.</strong> Display serif commands attention. Sans delivers information.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ColorBlockProps {
  name: string;
  hex: string;
  usage: string;
  bgClass: string;
  textClass: string;
}

function ColorBlock({ name, hex, usage, bgClass, textClass }: ColorBlockProps) {
  return (
    <div>
      <div className={`${bgClass} ${textClass} h-40 rounded-xl flex items-end p-6 mb-3`}>
        <span className="text-sm font-bold">{name}</span>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-[var(--color-ink)] font-bold">{usage}</p>
        <p className="text-xs text-[var(--color-ink)]/50 font-mono">{hex}</p>
      </div>
    </div>
  );
}
