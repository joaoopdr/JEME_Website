/**
 * AboutSection
 *
 * The section that follows the HeroIntro. It opens on a brand-red background
 * to pick up seamlessly from the transition colour of the intro, then gives
 * way to a lighter content area. Expand this component as real copy arrives.
 */
export default function AboutSection() {
  return (
    <section>

      {/* ── Red continuation band ── */}
      {/*
        Matches the brand-primary that the hero ends on, so the colour
        transition feels seamless when the sticky section releases.
      */}
      <div className="bg-brand-primary text-white px-6 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto">
          <p className="text-[0.6875rem] font-semibold tracking-[0.22em] uppercase mb-10 text-white/50">
            Who we are
          </p>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-light leading-[1.2] tracking-tight">
            A strategic partner for organizations
            <br className="hidden md:block" /> that refuse to stand still.
          </h3>
        </div>
      </div>

      {/* ── White content area ── */}
      <div className="bg-white px-6 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20">

          <div>
            <p className="text-[0.6875rem] font-semibold tracking-[0.22em] uppercase mb-6 text-brand-muted">
              Our approach
            </p>
            <h4 className="text-2xl sm:text-3xl font-light leading-snug tracking-tight mb-6 text-brand-text">
              Clarity before complexity
            </h4>
            <p className="text-brand-muted leading-relaxed">
              We start by understanding the real problem — not the stated one.
              Every engagement begins with a diagnostic phase designed to
              surface the assumptions that most firms never question.
            </p>
          </div>

          <div>
            <p className="text-[0.6875rem] font-semibold tracking-[0.22em] uppercase mb-6 text-brand-muted">
              Our impact
            </p>
            <h4 className="text-2xl sm:text-3xl font-light leading-snug tracking-tight mb-6 text-brand-text">
              Decisions that endure
            </h4>
            <p className="text-brand-muted leading-relaxed">
              We measure success not by the delivery of a report but by the
              durability of the decisions it enables. Our teams embed alongside
              yours to ensure recommendations translate into results.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
