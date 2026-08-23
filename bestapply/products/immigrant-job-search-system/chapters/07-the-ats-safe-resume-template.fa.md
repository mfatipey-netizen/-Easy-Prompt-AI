# فصل ۷ · template resume سازگار با ATS

این فصل، Part 2 رو می‌بنده. چهار فصل پیش، عنوان resume ت رو ATS به کد اشتباه می‌چسبوند. سه فصل پیش، چک‌باکس مجوز کار قبل از نمره‌گذاری ردت می‌کرد. یه فصل پیش، پروفایل LinkedIn ت برای recruiter ها پیدا نبود. این فصل، همهٔ اونا رو تبدیل می‌کنه به یه فایل واحد: resume ای که برای پانصد application بعدیت attach می‌کنی.

اکثر مهاجرین resume هایی می‌سازن که *زیبا* به نظر می‌رسن ولی *بد* رتبه می‌گیرن. Canva، Figma، InDesign — همه‌شون PDF هایی تولید می‌کنن که روی صفحهٔ تو محشرن و برای Workday ناخوانا. این فصل، fix ش میکنیم.

---

## چی واقعاً توی ۲۰۲۶ parser رو می‌شکنه

parser رزومهٔ ATS، اون چیزی که تو می‌بینی رو نگاه نمی‌کنه. یه pass استخراج متن روی لایهٔ PDF می‌زنه، بعد یه سری قانون اعمال می‌کنه تا بفهمه چی عنوان شغلی‌ه، چی اسم شرکته، چی تاریخه، چی bullet ه.

شش انتخاب design این pass رو می‌شکنن. تقریباً هر «template designer رزومه» حداقل سه تاشون رو داره.

**۱. layout دو ستونی.** parser بالا-به-پایین، چپ-به-راست می‌خونه. یه resume دو ستونی متنی مثل این تولید می‌کنه: «January 2023 Software Engineer 2024 Google» — parser نمی‌فهمه کدوم تاریخ به کدوم شغل تعلق داره. هر قانون date-parsing توی ATS fail می‌شه، و record ت رو downgrade[^downgrade] می‌کنه.

**۲. متن داخل تصویر.** اگه اسم، headline، یا اطلاعات تماست توی یه PNG یا SVG banner بالای resume baked[^baked] شده، parser هیچی نمی‌خونه. برای ATS تو نه اسم داری نه شماره تلفن. نتیجه: hard filter بیرون.

**۳. محتوای header و footer.** اکثر ATS ها صراحتاً ناحیهٔ header و footer فایل PDF رو نادیده می‌گیرن (اونا برای شمارهٔ صفحه طراحی شده بودن). اگه اطلاعات تماست اون بالاست، نامرئیه.

**۴. text box ها.** متن که داخل یه text box شناور قرار می‌گیره (به‌جای محل اصلی متن)، اکثراً بطور کامل skip می‌شه. هر template Canva ای که «sidebar» داره به احتمال خیلی زیاد از text box استفاده می‌کنه.

**۵. font های غیراستاندارد.** font های بیرون از مجموعهٔ امن (Arial، Helvetica، Calibri، Times New Roman، Georgia، Verdana) گاهی خطاهای ligature[^ligature] موقع استخراج تولید می‌کنن — «fi» به یه character تک تبدیل می‌شه که ATS به‌عنوان جفنگ می‌خونه. نادر ولی دردناک.

**۶. character های bullet سفارشی.** bullet های Unicode فانتزی (فلش، ستاره، تیک) اکثراً به `?` یا هیچی استخراج می‌شن. فقط از استاندارد `•` یا `-` استفاده کن.

---

## ساختاری که پانزده ATS بزرگ رو رد می‌کنه

این ساختار رو در برابر پانزده ATS پرکاربرد آمریکای شمالی تست کردم — Workday، Greenhouse، iCIMS، Taleo، Lever، Ashby، SmartRecruiters، JazzHR، JobDiva، Bullhorn، BambooHR، ADP Recruiting، UKG، Recruitee و Breezy — با استفاده از preview parser عمومی هر vendor یا documentation رفتار مستندش. این ساختار روی هر پانزده تا تمیز عبور می‌کنه.

    [YOUR NAME — 18–22pt, bold, plain text, NOT in header]
    [City, Province/State — Country · phone · email · linkedin URL · optional portfolio URL]
    [خط مجوز کار — template فصل ۵]

    SUMMARY
    [پاراگراف دو خطی — کلمات کلیدی crosswalk فصل ۴ front-load شده]

    EXPERIENCE
    [Company Name] — [City, Country]                        [Start MMM YYYY – End MMM YYYY]
    [Job Title — دقیقاً match با crosswalk فصل ۴]
    • Bullet 1 — با یه فعل قوی شروع می‌شه، یه کلمهٔ کلیدی فصل ۴ داخلش
    • Bullet 2 — تأثیر رو کمّی کن اگه صادقانه‌ست
    • Bullet 3 — یه ابزار، framework، یا استاندارد خاص نام ببر
    • Bullet 4 (اختیاری) — outcome یا scale metric

    [Previous Company] — [City, Country]                     [MMM YYYY – MMM YYYY]
    [Previous Title]
    • Bullet 1
    • Bullet 2
    • Bullet 3

    EDUCATION
    [Degree, Field] — [Institution, City, Country]           [YYYY]

    SKILLS
    [۱۰-۱۴ skill، جدا با کاما، دقیقاً match با ۱۰ skill pin شده LinkedIn فصل ۶]

    CERTIFICATIONS (اختیاری)
    [Cert name — issuing body, YYYY]

**شش قانون این ساختار:**

- **section heading ها همه با حرف بزرگ (ALL CAPS)** و دقیقاً match با این لیست. ATS parser ها این string ها رو به‌عنوان anchor[^anchor-recap] section استفاده می‌کنن.
- **فقط یک ستون.** نه sidebar، نه split panel، نه box.
- **تاریخ‌ها راست، فقط یه فرمت** (MMM YYYY — MMM YYYY). قاطی‌کردن «Jan 2023» و «January 2023» date parser رو گیج می‌کنه.
- **عنوان شغلی توی خط جدا از اسم شرکت.** ترکیبشون نکن.
- **Skills یه لیست flat جدا با کاماست**، نه جدول، نه rating bar. parser لیست رو به‌عنوان مجموعه‌ای از token[^token] می‌خونه.
- **از Word ذخیره کن به‌عنوان PDF، نه از Canva.** خروجی PDF ورد یه text layer[^text-layer] تولید می‌کنه که هر ATS می‌تونه بخونه. خروجی Canva گاهی بخش‌های تزئینی رو rasterize[^rasterize] می‌کنه.

---

## دو variant: کانادا و آمریکا

ساختار پایه توی هر دو بازار یکسانه. چهار تفاوت خاص که ارزش گفتن دارن.

| المان | کانادا | آمریکا |
|---|---|---|
| عکس | نذار | نذار |
| سن / تاریخ تولد | نذار | نذار |
| وضعیت تأهل | نذار | نذار |
| طول ایده‌آل | ۱ صفحه junior، ۲ صفحه senior | ۱ صفحه junior، ۲ صفحه senior |
| کلمه‌بندی skills-list | spelling کانادایی OK؛ اگه دو-بازاری apply می‌کنی، spelling آمریکایی | spelling آمریکایی |
| خط مجوز کار | Template A فصل ۵ (PGWP / BOWP / PR) | Template B-D فصل ۵ (Green Card / OPT / H-1B) |
| آدرس روی resume | فقط شهر + استان (بدون خیابون) | فقط شهر + State (بدون خیابون) |
| GPA برای تازه فارغ‌التحصیل | اختیاری، فقط اگه >3.5/4.0 یا >۸۰٪ | استاندارد، اگه >3.5/4.0 |
| خط زبان فرانسه (اگه اعمال می‌شه) | نمره CELPIP[^celpip] یا TEF[^tef] خودت رو صریح بذار اگه داری | نذار مگر role نام ببره فرانسه |

برای خوانندهٔ cross-border — که هم‌زمان توی کانادا و آمریکا apply می‌کنه — قانون فصل ۴ اعمال می‌شه: از عنوان NOC-aligned به‌عنوان heading اصلی استفاده کن، کلمه‌بندی O*NET رو توی bullet اول بذار، spelling آمریکایی رو در سراسر متن حفظ کن. اون فایل واحد در برابر ATS های هر دو بازار خوب رتبه می‌گیره.

---

## audit پنج‌دقیقه‌ای resume

قبل از این‌که application بعدیت رو submit کنی، این checklist رو روی resume فعلیت اجرا کن. هر «نه» یه مشکل مشخص توی یه جای مشخصه.

۱. resume ت **یه ستون** بالا-به-پایینه؟ (PDF رو توی Preview یا Adobe باز کن. اگه هر متنی side-by-side با متن دیگه ظاهر شد، ستون داری.)
۲. **اسم و اطلاعات تماست توی body اصلی صفحه‌ست** — نه توی ناحیهٔ header یا footer فایل PDF؟ (سعی کن بالای resume رو copy کنی؛ اگه اسم و تلفنت copy نشد، توی header ن.)
۳. همهٔ **section heading** هات دقیقاً می‌گن **SUMMARY, EXPERIENCE, EDUCATION, SKILLS**؟ (نه «About me»، «Career journey»، «Toolkit».)
۴. همهٔ **تاریخ‌هات به یه فرمتن** (MMM YYYY – MMM YYYY)؟
۵. **font** ت توی مجموعهٔ امنه (Arial، Helvetica، Calibri، Times New Roman، Georgia، Verdana)؟
۶. **bullet اول جدیدترین role ت** با یه کلمهٔ کلیدی crosswalk فصل ۴ front-load شده؟
۷. **خط مجوز کار** توی block header ست، با template فصل ۵؟
۸. **skill هات** با ۱۰ skill pin شده LinkedIn ت از فصل ۶ match می‌شن؟

هشت جواب «yes» یعنی فایل ATS-safe ه. هر «no» یه fix صبح شنبه‌ست.

---

## یه چیزی که این کتاب برات نمی‌کنه

الان همهٔ fix های Part 2 رو داری:

- فصل ۴: کد NOC + O*NET درست توی عنوان و bullet اولت.
- فصل ۵: خط شش‌کلمه‌ای مجوز کار توی header.
- فصل ۶: LinkedIn هماهنگ با همون کلمات و همون زبان authorization.
- فصل ۷ (این فصل): یه فایل resume فیزیکی که پانزده ATS بزرگ رو رد می‌کنه.

چیزی که این کتاب برات نمی‌کنه، اینه که دکمهٔ send رو بزنه. اون پنج دقیقهٔ خودته، این آخر هفته.

ولی وقتی تو send رو زدی، ماشین اون طرف صفحه، تو رو درست parse می‌کنه، درست کدگذاری می‌کنه، و درست رتبه‌بندی می‌کنه. این یه نتیجهٔ کاملاً متفاوت از ۳۴۰ application و ۴ جواب ساراست. این کل هدف Part 2 ه.

Part 3 با deliverable ای شروع می‌شه که اکثر خواننده‌ها برای همینش اومدن — بیست cover letter نوشته‌شده با AI که مثل AI-drafted صدا نمی‌ده. فصل ۸ بزرگ‌ترین single-chapter این کتابه، و اون فصلیه که نرخ پاسخت اول توش رو حس می‌کنه.

---

## صفحهٔ screenshot

| ایده | عدد | چی کار کن |
|---|---|---|
| انتخاب‌های design که parser ATS رو می‌شکنن | ۶ مشخص | resume ت رو برای هر شش‌تا audit کن |
| ATS بزرگ آمریکای شمالی که این ساختار تمیز رد می‌کنه | ۱۵ | این ساختار رو استفاده کن، نه template Canva |
| تعداد ستون درست | ۱ | sidebar ها رو حذف کن، split panel ها رو حذف کن |
| اندازهٔ مجموعهٔ font های امن | ۶ (Arial، Helvetica، Calibri، Times New Roman، Georgia، Verdana) | هر font دیگه رو به یکی از این‌ها عوض کن |
| طول resume (junior در برابر senior) | ۱ صفحه در برابر ۲ صفحه | هر چیز قدیمی‌تر از ۱۰ سال رو حذف کن |
| زمان یه audit در برابر checklist ۸ سؤالی | ~۵ دقیقه | قبل از submit کردن application بعدیت اجراش کن |

Part 2 تموم شد. هر فیلتر ناپیدایی که قبلاً ردت می‌کرد، الان دیدنیه و برای تو تنظیم شده. Part 3 جاییه که شروع می‌کنیم به بردنِ توجه اون طرف صفحه.

[^downgrade]: **downgrade**: پایین آوردن رتبه. توی این متن، وقتی parser نمی‌تونه یه فیلد رو درست تشخیص بده، رتبهٔ کلی resume رو کم می‌کنه.

[^baked]: **baked into an image**: پخته‌شده در تصویر. یعنی متن به‌عنوان بخشی از تصویر ذخیره شده، نه به‌عنوان text قابل انتخاب.

[^ligature]: **ligature**: پیوستگی حرفی. توی typography، دو یا چند حرف که به یه glyph واحد ترکیب می‌شن (مثل fi، fl). parser های ضعیف نمی‌تونن جداشون کنن.

[^anchor-recap]: **anchor**: نقطهٔ اتصال / مرجع. توی فصل ۴ معرفی شد — این‌جا هم به همون معنی: string هایی که ATS بهشون تکیه می‌کنه تا section های رزومه رو تشخیص بده.

[^token]: **token**: توکن / واحد. توی پردازش متن، هر «واحد» جداشدهٔ متن — یه کلمه، یه علامت، یا یه اسم خاص.

[^text-layer]: **text layer**: لایهٔ متن. توی PDF، لایه‌ای که متن قابل انتخاب و قابل جست‌وجو رو حمل می‌کنه. بدون این لایه، PDF فقط تصویره.

[^rasterize]: **rasterize**: تبدیل به pixel. وقتی یه عنصر vector (مثل متن) به تصویر بیت‌مپ تبدیل می‌شه، دیگه قابل انتخاب یا استخراج نیست.

[^celpip]: **CELPIP** (Canadian English Language Proficiency Index Program): آزمون تشخیص مهارت زبان انگلیسی مخصوص کانادا. IRCC ازش برای اقامت دائم و شهروندی قبول می‌کنه.

[^tef]: **TEF** (Test d'Évaluation de Français): آزمون رسمی مهارت زبان فرانسه. IRCC برای Express Entry به‌عنوان اثبات مهارت فرانسه ازش استفاده می‌کنه — امتیازهای CRS قابل توجهی برای متقاضیانی که TEF بالا دارن اضافه می‌شه.
