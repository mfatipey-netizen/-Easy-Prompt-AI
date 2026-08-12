# Style Guide — The Immigrant's AI Job Search System

This file is the running rulebook for every chapter, in both English and
Persian. When we make an editorial decision that should apply everywhere,
we write it down here so a later chapter never quietly undoes the choice.

---

## Voice

### English
- Second-person "you" throughout — reader is the addressee, not "the reader"
- Immigrant-to-immigrant register: direct, warm, evidence-based
- No corporate-speak: no "leverage", no "utilize", no "individuals" for people
- Contractions are welcome ("you're", "don't", "it's") — this book is not a legal brief
- Sentences vary in length; short ones do most of the emotional work
- Zero motivational-speaker language ("You've got this!", "Believe!", "Manifest!")

### Persian
- Second-person **تو** (informal you), Hedayat-style colloquial voice — the exhausted immigrant reader needs a friend at a café, not a consultant at a podium
- Contractions everywhere: میشه, نمیده, داره, باشه, میگه, می‌کنی
- Everyday word choice: بذار، بگیر، بشنو، بذار حسابشو بکنیم
- Clean prose, not slang — no لاتی or کوچه‌بازاری
- Rhythm matters: short sentences carry the punches, longer ones for the reasoning

---

## Dialogue formatting (both languages)

When two or more people speak, attribute every line clearly. Persian is more
prone to ambiguity than English because "گفت" without a name can float, so
we mark speakers explicitly.

### Persian pattern

```
از سارا پرسیدم چه حسی داره.

— **سارا:** حس می‌کنم یه‌جای کارم اشتباه بوده.

بهش گفتم مشکل خودش نیست.

— **سارا:** پس چرا هیچ کس جواب نمیده؟
— **من:** چون قبل از این‌که به آدما برسی، ATS بیشترشون رو ردت می‌کنه.
```

Rules:
- Em-dash `—` at the start of every dialogue line
- Bold speaker name + colon (`**سارا:**`) so the eye finds the tag instantly
- Even a single reply gets the tag — never rely on the reader inferring "she said"
- Author's own voice, when the author is speaking, is tagged `**من:**`

### English pattern

Standard fiction convention is enough for English because quoted-with-tag
prose is unambiguous:

```
I asked Sara how she felt.

"Like I did something wrong," she said.

I told her the problem wasn't hers.

"Then why does no one reply?" she asked.
"Because before you reach a human, the ATS filters most of them out," I said.
```

For English, use double quotes + attribution tag (`she said`, `he asked`, `I told her`). Don't leave a line un-attributed unless the previous line makes the speaker obvious.

---

## Technical terms

### Keep in English (both language versions)
`application`, `apply`, `cover letter`, `resume`, `LinkedIn`, `ATS`, `NOC`,
`O*NET`, `PGWP`, `BOWP`, `OPT`, `STEM Extension`, `H-1B`, `EAD`, `TN`,
`Express Entry`, `CRS`, `LMIA`, `Workday`, `Greenhouse`, `iCIMS`, `recruiter`,
`sponsor`, `offer`, `interview`, `job hunting`, `remote`

### Persian-speaking professionals in North America use these terms in
English in daily conversation. Translating them (نامه پوششی، سیستم رهگیری
متقاضی) feels stilted and instantly signals "translated". Reader trust drops.

### Translate to Persian
General nouns and verbs that have natural, unforced Persian equivalents:
"job market" → بازار کار, "response rate" → نرخ پاسخ, "salary" → حقوق,
"employer" → کارفرما, "immigrant" → مهاجر, "runway" → مدت اقامت / فرصت.

---

## Numbers

- Western digits (250, 2%, 500) in every table, chart, and stat citation
- Persian digits (سیصد و چهل، نه هفته) inside narrative prose when they read
  more naturally
- Currency: always with unit — `C$47`, `US$47`. Never bare `$47` in a book
  read across two countries.

---

## The book's spine sentence

Every chapter should be able to point back to this sentence. If a chapter's
argument doesn't ladder into the spine, either the chapter is off-topic or
the spine needs revising — check with the author before the chapter ships.

### English
> **Every rejected application costs an immigrant more than time. It also takes the will to send the next one.**

### Persian
> **هر application ردشده‌ای که یه مهاجر باهاش مواجه می‌شه، غیر از زمان، انگیزهٔ ادامه دادن رو هم ازش می‌گیره.**

---

## Sources & footnotes

- Every stat needs a source. No invented numbers. If a claim can't be
  sourced, either drop it or rephrase as "our own analysis of N cases"
- In-line citations by short-name only during drafting (LinkedIn Talent
  Insights, TalentWorks, Jobscan, IRCC Express Entry rounds, StatCan
  Labour Force Survey, BLS Occupational Employment, USCIS H-1B data)
- Full URL footnotes get added at typesetting time, not during writing
- Persian numeric conventions inside footnotes match English (Western digits)

---

## Section headings

- `#` — chapter title
- `##` — major section
- `###` — subsection
- Never use `####` — if a section needs a further break, it's usually two sections

Persian headings mirror the English structure but use natural Persian phrasing
(not a word-for-word translation of the English heading).

---

## Chapter length

Target: **~1,000 words per chapter** for the body of the book. Chapters 1
and 17 (framing + action plan) can run 1,200–1,500 words. If a chapter
crosses 1,600 words, consider splitting.

Persian versions run 10–15% shorter than English due to language efficiency.
That's expected — don't pad to match.

---

## Filename convention

- `NN-slug.md` — English (`01-the-250-to-1-wall.md`)
- `NN-slug.fa.md` — Persian source (`01-the-250-to-1-wall.fa.md`)
- `NN-slug.fa.docx` — Persian print-ready DOCX, generated from `.fa.md` (do not edit by hand)
- All three live in `chapters/`
- Slug matches between languages so a `git log --follow` shows both together

## Persian footnote convention (glossary for English terms)

Every English technical term used in a Persian chapter gets a footnote on
its first appearance. Use pandoc footnote syntax:

    این یه application[^application] که به کارفرما فرستادی.

    [^application]: **application**: درخواست شغلی. توی جامعهٔ مهاجرین
      آمریکای شمالی معمولاً به همین شکل انگلیسی استفاده می‌شه.

Rules:
- Footnote only on **first appearance** in a chapter, not every time
- Bold the term (`**application**:`) so the eye finds it fast
- Short definition + a one-sentence context note
- Every footnote gets carried into the DOCX as a real Word footnote by
  the build script — so the print layout has proper page-bottom notes,
  not endnotes

## Persian DOCX build

Whenever `.fa.md` changes, regenerate the print-ready DOCX with the
project's build script:

    python3 build-fa-docx.py chapters/NN-slug.fa.md

This runs pandoc, then post-processes the resulting DOCX so every
paragraph (body + footnotes + table cells) has `<w:bidi/>` +
`w:jc="right"` + `<w:rtl/>` on every run. Word / LibreOffice / Google
Docs need all three to render Persian print-ready without hand-editing.

Requirements: `pandoc` (apt: `pandoc`) and `python-docx` (pip:
`python-docx`).
