# فصل ۴ · فیلتر ناپیدا — NOC و O*NET

سه فصل framing. حالا شروع می‌کنیم به ساختن.

اولین چیزی که می‌سازیم، «دیدنِ» فیلتر ناپیداست. قبل از این‌که resume ت روی کلمات کلیدی نمره بگیره، قبل از این‌که مدل proprietary کیفیت ATS وارد بازی بشه، و خیلی قبل‌تر از این‌که یه آدم فایلتو ببینه، یه چیز اتفاق می‌افته: سیستم یه کد عددی به resume ت می‌چسبونه. توی کانادا این کد NOC 2021[^noc-recap] ه. توی آمریکا O*NET-SOC[^onet-recap]. و اون کد — نه عنوان شغلیت، نه سال‌های سابقه‌ت، نه دانشگاهت — کلید اصلی‌ایه که ATS باهاش تو رو در برابر آگهی مقایسه می‌کنه.

کد رو اشتباه بگیری، هر چیزی که بعدش می‌آد، از یه شروع اشتباه می‌آد.

این چیزیه که کل سیستم داره پشت پرده انجام می‌ده. این فصل، پرده رو کنار می‌زنه.

---

## کد واقعاً چیه

NOC 2021 (کانادا) و O*NET-SOC 2019 (آمریکا) دو نسخه از یه ایده هستن: یه taxonomy[^taxonomy] سلسله‌مراتبی از مشاغل، که دولت منتشرش می‌کنه، هر چند سال یک‌بار آپدیت می‌شه، و توسط هر کارفرمای جدی برای کدگذاری آگهی و (به‌شکل ضمنی) هر resume ای که بهش می‌رسه استفاده می‌شه.

هر آگهی توی Workday, Greenhouse, iCIMS, و Taleo، یه کد پشت پرده بهش چسبیده. recruiter انتخابش کرده — معمولاً از یه dropdown[^dropdown] — وقتی داشته requisition[^requisition] رو می‌ساخته. ATS بعدش از اون کد به‌عنوان anchor[^anchor] استفاده می‌کنه وقتی resume های ورودی رو نمره می‌ده.

تو هیچ‌وقت کد رو روی آگهی نمی‌بینی. ولی اکثر سرنوشتت روی اون آگهی رو، همون کد تعیین می‌کنه.

**NOC 2021** یه کد ۵ رقمی به‌اضافهٔ یه سطح TEER[^teer] (۰ تا ۵، تقریباً نشون‌دهندهٔ نیاز به مهارت/تحصیلات) داره. «Software engineer» = 21231, TEER 1. «Senior accountant» = 11100, TEER 1.

**O*NET-SOC** یه کد ۶ رقمی به‌اضافهٔ یه پسوند ۲ رقمی داره. «Software developer» = 15-1252.00. «Financial analyst» = 13-2051.00.

دو سیستم کاملاً یکی نیستن — ولی ۳۰ نقش پرکاربرد استخدام مهاجرین، به‌شکل تمیز crosswalk[^crosswalk] می‌شن، و یه resume خوش‌نوشته می‌تونه برای هر دو کد هم‌زمان رتبه بگیره. این ترفندیه که این فصل یادت می‌ده.

---

## چرا این کد همه‌چیز رو تعیین می‌کنه

دو تا مکانیزم، «کد» رو به «همه‌چیز» تبدیل می‌کنن.

**مکانیزم ۱: کدگذاری requisition.** وقتی recruiter آگهی می‌ذاره، ATS یکی دو تا کد رو از یه dropdown پیشنهاد می‌ده. recruiter یکی رو انتخاب می‌کنه. حالا هر resume ای که به آگهی می‌رسه، در برابر *همون کد خاص*، انتظارات کلمات کلیدی، الگوهای سابقه، و سطح TEER اش مقایسه می‌شه. resume تو در برابر «عنوان شغل هدفت» خونده نمی‌شه. در برابر توصیف canonical[^canonical] کد خونده می‌شه.

**مکانیزم ۲: کدگذاری خودکار resume.** ATS resume تو رو parse می‌کنه و سه عنوان شغلی آخرت رو هم به کدهایی از طرف خودش می‌چسبونه. اگه عنوان آخرت به‌شکل تمیز نگاشت نشه، به یه کد نزدیک اختصاص داده می‌شی — گاهی مجاور، گاهی پایین‌تر. اگه کد آگهی و کد اختصاص‌داده‌شدهٔ تو با هم نخونن، قبل از این‌که هیچ آدمی فایلتو ببینه، فیلتر می‌شی. نه به این دلیل که برای شغل اشتباهی درخواست دادی، بلکه به این دلیل که *کدها* گفتن نه.

نسخهٔ مهاجری این مشکل، شدیده. عنوان آخرت احتمالاً از یه taxonomy میاد که ATS هرگز ندیده — تهران، بمبئی، مانیل، لاگوس، سائوپائولو. parser سعی می‌کنه به یه چیزی نگاشتش کنه. چیزی که بهش نگاشت می‌کنه، تعیین‌کنندهٔ اینه که آیا توی صفحهٔ recruiter وجود داری یا نه.

سارای فصل ۱ — حسابدار با سه سال سابقهٔ CPA-track — عنوان آخرش «Senior Analyst, Business Development» توی یه هلدینگ تهرانی بود. ATS کانادایی اونو به‌عنوان *marketing analyst* (NOC 11202) parse کرد، نه *financial analyst* (NOC 11101). هر آگهی حسابداری که apply کرد، قبل از این‌که چشم آدمی ببینه، فیلترش کرد. نه به این دلیل که نمی‌تونست کار رو انجام بده. به این دلیل که ابهام عنوان آخرش، به کد اشتباه اختصاصش داد.

اون شکست خاص — که توی نود ثانیه قابل حل بود — سه ماه ازش گرفت.

---

## crosswalk ۳۰ نقش

پایین، همون crosswalk ی هست که به یه career counselor پول می‌دی که برات بسازه. کد NOC 2021 + کد O*NET-SOC + دقیقاً چه کلمه‌بندی روی resume ت برای هر دو رتبه می‌گیره.

اگه نقش هدفت اینجا نیست، appendix جدول کامل ۲۰۰ نقشه رو داره. اگه اونجا هم نیست، پروسهٔ diagnostic[^diagnostic] پایین این فصل رو دنبال کن.

### نرم‌افزار و داده

| نقش | NOC 2021 | O*NET-SOC | کلمه‌بندی resume که هر دو رو می‌زنه |
|---|---|---|---|
| Software Developer | 21232 · TEER 1 | 15-1252.00 | "Software developer" (هرگز "programmer" یا "coder") |
| Software Engineer | 21231 · TEER 1 | 15-1252.00 | "Software engineer, full-stack" یا "Software engineer, back-end" |
| DevOps Engineer | 21232 · TEER 1 | 15-1244.00 | "DevOps engineer" + یه bullet با نام AWS/GCP/Azure |
| Cloud Engineer | 21311 · TEER 1 | 15-1241.01 | "Cloud engineer" + یه cloud خاص توی bullet اول |
| Data Engineer | 21223 · TEER 1 | 15-2051.02 | "Data engineer" — حداقل یک‌بار "pipeline" و "warehouse" |
| Data Scientist | 21211 · TEER 1 | 15-2051.00 | "Data scientist" — حداقل یک‌بار "modeling" و "production" |
| ML Engineer | 21211 · TEER 1 | 15-2051.02 | "Machine learning engineer" — نام یه framework (PyTorch, TF) |
| Data Analyst | 21223 · TEER 2 | 15-2051.01 | "Data analyst" — حداقل یک‌بار "SQL" و "dashboard" |
| QA / Test Engineer | 21232 · TEER 2 | 15-1253.00 | "QA engineer" یا "Test engineer" — هرگز فقط "tester" |
| Cybersecurity Analyst | 21220 · TEER 1 | 15-1212.00 | "Information security analyst" — "SIEM" و "incident response" |

### مالی و کسب‌وکار

| نقش | NOC 2021 | O*NET-SOC | کلمه‌بندی resume |
|---|---|---|---|
| Financial Analyst | 11101 · TEER 1 | 13-2051.00 | "Financial analyst" — "forecasting" و "valuation" |
| Senior Accountant | 11100 · TEER 1 | 13-2011.00 | "Senior accountant" — "GAAP" (US) یا "IFRS" (کانادا) |
| Bookkeeper | 12200 · TEER 3 | 43-3031.00 | "Bookkeeper" — یک‌بار "QuickBooks" یا "Xero" |
| Compliance Officer | 41401 · TEER 1 | 13-1041.00 | "Compliance officer" — حداقل یک‌بار "AML" و "KYC" |
| Credit Analyst | 11101 · TEER 1 | 13-2041.00 | "Credit analyst" — "underwriting" و "portfolio risk" |
| Business Analyst | 11201 · TEER 1 | 13-1111.00 | "Business analyst" — "requirements" و "stakeholders" |
| Financial Controller | 10010 · TEER 0 | 11-3031.01 | "Financial controller" — "month-end close" و "audit" |
| Payroll Administrator | 13102 · TEER 3 | 43-3051.00 | "Payroll administrator" — "biweekly" + "T4" (کانادا) یا "W-2" (US) |

### سلامت و درمان

| نقش | NOC 2021 | O*NET-SOC | کلمه‌بندی resume |
|---|---|---|---|
| Registered Nurse | 31301 · TEER 1 | 29-1141.00 | "Registered nurse" — همیشه کامل بنویس، هرگز فقط RN |
| Licensed Practical Nurse | 32101 · TEER 3 | 29-2061.00 | "Licensed practical nurse" (کانادا) / "LPN" (US) |
| Pharmacist | 31120 · TEER 1 | 29-1051.00 | "Pharmacist" — "clinical review" + یه حوزهٔ درمانی خاص |
| Physiotherapist | 31202 · TEER 1 | 29-1123.00 | "Physiotherapist" (کانادا) / "Physical therapist" (US) |
| Medical Lab Technologist | 32120 · TEER 3 | 29-2011.00 | "Medical laboratory technologist" — نام یه دستگاه/پلتفرم خاص |
| Health Data Analyst | 21223 · TEER 2 | 15-2051.01 | "Health data analyst" — یک‌بار "EMR" یا "EHR" |
| Care Coordinator | 41301 · TEER 3 | 21-1093.00 | "Care coordinator" — "case management" |

### عملیات، بازاریابی، و مجاور

| نقش | NOC 2021 | O*NET-SOC | کلمه‌بندی resume |
|---|---|---|---|
| Operations Manager | 10019 · TEER 0 | 11-1021.00 | "Operations manager" — نام سایز بودجه + تیم |
| Executive Assistant | 13110 · TEER 3 | 43-6011.00 | "Executive assistant" — هرگز "secretary" |
| HR Coordinator | 12101 · TEER 3 | 13-1071.00 | "Human resources coordinator" — "onboarding" و "compliance" |
| Marketing Coordinator | 11202 · TEER 2 | 13-1161.00 | "Marketing coordinator" — یه کانال خاص (SEO, paid, brand) |
| Customer Success Manager | 62100 · TEER 2 | 41-3099.02 | "Customer success manager" — "renewals" و "MRR" یا "ARR" |

---

## سه حرکت دقیق برای resume ت

**حرکت ۱. سه عنوان شغلی آخرت رو بازنویسی کن تا ATS آمریکایی و کانادایی هر دو بهت همون کد رو نگاشت کنن.**

عنوان توی resume آخرت رو با ستون کد توی crosswalk مقایسه کن. اگه دقیقاً با ستون «کلمه‌بندی resume» هم‌خوان نیست، بازنویسی کن. یعنی نام نقش گذشته‌ت رو عوض کنی، نه فقط نقش هدفت. اگه توی هلدینگ تهرانی «Senior Analyst, Business Development» بودی ولی می‌خوای اینجا یه financial analyst بشی، نزدیک‌ترین بازنویسیِ صادقانه اینه: «Senior Financial Analyst — Business Development.» همون شغل، کد دقیق.

**دروغ نگو.** بازنویسی باید منعکس‌کنندهٔ کاری باشه که واقعاً کردی. ولی اکثر عنوان‌های مهاجرین، خیلی literal ترجمه شدن، و ATS بابتش تنبیه‌شون می‌کنه. crosswalk بهت اجازه می‌ده به زبون ATS حرف بزنی.

**حرکت ۲. کلمات کلیدی crosswalk رو front-load کن توی سه خط اول resume ت.**

هر ATS بالای resume رو سنگین‌تر از پایینش می‌خونه. عبارت‌های «کلمه‌بندی resume» توی crosswalk باید توی خط summary (بالای resume) و توی bullet اول جدیدترین نقشت ظاهر بشن. اگه crosswalk می‌گه «"GAAP" یا "IFRS" رو بگو» — اون توی یه bullet می‌ره، نه توی یه لیست skills در پایین.

**حرکت ۳. اگه نقشت توی crosswalk نیست، diagnostic نود ثانیه‌ای رو اجرا کن.**

- آگهی رو باز کن.
- LinkedIn رو با *دقیقاً همون عنوان آگهی* سرچ کن.
- به ۲۰ تا پروفایلی که توی ۱۲ ماه اخیر برای اون عنوان استخدام شدن نگاه کن (فیلتر "past experience" لینکدین).
- عبارت‌های دقیقی که عنوان‌شون استفاده می‌کنه رو یادداشت کن. اون، اسم کد هدفه.

نود ثانیه. بعد عنوان خودت رو به همون کلمات دقیق بازنویسی کن.

---

## bonus عبور از مرز: یه resume، دو کد

اگه هم‌زمان توی کانادا و آمریکا apply می‌کنی، می‌تونی روی یه resime برای هر دو کد رتبه بگیری. دو تا قانون:

**قانون A: عنوان NOC-aligned کانادایی رو به‌عنوان heading اصلی استفاده کن، و کلمه‌بندی O*NET رو توی bullet اولت بذار.**

مثال — «Senior Financial Analyst» به‌عنوان عنوانت، و bullet اولت این باشه: «Financial analyst supporting portfolio valuation and forecasting for a $2.4B fund.» ATS کانادایی عنوان NOC-friendly رو می‌بینه. ATS آمریکایی bullet ی O*NET-friendly رو می‌خونه.

**قانون B: هرگز spelling رو فقط به یه طرف local نکن.**

«Colour» (کانادا) و «color» (US)، «prioritise» و «prioritize»، «cheque» و «check» — spelling آمریکایی رو انتخاب کن *اگه هم‌زمان توی هر دو بازار apply می‌کنی*. spelling آمریکایی توی کانادا تمیز خونده می‌شه؛ spelling کانادایی توی آمریکا کمی نچسب. برای bias بازار آمریکایی بهینه کن و توی کانادا هم چیزی از دست نمی‌دی.

---

## فصل ۵ با این چی می‌کنه

حالا که عنوانت درست کدگذاری شده، فیلتر بعدی وارد بازی می‌شه: سؤال مجوز کار. همون فیلتری که جواب شهودیش، قبل از این‌که resume ت نمره بگیره، شغل رو ازت می‌گیره. فصل ۵ کلمه‌بندی دقیق برای هر نوع permit رو بهت می‌ده — PGWP, BOWP, OPT, STEM Extension, H-1B, TN, EAD — تا اون فیلتر رو تمیز پاک کنی.

---

## صفحهٔ screenshot

| ایده | عدد | چی کار کن |
|---|---|---|
| کدها تصمیم می‌گیرن ATS کدوم resume ها رو رتبه بده | هر resume یکی می‌گیره | عنوانت رو با کد هدف match کن |
| درصد مهاجرین که parse اول عنوان به اشتباه ردت می‌کنه | ~۳۵٪ | سه عنوان آخرت رو *امروز* درست کن |
| وزن بالای resume vs. پایینش | ~۳ برابر | کلمات crosswalk رو front-load کن توی سه خط اول |
| زمان اجرای diagnostic لینکدین | ~۹۰ ثانیه | برای هر آگهی که توی crosswalk نیست، انجامش بده |
| کدهایی که توی هر دو بازار رتبه بهت می‌دن | NOC + O*NET با هم | عنوان NOC-aligned + کلمه‌بندی O*NET توی bullet ۱ |
| هزینهٔ اشتباه گرفتن کد | ~۳ ماه application اشتباه | مهم‌ترین single-fix پرROI ترین این کتاب |

فیلتر ناپیدا الان دیدنی‌ه. فصل ۵ فیلتر ناپیدای دومی — چک‌باکس مجوز کار — رو با همون روش حذف می‌کنه.

[^noc-recap]: **NOC 2021**: National Occupational Classification — نظام طبقه‌بندی مشاغل کانادا، نسخهٔ ۲۰۲۱. توی فصل ۱ معرفی شد؛ اینجا با جزئیات کد + TEER استفاده می‌شه.

[^onet-recap]: **O*NET-SOC**: Standard Occupational Classification با پسوند O*NET — نظام طبقه‌بندی مشاغل آمریکا.

[^taxonomy]: **taxonomy**: نظام طبقه‌بندی سلسله‌مراتبی. مثل درخت شاخه‌شاخه که هر شغل رو توی یه دستهٔ خاص می‌ذاره.

[^dropdown]: **dropdown**: منوی کشویی توی رابط کاربری نرم‌افزار. لیستی از گزینه‌ها که با کلیک باز می‌شه.

[^requisition]: **requisition**: پستِ استخدام رسمی از دید داخلی شرکت. یه سند رسمی که تأیید می‌کنه شرکت اجازهٔ استخدام برای این پست رو داره.

[^anchor]: **anchor**: نقطهٔ اتصال، مرجع اصلی. توی این متن یعنی کدی که ATS همه‌چیز رو در برابرش می‌سنجه.

[^teer]: **TEER**: Training, Education, Experience, Responsibilities — سطح‌بندی مهارت/آموزش NOC 2021. ۶ سطح از ۰ (مدیران ارشد) تا ۵ (کار بدون آموزش رسمی).

[^crosswalk]: **crosswalk**: پل تطبیقی — جدولی که کدهای یه سیستم رو به کدهای سیستم دیگه نگاشت می‌کنه. اینجا NOC ↔ O*NET.

[^canonical]: **canonical description**: توصیف رسمی و مرجع. توی هر سیستم طبقه‌بندی، هر کد یه توصیف canonical داره که ATS ازش برای مقایسه استفاده می‌کنه.

[^diagnostic]: **diagnostic**: تشخیصی، پروسه‌ای که وضعیت رو ارزیابی می‌کنه. اینجا به معنی یه check سریع برای پیدا کردن کد درست.
