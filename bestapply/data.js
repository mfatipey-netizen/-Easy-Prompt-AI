// Canadian labour-market reference data. All defaults align with Government of
// Canada NOC 2021, StatCan census metros, and CRA 2024 federal tax brackets.

window.JOBFIT_DATA = {

  // NOC 2021 job titles — top titles across TEER groups. User can still type
  // any custom title; this is a searchable datalist to reduce typing.
  jobTitles: [
    // Management (NOC 0)
    'Senior manager', 'General manager', 'Operations manager', 'Project manager',
    'Product manager', 'Program manager', 'Marketing manager', 'Sales manager',
    'HR manager', 'Finance manager', 'IT manager', 'Restaurant manager',
    'Retail store manager', 'Construction manager', 'Facilities manager',
    'Assistant store manager',
    // Business, finance, admin (NOC 1)
    'Accountant', 'Financial analyst', 'Auditor', 'Bookkeeper', 'Payroll administrator',
    'Business analyst', 'Executive assistant', 'Administrative assistant',
    'Human resources specialist', 'Recruiter', 'Marketing specialist',
    'Data analyst', 'Compliance officer', 'Insurance broker', 'Real estate agent',
    // Natural and applied sciences (NOC 2)
    'Software developer', 'Software engineer', 'Full-stack developer',
    'Front-end developer', 'Back-end developer', 'DevOps engineer',
    'Cloud engineer', 'Data engineer', 'Data scientist', 'Machine learning engineer',
    'QA engineer', 'Cybersecurity analyst', 'IT support technician',
    'Systems administrator', 'Network engineer', 'Database administrator',
    'UX designer', 'UI designer', 'Product designer',
    'Civil engineer', 'Mechanical engineer', 'Electrical engineer',
    'Chemical engineer', 'Industrial engineer', 'Environmental engineer',
    'Architect', 'Urban planner', 'Land surveyor',
    // Health (NOC 3)
    'Registered nurse', 'Licensed practical nurse', 'Nurse practitioner',
    'Physician', 'Family doctor', 'Pharmacist', 'Physiotherapist',
    'Occupational therapist', 'Dentist', 'Dental hygienist', 'Medical laboratory technologist',
    'Personal support worker', 'Home health aide', 'Paramedic',
    // Education, law, government (NOC 4)
    'Teacher', 'Early childhood educator', 'University professor',
    'Guidance counsellor', 'Lawyer', 'Paralegal', 'Notary',
    'Social worker', 'Employment counsellor', 'Immigration consultant',
    'Policy analyst', 'Librarian',
    // Art, culture, sport (NOC 5)
    'Graphic designer', 'Web designer', 'Photographer', 'Videographer',
    'Video editor', 'Content creator', 'Journalist', 'Editor',
    'Musician', 'Translator', 'Interpreter',
    // Sales and service (NOC 6)
    'Sales associate', 'Retail salesperson', 'Cashier', 'Barista',
    'Server', 'Cook', 'Chef', 'Bartender', 'Hotel front desk clerk',
    'Housekeeper', 'Security guard', 'Hairstylist',
    'Customer service representative', 'Call centre agent',
    // Trades, transport (NOC 7)
    'Electrician', 'Plumber', 'Carpenter', 'Welder', 'Automotive mechanic',
    'HVAC technician', 'Truck driver', 'Delivery driver', 'Warehouse worker',
    'Forklift operator', 'Construction labourer',
    // Manufacturing (NOC 8-9)
    'Production supervisor', 'Machine operator', 'Assembler', 'Quality control inspector',
  ],

  // Statistics Canada population centres, ordered by population (2021 census).
  canadianCities: [
    'Toronto, ON', 'Montréal, QC', 'Vancouver, BC', 'Calgary, AB', 'Edmonton, AB',
    'Ottawa, ON', 'Winnipeg, MB', 'Québec City, QC', 'Hamilton, ON', 'Kitchener-Waterloo, ON',
    'London, ON', 'Halifax, NS', 'Victoria, BC', 'Windsor, ON', 'Oshawa, ON',
    'Saskatoon, SK', 'Regina, SK', 'St. John\'s, NL', 'Sherbrooke, QC', 'Kelowna, BC',
    'Barrie, ON', 'Guelph, ON', 'Kingston, ON', 'Sudbury, ON', 'Thunder Bay, ON',
    'Trois-Rivières, QC', 'Moncton, NB', 'Saint John, NB', 'Fredericton, NB',
    'Charlottetown, PE', 'Whitehorse, YT', 'Yellowknife, NT', 'Iqaluit, NU',
    'Mississauga, ON', 'Brampton, ON', 'Markham, ON', 'Vaughan, ON', 'Richmond Hill, ON',
    'Burnaby, BC', 'Surrey, BC', 'Richmond, BC', 'Laval, QC', 'Longueuil, QC',
    'Gatineau, QC', 'Red Deer, AB', 'Lethbridge, AB', 'Medicine Hat, AB',
    'Prince George, BC', 'Nanaimo, BC', 'Abbotsford, BC',
    'Remote (anywhere in Canada)', 'Hybrid — Toronto', 'Hybrid — Vancouver', 'Hybrid — Montréal',
  ],

  // Salary bands aligned to CRA 2024 federal tax bracket thresholds so the
  // dropdown maps cleanly onto after-tax reality.
  // Bracket edges: $55,867 · $111,733 · $173,205 · $246,752.
  salaryBands: [
    { code: 'lt30',    label: 'Under $30K CAD',           median: 25000 },
    { code: '30-40',   label: '$30K – $40K CAD',          median: 35000 },
    { code: '40-55',   label: '$40K – $55K CAD',          median: 47500 },
    { code: '55-70',   label: '$55K – $70K CAD  · 1st CRA bracket', median: 62500 },
    { code: '70-85',   label: '$70K – $85K CAD',          median: 77500 },
    { code: '85-100',  label: '$85K – $100K CAD',         median: 92500 },
    { code: '100-120', label: '$100K – $120K CAD',        median: 110000 },
    { code: '120-150', label: '$120K – $150K CAD',        median: 135000 },
    { code: '150-180', label: '$150K – $180K CAD · 3rd CRA bracket', median: 165000 },
    { code: '180-220', label: '$180K – $220K CAD',        median: 200000 },
    { code: '220-250', label: '$220K – $250K CAD',        median: 235000 },
    { code: 'gt250',   label: '$250K+ CAD · top CRA bracket', median: 280000 },
  ],

  // Languages: Canadian official + top diaspora languages by census.
  languages: [
    { code: 'en', name: 'English',   native: 'English' },
    { code: 'fr', name: 'French',    native: 'Français' },
    { code: 'zh', name: 'Chinese',   native: '中文 (普通话/粤语)' },
    { code: 'pa', name: 'Punjabi',   native: 'ਪੰਜਾਬੀ' },
    { code: 'es', name: 'Spanish',   native: 'Español (incl. Mexican)' },
    { code: 'ar', name: 'Arabic',    native: 'العربية' },
    { code: 'tl', name: 'Tagalog',   native: 'Tagalog' },
    { code: 'de', name: 'German',    native: 'Deutsch' },
    { code: 'it', name: 'Italian',   native: 'Italiano' },
    { code: 'pt', name: 'Portuguese',native: 'Português' },
    { code: 'fa', name: 'Persian',   native: 'فارسی' },
    { code: 'hi', name: 'Hindi',     native: 'हिन्दी' },
    { code: 'ur', name: 'Urdu',      native: 'اردو' },
    { code: 'ko', name: 'Korean',    native: '한국어' },
    { code: 'ja', name: 'Japanese',  native: '日本語' },
    { code: 'vi', name: 'Vietnamese',native: 'Tiếng Việt' },
    { code: 'ru', name: 'Russian',   native: 'Русский' },
    { code: 'uk', name: 'Ukrainian', native: 'Українська' },
    { code: 'tr', name: 'Turkish',   native: 'Türkçe' },
    { code: 'nl', name: 'Dutch',     native: 'Nederlands' },
  ],

  langLevels: [
    { code: 'native', label: 'Native', ielts: '—' },
    { code: 'C2',     label: 'Fluent (C2)',       ielts: 'IELTS 8.0+' },
    { code: 'C1',     label: 'Advanced (C1)',     ielts: 'IELTS 7.0' },
    { code: 'B2',     label: 'Upper-int. (B2)',   ielts: 'IELTS 6.0' },
    { code: 'B1',     label: 'Intermediate (B1)', ielts: 'IELTS 5.0' },
    { code: 'A2',     label: 'Basic (A2)',        ielts: 'IELTS 4.0' },
  ],

  workPermits: [
    'Canadian citizen', 'Permanent Resident (PR)',
    'Open work permit (spouse / PGWP / IEC)',
    'Employer-specific closed work permit',
    'Post-Graduation Work Permit (PGWP)',
    'International student — study permit',
    'Bridging Open Work Permit (BOWP)',
    'Refugee / protected person',
    'Need employer sponsorship / LMIA',
    'Applying under Express Entry',
  ],

  // Common Canadian professional certifications, add-as-you-earn.
  commonCerts: [
    'PMP (Project Management Professional)',
    'CAPM', 'PRINCE2', 'Scrum Master (CSM)', 'PSM I',
    'CPA (Chartered Professional Accountant)',
    'CFA Level I', 'CFA Level II', 'CFA Level III',
    'AWS Certified Solutions Architect – Associate',
    'AWS Certified Solutions Architect – Professional',
    'Microsoft Azure Fundamentals (AZ-900)',
    'Microsoft Azure Administrator (AZ-104)',
    'Google Cloud Digital Leader', 'Google Professional Cloud Architect',
    'CompTIA A+', 'CompTIA Security+', 'CISSP', 'CEH',
    'Red Seal certification', 'IELTS General Training',
    'IELTS Academic', 'CELPIP-General',
    'P.Eng. (Professional Engineer, Canada)',
    'RN license (province-specific)', 'LPN license',
    'Real Estate License (OREA / RECO)',
    'Life Insurance License (LLQP)',
    'WHMIS', 'First Aid / CPR',
    'Six Sigma Green Belt', 'Six Sigma Black Belt',
    'ITIL v4 Foundation', 'SAFe Agilist',
  ],
};
