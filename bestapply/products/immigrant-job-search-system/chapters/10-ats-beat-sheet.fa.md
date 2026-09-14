# فصل ۱۰ · ATS beat sheet[^beatsheet]

فصل ۹ بهت پنجاه prompt داد، مرتب شده بر اساس response rate. چند تاشون (A4، D8، D1) ازت می‌خوان به AI feed کنی «top-weighted ATS keywords for this role». این فصل چیزیه که feed می‌کنی.

کم‌جذاب‌ترین فصل کتابه و اونیه که مطمئن‌ترین حرکت روی reply rate رو داره. نه به این خاطر که keyword ها مخفی‌ن — نیستن. به این خاطر که مهاجرها به‌طور مکرر target frequency ها رو under-hit می‌کنن و از section اشتباه برای هر keyword استفاده می‌کنن، که یه دستهٔ اشتباهه که ماشین می‌تونه اندازه‌گیری کنه و انسان هیچ‌وقت نمی‌بینه.

هر application ردشده‌ای که یه مهاجر باهاش مواجه می‌شه، غیر از زمان، انگیزهٔ ادامه دادن رو هم ازش می‌گیره. این فصل جاییه که دیگه به ریاضیات نامرئی نمی‌بازی.

---

## ATS ها واقعاً چطور keyword می‌شمرن

هر ATS بزرگ (Workday، Greenhouse، iCIMS، Taleo، Lever، Ashby) چهار کار یکسان رو، به همون ترتیب، روی فایلت انجام می‌ده:

۱. **Tokenize[^tokenize] می‌کنه** رزومه، cover letter، و portal free-text رو به یه bag of term ها.
۲. **وزن می‌ده** به هر term بر اساس section ای که ظاهر شده — همون کلمه توی Summary تو ۳-۵ برابر همون کلمه توی یه bullet وسط رزومه وزن می‌گیره، و ۱۰-۲۰ برابر همون کلمه دفن‌شده توی footer.
۳. **ضرب می‌کنه** در frequency، با returns شدیداً کاهنده بعد از ۳ occurrence و اغلب یه penalty flag بعد از ۶.
۴. **adjacency[^adjacency] رو چک می‌کنه** — keyword هایی که نزدیک هم ظاهر می‌شن، توی همون bullet یا همون پاراگراف، بالاتر از همون keyword ها پراکنده در چهار صفحه رتبه می‌گیرن.

دو implication که باید جلوی چشمت باشن:

- **Summary سه تا پنج برابر یه bullet ه.** اگه target keyword توی Summary ت نیست، ۶۰-۸۰٪ ارزشش رو داری می‌سوزونی حتی اگه سه بار جای دیگه ظاهر شه.
- **Frequency خطی نیست.** یه بار «Kubernetes» توی Summary و دو بار توی Experience، بهتر از هفت ذکر پراکنده بدون هیچ‌کدوم توی Summary. هدفت ۳ کل، توزیع‌شده بر اساس section، نه ۷ کل هر جا.

بقیهٔ این فصل beat sheet ه — target frequency های دقیق، بر اساس section، برای ده keyword برتر توی هر یک از ده role رایج‌ترین که مهاجرها هدف می‌گیرن.

---

## تست three-strike

قبل از این‌که به جدول‌ها برسیم، یه قانون که بر هر keyword این فصل حاکمه: **هر keyword سطح S باید دقیقاً توی سه جا ظاهر بشه** — رزومه، cover letter، و پروفایل LinkedIn. نه چهار. نه دو.

- **رزومه:** target frequency از جدول زیر (معمولاً ۲-۳).
- **Cover letter:** دقیقاً ۱، توی پاراگراف ۱ یا پاراگراف ۲.
- **LinkedIn:** توی headline (اگه یه keyword سطح top-3 ه) و توی About (هر keyword top-10).

Keyword ای که توی هر سه ظاهر می‌شه، قوی‌ترین signal ای که search recruiter و parser ATS می‌تونن بخونن رو می‌فرسته. keyword ای که فقط توی یه channel ظاهر می‌شه به‌عنوان یه fluke رد می‌شه. keyword ای که چهار بار یا بیشتر توی یه channel ظاهر می‌شه، فیلتر stuffing رو trigger می‌کنه.

مهاجرها به‌طور مکرر این test رو به همون شکل fail می‌کنن: رزومهٔ سنگین (۶+ ذکر term هدف رو load می‌کنن)، صفر LinkedIn (هیچ‌وقت بعد از landing به‌روز نکردن)، و یه ذکر generic توی cover letter که می‌تونه دربارهٔ هر role باشه. این توزیع روی هر ATS rank-fail می‌شه و برای هر انسان generic می‌خونه.

---

## چطور جدول‌ها رو بخونیم

هر جدول زیر یه role رو پوشش می‌ده. ستون‌ها:

- **Keyword:** رشتهٔ دقیقی که ATS دنبالشه. برای parsing ATS، case اهمیت نداره ولی برای خوانندهٔ انسانی داره — از case طبیعی توی رزومه‌ات استفاده کن.
- **Résumé frequency (target):** چند بار keyword باید توی رزومه‌ات ظاهر بشه، توزیع‌شده بین Summary + Experience + Skills.
- **Section priority:** کدوم section ها باید حداقل یه occurrence داشته باشن. `S/E/K` = Summary / Experience / Skills. `S/E` یعنی Summary + Experience اجباری‌ن، Skills اختیاری.
- **Cover-letter frequency:** ۰ یا ۱. اگه ۱، کدوم پاراگراف — `P1` یا `P2`.
- **LinkedIn:** کجا باید ظاهر بشه — `H` = Headline، `A` = About، `SK` = بخش Skills پین‌شده.
- **Adjacency:** keyword هایی که باید توی *همون bullet* با این ظاهر بشن برای lift adjacency.

جدول‌ها برای **default Workday-style parsing** کالیبره شدن، که رایج‌ترین توی NA و سخت‌گیرترینه. اگه از Workday بگذره، از اون چهارده تای دیگه هم می‌گذره.

---

## Tech (۵ role)

### Software Engineer

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Software Engineer *(یا Full-stack / Backend / Frontend به‌عنوان title تو)* | ۳ | S/E/K | ۱ (P1) | H, A | — |
| *primary language* (مثل **Python**, **TypeScript**, **Go**) | ۳ | S/E/K | ۱ (P2) | H, A, SK | *framework* |
| *primary framework* (مثل **React**, **Django**, **Node.js**) | ۳ | S/E/K | ۱ (P2) | A, SK | *language* |
| **AWS** (یا **GCP** / **Azure** — اونی که match می‌شه رو انتخاب کن) | ۲ | E/K | ۰ | A, SK | *deployment noun* (Kubernetes, Terraform) |
| **REST API** (یا **GraphQL**) | ۲ | E/K | ۰ | A, SK | *framework* |
| **CI/CD** | ۲ | E/K | ۰ | A, SK | *tool* (GitHub Actions, Jenkins) |
| **Docker** | ۲ | E/K | ۰ | A, SK | Kubernetes |
| **Kubernetes** (اگه تجربهٔ واقعی داری) | ۲ | E/K | ۰ | SK | Docker, AWS |
| **PostgreSQL** (یا **MySQL** / **MongoDB**) | ۲ | E/K | ۰ | SK | *language* |
| **Agile** (یا **Scrum**) | ۱ | E | ۰ | A | — |

**Gotcha:** دو اشتباه این‌جا (الف) list کردن پنج زبان توی Skills وقتی فقط توی یکی ship می‌کنی — signal زبان اصلی رو ۶۰٪ dilute می‌کنه — و (ب) ذکر Kubernetes توی رزومه وقتی تجربهٔ واقعیت ۴ ساعت tutorial ه. هر keyword باید توی یه probe ۳۰-ثانیه‌ای interview قابل دفاع باشه.

### Data Engineer / Data Analyst

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Data Engineer *(یا Analytics Engineer / Data Analyst به‌عنوان title تو)* | ۳ | S/E/K | ۱ (P1) | H, A | — |
| **SQL** | ۴ | S/E/K | ۱ (P2) | H, A, SK | *warehouse* |
| **Python** | ۳ | S/E/K | ۰ | A, SK | pandas, Airflow |
| *cloud warehouse* (**Snowflake** / **BigQuery** / **Redshift**) | ۳ | S/E/K | ۱ (P2) | A, SK | dbt |
| **dbt** | ۲ | E/K | ۰ | A, SK | *warehouse*, SQL |
| **Airflow** (یا **Prefect** / **Dagster**) | ۲ | E/K | ۰ | A, SK | Python |
| **ETL** (یا **ELT**) | ۲ | E/K | ۰ | A, SK | *warehouse* |
| **Tableau** (یا **Looker** / **Power BI**) | ۲ | E/K | ۰ | A, SK | SQL |
| **AWS** (یا **GCP**) | ۲ | E/K | ۰ | A, SK | *warehouse* |
| **data modeling** | ۱ | E | ۰ | A | dbt |

**Gotcha:** SQL استثنای قانون «۳ حداکثر» ه — باید ۴ بار یا بیشتر ظاهر بشه چون top ATS ها برای این role فرکانس SQL رو سنگین‌تر از هر term تک دیگه وزن می‌دن. همچنین: یه warehouse انتخاب کن و یه BI tool. list کردن هر سه warehouse و هر سه BI tool به‌عنوان noise rank-fail می‌شه.

### ML Engineer

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Machine Learning Engineer *(یا Applied ML Scientist)* | ۳ | S/E/K | ۱ (P1) | H, A | — |
| **PyTorch** (یا **TensorFlow** — یکی رو انتخاب کن) | ۳ | S/E/K | ۱ (P2) | H, A, SK | Python |
| **Python** | ۳ | S/E/K | ۰ | A, SK | PyTorch |
| **LLM** (یا **transformer** / **GPT** / **BERT**) | ۳ | S/E/K | ۱ (P2) | A, SK | fine-tuning, RAG |
| **fine-tuning** (یا **RLHF** / **DPO**) | ۲ | E/K | ۰ | A, SK | LLM |
| **RAG** (retrieval-augmented generation) | ۲ | E/K | ۰ | A, SK | LLM, vector database |
| **MLOps** | ۲ | E/K | ۰ | A, SK | *cloud* |
| **AWS SageMaker** (یا **Vertex AI** / **Azure ML**) | ۲ | E/K | ۰ | SK | MLOps |
| **eval** (یا **evaluation harness**) | ۲ | E | ۰ | A | LLM |
| **feature engineering** | ۱ | E | ۰ | A | Python |

**Gotcha:** فضای ML به اندازهٔ کافی سریع حرکت می‌کنه که list keyword ATS هر ۶ ماه shift می‌کنه. اگه امروز apply می‌کنی، LLM/RAG/fine-tuning سطح S ن؛ term های ML کلاسیک (random forest، XGBoost) الان مخصوصاً برای ML Engineer سطح B ن. برای شرکت‌های هدفت هر ۶ ماه دوباره چک کن.

### DevOps / SRE

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| DevOps Engineer *(یا Site Reliability Engineer / Platform Engineer)* | ۳ | S/E/K | ۱ (P1) | H, A | — |
| **Kubernetes** | ۴ | S/E/K | ۱ (P2) | H, A, SK | Docker, *cloud* |
| **AWS** (یا **GCP** / **Azure**) | ۳ | S/E/K | ۱ (P2) | H, A, SK | Kubernetes, Terraform |
| **Terraform** | ۳ | S/E/K | ۰ | A, SK | *cloud* |
| **CI/CD** | ۳ | E/K | ۰ | A, SK | *tool* |
| **Docker** | ۲ | E/K | ۰ | A, SK | Kubernetes |
| **Prometheus** (یا **Grafana** / **Datadog**) | ۲ | E/K | ۰ | A, SK | observability |
| **Linux** | ۲ | E/K | ۰ | SK | — |
| **incident response** (یا **on-call**) | ۲ | E | ۰ | A | SRE |
| **Python** (یا **Go** / **Bash**) | ۲ | E/K | ۰ | SK | automation |

**Gotcha:** رزومه‌های DevOps اغلب روی list تول over-index می‌کنن و روی فعل‌های outcome under-index — beat sheet frequency می‌گه، ولی اگه هر چهار ذکر Kubernetes توی یه bullet list Skills باشه، lift adjacency صفره. توی روایت‌های Summary و Experience توزیع کن.

### QA / Test Engineer

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| QA Engineer *(یا Test Automation / SDET)* | ۳ | S/E/K | ۱ (P1) | H, A | — |
| **automation** (یا **automated testing**) | ۳ | S/E/K | ۱ (P2) | H, A, SK | *framework* |
| *framework* (**Selenium** / **Cypress** / **Playwright**) | ۳ | S/E/K | ۱ (P2) | A, SK | automation |
| **API testing** | ۲ | E/K | ۰ | A, SK | Postman, REST |
| **regression** (یا **regression suite**) | ۲ | E/K | ۰ | A | — |
| **CI/CD** | ۲ | E/K | ۰ | A, SK | *framework* |
| **Python** (یا **JavaScript**) | ۲ | E/K | ۰ | SK | *framework* |
| **Agile** | ۲ | E | ۰ | A | — |
| **test plan** | ۱ | E | ۰ | A | — |
| **defect tracking** (یا **Jira**) | ۱ | E/K | ۰ | SK | — |

---

## Finance (۲ role)

### Financial Analyst / FP&A

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Financial Analyst *(یا FP&A / Senior Analyst)* | ۳ | S/E/K | ۱ (P1) | H, A | — |
| **FP&A** | ۳ | S/E/K | ۱ (P2) | H, A, SK | forecasting |
| **forecasting** (یا **modeling**) | ۳ | S/E/K | ۰ | A, SK | FP&A |
| **variance analysis** | ۲ | E | ۰ | A | forecasting |
| **budgeting** | ۲ | E/K | ۰ | A, SK | — |
| **Excel** (یا **advanced Excel**) | ۳ | E/K | ۰ | SK | — |
| **SQL** | ۲ | E/K | ۱ (P2 اگه SaaS هدفه) | A, SK | Tableau |
| **NetSuite** (یا **SAP** / **Oracle** — match با هدف) | ۲ | E/K | ۰ | SK | — |
| **CPA** (یا **CFA** — اگه داری list کن، keyword اجباری) | ۲ | S/E/K | ۱ (P1 اگه داری) | H, A, SK | — |
| **IFRS** (یا **GAAP** — match با بازار هدف) | ۲ | E/K | ۰ | A | — |

**Gotcha:** credential (CPA/CFA/CMA) بالاترین وزن token توی این ATS parser برای این role ه. اگه یکی داری، باید توی خط Summary و headline ت باشه. اگه نداری، list ش نکن — ولی certification در حال انجامت رو با تاریخ مورد انتظار list کن، که ATS ها بخشی از credit می‌دن.

### Senior Accountant / Auditor

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Senior Accountant *(یا Audit Senior / Assurance Associate)* | ۳ | S/E/K | ۱ (P1) | H, A | — |
| **CPA** | ۳ | S/E/K | ۱ (P1) | H, A, SK | *market* (Ontario, US, etc.) |
| **IFRS** (کانادا) یا **US GAAP** (آمریکا) | ۳ | S/E/K | ۱ (P2) | A, SK | *audit standard* |
| **month-end close** (یا **year-end close**) | ۳ | E/K | ۰ | A, SK | reconciliation |
| **reconciliation** | ۲ | E/K | ۰ | A, SK | month-end close |
| **audit** (یا **assurance**) | ۲ | E/K | ۱ (P2 اگه firm audit هدفه) | A | IFRS or GAAP |
| **NetSuite** (یا **QuickBooks** / **SAP** — match با هدف) | ۲ | E/K | ۰ | SK | — |
| **internal controls** (یا **SOX**) | ۲ | E | ۰ | A | audit |
| **tax provision** (اگه اعمال می‌شه) | ۱ | E | ۰ | A | — |
| **Big 4** (فقط اگه توی یکی کار کردی — tag اجباری) | ۲ | S/E | ۱ (P1 اگه اعمال می‌شه) | H, A | *firm name* |

---

## Healthcare (۲ role)

### Registered Nurse

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Registered Nurse *(یا RN، هر دو شکل رو استفاده کن)* | ۳ | S/E/K | ۱ (P1) | H, A | — |
| **NCLEX-RN** | ۲ | S/E/K | ۱ (P1) | A | passing date |
| *practice permit* (**CNO** / **CRNBC** / **OIIQ** — match با استان) | ۳ | S/E/K | ۱ (P1) | H, A | — |
| *specialty* (**med-surg** / **oncology** / **ICU** / **ER**) | ۳ | S/E/K | ۱ (P2) | H, A, SK | — |
| **patient care** (یا **patient assessment**) | ۲ | E | ۰ | A | *specialty* |
| **BLS** (یا **ACLS** / **PALS** — هر certificate ای داری) | ۲ | E/K | ۰ | A, SK | — |
| **EMR** (یا **Epic** / **Cerner** — match با هدف) | ۲ | E/K | ۰ | A, SK | — |
| **medication administration** | ۱ | E | ۰ | A | *specialty* |
| **shift** (یا **12-hour shift** / **nights** — match با در دسترس بودن) | ۱ | S/E | ۱ (P1 یا P3 به‌عنوان availability) | A | — |
| **charge nurse** (فقط اگه اعمال می‌شه) | ۱ | E | ۰ | A | *specialty* |

**Gotcha:** practice permit keyword فیلتر hard ه — اگه گم بشه یا استان match نکنه، اکثر ATS های hospital قبل از scoring هر چیز دیگه‌ای رد می‌کنن. اسم college رو بدون context استان مخفف نکن («CNO» تنها OK ه چون از نظر استانی روشنه؛ «College of Nurses» تنها نه).

### Pharmacist

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Pharmacist *(یا PharmD / RPh)* | ۳ | S/E/K | ۱ (P1) | H, A | — |
| *state یا provincial license* (**NY**, **CA**, **Ontario**، etc.) | ۳ | S/E | ۱ (P1) | H, A | pharmacist |
| **NAPLEX** (آمریکا) یا **PEBC** (کانادا) | ۲ | S/E/K | ۱ (P1) | A | passing date |
| **PharmD** | ۲ | S/E/K | ۱ (P1 یا P2) | A, SK | *school* |
| **dispensing** | ۲ | E | ۰ | A | — |
| **MTM** (Medication Therapy Management) | ۲ | E/K | ۱ (P2 اگه retail هدفه) | A, SK | immunization |
| **immunization** (یا **immunization certified**) | ۲ | E/K | ۱ (P2) | A, SK | MTM |
| **clinical** (یا **clinical pharmacist**) | ۲ | E | ۰ | A | *specialty* |
| **inventory** (یا **inventory management** — retail) | ۱ | E | ۰ | A | — |
| **EMR** (یا **pharmacy management system name**) | ۱ | E/K | ۰ | SK | — |

---

## Trades (۱ role — الگو تعمیم می‌یابه)

### Electrician (الگو برای HVAC، welder، millwright، plumber اعمال می‌شه)

| Keyword | Résumé freq. | Section | Cover letter | LinkedIn | Adjacency |
|---|---|---|---|---|---|
| Electrician *(یا Journeyman Electrician / Master Electrician)* | ۳ | S/E/K | ۱ (P1) | H, A | — |
| **Red Seal** (یا معادل استانی — Alberta AIT، Ontario 309A) | ۳ | S/E/K | ۱ (P1) | H, A | — |
| *classification* (**residential** / **commercial** / **industrial**) | ۳ | S/E/K | ۱ (P2) | H, A, SK | — |
| **CSA** (یا **NEC** — آمریکا) | ۲ | E/K | ۰ | A, SK | code compliance |
| **conduit** (یا **wiring** / **circuit**) | ۲ | E | ۰ | A | — |
| **service call** (یا **service work**) | ۲ | E | ۰ | A | *classification* |
| **PLC** (یا **controls** — اگه industrial) | ۲ | E/K | ۰ | SK | industrial |
| **blueprint** (یا **schematic**) | ۱ | E | ۰ | A | — |
| **safety** (یا **OSHA** / **WHMIS** / **fall arrest**) | ۲ | E/K | ۰ | A, SK | — |
| **class 5 license** (یا class راننده استانی) | ۱ | S/E | ۰ | A | — |

**Gotcha:** برای هر trade، credential + classification مشخص فیلترهای hard هستن. «Electrician» بدون «commercial» یا «Red Seal» یا یه reference بلیط استانی، به هیچی مفید match نمی‌شه.

---

## قوانین Adjacency — bullet ها چطور باید ساختار داشته باشن

وقتی keyword هات توی section های درست با frequency های درست هستن، adjacency جاییه که ۱۰-۱۵٪ آخر امتیاز relevance ATS ازش می‌آد. قانون:

> **دو keyword سطح S توی یه bullet، از همون دو keyword توی bullet های متفاوت، تقریباً ۲× بالاتر rank می‌شن.**

Bullet ضعیف (keyword ها پراکنده):
> Built REST APIs. Used AWS for hosting. Worked with Docker.

Bullet قوی (keyword ها adjacent):
> Built and deployed REST APIs in Python on AWS ECS with Docker, running behind an ALB with auto-scaling.

همون شش keyword. نسخهٔ قوی به‌عنوان یه cluster متراکم از term های مرتبط tokenize می‌شه که scoring adjacency پاداش می‌ده؛ نسخهٔ ضعیف به‌عنوان سه fragment loosely-related tokenize می‌شه.

هر bullet توی Experience تو باید سعی کنه **دو تا keyword سطح S adjacent** از جدول role ت رو hit کنه. اگه یه bullet فقط یکی داره، در نظر بگیر که آیا خط ش رو کسب می‌کنه.

---

## خطوط anti-stuffing

Parser های ATS stuffing رو تشخیص می‌دن. سه trigger مشخص که نباید ازشون رد بشی:

**Trigger ۱: همون keyword بیشتر از ۶ بار توی یه سند.** شش حداکثر نیست؛ شش زنگ خطره. برای اکثر keyword ها هدف ۳، برای keyword های top-2 هدف ۴، هیچ‌وقت ۶+.

**Trigger ۲: keyword توی متن سفید یا فونت 1-point.** ATS ها موقع parsing formatting رو strip می‌کنن، پس parser keyword stuffed رو می‌بینه ولی recruiter هم می‌بینه، و هر recruiter این ترفند رو دیده. reject خودکار توی مرحلهٔ انسان.

**Trigger ۳: keyword توی metadata / فیلدهای مخفی PDF.** بعضی template ها از سرویس‌های ننام رزومه keyword ها رو توی metadata author یا subject PDF stuff می‌کنن. ATS های مدرن این فیلدها رو می‌خونن و mismatch با محتوای visible رو flag می‌کنن. اگه parser «Java, Python, Ruby, Go, Rust, C++, JavaScript, TypeScript, Swift, Kotlin» رو توی metadata ببینه ولی فقط «Python» رو توی متن visible، فایلت زیر میانگین scoring می‌شه قبل از این‌که انسان ببیندش.

---

## چطور واقعاً از این فصل استفاده کنی

دو حرکت. هر دو زیر یه ساعت.

**حرکت ۱ (۳۰ دقیقه): audit role-match.**
۱. role ت رو توی جدول‌های بالا پیدا کن.
۲. برای هر یک از ده keyword، بشمار چند بار توی رزومهٔ فعلی تو ظاهر می‌شه.
۳. با ستون target مقایسه کن.
۴. برای هر keyword که under-target ه، یه bullet یا یه خط Summary اضافه کن که به‌طور صادقانه نامش رو ببره.
۵. برای هر keyword که over-target ه، به ۳ برش (یا ۴ برای top-2).

**حرکت ۲ (۲۰ دقیقه): چک three-strike.**
برای هر keyword سطح S (ردیف‌های bold):
۱. توی رزومه‌ات با target frequency هست؟ ✓
۲. توی template cover-letter ت (اونی که از فصل ۸ adapt می‌کنی) هست؟ ✓
۳. توی LinkedIn ت هست — headline برای top-3، About برای top-10؟ ✓

سه چک‌مارک به ازای هر keyword سطح S. اگه هر keyword یه mark کم داره، اون mark یه fix ۵ دقیقه‌ایه.

به‌درستی انجام بشه، این دو حرکت reply rate یه رزومه رو بیشتر از هر مداخلهٔ single-hour دیگه که توی سه سال گذشته دیده‌ام lift می‌کنه.

---

## Part 3 بعدش چی می‌کنه

فصل ۱۱ Part 3 رو با feedback loop می‌بنده: چطور rejection هایی که حتی بعد از این فصل هم دریافت می‌کنی رو بگیری و به AI feed کنی که پنجاه application بعدی به‌طور اکید بهتر از پنجاه قبلی باشه. این فصل meta ست — اونی که کل toolkit رو self-improving می‌کنه.

فعلاً، دو حرکت بالا رو روی یه رزومه‌ای که بیشترین استفاده رو داری اجرا کن. این شنبهٔ توئه.

---

## صفحهٔ screenshot

| ایده | عدد | چی کار کن |
|---|---|---|
| وزن parser ATS: Summary در برابر bullet وسط | ۳-۵× | keyword برترت رو به Summary منتقل کن اگه اونجا نیست |
| وزن parser ATS: bullet وسط در برابر footer | ۱۰-۲۰× | هیچ چیز مهمی هیچ‌وقت توی header/footer نمی‌ره |
| Frequency keyword: آستانهٔ زنگ خطر | ۶ occurrence به ازای هر سند | سقف ۳ (یا ۴ برای keyword های top-2) |
| پوشش three-strike به ازای هر keyword سطح S | ۳ channel (رزومه + cover letter + LinkedIn) | هر channel گم‌شده یه fix ۵-دقیقه‌ایه |
| Lift adjacency (۲ keyword توی یه bullet در برابر دو bullet) | ~۲× | bullet هایی که فقط یه keyword سطح S دارن رو بازنویسی کن |
| Role هایی که جدول‌های این فصل پوشش می‌دن | ۱۰ (SWE، DE، MLE، DevOps، QA، FA، SR ACC، RN، Pharmacist، Electrician-pattern) | مال خودت رو پیدا کن؛ اگه list نشده، از نزدیک‌ترین match به‌عنوان template استفاده کن |

ده role. ده جدول keyword. دو حرکت. یه ساعت. فصل ۱۱ بعدی — جایی که loop بسته می‌شه.

[^beatsheet]: **beat sheet**: توی نوشتن فیلم‌نامه، فهرست دقیق beat به beat اینکه توی هر صحنه چی باید اتفاق بیفته. این‌جا: فهرست دقیق keyword به keyword که چی توی رزومه باید کجا با چه frequency ظاهر بشه. اسم اعتراضی به «هوش» ATS ها — ماشین فقط فرمول رو اجرا می‌کنه، تو دقیقاً می‌دونی فرمول چیه.

[^tokenize]: **tokenize**: تجزیه کردن متن به واحدهای کوچیک‌تر (token) — معمولاً کلمه یا زیرکلمه. parser های ATS اول tokenize می‌کنن، بعد هر token رو با یه keyword library مقایسه می‌کنن.

[^adjacency]: **adjacency**: نزدیکی توی متن. توی ATS scoring، دو keyword که توی همون جمله یا bullet ظاهر می‌شن، به‌عنوان «مرتبط» شناخته می‌شن و boost می‌گیرن. همون دو کلمه توی سه پاراگراف مختلف، این boost رو نمی‌گیرن.
