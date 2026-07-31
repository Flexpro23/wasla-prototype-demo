/* Wasla V2 demo database — replace with API later. All numbers reconcile. */
window.WASLA_DB = {
  demoFlags: { sukkarKey: "wasla_demo_sukkar_state" },
  account: {
    company: "Tala Hospitality Group", companyAr: "مجموعة تالا للضيافة",
    owner: "Yara Nassar", ownerAr: "يارا نصار", initials: "YN",
    plan: "Growth", cardQuota: 10, cardsUsed: 5,
    broadcastQuota: 10, broadcastsUsed: 6,
    members: 3616, passes: 3204, stampsToday: 214, redeemedWeek: 41,
    memberDelta: "+128 this week", renewal: "12 Aug 2026",
    branches: ["Rainbow St", "Swefieh", "Abdali Mall"]
  },
  cardExtras: {
    daraj: {
      funnel: { scans: 402, stamps: 388, ready: 23, redeemed: 41 },
      retention: [100, 74, 58, 49],
      branches: [["Rainbow St", 61], ["Swefieh", 24], ["Abdali Mall", 15]],
      hours: [4, 9, 18, 26, 22, 14, 9, 6, 8, 12, 19, 27, 31, 24, 12],
      top: ["Dima Arafat", "Sara Al-Amin", "Noor Shami"],
      insight: "Fridays after the double-stamp broadcast are the busiest hours of the week — 61% of scans happen on Rainbow St."
    },
    layl: { funnel: { scans: 113, stamps: 0, ready: 9, redeemed: 6 }, retention: [100, 81, 70, 66], branches: [["Abdali Mall", 100]], hours: [0, 0, 0, 0, 0, 0, 2, 4, 6, 9, 14, 22, 26, 19, 11], top: ["Zaid Barakat", "Lina Haddad", "Rania Qasem"], insight: "Royal members visit 3.4× more than Silver — the tier ladder is working." },
    zaytoun: { funnel: { scans: 85, stamps: 0, ready: 0, redeemed: 12 }, retention: [100, 68, 51, 40], branches: [["Swefieh", 100]], hours: [2, 5, 9, 16, 21, 14, 8, 5, 7, 11, 18, 24, 17, 9, 4], top: ["Khaled Mansour", "Dana Tahboub", "Lama Saadeh"], insight: "Paused 12 days — JOD 412 of balances stay redeemable, and 9 members asked when you reopen." }
  },
  memberTimelines: {
    "Sara Al-Amin": [
      ["Today 08:41", "Stamp 6 of 8 · Rainbow St · by Ahmad", "earn"],
      ["Tue 08:37", "Stamp 5 of 8 · Rainbow St", "earn"],
      ["Jul 18", "Redeemed: free flat white — card reset", "reward"],
      ["Jul 02", "Birthday gift landed — free dessert, used same day", "gift"],
      ["Mar 04", "Joined from the counter QR · Rainbow St", "join"]
    ],
    "Noor Shami": [
      ["Today 09:12", "Card full — 8 of 8, reward ready", "reward"],
      ["Mon 17:20", "Stamp 7 of 8 · Swefieh", "earn"],
      ["Feb 11", "Joined from a friend's referral link", "join"]
    ]
  },
  signup: {
    url: "wasla.app/j/daraj",
    poster: { line: "Your 8th coffee is free.", lineAr: "قهوتك الثامنة علينا", sub: "Scan, tap, done — the card lives in your wallet. No app.", subAr: "امسح الرمز وخلاص — البطاقة بمحفظتك. بدون تطبيق" },
    joins: { counter: 68, poster: 24, link: 8 }
  },
  cards: [
    { id:"daraj", name:"Daraj Coffee", ar:"قهوة الدرج", type:"stamps", state:"live",
      color:"#1E5C43", color2:"#154232", initial:"D", stampStyle:"coffee",
      tagline:"Buy 7, the 8th is on us", taglineAr:"اشترِ ٧ والثامن علينا",
      members:1841, passes:1702, weekActivity:[38,52,44,61,58,72,66],
      stat1:{label:"Stamps today",v:"146"}, stat2:{label:"Rewards ready",v:"23"},
      goal:8, reward:"Free drink of your choice", branch:"Rainbow St" },
    { id:"layl", name:"Layl Lounge", ar:"ليل لاونج", type:"vip", state:"live",
      color:"#1B2440", color2:"#111730", initial:"L", gold:"#E8B824",
      tagline:"Three tiers, real perks", taglineAr:"ثلاث فئات ومزايا حقيقية",
      members:412, passes:398, weekActivity:[12,9,14,11,19,26,22],
      stat1:{label:"Gold members",v:"57"}, stat2:{label:"Visits this week",v:"113"},
      goal:0, reward:"Gold: skip the line + 15%", branch:"Abdali Mall" },
    { id:"zaytoun", name:"Zaytoun Kitchen", ar:"مطبخ زيتون", type:"cashback", state:"paused",
      color:"#5C6B2F", color2:"#454f24", initial:"Z",
      tagline:"5% back on every bill", taglineAr:"٥٪ كاش باك على كل فاتورة",
      members:1129, passes:918, weekActivity:[41,44,0,0,0,0,0],
      stat1:{label:"Wallet balance out",v:"JOD 412"}, stat2:{label:"Paused",v:"12 days"},
      goal:0, reward:"5% back, redeem from JOD 2", branch:"Swefieh",
      note:"Paused for renovation — balances stay redeemable." },
    { id:"sukkar", name:"Sukkar Bakery", ar:"مخبز سكر", type:"points", state:"review",
      color:"#B14A32", color2:"#8f3a27", initial:"S",
      tagline:"Every JOD = 10 points", taglineAr:"كل دينار = ١٠ نقاط",
      members:234, passes:0, weekActivity:[0,0,0,0,0,0,0],
      stat1:{label:"Submitted",v:"Yesterday"}, stat2:{label:"Reviewer",v:"Wasla · Omar"},
      goal:0, reward:"500 pts → dozen ka'ak", branch:"Rainbow St" },
    { id:"ghaim", name:"Ghaim Studio", ar:"استوديو غيم", type:"membership", state:"draft",
      color:"#4E6E8E", color2:"#3a5570", initial:"G",
      tagline:"Monthly access pass", taglineAr:"اشتراك شهري",
      members:0, passes:0, weekActivity:[0,0,0,0,0,0,0],
      stat1:{label:"Last edited",v:"2 days ago"}, stat2:{label:"Step",v:"Configure"},
      goal:0, reward:"Unlimited classes", branch:"Swefieh" }
  ],
  types: [
    { id:"stamps", name:"Stamp Card", ar:"بطاقة الأختام", hero:"stamps",
      one:"Buy X, get one free — the classic.",
      what:"A digital punch card. Every visit adds a stamp; a full card becomes a reward.",
      how:"Staff scan the customer's pass and tap once. The stamp lands on the pass instantly.",
      good:"Coffee, bakeries, car wash — frequent small purchases." },
    { id:"cashback", name:"Cashback Card", ar:"بطاقة الكاش باك", hero:"5%",
      one:"A % of every bill comes back as wallet money.",
      what:"Customers earn a percentage of what they spend, held as a balance on the pass.",
      how:"Staff type the bill; the pass shows the new balance. Redeem like cash, fully or partially.",
      good:"Restaurants, salons — bigger, variable bills." },
    { id:"points", name:"Points Card", ar:"بطاقة النقاط", hero:"250",
      one:"Spend earns points; points buy a reward ladder.",
      what:"A flexible currency: every JOD earns points, rewards cost points.",
      how:"Earn on every scan; redeem from a ladder — nothing preselected, ever.",
      good:"Retail, pharmacies — many products, many reward levels." },
    { id:"discount", name:"Discount Card", ar:"بطاقة الخصم", hero:"−15%",
      one:"A standing % off, just for carrying the card.",
      what:"The pass itself is the perk: a permanent discount for members.",
      how:"Staff scan and see a verdict — valid or expired. No transaction to type.",
      good:"Partnerships, staff perks, student pricing." },
    { id:"coupon", name:"Coupon", ar:"كوبون", hero:"1×",
      one:"One offer, one use, one expiry date.",
      what:"A single-shot voucher that lives in the wallet until it's used or expires.",
      how:"Redeeming is irreversible, so the scanner always asks twice.",
      good:"Launches, win-backs, influencer campaigns." },
    { id:"vip", name:"VIP Tiers", ar:"فئات كبار الزبائن", hero:"★",
      one:"Silver, Gold, Royal — status with perks.",
      what:"Members climb tiers by visits or spend; each tier unlocks its perk list.",
      how:"Scanning shows the tier and its perks. Tier-ups celebrate on the pass.",
      good:"Lounges, gyms, anywhere status matters." },
    { id:"challenge", name:"Challenge Card", ar:"بطاقة التحدي", hero:"3/5",
      one:"A goal with a deadline — visit 5 times this month.",
      what:"A time-boxed mission. Finish inside the window, win the prize.",
      how:"Progress and the countdown live on the pass; the window closes honestly.",
      good:"New openings, slow seasons, gamified pushes." },
    { id:"membership", name:"Membership Card", ar:"بطاقة العضوية", hero:"ID",
      one:"Proof of belonging, with a renewal date.",
      what:"An identity pass: name, member number, validity.",
      how:"Staff scan for a verdict: active, expiring soon, or lapsed.",
      good:"Studios, clubs, co-working, societies." }
  ],
  members: [
    { name:"Sara Al-Amin", ar:"سارة الأمين", initials:"SA", phone:"+962 79 555 0114", card:"Daraj Coffee", progress:"6 / 8 stamps", joined:"Mar 2026", last:2, visits:34, birthday:"14 Sep", top:true },
    { name:"Omar Khalidi", ar:"عمر الخالدي", initials:"OK", phone:"+962 77 555 0132", card:"Daraj Coffee", progress:"2 / 8 stamps", joined:"Jul 2026", last:21, visits:4 },
    { name:"Lina Haddad", ar:"لينا حداد", initials:"LH", phone:"+962 79 555 0187", card:"Layl Lounge", progress:"Gold", joined:"Jan 2026", last:4, visits:41 },
    { name:"Noor Shami", ar:"نور الشامي", initials:"NS", phone:"+962 78 555 0121", card:"Daraj Coffee", progress:"8 / 8 — reward ready", joined:"Feb 2026", last:5, visits:29 },
    { name:"Khaled Mansour", ar:"خالد منصور", initials:"KM", phone:"+962 79 555 0166", card:"Zaytoun Kitchen", progress:"JOD 3.20 balance", joined:"Apr 2026", last:40, visits:17 },
    { name:"Rania Qasem", ar:"رانيا قاسم", initials:"RQ", phone:"+962 77 555 0143", card:"Layl Lounge", progress:"Silver", joined:"May 2026", last:9, visits:11 },
    { name:"Fadi Nabulsi", ar:"فادي النابلسي", initials:"FN", phone:"+962 78 555 0177", card:"Daraj Coffee", progress:"5 / 8 stamps", joined:"Jun 2026", last:33, visits:14 },
    { name:"Dana Tahboub", ar:"دانا طهبوب", initials:"DT", phone:"+962 79 555 0192", card:"Zaytoun Kitchen", progress:"JOD 1.75 balance", joined:"Mar 2026", last:18, visits:9 },
    { name:"Hala Odeh", ar:"هلا عودة", initials:"HO", phone:"+962 77 555 0155", card:"Daraj Coffee", progress:"1 / 8 stamps", joined:"Jul 2026", last:70, visits:1 },
    { name:"Zaid Barakat", ar:"زيد بركات", initials:"ZB", phone:"+962 78 555 0139", card:"Layl Lounge", progress:"Royal", joined:"Dec 2025", last:1, visits:58 },
    { name:"Maya Sabbagh", ar:"مايا صباغ", initials:"MS", phone:"+962 79 555 0128", card:"Daraj Coffee", progress:"3 / 8 stamps", joined:"Jun 2026", last:12, visits:7 },
    { name:"Lama Saadeh", ar:"لمى سعادة", initials:"LS", phone:"+962 77 555 0161", card:"Zaytoun Kitchen", progress:"JOD 0.90 balance", joined:"May 2026", last:27, visits:5 },
    { name:"Rami Khoury", ar:"رامي خوري", initials:"RK", phone:"+962 79 555 0201", card:"Daraj Coffee", progress:"4 / 8 stamps", joined:"Jan 2026", last:61, visits:11 },
    { name:"Dima Arafat", ar:"ديما عرفات", initials:"DA", phone:"+962 78 555 0219", card:"Daraj Coffee", progress:"7 / 8 stamps", joined:"Nov 2025", last:92, visits:44 },
    { name:"Yousef Hijazi", ar:"يوسف حجازي", initials:"YH", phone:"+962 77 555 0208", card:"Daraj Coffee", progress:"2 / 8 stamps", joined:"Apr 2026", last:17, visits:6 }
  ],
  activity: [
    { t:"2 min ago", who:"Sara Al-Amin", what:"earned a stamp", card:"Daraj Coffee", kind:"earn" },
    { t:"9 min ago", who:"Noor Shami", what:"reached a full card — reward ready", card:"Daraj Coffee", kind:"reward" },
    { t:"24 min ago", who:"Zaid Barakat", what:"checked in — Royal", card:"Layl Lounge", kind:"earn" },
    { t:"1 h ago", who:"New member", what:"Hala Odeh joined from the counter QR", card:"Daraj Coffee", kind:"join" },
    { t:"2 h ago", who:"Broadcast", what:"“Weekend special” delivered to 1,684 wallets", card:"Daraj Coffee", kind:"broadcast" },
    { t:"3 h ago", who:"Maya Sabbagh", what:"earned a stamp", card:"Daraj Coffee", kind:"earn" },
    { t:"Yesterday", who:"Wasla review", what:"Sukkar Bakery submitted for approval", card:"Sukkar Bakery", kind:"review" },
    { t:"Yesterday", who:"Lina Haddad", what:"tier-up: Silver → Gold", card:"Layl Lounge", kind:"reward" },
    { t:"Yesterday", who:"Khaled Mansour", what:"redeemed JOD 1.50 of balance", card:"Zaytoun Kitchen", kind:"reward" },
    { t:"Yesterday", who:"Broadcast", what:"“Gold nights are back” delivered to 396 wallets", card:"Layl Lounge", kind:"broadcast" },
    { t:"Yesterday", who:"Fadi Nabulsi", what:"earned a stamp", card:"Daraj Coffee", kind:"earn" },
    { t:"Yesterday", who:"New member", what:"Maya Sabbagh joined from the poster QR", card:"Daraj Coffee", kind:"join" },
    { t:"Yesterday", who:"Rasha Kilani", what:"corrected a mis-scan (−1 stamp)", card:"Daraj Coffee", kind:"earn" }
  ],
  staff: [
    { name:"Ahmad Zoubi", ar:"أحمد الزعبي", initials:"AZ", branch:"Rainbow St", cards:["Daraj Coffee","Layl Lounge"], scansToday:61 },
    { name:"Rasha Kilani", ar:"رشا الكيلاني", initials:"RK", branch:"Rainbow St", cards:["Daraj Coffee"], scansToday:47 },
    { name:"Samir Awad", ar:"سمير عوض", initials:"SW", branch:"Abdali Mall", cards:["Layl Lounge"], scansToday:22 },
    { name:"Tareq Majali", ar:"طارق المجالي", initials:"TM", branch:"Swefieh", cards:["Zaytoun Kitchen","Ghaim Studio"], scansToday:0 },
    { name:"Farah Amari", ar:"فرح العمري", initials:"FA", branch:"Abdali Mall", cards:["Layl Lounge"], scansToday:18 }
  ],
  broadcasts: [
    { title:"Eid morning surprise", body:"Eid Mubarak — a gift stamp waits with your coffee.", bodyAr:"عيدكم مبارك", card:"Daraj Coffee", sent:"Fri · 09:30", reach:"1,702 wallets", state:"scheduled" },
    { title:"Late-night flash", body:"Free cookie with any drink till midnight.", bodyAr:"كوكيز مجاني", card:"Daraj Coffee", sent:"Waits for 10:00", reach:"1,702 wallets", state:"held" },
    { title:"Weekend special", body:"Double stamps all Friday ☕ — see you on the stairs.", bodyAr:"أختام مضاعفة يوم الجمعة", card:"Daraj Coffee", sent:"Today · 10:00", reach:"1,684 wallets", state:"sent" },
    { title:"Gold nights are back", body:"Gold & Royal: the rooftop opens Thursday.", bodyAr:"ليالي الذهب رجعت", card:"Layl Lounge", sent:"Tue · 18:30", reach:"396 wallets", state:"sent" },
    { title:"We're renovating", body:"Zaytoun pauses this week — your balance is safe.", bodyAr:"رصيدك محفوظ", card:"Zaytoun Kitchen", sent:"12 days ago", reach:"918 wallets", state:"sent" }
  ]
};
window.WASLA_DB.console = {
  accounts: [
    { name:"Tala Hospitality Group", ar:"مجموعة تالا", owner:"Yara Nassar", plan:"Growth", cards:5, quota:10, members:3616, state:"active", manager:"Omar", initial:"T", color:"#E88024", renewal:"12 Aug 2026" },
    { name:"Rawi Coffee House", ar:"بيت راوي", owner:"Samer Rawi", plan:"Unlimited", cards:8, quota:99, members:5204, state:"active", manager:"Lina", initial:"R", color:"#1E6F4D", renewal:"3 Oct 2026" },
    { name:"Nara Pharmacy", ar:"صيدلية نارة", owner:"Reem Nasser", plan:"Growth", cards:3, quota:10, members:1892, state:"active", manager:"Omar", initial:"N", color:"#0F5B63", renewal:"22 Sep 2026" },
    { name:"Marmar Lounge", ar:"مرمر لاونج", owner:"Hani Malas", plan:"Unlimited", cards:4, quota:99, members:2311, state:"active", manager:"Lina", initial:"M", color:"#7A3348", renewal:"1 Dec 2026", note:"Dedicated Apple certificate — the only one." },
    { name:"Petra Gym", ar:"نادي البتراء", owner:"Odai Masri", plan:"Starter", cards:1, quota:3, members:214, state:"active", manager:"Sami", initial:"P", color:"#4E6E8E", renewal:"30 Aug 2026" },
    { name:"Qamar Sweets", ar:"حلويات قمر", owner:"Abeer Qamar", plan:"Starter", cards:2, quota:3, members:640, state:"active", manager:"Sami", initial:"Q", color:"#8A5A18", renewal:"14 Sep 2026" },
    { name:"Wared Flowers", ar:"ورد", owner:"Dalia Wared", plan:"Starter", cards:1, quota:3, members:98, state:"at-risk", manager:"Omar", initial:"W", color:"#B14A32", renewal:"5 Aug 2026", note:"No scans in 19 days — renewal in 6." },
    { name:"Bayt Books", ar:"بيت الكتب", owner:"Faris Haddad", plan:"Starter", cards:0, quota:3, members:311, state:"closed", manager:"Lina", initial:"B", color:"#6B6760", note:"Closed May 2026 — passes voided, data exported." }
  ],
  approvals: [
    { id:"sukkar", kind:"new", account:"Tala Hospitality Group", card:"Sukkar Bakery", ar:"مخبز سكر", type:"Points card", color:"#B14A32", initial:"S", submitted:"Yesterday 16:40", head:["POINTS","250"], reward:"500 pts → a dozen ka'ak", by:"Yara Nassar",
      checks:["Reward is concrete and priced","Arabic name reads naturally","Colors pass wallet contrast","One clock: points only — no second currency"] },
    { id:"naracare", kind:"edit", account:"Nara Pharmacy", card:"Nara Care", ar:"نارة كير", type:"Cashback card", color:"#0F5B63", initial:"N", submitted:"2h ago", by:"Reem Nasser",
      diff:{ field:"Cashback rate", from:"5% back · redeem from JOD 2", to:"7% back · redeem from JOD 2" }, impact:"1,892 live passes update silently — balances untouched. Old rate stays live until approval." }
  ],
  leads: [
    { name:"Louma Chocolate", ar:"لوما", stage:"Invited", note:"WhatsApp opened yesterday — no password yet", owner:"Reem Louma", by:"Omar" },
    { name:"Tuta Juice", ar:"توتة", stage:"Demo booked", note:"Thursday 11:00 · Swefieh branch", owner:"Zain Tuta", by:"Omar" },
    { name:"Al-Quds Falafel", ar:"فلافل القدس", stage:"Won", note:"Activating — first card in review", owner:"Abu Shadi", by:"Lina" },
    { name:"Baraka Style", ar:"بركة", stage:"Cold", note:"Asked to call back after Eid", owner:"Mona Baraka", by:"Sami" },
    { name:"Deema Nails", ar:"ديما", stage:"Negotiating", note:"Wants Growth at Starter price — escalate", owner:"Deema K.", by:"Lina" }
  ],
  leaderboard: [ ["Omar", 6], ["Lina", 4], ["Sami", 3] ],
  team: [
    { name:"Omar Haddad", ar:"عمر حداد", initials:"OH", role:"Admin", last:"now · this device", tfa:true },
    { name:"Lina Kassab", ar:"لينا قسام", initials:"LK", role:"Sales", last:"1h ago", tfa:true },
    { name:"Sami Aburish", ar:"سامي أبو ريش", initials:"SA", role:"Sales", last:"Yesterday", tfa:false },
    { name:"Huda Salem", ar:"هدى سالم", initials:"HS", role:"Support", last:"20 min ago", tfa:true }
  ],
  matrix: [
    ["See every account", true, "their book only", true],
    ["Approve cards & edits", true, false, false],
    ["Member lookup & support tools", true, false, true],
    ["Balance corrections (logged)", true, false, true],
    ["Plan changes & payments", true, "request only", false],
    ["Pause / delete an account", true, false, false],
    ["Send platform notices", true, false, false]
  ],
  activityLog: [
    { t:"10:41", who:"OH", tag:"Wasla", kind:"approve", line:"approved Sukkar Bakery — live in wallets, Yara notified by WhatsApp" },
    { t:"10:12", who:"OH", tag:"Wasla", kind:"viewas", line:"viewed Tala Hospitality as client — read-only, 4 min, every screen logged" },
    { t:"09:58", who:"HS", tag:"Wasla", kind:"support", line:"re-issued Sara Al-Amin's pass — old barcode voided, SMS sent" },
    { t:"09:30", who:"YN", tag:"Client", kind:"client", line:"Tala · sent broadcast “Weekend special” to 1,684 wallets" },
    { t:"Yesterday", who:"HS", tag:"Wasla", kind:"support", line:"balance correction +JOD 1.50 for Khaled Mansour — reason: double-charged at till" },
    { t:"Yesterday", who:"LK", tag:"Wasla", kind:"money", line:"marked Qamar Sweets renewal paid — quota re-armed" },
    { t:"Yesterday", who:"YN", tag:"Client", kind:"client", line:"Tala · submitted Sukkar Bakery for review" },
    { t:"Mon", who:"OH", tag:"Wasla", kind:"approve", line:"rejected Marmar Door Pass — reason sent verbatim: logo unreadable at pass size" },
    { t:"Mon", who:"SA", tag:"Wasla", kind:"money", line:"downgraded Petra Gym to Starter — client asked, quota shrank at renewal" },
    { t:"Jul 12", who:"OH", tag:"Wasla", kind:"approve", line:"took down Qamar Eid Coupon — expired offer still live; client notified with fix path" }
  ],
  decidedSeed: [
    { card:"Rawi Winter Coupon", account:"Rawi Coffee House", verdict:"approved", when:"Mon 11:02", by:"Omar" },
    { card:"Marmar Door Pass", account:"Marmar Lounge", verdict:"rejected", when:"Mon 09:44", by:"Omar", reason:"Logo unreadable at pass size", note:"Resubmitted → approved Tue" },
    { card:"Qamar Eid Coupon", account:"Qamar Sweets", verdict:"takedown", when:"Jul 12", by:"Omar", reason:"Expired offer still live in wallets" }
  ],
  health: {
    cert:{ label:"Shared Apple certificate", renews:"9 Sep 2026", days:41, covers:"46 of 47 accounts", dedicated:"Marmar Lounge runs its own — renews 2 Feb 2027" },
    jobs:[ { name:"Birthday job · Jul 30", state:"partial", line:"131 gifts placed · 3 failed (bad device tokens) — retrying at 12:00" },
           { name:"Broadcast fan-out", state:"ok", line:"12 sends today · median delivery 1.8s" },
           { name:"Pass update push (APNs + FCM)", state:"ok", line:"99.2% delivered in 24h" } ],
    totals:{ accounts:47, active:45, cardsLive:61, passes:18420 }
  }
};
