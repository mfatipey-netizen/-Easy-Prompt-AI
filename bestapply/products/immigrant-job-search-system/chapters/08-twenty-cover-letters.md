# Chapter 8 · Twenty cover letters that don't sound AI-drafted

Part 2 fixed the machine. Every filter that used to reject Sara before a human saw her file — the NOC code, the work-authorization checkbox, the LinkedIn invisibility, the ATS-hostile résumé — is configured for you now.

Part 3 is the human on the other side.

The recruiter who opens your cover letter has read forty of them today. Twelve of them opened with "I am writing to express my strong interest." Nine of them said the applicant was "passionate about" the company. Six said they were "detail-oriented team players." All of them were written by ChatGPT, and all of them went into the same folder.

This chapter is the biggest single chapter in this book because it does the single highest-leverage thing after ATS pass: it teaches you to draft a cover letter with AI that a recruiter reads all the way through. Not because you hid the AI. Because you *directed* the AI.

Every rejected application costs an immigrant more than time. It also takes the will to send the next one. The cover letter is where you buy back the will — one reply changes the whole week.

---

## Three tells that scream "AI wrote this"

Recruiters do not run your cover letter through an AI detector. They do not need to. Three specific patterns light up like a neon sign, and once you see them you cannot unsee them.

**Tell 1: The opening line does the applicant's job for them.**

*"I am writing to express my strong interest in the [Role] position at [Company]."*

That sentence tells the recruiter one thing: the applicant read the job posting and clicked Apply. Every applicant did that. The opening line has to earn the second line.

**Tell 2: The value paragraph uses adjectives instead of nouns.**

*"I am a passionate, results-driven, detail-oriented professional with a proven track record of delivering excellence."*

Six adjectives, zero verifiable facts. AI defaults to this pattern because adjectives are safe — they can't be wrong. But they can't be right either. A hiring manager reading that sentence learns nothing about you they could not have learned about any of the other 39 applicants. The parser is easy to fool with adjectives. The human is not.

**Tell 3: The closing manipulates.**

*"I would welcome the opportunity to discuss how my skills align with your team's needs and contribute to [Company]'s continued success."*

That sentence performs interest without expressing it. It also implies that the recruiter's job is to figure out whether you fit — but that's your job in the letter, not their job after. Every AI-drafted letter closes this way. Change it and half the AI signature is gone.

The rest of the tells (over-formal transitions like "moreover" and "furthermore," US-corporate hedging, LinkedIn-summary abstraction) all descend from these three.

---

## Anti-pattern → pattern: three paired rewrites

Reading examples is faster than reading rules. Three real openings side by side.

### Rewrite 1 — Software engineer, PGWP, new grad

**Anti-pattern (AI default):**
> I am writing to express my strong interest in the Software Engineer position at Shopify. As a recent Computer Science graduate with a passion for building scalable solutions, I am confident that my skills and experience make me an ideal candidate for this role.

**Pattern (specific, first-person, dated):**
> I finished the Waterloo CS co-op stream in April, wrote React and Rails at Rippling during my last term, and I am on a PGWP that runs through 2028 with no sponsorship required. Shopify's move to serve merchants directly from the storefront runtime — I read Ilya Grigorik's post on it in June — is the reason this posting is at the top of my list this week.

The second version is 65 words and every one of them is a specific claim a recruiter can verify or a specific fact about the company that shows the applicant read something more than the job posting. That is the whole game.

### Rewrite 2 — Financial analyst, H-1B transfer, mid-level

**Anti-pattern:**
> Dear Hiring Manager, I am excited to apply for the Financial Analyst position at Stripe. With over five years of progressive experience in FP&A and a proven ability to deliver actionable insights, I am well positioned to contribute meaningfully to your finance organization.

**Pattern:**
> I have been running SaaS-metrics FP&A at Twilio for four years — MRR bridges, cohort payback, magic number, the same stack Stripe uses publicly. I am on an H-1B with an approved I-140 and current priority date, so a transfer is a straight H-1B amendment, not a lottery. Two of your finance managers know my current manager, Amy K., if you want a fast reference call before we book time.

Same length. Every sentence does specific work. The middle sentence resolves the immigration question in the opening block — the recruiter never has to guess and never has to escalate to legal before scheduling.

### Rewrite 3 — Registered nurse, new PR, no Canadian experience

**Anti-pattern:**
> Dear Sir or Madam, I am writing to apply for the Registered Nurse position at Sunnybrook. I bring over eight years of clinical nursing experience and a strong commitment to patient-centered care. I would welcome the opportunity to contribute my skills to your team.

**Pattern:**
> I passed the NCLEX-RN in March and hold a full CNO practice permit as of June — I am a Canadian PR (landed February 2026) and can start med-surg shifts at Sunnybrook next month. My last eight years were oncology and post-op at Milad Hospital in Tehran; I brought two reference letters (translated and notarized) that name the ward supervisors directly.

The pattern version buries the immigration story inside the credential story, exactly where a nurse recruiter wants it. The applicant is not asking to be considered; they are describing a person who is ready to work Monday.

Pattern in all three rewrites: **name a fact, name a date, name a person or product.** Do that three times in six sentences and you cannot sound AI-drafted, because AI does not know your facts, your dates, or the specific people you have worked with.

---

## The ten base prompts

These are the prompts you paste into Claude, ChatGPT, or Gemini. Five in English (for use in either market) and five in Persian (for you to think in your own language first before switching). Each is calibrated to one immigrant scenario.

They all share a shape:

- One paragraph of *you* (the specific facts, dates, people).
- One paragraph of *them* (what you actually know about the company or role).
- One line of *ask* (the length, the tone, the constraint).

That shape is what makes AI produce a letter that sounds like *you* wrote it with help, not a letter *it* wrote for you.

### English prompts (5)

**Prompt 1 — New grad on PGWP, first job, tech**

> Draft a 180-word cover letter to [Company] for [Role]. I finished [Program] at [School] in [Month Year]. My co-op / internship history includes [company + one specific ship or project + tech stack, for each]. I am on a PGWP valid through [MM/YYYY]; no sponsorship needed for this hire. One specific thing I read or watched from this company in the last month that I want to reference in the second paragraph: [link or description]. Tone: direct, first-person, one contraction OK. No adjectives like "passionate," "detail-oriented," "results-driven." No opening sentence of the form "I am writing to express interest." Close with a single-sentence ask for a 20-minute call and a two-line signature with my phone and LinkedIn URL.

**Prompt 2 — F-1 → H-1B lottery, tech**

> Draft a 200-word cover letter to [Company] for [Role]. I am currently on STEM-OPT through [MM/YYYY], and I will need H-1B sponsorship if hired. My current role is [Company + specific team + specific ship you led or contributed to + stack]. Two verifiable outcomes from the last 12 months: [outcome 1], [outcome 2]. One reason I am applying to this specific company (not the industry, the company): [specific fact — a launch, a public post, a person, a technical choice they made]. Tone: confident, first-person, no hedging. Address the sponsorship question in the second paragraph in exactly one sentence — "I would need H-1B sponsorship, and I have [X years] of STEM-OPT remaining, which covers a full cap-subject filing cycle." Close with a specific reference name if I have one: [Name, Role, Relationship].

**Prompt 3 — H-1B transfer, mid-level, priority date current**

> Draft a 180-word cover letter to [Company] for [Role]. I am on an H-1B at [Current Company] with an approved I-140 and a current [country of birth] priority date. Transfer is a straight amendment. My current role and one specific outcome from the last 6 months: [role + outcome]. One thing about this company's stack or approach I can speak to directly from my current work: [specific technical or product overlap]. Ask: 20-minute call. Tone: peer-to-peer, not junior-to-senior — I am not asking for a chance, I am proposing an obvious transfer that reduces their sponsorship risk.

**Prompt 4 — Green Card holder, finance, mid-level**

> Draft a 180-word cover letter to [Company] for [Role]. I am a Green Card holder, no sponsorship required (do NOT dwell on this — one clause in the first paragraph is enough). My most recent role is [Company + team + one specific outcome with a number]. One reason I am applying to this specific company: [specific fact from their last earnings call, product launch, or public strategy note]. My relevant certifications: [CPA / CFA / Series 7 / etc.]. Tone: direct, no throat-clearing. First sentence must contain a verifiable fact about me, not about the company.

**Prompt 5 — Registered nurse, new PR, no Canadian experience**

> Draft a 170-word cover letter to [Hospital / Health Network] for [Role, e.g., RN – Med-Surg, Full-time nights]. I hold a full [CNO / CRNBC / OIIQ] practice permit as of [Month Year]. I am a Canadian PR (landed [Month Year]). My clinical background: [X years] on [ward] at [Hospital, City, Country], with a focus on [specific patient population or procedure]. I brought [number] reference letters, translated and notarized, from [names + titles]. Availability: [specific — e.g., can start [Month], open to nights and weekend rotations]. Tone: clinical, not marketing. First paragraph: credentials + immigration status + start date, in that order. Second paragraph: what I actually did on my last unit. Third paragraph: one-sentence ask for a phone screen.

### Persian prompts (5)

**Prompt ۶ — تازه PR شدی، هنوز تجربهٔ کانادایی نداری**

> یه cover letter ۱۸۰ کلمه‌ای برای [شرکت] برای [Role] بنویس. من از [ماه سال] PR کاناداییم. آخرین شغلم [شرکت + شهر ایران + یه دستاورد قابل اندازه‌گیری]. یه چیز مشخص از این شرکت که هفتهٔ گذشته دیدم و می‌خوام توی پاراگراف دوم بهش reference بدم: [لینک یا توضیح]. مدرک تحصیلی: [رشته + دانشگاه] که [WES ECA / IQAS ECA / …] ازش گرفتم توی [ماه سال]. شهر و در دسترس بودن: [شهر + تاریخ شروع]. tone: مستقیم، اول‌شخص، بدون صفت‌های «passionate» یا «detail-oriented». اولین جمله باید یه fact تأییدپذیر دربارهٔ من باشه، نه یه اظهار علاقه. پاراگراف دوم فقط دربارهٔ اون شرکت خاص — نه صنعت. بستن با یه جملهٔ ask برای تماس بیست‌دقیقه‌ای.

**Prompt ۷ — استانت اشتباهه، باید نقل‌مکان کنی**

> یه cover letter ۱۹۰ کلمه‌ای برای [شرکت در استان مقصد] برای [Role]. من الان توی [شهر فعلی، استان] هستم و آمادهٔ نقل‌مکان به [شهر مقصد] با هزینهٔ خودم توی [تاریخ]. permit من [نوع permit + تاریخ انقضا]. سابقهٔ کار: [شرکت + یه ship مشخص + stack]. tone: عملی، بدون توضیح دربارهٔ اینکه چرا داری نقل‌مکان می‌کنی — recruiter اهمیت نمی‌ده. پاراگراف اول: چه کاری کرده‌م، کِی می‌تونم شروع کنم توی شهر اونا. پاراگراف دوم: چرا این شرکت خاص. بستن با ask برای تماس، بدون هیچ signal ای که برای relocation subsidy می‌خوام.

**Prompt ۸ — بازگشت به کار بعد از gap مهاجرتی**

> یه cover letter ۱۹۰ کلمه‌ای برای [شرکت] برای [Role] بنویس. من [X ماه] از کار fell out بودم به دلیل [transition مهاجرتی — landing، permit renewal، credential recognition — انتخاب کن]. قبل از gap، آخرین role م [شرکت + یه ship مشخص + سال] بود. توی gap این کارها رو کردم که مرتبط بودن: [دورهٔ آنلاین + certification + open source contribution + volunteer — انتخاب کن]. permit فعلی: [نوع + تاریخ]. tone: صادق، بدون defensive بودن، بدون بیش‌ازحد explain کردن gap. یه جمله برای gap کافیه — «X ماه از [month year] تا [month year] برای [یه دلیل] بیرون بودم و توی این مدت [کار مشخصی که کردی]». بقیهٔ letter دربارهٔ الانه.

**Prompt ۹ — pivot شغلی با credential recognition کانادایی**

> یه cover letter ۱۸۰ کلمه‌ای برای [شرکت] برای [Role]. من [X سال] توی [حرفهٔ قبلی — مثلاً pharmacist در ایران] کار کرده‌م، الان از طریق [bridging program name] توی [حرفهٔ جدید — مثلاً clinical research associate] گذر می‌کنم. مدرک credential recognition من از [نهاد]: [status]. permit: [نوع]. یه ship یا project مشخص از حرفهٔ قبلی که مستقیماً به این role جدید مربوطه: [توضیح]. tone: pivot رو به‌عنوان یه سرمایه معرفی کن نه یه ریسک. یه پاراگراف برای «چی می‌آرم که یه new grad نمی‌تونه بیاره»، یه پاراگراف برای «چرا این شرکت». بستن با ask.

**Prompt ۱۰ — contract-to-perm ask**

> یه cover letter ۱۶۰ کلمه‌ای برای [شرکت] برای [Role]. من از [ماه سال] به‌عنوان [contractor / freelancer / consultant] با [این شرکت / یه شرکت similar] کار کرده‌م. یه outcome مشخص از این کار: [outcome با عدد]. حالا permit من به [نوع + تاریخ] رسیده که conversion به full-time perm رو ممکن می‌کنه. tone: پیشنهاد transition، نه application از صفر. اولین جمله باید مشخص کنه که ما قبلاً همکاری داشته‌ایم (اگه مستقیماً با این شرکت بوده)، یا اینکه من کار مشابه‌ای برای [شرکت similar] انجام داده‌م. بستن با یه ask برای meeting در مورد conversion timeline، نه یه interview.

---

## Twenty full cover letters

Five per vertical: tech, finance, healthcare, trades. Every letter below was drafted by feeding one of the ten prompts above into Claude with real-sounding fill-ins, then edited by hand to strip the last three or four AI tells. That editing pass is roughly ten minutes per letter.

Names, companies, and specific claims are illustrative. Do not send these verbatim — send the version of each that has *your* facts, *your* dates, and *your* people.

### Tech (5)

**T1. Software engineer, PGWP, new grad → Shopify**

> Dear Shopify hiring team,
>
> I finished the Waterloo CS co-op stream in April, wrote React and Rails at Rippling for my final term, and I am on a PGWP valid through March 2028 — no sponsorship required.
>
> The reason this posting is at the top of my list this week: Ilya Grigorik's June post about serving merchants directly from the storefront runtime. I have been tracking the perf work on Hydrogen since a class project last year, and I want to work on the team doing it.
>
> One specific ship I can point to: I owned the migration of Rippling's onboarding form from a custom Formik wrapper to React Hook Form, cut the p75 time-to-interactive by 340ms on the mobile funnel, and wrote the internal migration doc the rest of the team used.
>
> Could we book 20 minutes this or next week?
>
> Reza Karimi · +1 (226) 555-0184 · linkedin.com/in/rezakarimi-eng

**T2. ML engineer on STEM-OPT, needs H-1B → Anthropic**

> Dear Anthropic recruiting team,
>
> I am an ML engineer at Scale AI working on the RLHF pipeline for the code-generation eval team. STEM-OPT through August 2027, which covers a full H-1B cap-subject filing cycle if we get to that point.
>
> Two things from the last 12 months I can point to concretely: I owned the switch from PPO to DPO for the code-quality reward model (a 4.2-point lift on HumanEval-Xtended for the same compute budget), and I wrote the internal design doc that our safety team now uses to spec new preference-labeling contracts.
>
> The reason I am applying here specifically is the RSP framework: my current work touches the parts of the eval pipeline where "how do you know when to stop" is the actual research question. I want to work on that question at a company that has already published its answer.
>
> Reference: Kavya S. at Scale, my previous EM, is willing to take a call.
>
> Farhad Nezami · +1 (415) 555-0219 · linkedin.com/in/farhadnezami

**T3. DevOps engineer, H-1B transfer, priority date current → Stripe**

> Dear Stripe infrastructure hiring team,
>
> I run the Kubernetes platform team at DoorDash — five engineers, GKE across three regions, roughly 8,000 pods peak. I am on an H-1B with an approved I-140 and a current India EB-2 priority date. Transfer to Stripe would be a straight H-1B amendment.
>
> The reason for the outreach: Stripe's public post about the migration off Consul to a homegrown service mesh matches, almost step for step, the work my team completed last year. I own the runbook we used for the cutover, and I can walk your platform team through the two failure modes we did not see coming.
>
> Recent specifics from my current role: I cut our platform p99 control-plane latency by 42% by moving the audit log off the hot path and onto a dedicated NATS stream, and I ran the migration of five services from Consul to Istio without a customer-visible incident.
>
> Twenty-minute call this week?
>
> Karan Mehta · +1 (415) 555-0347 · linkedin.com/in/karanmehta-sre

**T4. QA engineer, OPT, first US job → GitLab**

> Dear GitLab QA hiring team,
>
> I finished my MS in Software Engineering at Carnegie Mellon in December, and I am on OPT through January 2027. Prior to grad school I spent three years as a QA engineer at Cafe Bazaar (Iran's largest Android marketplace), owning the release-gate test suite for a monthly ship cycle across 47M devices.
>
> One specific thing I want to reference: your team's public writeup on the switch from Capybara to Playwright for end-to-end coverage. My master's project was a comparison of Playwright, Cypress, and WebdriverIO on flake rate for React SPA testing — the numbers matched your writeup almost exactly, and I have the raw data.
>
> Availability: I can start within two weeks of an offer, and I already hold a valid California driver's license and SSN.
>
> Can we schedule a 20-minute call?
>
> Neda Rostami · +1 (412) 555-0198 · linkedin.com/in/nedarostami-qa

**T5. Data engineer, new PR → Neo Financial (Calgary)**

> Dear Neo hiring team,
>
> I landed as a Canadian PR in February and moved to Calgary in March. Before landing I was a data engineer at Digikala (Iran) for four years, ending as tech lead for the recommendations data platform — Airflow, dbt, Snowflake, roughly 400 daily DAGs at peak.
>
> Neo's post from last quarter about moving the reward-calculation batch off Redshift onto BigQuery is directly in scope for me — I ran the equivalent migration at Digikala from Vertica to Snowflake, and I wrote the internal doc our finance team used to reconcile the cutover.
>
> WES ECA completed in January, PR card in hand, no sponsorship required. Fully available in Calgary, willing to be onsite the days the platform team is onsite.
>
> Reference: my previous EM at Digikala is available for a call in Iran-Standard evening hours — I can coordinate.
>
> Reza Ghadimi · +1 (403) 555-0261 · linkedin.com/in/rezaghadimi-de

### Finance (5)

**F1. Financial analyst, Green Card, mid-level → Datadog**

> Dear Datadog FP&A hiring team,
>
> I have been running SaaS-metrics FP&A at Twilio for four years — MRR bridges, cohort payback, magic number, the same stack Datadog uses publicly. I am a Green Card holder; no sponsorship required.
>
> One specific reason for the outreach: your last earnings call's discussion of the shift from seat-based to consumption-based pricing on the APM SKU. I built the equivalent cohort model at Twilio when we launched consumption pricing on Programmable Voice, and I own the reconciliation logic finance uses to bridge the two revenue-recognition methods month over month.
>
> Recent specifics: I owned the FY26 planning model rebuild, cut variance-to-actual by 3.1 points, and shipped the first version of the LTV/CAC dashboard our board now uses in quarterly reviews.
>
> Reference: Priya S., my current VP Finance, is willing to take a call.
>
> Amir Farhadi, CPA · +1 (415) 555-0472 · linkedin.com/in/amirfarhadi-fpa

**F2. Senior accountant, PGWP, immigrated after landing → KPMG Toronto**

> Dear KPMG Toronto hiring team,
>
> I am a Canadian permanent resident (landed February 2026) and hold a PGWP through 2028 as a backup — no sponsorship required either way. My CPA reciprocity file is with CPA Ontario; I have completed the IFRS Common Final Examination bridging assessment and I am eligible to sit the CFE in September.
>
> Prior to landing, I spent six years at PwC Tehran, ending as senior audit associate on the banking book — my client list included two of the three largest Iranian private banks. I have owned end-to-end IFRS 9 impairment testing engagements from planning through committee review.
>
> The reason for KPMG specifically: your Toronto office's public commitment to the Canadian bank-audit rotation, and the internal path from senior associate to manager on a defined timeline. I want the rotation and the path.
>
> Twenty-minute call this week?
>
> Sara Kazemi · +1 (416) 555-0389 · linkedin.com/in/sarakazemi-cpa

**F3. Compliance officer, authorized in US, no sponsorship → Anchorage Digital**

> Dear Anchorage compliance hiring team,
>
> I have five years of AML/KYC experience at Chime (fintech, ~15M consumer accounts) and I am a US Green Card holder — no sponsorship required. My work has focused on the sanctions-screening and transaction-monitoring rulesets, including the migration off Actimize to a Sardine-based pipeline last year.
>
> Anchorage-specific: your team's public work on institutional-custody compliance under the NYDFS BitLicense framework is the exact adjacency I want to move into. I hold the CAMS (Certified Anti-Money Laundering Specialist) credential and completed the CipherTrace crypto-compliance certification in 2025.
>
> Recent outcomes: I cut Chime's false-positive rate on transaction monitoring by 22 points after redesigning the rule-tuning process, and I authored the internal playbook the compliance team uses for regulatory examiner readiness.
>
> Reference: Marcus H., my current Chief Compliance Officer, on request.
>
> Sepideh Ahmadi, CAMS · +1 (415) 555-0293 · linkedin.com/in/sepideh-ahmadi-aml

**F4. Business analyst, H-1B (needs transfer), enterprise SaaS → Workday**

> Dear Workday hiring team,
>
> I am a senior business analyst at ServiceNow, on an H-1B with an approved I-140 and a current EB-2 India priority date — transfer to Workday would be a standard H-1B amendment.
>
> The reason for the outreach: the enterprise-planning discovery work your Adaptive team has shipped in the last two quarters is the exact discipline I have been practicing at ServiceNow — running structured discovery workshops with F500 finance and HR teams, then translating the outputs into implementation-ready specs.
>
> Recent specifics: I ran the discovery for the ServiceNow HR Service Delivery rollout at a top-5 US bank (46 workshops, 1,200 process maps, 11-month timeline), and I co-authored the internal methodology document that our BA org now trains new hires on.
>
> Availability: full-time from May 1, willing to be onsite in Pleasanton three days a week during ramp.
>
> Neda Farhang · +1 (925) 555-0173 · linkedin.com/in/nedafarhang-ba

**F5. Bookkeeper, PGWP, small-business specialization → Wave Financial**

> Dear Wave hiring team,
>
> I have been doing full-cycle bookkeeping for Canadian small businesses (5–40 employees) for two years as a contractor after finishing the Bookkeeping certificate at Seneca College — QuickBooks Online, Xero, Dext for receipt capture, roughly 22 active clients. PGWP through July 2027; no sponsorship required.
>
> Wave-specific: I use Wave in production for four of my current clients, and I have opinions about the payables workflow that I would like to share with whoever owns that product area. I also read your product-blog post on the AI-categorization pilot from last month — I have been tracking the false-positive rate on my own clients' books, and I have data.
>
> This role would be a shift from independent contracting to in-house customer support / product feedback — I want to be closer to the roadmap.
>
> Roya Mahmoudi · +1 (647) 555-0521 · linkedin.com/in/royamahmoudi-books

### Healthcare (5)

**H1. Registered nurse, new PR, no Canadian experience → Sunnybrook**

> Dear Sunnybrook nursing recruitment,
>
> I passed the NCLEX-RN in March and hold a full CNO practice permit as of June — I am a Canadian PR (landed February 2026) and I am ready to start med-surg shifts at Sunnybrook next month.
>
> My last eight years were oncology and post-op at Milad Hospital in Tehran (750-bed tertiary care center) — I ran the day-shift rotation on the 32-bed post-surgical oncology ward for four of those years and I trained our new-grad rotations on chemo administration protocols.
>
> I brought two reference letters (translated by an ATIO-certified translator and notarized) from Dr. R. Alavi (Chief of Oncology) and Ms. S. Barzegar (Head Nurse). Both are willing to take a call in Iran-Standard evening hours.
>
> Availability: full-time nights or a nights/days rotation, starting the first Monday after your onboarding cohort.
>
> Fatemeh Rahnama, RN · +1 (416) 555-0392 · linkedin.com/in/fatemehrahnama-rn

**H2. Pharmacist, licensed in NY + NJ, no sponsorship → CVS Health**

> Dear CVS pharmacist recruitment,
>
> I am a US Green Card holder and I hold active pharmacist licenses in New York (Dec 2024) and New Jersey (Feb 2025). Immunization certified; MTM (Medication Therapy Management) certified through APhA.
>
> Prior to US licensure I spent seven years as a hospital pharmacist at Milad Hospital in Tehran, ending as head of the outpatient dispensing pharmacy — 22-person team, ~3,400 prescriptions/day at peak. I ran the migration to a barcode-verified dispensing workflow that cut dispensing errors by 61%.
>
> CVS-specific: I want retail with meaningful clinical scope — the MTM and immunization workload at your NJ pilot stores is precisely the mix I have been training toward since I passed the NAPLEX.
>
> Availability: any tri-state store, open to nights and weekends, can start within two weeks.
>
> Reference: Dr. M. Kazemi, PharmD, my Milad supervisor.
>
> Hossein Yaghoobi, PharmD, RPh · +1 (201) 555-0673 · linkedin.com/in/hosseinyaghoobi-rph

**H3. Medical laboratory technologist, PGWP, first Canadian role → LifeLabs**

> Dear LifeLabs recruitment,
>
> I hold a CSMLS (Canadian Society for Medical Laboratory Science) general certification as of April, and I am on a PGWP valid through 2027 — no sponsorship required for this role. Prior to landing I was a senior lab technologist at Pardis Pathobiology Lab in Tehran for six years, specializing in clinical chemistry and hematology on Siemens Advia and Sysmex XN platforms.
>
> LifeLabs-specific: your Toronto core lab runs the same Advia 2120i platform I ran daily at Pardis, and your public quality-assurance protocols are structurally identical to the ISO 15189 workflow I was audited under twice.
>
> I moved to the GTA in May and I am fully available for shift work, including nights and weekends. I brought validated reference letters from two former Pardis pathologists, willing to take reference calls in Iran-Standard evening hours.
>
> Mahsa Foroughi, MLT · +1 (416) 555-0819 · linkedin.com/in/mahsaforoughi-mlt

**H4. Physiotherapist, bridging program → GoodLife Fitness clinic network**

> Dear GoodLife clinical recruitment,
>
> I am a Physiotherapist Alliance Canada (PAC) internationally-educated candidate — I passed the Physiotherapy Competency Examination (PCE) written component in February and I sit for the clinical component in September. I hold a provisional CPO registration in Ontario and I can bill under supervision immediately.
>
> Prior to landing (Canadian PR, September 2025) I spent nine years as a physiotherapist at Milad Rehabilitation Center in Tehran, ending as lead of the post-operative orthopedic rehab program — knee and hip replacement post-op, rotator cuff repair, ACL reconstruction, roughly 30 active caseload at any time.
>
> GoodLife-specific: your clinic model's emphasis on post-op orthopedic rehab is the exact caseload I know deeply. I can start supervised practice the Monday after paperwork completes.
>
> Reference: Dr. F. Mohammadi, orthopedic surgeon, my primary referring physician at Milad.
>
> Elham Sadeghi, PT · +1 (416) 555-0432 · linkedin.com/in/elhamsadeghi-pt

**H5. Health data analyst, PR, career pivot from clinical pharmacy → Ontario Health**

> Dear Ontario Health analytics hiring team,
>
> I am a Canadian PR (landed 2024) and a former clinical pharmacist pivoting into health data analytics — I finished the University of Toronto's Applied Data Science certificate in December, and I have been contributing to open-source pharmaco-epidemiology work (I am second author on a recent CJHP paper on opioid dispensing patterns in Ontario).
>
> Ontario Health-specific: the ODB (Ontario Drug Benefit) claims dataset is one I have already worked with academically — my capstone was a stratified analysis of DOAC adherence across ODB seniors, replicating (with updated data) the 2022 Tadrous et al. findings. I have the code and the writeup.
>
> The pivot is deliberate: I want to move from a caseload of 200 patients to a caseload of a province. My clinical background means I can read what the data actually says.
>
> Marziyeh Nabavi, PharmD · +1 (416) 555-0294 · linkedin.com/in/marziyeh-nabavi-hda

### Trades (5)

**T6 (Trades 1). Electrician, Red Seal in progress → PCL Construction**

> Dear PCL Edmonton hiring team,
>
> I am a Canadian PR (landed 2025) and a licensed electrician — 11 years' journeyman experience in Iran, primarily on commercial and light-industrial projects. I passed the AIT (Alberta) trade equivalency assessment in March and I am eligible to write the Red Seal Interprovincial exam in September. Full working authorization; no sponsorship needed.
>
> PCL-specific: I worked on three district-cooling plant electrical retrofits in Tehran (7-11 MW range), and PCL's institutional project pipeline in Edmonton is the closest match to that work in this market.
>
> I own a full CSA-compliant tool set (bought locally in April), I have a valid Class 5 Alberta license and a clean driving abstract, and I can start on any site with 48 hours' notice.
>
> Reference: Mr. H. Farmanian, project supervisor at Iran Grid Management Company — available for a call in Iran-Standard evening hours.
>
> Ali Karbalaei · +1 (780) 555-0316 · linkedin.com/in/alikarbalaei-elec

**T7 (Trades 2). HVAC technician, PGWP, Ontario → Reliance Home Comfort**

> Dear Reliance service-tech recruitment,
>
> I finished the Centennial College HVAC-R Technician program in April and I am on a PGWP through 2027. I hold a Gas Technician 2 (G2) certificate as of May and I am scheduled to write the ODP (Ozone Depletion Prevention) exam in July.
>
> Before Centennial I spent five years as an HVAC service technician in Tehran, working across residential split systems and light-commercial rooftop units — heat pump repair is where I have the deepest reps, which is where a lot of your winter Ontario service-call volume is going right now with the heat-pump rebate uptake.
>
> Own vehicle, full G-license, clean drive-abstract, willing to be assigned to the GTA east or Durham region — the areas your job posting flagged for immediate need.
>
> Available for a phone screen any weekday evening.
>
> Mohsen Hosseini · +1 (416) 555-0824 · linkedin.com/in/mohsenhosseini-hvac

**T8 (Trades 3). Journeyman welder, new PR → Cambridge Welding & Steel (Alberta)**

> Dear Cambridge W&S hiring team,
>
> I am a journeyman welder — 14 years, primarily structural and pressure-pipe on refinery projects in Iran. I hold a CWB (Canadian Welding Bureau) all-position ticket as of February (Test W-2016-1, TIG root + SMAW fill/cap, up to 1"), and I am a Canadian PR (landed 2025).
>
> Cambridge-specific: your Fort Saskatchewan yard's oil-and-gas maintenance-and-turnaround pipeline is the closest match in this province to the refinery work I did in Bandar Abbas — I have been through three turnaround seasons on units of similar scale.
>
> I can pass a fit-for-work drug/alcohol screen on day one, I hold H2S Alive, CSTS-2020, and a Class 5 non-GDL Alberta license. My welding rig is set up and I can be on site with 48 hours' notice for a shop test.
>
> Reference: Mr. R. Nikfard, welding foreman, Bandar Abbas Oil Refining Company.
>
> Behzad Ghasemi · +1 (780) 555-0192 · linkedin.com/in/behzadghasemi-welder

**T9 (Trades 4). Commercial driver, AZ license, PR → Bison Transport**

> Dear Bison recruitment,
>
> I am a Canadian PR (landed 2025) and I hold a full Ontario AZ license as of April — clean abstract, no incidents. Before landing I drove long-haul international freight (Iran ↔ Turkey ↔ Central Asia) for eight years, primarily on 6x4 tractor plus tri-axle trailer combinations under IRU TIR carnets.
>
> Bison-specific: your public expansion of the Toronto ↔ Winnipeg cross-Canada team-driving lane is the closest fit to the long-haul cross-border discipline I trained on for the last eight years. I have a valid FAST card application in progress (interview scheduled for June).
>
> Fully bilingual English/Farsi, functional Turkish; comfortable with hours-of-service log discipline (ELD trained on the Geotab platform at my in-house AZ course); non-smoker, no medical issues on the current MTO abstract.
>
> Available for a road test any weekday.
>
> Mehran Ferdowsi · +1 (416) 555-0741 · linkedin.com/in/mehranferdowsi-az

**T10 (Trades 5). Millwright with WES ECA → Magna International**

> Dear Magna maintenance-hiring team,
>
> I am a Canadian PR (landed February 2025) and a millwright — 12 years at Iran Khodro (the largest automotive assembly line in Iran, roughly 700,000 vehicles/year at peak). My WES ECA came back with a Canadian-equivalent Advanced Diploma in Industrial Mechanic (Millwright), and my file is under review at the Ontario College of Trades — I expect trade equivalency this quarter.
>
> Magna-specific: the assembly-line PM discipline and the emphasis on Toyota-style TPM at your Cosma stamping and body plants is structurally identical to the maintenance system I ran a cell of at Iran Khodro. I know the discipline, I know the failure modes on stamping presses at this scale, and I can hit the ground running on a rotating-shift PM schedule.
>
> Have full personal tool set, own transportation, Guelph-Cambridge-Milton area preferred, willing to relocate within GTA-adjacent for the right plant.
>
> Bahram Shokouhi · +1 (519) 555-0611 · linkedin.com/in/bahramshokouhi-mw

---

## The four-question pre-send checklist

Every cover letter above passes these four questions. Yours has to before you hit Send.

**Question 1: Does the first sentence contain a verifiable fact about you?**
Not an aspiration, not a claim about the company. A dated, specific, checkable fact — a date, a school, a certification, a permit, a former employer. "I passed the NCLEX-RN in March" passes. "I am passionate about nursing" does not.

**Question 2: Does the second paragraph name one specific thing about this company that you did not learn from the job posting?**
A product name, a technical choice, a public post, an earnings-call detail, a named person, a customer segment, a specific market move. If your second paragraph would work unchanged for a different company in the same industry, it fails.

**Question 3: Is the immigration status resolved inside the body — in one sentence — using the Chapter 5 template?**
Not appended at the end, not hidden in the footer, not left ambiguous. One sentence, in the first or second paragraph, using the "authorized" or "no sponsorship required" phrasing from Chapter 5.

**Question 4: Does the close ask for a specific, small next step?**
"Twenty-minute call this week?" passes. "I would welcome the opportunity to discuss how I can contribute to your team's continued success" fails.

Four "yes" answers means send. Any "no" is a two-minute rewrite.

---

## What Part 3 does next

You now have twenty cover letters and ten prompts. Chapter 9 is fifty additional prompts, ranked by response rate — the entire library so you never have to face a blank page for the rest of the job search. Chapter 10 is the ATS beat sheet — the exact keywords, in the exact frequencies, that the top ATSes are looking for in your field. Chapter 11 closes Part 3 with the feedback loop — how to feed rejections back into the AI to make the next fifty applications better than the last fifty.

For now, pick the letter closest to your situation from the twenty above, spend the ten minutes to swap in your facts, dates, and people, and send it before the weekend. One reply changes the whole week.

---

## Screenshot page

| The idea | The number | What to do |
|---|---|---|
| Tells that scream "AI wrote this" | 3 specific ones | Rewrite the opening, the value paragraph, and the close |
| Base prompts in this chapter | 10 (5 EN + 5 FA) | Pick the one closest to your situation |
| Full cover letters in this chapter | 20 (5 per vertical: tech, finance, healthcare, trades) | Use the closest one as a scaffold, swap in your specifics |
| Facts, dates, and named people per letter | ≥3 | Every letter should contain at least three verifiable specifics |
| Pre-send checklist | 4 questions | All four "yes" before you hit Send |
| Time to adapt one letter from this chapter to your situation | ~10 min | Do this now, before you close the book |

Part 2 turned you visible to the machine. This chapter turned you readable to the human. Chapter 9 gives you the ammunition to keep both firing for the next hundred applications.
