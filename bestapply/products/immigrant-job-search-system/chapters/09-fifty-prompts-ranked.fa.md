# فصل ۹ · پنجاه prompt، رتبه‌بندی‌شده بر اساس response rate

فصل ۸ ده تا cover-letter prompt بهت داد. این فصل یه کتابخانهٔ فعال از پنجاه‌تا بهت می‌ده — هر prompt ای که یه immigrant job seeker[^searcher] لازم داره، از اولین باری که یه JD می‌خونی تا روزی که rejection response note رو می‌فرستی. رتبه‌بندی‌شده بر اساس response rate، که بدونی وقتی هفته کوتاهه، اول به کدوم دست ببری.

هیچ‌وقت دیگه، برای بقیهٔ این job search، با یه صفحهٔ سفید مواجه نمی‌شی.

---

## رتبه‌بندی چطور کار می‌کنه

response rate این‌جا یه چیز معنی می‌ده: *گیرنده توی هفت روز جواب داد*. نه «باز کرد»، نه «خوند»، نه «توی LinkedIn یه thumbs-up ری‌اکشن زد». جواب داد — با کلمه، یا یه تماس ثبت‌شده، یا یه next step.

چهار tier[^tier]، به‌طور تقریبی کالیبره‌شده با چیزی که توی سه سال گذشته بین immigrant job seeker های tech، finance، healthcare و trades دیده‌ام:

- **S tier (~۳۵-۵۰٪ نرخ پاسخ):** این‌ها رو اول بفرست. هر مهاجری این‌ها رو باید همین هفته دستش داشته باشه.
- **A tier (~۲۰-۳۰٪):** اسب‌های بارکش. وقتی یه target مشخص و یه intel[^intel] مشخص داری، از این‌ها استفاده کن.
- **B tier (~۱۰-۱۵٪):** موقعیتی. وقتی شرایط اعمال بشه قوی، وقتی نشه ضعیف.
- **C tier (~۵-۱۰٪):** edge case ها. rejection recovery، salary re-opener، cold re-engagement.

نرخ پاسخ همه‌ی داستان نیست — یه prompt سطح C که جواب یه director ارشد رو بگیره، از بیست جواب S tier یه recruiter تازه‌کار بهتره. ولی وقتی شنبه صبح دو ساعت وقت داری، اول بر اساس tier مرتب می‌کنی و بعد بر اساس specificity.

هر application ردشده‌ای که یه مهاجر باهاش مواجه می‌شه، غیر از زمان، انگیزهٔ ادامه دادن رو هم ازش می‌گیره. این کتابخانه چیزیه که نمی‌ذاره انگیزه تموم بشه.

---

## مرحلهٔ ۱ · Discovery (۱۰ prompt)

قبل از این‌که چیزی بنویسی، باید بدونی به چی داری می‌نویسی. این prompt ها یه job posting رو به target تبدیل می‌کنن.

### D1 · JD triage (S tier)

**کِی:** به یه job posting نگاه می‌کنی و توی ۳۰ ثانیه نمی‌تونی بگی ارزش نوشتن cover letter رو داره یا نه.

> Read the following job posting and answer four questions in one paragraph each: (1) What is the *actual* NOC 2021 code for this role in Canada, and what is the closest O*NET-SOC code in the US? (2) Which specific keywords must appear in my résumé and cover letter to pass an ATS with default weights for this posting? Rank the top ten by importance. (3) Are there any hard filters (work-authorization, licensing, security clearance, on-site requirement) that would reject me before a human sees my file, given my status: [your status]? (4) What single fact about the applicant (a certification, a former employer, a specific ship) would make a hiring manager stop skimming and read the cover letter? [Paste JD].

*Gotcha:* اگه جواب سؤال ۳ برگرده «yes, hard filter»، ده دقیقه رو صرف نوشتن letter نکن. برو بعدی.

### D2 · Company deep-read برای پاراگراف دوم (S tier)

**کِی:** یه شرکت target داری و JD از triage گذشت.

> Search for and summarize five things about [Company] from the last 90 days that could plausibly go into the second paragraph of a cover letter: a public product ship, a public strategy note, an engineering-blog post, a leadership hire or departure, and an earnings-call or press-release detail. For each, give the source URL and a two-sentence summary. Rank them by how directly relevant they are to the [Role] posting I am targeting. Do not include anything older than 90 days.

*Gotcha:* AI هنوز منابع عمومی رو confabulate[^confab] می‌کنه. قبل از paste کردن به letter، هر URL رو باز کن ببین match می‌شه.

### D3 · شناسایی hiring manager (A tier)

**کِی:** می‌خوای از recruiter رد بشی و به آدمی برسی که واقعاً استخدامت می‌کنه.

> Given a [Role] posting at [Company], suggest three plausible titles for the hiring manager for this role in a company of this size and structure (e.g., "Director of Data Engineering," "VP People," "Head of Clinical Operations"). For each, give me the LinkedIn search query I would use to find current holders of that title at [Company]. Do not name specific people — just the titles and the search patterns.

*Gotcha:* حتماً با یه search واقعی LinkedIn جفت کن — هیچ‌وقت یه اسم پیشنهادی prompt رو بدون چک کردن نفرست، هیچ‌وقت.

### D4 · Culture-fit vector check شرکت (A tier)

**کِی:** بین دو تا posting باز توی شرکت‌های مشابه انتخاب می‌کنی و می‌خوای اونی که hit-rate بالاتری داره رو پیدا کنی.

> Compare [Company A] and [Company B] on five dimensions relevant to an immigrant candidate: (1) documented history of sponsoring H-1B / hiring PGWP / equivalent; (2) publicly visible employee-review sentiment on immigrant onboarding (Glassdoor, Blind, Reddit); (3) team-language expectations (English-only, bilingual, other); (4) remote/hybrid/on-site policy for the specific team; (5) recent layoffs or hiring freezes in the last 12 months. Cite sources. Rank the two companies for me and recommend which to apply to first.

*Gotcha:* Blind و Reddit به سمت منفی skew دارن؛ قبل از این‌که یه thread رتبه رو عوض کنه، signal-to-noise رو بسنج.

### D5 · Job-market timing check (B tier)

**کِی:** می‌خوای بدونی الان apply کنی یا هفتهٔ بعد.

> Give me a market snapshot for [Role] in [City / Region] over the last 30 days: rough number of postings, whether the trend is up or down vs. the prior 90-day average, three companies actively hiring right now, and one specific signal (a funding round, a product launch, a layoff-then-rehire) that would make a specific company more likely to move fast on hires this month. Cite sources.

*Gotcha:* noise ماه به ماه توی role های تخصصی زیاده — به direction اعتماد کن، نه به عدد.

### D6 · Template outreach به recruiter (S tier)

**کِی:** یه recruiter توی شرکت target یه role پست کرده و احتمالاً غرقه.

> Draft a 60-word LinkedIn message to a recruiter at [Company] for [Role]. First sentence names the exact posting and req ID. Second sentence gives one specific fact about me that is directly on-scope: [fact]. Third sentence is a single-clause ask: "20-minute call this week?" No adjectives. No "I hope this message finds you well." No emojis.

*Gotcha:* اگه جملهٔ اولت req ID[^reqid] رو نام نبره، این خیلی سریع می‌شه یه prompt سطح B.

### D7 · پیدا کردن referral (A tier)

**کِی:** حدس می‌زنی یه نفر توی network گسترده‌ت توی شرکت target کار می‌کنه.

> Given my LinkedIn network CSV (I will paste it in), find every 1st- and 2nd-degree connection currently at [Company]. For each, give me their title, tenure, and the shortest connection path — including specifically what my 1st-degree connection is likely to know about them. Rank by likelihood of being willing to make a referral for a [Role] posting.

*Gotcha:* اجرای این بدون یه export واقعی LinkedIn، fabrication های با اعتماد به نفس تولید می‌کنه. یا CSV رو paste کن یا اجرا نکن.

### D8 · تحلیل gap بین JD و رزومه (S tier)

**کِی:** نگرانی رزومه‌ات چیزی رو که JD صریح می‌خواد نداره.

> Compare the following JD to the following résumé. Produce three lists: (1) requirements in the JD that my résumé fully satisfies — quote the résumé line; (2) requirements the JD asks for that my résumé does not mention but that I plausibly have from context — for each, suggest a one-line addition to the closest résumé bullet; (3) requirements the JD asks for that I clearly do not have — do not suggest lying, just tell me what they are so I can decide whether to apply anyway. [Paste JD] [Paste résumé].

*Gotcha:* گروه (۲) جاییه که با ارزش‌ترین ATS keyword ها اضافه می‌شن — ولی فقط اگه claim زیرش درست باشه. bullet ای که نمی‌تونی توی interview پشتش وایسی رو اضافه نکن.

### D9 · Salary anchor research (A tier)

**کِی:** recruiter در آستانهٔ پرسیدن «what are you looking for» توی اولین تماسه.

> Give me a salary range for [Role] at [Company or similar tier] in [City] as of the last 90 days, in [CAD / USD]. Sources: Levels.fyi, Glassdoor, LinkedIn Salary, publicly available H-1B / LMIA salary disclosures. Give me the 25th, 50th, and 75th percentile numbers. Then give me a one-sentence anchor I could use on a call — expressed as a range whose bottom is the 60th percentile and whose top is 20% above the 75th.

*Gotcha:* data افشای H-1B شش تا دوازده ماه lag داره و به سمت پایین skew می‌کنه. با Levels.fyi برای اعداد سال جاری کراس‌چک کن.

### D10 · انتخاب target هفتگی (B tier)

**کِی:** یکشنبه شب، تصمیم می‌گیری این هفته به چی apply کنی.

> Given my target role of [Role], my status of [status], my city of [City], and a two-hour-a-day time budget for this week, suggest a pipeline of ten applications for the week: three high-confidence targets (S tier — likely reply), four moderate (A tier — reasonable shot), and three stretches (B tier — good practice, low expected reply). For each, give me the company name, the posting URL, and one sentence on why it earned its tier. Prefer variety across company size and stage.

*Gotcha:* اون ده target فقط وقتی مفیدن که قبل از نوشتن cover letter، روی هر کدوم D1 رو اجرا کنی.

---

## مرحلهٔ ۲ · Application (۱۵ prompt)

قلب کتابخانه. این‌ها فراتر از ده prompt پایهٔ فصل ۸ می‌رن با پوشش دادن rewrite ها، re-target ها، و adaptation های خاصی که یه search زنده لازم داره.

### A1 · بازنویسی bullet رزومه (S tier)

**کِی:** یه bullet رزومه مثل شرح شغلی که بهت assign شده می‌خونه، نه چیزی که ship کردی.

> Rewrite the following résumé bullet so it: (1) leads with a strong past-tense verb; (2) contains one specific technology, framework, or standard by name; (3) contains one quantitative outcome, using a real number if I give you one, otherwise a plausible order-of-magnitude range I can adjust; (4) is one line, under 22 words. Do not use "responsible for" or "helped with." [Paste bullet].

*Gotcha:* اگه AI یه عدد مشخص اختراع کرد که هیچ‌وقت نداشتی، عوضش کن با یه range یا حذفش کن. هیچ‌وقت یه bullet با عدد ساختگی به یه کارفرمای واقعی نفرست.

### A2 · مترجم عنوان شغل (S tier)

**کِی:** آخرین عنوان شغلت فارسی بود، عربی بود، یا یه عنوان مخصوص شرکتی بود که توی NA وجود نداره.

> My last job title in [Country] was: [title, in original language and English translation]. My actual responsibilities were: [3–5 bullets]. Suggest three NA-market job titles (Canada + US) that best describe this role, using NOC 2021 and O*NET-SOC vocabulary. For each, give me the closest NOC code and O*NET code. Recommend which title to use as my primary résumé heading if I am targeting [target market].

*Gotcha:* عنوان «primary» باید با ردیف crosswalk فصل ۴ برای role هدفت match بشه.

### A3 · Re-target کردن cover letter (A tier)

**کِی:** یه cover letter کارآمد برای یه شرکت داری و می‌خوای برای شرکت دیگه‌ای توی همون صنعت adapt ش کنی.

> Take the following cover letter (last used for [Original Company]) and adapt it for [New Company]'s [Role] posting. Keep the first paragraph structure and my personal facts unchanged. Rewrite the second paragraph so it references one specific thing about [New Company] that is not in the original — feed from [source URL you researched]. Keep the length within 20 words of the original. [Paste original cover letter].

*Gotcha:* اگه پاراگراف ۲ بین پنج target اول تو قابل تعویضه، بازنویسی کن — نکته رو از دست دادی.

### A4 · Pass تطبیق رزومه با JD (S tier)

**کِی:** آماده‌ای submit کنی و یه کالیبراسیون آخر روی چگالی ATS keyword می‌خوای.

> For the following JD, extract the ten highest-weighted keywords a default ATS parser would look for (Workday-style default). Then scan my résumé for each. For each keyword: does it appear? If yes, in which section? If no, suggest exactly one sentence I could add to the most natural section to include it truthfully. Do not suggest keyword stuffing. [Paste JD] [Paste résumé].

*Gotcha:* اگه جواب «آیا این claim توی سؤال interview جون سالم به در می‌بره؟» نه‌ست، جمله رو اضافه نکن.

### A5 · بازنویسی executive summary (S tier)

**کِی:** خلاصهٔ دو-خطی بالای رزومه‌ات generic ه.

> Rewrite the following two-line résumé summary so that: (1) line one names my current or most recent role, one specific stack or domain, and my authorization-line phrasing from Chapter 5 [insert your line]; (2) line two names one measurable outcome from the last 24 months and one specific tool or standard. No adjectives. Total under 32 words. [Paste current summary].

*Gotcha:* summary اول خونده می‌شه — recruiter پنج ثانیه براش وقت داره. هر کلمه باید هم وزن ATS keyword رو کسب کنه هم ارزش برای خواننده‌ی انسانی.

### A6 · بازنویسی LinkedIn About (A tier)

**کِی:** بخش About توی LinkedIn ت هنوز template پیش‌فرض چهار سال پیشه.

> Rewrite my LinkedIn About section in first person, three paragraphs, under 180 words total. Paragraph 1: one specific ship from my current role + the immigration authorization line. Paragraph 2: two specific outcomes from the last 24 months with numbers. Paragraph 3: one sentence on what I am open to hearing about — the exact roles, the exact companies (or types), and how to reach me. No adjectives like "passionate," "driven," or "detail-oriented." Match this résumé: [paste résumé].

*Gotcha:* بخش About برای search AI ی LinkedIn وزن سنگین داره — پاراگراف ۱ باید target-role keyword رو توی ۱۲ کلمهٔ اولش داشته باشه.

### A7 · Swap-in headline لینکداین (S tier)

**کِی:** headline ات هنوز عنوان شغل فعلیت + شرکته.

> Rewrite my LinkedIn headline using the formula from Chapter 6: [Role from crosswalk] · [stack or domain specialty] · [availability signal from Chapter 5]. Target role: [role]. My stack: [stack]. My authorization: [status]. Give me three variations. Do not use any adjectives.

*Gotcha:* هر ۹۰ روز دوباره چک کن — role هدف یا stack احتمالاً حرکت کرده.

### A8 · Draft درخواست referral (S tier)

**کِی:** یه اتصال درجهٔ ۱ یا ۲ توی یه شرکت target کار می‌کنه.

> Draft a 90-word LinkedIn / email message to [Name], a [connection degree] connection at [Company], asking whether they would be willing to make a referral for the [Role, req ID]. Do not ask for a job. Do not ask for advice. Ask specifically for a referral. Reference how we know each other in one clause: [context]. Include one line on why I am a defensible fit: [one specific fact]. Close with a specific low-effort ask: forward the req ID plus my résumé to the internal referral portal.

*Gotcha:* پیام‌هایی که «advice» یا «a quick chat» می‌خوان، نصف نرخ پاسخِ پیام‌هایی رو دارن که ask مشخصی نام می‌برن.

### A9 · Shrinker رزومه (A tier)

**کِی:** رزومه‌ات ۳+ صفحه‌ست و باید به ۱-۲ صفحه برسه.

> The following résumé is [X] pages and needs to be cut to [1 or 2] pages while preserving ATS keyword coverage and every measurable outcome. Produce two outputs: (1) a list of the specific bullets to delete with a one-line reason each; (2) a list of the specific bullets to shorten with the exact rewrite. Do not delete anything from my current role. Do not touch the education or certifications sections. Keep my authorization line. [Paste résumé].

*Gotcha:* AI با خوشحالی چیزهایی رو حذف می‌کنه که نباید. قبل از قبول، لیست delete رو بخون.

### A10 · Write-up پروژهٔ پورتفولیو (B tier)

**کِی:** یه پروژهٔ جانبی یا contribution open-source داری و هیچ pitch یه‌پاراگرافی براش نداری.

> Write a 90-word paragraph describing my project [Project name and URL] suitable for the "Projects" section of a résumé and the pinned-featured section of my LinkedIn. Structure: what it does in one sentence, the stack in one sentence, one measurable outcome in one sentence, and one specific technical decision I made and why in one sentence. Do not use "I built" more than once. [Paste README or repo details].

*Gotcha:* اگه هیچ outcome قابل اندازه‌گیری‌ای نیست (ستاره، کاربر، دانلود)، پروژه رو از رزومه حذف کن به‌جای اینکه list ش کنی — یه پروژهٔ جانبی محبوب‌نشده بدتر از هیچ پروژهٔ جانبی می‌خونه.

### A11 · چک زبان application دو-زبانه (A tier)

**کِی:** توی کبک apply می‌کنی، یا یه role دوزبانه توی اوتاوا/Moncton.

> Rewrite the following cover letter so the second paragraph is in French (Quebec register), keeping the rest in English. If any French phrase would sound stilted or too formal for a business email in Montreal specifically, flag it and suggest the natural alternative. Then produce a second, all-French version of the entire letter. My CELPIP-French / TEF result: [level]. [Paste cover letter].

*Gotcha:* اگه TEF ت زیر B2 ه، نسخهٔ کاملاً فرانسه رو نفرست — recruiter می‌فهمه.

### A12 · فیلدهای free-text پرتال application (S tier)

**کِی:** پرتال Workday / Greenhouse می‌پرسه «why do you want to work here» توی یه box free-text و تو چهار دقیقه وقت داری.

> Draft a 100-word response to "why do you want to work here" for [Company]. Use the same specific-company fact from paragraph 2 of my cover letter: [fact]. Do not repeat the language of the cover letter — the recruiter may see both. First sentence: a specific outcome from my current work that this company would recognize as directly on-scope. Second sentence: the specific-fact reference. Third sentence: a one-clause statement of what I want to work on next.

*Gotcha:* ATS اغلب این فیلد رو به سنگینی رزومه summary رتبه‌بندی می‌کنه. خالی نذار، طول رو رد نکن، و cover letter رو paraphrase نکن.

### A13 · pre-answer «biggest weakness» (B tier)

**کِی:** یه پرتال screening می‌خواد weakness و می‌خوای چیزی داشته باشی که rehearsed به نظر نیاد.

> Draft a 60-word answer to "what is your biggest weakness" that: (1) names a real weakness that a hiring manager would see as fixable, not a red flag; (2) names one specific step I have taken in the last 6 months to address it; (3) does not include any of the following clichés: perfectionism, working too hard, caring too much. My role context: [role and stack].

*Gotcha:* بهترین جواب کمی under-rehearsed به نظر می‌رسه. اگه draft AI خیلی صیقلی بود، ادیت کن.

### A14 · Cover letter برای role کمی بالاتر از سطحت (A tier)

**کِی:** JD می‌گه ۵+ سال و تو ۳-۴ سال داری.

> Draft a 200-word cover letter to [Company] for [Role, listed as 5+ years]. My actual experience: [X years], but two specific outcomes below make me competitive against the 5-year bar: [outcome 1], [outcome 2]. Address the level question in the second paragraph, in one sentence, honestly — do not hide it. Frame the pitch as "here is what I can do on day one" rather than "here is what I could grow into." My authorization: [status].

*Gotcha:* اگه باید experience-gap fact رو مخفی کنی تا letter کار کنه، letter کار نمی‌کنه.

### A15 · Cover letter برای role کمی پایین‌تر از سطحت (B tier)

**کِی:** over-qualified هستی و می‌خوای signal بدی که این عمدیه، نه از سر ناچاری.

> Draft a 180-word cover letter to [Company] for [Role, listed as junior]. My experience is [X years] beyond the level. Address the level question in the first paragraph, in one sentence — the reason I want this role specifically: [reason: bridging program, relocation, lifestyle, mission fit — pick one and be honest]. Frame the pitch as "I know I am senior for this listing; here is what I bring that a junior candidate cannot." My authorization: [status].

*Gotcha:* recruiter ها دلیل «lifestyle» یا «کمتر stress می‌خوام» رو باور نمی‌کنن. bridging program، mission، و علاقهٔ مشخص به یه محصول صادقانه می‌خونن؛ دلایل راحتی نه.

---

## مرحلهٔ ۳ · Follow-up (۱۰ prompt)

Cover letter ها تو رو توی pipeline می‌ذارن. Follow-up ها نگهت می‌دارن. این‌ها prompt های بعد از Send هستن.

### F1 · thank-you چهار-ساعته (S tier)

**کِی:** توی چهار ساعت بعد از هر screening call، phone screen، یا interview.

> Draft a 90-word thank-you email to [interviewer name and title] after our [type of call] today. Reference one specific thing from the call that I actually want to follow up on: [specific topic or question they raised]. Include one link or resource that is directly on-topic to that thing — [suggest what if I don't specify]. Close with one sentence naming the next step in the process they mentioned.

*Gotcha:* توی چهار ساعت گرم می‌خونه؛ روز بعد مؤدبانه می‌خونه؛ ۴۸ ساعت بعد defensive می‌خونه. تایمر بذار.

### F2 · شکستن سکوت یک‌هفته‌ای (A tier)

**کِی:** یه recruiter بعد از «we'll be in touch by end of week» ساکت شد.

> Draft a 70-word follow-up to [recruiter name] one week after our last exchange. First sentence: one-line reference to our last call and what they said the next step was. Second sentence: name one new signal since (a new commit, a new blog post, a related news item about the company or the industry). Third sentence: one-clause ask — "any update on next steps" or "should I check back in [time]." Do not apologize. Do not ask for feedback yet.

*Gotcha:* اگه این سومین شکستن سکوتته، ول کن. signal بلندتر از سکوته.

### F3 · Reactivator دو-هفته‌ای (B tier)

**کِی:** دو هفته سکوت، و می‌خوای یه بار آخر تمیز قبل از بستن loop امتحان کنی.

> Draft an 80-word note to [recruiter name] two weeks after our last exchange. Structure: (1) one line naming a genuine update on my side — a new certification, a new ship, a new offer if I have one; (2) one line saying I understand the timeline may have shifted; (3) one line asking whether the role is still open, and if not, whether they have anything else in the pipeline that matches. Do not sound needy. Do not offer to lower my ask.

*Gotcha:* ذکر یه offer رقیب توی این note، بزرگ‌ترین تنها lift توی نرخ پاسخه، ولی فقط اگه offer واقعی باشه و timeline واقعی. جعل کردن و گیر افتادن یه اشتباه محدودکنندهٔ حرفه‌ایه.

### F4 · pivot «همون role توی شرکت متفاوت» (B tier)

**کِی:** interview کردی و rejection گرفتی، و همون role جای دیگه بازه.

> Given the following rejection letter from [Company A] and the following JD from [Company B], write a 100-word note to a recruiter at [Company B]. Reference (obliquely, one clause) that I recently interviewed for the same title elsewhere and reached the [stage] round. Do not name Company A. Frame my current-week status as "actively in-market for this role, ready to move fast on a good fit."

*Gotcha:* نام بردن شرکت A وسوسه‌کننده و همیشه اشتباهه — مثل یه stalker یا leaker به نظر می‌رسی.

### F5 · Follow-up بعد از application وقتی هیچ اتصال recruiter نیست (C tier)

**کِی:** از پرتال apply کردی، confirmation خودکار گرفتی، و هیچ اسم انسانی نداری.

> Given a [Role] posting at [Company] I applied to on [date], suggest three tactics for identifying and reaching a live human on the recruiting team, ranked by response likelihood. For the top-ranked tactic, draft a 60-word first-touch message.

*Gotcha:* بهترین tactic تقریباً همیشه «recruiter رو توی LinkedIn پیدا کن و req ID رو توی جملهٔ اولت بهش پیام بده» ست. اگه AI اول یه tactic «خلاقانه» پیشنهاد کرد، override کن.

### F6 · Note انتظار بعد از final-round (A tier)

**کِی:** آخرین interview رو داشتی و تصمیم داره می‌آد.

> Draft an 80-word note to [interviewer or recruiter] the day after my final-round interview at [Company]. Reference one specific decision-point from the last conversation and one action I would take in the first two weeks of the role. Do not ask for a decision date. Do not include any language that reads as pressure.

*Gotcha:* اگه توی interview یادداشت نگرفتی، این رو نفرست — یه نسخهٔ generic بدتر از هیچی می‌خونه.

### F7 · آماده‌سازی reference-list (S tier)

**کِی:** recruiter reference می‌خواد و می‌خوای یه لیست صیقلی بفرستی.

> Draft a one-page reference list for [Role] at [Company]. Include three references at the appropriate seniority (manager, peer, and cross-functional stakeholder from my current or most recent role). For each, provide a template line I should have them fill in for me — the two-sentence "what to say if a US/Canadian recruiter calls" briefing note. Format the list itself in the standard NA one-page reference format. My current role: [role].

*Gotcha:* briefing note نکته‌ست — reference های آموزش‌ندیده از ایران گواهی زیبای شخصیت می‌دن و صفر زبان specific-ship که یه recruiter NA لازم داره.

### F8 · Stall بعد از offer شفاهی (A tier)

**کِی:** یه offer شفاهی داری و می‌خوای ۷ روز بیشتر برای اجرای یه process دیگه.

> Draft a 90-word note to [recruiter] the day after receiving a verbal offer, asking for [X] additional business days before the written offer expires so I can complete another process I am in. Frame it as "excited about your offer, want to be able to accept in good faith with everything else closed." Do not disclose the other company. Do not disclose the number.

*Gotcha:* درخواست بیشتر از ۵ روز کاری بدون یه written offer رقیب، معمولاً recruiter رو می‌ترسونه که عقب بکشه.

### F9 · بستن «signed elsewhere» (B tier)

**کِی:** offer دیگه‌ای رو قبول کردی و می‌خوای process فعلی رو برای آینده تمیز ببندی.

> Draft a 60-word note to [recruiter] telling them I have accepted another offer, thanking them for their time. Include one sentence naming what I liked about their process specifically (not the company generically). Ask them to keep my file for [Role] or [related role] the next time it opens.

*Gotcha:* recruiter ها یادشون می‌مونه کی تمیز بست. این note به منبع S-tier warm-lead برای search بعدیت تبدیل می‌شه.

### F10 · Re-warmup شش-ماهه (C tier)

**کِی:** آماده‌ای دوباره نگاه کنی و می‌خوای یه لیست warm-lead قدیمی رو reactivate کنی.

> Given my list of ten recruiters and hiring managers I built rapport with in my last search [paste names + titles + last contact date + one-sentence context each], draft a 60-word re-warmup message template. Rules: the message must be personalized in exactly two clauses (the reason I remember them + one thing I have shipped since). Everything else can be templated across the ten.

*Gotcha:* حتی توی template، اون دو کلاز شخصی‌سازی‌شده باید واقعی باشن. AI نمی‌تونه «I remember you because...» رو جعل کنه؛ تو باید مشخصات رو feed کنی.

---

## مرحلهٔ ۴ · آماده‌سازی interview (۱۰ prompt)

Loop interview جاییه که تاکس مهاجر بالاترینه — تو در برابر کاندیدهایی evaluate می‌شی که default های فرهنگی‌شون default های فرهنگی recruiter ن. AI می‌تونه اون gap رو سریع‌تر از هر فصل کتابی ببنده.

### I1 · Builder بانک behavioral (S tier)

**کِی:** یه دور اول behavioral توی کمتر از ۷۲ ساعت داری.

> Given my résumé [paste] and the [Company + Role] context, build me a behavioral-question bank with exactly 20 questions I am likely to face, organized by category (leadership, conflict, ambiguity, failure, cross-functional, delivery under constraint). For each, in one line, suggest which one of my résumé bullets is the closest natural anchor for the answer.

*Gotcha:* AI بیش از حد سؤال «tell me about a time you failed» رو نمونه‌گیری می‌کنه. قبل از drill تکراری‌ها رو trim کن.

### I2 · Builder جواب فرمت STAR (S tier)

**کِی:** یه سؤال behavioral مشخص داری و یکی از bullet های رزومه‌ات برای anchor کردنش.

> Given the question [question] and the résumé bullet [bullet], draft a 90-second STAR[^star] answer (Situation, Task, Action, Result) in first person, spoken register (not written). Include one concrete number in the Result. Cap the Situation at 20 seconds — most immigrant candidates over-explain context. Then flag two ways an interviewer might follow up and suggest a one-sentence pivot for each.

*Gotcha:* سقف ۹۰ ثانیه پیشنهاد نیست. interviewer ها توی مارک ۲ دقیقه zone out می‌کنن و پایانی رو یادشون می‌مونه که هیچ‌وقت بهش نرسیدی.

### I3 · Stress test سؤال فنی (A tier)

**کِی:** یه interview فنی / case داری.

> Given the [role and level, e.g., Senior Software Engineer, staff-adjacent] at [Company], generate 15 technical questions I am likely to face across [named topic areas: system design, coding, ML, SQL, finance modeling, etc.]. For each, mark the expected depth on a 1–5 scale, note the two most common wrong answers I should not give, and give me one one-line prompt I can use with an AI to simulate a follow-up drill on that question later.

*Gotcha:* «سؤالات محتمل» تولیدشده با AI جهت‌گیری درسته ولی سؤالات واقعی نیستن. حفظ نکن؛ شکل رو drill کن.

### I4 · Rehearsal framing case-study (A tier)

**کِی:** یه interview strategy / case توی یه consulting firm، VC، یا loop ops-role داری.

> Give me one 20-minute mini-case aligned to a [target role and company / industry]. Score my response against a rubric with these dimensions: (1) structure the problem before touching numbers; (2) explicit assumptions with one-line rationale each; (3) numeracy — reasonable order of magnitude, no more than one arithmetic error; (4) recommendation with a clear one-sentence "if I had one more day, here's what I'd verify." Wait for my full spoken answer before scoring.

*Gotcha:* مهاجرها اغلب numeracy رو به قیمت structure جلو می‌ندازن. این prompt برای تصحیح این کالیبره شده.

### I5 · Script مذاکرهٔ حقوق (S tier)

**کِی:** مکالمهٔ offer scheduled شده و یه script می‌خوای که تحت فشار نگه داری.

> Given a written offer of [base + equity + sign-on + bonus] from [Company] for [Role] in [City], and my target compensation range of [range] anchored by [D9 research data], write me a 300-word negotiation script. Structure: (1) 15 seconds of gratitude and unambiguous excitement about the role; (2) 45 seconds naming three specific asks with the reasoning for each (base, equity, sign-on — never all three, name the top two); (3) a specific mutual next step that is a scheduled call, not a Slack thread. Include a fallback line if the recruiter says "we cannot move on any of these."

*Gotcha:* مهاجرها تقریباً ۶۰٪ اوقات کمتر از چیزی که بازار می‌ده می‌خوان. به بالای range ت anchor کن، نه به وسط.

### I6 · Preemption سؤال مهاجرت (S tier)

**کِی:** interviewer وقتی موضوع «when could you start» می‌آد، آشکارا مکث می‌کنه.

> The interviewer asked me [question about work authorization / start date / relocation / dependent status]. Give me a 60-second spoken answer that: (1) states the fact clearly using Chapter 5's phrasing; (2) removes any risk on the hiring side that they might be over-reading; (3) closes with a positive-affirmation of my commitment to the role on the specific timeline they need. My status: [status].

*Gotcha:* این رو با صدای بلند، روی ویدیو، قبل از interview تمرین کن. سؤال مهاجرت جاییه که کوچک‌ترین لغزش بیشترین هزینه رو می‌ده.

### I7 · De-brief بیش‌ازحد رسمی culture / behavioral (B tier)

**کِی:** تازه یه mock interview یا یه واقعی انجام دادی و می‌خوای debrief کنی.

> Below is a transcript of my mock interview response to [question]. Score me on seven dimensions used by NA-market interviewers: (1) opening confidence; (2) pace and pauses; (3) use of "I" vs. "we" — flag when "we" hides my specific contribution; (4) hedging language ("kind of," "sort of," "I guess," "maybe"); (5) closing strength — was there a clear ending; (6) any over-formal phrasing that reads as script; (7) any cultural-reference gap I made that might not land in NA. Score each 1–5 with one-line justification. [Paste transcript].

*Gotcha:* بُعد ۳ رایج‌ترین tell مهاجره. interviewer ها به زبان «I owned» گوش می‌دن، نه «our team accomplished».

### I8 · Self-debrief فوری بعد از interview (B tier)

**کِی:** توی یه ساعت بعد از هر interview.

> I just finished an interview at [Company] for [Role]. Walk me through a structured self-debrief in seven questions, waiting for my typed answer to each before moving on: (1) What is one question I answered strongly? (2) What is one I answered weakly? (3) Was there a moment I saw them lean in? (4) Was there a moment I saw them lose interest? (5) Any new information I got about the role or team? (6) What is the single next thing I should do in the next 4 hours? (7) What is my honest gut on the outcome, one word?

*Gotcha:* هر کدوم رو توی یه جمله جواب بده. این یه تمرین ۵ دقیقه‌ایه، نه جلسهٔ therapy.

### I9 · مقایسهٔ package جبران خدمات (A tier)

**کِی:** دو تا offer داری و باید سیب-به-سیب مقایسه کنی.

> Compare the following two offers on 12 dimensions, in a table: base, target-year-1 total comp, equity vesting shape, sign-on, benefits (health, retirement, dental, mental health), PTO, remote/hybrid policy, level and title trajectory, immigration risk (for someone on [status]), team fit signals, career-brand value of the company for future roles, and total two-year expected value with 20% attrition risk baked in. Then give me a one-paragraph recommendation. Offers: [Offer A] [Offer B].

*Gotcha:* جدول ۱۲-بُعدی کمک تصمیمه، نه تصمیم. پاراگراف recommendation جاییه که قضاوت واقعی اتفاق می‌افته — verify کن.

### I10 · Silence-breaker انتظار پس از final-round (B tier)

**کِی:** سه هفته پیش final round رو تموم کردی، recruiter قول تصمیم «هر روز الان» رو داد، و هیچی نشنیدی.

> Draft a 90-word note to [recruiter or hiring manager] three weeks after my final round for [Role] at [Company]. Do not sound irritated. Reference one industry-relevant update since the interview. Include one clause naming that I have another process at the final-round stage that expects a decision by [date]. Ask specifically for a status update by end of week, not for a decision.

*Gotcha:* فقط از «process دیگه توی final round» استفاده کن اگه واقعی باشه. این یه دروغه که همیشه گیر می‌افته.

---

## مرحلهٔ ۵ · rejection و بازیابی (۵ prompt)

Rejection ها اکثریت outcome های تو هستن. خوب مدیریت کردنشون تفاوت بین job search ای که تموم می‌شه و job search ای که تو رو می‌خوره.

### R1 · Note پاسخ به rejection (S tier)

**کِی:** توی ۱۲ ساعت از دریافت rejection، به‌خصوص بعد از یه interview مرحلهٔ آخر.

> Draft a 70-word response to [recruiter] to a rejection for [Role] at [Company] after reaching [stage]. Structure: (1) one line thanking them and naming one thing I actually valued about the process; (2) one line asking specifically whether I can be kept in the pipeline for the [related role at same or lower level] that I know they hire for; (3) one line asking whether they would be open to a 15-minute feedback call in two weeks.

*Gotcha:* حدود ۱۵٪ این‌ها توی شش ماه به یه in-pipeline hire تبدیل می‌شن. note رو skip کنی، ۱۵٪ رو skip کردی.

### R2 · درخواست feedback مشخص (A tier)

**کِی:** یه recruiter یا hiring manager feedback پیشنهاد داد و می‌خوای مطمئن بشی به‌عنوان signal مشخص می‌رسه، نه تعریف کلی.

> Draft a 60-word reply to [name] taking them up on their feedback offer for my process at [Company]. Ask three specific yes/no questions, not one open question. Suggested angles: "was the concern primarily [technical / cultural / experience-level / immigration]?"; "if I addressed [specific gap] over the next 6 months, would you consider me for a future role?"; "would you refer me to a peer at a company where my current profile is a better match?"

*Gotcha:* سؤالات yes/no جواب می‌گیرن. سؤالات باز «you were great but not the right fit at this time» می‌گیرن.

### R3 · Retro هفتگی بعد از ۲۰ application بدون پاسخ (A tier)

**کِی:** توی یه هفته ۲۰ application فرستادی و کمتر از ۲ جواب گرفتی.

> Below is a batch of 20 applications I sent this week [paste table of company / role / cover-letter-first-paragraph / sent-date]. Score the batch on three dimensions: (1) target quality — was the ratio of S/A/B tier targets right for my status? (2) letter specificity — do the opening paragraphs sound interchangeable or targeted? (3) immigration-status resolution — is the authorization line clear in every one? Then give me three specific, ranked things to change for next week's batch.

*Gotcha:* اگه جواب هر کدوم از سه بُعد «ضعیف» ه، تغییر همون یه بُعد معمولاً نرخ پاسخ هفتهٔ بعد رو دوبرابر می‌کنه.

### R4 · prompt بازگرداندن اعتماد (C tier)

**کِی:** ۴۰ تا rejection پشت سر هم گرفتی و امروز صبح نمی‌تونی خودت رو مجبور کنی ATS رو دوباره باز کنی.

> Below is my résumé [paste]. Ignore the recent rejections context — I will feed you that later. First, without hedging: name the three strongest things on this résumé that a hiring manager in [target role, target market] would genuinely see as differentiating. Second, name the two most likely reasons a hiring manager might not recognize those strengths from the résumé alone. Third, name exactly one thing I could change in the next 30 minutes that would move the most-likely reason. That is the whole exercise — no motivational language, no pep talk.

*Gotcha:* دستور «no pep talk» load-bearing ه. بدونش AI یه cheerleading تولید می‌کنه که تو رو بدتر حس می‌ذاره.

### R5 · pivot-check (C tier)

**کِی:** سه ماه توی یه لِین apply کردی، هیچ traction ی نیست، و داری فکر می‌کنی لِین اشتباهه.

> Given my résumé [paste], my three-month application log [paste key rows: role, seniority, industry, outcome], and my current status [status], answer three questions without hedging: (1) Is my current target role a realistic match for my résumé, or am I aiming a full level too high / too low? (2) Is there an adjacent role or industry where my résumé would be an obvious yes rather than a plausible maybe? (3) If I switched to that adjacent lane, what are the three specific résumé edits I would need to make in the next two hours to send my first application there this weekend?

*Gotcha:* اگه جواب سؤال ۲ «yes and here it is» ه، pivot رو جدی بگیر. AI به سمت لِین جاه‌طلبانه‌تر hedge می‌کنه — یه «yes, pivot» مستقیم signal قوی‌ایه.

---

## چطور واقعاً از این کتابخانه استفاده کنی

دو تا عادت، یه routine یکشنبه.

**عادت ۱: prompt های tier-S رو pin کن.** همه‌شون. شونزده تان: D1، D2، D6، D8، A1، A2، A4، A5، A7، F1، F7، I1، I2، I5، I6، R1. کپی کن توی notes app یا یه Claude project. هیچ‌وقت دیگه از صفر ننویسشون.

**عادت ۲: هر application رو با حداقل دو تا prompt جفت کن.** یکی از مرحلهٔ ۱ (Discovery)، یکی از مرحلهٔ ۲ (Application). اگه Discovery رو skip کنی و مستقیم بری Application، letter generic می‌شه.

**Routine یکشنبه (۴۵ دقیقه):** D10 رو اجرا کن که pipeline ده-target هفته‌ات رو بسازی، بعد D1 رو روی هر ده تا اجرا کن. اونایی که سؤال ۳ ی D1 رو fail می‌کنن بکش. بازمانده‌ها treatment کامل A-stage رو دوشنبه تا چهارشنبه شب می‌گیرن. پنج‌شنبه و جمعه برای F-stage follow-up ه. آخر هفته برای I-stage prep روی هر چیزی که به یه screen حرکت کرده.

دو ساعت در روز، به این ساختار، application هایی با نرخ پاسخ بالاتر تولید می‌کنه از هشت ساعت در روز از «just apply to everything» بدون ساختار.

---

## Part 3 بعدش چی می‌کنه

فصل ۱۰ از prompt ها به *محتوای* اون prompt ها تبدیل می‌شه: ATS beat sheet — دقیقاً همون keyword ها، توی همون frequency ها، که top ATS ها توی field تو دنبالشونن. این artifact ی هست که به A4 (تطبیق رزومه با JD) feed می‌کنی تا pass تطبیق واقعاً converge کنه. فصل ۱۱ Part 3 رو با feedback loop می‌بنده: چطور rejection های خودت رو دوباره به AI feed کنی که پنجاه application بعدی به‌طور اکید بهتر از پنجاه قبلی باشه.

فعلاً، prompt های tier-S رو pin کن. همون یکی ارزش قیمت کتاب رو داره.

---

## صفحهٔ screenshot

| ایده | عدد | چی کار کن |
|---|---|---|
| prompt توی این کتابخانه | ۵۰ | کل فایل رو bookmark یا copy کن |
| مرحلهٔ search که کتابخانه پوشش می‌ده | ۵ (Discovery، Application، Follow-up، Interview، Rejection) | حداقل یه prompt از هر مرحله در هر هفته استفاده کن |
| prompt های tier-S (~۳۵-۵۰٪ نرخ پاسخ) | ۱۶ | این‌ها رو pin کن — هر بار اول استفاده کن |
| جفت prompt به ازای هر application (حداقل) | ۲ (یکی Discovery + یکی Application) | هیچ‌وقت letter رو بدون هر دو نفرست |
| بودجهٔ routine یکشنبه | ۴۵ دقیقه | D10 + D1 روی ده target اجرا می‌کنه، shortlist هفته رو تولید می‌کنه |
| بودجهٔ application هفتگی برای این سیستم | ۱۰ app × ۲۰ دقیقه | نرخ پاسخ بالاتر از ۴۰ app در ۵ دقیقه هر کدوم |

پنجاه prompt. رتبه‌بندی‌شده. هر prompt در برابر تنها سؤالی که مهمه تست‌شده: گیرنده جواب داد؟ فصل ۱۰ بعدی.

[^searcher]: **job seeker**: کسی که فعالانه دنبال کار می‌گرده. توی این کتاب همیشه با «immigrant» ترکیب می‌شه چون وضعیتت اهمیت داره — تجربهٔ search برای یه شهروند و یه permit-holder کاملاً متفاوته.

[^tier]: **tier**: لایه / دستهٔ رتبه‌بندی. توی این فصل، هر prompt توی یکی از چهار tier (S, A, B, C) قرار می‌گیره — به معنی «تخمینی از چقدر احتمال داره جواب بگیره».

[^intel]: **intel**: مخفف intelligence — اطلاعات مشخص و قابل استفاده. توی این فصل مثلاً «یه blog post خاص از شرکت target که هفتهٔ گذشته منتشر شده».

[^confab]: **confabulate**: چیزی رو با اعتماد به نفس ساختن به‌طور غلط. AI ها به‌خصوص با URL و اسم و آمار این کار رو می‌کنن — تولید می‌کنن که «باورپذیر» به نظر بیاد، نه لزوماً درست باشه.

[^reqid]: **req ID**: شناسهٔ درخواست شغلی توی سیستم ATS شرکت. معمولاً یه string کوتاه مثل `R-2026-4891`. نام بردنش توی اولین جمله نشون می‌ده applicant حرفه‌ای و منظمه، نه spray-and-pray.

[^star]: **STAR**: ساختار جواب interview های behavioral — Situation (موقعیت)، Task (وظیفه)، Action (اقدام)، Result (نتیجه). چارچوب استاندارد NA برای گفتن یه داستان کاری در ۹۰ ثانیه بدون گم شدن.
