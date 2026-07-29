/*!
 * EASY PROMPT AI — Prompt Engine (server-side, proprietary)
 * Copyright (c) 2026 MOHIFERI (mfatipey). All Rights Reserved.
 *
 * This is the confidential core of EASY PROMPT AI. It runs only on the server
 * so the question banks and prompt-generation logic are never exposed to the
 * browser and cannot be copied. Unauthorized use, reproduction, or distribution
 * is prohibited.
 */

const O = (...a) => a;

/* ============================ CATEGORIES ============================ */
export const CATEGORIES = [
  {n:'نویسندگی و محتوا', e:'✍️', k:'writing'},
  {n:'نویسندگی تخصصی', e:'📝', k:'writing'},
  {n:'تولید محتوا', e:'🎬', k:'writing'},
  {n:'شبکه‌های اجتماعی', e:'📱', k:'social'},
  {n:'طراحی و ساخت تصویر', e:'🎨', k:'image'},
  {n:'عکاسی', e:'📷', k:'image'},
  {n:'مد و فشن', e:'👗', k:'image'},
  {n:'ساخت و تدوین ویدئو', e:'🎥', k:'video'},
  {n:'ساخت انیمیشن', e:'🌀', k:'video'},
  {n:'بازی‌سازی', e:'🎮', k:'game'},
  {n:'برنامه‌نویسی', e:'💻', k:'code'},
  {n:'IT و کامپیوتر', e:'🖥️', k:'code'},
  {n:'کسب‌وکار و بازاریابی', e:'📈', k:'business'},
  {n:'کسب درآمد', e:'💰', k:'business'},
  {n:'سرمایه‌گذاری', e:'📊', k:'finance'},
  {n:'امور مالی', e:'🏦', k:'finance'},
  {n:'مشاوره', e:'🧭', k:'advice'},
  {n:'روانشناسی', e:'🧠', k:'advice'},
  {n:'پزشکی و سلامت', e:'⚕️', k:'health'},
  {n:'چاقی و لاغری', e:'🥗', k:'health'},
  {n:'ورزش و تناسب اندام', e:'🏋️', k:'health'},
  {n:'آموزش و تدریس', e:'📚', k:'education'},
  {n:'دانش‌آموزی', e:'🎒', k:'education'},
  {n:'دانشجویی', e:'🎓', k:'education'},
  {n:'تحقیق و پژوهش', e:'🔬', k:'research'},
  {n:'زبان‌شناسی و ترجمه', e:'🗣️', k:'language'},
  {n:'طراحی داخلی و خارجی', e:'🏠', k:'design3d'},
  {n:'طراحی سازه و معماری', e:'🏗️', k:'design3d'},
  {n:'گردشگری و سفر', e:'✈️', k:'travel'},
  {n:'غذا و آشپزی', e:'🍳', k:'food'},
  {n:'خوردنی و نوشیدنی', e:'🍹', k:'food'},
  {n:'حیوانات', e:'🐾', k:'general'},
  {n:'وسیله نقلیه و تعمیرات', e:'🚗', k:'general'},
  {n:'کاردستی و خلاقیت', e:'🧶', k:'general'},
  {n:'ایده‌پردازی', e:'💡', k:'general'},
  {n:'سرگرمی', e:'🎲', k:'general'},
  {n:'سلامت روان', e:'🌿', k:'advice'},
  {n:'موضوع دلخواه (عمومی)', e:'⭐', k:'general'},
];

/* ============================ QUESTION BANKS ============================ */
const CORE = [
  {id:'goal', type:'text', text:'در یک جمله، خروجیِ نهایی که می‌خواهی چیست و قرار است چه کاری برایت انجام دهد؟',
   hint:'روی نتیجهٔ ملموس تمرکز کن؛ مثلاً «یک ویدئوی تبلیغاتی ۳۰ ثانیه‌ای برای فروش محصولم» نه فقط «یک ویدئو».'},
  {id:'topic', type:'text', text:'دقیقاً دربارهٔ چه چیزی است؟ موضوع، محصول یا سوژهٔ اصلی را نام ببر.',
   hint:'جزئیات مشخص بده: نام، ویژگی کلیدی، حال‌وهوا. هرچه دقیق‌تر، خروجی هدفمندتر.'},
  {id:'audience', type:'single', text:'این خروجی قرار است چه کسی را تحت‌تأثیر بگذارد یا برای چه کسی ساخته می‌شود؟',
   options:O('عموم مردم','متخصصان و حرفه‌ای‌ها','مبتدی‌ها','کودکان/نوجوانان','مشتریان بالقوه','خودم برای استفادهٔ شخصی','سایر (توضیح می‌دهم)')},
  {id:'audience_x', type:'text', text:'مخاطبت را دقیق‌تر توصیف کن.', hint:'سن، سطح دانش، دغدغه یا علاقه‌ای که دارند…', when:a=>a.audience==='سایر (توضیح می‌دهم)'},
  {id:'tone', type:'single', text:'می‌خواهی مخاطب هنگام دیدن خروجی چه حسی بگیرد؟ (لحن و حال‌وهوا)',
   options:O('حرفه‌ای و قابل‌اعتماد','گرم و صمیمی','هیجان‌انگیز و انگیزشی','علمی و دقیق','طنز و بازیگوش','لوکس و مجلل','خنثی و بی‌طرف')},
  {id:'depth', type:'single', text:'چقدر عمق و جزئیات لازم داری؟',
   options:O('کوتاه و سرراست','متعادل و کاربردی','کامل و مفصل','بسیار عمیق و تخصصی')},
  {id:'constraints', type:'text', text:'چه خط‌قرمزها، قوانین یا شرایط اجباری‌ای باید حتماً رعایت شود؟',
   hint:'مثلاً: بودجه، برند، قوانین حقوقی، سقف کلمات… (اگر نداری خالی بگذار)'},
  {id:'avoid', type:'text', text:'چه چیزی باعث می‌شود خروجی را رد کنی؟ چه چیزهایی را نباید انجام دهد؟',
   hint:'اشتباهات رایج یا چیزهایی که حسابی روی اعصابت است. (اختیاری)'},
  {id:'examples', type:'single', text:'نمونه، رقیب یا سبکی هست که دوستش داری و بخواهی از حال‌وهوایش الهام بگیریم؟',
   options:O('بله، توضیح می‌دهم','نه، خودت خلاقیت به خرج بده')},
  {id:'examples_x', type:'text', text:'آن نمونه/مرجع را توصیف کن و بگو دقیقاً چه چیزش را می‌پسندی.', when:a=>a.examples==='بله، توضیح می‌دهم'},
  {id:'format', type:'single', text:'خروجی در چه قالبی به بیشترین درد تو می‌خورد؟',
   options:O('متن پیوسته','فهرست نکته‌ای (Bullet)','جدول','مرحله‌به‌مرحله','پرسش و پاسخ','کد/فنی','قالب را خودت انتخاب کن')},
  {id:'length', type:'single', text:'حجم تقریبی خروجی چقدر باشد؟',
   options:O('خیلی کوتاه','یک پاراگراف','چند پاراگراف','یک صفحهٔ کامل','هر چقدر لازم است')},
  {id:'persona', type:'single', text:'هوش مصنوعی از زبان چه متخصصی با تو حرف بزند و کار را انجام دهد؟',
   options:O('بگذار موتور بهترین نقش را انتخاب کند','یک متخصص ارشد همان حوزه','یک مربی/معلم','یک منتقد سخت‌گیر','یک دوست خلاق','خودم نقش را تعیین می‌کنم')},
  {id:'persona_x', type:'text', text:'نقش دلخواهت را دقیق بنویس.', hint:'مثلاً «یک کارگردان هنری با ۲۰ سال تجربهٔ برندسازی لوکس».', when:a=>a.persona==='خودم نقش را تعیین می‌کنم'},
];

const DOMAIN = {
  image:[
    {id:'img_style', type:'multi', text:'چه سبک بصری‌ای می‌خواهی؟',
     options:O('واقع‌گرایانه (Photorealistic)','سه‌بعدی (3D Render)','مینیمال','سینمایی','نقاشی دیجیتال','آبرنگ','انیمه/کارتونی','سایبرپانک','رئال فانتزی','رترو/وینتیج')},
    {id:'img_light', type:'single', text:'نورپردازی و اتمسفر چطور باشد؟',
     options:O('نور طلایی غروب','نور نئون شبانه','نور نرم استودیویی','نور دراماتیک و کنتراست بالا','نور طبیعی روز','مه‌آلود و مرموز')},
    {id:'img_palette', type:'text', text:'پالت رنگی یا رنگ‌های اصلی چه باشد؟', hint:'مثلاً: مشکی و طلایی، پاستل…'},
    {id:'img_ratio', type:'single', text:'نسبت ابعاد تصویر؟', options:O('مربع 1:1','عمودی 9:16','افقی 16:9','سینمایی 21:9','پرتره 4:5')},
    {id:'img_detail', type:'multi', text:'چه جزئیاتی حتماً در تصویر باشد؟',
     options:O('جزئیات چهره واقعی','بافت و متریال دقیق','عمق میدان (بوکه)','بازتاب و انعکاس','کمپوزیسیون قرینه','فضای منفی زیاد')},
  ],
  video:[
    {id:'vid_type', type:'single', text:'نوع ویدئو چیست؟', options:O('تبلیغاتی','آموزشی','داستانی/سینمایی','ولاگ','موشن‌گرافیک','تیزر کوتاه شبکه اجتماعی')},
    {id:'vid_len', type:'single', text:'مدت زمان تقریبی؟', options:O('کمتر از ۱۵ ثانیه','۱۵ تا ۳۰ ثانیه','۳۰ تا ۶۰ ثانیه','۱ تا ۳ دقیقه','بلندتر')},
    {id:'vid_mood', type:'single', text:'حال‌وهوای ویدئو؟', options:O('پرانرژی و سریع','آرام و احساسی','مرموز و پرتعلیق','شاد و رنگارنگ','لوکس و مینیمال')},
    {id:'vid_scene', type:'text', text:'صحنه‌ها یا شاتهای کلیدی را توصیف کن.'},
    {id:'vid_music', type:'single', text:'موسیقی/صداگذاری؟', options:O('بدون موسیقی','موسیقی حماسی','لوفای/آرام','الکترونیک','گفتار (Voiceover)','خودت پیشنهاد بده')},
  ],
  code:[
    {id:'code_lang', type:'text', text:'زبان برنامه‌نویسی یا تکنولوژی مورد نظر؟', hint:'مثلاً: Python، React، SQL…'},
    {id:'code_task', type:'single', text:'چه کاری باید انجام شود؟', options:O('نوشتن کد از صفر','رفع باگ','بهینه‌سازی/ری‌فکتور','توضیح کد','نوشتن تست','طراحی معماری')},
    {id:'code_level', type:'single', text:'سطح توضیحات همراه کد؟', options:O('فقط کد','کد + کامنت','کد + توضیح کامل قدم‌به‌قدم')},
    {id:'code_env', type:'text', text:'محیط، نسخه‌ها یا محدودیت‌های فنی؟', hint:'(اختیاری)'},
  ],
  writing:[
    {id:'wr_type', type:'single', text:'چه نوع نوشته‌ای؟', options:O('مقاله','پست وبلاگ','ایمیل','کپشن','داستان','سناریو','متن تبلیغاتی','رزومه/نامه اداری','شعر')},
    {id:'wr_hook', type:'single', text:'شروع متن چطور باشد؟', options:O('با یک سؤال','با یک آمار/واقعیت','با یک داستان کوتاه','مستقیم سر اصل مطلب','با یک نقل‌قول')},
    {id:'wr_cta', type:'text', text:'در پایان مخاطب چه کاری انجام دهد؟', hint:'(اختیاری)'},
    {id:'wr_keywords', type:'text', text:'کلمات کلیدی یا عبارات مهم که باید بیایند؟', hint:'(اختیاری)'},
  ],
  social:[
    {id:'soc_platform', type:'multi', text:'برای کدام پلتفرم؟', options:O('اینستاگرام','لینکدین','تیک‌تاک','یوتیوب','ایکس (توییتر)','تلگرام')},
    {id:'soc_goal', type:'single', text:'هدف پست چیست؟', options:O('افزایش تعامل','فروش','آموزش','برندسازی','رشد فالوور','وایرال شدن')},
    {id:'soc_hashtag', type:'single', text:'هشتگ و ایموجی؟', options:O('بله، پیشنهاد بده','بدون هشتگ','فقط ایموجی','هیچ‌کدام')},
  ],
  business:[
    {id:'biz_type', type:'single', text:'خروجی برای چه چیزی است؟', options:O('طرح کسب‌وکار','استراتژی بازاریابی','ایده درآمدزایی','تحلیل رقبا','قیمت‌گذاری','پیشنهاد فروش')},
    {id:'biz_budget', type:'single', text:'بودجه/مقیاس؟', options:O('صفر تا کم','متوسط','بالا','مهم نیست')},
    {id:'biz_market', type:'text', text:'بازار هدف و موقعیت جغرافیایی؟'},
  ],
  finance:[
    {id:'fin_goal', type:'single', text:'هدف مالی چیست؟', options:O('تحلیل سرمایه‌گذاری','برنامه پس‌انداز','مدیریت ریسک','آموزش مفهوم مالی','تحلیل بازار')},
    {id:'fin_risk', type:'single', text:'میزان ریسک‌پذیری؟', options:O('محافظه‌کار','متعادل','تهاجمی')},
    {id:'fin_note', type:'text', text:'زمینه یا اعداد مهم؟', hint:'(اختیاری)'},
  ],
  health:[
    {id:'hl_goal', type:'single', text:'هدف سلامتی چیست؟', options:O('برنامه تغذیه','برنامه تمرینی','کاهش وزن','افزایش وزن/عضله','سبک زندگی سالم','اطلاعات آموزشی')},
    {id:'hl_profile', type:'text', text:'مشخصات مهم (سن، قد، وزن، شرایط)؟', hint:'(اختیاری)'},
    {id:'hl_limit', type:'text', text:'محدودیت یا حساسیت خاصی داری؟', hint:'(اختیاری)'},
  ],
  education:[
    {id:'ed_level', type:'single', text:'سطح یادگیرنده؟', options:O('مبتدی','متوسط','پیشرفته','دانش‌آموز مدرسه','دانشجو')},
    {id:'ed_style', type:'single', text:'روش تدریس دلخواه؟', options:O('با مثال‌های ساده','گام‌به‌گام','با تمرین و آزمون','با تشبیه و استعاره','خلاصه و سریع')},
    {id:'ed_out', type:'single', text:'خروجی آموزشی چه باشد؟', options:O('درسنامه','خلاصه','سؤالات تمرینی','فلش‌کارت','برنامهٔ مطالعه')},
  ],
  research:[
    {id:'rs_type', type:'single', text:'نوع کار پژوهشی؟', options:O('مرور ادبیات','تحلیل داده','فرضیه‌سازی','خلاصهٔ مقاله','روش‌شناسی','نقد علمی')},
    {id:'rs_field', type:'text', text:'رشته یا حوزهٔ دقیق؟'},
    {id:'rs_cite', type:'single', text:'به منبع و استناد نیاز داری؟', options:O('بله، با ذکر منبع','نه')},
  ],
  language:[
    {id:'lg_task', type:'single', text:'چه کاری لازم داری؟', options:O('ترجمه','ویرایش و روان‌سازی','یادگیری زبان','تصحیح گرامر','تبدیل لحن')},
    {id:'lg_from', type:'text', text:'از چه زبانی؟'},
    {id:'lg_to', type:'text', text:'به چه زبانی؟'},
  ],
  design3d:[
    {id:'d3_space', type:'text', text:'چه فضایی طراحی شود؟', hint:'مثلاً: نشیمن، نمای ساختمان…'},
    {id:'d3_style', type:'multi', text:'سبک طراحی؟', options:O('مینیمال مدرن','کلاسیک','صنعتی (Industrial)','اسکاندیناوی','لوکس','ارگانیک/طبیعی','فوتوریستیک')},
    {id:'d3_material', type:'text', text:'متریال و رنگ‌های اصلی؟'},
    {id:'d3_light', type:'single', text:'نورپردازی فضا؟', options:O('نور طبیعی زیاد','نور گرم دنج','نور نئونی مدرن','ترکیبی')},
  ],
  game:[
    {id:'gm_type', type:'single', text:'خروجی برای چه بخشی از بازی است؟', options:O('ایدهٔ بازی','داستان و شخصیت','طراحی مرحله','مکانیک بازی','دیالوگ','توضیح جهان بازی')},
    {id:'gm_genre', type:'text', text:'ژانر و سبک بازی؟'},
    {id:'gm_platform', type:'single', text:'پلتفرم؟', options:O('موبایل','کامپیوتر/کنسول','مرورگر','واقعیت مجازی','مهم نیست')},
  ],
  travel:[
    {id:'tr_dest', type:'text', text:'مقصد یا نوع سفر؟'},
    {id:'tr_days', type:'single', text:'مدت سفر؟', options:O('۱ تا ۲ روز','۳ تا ۵ روز','یک هفته','بیشتر از یک هفته')},
    {id:'tr_style', type:'single', text:'سبک سفر؟', options:O('اقتصادی','لوکس','ماجراجویانه','فرهنگی','استراحت و آرامش','خانوادگی')},
  ],
  food:[
    {id:'fd_type', type:'single', text:'چه می‌خواهی؟', options:O('دستور پخت','ایده منو','برنامه غذایی','معرفی نوشیدنی','ترفند آشپزی')},
    {id:'fd_diet', type:'text', text:'محدودیت غذایی یا سلیقه؟', hint:'(اختیاری)'},
    {id:'fd_time', type:'single', text:'زمان/سختی آماده‌سازی؟', options:O('سریع و آسان','متوسط','حرفه‌ای و زمان‌بر')},
  ],
  advice:[
    {id:'ad_topic', type:'text', text:'موضوع مشاوره دقیقاً چیست؟'},
    {id:'ad_style', type:'single', text:'چه نوع کمکی می‌خواهی؟', options:O('راهکار عملی','گوش دادن و همدلی','تحلیل موقعیت','برنامهٔ گام‌به‌گام','دیدگاه‌های مختلف')},
    {id:'ad_ctx', type:'text', text:'کمی از شرایط و پیشینه بگو.', hint:'(اختیاری)'},
  ],
  general:[
    {id:'gn_use', type:'text', text:'این خروجی را کجا و چطور استفاده می‌کنی؟'},
    {id:'gn_must', type:'text', text:'مهم‌ترین نکته‌ای که حتماً باید رعایت شود؟'},
  ],
};

const PRO_EXTRA = [
  {id:'reasoning', type:'single', text:'هوش مصنوعی چطور به نتیجه برسد؟',
   options:O('مستقیم و سریع','گام‌به‌گام و با استدلال','چند رویکرد را بسنجد و بهترین را انتخاب کند','اول نقشه بریزد بعد اجرا کند')},
  {id:'priorities', type:'single', text:'مهم‌ترین اولویت خروجی چیست؟', options:O('دقت و درستی','خلاقیت و تازگی','سرعت و سادگی','کامل و جامع بودن')},
  {id:'terminology', type:'single', text:'سطح واژگان و اصطلاحات تخصصی؟', options:O('ساده و همه‌فهم','متعادل','کاملاً تخصصی و فنی')},
  {id:'structure_sections', type:'text', text:'خروجی دقیقاً چه بخش‌هایی داشته باشد؟', hint:'(اختیاری)'},
  {id:'format_detail', type:'text', text:'جزئیات دقیق قالب یا سبک نوشتار؟', hint:'(اختیاری)'},
  {id:'variations', type:'single', text:'چند نسخهٔ متفاوت از خروجی می‌خواهی؟', options:O('فقط یک نسخهٔ نهایی','۲ نسخهٔ متفاوت','۳ نسخهٔ متفاوت','چند گزینه با سبک‌های مختلف')},
  {id:'fewshot', type:'single', text:'می‌خواهی یک نمونهٔ ورودی/خروجی به‌عنوان الگو بدهی؟', options:O('بله، الگو می‌دهم','نه، لازم نیست')},
  {id:'fewshot_x', type:'text', text:'الگوی نمونه (ورودی → خروجی دلخواه) را بنویس.', when:a=>a.fewshot==='بله، الگو می‌دهم'},
  {id:'edgecases', type:'text', text:'موارد خاص، استثناها یا اشتباهات رایج که باید پوشش دهد؟', hint:'(اختیاری)'},
  {id:'successcriteria', type:'text', text:'از نظر تو، خروجیِ «عالی» چه ویژگی‌ای دارد؟', hint:'معیار موفقیت.'},
  {id:'selfcheck', type:'single', text:'قبل از تحویل، خودش را نقد و بازبینی کند؟', options:O('بله، با چک‌لیست کیفیت بازبینی کند','نه، همان نسخهٔ اول کافی است')},
];

const CLOSERS = [
  {id:'creativity', type:'single', text:'چقدر خلاقیت و ریسک در خروجی می‌خواهی؟', options:O('کاملاً مطمئن و کلاسیک','متعادل','خلاقانه و جسورانه','کاملاً آزاد و تجربی')},
  {id:'iterate', type:'single', text:'دوست داری هوش مصنوعی قبل از شروع، سؤال بپرسد؟', options:O('بله، اگر چیزی مبهم بود بپرسد','نه، مستقیم شروع کند')},
  {id:'extra', type:'text', text:'چیز دیگری هست که بخواهی اضافه کنی؟', hint:'(اختیاری)'},
];

const FILLER = [
  {id:'fl_context', type:'text', text:'چه اطلاعات پس‌زمینه‌ای هست که به نتیجهٔ بهتر کمک می‌کند؟', hint:'(اختیاری)'},
  {id:'fl_platform', type:'text', text:'این خروجی کجا منتشر یا استفاده می‌شود؟', hint:'(اختیاری)'},
  {id:'fl_feeling', type:'text', text:'دوست داری مخاطب بعد از دیدن خروجی چه حسی داشته باشد؟', hint:'(اختیاری)'},
  {id:'fl_key', type:'text', text:'یک نکتهٔ کلیدی که اگر رعایت شود خیلی برایت مهم است؟', hint:'(اختیاری)'},
  {id:'fl_avoid2', type:'text', text:'چیزی هست که تجربهٔ بدی ازش داشته‌ای و نمی‌خواهی تکرار شود؟', hint:'(اختیاری)'},
  {id:'fl_more', type:'text', text:'هر جزئیات دیگری که به ذهنت می‌رسد را اینجا بنویس.', hint:'(اختیاری)'},
  {id:'fl_ref', type:'text', text:'اگر لینک، نام یا مرجع خاصی مدنظرت هست بنویس.', hint:'(اختیاری)'},
  {id:'fl_tone2', type:'text', text:'کلمه یا عبارتی هست که دوست داری حتماً به کار برود؟', hint:'(اختیاری)'},
];

/* ============================ FLOW ============================ */
const kindOf = name => (CATEGORIES.find(c=>c.n===name)||{}).k || 'general';

function buildPool(kind, pro){
  const dom = DOMAIN[kind] || DOMAIN.general;
  const pool = [];
  const core = [...CORE];
  pool.push(core.shift()); // goal
  pool.push(core.shift()); // topic
  dom.forEach(q=>pool.push(q));
  core.forEach(q=>pool.push(q));
  if(pro) PRO_EXTRA.forEach(q=>pool.push(q));
  CLOSERS.forEach(q=>pool.push(q));
  FILLER.forEach(q=>pool.push(q));
  return pool;
}

export const targetFor = pro => (pro ? 30 : 20);

// Deterministic, stateless: recompute the visible ordered list from answers.
function visibleList(kind, answers, pro){
  const pool = buildPool(kind, pro);
  const target = targetFor(pro);
  const out = [];
  for(const q of pool){
    if(q.when && !q.when(answers)) continue;
    out.push(q);
    if(out.length >= target) break;
  }
  return out;
}

// Public: given answers so far, return next question or {done:true}
export function nextQuestion(categoryName, answers, pro){
  const kind = kindOf(categoryName);
  const list = visibleList(kind, answers, pro);
  const total = targetFor(pro);
  for(let i=0;i<list.length;i++){
    const q = list[i];
    if(!(q.id in answers)){
      return { done:false, index:i+1, total, question: publicQ(q) };
    }
  }
  return { done:true, total, answered:list.length };
}

// only expose safe fields to the client (never the `when` functions)
function publicQ(q){
  return { id:q.id, type:q.type, text:q.text, hint:q.hint||'', options:q.options||null };
}

/* ============================ PROMPT BUILDER ============================ */
const LABELS = {
  en:{role:'ROLE',obj:'OBJECTIVE',ctx:'CONTEXT',task:'TASK & REQUIREMENTS',con:'CONSTRAINTS',avoid:'AVOID',fmt:'OUTPUT FORMAT',tone:'TONE & STYLE',qual:'QUALITY BAR',lang:'LANGUAGE',
    roleTxt:'You are a world-class expert. Adopt the persona of', respond:'Write your entire response in',
    think:'Think step by step and prioritize accuracy, usefulness, and clarity.',
    ask:'If any requirement is ambiguous, ask a brief clarifying question before you begin.',
    noask:'Do not ask questions — produce the best possible result directly.',
    best:'a top senior specialist in this exact field'},
  fa:{role:'نقش',obj:'هدف',ctx:'زمینه و اطلاعات',task:'وظیفه و خواسته‌ها',con:'محدودیت‌ها',avoid:'از این‌ها پرهیز کن',fmt:'قالب خروجی',tone:'لحن و سبک',qual:'استاندارد کیفیت',lang:'زبان',
    roleTxt:'تو یک متخصص جهانی‌تراز هستی. نقش این فرد را بازی کن:', respond:'کل پاسخ را به این زبان بنویس:',
    think:'گام‌به‌گام فکر کن و دقت، کاربردی بودن و شفافیت را در اولویت بگذار.',
    ask:'اگر بخشی از خواسته مبهم بود، قبل از شروع یک سؤال کوتاه بپرس.',
    noask:'سؤالی نپرس — مستقیم بهترین نتیجهٔ ممکن را تولید کن.',
    best:'یک متخصص ارشد و درجه‌یک در همین حوزه'},
  ar:{role:'الدور',obj:'الهدف',ctx:'السياق',task:'المهمة والمتطلبات',con:'القيود',avoid:'تجنب',fmt:'صيغة المخرجات',tone:'الأسلوب والنبرة',qual:'معيار الجودة',lang:'اللغة',
    roleTxt:'أنت خبير عالمي المستوى. تقمّص شخصية', respond:'اكتب ردك بالكامل بهذه اللغة:',
    think:'فكّر خطوة بخطوة وأعطِ الأولوية للدقة والفائدة والوضوح.',
    ask:'إذا كان أي متطلب غامضًا، اطرح سؤالاً توضيحياً موجزاً قبل البدء.',
    noask:'لا تطرح أسئلة — قدّم أفضل نتيجة مباشرة.', best:'خبير أول متخصص في هذا المجال بالتحديد'},
};
const L = c => LABELS[c] || LABELS.en;
const LANG_NAME = {fa:'Persian (فارسی)',en:'English',ar:'Arabic',tr:'Turkish',fr:'French',de:'German',es:'Spanish',it:'Italian',ru:'Russian',zh:'Chinese',ja:'Japanese',hi:'Hindi',pt:'Portuguese'};
const langName = c => LANG_NAME[c] || c;

const val = (answers,id) => { const v=answers[id]; if(Array.isArray(v)) return v.join('، '); return (v||'').toString().trim(); };
const has = (answers,id) => val(answers,id).length>0;

export function generatePrompt(categoryName, answers, langCode, pro){
  const kind = kindOf(categoryName);
  const cat = CATEGORIES.find(c=>c.n===categoryName) || {n:categoryName};
  const lab = L(langCode), lname = langName(langCode);
  const a = answers;

  let persona;
  if(a.persona==='خودم نقش را تعیین می‌کنم' && has(a,'persona_x')) persona=val(a,'persona_x');
  else if(a.persona && a.persona!=='بگذار موتور بهترین نقش را انتخاب کند') persona=a.persona+' — '+lab.best;
  else persona=lab.best+' ('+cat.n+')';

  const goal = has(a,'goal')?val(a,'goal'):cat.n;
  const audience = a.audience==='سایر (توضیح می‌دهم)'?val(a,'audience_x'):(val(a,'audience')||'general audience');

  const skip = new Set(['goal','persona','persona_x','audience','audience_x','tone','depth','constraints','avoid','examples','examples_x','format','length','creativity','iterate','extra','reasoning','fewshot','fewshot_x','edgecases','successcriteria','variations','selfcheck']);
  // rebuild the visible list so context lines follow the same order the user saw
  const list = visibleList(kind, answers, pro);
  const ctxLines = [];
  ctxLines.push('• '+(langCode==='fa'?'مخاطب':'Audience')+': '+audience);
  for(const q of list){
    if(skip.has(q.id)) continue;
    if(has(a,q.id)) ctxLines.push('• '+q.text.replace(/[؟?]/g,'')+': '+val(a,q.id));
  }

  const task=[];
  task.push((langCode==='fa'?'خواستهٔ اصلی: ':'Primary request: ')+goal);
  if(a.examples==='بله، توضیح می‌دهم' && has(a,'examples_x')) task.push((langCode==='fa'?'از این نمونه الهام بگیر: ':'Take inspiration from: ')+val(a,'examples_x'));
  if(has(a,'extra')) task.push(val(a,'extra'));

  const fmt=val(a,'format')||'Best structured format for the goal';
  const len=val(a,'length')||'As needed';
  const tone=val(a,'tone')||'Professional';
  const depth=val(a,'depth')||'Balanced';
  const creativity=val(a,'creativity')||'Balanced';

  const constraints=[];
  if(has(a,'constraints')) constraints.push(val(a,'constraints'));
  constraints.push((langCode==='fa'?'سطح جزئیات: ':'Detail level: ')+depth);
  constraints.push((langCode==='fa'?'طول تقریبی: ':'Approx length: ')+len);
  constraints.push((langCode==='fa'?'میزان خلاقیت: ':'Creativity: ')+creativity);

  const avoid=has(a,'avoid')?val(a,'avoid'):(langCode==='fa'?'هر چیز نامرتبط، مبهم یا کلی‌گویی':'anything irrelevant, vague, or generic');
  const askLine=a.iterate==='نه، مستقیم شروع کند'?lab.noask:lab.ask;

  const S=[];
  S.push(`# ${lab.role}`); S.push(`${lab.roleTxt} ${persona}.`); S.push('');
  S.push(`# ${lab.obj}`); S.push(goal); S.push('');
  S.push(`# ${lab.ctx}`); S.push(ctxLines.join('\n')); S.push('');
  S.push(`# ${lab.task}`); S.push(task.map(t=>'- '+t).join('\n')); S.push('');
  S.push(`# ${lab.tone}`); S.push('- '+tone); S.push('');
  S.push(`# ${lab.fmt}`); S.push('- '+fmt); S.push('');
  S.push(`# ${lab.con}`); S.push(constraints.map(c=>'- '+c).join('\n')); S.push('');
  S.push(`# ${lab.avoid}`); S.push('- '+avoid); S.push('');
  S.push(`# ${lab.qual}`); S.push('- '+lab.think); S.push('- '+askLine);

  if(pro){
    const fa = langCode==='fa';
    const sec=(h,b)=>{ S.push(''); S.push('# '+h); S.push(b); };
    if(has(a,'reasoning')) sec(fa?'شیوهٔ استدلال':'REASONING APPROACH','- '+val(a,'reasoning'));
    if(a.fewshot==='بله، الگو می‌دهم' && has(a,'fewshot_x')) sec(fa?'نمونهٔ الگو (Few-shot)':'FEW-SHOT EXAMPLE', val(a,'fewshot_x'));
    if(has(a,'edgecases')) sec(fa?'موارد خاص و استثناها':'EDGE CASES','- '+val(a,'edgecases'));
    if(has(a,'successcriteria')) sec(fa?'معیار خروجی عالی':'SUCCESS CRITERIA','- '+val(a,'successcriteria'));
    if(has(a,'variations') && val(a,'variations')!=='فقط یک نسخهٔ نهایی') sec(fa?'تعداد نسخه‌ها':'VARIATIONS','- '+val(a,'variations'));
    if(a.selfcheck && a.selfcheck.indexOf('بله')===0) sec(fa?'خودارزیابی':'SELF-EVALUATION',
      fa?'- پس از تولید، خروجی را با یک چک‌لیست کیفیت بازبینی کن و نسخهٔ نهاییِ اصلاح‌شده را ارائه بده.'
        :'- After producing the output, review it against a quality checklist and deliver a refined final version.');
  }
  S.push(''); S.push(`# ${lab.lang}`); S.push(`${lab.respond} ${lname}.`);
  return S.join('\n');
}

export function publicCategories(){ return CATEGORIES.map(c=>({n:c.n,e:c.e})); }

/* ================= RECOMMENDED AI TARGETS =================
 * Which AI tools this kind of prompt is actually meant for. Prevents the
 * "I gave an animation prompt to a code assistant and it refused" problem.
 * `tools` are ordered best-first. Names are brand names (kept as-is when the
 * surrounding UI text is translated).
 */
const TARGET_AI = {
  writing:  ['ChatGPT (GPT-4o/5)', 'Claude', 'Gemini'],
  social:   ['ChatGPT', 'Claude', 'Gemini'],
  image:    ['Midjourney', 'DALL·E 3', 'Adobe Firefly', 'Stable Diffusion', 'Leonardo AI'],
  video:    ['Sora', 'Runway (Gen-3)', 'Kling', 'Pika', 'Luma Dream Machine'],
  game:     ['ChatGPT', 'Claude', 'Midjourney'],
  code:     ['Claude', 'ChatGPT', 'GitHub Copilot', 'Cursor'],
  business: ['ChatGPT', 'Claude', 'Gemini'],
  finance:  ['ChatGPT', 'Claude', 'Gemini'],
  advice:   ['ChatGPT', 'Claude', 'Gemini'],
  health:   ['ChatGPT', 'Claude'],
  education:['ChatGPT', 'Claude', 'Gemini'],
  research: ['Claude', 'ChatGPT', 'Perplexity', 'Gemini'],
  language: ['ChatGPT', 'Claude', 'DeepL', 'Gemini'],
  design3d: ['Midjourney', 'Stable Diffusion', 'Interior AI', 'Adobe Firefly'],
  travel:   ['ChatGPT', 'Gemini', 'Perplexity'],
  food:     ['ChatGPT', 'Claude', 'Gemini'],
  general:  ['ChatGPT', 'Claude', 'Gemini'],
};

// Return the recommended AI tools for a category (best-first).
export function recommendedTargets(categoryName){
  const kind = kindOf(categoryName);
  return { kind, tools: TARGET_AI[kind] || TARGET_AI.general };
}
