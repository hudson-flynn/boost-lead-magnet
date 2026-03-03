# Boost Lead Magnet - Project Context

## What This Is

A lead magnet tool for Boost My School (a K-12 fundraising platform). It lets prospective schools fill out a form with their school name, colors, logo, and fundraising goals, then generates a pixel-perfect preview of what their annual giving page would look like on Boost's platform.

**Business goal:** Generate leads by showing schools exactly what they'd get. The preview should look nearly identical to real Boost campaign pages.

## Current State

We're on **v7** of the component. The form works, the preview generates, but there are still visual refinements needed to match the actual Boost platform exactly.

## Tech Stack

- React (single component, all in App.jsx)
- Vite for build
- No external CSS - all inline styles
- Deploying to Vercel

## Design Reference

The design should match actual Boost annual fund pages. Key examples:
- Charles Wright Academy: https://www.boostmyschool.com/charleswrightacademy/allin
- Bryn Mawr: https://www.boostmyschool.com/brynmawrschool/annualfund

## Key Design Specs (from Boost CSS)

- **Font family:** 'Open Sans', Arial, Helvetica, sans-serif
- **Border radius:** 4px throughout (buttons, cards, progress bars)
- **Box shadows:** 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24)
- **Primary color:** User-selected (default #1b603a - CWA green)
- **Secondary color:** User-selected (default #76bd22 - CWA lime green)

## Page Structure

### Form View
User inputs:
- School Name (required)
- Annual Fund Name (required)
- Fundraising Goal $ (required)
- Supporter Goal # (required)
- Primary Color (color picker + hex input)
- Secondary Color (color picker + hex input)
- School Logo (optional upload)
- Toggle: Show Challenges tab
- Toggle: Show Leaderboards tab
- Current Fundraising Platform (dropdown)
- Current CRM (dropdown)
- Email (required)

### Preview View

**Hero Section (Split Layout):**
- TOP: Full-width background image, no overlay
- BOTTOM: Solid opaque primary color block containing:
  - Fund name (h1)
  - Description paragraph
  - Progress bar with arrow
  - Stats: dollar amount raised + supporter count (EQUAL font sizes)
- Logo box floats top-left over the image
- "There is 1 active challenge!" banner (if challenges enabled)
- CTA button: "Give (or Pledge) Today"

**Giving Buckets:**
- 3-column grid
- Each card: image placeholder, title, "Give Now" button, description

**Tab Navigation:**
- Full-width PRIMARY COLOR background
- White text
- Badges: WHITE background, PRIMARY color text
- Active tab: gray/muted underline

**Tabs:**
- About (challenge preview card, leaderboard preview, updates)
- FAQ (accordion)
- Challenges (active + completed challenge cards with progress bars)
- Leaderboards (community leaderboard + class participation leaderboard)
- Supporters (2-column grid with quote cards)
- Comments (2-column masonry with commenter avatars)

**Footer:**
- Primary color background
- Centered school logo
- White CTA box: "Want this for [School Name]?" with Book a Demo button

## Visual Elements That Must Match Boost

1. **Progress bar with arrow:** Bar has 4px border-radius, arrow/triangle extends OUTSIDE the bar to the right
2. **Tab badges:** White background, primary color text
3. **Leaderboard rows:** Alternating background colors (#f7f7f7 every other row)
4. **Supporter quote cards:** Quote icon SVG to the LEFT of text (not above)
5. **Hover effects:** All buttons darken on hover
6. **Class participation leaderboard:** Shows class year, "X of Y have supported", progress bar with percentage

## Data Anonymization

All mock data must be generic - no real names from any actual school:
- Use names like "The Martinez Family", "Sarah & David K.", "Anonymous"
- Challenge titles like "Family Participation Challenge", "Alumni Giving Challenge"
- No school-specific mascots, hashtags, or references

## Files

- `src/App.jsx` - The entire component (form + preview)
- No separate CSS files - all styles inline

## What Still Might Need Work

- Progress bar arrow rendering (has been tricky)
- Fine-tuning spacing/sizing to match Boost exactly
- Mobile responsiveness (currently out of scope)
- Any visual differences when compared to live Boost pages

## Commands

```bash
npm run dev      # Local development
npm run build    # Build for production
```

## Deployment

Push to GitHub, then import to Vercel. Vercel auto-detects Vite. The app is correct and up to date.
