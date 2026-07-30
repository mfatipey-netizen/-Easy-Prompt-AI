/*!
 * EASY PROMPT AI — Prompt Engine (server-side, proprietary)
 * Copyright (c) 2026 MOHIFERI (mfatipey). All Rights Reserved.
 *
 * Confidential prompt engine. Runs only on the server so the question banks
 * and prompt-generation logic are never exposed to the browser.
 */

const O = (...a) => a;

/* ============================ CATEGORIES ============================ */
export const CATEGORIES = [
  {n:'نویسندگی و محتوا', e:'✍️'},
  {n:'نویسندگی تخصصی', e:'📝'},
  {n:'تولید محتوا', e:'🎬'},
  {n:'شبکه‌های اجتماعی', e:'📱'},
  {n:'طراحی و ساخت تصویر', e:'🎨'},
  {n:'عکاسی', e:'📷'},
  {n:'مد و فشن', e:'👗'},
  {n:'ساخت و تدوین ویدئو', e:'🎥'},
  {n:'ساخت انیمیشن', e:'🌀'},
  {n:'بازی‌سازی', e:'🎮'},
  {n:'برنامه‌نویسی', e:'💻'},
  {n:'IT و کامپیوتر', e:'🖥️'},
  {n:'کسب‌وکار و بازاریابی', e:'📈'},
  {n:'کسب درآمد', e:'💰'},
  {n:'سرمایه‌گذاری', e:'📊'},
  {n:'امور مالی', e:'🏦'},
  {n:'مشاوره', e:'🧭'},
  {n:'روانشناسی', e:'🧠'},
  {n:'پزشکی و سلامت', e:'⚕️'},
  {n:'چاقی و لاغری', e:'🥗'},
  {n:'ورزش و تناسب اندام', e:'🏋️'},
  {n:'آموزش و تدریس', e:'📚'},
  {n:'دانش‌آموزی', e:'🎒'},
  {n:'دانشجویی', e:'🎓'},
  {n:'تحقیق و پژوهش', e:'🔬'},
  {n:'زبان‌شناسی و ترجمه', e:'🗣️'},
  {n:'طراحی داخلی و خارجی', e:'🏠'},
  {n:'طراحی سازه و معماری', e:'🏗️'},
  {n:'گردشگری و سفر', e:'✈️'},
  {n:'غذا و آشپزی', e:'🍳'},
  {n:'خوردنی و نوشیدنی', e:'🍹'},
  {n:'حیوانات', e:'🐾'},
  {n:'وسیله نقلیه و تعمیرات', e:'🚗'},
  {n:'کاردستی و خلاقیت', e:'🧶'},
  {n:'ایده‌پردازی', e:'💡'},
  {n:'سرگرمی', e:'🎲'},
  {n:'سلامت روان', e:'🌿'},
  {n:'موضوع دلخواه (عمومی)', e:'⭐'},
];

/* ============================ SHARED CORE (small, high-signal) ============================ */
// Only the essentials every prompt truly needs. No filler.
const CORE = [
  {id:'goal', type:'text', text:'در یک جمله، خروجیِ نهایی که می‌خواهی چیست؟',
   hint:'روی نتیجهٔ ملموس تمرکز کن؛ چرا داری این پرامپت را می‌سازی.'},
  {id:'audience', type:'single', text:'این خروجی برای چه کسی است؟',
   options:O('عموم مردم','متخصصان','مبتدی‌ها','کودکان/نوجوانان','مشتریان بالقوه','خودم','سایر (توضیح می‌دهم)')},
  {id:'audience_x', type:'text', text:'مخاطبت را دقیق‌تر توصیف کن.', hint:'سن، سطح دانش، دغدغه…', when:a=>a.audience==='سایر (توضیح می‌دهم)'},
  {id:'tone', type:'single', text:'لحن دلخواه؟',
   options:O('حرفه‌ای و قابل‌اعتماد','گرم و صمیمی','هیجان‌انگیز و انگیزشی','علمی و دقیق','طنز و بازیگوش','لوکس و مجلل','خنثی')},
  {id:'depth', type:'single', text:'چقدر عمق لازم است؟',
   options:O('کوتاه و سرراست','متعادل و کاربردی','کامل و مفصل','بسیار عمیق و تخصصی')},
];

const CLOSERS = [
  {id:'format', type:'single', text:'خروجی در چه قالبی باشد؟',
   options:O('متن پیوسته','فهرست نکته‌ای','جدول','مرحله‌به‌مرحله','پرسش و پاسخ','قالب را خودت انتخاب کن')},
  {id:'length', type:'single', text:'حجم تقریبی خروجی؟',
   options:O('خیلی کوتاه','یک پاراگراف','چند پاراگراف','یک صفحهٔ کامل','هر چقدر لازم است')},
  {id:'creativity', type:'single', text:'چقدر خلاقیت می‌خواهی؟',
   options:O('کاملاً مطمئن و کلاسیک','متعادل','خلاقانه و جسورانه','کاملاً آزاد و تجربی')},
];

const PRO_EXTRA = [
  {id:'reasoning', type:'single', text:'روش استدلال هوش مصنوعی؟',
   options:O('مستقیم و سریع','گام‌به‌گام با استدلال','چند رویکرد را بسنجد','اول نقشه بریزد، بعد اجرا')},
  {id:'successcriteria', type:'text', text:'خروجی «عالی» از نظر تو چه ویژگی دارد؟', hint:'معیار کیفیت.'},
  {id:'variations', type:'single', text:'چند نسخهٔ متفاوت می‌خواهی؟',
   options:O('فقط یک نسخهٔ نهایی','۲ نسخه','۳ نسخه','چند گزینه با سبک‌های مختلف')},
  {id:'selfcheck', type:'single', text:'قبل از تحویل خودش را بازبینی کند؟',
   options:O('بله، با چک‌لیست کیفیت','نه')},
];

/* ============================ PER-CATEGORY BANKS ============================
 * Every category gets its OWN questions — targeted, expert-grade, and enough
 * to write a serious prompt. Order matters: most-decisive first.
 * Keep each bank to ~6–9 questions; combined with CORE+CLOSERS the user sees
 * roughly 12–17 questions total (no filler padding).
 */
const BANKS = {

'نویسندگی و محتوا':[
  {id:'wr_type', type:'single', text:'چه نوع نوشته‌ای؟',
   options:O('مقاله','پست وبلاگ','خبر','ایمیل','کپشن','متن تبلیغاتی','بیوگرافی','معرفی محصول','متن سخنرانی')},
  {id:'wr_topic', type:'text', text:'موضوع دقیق نوشته چیست؟'},
  {id:'wr_key', type:'text', text:'چه پیام کلیدی باید حتماً منتقل شود؟'},
  {id:'wr_hook', type:'single', text:'شروع متن چطور باشد؟',
   options:O('با یک سؤال','با آمار/واقعیت','با داستان کوتاه','مستقیم سر اصل مطلب','با نقل‌قول')},
  {id:'wr_cta', type:'text', text:'در پایان مخاطب چه کاری بکند؟', hint:'(اختیاری)'},
  {id:'wr_keywords', type:'text', text:'کلمات کلیدی که باید بیایند؟', hint:'(اختیاری، برای سئو)'},
  {id:'wr_seo', type:'single', text:'برای سئو بهینه شود؟', options:O('بله','نه')},
],

'نویسندگی تخصصی':[
  {id:'ws_type', type:'single', text:'چه نوع متن تخصصی؟',
   options:O('گزارش فنی','مقالهٔ علمی','وایت‌پیپر','مستندات فنی','کتابچهٔ راهنما','متن حقوقی','متن پزشکی','متن مالی')},
  {id:'ws_field', type:'text', text:'حوزهٔ تخصصی دقیقاً چیست؟'},
  {id:'ws_terms', type:'single', text:'سطح واژگان فنی؟',
   options:O('برای مخاطب عمومی توضیح داده شود','متعادل','کاملاً تخصصی')},
  {id:'ws_cite', type:'single', text:'به منبع و استناد نیاز دارد؟', options:O('بله، با ذکر منبع','بله، بدون منبع','نه')},
  {id:'ws_struct', type:'text', text:'بخش‌های اصلی متن چه باشند؟', hint:'مثلاً: چکیده، مقدمه، بحث، نتیجه‌گیری'},
  {id:'ws_constraints', type:'text', text:'محدودیت‌های حرفه‌ای یا حقوقی؟', hint:'(اختیاری)'},
],

'تولید محتوا':[
  {id:'ct_medium', type:'single', text:'محتوای چه رسانه‌ای؟',
   options:O('پست بلاگ','ویدئوی یوتیوب','ریلز/شورت','پادکست','خبرنامه','ابزار سئو','رشتهٔ پست (سریال)')},
  {id:'ct_niche', type:'text', text:'نیچ/بازار هدف چیست؟'},
  {id:'ct_goal', type:'single', text:'هدف اصلی این محتوا؟',
   options:O('آموزش','سرگرمی','فروش','برندسازی','رشد فالوور','وایرال شدن')},
  {id:'ct_pain', type:'text', text:'مخاطب چه مشکل یا سؤالی دارد که این محتوا حلش می‌کند؟'},
  {id:'ct_series', type:'single', text:'قسمتی از یک سری است یا مستقل؟',
   options:O('مستقل','سری چند قسمتی')},
  {id:'ct_length', type:'single', text:'طول محتوا؟',
   options:O('کمتر از ۱ دقیقه','۱ تا ۵ دقیقه','۵ تا ۱۵ دقیقه','بیشتر از ۱۵ دقیقه')},
  {id:'ct_style', type:'text', text:'کانال‌های موفق مشابه یا سبک خاصی مدنظرت هست؟', hint:'(اختیاری)'},
],

'شبکه‌های اجتماعی':[
  {id:'soc_platform', type:'multi', text:'برای کدام پلتفرم؟',
   options:O('اینستاگرام','لینکدین','تیک‌تاک','یوتیوب','ایکس (توییتر)','تلگرام','پینترست','فیسبوک')},
  {id:'soc_type', type:'single', text:'نوع پست؟',
   options:O('پست تک‌عکسی','کاروسل','ریلز/ویدئو','استوری','لایو','رشتهٔ توییت','مقالهٔ لینکدین')},
  {id:'soc_goal', type:'single', text:'هدف پست؟',
   options:O('افزایش تعامل','فروش','آموزش','برندسازی','رشد فالوور','وایرال شدن')},
  {id:'soc_topic', type:'text', text:'موضوع دقیق پست چیست؟'},
  {id:'soc_hook', type:'text', text:'جذاب‌ترین نکته یا هوک اولیه؟'},
  {id:'soc_cta', type:'single', text:'کال‌تواکشن پایان؟',
   options:O('کامنت بگذار','ذخیره کن','لینک بایو','پیام بده','هیچ‌کدام')},
  {id:'soc_hashtag', type:'single', text:'هشتگ و ایموجی؟',
   options:O('بله، پیشنهاد بده','فقط هشتگ فارسی','بدون هشتگ','فقط ایموجی')},
],

'طراحی و ساخت تصویر':[
  {id:'img_subject', type:'text', text:'سوژهٔ اصلی تصویر چیست؟ توصیف دقیق بده.'},
  {id:'img_style', type:'multi', text:'سبک بصری؟',
   options:O('واقع‌گرایانه (Photorealistic)','سه‌بعدی (3D Render)','مینیمال','سینمایی','نقاشی دیجیتال','آبرنگ','انیمه/کارتونی','سایبرپانک','رئال فانتزی','رترو/وینتیج','پیکسل‌آرت')},
  {id:'img_light', type:'single', text:'نورپردازی و اتمسفر؟',
   options:O('نور طلایی غروب','نور نئون شبانه','نور نرم استودیویی','نور دراماتیک و کنتراست بالا','نور طبیعی روز','مه‌آلود و مرموز','نور شمعی گرم')},
  {id:'img_palette', type:'text', text:'پالت رنگی؟', hint:'مثلاً: مشکی و طلایی، پاستل…'},
  {id:'img_composition', type:'single', text:'کمپوزیسیون؟',
   options:O('نزدیک (Close-up)','متوسط','عریض (Wide shot)','از بالا (Top-down)','از پایین (Low angle)','قرینه')},
  {id:'img_ratio', type:'single', text:'نسبت ابعاد؟',
   options:O('مربع 1:1','عمودی 9:16','افقی 16:9','سینمایی 21:9','پرتره 4:5')},
  {id:'img_detail', type:'multi', text:'جزئیات لازم؟',
   options:O('جزئیات چهرهٔ واقعی','بافت و متریال دقیق','عمق میدان (بوکه)','بازتاب و انعکاس','فضای منفی زیاد','جزئیات سطح بالا')},
  {id:'img_negative', type:'text', text:'چه چیزی حتماً در تصویر نباشد؟', hint:'(اختیاری، مثلاً: متن، واترمارک، دست‌های اضافه)'},
],

'عکاسی':[
  {id:'ph_type', type:'single', text:'نوع عکاسی؟',
   options:O('پرتره','منظره','خیابانی','محصول','معماری','مد','ورزشی','خبری','ماکرو','هوایی/پهپاد','رویداد')},
  {id:'ph_subject', type:'text', text:'سوژهٔ عکاسی را توصیف کن.'},
  {id:'ph_mood', type:'single', text:'حس و حال عکس؟',
   options:O('احساسی و صمیمی','دراماتیک','آرام و شاعرانه','مینیمال','لوکس','گزارشی و مستند')},
  {id:'ph_light', type:'single', text:'نور؟',
   options:O('طبیعی طلایی','نور نرم پنجره','فلاش استودیو','نور سخت آفتاب','نور شبانه شهری','ترکیبی')},
  {id:'ph_gear', type:'text', text:'دوربین/لنز/تنظیمات مدنظر؟', hint:'مثلاً: 50mm f/1.4، ISO 100'},
  {id:'ph_edit', type:'single', text:'سبک ادیت؟',
   options:O('طبیعی و واقعی','فیلمی/آنالوگ','مات و سرد','گرم و نوستالژیک','های‌کنتراست مدرن','سیاه‌وسفید')},
],

'مد و فشن':[
  {id:'fs_kind', type:'single', text:'هدف؟',
   options:O('ایده طراحی لباس','ست کردن استایل','فتوشوت مد','تحلیل ترند','کاتالوگ برند','لوک‌بوک')},
  {id:'fs_style', type:'multi', text:'سبک مد؟',
   options:O('اسپرت','رسمی','مینیمالیست','بوهو','استریت‌ور','های‌فشن','وینتیج','گرانج','آوانگارد','کژوال')},
  {id:'fs_season', type:'single', text:'فصل؟', options:O('بهار','تابستان','پاییز','زمستان','چهارفصل')},
  {id:'fs_gender', type:'single', text:'جنسیت؟', options:O('زنانه','مردانه','یونیسکس','کودک')},
  {id:'fs_body', type:'text', text:'نوع اندام یا مشخصات هدف؟', hint:'(اختیاری)'},
  {id:'fs_color', type:'text', text:'پالت رنگی و پارچه‌ها؟'},
  {id:'fs_brand', type:'text', text:'برند یا الهام‌بخش خاصی؟', hint:'(اختیاری)'},
],

'ساخت و تدوین ویدئو':[
  {id:'vid_type', type:'single', text:'نوع ویدئو؟',
   options:O('تبلیغاتی','آموزشی','داستانی/سینمایی','ولاگ','موشن‌گرافیک','تیزر شبکه اجتماعی','مصاحبه','معرفی محصول')},
  {id:'vid_len', type:'single', text:'مدت زمان؟',
   options:O('کمتر از ۱۵ ثانیه','۱۵ تا ۳۰ ثانیه','۳۰ تا ۶۰ ثانیه','۱ تا ۳ دقیقه','۳ تا ۱۰ دقیقه','بلندتر')},
  {id:'vid_story', type:'text', text:'ایدهٔ اصلی/داستان را در چند خط توصیف کن.'},
  {id:'vid_scenes', type:'text', text:'صحنه‌ها یا شات‌های کلیدی؟'},
  {id:'vid_mood', type:'single', text:'حال‌وهوا؟',
   options:O('پرانرژی و سریع','آرام و احساسی','مرموز و پرتعلیق','شاد و رنگارنگ','لوکس و مینیمال','حماسی')},
  {id:'vid_music', type:'single', text:'موسیقی/صداگذاری؟',
   options:O('بدون موسیقی','حماسی','لوفای/آرام','الکترونیک','گفتار (Voiceover)','خودت پیشنهاد بده')},
  {id:'vid_edit', type:'single', text:'سبک تدوین؟',
   options:O('کات سریع/ریتمیک','برش نرم و سینمایی','تک‌شات بلند','ترنزیشن خلاقانه','موشن گرافیک')},
  {id:'vid_txt', type:'single', text:'زیرنویس/نوشته روی ویدئو؟',
   options:O('بله، کامل','فقط عنوان','بدون نوشته')},
],

'ساخت انیمیشن':[
  {id:'an_style', type:'single', text:'سبک انیمیشن؟',
   options:O('دوبعدی سنتی','دوبعدی مدرن','سه‌بعدی (3D)','موشن‌گرافیک','استاپ‌موشن','انیمهٔ ژاپنی','کارتونی وارونه','واقع‌گرایانه')},
  {id:'an_story', type:'text', text:'داستان/ایدهٔ انیمیشن؟'},
  {id:'an_char', type:'text', text:'شخصیت اصلی و ظاهرش؟'},
  {id:'an_world', type:'text', text:'دنیا/محیط انیمیشن؟'},
  {id:'an_len', type:'single', text:'مدت زمان؟',
   options:O('چند ثانیه (لوپ)','۱۵–۳۰ ثانیه','۱–۳ دقیقه','بلندتر')},
  {id:'an_soft', type:'text', text:'نرم‌افزار خروجی مدنظر؟', hint:'مثلاً After Effects, Blender، (اختیاری)'},
],

'بازی‌سازی':[
  {id:'gm_type', type:'single', text:'خروجی برای چه بخشی از بازی است؟',
   options:O('ایدهٔ بازی','داستان و شخصیت','طراحی مرحله','مکانیک بازی','دیالوگ','توضیح جهان بازی','طراحی UI','بالانس/آمار')},
  {id:'gm_genre', type:'multi', text:'ژانر؟',
   options:O('اکشن','ماجراجویی','RPG','معمایی','پلتفرمر','استراتژی','شبیه‌ساز','MOBA/شوتر','کژوال','هوریوس')},
  {id:'gm_platform', type:'single', text:'پلتفرم؟',
   options:O('موبایل','کامپیوتر/کنسول','مرورگر','واقعیت مجازی','مهم نیست')},
  {id:'gm_engine', type:'text', text:'انجین بازی؟', hint:'مثلاً Unity, Unreal, Godot (اختیاری)'},
  {id:'gm_ref', type:'text', text:'بازی‌های مرجع/الهام‌بخش؟'},
  {id:'gm_scope', type:'single', text:'مقیاس بازی؟',
   options:O('مینی گیم / پروژهٔ کوچک','متوسط (اندی)','بزرگ (AAA)')},
],

'برنامه‌نویسی':[
  {id:'code_lang', type:'text', text:'زبان یا فریم‌ورک؟', hint:'مثلاً: Python، React، SQL…'},
  {id:'code_task', type:'single', text:'چه کاری باید انجام شود؟',
   options:O('نوشتن کد از صفر','رفع باگ','بهینه‌سازی/ری‌فکتور','توضیح کد','نوشتن تست','طراحی معماری','ترجمه بین زبان‌ها')},
  {id:'code_desc', type:'text', text:'دقیقاً چه چیزی باید کار کند؟ ورودی و خروجی مورد انتظار را بگو.'},
  {id:'code_env', type:'text', text:'نسخه، وابستگی یا محیط اجرا؟', hint:'مثلاً Node 20, Python 3.11'},
  {id:'code_style', type:'single', text:'سبک کد؟',
   options:O('تمیز و خوانا','بهینه از نظر سرعت','بهینه از نظر حافظه','ساده و مبتدی‌پسند','کاملاً پروداکشن')},
  {id:'code_level', type:'single', text:'سطح توضیحات همراه کد؟',
   options:O('فقط کد','کد + کامنت','کد + توضیح گام‌به‌گام')},
  {id:'code_test', type:'single', text:'تست هم می‌خواهی؟',
   options:O('بله، unit test','بله، integration test','نه')},
],

'IT و کامپیوتر':[
  {id:'it_kind', type:'single', text:'حوزهٔ IT؟',
   options:O('شبکه','سرور و دواپس','امنیت','دیتابیس','ابر (Cloud)','ویندوز/لینوکس','مجازی‌سازی','عیب‌یابی سخت‌افزار')},
  {id:'it_task', type:'text', text:'دقیقاً چه کاری لازم داری؟ مشکل یا هدف را دقیق بگو.'},
  {id:'it_stack', type:'text', text:'محیط/نسخه/ابزارها؟', hint:'مثلاً Ubuntu 22.04، AWS، Cisco…'},
  {id:'it_urgency', type:'single', text:'فوریت؟',
   options:O('فوری، سیستم خواب','بالا','معمولی','پروژهٔ بلندمدت')},
  {id:'it_out', type:'single', text:'خروجی؟',
   options:O('دستور خط فرمان','کانفیگ کامل','مستند گام‌به‌گام','چک‌لیست تشخیص و رفع')},
],

'کسب‌وکار و بازاریابی':[
  {id:'biz_type', type:'single', text:'خروجی برای چه چیزی؟',
   options:O('طرح کسب‌وکار','استراتژی بازاریابی','برنامهٔ فروش','ایده درآمدزایی','تحلیل رقبا','قیمت‌گذاری','پیشنهاد فروش (Sales Pitch)','برنامهٔ کمپین')},
  {id:'biz_product', type:'text', text:'محصول/خدمتت چیست؟'},
  {id:'biz_market', type:'text', text:'بازار هدف و موقعیت جغرافیایی؟'},
  {id:'biz_usp', type:'text', text:'مزیت رقابتی/USP؟'},
  {id:'biz_budget', type:'single', text:'بودجه/مقیاس؟',
   options:O('صفر تا کم (زیر ۱۰۰۰ دلار)','متوسط (۱۰۰۰–۱۰۰۰۰)','بالا (۱۰k+)','مهم نیست')},
  {id:'biz_channel', type:'multi', text:'کانال‌های بازاریابی؟',
   options:O('گوگل ادز','اینستاگرام/متا','سئو','ایمیل','لینکدین','تلگرام','ارجاع دهان به دهان','ترکیبی')},
  {id:'biz_kpi', type:'text', text:'KPI موفقیت؟', hint:'مثلاً CAC، LTV، نرخ تبدیل'},
],

'کسب درآمد':[
  {id:'mo_kind', type:'single', text:'چه نوع درآمدی؟',
   options:O('کار آنلاین','فریلنسری','فروش محصول','دراپ‌شیپینگ','همکاری در فروش (Affiliate)','خدمات مشاوره','ساخت محتوا و اسپانسری','سرمایه‌گذاری منفعل')},
  {id:'mo_skill', type:'text', text:'مهارت یا سرمایهٔ شروع تو چیست؟'},
  {id:'mo_time', type:'single', text:'چقدر زمان در هفته؟',
   options:O('کمتر از ۵ ساعت','۵–۱۵ ساعت','۱۵–۳۰ ساعت','تمام‌وقت')},
  {id:'mo_capital', type:'single', text:'سرمایهٔ اولیه؟',
   options:O('صفر','کمتر از ۱۰۰ دلار','۱۰۰–۱۰۰۰','۱۰۰۰+')},
  {id:'mo_goal', type:'text', text:'هدف درآمدی ماهانه؟'},
  {id:'mo_country', type:'text', text:'کشور فعالیت (برای پلتفرم مناسب)؟'},
],

'سرمایه‌گذاری':[
  {id:'inv_kind', type:'multi', text:'چه بازاری؟',
   options:O('سهام','کریپتو','فارکس','املاک','طلا','صندوق سرمایه‌گذاری','اوراق قرضه','استارتاپ')},
  {id:'inv_amount', type:'text', text:'سرمایهٔ فعلی و ارز؟'},
  {id:'inv_horizon', type:'single', text:'افق سرمایه‌گذاری؟',
   options:O('کوتاه‌مدت (زیر ۱ سال)','میان‌مدت (۱–۵ سال)','بلندمدت (۵+ سال)')},
  {id:'inv_risk', type:'single', text:'ریسک‌پذیری؟',
   options:O('محافظه‌کار','متعادل','تهاجمی')},
  {id:'inv_goal', type:'text', text:'هدف مالی؟', hint:'مثلاً بازنشستگی، خرید خانه…'},
  {id:'inv_exp', type:'single', text:'تجربه؟',
   options:O('مبتدی','متوسط','حرفه‌ای')},
],

'امور مالی':[
  {id:'fn_kind', type:'single', text:'موضوع؟',
   options:O('بودجه‌بندی شخصی','پس‌انداز','مدیریت بدهی','مالیات','بیمه','برنامهٔ بازنشستگی','آموزش مفهوم مالی')},
  {id:'fn_income', type:'text', text:'درآمد ماهانه (تقریبی) و ارز؟'},
  {id:'fn_expense', type:'text', text:'مخارج ثابت اصلی؟'},
  {id:'fn_debts', type:'text', text:'بدهی‌ها یا اقساط؟', hint:'(اختیاری)'},
  {id:'fn_family', type:'text', text:'وضعیت خانواده/تعداد افراد وابسته؟'},
  {id:'fn_goal', type:'text', text:'هدف مالی کوتاه و بلندمدت؟'},
],

'مشاوره':[
  {id:'ad_topic', type:'text', text:'موضوع مشاوره دقیقاً چیست؟'},
  {id:'ad_situation', type:'text', text:'شرایط فعلی را در چند خط تعریف کن.'},
  {id:'ad_options', type:'text', text:'چه گزینه‌هایی الان جلویت است؟', hint:'(اختیاری)'},
  {id:'ad_barrier', type:'text', text:'بزرگ‌ترین مانع یا نگرانی؟'},
  {id:'ad_style', type:'single', text:'چه نوع کمکی می‌خواهی؟',
   options:O('راهکار عملی','گوش دادن و همدلی','تحلیل موقعیت','برنامهٔ گام‌به‌گام','دیدگاه‌های مختلف')},
  {id:'ad_deadline', type:'text', text:'تا چه زمانی نیاز به تصمیم داری؟', hint:'(اختیاری)'},
],

'روانشناسی':[
  {id:'ps_topic', type:'single', text:'موضوع اصلی؟',
   options:O('اضطراب','افسردگی','عزت‌نفس','روابط','خانواده','فرزندپروری','مدیریت خشم','هدف‌گذاری','خودشناسی','فوبیا')},
  {id:'ps_context', type:'text', text:'چه اتفاقی افتاده یا چه شرایطی داری؟ (تا حدی که راحتی)'},
  {id:'ps_duration', type:'single', text:'چقدر است این وضعیت را داری؟',
   options:O('چند روز','چند هفته','چند ماه','بیش از یک سال')},
  {id:'ps_tried', type:'text', text:'قبلاً چه راه‌هایی امتحان کرده‌ای؟', hint:'(اختیاری)'},
  {id:'ps_want', type:'single', text:'چه چیزی از این مشاوره می‌خواهی؟',
   options:O('راهکار عملی روزمره','فهمیدن ریشهٔ مشکل','تمرین‌های خودیاری','دیدگاه علمی','همدلی و حمایت')},
  {id:'ps_disclaimer', type:'single', text:'می‌دانی که این جایگزین درمانگر واقعی نیست؟',
   options:O('بله می‌دانم','فقط اطلاعات آموزشی می‌خواهم')},
],

'پزشکی و سلامت':[
  {id:'md_kind', type:'single', text:'موضوع پزشکی؟',
   options:O('علائم و تشخیص افتراقی','تفسیر آزمایش','اطلاعات دارو','بیماری خاص','پیشگیری','سبک زندگی سالم','آموزش پزشکی')},
  {id:'md_symptom', type:'text', text:'علائم/سؤال دقیقاً چیست؟'},
  {id:'md_person', type:'text', text:'سن، جنس و شرایط بیمار؟'},
  {id:'md_history', type:'text', text:'سابقهٔ بیماری، داروی مصرفی یا حساسیت؟', hint:'(اختیاری)'},
  {id:'md_duration', type:'text', text:'از کی شروع شده و چقدر ادامه دارد؟'},
  {id:'md_urgency', type:'single', text:'فوریت؟',
   options:O('اورژانسی','نگران‌کننده','معمولی','فقط آموزش')},
  {id:'md_disclaimer', type:'single', text:'می‌دانی این جایگزین ویزیت پزشک نیست؟',
   options:O('بله می‌دانم','فقط اطلاعات آموزشی می‌خواهم')},
],

'چاقی و لاغری':[
  {id:'wt_goal', type:'single', text:'هدف؟',
   options:O('کاهش وزن','افزایش وزن','حفظ وزن فعلی','کاهش چربی و افزایش عضله')},
  {id:'wt_profile', type:'text', text:'سن، جنس، قد، وزن فعلی؟'},
  {id:'wt_target', type:'text', text:'وزن هدف و در چه بازهٔ زمانی؟'},
  {id:'wt_activity', type:'single', text:'میزان فعالیت روزانه؟',
   options:O('کم‌تحرک (اداری)','متوسط','فعال','خیلی فعال')},
  {id:'wt_diet', type:'text', text:'رژیم فعلی و علاقهٔ غذایی؟'},
  {id:'wt_medical', type:'text', text:'بیماری یا حساسیت غذایی؟', hint:'مثلاً دیابت، کبد چرب…'},
  {id:'wt_kitchen', type:'single', text:'زمان آشپزی؟',
   options:O('خیلی کم','متوسط','دوست دارم آشپزی کنم')},
],

'ورزش و تناسب اندام':[
  {id:'sp_goal', type:'single', text:'هدف اصلی از ورزش؟',
   options:O('عضله‌سازی','قدرت','چربی‌سوزی','استقامت (ران/کاردیو)','انعطاف‌پذیری','بهبود ظاهر عمومی','کاهش استرس','عملکرد ورزشی خاص')},
  {id:'sp_type', type:'multi', text:'نوع ورزش موردعلاقه؟',
   options:O('بدنسازی','کاردیو','یوگا','پیلاتس','کراس‌فیت','دویدن','شنا','دوچرخه','رزمی','ورزش گروهی')},
  {id:'sp_level', type:'single', text:'سطح تجربه؟',
   options:O('کاملاً مبتدی','چند ماه سابقه','۱–۳ سال','۳ سال به بالا')},
  {id:'sp_profile', type:'text', text:'سن، جنس، قد، وزن، درصد چربی (اگر بدانی)؟'},
  {id:'sp_days', type:'single', text:'چند روز در هفته می‌توانی تمرین کنی؟',
   options:O('۱–۲ روز','۳ روز','۴ روز','۵–۶ روز','هر روز')},
  {id:'sp_time', type:'single', text:'هر جلسه چقدر وقت داری؟',
   options:O('۳۰ دقیقه','۴۵ دقیقه','۶۰ دقیقه','۹۰ دقیقه یا بیشتر')},
  {id:'sp_place', type:'single', text:'محل تمرین؟',
   options:O('باشگاه کامل','باشگاه محدود','خانه با تجهیزات','خانه بدون تجهیزات','فضای باز')},
  {id:'sp_equipment', type:'text', text:'تجهیزات موجود؟', hint:'دمبل، هالتر، کش، TRX…'},
  {id:'sp_injury', type:'text', text:'مصدومیت یا محدودیت جسمی؟', hint:'(اختیاری، خیلی مهم برای امنیت)'},
  {id:'sp_diet', type:'single', text:'آیا برنامهٔ تغذیه هم می‌خواهی؟',
   options:O('بله، همراه با تمرین','نه، فقط برنامهٔ تمرین')},
],

'آموزش و تدریس':[
  {id:'ed_subject', type:'text', text:'موضوع درس/آموزش دقیقاً چیست؟'},
  {id:'ed_level', type:'single', text:'سطح یادگیرنده؟',
   options:O('کاملاً مبتدی','متوسط','پیشرفته','دانش‌آموز مدرسه','دانشجو','بزرگسال')},
  {id:'ed_style', type:'single', text:'روش تدریس دلخواه؟',
   options:O('با مثال‌های ساده','گام‌به‌گام','با تمرین و آزمون','با تشبیه و استعاره','خلاصه و سریع','پروژه‌محور')},
  {id:'ed_out', type:'single', text:'خروجی آموزشی؟',
   options:O('درسنامه','خلاصهٔ درس','سؤالات تمرینی','فلش‌کارت','برنامهٔ مطالعه','ویدئوی آموزشی (متن)','کوییز')},
  {id:'ed_time', type:'single', text:'مدت جلسه/یادگیری؟',
   options:O('۱۵ دقیقه','۳۰ دقیقه','۱ ساعت','۱ جلسهٔ کامل','یک دوره چند‌هفته‌ای')},
  {id:'ed_prereq', type:'text', text:'پیش‌نیازها یا آنچه یادگیرنده الان می‌داند؟'},
],

'دانش‌آموزی':[
  {id:'st_grade', type:'single', text:'پایهٔ تحصیلی؟',
   options:O('ابتدایی','متوسطه اول','متوسطه دوم','پیش‌دانشگاهی/کنکور')},
  {id:'st_subject', type:'text', text:'درس یا موضوع؟'},
  {id:'st_task', type:'single', text:'چه کمکی می‌خواهی؟',
   options:O('توضیح مفهوم','حل تمرین','خلاصهٔ درس','نکات کلیدی','نمونه سؤال امتحان','برنامهٔ مطالعه','تحقیق کلاسی')},
  {id:'st_book', type:'text', text:'کتاب/فصل خاصی هست؟', hint:'(اختیاری)'},
  {id:'st_lang', type:'single', text:'زبان توضیحات؟',
   options:O('فارسی ساده','فارسی رسمی','دوزبانه با انگلیسی')},
],

'دانشجویی':[
  {id:'un_field', type:'text', text:'رشته و مقطع؟'},
  {id:'un_task', type:'single', text:'چه کاری می‌خواهی؟',
   options:O('نوشتن پایان‌نامه/تز','پروپوزال','مقاله علمی','خلاصهٔ درس','ارائه کلاسی','پروژه','تمرین/حل مسئله','متن انگلیسی برای مجله')},
  {id:'un_topic', type:'text', text:'موضوع دقیق؟'},
  {id:'un_scope', type:'text', text:'دامنه و طول؟', hint:'مثلاً ۲۰ صفحه، ۵۰۰ کلمه…'},
  {id:'un_source', type:'single', text:'به منبع علمی نیاز است؟',
   options:O('بله، با ذکر رفرنس','بله، بدون رفرنس','نه')},
  {id:'un_style', type:'single', text:'سبک ارجاع‌دهی؟',
   options:O('APA','IEEE','Vancouver','Chicago','اهمیت ندارد')},
],

'تحقیق و پژوهش':[
  {id:'rs_type', type:'single', text:'نوع کار پژوهشی؟',
   options:O('مرور ادبیات','تحلیل داده','فرضیه‌سازی','خلاصهٔ مقاله','روش‌شناسی','نقد علمی','مصاحبه/پرسشنامه')},
  {id:'rs_field', type:'text', text:'رشته یا حوزهٔ دقیق؟'},
  {id:'rs_question', type:'text', text:'سؤال پژوهشی اصلی؟'},
  {id:'rs_data', type:'text', text:'دادهٔ در دسترس (اگر هست)؟', hint:'(اختیاری)'},
  {id:'rs_method', type:'single', text:'روش‌شناسی؟',
   options:O('کیفی','کمی','ترکیبی','مروری')},
  {id:'rs_cite', type:'single', text:'به منبع و استناد نیاز؟',
   options:O('بله، با ذکر منبع','نه')},
],

'زبان‌شناسی و ترجمه':[
  {id:'lg_task', type:'single', text:'چه کاری لازم داری؟',
   options:O('ترجمه','ویرایش و روان‌سازی','یادگیری زبان','تصحیح گرامر','تبدیل لحن','خلاصه‌سازی','رونویسی')},
  {id:'lg_from', type:'text', text:'از چه زبانی؟'},
  {id:'lg_to', type:'text', text:'به چه زبانی؟'},
  {id:'lg_context', type:'single', text:'زمینهٔ متن؟',
   options:O('عمومی','ادبی','فنی/تخصصی','رسمی/حقوقی','بازاریابی','آکادمیک','گفتگویی')},
  {id:'lg_style', type:'single', text:'وفاداری یا روانی؟',
   options:O('وفادار به متن اصلی','روان و بومی‌سازی‌شده','متعادل')},
],

'طراحی داخلی و خارجی':[
  {id:'d3_space', type:'single', text:'چه فضایی؟',
   options:O('نشیمن','آشپزخانه','اتاق‌خواب','حمام','دفتر کار','فضای تجاری','نمای بیرونی خانه','حیاط/باغ','لابی','رستوران/کافه')},
  {id:'d3_size', type:'text', text:'ابعاد فضا (اگر می‌دانی)؟'},
  {id:'d3_style', type:'multi', text:'سبک طراحی؟',
   options:O('مینیمال مدرن','کلاسیک','صنعتی (Industrial)','اسکاندیناوی','لوکس','ارگانیک/طبیعی','فوتوریستیک','ایرانی/سنتی','ژاپاندی','بوهو')},
  {id:'d3_color', type:'text', text:'پالت رنگ و متریال ترجیحی؟'},
  {id:'d3_light', type:'single', text:'نورپردازی؟',
   options:O('نور طبیعی زیاد','نور گرم دنج','نور نئونی مدرن','ترکیبی')},
  {id:'d3_budget', type:'single', text:'بودجه؟',
   options:O('اقتصادی','متوسط','لوکس','بدون محدودیت')},
  {id:'d3_family', type:'text', text:'کاربران فضا؟', hint:'مثلاً خانوادهٔ ۴ نفره با کودک'},
],

'طراحی سازه و معماری':[
  {id:'ar_type', type:'single', text:'نوع پروژه؟',
   options:O('ویلا','آپارتمان','برج مسکونی','ساختمان اداری','مرکز تجاری','مسجد','مدرسه','هتل','بازسازی')},
  {id:'ar_area', type:'text', text:'متراژ زمین و کل بنا؟'},
  {id:'ar_floors', type:'single', text:'تعداد طبقات؟',
   options:O('۱ طبقه','۲ طبقه','۳–۴ طبقه','۵–۱۰','بیشتر از ۱۰')},
  {id:'ar_style', type:'multi', text:'سبک معماری؟',
   options:O('مدرن','معاصر','مینیمال','کلاسیک','ایرانی','نئوکلاسیک','های‌تک','پایدار/سبز','پارامتریک')},
  {id:'ar_climate', type:'text', text:'اقلیم و شهر؟'},
  {id:'ar_regs', type:'text', text:'ضوابط شهرداری/محدودیت‌ها؟', hint:'(اختیاری)'},
  {id:'ar_out', type:'single', text:'خروجی؟',
   options:O('کانسپت اولیه','پلان معماری','نمای بیرونی','رندر داخلی','دفترچهٔ محاسبات')},
],

'گردشگری و سفر':[
  {id:'tr_dest', type:'text', text:'مقصد یا نوع سفر (داخلی/خارجی)؟'},
  {id:'tr_from', type:'text', text:'مبدأ و کشور شما؟'},
  {id:'tr_days', type:'single', text:'مدت سفر؟',
   options:O('۱–۲ روز','۳–۵ روز','یک هفته','۱۰–۱۴ روز','بیشتر')},
  {id:'tr_style', type:'single', text:'سبک سفر؟',
   options:O('اقتصادی','لوکس','ماجراجویانه','فرهنگی/تاریخی','استراحت و آرامش','خانوادگی','ماه‌عسل','کوله‌گردی')},
  {id:'tr_budget', type:'text', text:'بودجه (بدون بلیط پرواز)؟'},
  {id:'tr_season', type:'text', text:'زمان سفر (فصل/ماه)؟'},
  {id:'tr_people', type:'single', text:'تعداد نفرات؟',
   options:O('تنها','دو نفر','خانواده با کودک','گروه دوستان')},
  {id:'tr_interest', type:'multi', text:'علاقه‌مندی‌ها؟',
   options:O('طبیعت','تاریخ','غذا','خرید','هنر','ورزش','شب‌گردی','دیدنی‌های معروف','مسیرهای کم‌کشف‌شده')},
],

'غذا و آشپزی':[
  {id:'fd_type', type:'single', text:'چه می‌خواهی؟',
   options:O('دستور پخت یک غذای خاص','ایده منو','برنامهٔ غذایی هفتگی','ترفند آشپزی','جایگزین سالم','دسر','خمیر و نان')},
  {id:'fd_dish', type:'text', text:'اسم غذا یا مواد اصلی موجود؟'},
  {id:'fd_cuisine', type:'single', text:'سبک آشپزی؟',
   options:O('ایرانی','ایتالیایی','ژاپنی','چینی','هندی','ترکی','مکزیکی','فرانسوی','فیوژن','مهم نیست')},
  {id:'fd_diet', type:'multi', text:'رژیم غذایی؟',
   options:O('گیاه‌خواری','وگان','کتوژنیک','بدون گلوتن','بدون لاکتوز','کم‌کالری','دیابتی','هیچ‌کدام')},
  {id:'fd_time', type:'single', text:'زمان/سختی؟',
   options:O('زیر ۱۵ دقیقه','۱۵–۳۰ دقیقه','۳۰–۶۰ دقیقه','بیش از ۱ ساعت','حرفه‌ای')},
  {id:'fd_serve', type:'single', text:'برای چند نفر؟',
   options:O('۱','۲','۳–۴','۵ به بالا')},
  {id:'fd_note', type:'text', text:'مواد اولیهٔ موجود در آشپزخانه؟', hint:'(اختیاری)'},
],

'خوردنی و نوشیدنی':[
  {id:'dr_kind', type:'single', text:'چه نوع؟',
   options:O('نوشیدنی گرم','نوشیدنی سرد','اسموتی','آب‌میوه','ماکتیل (بدون الکل)','دم‌نوش','قهوه','چای','دسر نوشیدنی')},
  {id:'dr_style', type:'text', text:'حس و طعم دلخواه؟', hint:'مثلاً شکلاتی، ترش، تازه…'},
  {id:'dr_ing', type:'text', text:'مواد اولیه یا محدودیت؟'},
  {id:'dr_health', type:'single', text:'ملاحظات سلامتی؟',
   options:O('کم‌قند','بدون شکر','پروتئینی','انرژی‌زا','بدون کافئین','مهم نیست')},
  {id:'dr_serve', type:'single', text:'مناسبت؟',
   options:O('صبحانه','بعد از تمرین','قرار عاشقانه','مهمانی','تابستان گرم','زمستان سرد','هر زمان')},
],

'حیوانات':[
  {id:'pt_animal', type:'text', text:'چه حیوانی؟', hint:'مثلاً سگ گلدن ۲ ساله، گربهٔ پرشین، طوطی کوکاتیل'},
  {id:'pt_topic', type:'single', text:'موضوع؟',
   options:O('تغذیه','آموزش رفتار','بیماری/علائم','بهداشت و مراقبت','بازی و ورزش','خرید لوازم','پرورش و تولیدمثل','شناخت نژاد')},
  {id:'pt_context', type:'text', text:'شرایط زندگی و سؤال دقیقت؟'},
  {id:'pt_urgency', type:'single', text:'فوریت؟',
   options:O('اورژانس دامپزشکی','نگران‌کننده','معمولی','فقط آموزش')},
],

'وسیله نقلیه و تعمیرات':[
  {id:'ca_vehicle', type:'text', text:'وسیله؟ (برند، مدل، سال)', hint:'مثلاً پژو ۲۰۶ مدل ۹۵'},
  {id:'ca_topic', type:'single', text:'موضوع؟',
   options:O('عیب‌یابی','تعمیر','سرویس دوره‌ای','خرید/فروش','مقایسه با خودروی دیگر','ارتقا/تیونینگ','تصادف و بیمه')},
  {id:'ca_symptom', type:'text', text:'علائم یا سؤال دقیقاً چیست؟'},
  {id:'ca_history', type:'text', text:'کارکرد، سرویس‌های قبلی، تصادف؟', hint:'(اختیاری)'},
  {id:'ca_budget', type:'text', text:'بودجهٔ تعمیر/خرید؟', hint:'(اختیاری)'},
],

'کاردستی و خلاقیت':[
  {id:'cr_kind', type:'single', text:'نوع کاردستی؟',
   options:O('کاغذی/اوریگامی','چوبی','فلزی','خیاطی/بافتنی','سرامیک/سفال','نقاشی/طراحی','مجسمه','زیورآلات','دکور خانه','هدیه')},
  {id:'cr_purpose', type:'text', text:'هدف یا مناسبت؟'},
  {id:'cr_level', type:'single', text:'سطح مهارت؟',
   options:O('مبتدی','متوسط','حرفه‌ای')},
  {id:'cr_mats', type:'text', text:'مواد در دسترس؟'},
  {id:'cr_time', type:'single', text:'زمان در دسترس؟',
   options:O('کمتر از ۱ ساعت','چند ساعت','یک روز','چند روز/هفته')},
],

'ایده‌پردازی':[
  {id:'id_field', type:'text', text:'حوزهٔ ایده؟', hint:'کسب‌وکار، محتوا، هدیه، اسم، شعار…'},
  {id:'id_goal', type:'text', text:'دقیقاً می‌خواهی چه چیزی حل شود؟'},
  {id:'id_count', type:'single', text:'چند ایده می‌خواهی؟',
   options:O('۳','۵','۱۰','۲۰+ (طوفان فکری)')},
  {id:'id_criteria', type:'text', text:'معیار «ایدهٔ خوب» برای تو چیست؟'},
  {id:'id_bad', type:'text', text:'چه ایده‌هایی قبلاً به ذهنت رسیده و کنار گذاشته‌ای؟', hint:'(اختیاری، تا تکرار نشود)'},
  {id:'id_wild', type:'single', text:'چقدر جسورانه؟',
   options:O('عملی و کم‌ریسک','متعادل','کاملاً جسورانه و خارج از قاب')},
],

'سرگرمی':[
  {id:'en_kind', type:'single', text:'نوع سرگرمی؟',
   options:O('معرفی فیلم/سریال','بازی گروهی','معما و چیستان','جوک/لطیفه','داستان کوتاه','چالش و بازی زبانی','فعالیت خانوادگی')},
  {id:'en_who', type:'single', text:'برای چه کسی؟',
   options:O('خودم','دوستان','خانواده','کودکان','مهمانی')},
  {id:'en_time', type:'single', text:'زمان در دسترس؟',
   options:O('چند دقیقه','نیم ساعت','یک ساعت','یک بعدازظهر')},
  {id:'en_taste', type:'text', text:'علاقه یا سبک؟'},
],

'سلامت روان':[
  {id:'mh_topic', type:'single', text:'موضوع؟',
   options:O('استرس و اضطراب','خواب','خستگی مزمن','تمرکز','عزت‌نفس','روابط','فرسودگی شغلی','عادت‌سازی')},
  {id:'mh_situation', type:'text', text:'شرایط فعلی را در چند خط بگو.'},
  {id:'mh_duration', type:'single', text:'چقدر است این‌طوری هستی؟',
   options:O('چند روز','چند هفته','چند ماه','بیش از یک سال')},
  {id:'mh_want', type:'single', text:'چه چیزی از این کمک می‌خواهی؟',
   options:O('راهکار عملی روزمره','تمرین ذهنی/تنفس','تحلیل ریشه','برنامهٔ گام‌به‌گام','همدلی')},
  {id:'mh_disclaimer', type:'single', text:'می‌دانی جایگزین درمانگر نیست؟',
   options:O('بله می‌دانم','فقط اطلاعات آموزشی')},
],

'موضوع دلخواه (عمومی)':[
  {id:'gn_topic', type:'text', text:'موضوع کلی چیست؟'},
  {id:'gn_use', type:'text', text:'این خروجی را کجا و چطور استفاده می‌کنی؟'},
  {id:'gn_must', type:'text', text:'مهم‌ترین نکته که حتماً باید رعایت شود؟'},
  {id:'gn_avoid', type:'text', text:'چه چیزی نباید در خروجی باشد؟', hint:'(اختیاری)'},
  {id:'gn_ref', type:'text', text:'مثال یا مرجعی که حس آن را دوست داری؟', hint:'(اختیاری)'},
],

};

/* ============================ FLOW ============================ */

function bankFor(categoryName){
  return BANKS[categoryName] || BANKS['موضوع دلخواه (عمومی)'];
}

// Build the ordered pool of questions the user will actually see.
function buildPool(categoryName, pro){
  const domain = bankFor(categoryName);
  const pool = [];
  // 1) Goal first — always the anchor.
  pool.push(CORE[0]);
  // 2) All category-specific questions (the meaty part).
  domain.forEach(q => pool.push(q));
  // 3) The rest of core (audience/tone/depth).
  for(let i = 1; i < CORE.length; i++) pool.push(CORE[i]);
  // 4) Closers (format/length/creativity).
  CLOSERS.forEach(q => pool.push(q));
  // 5) Pro extras only for Pro users.
  if(pro) PRO_EXTRA.forEach(q => pool.push(q));
  return pool;
}

// Cap the interview at the natural number of questions (no filler padding).
export function targetFor(categoryName, pro){
  // Recompute so free/pro totals match what the user actually gets.
  return buildPool(categoryName, pro).length;
}

// Stateless: recompute the visible ordered list from answers.
function visibleList(categoryName, answers, pro){
  const pool = buildPool(categoryName, pro);
  const out = [];
  for(const q of pool){
    if(q.when && !q.when(answers)) continue;
    out.push(q);
  }
  return out;
}

// Public: return next question or {done:true}
export function nextQuestion(categoryName, answers, pro){
  const list = visibleList(categoryName, answers, pro);
  const total = list.length;
  for(let i = 0; i < list.length; i++){
    const q = list[i];
    if(!(q.id in answers)){
      return { done:false, index:i+1, total, question: publicQ(q) };
    }
  }
  return { done:true, total, answered:list.length };
}

function publicQ(q){
  return { id:q.id, type:q.type, text:q.text, hint:q.hint||'', options:q.options||null };
}

/* ============================ PROMPT BUILDER ============================ */
const LABELS = {
  en:{role:'ROLE',obj:'OBJECTIVE',ctx:'CONTEXT',task:'TASK & REQUIREMENTS',con:'CONSTRAINTS',avoid:'AVOID',fmt:'OUTPUT FORMAT',tone:'TONE & STYLE',qual:'QUALITY BAR',lang:'LANGUAGE',
    roleTxt:'You are a world-class expert. Adopt the persona of', respond:'Write your entire response in',
    think:'Think step by step and prioritize accuracy, usefulness, and clarity.',
    ask:'If any requirement is ambiguous, ask a brief clarifying question before you begin.',
    best:'a top senior specialist in this exact field'},
  fa:{role:'نقش',obj:'هدف',ctx:'زمینه و اطلاعات',task:'وظیفه و خواسته‌ها',con:'محدودیت‌ها',avoid:'از این‌ها پرهیز کن',fmt:'قالب خروجی',tone:'لحن و سبک',qual:'استاندارد کیفیت',lang:'زبان',
    roleTxt:'تو یک متخصص جهانی‌تراز هستی. نقش این فرد را بازی کن:', respond:'کل پاسخ را به این زبان بنویس:',
    think:'گام‌به‌گام فکر کن و دقت، کاربردی بودن و شفافیت را در اولویت بگذار.',
    ask:'اگر بخشی از خواسته مبهم بود، قبل از شروع یک سؤال کوتاه بپرس.',
    best:'یک متخصص ارشد و درجه‌یک در همین حوزه'},
  ar:{role:'الدور',obj:'الهدف',ctx:'السياق',task:'المهمة والمتطلبات',con:'القيود',avoid:'تجنب',fmt:'صيغة المخرجات',tone:'الأسلوب والنبرة',qual:'معيار الجودة',lang:'اللغة',
    roleTxt:'أنت خبير عالمي المستوى. تقمّص شخصية', respond:'اكتب ردك بالكامل بهذه اللغة:',
    think:'فكّر خطوة بخطوة وأعطِ الأولوية للدقة والفائدة والوضوح.',
    ask:'إذا كان أي متطلب غامضًا، اطرح سؤالاً توضيحياً موجزاً قبل البدء.',
    best:'خبير أول متخصص في هذا المجال بالتحديد'},
};
const L = c => LABELS[c] || LABELS.en;
const LANG_NAME = {fa:'Persian (فارسی)',en:'English',ar:'Arabic',tr:'Turkish',fr:'French',de:'German',es:'Spanish',it:'Italian',ru:'Russian',zh:'Chinese',ja:'Japanese',hi:'Hindi',pt:'Portuguese'};
const langName = c => LANG_NAME[c] || c;

const val = (answers,id) => { const v=answers[id]; if(Array.isArray(v)) return v.join('، '); return (v||'').toString().trim(); };
const has = (answers,id) => val(answers,id).length>0;

export function generatePrompt(categoryName, answers, langCode, pro){
  const cat = CATEGORIES.find(c=>c.n===categoryName) || {n:categoryName};
  const lab = L(langCode), lname = langName(langCode);
  const a = answers;

  const goal = has(a,'goal') ? val(a,'goal') : cat.n;
  const audience = a.audience==='سایر (توضیح می‌دهم)' ? val(a,'audience_x') : (val(a,'audience') || 'general audience');

  const skip = new Set(['goal','audience','audience_x','tone','depth','reasoning','successcriteria','variations','selfcheck']);
  const list = visibleList(categoryName, answers, pro);
  const ctxLines = ['• ' + (langCode==='fa' ? 'مخاطب' : 'Audience') + ': ' + audience];
  for(const q of list){
    if(skip.has(q.id)) continue;
    if(has(a, q.id)) ctxLines.push('• ' + q.text.replace(/[؟?]/g,'') + ': ' + val(a, q.id));
  }

  const format = val(a,'format') || 'Best structured format for the goal';
  const length = val(a,'length') || 'As needed';
  const tone = val(a,'tone') || 'Professional';
  const depth = val(a,'depth') || 'Balanced';
  const creativity = val(a,'creativity') || 'Balanced';

  const constraints = [];
  constraints.push((langCode==='fa'?'سطح جزئیات: ':'Detail level: ') + depth);
  constraints.push((langCode==='fa'?'طول تقریبی: ':'Approx length: ') + length);
  constraints.push((langCode==='fa'?'میزان خلاقیت: ':'Creativity: ') + creativity);

  const avoid = langCode==='fa' ? 'هر چیز نامرتبط، مبهم یا کلی‌گویی' : 'anything irrelevant, vague, or generic';
  const persona = lab.best + ' (' + cat.n + ')';

  const S = [];
  S.push(`# ${lab.role}`); S.push(`${lab.roleTxt} ${persona}.`); S.push('');
  S.push(`# ${lab.obj}`); S.push(goal); S.push('');
  S.push(`# ${lab.ctx}`); S.push(ctxLines.join('\n')); S.push('');
  S.push(`# ${lab.task}`); S.push('- ' + (langCode==='fa'?'خواستهٔ اصلی: ':'Primary request: ') + goal); S.push('');
  S.push(`# ${lab.tone}`); S.push('- ' + tone); S.push('');
  S.push(`# ${lab.fmt}`); S.push('- ' + format); S.push('');
  S.push(`# ${lab.con}`); S.push(constraints.map(c=>'- '+c).join('\n')); S.push('');
  S.push(`# ${lab.avoid}`); S.push('- ' + avoid); S.push('');
  S.push(`# ${lab.qual}`); S.push('- ' + lab.think); S.push('- ' + lab.ask);

  if(pro){
    const fa = langCode==='fa';
    const sec = (h, b) => { S.push(''); S.push('# ' + h); S.push(b); };
    if(has(a,'reasoning')) sec(fa?'شیوهٔ استدلال':'REASONING APPROACH', '- ' + val(a,'reasoning'));
    if(has(a,'successcriteria')) sec(fa?'معیار خروجی عالی':'SUCCESS CRITERIA', '- ' + val(a,'successcriteria'));
    if(has(a,'variations') && val(a,'variations') !== 'فقط یک نسخهٔ نهایی') sec(fa?'تعداد نسخه‌ها':'VARIATIONS', '- ' + val(a,'variations'));
    if(a.selfcheck && a.selfcheck.indexOf('بله')===0) sec(fa?'خودارزیابی':'SELF-EVALUATION',
      fa?'- پس از تولید، خروجی را با یک چک‌لیست کیفیت بازبینی کن و نسخهٔ نهاییِ اصلاح‌شده را ارائه بده.'
        :'- After producing the output, review it against a quality checklist and deliver a refined final version.');
  }

  S.push(''); S.push(`# ${lab.lang}`); S.push(`${lab.respond} ${lname}.`);
  return S.join('\n');
}

export function publicCategories(){ return CATEGORIES.map(c=>({n:c.n,e:c.e})); }

/* ================= RECOMMENDED AI TARGETS ================= */
const CAT_TARGETS = {
  'طراحی و ساخت تصویر': ['Midjourney','DALL·E 3','Adobe Firefly','Stable Diffusion','Leonardo AI'],
  'عکاسی': ['Midjourney','Adobe Firefly','DALL·E 3'],
  'مد و فشن': ['Midjourney','DALL·E 3','Adobe Firefly'],
  'ساخت و تدوین ویدئو': ['Sora','Runway (Gen-3)','Kling','Pika','Luma Dream Machine'],
  'ساخت انیمیشن': ['Runway','Sora','Kling','Pika'],
  'برنامه‌نویسی': ['Claude','ChatGPT','GitHub Copilot','Cursor'],
  'IT و کامپیوتر': ['Claude','ChatGPT','Gemini'],
  'تحقیق و پژوهش': ['Claude','ChatGPT','Perplexity','Gemini'],
  'زبان‌شناسی و ترجمه': ['ChatGPT','Claude','DeepL','Gemini'],
  'طراحی داخلی و خارجی': ['Midjourney','Stable Diffusion','Interior AI','Adobe Firefly'],
  'طراحی سازه و معماری': ['Midjourney','Stable Diffusion','Interior AI'],
  'بازی‌سازی': ['ChatGPT','Claude','Midjourney'],
  'گردشگری و سفر': ['ChatGPT','Gemini','Perplexity'],
};
const DEFAULT_TARGETS = ['ChatGPT','Claude','Gemini'];

export function recommendedTargets(categoryName){
  return { kind: categoryName, tools: CAT_TARGETS[categoryName] || DEFAULT_TARGETS };
}
