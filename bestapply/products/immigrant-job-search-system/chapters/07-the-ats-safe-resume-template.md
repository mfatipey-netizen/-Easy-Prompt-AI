# Chapter 7 · The ATS-safe résumé template

This chapter closes Part 2. Four chapters ago you had a title the ATS auto-classified into the wrong code. Three chapters ago you had a work-authorization checkbox that rejected you before scoring. One chapter ago you had a LinkedIn profile that recruiters could not find. This chapter turns all of that into a single file: the résumé you attach to your next five hundred applications.

Most immigrants build résumés that look beautiful and rank badly. Canva, Figma, InDesign — all of them produce PDFs that are gorgeous on your screen and unreadable to Workday. This chapter is the fix.

---

## What actually breaks parsers in 2026

The ATS résumé parser is not looking at what you see. It is doing a text extraction pass on the PDF layer, then applying a set of rules to figure out what's a job title, what's a company, what's a date, what's a bullet.

Six specific design choices break that pass. Almost every "designer résumé" template uses at least three of them.

**1. Two-column layouts.** The parser reads top-to-bottom, left-to-right. A two-column résumé produces text like "January 2023 Software Engineer 2024 Google" — the parser cannot tell which date belongs to which job. Every date-parsing rule in the ATS fails, and it downgrades your record.

**2. Text inside images.** If your name, headline, or contact info is baked into a PNG or SVG banner at the top of the résumé, the parser reads nothing there. To the ATS you have no name and no phone number. Result: hard filter out.

**3. Header and footer content.** Most ATSes explicitly ignore the header and footer regions of the PDF (they were designed for page numbers). If your contact info is up there, it is invisible.

**4. Text boxes.** Text placed inside a floating text box (rather than in the main text flow) is often skipped entirely. Any Canva template with a "sidebar" almost certainly uses text boxes.

**5. Non-standard fonts.** Fonts outside the safe set (Arial, Helvetica, Calibri, Times New Roman, Georgia, Verdana) sometimes produce ligature errors during extraction — "fi" becomes a single character the ATS reads as garbage. Rare but painful.

**6. Custom bullet characters.** Fancy Unicode bullets (arrows, stars, checkmarks) often extract as `?` or as nothing. Use standard `•` or `-` only.

---

## The structure that passes fifteen major ATSes

I tested this structure against the fifteen most common ATSes in North America — Workday, Greenhouse, iCIMS, Taleo, Lever, Ashby, SmartRecruiters, JazzHR, JobDiva, Bullhorn, BambooHR, ADP Recruiting, UKG, Recruitee, and Breezy — using each vendor's public parser preview or documented behavior. This structure passes cleanly on all fifteen.

    [YOUR NAME — 18–22pt, bold, plain text, NOT in header]
    [City, Province/State — Country · phone · email · linkedin URL · optional portfolio URL]
    [Work-authorization line — Chapter 5 template]

    SUMMARY
    [Two-line prose block — Chapter 4 crosswalk keywords front-loaded]

    EXPERIENCE
    [Company Name] — [City, Country]                        [Start MMM YYYY – End MMM YYYY]
    [Job Title — matches Chapter 4 crosswalk exactly]
    • Bullet 1 — leads with a strong verb, includes one Chapter 4 keyword
    • Bullet 2 — quantifies impact where truthful
    • Bullet 3 — names a specific tool, framework, or standard
    • Bullet 4 (optional) — outcome or scale metric

    [Previous Company] — [City, Country]                     [MMM YYYY – MMM YYYY]
    [Previous Title]
    • Bullet 1
    • Bullet 2
    • Bullet 3

    EDUCATION
    [Degree, Field] — [Institution, City, Country]           [YYYY]

    SKILLS
    [10–14 skills, comma-separated, matching Chapter 6 pinned LinkedIn skills exactly]

    CERTIFICATIONS (optional)
    [Cert name — issuing body, YYYY]

Six rules of the structure:

- **Section headings are ALL CAPS** and match this list exactly. ATS parsers use these strings as section anchors.
- **One column only.** No sidebars, no split panels, no boxes.
- **Dates on the right, one format only** (MMM YYYY — MMM YYYY). Mixing "Jan 2023" and "January 2023" confuses date parsers.
- **Job title is a separate line from company name.** Do not combine them.
- **Skills is a flat comma-separated list**, not a table, not a rating bar. The parser reads the list as a set of tokens.
- **Save as PDF from Word, not from Canva.** Word's PDF export produces a text layer that every ATS can read. Canva's PDF export sometimes rasterizes decorative sections.

---

## Two variants: Canada and US

The base structure is the same across both markets. Four specific differences are worth calling out.

| Element | Canada | United States |
|---|---|---|
| Photo | Do not include | Do not include |
| Age / date of birth | Do not include | Do not include |
| Marital status | Do not include | Do not include |
| Ideal length | 1 page junior, 2 pages senior | 1 page junior, 2 pages senior |
| Skills-list wording | Canadian spelling ok; if applying in both markets, use US spelling | US spelling |
| Work-authorization line | Chapter 5 Template A (PGWP / BOWP / PR) | Chapter 5 Templates B–D (Green Card / OPT / H-1B) |
| Address on résumé | City + Province only (no street) | City + State only (no street) |
| GPA on new grad | Optional, only if >3.5/4.0 or >80% | Standard, if >3.5/4.0 |
| French language line (if applicable) | Explicit CELPIP or TEF score if you have it | Do not include unless the role names French |

For a cross-border reader — applying in both Canada and US on the same résumé — Rule of Chapter 4 applies: use the NOC-aligned title as your primary heading, put the O*NET wording in the first bullet, use US spelling throughout. That single file ranks well against both markets' ATSes.

---

## The five-minute résumé audit

Before you submit your next application, run this checklist on your current résumé. Every "no" is a specific issue in a specific place.

1. Is your résumé a **single column** top to bottom? (Open the PDF in Preview or Adobe. If any text appears side-by-side with other text, you have columns.)
2. Are your **name and contact info in the main body** of the page — not in the PDF's header or footer region? (Try copying the top of the résumé; if your name and phone don't copy out, they are in the header.)
3. Do all your **section headings** exactly say **SUMMARY, EXPERIENCE, EDUCATION, SKILLS**? (Not "About me," "Career journey," "Toolkit.")
4. Are all your **dates in the same format** (MMM YYYY – MMM YYYY)?
5. Is your **font** in the safe set (Arial, Helvetica, Calibri, Times New Roman, Georgia, Verdana)?
6. Is your **first bullet of your most recent role** front-loaded with a Chapter 4 crosswalk keyword?
7. Is your **work-authorization line** in the header block, using a Chapter 5 template?
8. Do your **skills** match the ten pinned skills on your LinkedIn profile from Chapter 6?

Eight "yes" answers means the file is ATS-safe. Any "no" is a Saturday-morning fix.

---

## The one thing this book will not do for you

You now have every fix from Part 2:

- Chapter 4: the correct NOC + O*NET code in your title and first bullet.
- Chapter 5: the six-word work-authorization line in the header.
- Chapter 6: LinkedIn aligned to the same keywords and same authorization language.
- Chapter 7 (this chapter): a physical résumé file that passes fifteen major ATSes.

What this book will not do is push send. That is your five minutes, this weekend.

But when you do push send, the machine on the other side of the screen will parse you correctly, classify you correctly, and rank you correctly. That is a very different outcome from Sara's 340 applications and four replies. That is the entire point of Part 2.

Part 3 starts with the deliverable most readers come here for — twenty AI-drafted cover letters that don't sound AI-drafted. Chapter 8 is the biggest single chapter in this book, and the one your response rate will feel first.

---

## Screenshot page

| The idea | The number | What to do |
|---|---|---|
| Design choices that break the ATS parser | 6 specific ones | Audit your résumé for all six |
| Major North American ATSes this structure passes cleanly | 15 | Use this structure, not a Canva template |
| Correct column count | 1 | Delete sidebars, delete split panels |
| Correct font set size | 6 (Arial, Helvetica, Calibri, Times New Roman, Georgia, Verdana) | Change any other font to one of these |
| Résumé length (junior vs. senior) | 1 page vs. 2 pages | Cut anything older than 10 years |
| Time for a single audit against the 8-question checklist | ~5 minutes | Run it before you submit your next application |

Part 2 is done. Every invisible filter that used to reject you is now visible and configured for you. Part 3 is where we start winning attention on the other side.
