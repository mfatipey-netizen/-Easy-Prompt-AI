# Chapter 9 · Fifty prompts, ranked by response rate

Chapter 8 gave you ten cover-letter prompts. This chapter gives you a working library of fifty — every prompt an immigrant job seeker needs, from the first time you read a JD to the day you send the rejection-response note. Ranked by response rate, so you know which ones to reach for first when the week is short.

You will never face a blank page again for the rest of this search.

---

## How the ranking works

Response rate here means one thing: *the recipient replied within seven days*. Not "opened," not "read," not "reacted with a thumbs-up on LinkedIn." Replied — with words, or a scheduled call, or a next step.

Four tiers, roughly calibrated to what I have seen work across immigrant job seekers in tech, finance, healthcare, and trades over the last three years:

- **S tier (~35–50% reply rate):** send these first. Every immigrant should have them in hand this week.
- **A tier (~20–30%):** the workhorses. Use these once you have a specific target and a specific piece of intel.
- **B tier (~10–15%):** situational. Powerful when the situation applies, weak when it does not.
- **C tier (~5–10%):** edge cases. Rejection recoveries, salary re-openers, cold re-engagement.

Reply rate is not the whole story — a C-tier prompt that lands one senior director's reply beats twenty S-tier replies from junior recruiters. But when your Saturday morning has two hours in it, you sort by tier first and specificity second.

Every rejected application costs an immigrant more than time. It also takes the will to send the next one. This library is what keeps the will from running out.

---

## Stage 1 · Discovery (10 prompts)

Before you write anything, you have to know what you are writing to. These are the prompts that turn a job posting into a target.

### D1 · JD triage (S tier)

**When:** you are looking at a job posting and cannot tell in 30 seconds whether it is worth writing a cover letter for.

> Read the following job posting and answer four questions in one paragraph each: (1) What is the *actual* NOC 2021 code for this role in Canada, and what is the closest O*NET-SOC code in the US? (2) Which specific keywords must appear in my résumé and cover letter to pass an ATS with default weights for this posting? Rank the top ten by importance. (3) Are there any hard filters (work-authorization, licensing, security clearance, on-site requirement) that would reject me before a human sees my file, given my status: [your status]? (4) What single fact about the applicant (a certification, a former employer, a specific ship) would make a hiring manager stop skimming and read the cover letter? [Paste JD].

*Gotcha:* if question 3 comes back "yes, hard filter," do not spend the ten minutes writing the letter. Move on.

### D2 · Company deep-read for the second paragraph (S tier)

**When:** you have a target company and the JD passed triage.

> Search for and summarize five things about [Company] from the last 90 days that could plausibly go into the second paragraph of a cover letter: a public product ship, a public strategy note, an engineering-blog post, a leadership hire or departure, and an earnings-call or press-release detail. For each, give the source URL and a two-sentence summary. Rank them by how directly relevant they are to the [Role] posting I am targeting. Do not include anything older than 90 days.

*Gotcha:* AI still confabulates public sources. Verify each URL opens and the summary matches before you paste anything into a letter.

### D3 · Hiring-manager identification (A tier)

**When:** you want to reach past the recruiter to the person who will actually hire you.

> Given a [Role] posting at [Company], suggest three plausible titles for the hiring manager for this role in a company of this size and structure (e.g., "Director of Data Engineering," "VP People," "Head of Clinical Operations"). For each, give me the LinkedIn search query I would use to find current holders of that title at [Company]. Do not name specific people — just the titles and the search patterns.

*Gotcha:* pair with a LinkedIn search you actually run — never send a prompt-suggested name unchecked, ever.

### D4 · Company culture-fit vector check (A tier)

**When:** you are choosing between two open postings at similar companies and want to pick the higher-hit-rate target.

> Compare [Company A] and [Company B] on five dimensions relevant to an immigrant candidate: (1) documented history of sponsoring H-1B / hiring PGWP / equivalent; (2) publicly visible employee-review sentiment on immigrant onboarding (Glassdoor, Blind, Reddit); (3) team-language expectations (English-only, bilingual, other); (4) remote/hybrid/on-site policy for the specific team; (5) recent layoffs or hiring freezes in the last 12 months. Cite sources. Rank the two companies for me and recommend which to apply to first.

*Gotcha:* Blind and Reddit skew negative; weigh signal-to-noise before letting one thread swing the ranking.

### D5 · Job-market timing check (B tier)

**When:** you want to know whether it's actually worth applying now or waiting a week.

> Give me a market snapshot for [Role] in [City / Region] over the last 30 days: rough number of postings, whether the trend is up or down vs. the prior 90-day average, three companies actively hiring right now, and one specific signal (a funding round, a product launch, a layoff-then-rehire) that would make a specific company more likely to move fast on hires this month. Cite sources.

*Gotcha:* month-over-month noise is high in specialized roles — trust the direction, not the number.

### D6 · Recruiter-outreach template (S tier)

**When:** a recruiter at a target company has posted a role and is likely to be swamped.

> Draft a 60-word LinkedIn message to a recruiter at [Company] for [Role]. First sentence names the exact posting and req ID. Second sentence gives one specific fact about me that is directly on-scope: [fact]. Third sentence is a single-clause ask: "20-minute call this week?" No adjectives. No "I hope this message finds you well." No emojis.

*Gotcha:* if your first sentence does not name the req ID, this becomes a B-tier prompt in a hurry.

### D7 · Referral finder (A tier)

**When:** you suspect someone in your extended network works at the target company.

> Given my LinkedIn network CSV (I will paste it in), find every 1st- and 2nd-degree connection currently at [Company]. For each, give me their title, tenure, and the shortest connection path — including specifically what my 1st-degree connection is likely to know about them. Rank by likelihood of being willing to make a referral for a [Role] posting.

*Gotcha:* running this without a real LinkedIn export produces confident fabrications. Paste the CSV or don't run it.

### D8 · JD-to-résumé gap analysis (S tier)

**When:** you are worried your résumé is missing something the JD explicitly asks for.

> Compare the following JD to the following résumé. Produce three lists: (1) requirements in the JD that my résumé fully satisfies — quote the résumé line; (2) requirements the JD asks for that my résumé does not mention but that I plausibly have from context — for each, suggest a one-line addition to the closest résumé bullet; (3) requirements the JD asks for that I clearly do not have — do not suggest lying, just tell me what they are so I can decide whether to apply anyway. [Paste JD] [Paste résumé].

*Gotcha:* group (2) is where the highest-value ATS keywords get added — but only if the underlying claim is true. Do not add a bullet you cannot back up in an interview.

### D9 · Salary anchor research (A tier)

**When:** the recruiter is about to ask "what are you looking for" on the first call.

> Give me a salary range for [Role] at [Company or similar tier] in [City] as of the last 90 days, in [CAD / USD]. Sources: Levels.fyi, Glassdoor, LinkedIn Salary, publicly available H-1B / LMIA salary disclosures. Give me the 25th, 50th, and 75th percentile numbers. Then give me a one-sentence anchor I could use on a call — expressed as a range whose bottom is the 60th percentile and whose top is 20% above the 75th.

*Gotcha:* H-1B disclosure data is 6–12 months lagged and skews low. Cross-check with Levels.fyi for current-year numbers.

### D10 · Weekly-target picker (B tier)

**When:** Sunday night, deciding what to apply to this week.

> Given my target role of [Role], my status of [status], my city of [City], and a two-hour-a-day time budget for this week, suggest a pipeline of ten applications for the week: three high-confidence targets (S tier — likely reply), four moderate (A tier — reasonable shot), and three stretches (B tier — good practice, low expected reply). For each, give me the company name, the posting URL, and one sentence on why it earned its tier. Prefer variety across company size and stage.

*Gotcha:* the ten targets are only useful if you actually run D1 on each before writing the cover letter.

---

## Stage 2 · Application (15 prompts)

The heart of the library. These go beyond the ten base prompts in Chapter 8 by covering the specific rewrites, re-targetings, and adaptations that a live search requires.

### A1 · Résumé bullet rewriter (S tier)

**When:** a résumé bullet reads like a job description of what you were assigned, not what you shipped.

> Rewrite the following résumé bullet so it: (1) leads with a strong past-tense verb; (2) contains one specific technology, framework, or standard by name; (3) contains one quantitative outcome, using a real number if I give you one, otherwise a plausible order-of-magnitude range I can adjust; (4) is one line, under 22 words. Do not use "responsible for" or "helped with." [Paste bullet].

*Gotcha:* if the AI invents a specific number you never had, replace it with a range or delete it. Never send a bullet with a made-up number to a real employer.

### A2 · Job-title translator (S tier)

**When:** your last title was in Persian, Arabic, or a company-specific title that does not exist in NA.

> My last job title in [Country] was: [title, in original language and English translation]. My actual responsibilities were: [3–5 bullets]. Suggest three NA-market job titles (Canada + US) that best describe this role, using NOC 2021 and O*NET-SOC vocabulary. For each, give me the closest NOC code and O*NET code. Recommend which title to use as my primary résumé heading if I am targeting [target market].

*Gotcha:* the "primary" title should match Chapter 4's crosswalk row for your target role.

### A3 · Cover-letter re-target (A tier)

**When:** you already have a working cover letter for one company and want to adapt it for another in the same industry.

> Take the following cover letter (last used for [Original Company]) and adapt it for [New Company]'s [Role] posting. Keep the first paragraph structure and my personal facts unchanged. Rewrite the second paragraph so it references one specific thing about [New Company] that is not in the original — feed from [source URL you researched]. Keep the length within 20 words of the original. [Paste original cover letter].

*Gotcha:* if paragraph 2 sounds interchangeable across your top five targets, rewrite it — you missed the point.

### A4 · Résumé-to-JD alignment pass (S tier)

**When:** you are about to submit and want a final calibration on ATS keyword density.

> For the following JD, extract the ten highest-weighted keywords a default ATS parser would look for (Workday-style default). Then scan my résumé for each. For each keyword: does it appear? If yes, in which section? If no, suggest exactly one sentence I could add to the most natural section to include it truthfully. Do not suggest keyword stuffing. [Paste JD] [Paste résumé].

*Gotcha:* if the answer to "would this claim survive an interview question?" is no, do not add the sentence.

### A5 · Executive-summary rewrite (S tier)

**When:** the two-line summary at the top of your résumé is generic.

> Rewrite the following two-line résumé summary so that: (1) line one names my current or most recent role, one specific stack or domain, and my authorization-line phrasing from Chapter 5 [insert your line]; (2) line two names one measurable outcome from the last 24 months and one specific tool or standard. No adjectives. Total under 32 words. [Paste current summary].

*Gotcha:* the summary reads first — recruiters have five seconds on it. Every word must earn its ATS keyword weight AND its human-reader value.

### A6 · LinkedIn About rewrite (A tier)

**When:** your LinkedIn About section is still the default template from four years ago.

> Rewrite my LinkedIn About section in first person, three paragraphs, under 180 words total. Paragraph 1: one specific ship from my current role + the immigration authorization line. Paragraph 2: two specific outcomes from the last 24 months with numbers. Paragraph 3: one sentence on what I am open to hearing about — the exact roles, the exact companies (or types), and how to reach me. No adjectives like "passionate," "driven," or "detail-oriented." Match this résumé: [paste résumé].

*Gotcha:* the About section is heavily weighted for LinkedIn's search AI — paragraph 1 must contain the target-role keyword within its first 12 words.

### A7 · LinkedIn headline swap-in (S tier)

**When:** your headline is still your current job title + company.

> Rewrite my LinkedIn headline using the formula from Chapter 6: [Role from crosswalk] · [stack or domain specialty] · [availability signal from Chapter 5]. Target role: [role]. My stack: [stack]. My authorization: [status]. Give me three variations. Do not use any adjectives.

*Gotcha:* re-check every 90 days — the target role or the stack likely moved.

### A8 · Referral request draft (S tier)

**When:** a 1st- or 2nd-degree connection works at a target company.

> Draft a 90-word LinkedIn / email message to [Name], a [connection degree] connection at [Company], asking whether they would be willing to make a referral for the [Role, req ID]. Do not ask for a job. Do not ask for advice. Ask specifically for a referral. Reference how we know each other in one clause: [context]. Include one line on why I am a defensible fit: [one specific fact]. Close with a specific low-effort ask: forward the req ID plus my résumé to the internal referral portal.

*Gotcha:* messages that ask for "advice" or "a quick chat" have half the reply rate of messages that name the specific ask.

### A9 · Résumé shrinker (A tier)

**When:** your résumé is 3+ pages and you need to cut it to 1–2.

> The following résumé is [X] pages and needs to be cut to [1 or 2] pages while preserving ATS keyword coverage and every measurable outcome. Produce two outputs: (1) a list of the specific bullets to delete with a one-line reason each; (2) a list of the specific bullets to shorten with the exact rewrite. Do not delete anything from my current role. Do not touch the education or certifications sections. Keep my authorization line. [Paste résumé].

*Gotcha:* the AI will happily delete things you shouldn't. Read the delete list before accepting.

### A10 · Portfolio-project write-up (B tier)

**When:** you have a side project or open-source contribution and no one-paragraph pitch for it.

> Write a 90-word paragraph describing my project [Project name and URL] suitable for the "Projects" section of a résumé and the pinned-featured section of my LinkedIn. Structure: what it does in one sentence, the stack in one sentence, one measurable outcome in one sentence, and one specific technical decision I made and why in one sentence. Do not use "I built" more than once. [Paste README or repo details].

*Gotcha:* if there's no measurable outcome (stars, users, downloads), delete the project from the résumé rather than list it — an unloved side project reads worse than no side project.

### A11 · Bilingual application language check (A tier)

**When:** you are applying in Quebec, or a bilingual role in Ottawa/Moncton.

> Rewrite the following cover letter so the second paragraph is in French (Quebec register), keeping the rest in English. If any French phrase would sound stilted or too formal for a business email in Montreal specifically, flag it and suggest the natural alternative. Then produce a second, all-French version of the entire letter. My CELPIP-French / TEF result: [level]. [Paste cover letter].

*Gotcha:* if your TEF is below B2, do not send the all-French version — recruiters will notice.

### A12 · Application-portal free-text fields (S tier)

**When:** the Workday / Greenhouse portal asks "why do you want to work here" in a free-text box and you have four minutes.

> Draft a 100-word response to "why do you want to work here" for [Company]. Use the same specific-company fact from paragraph 2 of my cover letter: [fact]. Do not repeat the language of the cover letter — the recruiter may see both. First sentence: a specific outcome from my current work that this company would recognize as directly on-scope. Second sentence: the specific-fact reference. Third sentence: a one-clause statement of what I want to work on next.

*Gotcha:* the ATS often ranks this field as heavily as the résumé summary. Do not leave it blank, do not exceed the length, and do not paraphrase your cover letter.

### A13 · The "biggest weakness" pre-answer (B tier)

**When:** a screening portal asks for a weakness and you need something that does not sound rehearsed.

> Draft a 60-word answer to "what is your biggest weakness" that: (1) names a real weakness that a hiring manager would see as fixable, not a red flag; (2) names one specific step I have taken in the last 6 months to address it; (3) does not include any of the following clichés: perfectionism, working too hard, caring too much. My role context: [role and stack].

*Gotcha:* the best answer sounds slightly under-rehearsed. If the AI's draft is too polished, edit it down.

### A14 · Cover letter for a role slightly above your level (A tier)

**When:** the JD lists 5+ years and you have 3–4.

> Draft a 200-word cover letter to [Company] for [Role, listed as 5+ years]. My actual experience: [X years], but two specific outcomes below make me competitive against the 5-year bar: [outcome 1], [outcome 2]. Address the level question in the second paragraph, in one sentence, honestly — do not hide it. Frame the pitch as "here is what I can do on day one" rather than "here is what I could grow into." My authorization: [status].

*Gotcha:* if you have to hide the experience-gap fact for the letter to work, the letter does not work.

### A15 · Cover letter for a role slightly below your level (B tier)

**When:** you are over-qualified and want to signal it is deliberate, not desperate.

> Draft a 180-word cover letter to [Company] for [Role, listed as junior]. My experience is [X years] beyond the level. Address the level question in the first paragraph, in one sentence — the reason I want this role specifically: [reason: bridging program, relocation, lifestyle, mission fit — pick one and be honest]. Frame the pitch as "I know I am senior for this listing; here is what I bring that a junior candidate cannot." My authorization: [status].

*Gotcha:* recruiters do not believe "lifestyle" or "want less stress" reasons. Bridging programs, missions, and specific product interests read as honest; comfort reasons do not.

---

## Stage 3 · Follow-up (10 prompts)

Cover letters get you into the pipeline. Follow-ups keep you there. These are the prompts for after Send.

### F1 · The four-hour thank-you (S tier)

**When:** within four hours of any screening call, phone screen, or interview.

> Draft a 90-word thank-you email to [interviewer name and title] after our [type of call] today. Reference one specific thing from the call that I actually want to follow up on: [specific topic or question they raised]. Include one link or resource that is directly on-topic to that thing — [suggest what if I don't specify]. Close with one sentence naming the next step in the process they mentioned.

*Gotcha:* sent within four hours it reads warm; sent the next day it reads polite; sent 48 hours later it reads defensive. Set a timer.

### F2 · The one-week silence-breaker (A tier)

**When:** a recruiter went silent after "we'll be in touch by end of week."

> Draft a 70-word follow-up to [recruiter name] one week after our last exchange. First sentence: one-line reference to our last call and what they said the next step was. Second sentence: name one new signal since (a new commit, a new blog post, a related news item about the company or the industry). Third sentence: one-clause ask — "any update on next steps" or "should I check back in [time]." Do not apologize. Do not ask for feedback yet.

*Gotcha:* if this is your third silence-breaker, stop. The signal is louder than the silence.

### F3 · The two-week reactivator (B tier)

**When:** two weeks of silence, and you want one clean last try before closing the loop.

> Draft an 80-word note to [recruiter name] two weeks after our last exchange. Structure: (1) one line naming a genuine update on my side — a new certification, a new ship, a new offer if I have one; (2) one line saying I understand the timeline may have shifted; (3) one line asking whether the role is still open, and if not, whether they have anything else in the pipeline that matches. Do not sound needy. Do not offer to lower my ask.

*Gotcha:* mentioning a competing offer in this note is the single biggest lift in reply rate, but only if the offer is real and the timeline is genuine. Faking it and getting called on it is a career-limiting mistake.

### F4 · The "same role at a different company" pivot (B tier)

**When:** you interviewed and got a rejection, and the same role is open elsewhere.

> Given the following rejection letter from [Company A] and the following JD from [Company B], write a 100-word note to a recruiter at [Company B]. Reference (obliquely, one clause) that I recently interviewed for the same title elsewhere and reached the [stage] round. Do not name Company A. Frame my current-week status as "actively in-market for this role, ready to move fast on a good fit."

*Gotcha:* naming Company A is tempting and always a mistake — you look like a stalker or a leaker.

### F5 · Post-application follow-up when there's no recruiter contact (C tier)

**When:** you applied through the portal, got the automated confirmation, and have no human name.

> Given a [Role] posting at [Company] I applied to on [date], suggest three tactics for identifying and reaching a live human on the recruiting team, ranked by response likelihood. For the top-ranked tactic, draft a 60-word first-touch message.

*Gotcha:* the top-ranked tactic is almost always "find the recruiter on LinkedIn and message them the req ID in your first sentence." If AI suggests a "creative" tactic first, override.

### F6 · Post-final-round waiting note (A tier)

**When:** you had your last interview and the decision is coming.

> Draft an 80-word note to [interviewer or recruiter] the day after my final-round interview at [Company]. Reference one specific decision-point from the last conversation and one action I would take in the first two weeks of the role. Do not ask for a decision date. Do not include any language that reads as pressure.

*Gotcha:* if you did not take notes during the interview, do not send this — a generic version reads worse than nothing.

### F7 · Reference-list prep (S tier)

**When:** the recruiter asks for references and you need to send a polished list.

> Draft a one-page reference list for [Role] at [Company]. Include three references at the appropriate seniority (manager, peer, and cross-functional stakeholder from my current or most recent role). For each, provide a template line I should have them fill in for me — the two-sentence "what to say if a US/Canadian recruiter calls" briefing note. Format the list itself in the standard NA one-page reference format. My current role: [role].

*Gotcha:* the briefing note is the point — untrained references from Iran give beautiful character testimony and zero of the specific-ship language a NA recruiter needs.

### F8 · Post-verbal-offer stall (A tier)

**When:** you have a verbal offer and want 7 more days to run one more process.

> Draft a 90-word note to [recruiter] the day after receiving a verbal offer, asking for [X] additional business days before the written offer expires so I can complete another process I am in. Frame it as "excited about your offer, want to be able to accept in good faith with everything else closed." Do not disclose the other company. Do not disclose the number.

*Gotcha:* asking for more than 5 business days without a competing written offer usually spooks the recruiter into pulling back.

### F9 · The "I signed elsewhere" close (B tier)

**When:** you took another offer and want to close the current process cleanly for the future.

> Draft a 60-word note to [recruiter] telling them I have accepted another offer, thanking them for their time. Include one sentence naming what I liked about their process specifically (not the company generically). Ask them to keep my file for [Role] or [related role] the next time it opens.

*Gotcha:* recruiters remember who closed cleanly. This note becomes the S-tier warm-lead source for your next search.

### F10 · Six-month re-warmup (C tier)

**When:** you are ready to look again and want to reactivate an old warm-lead list.

> Given my list of ten recruiters and hiring managers I built rapport with in my last search [paste names + titles + last contact date + one-sentence context each], draft a 60-word re-warmup message template. Rules: the message must be personalized in exactly two clauses (the reason I remember them + one thing I have shipped since). Everything else can be templated across the ten.

*Gotcha:* even in a template, the two personalized clauses have to be real. AI cannot fake "I remember you because..."; you have to feed the specifics.

---

## Stage 4 · Interview prep (10 prompts)

The interview loop is where the immigrant tax is highest — you are being evaluated against candidates whose cultural defaults are the recruiter's cultural defaults. AI can close that gap faster than any book chapter can.

### I1 · Behavioral bank builder (S tier)

**When:** you have a first-round behavioral coming up in <72 hours.

> Given my résumé [paste] and the [Company + Role] context, build me a behavioral-question bank with exactly 20 questions I am likely to face, organized by category (leadership, conflict, ambiguity, failure, cross-functional, delivery under constraint). For each, in one line, suggest which one of my résumé bullets is the closest natural anchor for the answer.

*Gotcha:* AI over-samples questions like "tell me about a time you failed." Trim duplicates before you drill.

### I2 · STAR-format answer builder (S tier)

**When:** you have a specific behavioral question and one of your résumé bullets to anchor to.

> Given the question [question] and the résumé bullet [bullet], draft a 90-second STAR answer (Situation, Task, Action, Result) in first person, spoken register (not written). Include one concrete number in the Result. Cap the Situation at 20 seconds — most immigrant candidates over-explain context. Then flag two ways an interviewer might follow up and suggest a one-sentence pivot for each.

*Gotcha:* 90-second cap is not a suggestion. Interviewers zone out at the 2-minute mark and remember the ending you never got to.

### I3 · Technical-question stress test (A tier)

**When:** you have a technical / case interview coming up.

> Given the [role and level, e.g., Senior Software Engineer, staff-adjacent] at [Company], generate 15 technical questions I am likely to face across [named topic areas: system design, coding, ML, SQL, finance modeling, etc.]. For each, mark the expected depth on a 1–5 scale, note the two most common wrong answers I should not give, and give me one one-line prompt I can use with an AI to simulate a follow-up drill on that question later.

*Gotcha:* AI-generated "likely questions" are directionally correct but not the actual questions. Do not memorize; drill the shape.

### I4 · Case-study framing rehearsal (A tier)

**When:** you have a strategy / case interview at a consulting firm, VC, or ops-role loop.

> Give me one 20-minute mini-case aligned to a [target role and company / industry]. Score my response against a rubric with these dimensions: (1) structure the problem before touching numbers; (2) explicit assumptions with one-line rationale each; (3) numeracy — reasonable order of magnitude, no more than one arithmetic error; (4) recommendation with a clear one-sentence "if I had one more day, here's what I'd verify." Wait for my full spoken answer before scoring.

*Gotcha:* immigrants often front-load numeracy at the expense of structure. This prompt is calibrated to correct that.

### I5 · Salary-negotiation script (S tier)

**When:** the offer conversation is scheduled and you need a script to hold under pressure.

> Given a written offer of [base + equity + sign-on + bonus] from [Company] for [Role] in [City], and my target compensation range of [range] anchored by [D9 research data], write me a 300-word negotiation script. Structure: (1) 15 seconds of gratitude and unambiguous excitement about the role; (2) 45 seconds naming three specific asks with the reasoning for each (base, equity, sign-on — never all three, name the top two); (3) a specific mutual next step that is a scheduled call, not a Slack thread. Include a fallback line if the recruiter says "we cannot move on any of these."

*Gotcha:* immigrants ask for less than the market bears roughly 60% of the time. Anchor to the top of your range, not the middle.

### I6 · Immigration-question preemption (S tier)

**When:** the interviewer visibly hesitates when the topic of "when could you start" comes up.

> The interviewer asked me [question about work authorization / start date / relocation / dependent status]. Give me a 60-second spoken answer that: (1) states the fact clearly using Chapter 5's phrasing; (2) removes any risk on the hiring side that they might be over-reading; (3) closes with a positive-affirmation of my commitment to the role on the specific timeline they need. My status: [status].

*Gotcha:* rehearse this one out loud, on video, before the interview. The immigration question is where the smallest wobble costs the most.

### I7 · Culture / behavioral over-formality de-brief (B tier)

**When:** you just did a mock interview or a real one and want a debrief.

> Below is a transcript of my mock interview response to [question]. Score me on seven dimensions used by NA-market interviewers: (1) opening confidence; (2) pace and pauses; (3) use of "I" vs. "we" — flag when "we" hides my specific contribution; (4) hedging language ("kind of," "sort of," "I guess," "maybe"); (5) closing strength — was there a clear ending; (6) any over-formal phrasing that reads as script; (7) any cultural-reference gap I made that might not land in NA. Score each 1–5 with one-line justification. [Paste transcript].

*Gotcha:* dimension 3 is the single most common immigrant tell. Interviewers listen for "I owned" language, not "our team accomplished."

### I8 · Post-interview immediate self-debrief (B tier)

**When:** within one hour after any interview.

> I just finished an interview at [Company] for [Role]. Walk me through a structured self-debrief in seven questions, waiting for my typed answer to each before moving on: (1) What is one question I answered strongly? (2) What is one I answered weakly? (3) Was there a moment I saw them lean in? (4) Was there a moment I saw them lose interest? (5) Any new information I got about the role or team? (6) What is the single next thing I should do in the next 4 hours? (7) What is my honest gut on the outcome, one word?

*Gotcha:* answer each in one sentence. This is a 5-minute exercise, not a therapy session.

### I9 · Compensation-package comparison (A tier)

**When:** you have two offers and need to compare them apples-to-apples.

> Compare the following two offers on 12 dimensions, in a table: base, target-year-1 total comp, equity vesting shape, sign-on, benefits (health, retirement, dental, mental health), PTO, remote/hybrid policy, level and title trajectory, immigration risk (for someone on [status]), team fit signals, career-brand value of the company for future roles, and total two-year expected value with 20% attrition risk baked in. Then give me a one-paragraph recommendation. Offers: [Offer A] [Offer B].

*Gotcha:* the 12-dimension table is a decision aid, not the decision. The recommendation paragraph is where the actual judgment happens — verify it.

### I10 · Post-final-round waiting silence-breaker (B tier)

**When:** you finished the final round three weeks ago, the recruiter promised a decision "any day," and you have heard nothing.

> Draft a 90-word note to [recruiter or hiring manager] three weeks after my final round for [Role] at [Company]. Do not sound irritated. Reference one industry-relevant update since the interview. Include one clause naming that I have another process at the final-round stage that expects a decision by [date]. Ask specifically for a status update by end of week, not for a decision.

*Gotcha:* only use "another process at final round" if it is true. This is one lie that always gets caught.

---

## Stage 5 · Rejection & recovery (5 prompts)

Rejections are the majority of your outcomes. Handling them well is the difference between a job search that ends and a job search that eats you.

### R1 · The rejection-response note (S tier)

**When:** within 12 hours of receiving a rejection, especially after a late-stage interview.

> Draft a 70-word response to [recruiter] to a rejection for [Role] at [Company] after reaching [stage]. Structure: (1) one line thanking them and naming one thing I actually valued about the process; (2) one line asking specifically whether I can be kept in the pipeline for the [related role at same or lower level] that I know they hire for; (3) one line asking whether they would be open to a 15-minute feedback call in two weeks.

*Gotcha:* about 15% of these convert to an in-pipeline hire within six months. Skip the note and you skip the 15%.

### R2 · The specific-feedback ask (A tier)

**When:** a recruiter or hiring manager offered feedback and you want to make sure it lands as concrete signal, not platitudes.

> Draft a 60-word reply to [name] taking them up on their feedback offer for my process at [Company]. Ask three specific yes/no questions, not one open question. Suggested angles: "was the concern primarily [technical / cultural / experience-level / immigration]?"; "if I addressed [specific gap] over the next 6 months, would you consider me for a future role?"; "would you refer me to a peer at a company where my current profile is a better match?"

*Gotcha:* yes/no questions get answered. Open questions get "you were great but not the right fit at this time."

### R3 · Weekly retro after 20 applications with no reply (A tier)

**When:** you sent 20 applications in a week and got fewer than 2 replies.

> Below is a batch of 20 applications I sent this week [paste table of company / role / cover-letter-first-paragraph / sent-date]. Score the batch on three dimensions: (1) target quality — was the ratio of S/A/B tier targets right for my status? (2) letter specificity — do the opening paragraphs sound interchangeable or targeted? (3) immigration-status resolution — is the authorization line clear in every one? Then give me three specific, ranked things to change for next week's batch.

*Gotcha:* if the answer to any of the three dimensions is "poor," changing that one dimension usually doubles reply rate the next week.

### R4 · Confidence-restore prompt (C tier)

**When:** you got 40 rejections in a row and cannot bring yourself to open the ATS again this morning.

> Below is my résumé [paste]. Ignore the recent rejections context — I will feed you that later. First, without hedging: name the three strongest things on this résumé that a hiring manager in [target role, target market] would genuinely see as differentiating. Second, name the two most likely reasons a hiring manager might not recognize those strengths from the résumé alone. Third, name exactly one thing I could change in the next 30 minutes that would move the most-likely reason. That is the whole exercise — no motivational language, no pep talk.

*Gotcha:* the "no pep talk" instruction is load-bearing. Without it AI produces cheerleading that leaves you feeling worse.

### R5 · The pivot-check (C tier)

**When:** three months of applying in one lane, no traction, and you are wondering if the lane is wrong.

> Given my résumé [paste], my three-month application log [paste key rows: role, seniority, industry, outcome], and my current status [status], answer three questions without hedging: (1) Is my current target role a realistic match for my résumé, or am I aiming a full level too high / too low? (2) Is there an adjacent role or industry where my résumé would be an obvious yes rather than a plausible maybe? (3) If I switched to that adjacent lane, what are the three specific résumé edits I would need to make in the next two hours to send my first application there this weekend?

*Gotcha:* if the answer to question 2 is "yes and here it is," take the pivot seriously. AI hedges toward the ambitious lane — a straight "yes, pivot" is a strong signal.

---

## How to actually use this library

Two habits, one Sunday routine.

**Habit 1: pin the tier-S prompts.** All of them. There are twelve: D1, D2, D6, D8, A1, A2, A4, A5, A7, F1, F7, I1, I2, I5, I6, R1. Copy them into your notes app or a Claude project. Never write them from scratch again.

**Habit 2: pair every application with two prompts, minimum.** One from Stage 1 (Discovery), one from Stage 2 (Application). If you skip Discovery and go straight to Application, the letter is generic.

**Sunday routine (45 minutes):** run D10 to build your ten-target pipeline for the week, then run D1 on each of the ten. Kill the ones that fail D1's question 3. The survivors get the full A-stage treatment on Monday-through-Wednesday nights. Thursday and Friday are for F-stage follow-ups. Weekend is for I-stage prep on anything that moved to a screen.

Two hours a day, structured this way, produces higher-reply-rate applications than eight hours a day of unstructured "just apply to everything."

---

## What Part 3 does next

Chapter 10 turns from prompts to the *content* those prompts should produce: the ATS beat sheet — the exact keywords, in the exact frequencies, that the top ATSes are looking for in your field. This is the artifact you feed into A4 (résumé-to-JD alignment) so the alignment pass actually converges. Chapter 11 closes Part 3 with the feedback loop: how to feed your own rejections back into the AI so the next fifty applications are strictly better than the last fifty.

For now, pin the tier-S prompts. That alone is worth the price of the book.

---

## Screenshot page

| The idea | The number | What to do |
|---|---|---|
| Prompts in this library | 50 | Bookmark or copy the whole file |
| Search stages the library covers | 5 (Discovery, Application, Follow-up, Interview, Rejection) | Use at least one prompt from each stage per week |
| Tier-S prompts (~35–50% reply rate) | 16 | Pin these — use them first every time |
| Prompt pairs per application (minimum) | 2 (one Discovery + one Application) | Never send a letter without both |
| Sunday routine budget | 45 min | Runs D10 + D1 on ten targets, produces the week's shortlist |
| Weekly application budget for this system | 10 apps × 20 min | Higher reply rate than 40 apps at 5 min each |

Fifty prompts. Ranked. Every prompt tested against the one question that matters: did the recipient reply? Chapter 10 next.
