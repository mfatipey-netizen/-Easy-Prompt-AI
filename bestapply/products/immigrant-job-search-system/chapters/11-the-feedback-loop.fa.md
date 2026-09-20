# فصل ۱۱ · feedback loop ای که loop رو می‌بنده

فصل‌های ۸، ۹ و ۱۰ بهت letter، prompt، و beat sheet keyword داد. این فصل چیزیه که این‌ها رو از یه toolkit ایستا به سیستمی تبدیل می‌کنه که هر هفته که ازش استفاده می‌کنی *بهتر* می‌شه. این فصل meta ه، اونی که بقیه رو self-improving می‌کنه.

مشاهدهٔ ناراحت‌کننده: ۹۰٪ application هات rejected می‌شن، توی هر مرحلهٔ search ت، هر چقدر هم که خوب بشی. این baseline ه. چیزی که یه search دو-ماهه رو از یه search نه-ماهه جدا می‌کنه نرخ rejection نیست — چیزیه که بعد از بستن tab با rejection ها می‌کنی.

اکثر آدم‌ها rejection رو به‌عنوان یه رویداد احساسی processing می‌کنن. حرکت درست processing کردنش به‌عنوان یه رویداد data ای ه.

هر application ردشده‌ای که یه مهاجر باهاش مواجه می‌شه، غیر از زمان، انگیزهٔ ادامه دادن رو هم ازش می‌گیره. این فصل جاییه که بالاخره rejection ها بهت پس می‌دن — به‌عنوان سوخت batch بعدی به‌جای مالیات روی batch فعلی.

---

## سه signal داخل هر rejection

هر rejection اطلاعات حمل می‌کنه. اکثرش noise ه. سه signal مشخص ارزش استخراج دارن:

**Signal ۱: مرحلهٔ rejection.**
یه reject خودکار ATS توی ساعت ۲ یه signal keyword یا authorization ه. یه reject recruiter بعد از phone screen یه signal compensation، timeline، یا level ه. یه reject hiring-manager بعد از یه دور فنی یه signal skill-gap یا fit ه. یه reject final-round تقریباً همیشه یه signal stack-ranking ه (یه نفر دیگه توی یه محور مشخص که اگه بپرسی می‌تونی نامش رو ببری، بهتر بود).

این چهار مرحله هزینه‌های متفاوتی برای fix دارن، و خوندن اینکه توی کدوم مرحله مدام داری می‌بازی بهت می‌گه کدوم fix رو اولویت بدی.

**Signal ۲: زبان rejection.**
«Not a fit at this time» و «we've decided to move forward with candidates whose experience more directly aligns with the role» یه جمله نیستن. اولی یه form letter ه — signal ندارد. دومی محور رو نام می‌بره (experience alignment) — signal بالا. هر چیزی که «requirements» رو ذکر کنه معمولاً یه gap keyword یا credential ه؛ هر چیزی که «team fit» یا «communication» رو ذکر کنه معمولاً یه signal interview-loop ه؛ هر چیزی که مشخص کنه «we may keep your résumé on file» یه warm-close ه که جدا log کردن ارزش داره.

**Signal ۳: سکوت.**
Rejection ای که گرفتی data ست. Rejection ای که هیچ‌وقت نگرفتی — application هایی که توی خلأ افتادن — هم data ست. اگه ۱۵ از ۲۰ application هفتهٔ قبل هیچ‌وقت جواب انسانی نگرفتن، و ۵ تا auto-reject خوردن، اون نسبت داره بهت می‌گه فیلتر ATS جاییه که داری می‌بازی، نه interview loop. اگه ۱۸ از ۲۰ تا phone screen گرفتن و ۱۵ اونجا مردن، ATS خوبه و script phone-screen جاییه که داری می‌بازی.

سکوت بلندترین signal این لیست ه، و اونی که هر مهاجری under-count می‌کنه.

---

## Log rejection

نمی‌تونی از حافظه signal استخراج کنی. یه log لازم داری.

فرمت: یه ردیف به ازای هر application، توی یه spreadsheet یا یه جدول Markdown ساده. هر یکشنبه، ده دقیقه صرف به‌روزرسانی کن. هیچ چیز دیگهٔ یکشنبه به این‌قدر دقت لازم نیست.

هشت ستون:

| ستون | چی توش می‌ره |
|---|---|
| **تاریخ ارسال** | تاریخ send application. |
| **شرکت** | فقط اسم. |
| **Role** | عنوان پست‌شدهٔ دقیق. |
| **Channel** | Portal / DM recruiter / referral / other. |
| **Tier** | S / A / B — از planning D10 فصل ۹. |
| **Outcome** | Rejected-auto / Rejected-recruiter / Rejected-screen / Rejected-tech / Rejected-final / Ghosted / In-progress / Offer. |
| **زبان rejection** | اگه کلمه گرفتی، جملهٔ operative رو paste کن. اگه ghost شدی، «ghosted-at-Nd» بنویس که N روز سکوته. |
| **Note** | یه خط: اگه امروز دوباره می‌فرستادی چی رو عوض می‌کردی. |

اون ستون آخر — ستون *اگه دوباره می‌فرستادی چی رو عوض می‌کردی* — کل نکته‌ست. اگه نمی‌تونی جوابش رو بدی، هیچی از اون application یاد نگرفتی، و باید یکی از prompt های پایین رو اجرا کنی تا جواب رو استخراج کنی قبل از اینکه الگو تکرار بشه.

بقیه bookkeeping ه. ستون Note همون loop ه.

---

## چهار prompt feedback-loop

این‌ها چهار تا prompt هستن که log رو بهشون feed می‌کنی. یه لایه بالای کتابخانهٔ فصل ۹ زندگی می‌کنن چون روی history تو کار می‌کنن، نه روی یه application تک.

### FL1 · retro batch (S tier)

**کِی:** هر ۲۰ application، یا هر دو یکشنبه — هر کدوم اول اومد.

> I am going to paste my rejection log for the last 20 applications. Score the batch on five axes: (1) target-tier distribution — was the S/A/B ratio right for my authorization? (2) stage where I keep losing — which stage of the funnel is my biggest single leak? (3) rejection-language patterns — are the words that appear more than twice pointing at a specific gap? (4) ghost rate — is the silence higher than 40% (a keyword signal) or lower (a fit signal)? (5) Sunday-column patterns — are the "what would you change" notes converging on one thing, or scattered? Then give me three specific, ranked changes for the next 20 applications. Do not hedge. [Paste log].

*Gotcha:* ارزش توی ranked changes آخره. اگه AI پنج پیشنهاد با وزن یکسان بهت داد، دوباره بپرس با «rank strictly by expected reply-rate lift».

### FL2 · post-mortem single-thread (A tier)

**کِی:** بعد از یه rejection توی مرحله‌ای که مهم بود — دور فنی، دور final، یا یه recruiter گرم که باهاش rapport ساختی و سرد شد.

> I just got rejected at [stage] at [Company] for [Role]. The rejection language: [paste]. My prep and how I felt each stage went: [3-5 sentences]. Any specific interviewer comments I remember, positive or negative: [list]. Do three things: (1) name the single most likely axis I lost on, with a one-line rationale; (2) name one thing about my prep for that stage that I would change if I ran a similar loop next week; (3) name one thing that was probably out of my control — so I stop rehashing it. Do not console me. Do not motivate me. Just diagnose.

*Gotcha:* خروجی سوم — خط «probably out of your control» — load-bearing ه. بدونش همون rejection یه هفته توی سرت loop می‌زنه و تمرکز batch بعدی رو می‌خوره.

### FL3 · Scan alarm الگو (A tier)

**کِی:** توی ۴۰، ۶۰، و ۱۰۰ application فرستاده — نقاط عطفی که یه الگوی اشتباه calcify شده.

> Here is my log at [N] applications. Look for three specific patterns that would each be a systemic problem: (1) am I rejecting myself before recruiters do — i.e., am I only applying to A and B tier, no S? (2) is my ghost rate at any company size (startup / mid-market / enterprise) more than 25 points higher than at the others — meaning I am picking wrong-sized targets? (3) do any of my "what would you change" notes appear three or more times without me actually having changed anything — meaning I know the problem and have not acted on it? Flag each pattern only if the evidence in the log actually supports it. If none of the three are present, say so clearly — do not manufacture a pattern for the sake of an answer. [Paste log].

*Gotcha:* دستور *الگو رو manufacture نکن* مهمه. AI به‌طور پیش‌فرض «insight» تولید می‌کنه چه وجود داشته باشن چه نه. یه scan تمیز که می‌گه «no patterns» یه نتیجهٔ معتبر و ارزشمنده.

### FL4 · prompt تصمیم pivot (B tier)

**کِی:** توی ۱۰۰+ application با نرخ پاسخ زیر ۲٪، و داری فکر می‌کنی کل strategy اشتباهه.

> Here is my full log at [N] applications with [X] replies and [Y] final-round outcomes. Before you recommend anything, tell me whether the data actually supports a pivot recommendation or whether the sample size is still too small at the sub-role level. If a pivot is supported: (1) which lane in the log has the highest reply rate; (2) what would my résumé need to look like to compete in that lane full-time; (3) what is the single most valuable adjacent lane I have not yet tried at all, based on my profile. If a pivot is not supported: name the three most likely reasons the low reply rate is stage-appropriate and not evidence of a strategic mistake.

*Gotcha:* صداقت جلو — «آیا sample به اندازهٔ کافی بزرگه» — ارزشمندترین خروجیه. اکثر pivot های ۱۰۰-application ای در n=خیلی-کوچیک انجام می‌شن و نتیجه‌شون reset کردن counter به‌جای تموم کردن strategy ه. به جواب «هنوز supported نیست» به اندازهٔ «yes, pivot» اعتماد کن.

---

## ریتم ۲۰-application ای

کل loop batch های ۲۰ رو فرض می‌کنه. نه به این خاطر که ۲۰ جادوییه، بلکه به این خاطر که کوچک‌ترین batch ای ه که عددها دیگه noise نیستن. توی ۵ application، ۱ جواب ۲۰٪ ه و ۰ جواب ۰٪ — نسبت شدید نوسان می‌کنه. توی ۲۰، ۳ جواب ۱۵٪ ه، و فقط چون یه recruiter رفت مرخصی به ۵٪ نمی‌شه.

Cadence:

- **هفتهٔ ۱ (دوشنبه-شنبه):** ۲۰ بفرست، با استفاده از Sunday routine فصل ۹.
- **هفتهٔ ۱ (یکشنبه):** هر ارسال رو log کن. ده دقیقه.
- **هفتهٔ ۲ (دوشنبه-جمعه):** Follow-up ها (F-stage prompt های فصل ۹) روی batch هفتهٔ قبل. تماس‌های screening می‌آن.
- **هفتهٔ ۲ (شنبه):** Interview ها. اگه هر کدوم به final round رسید، FL2 رو همون روز اجرا کن چه land کنه چه نه.
- **هفتهٔ ۲ (یکشنبه):** FL1 رو روی batch ۲۰-app اجرا کن. سه چیز برای هفتهٔ بعد به‌روز کن.
- **هفتهٔ ۳ به بعد:** تکرار با تغییرات واقعاً اعمال‌شده.

هر ۴۰ application، FL3 رو اجرا کن. هر ۱۰۰، اگه نرخ پاسخ هنوز زیر ۲٪ ه، FL4 رو اجرا کن.

این کل loop ه. دو تا prompt در هفته، یه logbook کوچیک، سه تا ranked change در هر cycle. هیچ چیز قهرمانانه‌ای. ولی مهاجرهایی که به‌طور مداوم اجرا می‌کنن، offer letter رو توی هفتهٔ ۸-۱۲ ship می‌کنن؛ اونایی که نمی‌کنن توی هفتهٔ ۲۴-۴۰ ship می‌کنن — تفاوت talent نیست، loop ه.

---

## چی رو NOT به loop feed کن

سه signal مفید به نظر می‌رسن و در واقع خورنده‌ن. به loop feed شون نکن.

**۱. tone یه recruiter تک.** یه recruiter تک که تُنش curt بود، signal دربارهٔ candidacy تو نیست — signال دربارهٔ recruiter ای ه که سه‌شنبهٔ بدی داشت. هیچ‌وقت نذار یه exchange بد drive بازنویسی رزومه باشه.

**۲. نقل قول‌های زبان rejection از هر جایی غیر از log خودت.** خوندن Reddit یا Blind دربارهٔ اینکه «شرکت‌ها همه رو با gap توی رزومه reject می‌کنن» AI رو متقاعد می‌کنه که gap تو مشکله، حتی وقتی log تو نشون می‌ده شش applicant دیگه با همون gap interview گرفتن. Log از اینترنت بالاتر رتبه می‌گیره.

**۳. تشویق.** اگه پیام «you'll get there!» یه دوست رو به‌عنوان context به هر یک از این prompt ها paste کنی، خروجی‌ها نرم‌تر و کمتر مفید می‌شن. تشویق مال call یکشنبه‌ات با خانواده‌ت ه، نه loop. اونا رو عمداً جدا نگه دار.

---

## Part 3، تموم

الان کل toolkit application-and-response رو داری:

- فصل ۸: بیست تا cover letter که هر کدوم رو توی ده دقیقه می‌تونی adapt کنی.
- فصل ۹: پنجاه prompt، رتبه‌بندی‌شده، در پنج مرحلهٔ search.
- فصل ۱۰: ATS beat sheet — ده جدول role با frequency دقیق keyword و قوانین adjacency.
- فصل ۱۱ (این فصل): feedback loop ای که پنجاه application بعدی رو به‌طور اکید بهتر از پنجاه قبلی می‌کنه.

اگه فقط از این Part کتاب استفاده کنی، از قبل قیمت کل چیز رو برگردوندی. بقیهٔ کتاب — Part 4 (فصل‌های مخصوص مهاجرت)، Part 5 (interview و salary)، Part 6 (برنامهٔ ۹۰-روزه و appendix) — toolkit رو توی گوشه‌های مشخصی که تاکس مهاجر بالاترینه سخت‌تر کار می‌کنه.

Part 4 با فصلی شروع می‌شه که بیشترین ازش استفاده می‌کنی و اونی که اکثر مهاجرها هیچ‌وقت زحمت اجرا کردنش رو نمی‌کشن: مکالمهٔ صداقت-sponsorship. نه کلمه که عوض می‌کنه کی بهت جواب زنگ می‌ده، و شش phrasing که این‌ها رو توی چهار lane permit که مهم‌ن کار می‌ذارن.

---

## صفحهٔ screenshot

| ایده | عدد | چی کار کن |
|---|---|---|
| نرخ rejection baseline هر چقدر خوب بشی | ~۹۰٪ | دست بردار از treat کردنش به‌عنوان signal؛ به‌عنوان floor treat ش کن |
| Signal های ارزش استخراج از هر rejection | ۳ (مرحله، زبان، سکوت) | همه رو log کن |
| ستون‌های log rejection | ۸ (تاریخ/شرکت/Role/Channel/Tier/Outcome/زبان/Note) | ستون Note همون loop ه |
| Prompt های feedback-loop | ۴ (FL1 batch، FL2 single، FL3 pattern alarm، FL4 pivot) | FL1 هر ۲۰ app، FL4 فقط توی ۱۰۰+ |
| حداقل batch size قبل از این‌که عددها دیگه noise نباشن | ۲۰ | از ۵ نتیجه نگیر |
| Cadence هفتگی: prompt + logging + changes | ۲ prompt / ۱۰ دقیقه log / ۳ ranked change | کل loop زیر یه ساعت در هفته‌ست |

Part 3 این‌جا بسته می‌شه. Part 4 با فصل‌های مخصوص مهاجرت باز می‌شه — اونایی که edge generic toolkit رو به edge تو، بر اساس permit ای که واقعاً داری، تبدیل می‌کنن.
