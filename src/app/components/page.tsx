import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Stat } from "@/components/ui/stat";
import { PlanCard } from "@/components/ui/plan-card";
 

export default function ComponentsPage() {
  return (
    <div className="bg-[var(--color-porcelain)]">
      {/* Hero */}
      <section className="py-20 lg:py-32 border-b border-[var(--color-ink)]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="kicker mb-6">Components</p>
          <h1 className="text-serif text-6xl lg:text-7xl text-[var(--color-accent)] mb-8 leading-tight">
            UI Kit.
          </h1>
          <p className="text-2xl text-[var(--color-ink)]/80 max-w-2xl leading-relaxed">
            Accessible primitives and composites. Built for consistency and craft.
          </p>
        </div>
      </section>

      {/* Buttons */}
      <section className="py-20 lg:py-32 border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-serif text-5xl text-[var(--color-accent)] mb-4">Buttons.</h2>
          <p className="text-lg text-[var(--color-ink)]/60 mb-12">
            Four variants. Clear hierarchy. Micro-interactions on hover.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Button variant="primary" className="w-full mb-3">Primary</Button>
              <p className="text-sm text-[var(--color-ink)]/60">Key actions</p>
            </div>
            <div>
              <Button variant="secondary" className="w-full mb-3">Secondary</Button>
              <p className="text-sm text-[var(--color-ink)]/60">Support actions</p>
            </div>
            <div>
              <Button variant="ghost" className="w-full mb-3">Ghost</Button>
              <p className="text-sm text-[var(--color-ink)]/60">Tertiary actions</p>
            </div>
            <div>
              <Button variant="link" className="mb-3">Link style</Button>
              <p className="text-sm text-[var(--color-ink)]/60">Inline actions</p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-surface rounded-xl">
            <p className="text-sm text-[var(--color-ink)]/70 mb-4">States</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Default</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Badges & Labels */}
      <section className="py-20 lg:py-32 border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-serif text-5xl text-[var(--color-accent)] mb-4">Badges.</h2>
          <p className="text-lg text-[var(--color-ink)]/60 mb-12">
            Compact labels. Three semantic tones.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <Badge tone="ink">Default</Badge>
              <p className="text-xs text-[var(--color-ink)]/50 mt-2">Neutral</p>
            </div>
            <div>
              <Badge tone="oat">Featured</Badge>
              <p className="text-xs text-[var(--color-ink)]/50 mt-2">Accent</p>
            </div>
            <div>
              <Badge tone="espresso">Premium</Badge>
              <p className="text-xs text-[var(--color-ink)]/50 mt-2">Emphasis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section className="py-20 lg:py-32 border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-serif text-5xl text-[var(--color-accent)] mb-4">Inputs.</h2>
          <p className="text-lg text-[var(--color-ink)]/60 mb-12">
            44px touch targets. Clear labels. Visible focus states.
          </p>
          
          <div className="max-w-2xl space-y-6">
            <Input 
              label="Email address" 
              type="email" 
              placeholder="hello@example.com"
            />
            <Input 
              label="Full name" 
              type="text" 
              placeholder="Your name"
            />
            <Input 
              label="Error example" 
              type="text" 
              error="This field is required"
              placeholder="Required field"
            />
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section className="py-20 lg:py-32 border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-serif text-5xl text-[var(--color-accent)] mb-4">Alerts.</h2>
          <p className="text-lg text-[var(--color-ink)]/60 mb-12">
            Inline feedback. Gentle backgrounds. Clear messaging.
          </p>
          
          <div className="max-w-2xl space-y-4">
            <Alert tone="ok">
              Your membership is active. Next billing date: March 15.
            </Alert>
            <Alert tone="warn">
              Payment method expires soon. Update your card details.
            </Alert>
            <Alert tone="error">
              Unable to process payment. Please verify your information.
            </Alert>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 lg:py-32 border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-serif text-5xl text-[var(--color-accent)] mb-4">Statistics.</h2>
          <p className="text-lg text-[var(--color-ink)]/60 mb-12">
            Numeric emphasis. Display serif for values.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <Stat label="Active members" value="2.4K" />
            <Stat label="Daily visits" value="850" />
            <Stat label="Satisfaction" value="98%" />
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20 lg:py-32 border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-serif text-5xl text-[var(--color-accent)] mb-4">Cards.</h2>
          <p className="text-lg text-[var(--color-ink)]/60 mb-12">
            Content containers. Optional titles. Surface variants.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="Standard card">
              <p className="text-base text-[var(--color-ink)]/70 leading-relaxed">
                White background with subtle border and soft shadow. 
                Primary surface for content.
              </p>
            </Card>
            
            <Card title="Surface card" surface>
              <p className="text-base text-[var(--color-ink)]/70 leading-relaxed">
                Porcelain background for featured sections and warm accents. 
                Tactile and inviting.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="py-20 lg:py-32 border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-serif text-5xl text-[var(--color-accent)] mb-4">Plan cards.</h2>
          <p className="text-lg text-[var(--color-ink)]/60 mb-12">
            Pricing display. Featured state. Benefit lists with espresso bullets.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <PlanCard 
              name="Student Monthly"
              price="$12/mo"
              perks={[
                "1 drink per day",
                "Member pricing",
                "Member dashboard",
                "Cancel anytime"
              ]}
            />
            <PlanCard 
              name="Semester"
              price="$49/sem"
              perks={[
                "5 months coverage",
                "Priority perks",
                "Member dashboard",
                "Best value"
              ]}
              featured
            />
          </div>
        </div>
      </section>

      
    </div>
  );
}
