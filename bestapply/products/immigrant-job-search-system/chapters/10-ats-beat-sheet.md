# Chapter 10 · The ATS beat sheet

Chapter 9 gave you fifty prompts, sorted by response rate. Several of them (A4, D8, D1) call for you to feed the AI "the top-weighted ATS keywords for this role." This chapter is what you feed them.

It is the least glamorous chapter in the book and the one that most reliably moves reply rate. Not because the keywords are secret — they are not. Because immigrants routinely under-hit the target frequencies and use the wrong section for each keyword, which is a category of mistake the machine can measure and the human never sees.

Every rejected application costs an immigrant more than time. It also takes the will to send the next one. This chapter is where you stop losing to invisible math.

---

## How ATSes actually count keywords

Every major ATS (Workday, Greenhouse, iCIMS, Taleo, Lever, Ashby) does the same four things to your file, in the same order:

1. **Tokenizes** the résumé, cover letter, and portal free-text into a bag of terms.
2. **Weights** each term based on the section it appears in — the same word in your Summary weighs 3–5× the same word in a mid-résumé bullet, and 10–20× the same word buried in a footer.
3. **Multiplies** by frequency, with steep diminishing returns after 3 occurrences and often a penalty flag after 6.
4. **Checks adjacency** — keywords that appear near each other, in the same bullet or the same paragraph, rank higher than the same keywords scattered across four pages.

Two implications you need in front of you:

- **The Summary is 3–5× a bullet.** If the target keyword is not in your Summary, you are burning 60–80% of its value even if it appears three times elsewhere.
- **Frequency is not linear.** One appearance of "Kubernetes" in your Summary and two in your Experience section beats seven scattered mentions with none in Summary. Aim for 3 total, distributed by section, not 7 total anywhere.

The rest of this chapter is the beat sheet — the exact target frequencies, by section, for the top ten keywords in each of the ten most common immigrant-targeted roles.

---

## The three-strike test

Before we get to the tables, one rule that governs every keyword in this chapter: **every S-tier keyword should appear in exactly three places** — your résumé, your cover letter, and your LinkedIn profile. Not four. Not two.

- **Résumé:** target frequency from the table below (usually 2–3).
- **Cover letter:** exactly 1, in either paragraph 1 or paragraph 2.
- **LinkedIn:** in your headline (if it's a top-3 keyword) and in your About section (any top-10 keyword).

A keyword that appears in all three sends the strongest signal a recruiter's search and the ATS's parser can read. A keyword that appears in only one channel is dismissed as a fluke. A keyword that appears four+ times in one channel triggers the stuffing filter.

Immigrants routinely fail this test the same way: heavy résumé (they load 6+ mentions of the target term), zero LinkedIn (they never updated it after landing), and one generic cover-letter mention that could be about any role. That distribution rank-fails on every ATS and reads generic to every human.

---

## Reading the tables

Each table below covers one role. Columns:

- **Keyword:** the exact string the ATS is looking for. Case does not matter for ATS parsing but does for the human reader — use natural case in your résumé.
- **Résumé frequency (target):** how many times the keyword should appear in your résumé, distributed across Summary + Experience + Skills.
- **Section priority:** which sections must contain at least one occurrence. `S/E/K` = Summary / Experience / Skills. `S/E` means Summary + Experience are mandatory, Skills is optional.
- **Cover-letter frequency:** 0 or 1. If 1, which paragraph — `P1` or `P2`.
- **LinkedIn:** where it must appear — `H` = Headline, `A` = About, `SK` = pinned Skills section.
- **Adjacency:** keywords that should appear in the *same bullet* as this one for adjacency lift.

The tables are calibrated for **default Workday-style parsing**, which is the most common in NA and the strictest. If it passes Workday, it passes the other fourteen.

---

## Tech (5 roles)

### Software Engineer

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Software Engineer *(or Full-stack / Backend / Frontend as your title)* | 3 | S/E/K | 1 (P1) | H, A | — |
| *primary language* (e.g., **Python**, **TypeScript**, **Go**) | 3 | S/E/K | 1 (P2) | H, A, SK | *framework* |
| *primary framework* (e.g., **React**, **Django**, **Node.js**) | 3 | S/E/K | 1 (P2) | A, SK | *language* |
| **AWS** (or **GCP** / **Azure** — pick the one that matches) | 2 | E/K | 0 | A, SK | *deployment noun* (Kubernetes, Terraform) |
| **REST API** (or **GraphQL**) | 2 | E/K | 0 | A, SK | *framework* |
| **CI/CD** | 2 | E/K | 0 | A, SK | *tool* (GitHub Actions, Jenkins) |
| **Docker** | 2 | E/K | 0 | A, SK | Kubernetes |
| **Kubernetes** (if you have real experience) | 2 | E/K | 0 | SK | Docker, AWS |
| **PostgreSQL** (or **MySQL** / **MongoDB**) | 2 | E/K | 0 | SK | *language* |
| **Agile** (or **Scrum**) | 1 | E | 0 | A | — |

**Gotcha:** the two mistakes here are (a) listing five languages in Skills when you only ship in one — dilutes the primary-language signal by 60% — and (b) mentioning Kubernetes on the résumé when your actual experience is 4 hours of a tutorial. Every keyword must be defensible in a 30-second interview probe.

### Data Engineer / Data Analyst

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Data Engineer *(or Analytics Engineer / Data Analyst as your title)* | 3 | S/E/K | 1 (P1) | H, A | — |
| **SQL** | 4 | S/E/K | 1 (P2) | H, A, SK | *warehouse* |
| **Python** | 3 | S/E/K | 0 | A, SK | pandas, Airflow |
| *cloud warehouse* (**Snowflake** / **BigQuery** / **Redshift**) | 3 | S/E/K | 1 (P2) | A, SK | dbt |
| **dbt** | 2 | E/K | 0 | A, SK | *warehouse*, SQL |
| **Airflow** (or **Prefect** / **Dagster**) | 2 | E/K | 0 | A, SK | Python |
| **ETL** (or **ELT**) | 2 | E/K | 0 | A, SK | *warehouse* |
| **Tableau** (or **Looker** / **Power BI**) | 2 | E/K | 0 | A, SK | SQL |
| **AWS** (or **GCP**) | 2 | E/K | 0 | A, SK | *warehouse* |
| **data modeling** | 1 | E | 0 | A | dbt |

**Gotcha:** SQL is the exception to the "3 max" rule — it should appear 4+ times because the top ATSes for this role weight SQL frequency more heavily than any other single term. Also: pick ONE warehouse and one BI tool. Listing all three warehouses and all three BI tools rank-fails as noise.

### ML Engineer

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Machine Learning Engineer *(or Applied ML Scientist)* | 3 | S/E/K | 1 (P1) | H, A | — |
| **PyTorch** (or **TensorFlow** — pick one) | 3 | S/E/K | 1 (P2) | H, A, SK | Python |
| **Python** | 3 | S/E/K | 0 | A, SK | PyTorch |
| **LLM** (or **transformer** / **GPT** / **BERT**) | 3 | S/E/K | 1 (P2) | A, SK | fine-tuning, RAG |
| **fine-tuning** (or **RLHF** / **DPO**) | 2 | E/K | 0 | A, SK | LLM |
| **RAG** (retrieval-augmented generation) | 2 | E/K | 0 | A, SK | LLM, vector database |
| **MLOps** | 2 | E/K | 0 | A, SK | *cloud* |
| **AWS SageMaker** (or **Vertex AI** / **Azure ML**) | 2 | E/K | 0 | SK | MLOps |
| **eval** (or **evaluation harness**) | 2 | E | 0 | A | LLM |
| **feature engineering** | 1 | E | 0 | A | Python |

**Gotcha:** the ML space moves fast enough that the ATS keyword list will shift every 6 months. If you are applying today, LLM/RAG/fine-tuning are S-tier; classical ML terms (random forest, XGBoost) are now B-tier for ML Engineer specifically. Re-check every 6 months for your target companies.

### DevOps / SRE

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| DevOps Engineer *(or Site Reliability Engineer / Platform Engineer)* | 3 | S/E/K | 1 (P1) | H, A | — |
| **Kubernetes** | 4 | S/E/K | 1 (P2) | H, A, SK | Docker, *cloud* |
| **AWS** (or **GCP** / **Azure**) | 3 | S/E/K | 1 (P2) | H, A, SK | Kubernetes, Terraform |
| **Terraform** | 3 | S/E/K | 0 | A, SK | *cloud* |
| **CI/CD** | 3 | E/K | 0 | A, SK | *tool* |
| **Docker** | 2 | E/K | 0 | A, SK | Kubernetes |
| **Prometheus** (or **Grafana** / **Datadog**) | 2 | E/K | 0 | A, SK | observability |
| **Linux** | 2 | E/K | 0 | SK | — |
| **incident response** (or **on-call**) | 2 | E | 0 | A | SRE |
| **Python** (or **Go** / **Bash**) | 2 | E/K | 0 | SK | automation |

**Gotcha:** DevOps résumés often over-index on tool lists and under-index on outcome verbs — the beat sheet says frequency, but if all four Kubernetes mentions are in a Skills bullet list, adjacency lift is zero. Distribute across Summary and Experience narratives.

### QA / Test Engineer

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| QA Engineer *(or Test Automation / SDET)* | 3 | S/E/K | 1 (P1) | H, A | — |
| **automation** (or **automated testing**) | 3 | S/E/K | 1 (P2) | H, A, SK | *framework* |
| *framework* (**Selenium** / **Cypress** / **Playwright**) | 3 | S/E/K | 1 (P2) | A, SK | automation |
| **API testing** | 2 | E/K | 0 | A, SK | Postman, REST |
| **regression** (or **regression suite**) | 2 | E/K | 0 | A | — |
| **CI/CD** | 2 | E/K | 0 | A, SK | *framework* |
| **Python** (or **JavaScript**) | 2 | E/K | 0 | SK | *framework* |
| **Agile** | 2 | E | 0 | A | — |
| **test plan** | 1 | E | 0 | A | — |
| **defect tracking** (or **Jira**) | 1 | E/K | 0 | SK | — |

---

## Finance (2 roles)

### Financial Analyst / FP&A

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Financial Analyst *(or FP&A / Senior Analyst)* | 3 | S/E/K | 1 (P1) | H, A | — |
| **FP&A** | 3 | S/E/K | 1 (P2) | H, A, SK | forecasting |
| **forecasting** (or **modeling**) | 3 | S/E/K | 0 | A, SK | FP&A |
| **variance analysis** | 2 | E | 0 | A | forecasting |
| **budgeting** | 2 | E/K | 0 | A, SK | — |
| **Excel** (or **advanced Excel**) | 3 | E/K | 0 | SK | — |
| **SQL** | 2 | E/K | 1 (P2 if targeting SaaS) | A, SK | Tableau |
| **NetSuite** (or **SAP** / **Oracle** — match target) | 2 | E/K | 0 | SK | — |
| **CPA** (or **CFA** — list if you have it, mandatory keyword) | 2 | S/E/K | 1 (P1 if you hold it) | H, A, SK | — |
| **IFRS** (or **GAAP** — match target market) | 2 | E/K | 0 | A | — |

**Gotcha:** the credential (CPA/CFA/CMA) is the single highest-weight token in this ATS parser for this role. If you hold one, it MUST be in your Summary line and your headline. If you don't hold one, do not list it — but do list your in-progress certification with the expected date, which ATSes credit partially.

### Senior Accountant / Auditor

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Senior Accountant *(or Audit Senior / Assurance Associate)* | 3 | S/E/K | 1 (P1) | H, A | — |
| **CPA** | 3 | S/E/K | 1 (P1) | H, A, SK | *market* (Ontario, US, etc.) |
| **IFRS** (Canada) or **US GAAP** (US) | 3 | S/E/K | 1 (P2) | A, SK | *audit standard* |
| **month-end close** (or **year-end close**) | 3 | E/K | 0 | A, SK | reconciliation |
| **reconciliation** | 2 | E/K | 0 | A, SK | month-end close |
| **audit** (or **assurance**) | 2 | E/K | 1 (P2 if targeting audit firm) | A | IFRS or GAAP |
| **NetSuite** (or **QuickBooks** / **SAP** — match target) | 2 | E/K | 0 | SK | — |
| **internal controls** (or **SOX**) | 2 | E | 0 | A | audit |
| **tax provision** (if applicable) | 1 | E | 0 | A | — |
| **Big 4** (only if you worked at one — mandatory tag) | 2 | S/E | 1 (P1 if applicable) | H, A | *firm name* |

---

## Healthcare (2 roles)

### Registered Nurse

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Registered Nurse *(or RN, use both forms)* | 3 | S/E/K | 1 (P1) | H, A | — |
| **NCLEX-RN** | 2 | S/E/K | 1 (P1) | A | passing date |
| *practice permit* (**CNO** / **CRNBC** / **OIIQ** — match province) | 3 | S/E/K | 1 (P1) | H, A | — |
| *specialty* (**med-surg** / **oncology** / **ICU** / **ER**) | 3 | S/E/K | 1 (P2) | H, A, SK | — |
| **patient care** (or **patient assessment**) | 2 | E | 0 | A | *specialty* |
| **BLS** (or **ACLS** / **PALS** — every cert you hold) | 2 | E/K | 0 | A, SK | — |
| **EMR** (or **Epic** / **Cerner** — match target) | 2 | E/K | 0 | A, SK | — |
| **medication administration** | 1 | E | 0 | A | *specialty* |
| **shift** (or **12-hour shift** / **nights** — match availability) | 1 | S/E | 1 (P1 or P3 as availability) | A | — |
| **charge nurse** (only if applicable) | 1 | E | 0 | A | *specialty* |

**Gotcha:** the practice permit is the hard-filter keyword — if it's missing or the province doesn't match, most hospital ATSes reject before scoring anything else. Never abbreviate the college name without the province context ("CNO" alone is fine because it's provincially unambiguous; "College of Nurses" alone is not).

### Pharmacist

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Pharmacist *(or PharmD / RPh)* | 3 | S/E/K | 1 (P1) | H, A | — |
| *state or provincial license* (**NY**, **CA**, **Ontario**, etc.) | 3 | S/E | 1 (P1) | H, A | pharmacist |
| **NAPLEX** (US) or **PEBC** (Canada) | 2 | S/E/K | 1 (P1) | A | passing date |
| **PharmD** | 2 | S/E/K | 1 (P1 or P2) | A, SK | *school* |
| **dispensing** | 2 | E | 0 | A | — |
| **MTM** (Medication Therapy Management) | 2 | E/K | 1 (P2 if targeting retail) | A, SK | immunization |
| **immunization** (or **immunization certified**) | 2 | E/K | 1 (P2) | A, SK | MTM |
| **clinical** (or **clinical pharmacist**) | 2 | E | 0 | A | *specialty* |
| **inventory** (or **inventory management** — retail) | 1 | E | 0 | A | — |
| **EMR** (or **pharmacy management system name**) | 1 | E/K | 0 | SK | — |

---

## Trades (1 role — pattern generalizes)

### Electrician (pattern applies to HVAC, welder, millwright, plumber)

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Electrician *(or Journeyman Electrician / Master Electrician)* | 3 | S/E/K | 1 (P1) | H, A | — |
| **Red Seal** (or provincial equivalent — Alberta AIT, Ontario 309A) | 3 | S/E/K | 1 (P1) | H, A | — |
| *classification* (**residential** / **commercial** / **industrial**) | 3 | S/E/K | 1 (P2) | H, A, SK | — |
| **CSA** (or **NEC** — US) | 2 | E/K | 0 | A, SK | code compliance |
| **conduit** (or **wiring** / **circuit**) | 2 | E | 0 | A | — |
| **service call** (or **service work**) | 2 | E | 0 | A | *classification* |
| **PLC** (or **controls** — if industrial) | 2 | E/K | 0 | SK | industrial |
| **blueprint** (or **schematic**) | 1 | E | 0 | A | — |
| **safety** (or **OSHA** / **WHMIS** / **fall arrest**) | 2 | E/K | 0 | A, SK | — |
| **class 5 license** (or provincial driver's class) | 1 | S/E | 0 | A | — |

**Gotcha:** for every trade, the credential + the specific classification are the hard filters. "Electrician" without "commercial" or "Red Seal" or a provincial ticket reference matches nothing useful.

---

## Adjacency rules — how bullets should be structured

Once you have your keywords in the right sections at the right frequencies, adjacency is where the last 10–15% of ATS relevance score comes from. The rule:

> **Two S-tier keywords in the same bullet outrank the same two keywords in different bullets by roughly 2×.**

Weak bullet (keywords scattered):
> Built REST APIs. Used AWS for hosting. Worked with Docker.

Strong bullet (keywords adjacent):
> Built and deployed REST APIs in Python on AWS ECS with Docker, running behind an ALB with auto-scaling.

Same six keywords. The strong version tokenizes as a dense cluster of related terms that adjacency scoring rewards; the weak version tokenizes as three loosely-related fragments.

Every résumé bullet in your Experience section should try to hit **two adjacent S-tier keywords** from the table for your role. If a bullet only carries one, consider whether it's earning its line.

---

## The anti-stuffing lines

ATS parsers detect stuffing. Three specific triggers you must not cross:

**Trigger 1: same keyword more than 6 times in one document.** Six is not a maximum; six is the alarm bell. Aim for 3 for most keywords, 4 for the top-2 keywords, never 6+.

**Trigger 2: keyword in white text or 1-point font.** ATSes strip formatting during parsing, so the parser sees the stuffed keyword but so does the recruiter, and every recruiter has seen this trick. Automatic reject at the human stage.

**Trigger 3: keyword in the metadata / hidden PDF fields.** Some templates from unnamed résumé services stuff keywords into the PDF's author or subject metadata. Modern ATSes read these fields and flag mismatches with visible content. If the parser sees "Java, Python, Ruby, Go, Rust, C++, JavaScript, TypeScript, Swift, Kotlin" in metadata but only "Python" in visible text, your file is scored below the median before a human sees it.

---

## How to actually use this chapter

Two moves. Both take under an hour.

**Move 1 (30 min): the role-match audit.**
1. Find your role in the tables above.
2. For each of the ten keywords, count how many times it appears in your current résumé.
3. Compare to the target column.
4. For every keyword that's under-target, add one bullet or one Summary line that names it truthfully.
5. For every keyword that's over-target, cut it back to 3 (or 4 for the top-2).

**Move 2 (20 min): the three-strike check.**
For each S-tier keyword (rows in bold):
1. Is it in your résumé at the target frequency? ✓
2. Is it in your cover-letter template (the one you adapt from Ch 8)? ✓
3. Is it in your LinkedIn — headline for top-3, About for top-10? ✓

Three checkmarks per S-tier keyword. If any keyword is missing a mark, that mark is a 5-minute fix.

Done properly, these two moves lift a résumé's reply rate more than any other single-hour intervention I have seen in the last three years.

---

## What Part 3 does next

Chapter 11 closes Part 3 with the feedback loop: how to take the rejections you will keep getting even after this chapter and feed them into the AI so the next fifty applications are strictly better than the last fifty. It is the meta-chapter — the one that makes the whole toolkit self-improving.

For now, run the two moves above on the one résumé you use most. That is your Saturday.

---

## Screenshot page

| The idea | The number | What to do |
|---|---|---|
| ATS parser weight: Summary vs. mid-bullet | 3–5× | Move your top keyword into the Summary if it isn't there |
| ATS parser weight: mid-bullet vs. footer | 10–20× | Nothing important ever goes in the header/footer |
| Keyword frequency: alarm-bell threshold | 6 occurrences per document | Cap at 3 (or 4 for top-2 keywords) |
| Three-strike coverage per S-tier keyword | 3 channels (résumé + cover letter + LinkedIn) | Any missing channel is a 5-min fix |
| Adjacency lift (2 keywords in one bullet vs. two bullets) | ~2× | Rewrite bullets that only carry one S-tier keyword |
| Roles covered by tables in this chapter | 10 (SWE, DE, MLE, DevOps, QA, FA, SR ACC, RN, Pharmacist, Electrician-pattern) | Find yours; if not listed, use the closest match as the template |

Ten roles. Ten keyword tables. Two moves. One hour. Chapter 11 next — where the loop closes.
