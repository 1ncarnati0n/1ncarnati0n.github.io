# Redesign Plan (2026-02-24)

## 1) Goal
- Strengthen first impression as an architect portfolio and technical knowledge base.
- Increase project detail page entry rate and contact intent.
- Improve blog discovery and navigation depth.

## 2) Product Principles
- Show visual authority in under 5 seconds on the home page.
- Keep list pages scannable and fast on mobile.
- Make typography and spacing feel intentional, not template-like.
- Reuse design tokens across all pages before page-level styling.

## 3) Design Concepts (2 options)

## Option A: Architect Grid (Recommended)
- Mood: calm, precise, premium studio.
- Visual language: grid overlays, section labels, restrained color accents, strong whitespace.
- Typography: display `Space Grotesk`, body `Noto Sans KR`, mono `JetBrains Mono`.
- Color direction: warm light grayscale base with terracotta + steel blue accents.
- Best for: portfolio trust, architecture-focused storytelling.

## Option B: Editorial Contrast
- Mood: magazine-like, bold, content-forward.
- Visual language: oversized headings, asymmetrical blocks, large pull quotes.
- Typography: display `Bebas Neue`, body `Noto Serif KR`, mono `JetBrains Mono`.
- Color direction: ivory + charcoal base with deep green + coral accents.
- Best for: blog engagement and strong personal brand voice.

## 4) Information Architecture
- Home: value proposition -> featured projects -> latest posts -> contact CTA.
- Projects list: category filter + visual cards + quick metadata.
- Project detail: hero image + project facts + narrative + related projects.
- Posts list: category sections + tag routes + improved scan rhythm.
- Post detail: readable long-form layout + sticky TOC + metadata hierarchy.

## 5) Implementation Plan (6 weeks)

## Week 1: Discovery + System Skeleton
- Audit current UX friction and define KPI baseline.
- Define token system: color, type scale, spacing, radius, shadows.
- Deliverables: moodboard, token draft, wireframe v1.

## Week 2: Layout System
- Rebuild global frame and navigation in `src/app/layout.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/styles/global.css`.
- Deliverables: new shell layout on desktop/mobile.

## Week 3: Home + Project Cards
- Rebuild `src/app/page.tsx`, `src/components/Hero.tsx`, `src/components/ProjectCard.tsx`.
- Add intentional motion (entry reveal, card hover depth).
- Deliverables: high-impact home page.

## Week 4: Projects Flows
- Rebuild `src/app/projects/page.tsx`, `src/app/projects/[...slug]/page.tsx`, `src/components/ProjectFilter.tsx`.
- Deliverables: improved browsing and project storytelling.

## Week 5: Blog Flows
- Rebuild `src/app/posts/page.tsx`, `src/app/posts/[...slug]/page.tsx`, `src/app/tags/page.tsx`, `src/app/tags/[tag]/page.tsx`, `src/components/TableOfContents.tsx`.
- Deliverables: readable, discoverable article experience.

## Week 6: QA + Performance + Polish
- Accessibility pass (focus states, contrast, keyboard).
- Performance pass (LCP image strategy, CSS cleanup).
- SEO/metadata consistency check.
- Deliverables: release candidate.

## 6) Backlog (Priority by impact)

| ID | Area | Task | Files | Effort | Priority |
|---|---|---|---|---|---|
| D01 | Tokens | Create CSS tokens and utility scales | `src/styles/global.css` | M | P0 |
| D02 | Navigation | Redesign header/nav interaction desktop+mobile | `src/components/Header.tsx` | M | P0 |
| D03 | Home Hero | Replace current hero with clear positioning + CTA | `src/components/Hero.tsx`, `src/app/page.tsx` | M | P0 |
| D04 | Project Cards | New card layout with meta hierarchy | `src/components/ProjectCard.tsx` | S | P0 |
| D05 | Project List | Strong filter UX + masonry/grid rhythm | `src/app/projects/page.tsx`, `src/components/ProjectFilter.tsx` | M | P0 |
| D06 | Project Detail | Visual hero + facts panel + content pacing | `src/app/projects/[...slug]/page.tsx` | L | P0 |
| D07 | Post List | Better section rhythm and readability | `src/app/posts/page.tsx` | M | P1 |
| D08 | Post Detail | Improve meta/toc/prose hierarchy | `src/app/posts/[...slug]/page.tsx`, `src/styles/prose.css` | M | P1 |
| D09 | Tag UX | More useful tag landing and chip design | `src/app/tags/page.tsx`, `src/app/tags/[tag]/page.tsx` | S | P1 |
| D10 | Search Overlay | Visual/interaction redesign + keyboard flow | `src/components/SearchOverlay.tsx` | M | P2 |
| D11 | Sidebar | Improve readability and active states | `src/components/Sidebar.tsx`, `src/styles/sidebar.css` | S | P2 |
| D12 | Motion | Add page transition and stagger reveal | multiple page components | M | P2 |

## 7) Success Metrics
- Project detail page CTR: +25% from current baseline.
- Average session duration on blog pages: +20%.
- Mobile bounce rate on home: -15%.
- Contact click-through from home/projects: +20%.

## 8) Risks and Mitigation
- Risk: visual over-design slows page load.
- Mitigation: image budget, CSS token discipline, performance check each sprint.
- Risk: inconsistent style across pages.
- Mitigation: freeze token system before page implementation.
- Risk: scope creep.
- Mitigation: enforce P0 -> P1 -> P2 order.

## 9) Immediate Next Step
- Pick one concept: `A` Architect Grid (portfolio-first, recommended) or `B` Editorial Contrast (blog-first).
- Then execute Week 1 deliverables before any full-page rewrite.
