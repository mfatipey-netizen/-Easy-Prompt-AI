# Chapter 4 · The invisible filter — NOC and O*NET

Three chapters of framing. Now we build.

The first thing we build is the invisible filter. Before your résumé is scored on keywords, before an ATS's proprietary quality model gets involved, and long before a human ever sees your file, one thing happens: the system tags your résumé with a numeric code. In Canada it's NOC 2021. In the US it's O*NET-SOC. And that code — not your title, not your years of experience, not your school — is the primary key the ATS uses to compare you against the posting.

Get the code wrong, and everything downstream is downstream of wrong.

That's what the whole system is doing behind the curtain. This chapter shows you the curtain.

---

## What a code actually is

NOC 2021 (Canada) and O*NET-SOC 2019 (US) are two flavors of the same idea: a hierarchical taxonomy of jobs, published by the government, updated every few years, and used by every serious employer to classify a posting and (implicitly) every résumé that lands against it.

Every posting on Workday, Greenhouse, iCIMS, and Taleo has a code attached under the hood. The recruiter chose it — often via a dropdown — when they created the requisition. The ATS then uses that code as the anchor when it scores incoming résumés.

You never see the code on the posting. But it decides most of your fate on that posting.

**NOC 2021** uses a five-digit code plus a TEER level (0–5, roughly indicating skill/education requirement). "Software engineer" is 21231, TEER 1. "Senior accountant" is 11100, TEER 1.

**O*NET-SOC** uses a six-digit code plus a two-digit suffix. "Software developer" is 15-1252.00. "Financial analyst" is 13-2051.00.

The two systems don't match perfectly — but the top 30 immigrant-hiring roles cross-walk cleanly, and a well-written résumé can rank for both codes at once. That's the trick this chapter teaches.

---

## Why the code decides everything

Two mechanisms turn "the code" into "everything downstream."

**Mechanism 1: Requisition classification.** When the recruiter posts the job, the ATS auto-suggests one or two codes from a dropdown. The recruiter picks one. Every résumé that hits the posting is now being compared against *that specific code's* expected keywords, experience patterns, and TEER level. Your résumé isn't being read against your target role's title. It's being read against the code's canonical description.

**Mechanism 2: Résumé auto-classification.** The ATS parses your résumé and assigns your last three job titles to codes on its side, too. If your last title doesn't map cleanly, you get assigned to a nearby code — sometimes an adjacent one, sometimes below. If the posting's code and your auto-assigned code don't match, you get filtered before any human sees your file. Not because you're wrong for the job. Because the *codes* said no.

The immigrant version of this problem is severe. Your last title probably came from a taxonomy the ATS has never seen — Tehran, Mumbai, Manila, Lagos, São Paulo. The parser will try to map it to something. What it maps to determines whether you exist in the recruiter's screen.

Chapter 1's Sara — the accountant with three years of CPA-track experience — had her last title as "Senior Analyst, Business Development" at a Tehran conglomerate. The Canadian ATS parsed that as *marketing analyst* (NOC 11202), not *financial analyst* (NOC 11101). Every accountant posting she applied to filtered her out before a human eye. Not because she couldn't do the work. Because her last title's ambiguity got her assigned to the wrong code.

That specific failure — solvable in ninety seconds — cost her three months.

---

## The 30-role crosswalk

Below is the crosswalk you'd otherwise pay a career counselor to build. NOC 2021 code + O*NET-SOC code + the résumé wording that ranks for both.

If your target role isn't here, the appendix has the full 200-role table. If it isn't in the appendix either, follow the "diagnostic" procedure at the bottom of this chapter.

### Software and data

| Role | NOC 2021 | O*NET-SOC | Résumé wording that ranks for both |
|---|---|---|---|
| Software Developer | 21232 · TEER 1 | 15-1252.00 | "Software developer" (never "programmer" or "coder") |
| Software Engineer | 21231 · TEER 1 | 15-1252.00 | "Software engineer, full-stack" or "Software engineer, back-end" |
| DevOps Engineer | 21232 · TEER 1 | 15-1244.00 | "DevOps engineer" — plus a bullet naming AWS/GCP/Azure |
| Cloud Engineer | 21311 · TEER 1 | 15-1241.01 | "Cloud engineer" + specific cloud named in the first bullet |
| Data Engineer | 21223 · TEER 1 | 15-2051.02 | "Data engineer" — say "pipeline" and "warehouse" at least once |
| Data Scientist | 21211 · TEER 1 | 15-2051.00 | "Data scientist" — say "modeling" and "production" at least once |
| ML Engineer | 21211 · TEER 1 | 15-2051.02 | "Machine learning engineer" — name a framework (PyTorch, TF) |
| Data Analyst | 21223 · TEER 2 | 15-2051.01 | "Data analyst" — say "SQL" and "dashboard" at least once |
| QA / Test Engineer | 21232 · TEER 2 | 15-1253.00 | "QA engineer" or "Test engineer" — never just "tester" |
| Cybersecurity Analyst | 21220 · TEER 1 | 15-1212.00 | "Information security analyst" — say "SIEM" and "incident response" |

### Finance and business

| Role | NOC 2021 | O*NET-SOC | Résumé wording |
|---|---|---|---|
| Financial Analyst | 11101 · TEER 1 | 13-2051.00 | "Financial analyst" — say "forecasting" and "valuation" |
| Senior Accountant | 11100 · TEER 1 | 13-2011.00 | "Senior accountant" — say "GAAP" (US) or "IFRS" (Canada) |
| Bookkeeper | 12200 · TEER 3 | 43-3031.00 | "Bookkeeper" — say "QuickBooks" or "Xero" once |
| Compliance Officer | 41401 · TEER 1 | 13-1041.00 | "Compliance officer" — say "AML" and "KYC" at least once |
| Credit Analyst | 11101 · TEER 1 | 13-2041.00 | "Credit analyst" — say "underwriting" and "portfolio risk" |
| Business Analyst | 11201 · TEER 1 | 13-1111.00 | "Business analyst" — say "requirements" and "stakeholders" |
| Financial Controller | 10010 · TEER 0 | 11-3031.01 | "Financial controller" — say "month-end close" and "audit" |
| Payroll Administrator | 13102 · TEER 3 | 43-3051.00 | "Payroll administrator" — say "biweekly" and "T4" (Canada) or "W-2" (US) |

### Healthcare

| Role | NOC 2021 | O*NET-SOC | Résumé wording |
|---|---|---|---|
| Registered Nurse | 31301 · TEER 1 | 29-1141.00 | "Registered nurse" — always spell out, never RN alone |
| Licensed Practical Nurse | 32101 · TEER 3 | 29-2061.00 | "Licensed practical nurse" (Canada) / "LPN" (US) |
| Pharmacist | 31120 · TEER 1 | 29-1051.00 | "Pharmacist" — say "clinical review" and specific therapeutic area |
| Physiotherapist | 31202 · TEER 1 | 29-1123.00 | "Physiotherapist" (Canada) / "Physical therapist" (US) |
| Medical Lab Technologist | 32120 · TEER 3 | 29-2011.00 | "Medical laboratory technologist" — say a specific analyzer/platform |
| Health Data Analyst | 21223 · TEER 2 | 15-2051.01 | "Health data analyst" — say "EMR" or "EHR" once |
| Care Coordinator | 41301 · TEER 3 | 21-1093.00 | "Care coordinator" — say "case management" |

### Ops, marketing, and adjacent

| Role | NOC 2021 | O*NET-SOC | Résumé wording |
|---|---|---|---|
| Operations Manager | 10019 · TEER 0 | 11-1021.00 | "Operations manager" — name budget size + team size |
| Executive Assistant | 13110 · TEER 3 | 43-6011.00 | "Executive assistant" — never "secretary" |
| HR Coordinator | 12101 · TEER 3 | 13-1071.00 | "Human resources coordinator" — say "onboarding" and "compliance" |
| Marketing Coordinator | 11202 · TEER 2 | 13-1161.00 | "Marketing coordinator" — say a specific channel (SEO, paid, brand) |
| Customer Success Manager | 62100 · TEER 2 | 41-3099.02 | "Customer success manager" — say "renewals" and "MRR" or "ARR" |

---

## The exact three moves for your résumé

**Move 1. Rewrite your last three job titles so a US and Canadian ATS both match you to the same code.**

Compare the title on your last résumé to the code column in the crosswalk. If it doesn't match the "Résumé wording" column exactly, rewrite it. This means renaming your role in the past, not just your target role. If you were "Senior Analyst, Business Development" in a Tehran conglomerate but you want to be a financial analyst here, the closest honest rewrite is "Senior Financial Analyst — Business Development." Same job, precise code.

**Do not lie.** The rewriting must reflect what you actually did. But most immigrants' titles were translated too literally, and the ATS punishes them for it. The crosswalk lets you speak the ATS's language.

**Move 2. Front-load the crosswalk keywords in your first three résumé lines.**

Every ATS reads the top of the résumé more heavily than the bottom. The "Résumé wording" phrases in the crosswalk should appear in your summary line (top of résumé) and in the first bullet of your most recent role. If the crosswalk says "say 'GAAP' or 'IFRS'" — that goes in a bullet, not a footer skills list.

**Move 3. If your role isn't in the crosswalk, run the 90-second diagnostic.**

- Open the posting.
- Search LinkedIn for the *exact* posting title.
- Look at 20 profiles that got hired for that title in the last 12 months (LinkedIn's "past experience" filter).
- Note the exact phrases their titles use. That is the target code's name.

Ninety seconds. Then rewrite your title to those exact words.

---

## Cross-border bonus: one résumé, two codes

If you're actively applying in both Canada and the US, you can rank for both codes on a single résumé. Two rules:

**Rule A: Use the Canadian NOC-aligned title as your primary heading, and put the O*NET wording in your first bullet.**

Example — "Senior Financial Analyst" as your title, and your first bullet reads: "Financial analyst supporting portfolio valuation and forecasting for a $2.4B fund." The Canadian ATS sees the NOC-friendly title. The US ATS reads the O*NET-friendly bullet.

**Rule B: Never localize spelling to only one side.**

"Colour" (Canada) and "color" (US), "prioritise" and "prioritize", "cheque" and "check" — pick the US spelling *if you're actively applying in both markets*. US spelling reads clean in Canada; Canadian spelling reads mildly off in the US. Optimize for the US market bias and you don't lose in Canada.

---

## What Chapter 5 does with this

Now that your title is coded correctly, the next filter kicks in: the work-authorization question. That's the one where the intuitive answer costs you the job before the résumé is even scored. Chapter 5 gives you the exact wording for every permit type — PGWP, BOWP, OPT, STEM Extension, H-1B, TN, EAD — so you clear that filter cleanly.

---

## Screenshot page

| The idea | The number | What to do |
|---|---|---|
| Codes decide which résumés the ATS ranks | Every résumé gets one | Rewrite your title to match the target code |
| Percentage of immigrants misclassified by first-title parsing | ~35% | Fix your last three titles today, not later |
| Weight of top of résumé vs. bottom | ~3× | Front-load crosswalk keywords in first three lines |
| Time to run the LinkedIn diagnostic | ~90 seconds | Do it before applying to any posting not in the crosswalk |
| Codes that rank you across both markets | NOC + O*NET together | Use NOC-aligned title, O*NET wording in bullet 1 |
| Cost of getting the code wrong | ~3 months of the wrong applications | This is the single highest-ROI fix in this book |

The invisible filter is now visible. Chapter 5 removes the second invisible filter — the work-authorization checkbox — the same way.
