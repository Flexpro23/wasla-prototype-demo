/* Wasla V2 demo database — replace with API later. All numbers reconcile. */

/* ══ TWO ACCOUNTS, ONE FILE ══════════════════════════════════════════════════
   This file used to be one merchant. It is now two, because every prospect the
   founder demos to is DAY ONE and the mature account cannot show them that.

   THE SPLIT. Nine fields are PER-ACCOUNT and live in window.WASLA_ACCOUNTS below:
       account · cardExtras · memberTimelines · signup · cards · members ·
       activity · staff · broadcasts
   Three things are SHARED and stay on window.WASLA_DB: demoFlags, `types` (the
   nine-type catalogue is the product, not a tenant's data), and console.* (the
   Wasla-side book — accounts, approvals, leads, billing — which is ABOUT the
   accounts and is not one of them).

   HOW AN ACCOUNT IS CHOSEN. The resolver at the bottom of this file reads ?acct=
   from the URL and copies that account's nine fields onto window.WASLA_DB before
   any component code runs. That works because this script is a plain synchronous
   <script src> at line 12 of every surface, and the earliest x-dc component script
   is line 759 (Sales) — so window.WASLA_DB is already the right account by the
   time anything reads it, and the ~23 scattered WASLA_DB reads across Customer and
   Scanner needed no edits at all.
   TWO STANDING INVARIANTS FALL OUT OF THAT, and both are load-bearing:
     · never move the wasla-data.js <script> tag later in any surface;
     · never capture window.WASLA_DB (or any of the nine fields) at module scope in
       a file that loads BEFORE it — the reference would go stale at the swap.

   THE DEFAULT IS TALA. An absent ?acct=, and an ?acct= naming an account we do not
   have, both resolve to tala-hospitality-group. So every bare URL is byte-for-byte
   the demo that existed before this file was split — verified by deep-compare.
   An unknown slug is reported honestly rather than swallowed: WASLA_ACCT_KNOWN goes
   false and WASLA_ACCT_REQUESTED carries what was asked for, so a surface can say
   "we do not have that account" instead of printing a foreign name over Tala's
   numbers — which is exactly the sentence-contradicts-the-number-beside-it defect
   this codebase keeps finding. ══════════════════════════════════════════════ */
window.WASLA_ACCOUNTS = {
  "tala-hospitality-group": {
    account: {
      company: "Tala Hospitality Group", companyAr: "مجموعة تالا للضيافة",
      owner: "Yara Nassar", ownerAr: "يارا نصار", initials: "YN",
      /* THE OWNER'S TITLE IS THIS ACCOUNT'S DATA, NOT A CONSTANT. Yara Nassar is a
         woman, so every Arabic screen that labels her says المالكة. Abu Shadi is a
         man and his account says المالك. A single hardcoded Arabic title in a
         surface's string table mislabels one of them on every screen it appears on,
         and no amount of care keeps two hardcoded copies in step — so the title
         travels with the person it names.
         `ownerGender` is here because a title alone is not enough: Arabic sentences
         ABOUT the owner have to agree with her too ("المالكة، وهي الكاشيرة" against
         "المالك، وهو الكاشير"). Surfaces pick the pronoun/adjective from this flag
         rather than guessing from the name. 'f' = feminine, 'm' = masculine.
         English needs no variant — `ownerTitle` is carried anyway so no surface has
         to hardcode half the pair and read the other half from here. */
      ownerTitle: "Owner", ownerTitleAr: "المالكة", ownerGender: "f",
      plan: "Growth", cardQuota: 10, cardsUsed: 6,
      broadcastQuota: 10, broadcastsUsed: 6,
      /* THE ACCOUNT TOTAL IS THE SUM OF WHAT THE CARD PAGES SHOW, AND NOTHING ELSE.
         1,841 + 412 + 1,129 + 0 (Sukkar, in review) + 0 (Ghaim, draft) + 268 = 3,650.
         Passes: 1,702 + 398 + 918 + 0 + 0 + 241 = 3,259. It used to be 3,884, which
         was the same sum plus Sukkar's phantom 234 — a card that has never been in a
         wallet — so the header claimed 234 members the six card pages could not
         account for. If a card's members change, change this in the same edit: this
         number and those six are one fact, and a reader one click away checks it. */
      members: 3650, passes: 3259, stampsToday: 146, redeemedWeek: 41,
      memberDelta: "+128 this week", renewal: "12 Aug 2026",
      branches: ["Rainbow St", "Swefieh", "Abdali Mall"],
      /* account defaults — a card inherits any link it doesn't set itself.
         On a card: a value = override, "" = hidden on this card, key absent = inherit. */
      links: { ig: "@talahospitality", wa: "+962 79 555 0100",
               loc: "Amman, Jordan", web: "talagroup.jo" }
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
      zaman: { funnel: { scans: 214, stamps: 0, ready: 0, redeemed: 96 }, retention: [100, 79, 66, 58], branches: [["Rainbow St", 100]], hours: [2, 3, 4, 6, 8, 11, 14, 19, 24, 31, 38, 44, 41, 29, 16], top: ["Rakan Al-Tell", "Jude Barghouti", "Nadeen Fakhoury"], insight: "Stored value comes back as visits — a loaded pass returns 2.4× more often, and JOD 3,180 is still sitting on the passes waiting to be played." },
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
      joins: { counter: 68, poster: 24, link: 8 },
      /* THE PERSON THIS ACCOUNT'S DEMO JOINS AS — the one field added to Tala by the
         two-account split, so Customer no longer has to hardcode a persona that only
         makes sense on one merchant. Sara is already members[0]; her phone and
         birthday are the same values that row carries, not a second copy of them.
         `drink` is the join form's favourite-item field, whatever the shop sells. */
      defaultMember: { name: "Sara Al-Amin", ar: "سارة الأمين", phone: "+962 79 555 0114",
                       drink: "Flat white", drinkAr: "فلات وايت", birthday: "14 Sep" }
    },
    cards: [
      { id:"daraj", name:"Daraj Coffee", ar:"قهوة الدرج", type:"stamps", state:"live",
        color:"#1E5C43", color2:"#154232", initial:"D", stampStyle:"coffee",
        tagline:"Buy 7, the 8th is on us", taglineAr:"اشترِ 7 والثامن علينا",
        members:1841, passes:1702, weekActivity:[38,52,44,61,58,72,66],
        stat1:{label:"Stamps today",v:"146"}, stat2:{label:"Rewards ready",v:"23"},
        links: { ig: "@darajcoffee", wa: "+962 79 555 0114", loc: "Rainbow St, Amman", web: "darajcoffee.jo" },
        rules: { guard: "1 / visit", guardNote: "One stamp per customer per day · resets at midnight", redeemCap: 2 },
        goal:8, reward:"Free drink of your choice", branch:"Rainbow St" },
      { id:"layl", name:"Layl Lounge", ar:"ليل لاونج", type:"vip", state:"live",
        color:"#1B2440", color2:"#111730", initial:"L", gold:"#E8B824",
        tagline:"Three tiers, real perks", taglineAr:"ثلاث فئات ومزايا حقيقية",
        members:412, passes:398, weekActivity:[12,9,14,11,19,26,22],
        stat1:{label:"Gold members",v:"57"}, stat2:{label:"Visits this week",v:"113"},
        links: { ig: "@layllounge", wa: "+962 78 555 0180", loc: "Abdali Mall, Amman", web: "" },
        rules: { redeemCap: 2, tiers: [{ name: "Silver", at: 0 }, { name: "Gold", at: 12 }, { name: "Royal", at: 20 }] },
        goal:0, reward:"Gold: skip the line + 15%", branch:"Abdali Mall" },
      { id:"zaytoun", name:"Zaytoun Kitchen", ar:"مطبخ زيتون", type:"cashback", state:"paused",
        color:"#5C6B2F", color2:"#454f24", initial:"Z",
        tagline:"5% back on every bill", taglineAr:"5٪ كاش باك على كل فاتورة",
        members:1129, passes:918, weekActivity:[41,44,0,0,0,0,0],
        stat1:{label:"Wallet balance out",v:"JOD 412"}, stat2:{label:"Paused",v:"12 days"},
        links: { ig: "@zaytounkitchen", loc: "Swefieh, Amman", web: "zaytoun.jo" },
        rules: { minRedeem: 2, redeemCap: 2 },
        goal:0, reward:"5% back, redeem from JOD 2", branch:"Swefieh",
        note:"Paused for renovation — balances stay redeemable." },
      { id:"sukkar", name:"Sukkar Bakery", ar:"مخبز سكر", type:"points", state:"review",
        color:"#B14A32", color2:"#8f3a27", initial:"S",
        tagline:"Every JOD = 10 points", taglineAr:"كل JOD = 10 نقاط",
        /* ZERO MEMBERS, AND IT HAS TO BE ZERO. This card was submitted yesterday and
           has never been approved, so no wallet has ever held it — which is why
           `passes` was already 0 and why the members[] directory below carries not a
           single Sukkar row. It nevertheless read `members:234`, and account.members
           was the sum INCLUDING that 234. Every surface that asks "has this card ever
           been live?" before printing a member count therefore rendered MEMBERS 0 on
           the card page while the account header claimed 3,884 — the six card pages
           summing to 3,650 against it. The seeded 234 was the falsehood, not the gate:
           a card nobody can join cannot have members. Keep this at 0. When Omar
           approves it in the Console the card goes live with nobody on it, which is
           what a just-approved card is, and the count grows from the live bus. */
        members:0, passes:0, weekActivity:[0,0,0,0,0,0,0],
        stat1:{label:"Submitted",v:"Yesterday"}, stat2:{label:"Reviewer",v:"Wasla · Omar"},
        links: { ig: "@sukkarbakery", loc: "Rainbow St, Amman" },
        rules: { redeemCap: 2 },
        goal:0, reward:"500 pts → dozen ka'ak", branch:"Rainbow St" },
      { id:"ghaim", name:"Ghaim Studio", ar:"استوديو غيم", type:"membership", state:"draft",
        color:"#4E6E8E", color2:"#3a5570", initial:"G",
        tagline:"Monthly access pass", taglineAr:"اشتراك شهري",
        members:0, passes:0, weekActivity:[0,0,0,0,0,0,0],
        stat1:{label:"Last edited",v:"2 days ago"}, stat2:{label:"Step",v:"Configure"},
        links: { ig: "@ghaimstudio", web: "ghaimstudio.jo" },
        rules: { graceDays: 14 },
        goal:0, reward:"Unlimited classes", branch:"Swefieh" },
      { id:"zaman", name:"Zaman Arcade", ar:"زمان أركيد", type:"prepaid", state:"live",
        color:"#4B2E83", color2:"#382263", initial:"Z", stampStyle:"star", gold:"#F2B705",
        tagline:"Load it once, play all week", taglineAr:"اشحنها مرة، وتلعب طول الأسبوع",
        members:268, passes:241, weekActivity:[22,18,26,31,24,39,35],
        stat1:{label:"Loaded this week",v:"JOD 1,240"}, stat2:{label:"Stored value out",v:"JOD 3,180"},
        links: { ig: "@zamanarcade", wa: "+962 78 555 0193", loc: "Rainbow St, Amman", web: "" },
        /* Prepaid = stored value. The customer hands over cash; it sits on the pass as HER money.
           minRedeem/redeemCap are pinned to 0 on purpose so prepaid can never inherit cashback rules. */
        rules: { topupsMinor: [10000, 25000, 50000, 100000],
                 bonusTiers: [{ atMinor: 50000, pct: 5 }, { atMinor: 100000, pct: 10 }],
                 maxPrincipalMinor: 300000, bonusExpiryDays: 180,
                 refundable: true, allowPartial: true,
                 offlineFloorMinor: 10000, spendPinAboveMinor: 20000, lowBalanceAtMinor: 5000,
                 minRedeem: 0, redeemCap: 0 },
        goal:0, reward:"Load JOD 100, play with JOD 110", branch:"Rainbow St" }
    ],
    members: [
      { name:"Sara Al-Amin", ar:"سارة الأمين", initials:"SA", phone:"+962 79 555 0114", card:"Daraj Coffee", progress:"6 / 8 stamps", joined:"Mar 2026", last:0, visits:34, birthday:"14 Sep", top:true },
      { name:"Omar Khalidi", ar:"عمر الخالدي", initials:"OK", phone:"+962 77 555 0132", card:"Daraj Coffee", progress:"2 / 8 stamps", joined:"Jul 2026", last:21, visits:4 },
      { name:"Lina Haddad", ar:"لينا حداد", initials:"LH", phone:"+962 79 555 0187", card:"Layl Lounge", progress:"Gold", joined:"Jan 2026", last:1, visits:14 },
      { name:"Noor Shami", ar:"نور الشامي", initials:"NS", phone:"+962 78 555 0121", card:"Daraj Coffee", progress:"8 / 8 — reward ready", joined:"Feb 2026", last:0, visits:29 },
      { name:"Khaled Mansour", ar:"خالد منصور", initials:"KM", phone:"+962 79 555 0166", card:"Zaytoun Kitchen", progress:"JOD 3.20 balance", joined:"Apr 2026", last:1, visits:17 },
      { name:"Rania Qasem", ar:"رانيا قاسم", initials:"RQ", phone:"+962 77 555 0143", card:"Layl Lounge", progress:"Silver", joined:"May 2026", last:9, visits:11 },
      { name:"Fadi Nabulsi", ar:"فادي النابلسي", initials:"FN", phone:"+962 78 555 0177", card:"Daraj Coffee", progress:"5 / 8 stamps", joined:"Jun 2026", last:1, visits:14 },
      { name:"Dana Tahboub", ar:"دانا طهبوب", initials:"DT", phone:"+962 79 555 0192", card:"Zaytoun Kitchen", progress:"JOD 3.40 balance", joined:"Mar 2026", last:18, visits:9 },
      { name:"Hala Odeh", ar:"هلا عودة", initials:"HO", phone:"+962 77 555 0155", card:"Daraj Coffee", progress:"1 / 8 stamps", joined:"Jul 2026", last:0, visits:1 },
      { name:"Zaid Barakat", ar:"زيد بركات", initials:"ZB", phone:"+962 78 555 0139", card:"Layl Lounge", progress:"Royal", joined:"Dec 2025", last:0, visits:58 },
      { name:"Maya Sabbagh", ar:"مايا صباغ", initials:"MS", phone:"+962 79 555 0128", card:"Daraj Coffee", progress:"3 / 8 stamps", joined:"Jun 2026", last:0, visits:7 },
      { name:"Lama Saadeh", ar:"لمى سعادة", initials:"LS", phone:"+962 77 555 0161", card:"Zaytoun Kitchen", progress:"JOD 0.90 balance", joined:"May 2026", last:27, visits:5 },
      { name:"Rami Khoury", ar:"رامي خوري", initials:"RK", phone:"+962 79 555 0201", card:"Daraj Coffee", progress:"4 / 8 stamps", joined:"Jan 2026", last:61, visits:11 },
      { name:"Dima Arafat", ar:"ديما عرفات", initials:"DA", phone:"+962 78 555 0219", card:"Daraj Coffee", progress:"7 / 8 stamps", joined:"Nov 2025", last:92, visits:44 },
      { name:"Yousef Hijazi", ar:"يوسف حجازي", initials:"YH", phone:"+962 77 555 0208", card:"Daraj Coffee", progress:"2 / 8 stamps", joined:"Apr 2026", last:17, visits:6 },
      /* ── Prepaid / stored value (Zaman Arcade) ────────────────────────────────
         All money is INTEGER FILS; 1000 fils = 1 JOD. Every field ends in "Minor".
         balanceMinor    = principalMinor + sum(bonus[].remainingMinor)
         refundableMinor = max(0, depositedMinor - spentMinor - refundedMinor)
         Those are TWO DIFFERENT NUMBERS and both must always be shown together.
         deposited/spent/refunded are LIFETIME counters — never reset, never reduced.
         Fully-consumed and expired bonus lots are dropped from bonus[]; the ledger keeps them.
         Ledger before/after are TOTAL BALANCE (principal + live bonus), so a row reads as a
         running balance; deltaMinor is the movement of that row's bucket only. ts = epoch ms. */
      { name:"Rakan Al-Tell", ar:"راكان التل", initials:"RT", phone:"+962 79 555 0223", card:"Zaman Arcade",
        progress:"JOD 140.25 prepaid", joined:"May 2026", last:0, visits:22, birthday:"2 Mar", top:true,
        prepaid: {
          principalMinor: 137750,
          bonus: [ { id:"rk-b2", grantedMinor:2500, remainingMinor:2500, grantedAt:"2026-08-03",
                     expiresAt:"2027-01-30", campaign:"summer-5" } ],
          depositedMinor: 175000, spentMinor: 47250, refundedMinor: 0,
          syncedAt: 1785750720000,
          ledger: [
            { id:"rk-1", ts:1778336400000, kind:"topup", bucket:"principal", deltaMinor:25000, beforeMinor:0, afterMinor:25000, by:"Ahmad Zoubi", branch:"Rainbow St", ref:"ZA-1041" },
            { id:"rk-2", ts:1780157100000, kind:"spend", bucket:"principal", deltaMinor:-6500, beforeMinor:25000, afterMinor:18500, by:"Rasha Kilani", branch:"Rainbow St", ref:"ZA-1188" },
            { id:"rk-3", ts:1781977200000, kind:"topup", bucket:"principal", deltaMinor:100000, beforeMinor:18500, afterMinor:118500, by:"Ahmad Zoubi", branch:"Rainbow St", ref:"ZA-1362" },
            { id:"rk-4", ts:1781977200000, kind:"bonus", bucket:"bonus", deltaMinor:10000, beforeMinor:118500, afterMinor:128500, by:"Ahmad Zoubi", branch:"Rainbow St", ref:"ZA-1362" },
            { id:"rk-5", ts:1783782900000, kind:"spend", bucket:"bonus", deltaMinor:-7250, beforeMinor:128500, afterMinor:121250, by:"Rasha Kilani", branch:"Rainbow St", ref:"ZA-1547" },
            { id:"rk-6", ts:1785435000000, kind:"spend", bucket:"bonus", deltaMinor:-2750, beforeMinor:121250, afterMinor:118500, by:"Ahmad Zoubi", branch:"Rainbow St", ref:"ZA-1719" },
            { id:"rk-7", ts:1785435000000, kind:"spend", bucket:"principal", deltaMinor:-30750, beforeMinor:118500, afterMinor:87750, by:"Ahmad Zoubi", branch:"Rainbow St", ref:"ZA-1719" },
            { id:"rk-8", ts:1785750720000, kind:"topup", bucket:"principal", deltaMinor:50000, beforeMinor:87750, afterMinor:137750, by:"Ahmad Zoubi", branch:"Rainbow St", ref:"ZA-1806" },
            { id:"rk-9", ts:1785750720000, kind:"bonus", bucket:"bonus", deltaMinor:2500, beforeMinor:137750, afterMinor:140250, by:"Ahmad Zoubi", branch:"Rainbow St", ref:"ZA-1806" }
          ] } },
      /* Jude: principal 0, bonus 8.00 left — balance JOD 8.00, refundable JOD 0.00.
         She spent her whole deposit (and 2.000 of the first bonus), then the Eid campaign
         granted a fresh 8.000 lot against no cash. This is the state a cashier must be able
         to explain at the counter: "the bonus is not cash." */
      { name:"Jude Barghouti", ar:"جود البرغوثي", initials:"JB", phone:"+962 78 555 0231", card:"Zaman Arcade",
        progress:"JOD 8.00 prepaid", joined:"May 2026", last:1, visits:31,
        prepaid: {
          principalMinor: 0,
          bonus: [ { id:"jb-b2", grantedMinor:8000, remainingMinor:8000, grantedAt:"2026-08-02",
                     expiresAt:"2027-01-29", campaign:"eid-gift" } ],
          depositedMinor: 100000, spentMinor: 110000, refundedMinor: 0,
          syncedAt: 1785665100000,
          ledger: [
            { id:"jb-1", ts:1779024600000, kind:"topup", bucket:"principal", deltaMinor:100000, beforeMinor:0, afterMinor:100000, by:"Ahmad Zoubi", branch:"Rainbow St", ref:"ZA-1102" },
            { id:"jb-2", ts:1779024600000, kind:"bonus", bucket:"bonus", deltaMinor:10000, beforeMinor:100000, afterMinor:110000, by:"Ahmad Zoubi", branch:"Rainbow St", ref:"ZA-1102" },
            { id:"jb-3", ts:1782060300000, kind:"spend", bucket:"bonus", deltaMinor:-10000, beforeMinor:110000, afterMinor:100000, by:"Rasha Kilani", branch:"Rainbow St", ref:"ZA-1401" },
            { id:"jb-4", ts:1782060300000, kind:"spend", bucket:"principal", deltaMinor:-32000, beforeMinor:100000, afterMinor:68000, by:"Rasha Kilani", branch:"Rainbow St", ref:"ZA-1401" },
            { id:"jb-5", ts:1784481600000, kind:"spend", bucket:"principal", deltaMinor:-68000, beforeMinor:68000, afterMinor:0, by:"Ahmad Zoubi", branch:"Rainbow St", ref:"ZA-1633" },
            { id:"jb-6", ts:1785665100000, kind:"bonus", bucket:"bonus", deltaMinor:8000, beforeMinor:0, afterMinor:8000, by:"Yara Nassar", branch:"Rainbow St", ref:"ZA-EID-08" }
          ] } },
      /* Nadeen: fils-precision balance (JOD 4.125) and an EXPIRED bonus lot.
         Note refundable (2.625) < principal (4.125): spending bonus reduces what is refundable,
         exactly as the worked proof in the contract requires. */
      { name:"Nadeen Fakhoury", ar:"نادين الفاخوري", initials:"NF", phone:"+962 77 555 0247", card:"Zaman Arcade",
        progress:"JOD 4.125 prepaid", joined:"Jan 2026", last:10, visits:16,
        prepaid: {
          principalMinor: 4125,
          bonus: [],
          depositedMinor: 50000, spentMinor: 47375, refundedMinor: 0,
          syncedAt: 1784911800000,
          ledger: [
            { id:"nf-1", ts:1768740000000, kind:"topup", bucket:"principal", deltaMinor:50000, beforeMinor:0, afterMinor:50000, by:"Rasha Kilani", branch:"Rainbow St", ref:"ZA-0817" },
            { id:"nf-2", ts:1768740000000, kind:"bonus", bucket:"bonus", deltaMinor:2500, beforeMinor:50000, afterMinor:52500, by:"Rasha Kilani", branch:"Rainbow St", ref:"ZA-0817" },
            { id:"nf-3", ts:1772724300000, kind:"spend", bucket:"bonus", deltaMinor:-1500, beforeMinor:52500, afterMinor:51000, by:"Ahmad Zoubi", branch:"Rainbow St", ref:"ZA-0954" },
            { id:"nf-4", ts:1784235900000, kind:"expire", bucket:"bonus", deltaMinor:-1000, beforeMinor:51000, afterMinor:50000, by:"system", branch:"—", ref:"ZA-EXP-0817" },
            { id:"nf-5", ts:1784911800000, kind:"spend", bucket:"principal", deltaMinor:-45875, beforeMinor:50000, afterMinor:4125, by:"Rasha Kilani", branch:"Rainbow St", ref:"ZA-1671" }
          ] } }
    ],
    activity: [
      { t:"2 min ago", who:"Sara Al-Amin", what:"earned a stamp", card:"Daraj Coffee", kind:"earn" },
      { t:"6 min ago", who:"Rakan Al-Tell", what:"loaded JOD 50.00 — JOD 2.50 bonus on top", card:"Zaman Arcade", kind:"topup" },
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
      { t:"Yesterday", who:"Rasha Kilani", what:"corrected a mis-scan (−1 stamp)", card:"Daraj Coffee", kind:"earn" },
      { t:"Yesterday", who:"Jude Barghouti", what:"received a JOD 8.00 Eid credit — bonus, not cash", card:"Zaman Arcade", kind:"topup" }
    ],
    staff: [
      { name:"Ahmad Zoubi", ar:"أحمد الزعبي", initials:"AZ", branch:"Rainbow St", cards:["Daraj Coffee","Layl Lounge","Zaman Arcade"], scansToday:61 },
      { name:"Rasha Kilani", ar:"رشا الكيلاني", initials:"RK", branch:"Rainbow St", cards:["Daraj Coffee","Zaman Arcade"], scansToday:47 },
      { name:"Samir Awad", ar:"سمير عوض", initials:"SW", branch:"Abdali Mall", cards:["Layl Lounge"], scansToday:22 },
      { name:"Tareq Majali", ar:"طارق المجالي", initials:"TM", branch:"Swefieh", cards:["Zaytoun Kitchen","Ghaim Studio"], scansToday:0 },
      { name:"Farah Amari", ar:"فرح العمري", initials:"FA", branch:"Abdali Mall", cards:["Layl Lounge"], scansToday:18 }
    ],
    broadcasts: [
      { title:"Eid morning surprise", body:"Eid Mubarak — a gift stamp waits with your coffee.", bodyAr:"عيدكم مبارك", card:"Daraj Coffee", sent:"Fri · 09:30", reach:"1,702 wallets", state:"scheduled" },
      { title:"Late-night flash", body:"Free cookie with any drink till midnight.", bodyAr:"كوكيز مجاني", card:"Daraj Coffee", sent:"Waits for 10:00", reach:"1,702 wallets", state:"held" },
      { title:"Weekend special", body:"Double stamps all Friday ☕ — see you on the stairs.", bodyAr:"أختام مضاعفة يوم الجمعة", card:"Daraj Coffee", sent:"Today · 10:00", reach:"1,684 wallets", state:"sent" },
      { title:"Gold nights are back", body:"Gold & Royal: the rooftop opens Thursday.", bodyAr:"ليالي الذهب رجعت", card:"Layl Lounge", sent:"Tue · 18:30", reach:"396 wallets", state:"sent" },
      /* The sixth send, and the reason account.broadcastsUsed reads 6: this list is the whole
         month, not a sample of it, so the counter is the length of this array and nothing else. */
      { title:"Your top-up goes further", body:"Load JOD 50 or more and 5% lands on the pass with it — JOD 100 makes it 10%.", bodyAr:"اشحن JOD 50 وخذ 5٪ فوقها", card:"Zaman Arcade", sent:"9 days ago", reach:"236 wallets", state:"sent" },
      { title:"We're renovating", body:"Zaytoun pauses this week — your balance is safe.", bodyAr:"رصيدك محفوظ", card:"Zaytoun Kitchen", sent:"12 days ago", reach:"918 wallets", state:"sent" }
    ]
  },

  /* ── AL-QUDS FALAFEL · day one ────────────────────────────────────────────
     Jabal Al-Weibdeh. One shop, one man, one morning old.

     This is NOT "an empty Tala". It is the state an account is in the second
     after Omar clicks Activate: the business exists, the owner can sign in, and
     nothing has happened yet. Every empty array below is the truth of that
     morning — not a gap waiting for sample data.

     ZERO CARDS is a decision, not an oversight. The first card gets built live
     in the wizard in front of the prospect, so `cards` is [], `cardsUsed` is 0,
     and `cardExtras` / `memberTimelines` are {} because there is no card yet for
     either of them to be keyed by.

     memberDelta IS THE EMPTY STRING, and that is the whole point of it. "+0 this
     week" is a broken zero — it claims a week of measurement that has not
     happened. An empty string is a designed one: render no delta at all, because
     there is nothing yet to compare against. */
  "al-quds-falafel": {
    account: {
      company: "Al-Quds Falafel", companyAr: "فلافل القدس",
      owner: "Abu Shadi", ownerAr: "أبو شادي", initials: "AS",
      /* Same contract as Tala's, stated per account so neither can drift. Abu Shadi
         is a man: المالك, masculine agreement. See the note on Tala's record. */
      ownerTitle: "Owner", ownerTitleAr: "المالك", ownerGender: "m",
      plan: "Starter", cardQuota: 3, cardsUsed: 0,
      /* STARTER HAS NO BROADCASTS — and this is the field that says so. The plan
         table, the console's account drill-in and the sales invite copy all state
         it; a quota of 3 here made the product contradict itself in three places
         and offered the day-one merchant three sends their own plan row denies.
         Zero is the DESIGNED number, not a broken one: render the absence — no
         "0 left" chip, no 0 / 0 meter, no composer offering a send that cannot be
         made. The honest thing to show in that space is where broadcasts start.
         `broadcastsUsed` is 0 because nothing was ever sent, which is a different
         zero from the quota and both are true.
         ONE TRAP, AND IT IS THE ONLY REASON THIS COMMENT IS LONG: 0 is falsy, so
         `(account.broadcastQuota || 10)` reads this as TEN. Every account here
         declares the field, so that fallback can never legitimately fire — a reader
         that needs a default must use `??`, not `||`, or Starter silently gets
         Growth's allowance. Executed against this seed: `|| 10` → 10, `?? 10` → 0. */
      broadcastQuota: 0, broadcastsUsed: 0,
      members: 0, passes: 0, stampsToday: 0, redeemedWeek: 0,
      memberDelta: "", renewal: "3 Sep 2026",
      branches: ["Jabal Al-Weibdeh"],
      /* Account defaults, same contract as Tala's: a value = the card inherits it,
         "" = hidden on this card, key ABSENT = there is nothing to inherit.
         `ig` and `web` are absent on purpose. A falafel shop on its first morning
         has a WhatsApp number and a corner — it does not have an Instagram or a
         website. Render that absence as nothing: no empty row, no placeholder
         dash, no "not set". */
      links: { wa: "+962 79 555 0188", loc: "Jabal Al-Weibdeh, Amman" }
    },
    /* No card exists, so there is nothing to hold analytics for. This is a
       different zero from "a card that has been scanned zero times". */
    cardExtras: {},
    memberTimelines: {},
    signup: {
      /* A join URL is minted per card. With `cards` empty there is no card and so
         no URL — this is the empty string, not a placeholder path that 404s. */
      url: "",
      /* Day-one poster copy. It names no reward and no card, because neither
         exists yet; the moment the first card is approved the poster takes ITS
         name and ITS reward. Anything here promising "your 8th falafel" would be
         a sentence contradicting the zero standing next to it. */
      poster: { line: "Join from your phone.", lineAr: "انضم من هاتفك",
                sub: "The card lives in your wallet — no app, nothing to carry.", subAr: "البطاقة بمحفظتك — بدون تطبيق ولا شي تحمله" },
      joins: { counter: 0, poster: 0, link: 0 },
      /* THE PERSON THIS ACCOUNT'S DEMO JOINS AS. Both accounts carry one, so no
         surface has to hardcode a persona. `drink` is the join form's
         favourite-item field, whatever the shop happens to sell. */
      defaultMember: { name: "Rami Haddad", ar: "رامي حداد", phone: "+962 79 555 0231",
                       drink: "Falafel sandwich", drinkAr: "سندويشة فلافل", birthday: "9 Mar" }
    },
    cards: [],
    members: [],
    activity: [],
    /* One person, who is the owner AND the till AND the entire roster. Nothing
       here restates that: derive it by comparing this row's `name` against
       account.owner, so the two can never drift apart.
       `cards: []` means there is no card to be assigned to yet — not "assigned to
       none of them". `pin` wins over the scanner's demo table (see pinForStaff in
       Wasla Scanner.dc.html), which only knows Tala's five people. */
    staff: [
      { name: "Abu Shadi", ar: "أبو شادي", initials: "AS", branch: "Jabal Al-Weibdeh", cards: [], scansToday: 0, pin: "1188" }
    ],
    broadcasts: []
  }
};

/* window.WASLA_DB — what every surface actually reads.
   The nine per-account slots are declared here as null and filled by the resolver
   at the bottom of this file, in this order, so the shape of the object is visible
   in one place and the key order is exactly what it was before the split. If you
   ever see a null survive to a render, the resolver did not run — that is the bug,
   not the null. */
window.WASLA_DB = {
  demoFlags: { sukkarKey: "wasla_demo_sukkar_state" },
  account: null, cardExtras: null, memberTimelines: null, signup: null, cards: null,
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
      good:"Studios, clubs, co-working, societies." },
    { id:"prepaid", name:"Prepaid Card", ar:"بطاقة مسبقة الدفع", hero:"JOD",
      one:"The customer loads real money up front, then spends it down.",
      what:"Stored value. The customer pays cash at the counter; the amount sits on the pass as their own money, often with a bonus on top.",
      how:"Staff take the cash and load it. Later visits deduct the bill from the balance — before and after are shown every time.",
      good:"Arcades, coffee shops, canteens — places customers pre-pay to visit often." }
  ],
  members: null, activity: null, staff: null, broadcasts: null
};
window.WASLA_DB.console = {
  accounts: [
    /* `members` on a console row is the SAME number the merchant's own dashboard
       header shows — Omar and Yara must never read two different totals for one
       business. Tala's is WASLA_ACCOUNTS['tala-hospitality-group'].account.members,
       which is the sum of its six card pages; change one and change the other. */
    { name:"Tala Hospitality Group", ar:"مجموعة تالا", owner:"Yara Nassar", plan:"Growth", cards:6, quota:10, members:3650, state:"active", manager:"Omar", initial:"T", color:"#E88024", renewal:"12 Aug 2026", eligible:{ prepaid:true } },
    { name:"Rawi Coffee House", ar:"بيت راوي", owner:"Samer Rawi", plan:"Unlimited", cards:8, quota:99, members:5204, state:"active", manager:"Lina", initial:"R", color:"#1E6F4D", renewal:"3 Oct 2026", eligible:{ prepaid:true } },
    { name:"Nara Pharmacy", ar:"صيدلية نارة", owner:"Reem Nasser", plan:"Growth", cards:3, quota:10, members:1892, state:"active", manager:"Omar", initial:"N", color:"#0F5B63", renewal:"22 Sep 2026", eligible:{ prepaid:false } },
    { name:"Marmar Lounge", ar:"مرمر لاونج", owner:"Hani Malas", plan:"Unlimited", cards:4, quota:99, members:2311, state:"active", manager:"Lina", initial:"M", color:"#7A3348", renewal:"1 Dec 2026", note:"Dedicated Apple certificate — the only one.", eligible:{ prepaid:true } },
    { name:"Petra Gym", ar:"نادي البتراء", owner:"Odai Masri", plan:"Starter", cards:1, quota:3, members:214, state:"active", manager:"Sami", initial:"P", color:"#4E6E8E", renewal:"30 Aug 2026", eligible:{ prepaid:false } },
    { name:"Qamar Sweets", ar:"حلويات قمر", owner:"Abeer Qamar", plan:"Starter", cards:2, quota:3, members:640, state:"active", manager:"Sami", initial:"Q", color:"#8A5A18", renewal:"14 Sep 2026", eligible:{ prepaid:false } },
    { name:"Wared Flowers", ar:"ورد", owner:"Dalia Wared", plan:"Starter", cards:1, quota:3, members:98, state:"at-risk", manager:"Omar", initial:"W", color:"#B14A32", renewal:"5 Aug 2026", note:"No scans in 19 days — renewal in 6.", eligible:{ prepaid:false } },
    { name:"Bayt Books", ar:"بيت الكتب", owner:"Faris Haddad", plan:"Starter", cards:0, quota:3, members:311, state:"closed", manager:"Lina", initial:"B", color:"#6B6760", note:"Closed May 2026 — passes voided, data exported.", eligible:{ prepaid:false } }
  ],
  approvals: [
    { id:"sukkar", kind:"new", account:"Tala Hospitality Group", card:"Sukkar Bakery", ar:"مخبز سكر", type:"Points card", color:"#B14A32", initial:"S", submitted:"Yesterday 16:40", head:["POINTS","250"], reward:"500 pts → a dozen ka'ak", by:"Yara Nassar",
      checks:["Reward is concrete and priced","Arabic name reads naturally","Colors pass wallet contrast","One clock: points only — no second currency"] },
    { id:"naracare", kind:"edit", account:"Nara Pharmacy", card:"Nara Care", ar:"نارة كير", type:"Cashback card", color:"#0F5B63", initial:"N", submitted:"2h ago", by:"Reem Nasser",
      diff:{ field:"Cashback rate", from:"5% back · redeem from JOD 2", to:"7% back · redeem from JOD 2" }, impact:"1,892 live passes update silently — balances untouched. Old rate stays live until approval." },
    { id:"zamanedit", kind:"edit", account:"Tala Hospitality Group", card:"Zaman Arcade", ar:"زمان أركيد", type:"Prepaid card", color:"#4B2E83", initial:"Z", submitted:"1h ago", by:"Yara Nassar",
      diff:{ field:"Bonus tier", from:"Load JOD 100+ → 10% bonus", to:"Load JOD 100+ → 12% bonus" }, impact:"241 live passes update silently. Stored balances and bonus lots already granted are untouched — the new tier applies to top-ups made after approval only." }
  ],
  leads: [
    { name:"Louma Chocolate", ar:"لوما", stage:"Invited", note:"WhatsApp opened yesterday — no password yet", owner:"Reem Louma", by:"Omar" },
    { name:"Tuta Juice", ar:"توتة", stage:"Demo booked", note:"Thursday 11:00 · Swefieh branch", owner:"Zain Tuta", by:"Omar" },
    /* SEEDED AT WON, AND NOT ONE STEP FURTHER. This lead is the head of the chain
       the demo walks: convert → invite → password → activate → first card → review.
       Every one of those happens live, in front of the prospect, on a fresh browser.
       A note that says the card is already in review asserts an event no code path
       has run — there is no account, no card and nothing in Omar's queue when this
       file loads — so it is a sentence contradicting the empty screen beside it.
       What is true at Won: Lina closed it, and nothing has been sent yet. */
    { name:"Al-Quds Falafel", ar:"فلافل القدس", stage:"Won", note:"Closed on the call — not converted yet, no invite sent", owner:"Abu Shadi", by:"Lina" },
    { name:"Baraka Style", ar:"بركة", stage:"Cold", note:"Asked to call back after Eid", owner:"Mona Baraka", by:"Sami" },
    { name:"Deema Nails", ar:"ديما", stage:"Negotiating", note:"Wants Growth at Starter price — escalate", owner:"Deema K.", by:"Lina" }
  ],
  leaderboard: [ ["Omar", 6], ["Lina", 4], ["Sami", 3] ],
  /* What that counts, said out loud so it cannot be read against the billing book: ACTIVATIONS
     THIS MONTH, platform-wide — thirteen across all 47 accounts, against a quota of eight a rep.
     It is not a count of the eight accounts listed above. None of July's thirteen are among them;
     the last account here to sign was Petra Gym on 17 Feb 2026. Of these eight, five signed inside
     the trailing twelve months — Omar 2, Lina 3 — which is a subset of the thirteen, not a
     contradiction of them. Sami's three are outside this book; he MANAGES Petra and Qamar, both
     handed to him by Lina after signature, and `manager` is not `signedBy`. See console.billing
     .salesReconciliation, which carries the same three sentences as data. */
  leaderboardBasis: "Activations this month, platform-wide across 47 accounts. Quota is 8 a rep. Not a count of the eight accounts in this console's book.",
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
    totals:{ accounts:47, active:45, cardsLive:62, passes:18661 }
  },

  /* Wasla billing — the money behind console.accounts. All numbers reconcile.
     Joined to console.accounts by `name` — the same key every cross-surface read uses.
     One source for money: nothing here is duplicated onto the account rows.

     THE CLOCK. Today is 30 Jul 2026 and every derived figure in this file is measured from that
     date — outstanding, overdue, days late, days away, which invoices exist at all. It is the same
     clock the console's renewal countdown runs on, and the two are asserted against each other:
     `renewals` below carries the same day counts the console shows (6, 13, 31, 46, 54, 65, 124)
     and the same due / not-yet-due verdict from the same rule. The August invoices have not been
     raised yet — they go out on the 1st — so they are in the forecast, not in the book.

     How to read this file:
     · Money is JOD. Subscription amounts are whole dinars — the price list has no fils, so no
       invoice does either. The tax split does carry fils, because 16% of a whole dinar is not one.
       Averages are rounded once, at the end, half-up: JOD to 2 decimals, tax to 3, percentages
       and day counts to 1.
     · Prices are TAX-INCLUSIVE. JOD 25 / 79 / 149 are what the client pays; the 16% Jordanian
       general sales tax is inside that figure, shown on the invoice as net + tax. This is why MRR
       is 531 and not 616 — the tax was always in there, it just was not written down.
     · Billing is monthly, in advance, net 14. The first invoice is raised on the signature date;
       from the following month it aligns to the 1st. No pro-rata.
     · `renewal` in console.accounts is the annual term date — when the contract re-commits and
       the card quota re-arms. It is not an invoice date and no cash moves on it. Invoices are
       monthly regardless. That is why this file keeps `cashForecast90` and `renewals` apart and
       names them differently: one is money, the other is a calendar.
     · TAX BASIS — one rule, all eight accounts, no exceptions. `totals.netJod` + `totals.taxJod`
       equals `totals.lifetimeBilledJod` exactly, in fils. The split is stated on what was BILLED,
       never on what was collected, because it sits on the same card as the "Lifetime billed" tile
       and directly above the invoice rows it is the sum of. A credit note is never netted into it.
       Each one is its own line in `creditNotes[]` carrying its own negative net/tax, and the totals
       repeat that split as `creditedNetJod` / `creditedTaxJod` — zero on seven accounts, present on
       all eight so no screen has to look up a key that might not be there — so the subtraction can
       be SHOWN rather than silently already done:
           net after credits = netJod + creditedNetJod;  tax after credits = taxJod + creditedTaxJod
       Nara Pharmacy is the only account where the two differ. Billed 549 = 473.274 + 75.726; after
       CN-2026-0001 the collected 524 = 451.722 + 72.278. Both are true, and only the first belongs
       in a tile labelled from the billed book.
     · daysLate is measured against dueOn, not the issue date. Negative = paid early. For an unpaid
       invoice it is days past due as of 30 Jul 2026; for a written-off one, days from due to the
       write-off. daysToPay is issue date to payment — that is the number the averages use.
     · `signedBy` is the rep who closed the deal. It is not `manager` in console.accounts —
       Petra and Qamar were closed by Lina and later handed to Sami. It is also not the console
       leaderboard, which counts something else entirely; see `salesReconciliation`. */
  billing: {
    asOf: "30 Jul 2026", currency: "JOD", termsNetDays: 14,
    /* mirrors console.planPrice — kept here so this file checks itself. Do not diverge. */
    planPrice: { Starter: 25, Growth: 79, Unlimited: 149 },

    /* Jordanian general sales tax, 16% on services. The list price includes it. Every invoice
       below therefore carries netJod + taxJod = amountJod, exactly, in fils. */
    tax: {
      regime: "Jordan general sales tax", ratePct: 16, inclusive: true,
      registrationNo: "20047315",
      authority: "Income and Sales Tax Department, Amman",
      legalEntity: "Wasla for Information Technology L.L.C.",
      invoiceLine: "Prices include 16% general sales tax. Tax registration 20047315.",
      invoiceLineAr: "الأسعار شاملة ضريبة المبيعات العامة 16٪. الرقم الضريبي 20047315.",
      note: "Inclusive, not exclusive — chosen so the price a client is quoted is the price they pay. The net and the tax are shown on every invoice and add back to the headline. Nothing about MRR, ARR or the walk moves because of this: those are stated gross, as the client experiences them.",
      split: { 15: { netJod: 12.931, taxJod: 2.069 }, 25: { netJod: 21.552, taxJod: 3.448 }, 79: { netJod: 68.103, taxJod: 10.897 }, 149: { netJod: 128.448, taxJod: 20.552 } },
      filing: {
        basis: "Bi-monthly return to the Income and Sales Tax Department.",
        lastFiled: { period: "May–Jun 2026", filedOn: "28 Jul 2026",
          taxOnInvoicesJod: 164.83, creditNotesJod: -3.448, badDebtReliefJod: -6.896, declaredJod: 154.486,
          note: "Bad-debt relief is the tax inside Bayt Books' two written-off invoices, reclaimed in the period the debt was written off." },
        open: { period: "Jul–Aug 2026", dueBy: "28 Sep 2026", taxOnInvoicesToDateJod: 80.691,
          note: "July only. The August invoices are raised on 1 Aug and will land in this same return." }
      },
      /* Cash basis, and the name is meant literally: the tax inside invoices that were actually
         PAID, net of the one credit note. 664.282 of the 678.074 billed. The 6.896 inside Bayt
         Books' two write-offs was reclaimed as bad-debt relief and the 3.448 inside Wared Flowers'
         unpaid July invoice has been raised but not collected — that is the whole of the gap.
         The returns are filed on what was INVOICED, not on this: 678.074 − 3.448 − 6.896 = 667.730
         across the life of the book. Two bases, both true, and neither borrows the other's label. */
      lifetimeCollectedTaxJod: 664.282
    },

    /* Off-list money. Three lines in eighteen months, each one signed by a named person, each one
       traceable to the invoices it touched. A price list that is never departed from is not a
       price list, it is a rumour. */
    concessions: [
      { kind: "founding rate", account: "Tala Hospitality Group", from: "14 Mar 2025", to: "31 Aug 2025",
        listJod: 25, chargedJod: 15, monthsAffected: 6, givenUpJod: 60, agreedBy: "Omar",
        why: "The first customer, signed before there was a product to point at. Six months at JOD 15, then list. It ended on the date it said it would.",
        showsUpAs: "Mar–Aug 2025 invoices at 15; the return to list is the JOD 10 expansion in the Sep 2025 MRR row." },
      { kind: "goodwill credit", account: "Nara Pharmacy", on: "1 May 2026", ref: "CN-2026-0001",
        listJod: 79, chargedJod: 54, monthsAffected: 1, givenUpJod: 25, agreedBy: "Omar",
        why: "Wasla sent the March invoice to an address Nara had already replaced. It aged 43 days for a reason that was ours. One month at a third off, once.",
        showsUpAs: "Credit note CN-2026-0001 against the May 2026 invoice. MRR does not move — the plan price never changed." },
      { kind: "quota carried at the lower price", account: "Petra Gym", from: "1 Aug 2026", to: "30 Aug 2026",
        listJod: 79, chargedJod: 25, monthsAffected: 1, givenUpJod: 54, agreedBy: "Sami",
        why: "The downgrade drops the price on the 1 Aug invoice. The Growth TERM runs to the 30 Aug renewal, which is the date the quota re-arms at Starter's three — so August is a Growth term at Starter money.",
        showsUpAs: "Not an invoice line — a month of Growth given away, knowingly, to keep an account that was going to leave. Recorded here so nobody later reads the Aug price as an error. In practice it costs nothing: Petra has run one card since February." }
    ],

    /* Why the book stopped taking on new names, said out loud rather than left as a hole in the
       chart. The console pipeline is the other half of this answer. */
    newBusiness: {
      lastSigning: { account: "Petra Gym", on: "17 Feb 2026" },
      daysSince: 163,
      reason: "Ramadan ran 18 Feb – 19 Mar 2026 and shut the top of the funnel: no demos were booked, nothing was signed, and the two weeks of Eid after it were no better. The pipeline restarted in April and the next name is already won — Al-Quds Falafel, closed by Lina, not yet billed.",
      /* Says only what a signature makes true. The activation, the first card and the
         approval all happen at runtime, so nothing here may claim them — and nothing
         here needs to: the point of this block is that a won deal is not revenue, and
         that is as true after activation as before it. */
      wonNotBilled: [
        { name: "Al-Quds Falafel", ar: "فلافل القدس", stage: "Won", by: "Lina",
          note: "Closed-won by Lina. No invoice has been raised, so it is not in MRR and will not be until one is — activating an account does not raise one. A won deal is not revenue." }
      ],
      /* SCOPED ON INVOICES, NOT ON WHAT THE REGISTER SHOWS. This said "the eight
         accounts the console lists", and the console stops listing eight the moment
         Omar activates one — the register beside it reads "Showing all 9". The book
         is still eight, because an activation raises no invoice; so say the thing
         the activation cannot falsify.
         The 47 is ATTRIBUTED for the same reason. It is health.totals.accounts, a
         seed fixture, and the accounts screen adds this console's own activations to
         it — so after Omar's click that heading reads 48. A bare "the platform carries
         47" would be a frozen count contradicting a derived one two screens away;
         naming where the 47 comes from makes it a quotation instead of a claim. */
      note: "This is a gap in THIS book, which is the eight accounts that have ever been invoiced — not in the platform, which the console's health block puts at 47. Activating an account adds a row to the console register and none here; an account joins this book on its first invoice. See salesReconciliation."
    },

    /* The leaderboard and this file count different things and both are right. Written here because
       they sit in the same console under the same login, and a founder is entitled to know why
       Sami has three wins on one screen and none on the other. */
    salesReconciliation: {
      bookScope: "These eight accounts are the ones this book has ever invoiced — the console register lists more as soon as an account is activated, because activation raises no invoice. The platform runs 47 (console.health.totals.accounts).",
      signedByInThisBook: { Omar: 3, Lina: 5, Sami: 0 },
      signedByInThisBookTrailing12mo: { Omar: 2, Lina: 3, Sami: 0 },
      leaderboardCounts: "Activations this month, platform-wide — 13 across all 47 accounts, against a quota of 8 a rep. Omar 6, Lina 4, Sami 3.",
      whySamiHasNoneHere: "None of July's thirteen activations are in this eight-account sample; the last account here to sign was Petra Gym on 17 Feb 2026. Sami's three are outside it. He manages Petra and Qamar — both handed over from Lina after signature — which is `manager`, not `signedBy`.",
      check: "5 of the 8 accounts here signed inside the trailing twelve months (Omar 2, Lina 3). That is a subset of the leaderboard's 13, not a contradiction of it."
    },

    accounts: [
      /* The founding account and the model payer. Seventeen invoices, seventeen settled: the
         transfer lands two to ten days after the invoice, wider in the months when the banks were
         shut. The first six months were billed at the founding-customer rate of JOD 15; that rate
         ended on schedule in September 2025 and the MRR walk carries the JOD 10 back as expansion,
         labelled for what it is. */
      { name:"Tala Hospitality Group", ar:"مجموعة تالا", initial:"T", plan:"Growth", state:"active", mrrJod:79,
        since:"14 Mar 2025", signedBy:"Omar", paymentMethod:"Bank transfer",
        billingContact: { name:"Rana Odeh", ar:"رنا عودة", email:"rana@talagroup.jo", phone:"+962 79 555 0101" },
        planHistory: [
          { on:"14 Mar 2025", plan:"Starter", priceMonthly:15, listMonthly:25, note:"signed — one card, Rainbow St. Founding-customer rate: JOD 15 a month for the first six months against a list price of JOD 25, then list. Agreed in writing, not a standing discount. priceMonthly is the price actually in force, which is why it is 15 and not 25 — the six Mar–Aug 2025 invoices beneath this row are all at 15." },
          { on:"1 Sep 2025", plan:"Starter", priceMonthly:25, listMonthly:25, note:"founding rate ended on schedule — JOD 15 back to list at JOD 25. The plan did not change; only the price did. That JOD 10 is the same JOD 10 the Sep 2025 MRR row books as expansion and the step chart steps up." },
          { on:"1 Nov 2025", plan:"Growth", priceMonthly:79, listMonthly:79, note:"upgraded — added 3 cards, quota 3 → 10" }
        ],
        totals: { invoices:17, firstInvoice:"Mar 2025", lastInvoice:"Jul 2026",
                  lifetimeBilledJod:851, lifetimeCollectedJod:851, creditedJod:0,
                  outstandingJod:0, writtenOffJod:0, avgDaysToPay:4.6,
                  netJod:733.617, taxJod:117.383, creditedNetJod:0, creditedTaxJod:0 },
        invoices: [
          { ref:"INV-2025-0001", period:"Mar 2025", issued:"14 Mar 2025", dueOn:"28 Mar 2025", amountJod:15, netJod:12.931, taxJod:2.069, plan:"Starter", state:"paid", paidOn:"18 Mar 2025", daysLate:-10, daysToPay:4, method:"Bank transfer" },
          { ref:"INV-2025-0002", period:"Apr 2025", issued:"1 Apr 2025", dueOn:"15 Apr 2025", amountJod:15, netJod:12.931, taxJod:2.069, plan:"Starter", state:"paid", paidOn:"3 Apr 2025", daysLate:-12, daysToPay:2, method:"Bank transfer" },
          { ref:"INV-2025-0003", period:"May 2025", issued:"1 May 2025", dueOn:"15 May 2025", amountJod:15, netJod:12.931, taxJod:2.069, plan:"Starter", state:"paid", paidOn:"6 May 2025", daysLate:-9, daysToPay:5, method:"Bank transfer" },
          { ref:"INV-2025-0005", period:"Jun 2025", issued:"1 Jun 2025", dueOn:"15 Jun 2025", amountJod:15, netJod:12.931, taxJod:2.069, plan:"Starter", state:"paid", paidOn:"9 Jun 2025", daysLate:-6, daysToPay:8, method:"Bank transfer", note:"Eid al-Adha — the banks were shut for four days" },
          { ref:"INV-2025-0007", period:"Jul 2025", issued:"1 Jul 2025", dueOn:"15 Jul 2025", amountJod:15, netJod:12.931, taxJod:2.069, plan:"Starter", state:"paid", paidOn:"3 Jul 2025", daysLate:-12, daysToPay:2, method:"Bank transfer" },
          { ref:"INV-2025-0010", period:"Aug 2025", issued:"1 Aug 2025", dueOn:"15 Aug 2025", amountJod:15, netJod:12.931, taxJod:2.069, plan:"Starter", state:"paid", paidOn:"5 Aug 2025", daysLate:-10, daysToPay:4, method:"Bank transfer" },
          { ref:"INV-2025-0013", period:"Sep 2025", issued:"1 Sep 2025", dueOn:"15 Sep 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"4 Sep 2025", daysLate:-11, daysToPay:3, method:"Bank transfer" },
          { ref:"INV-2025-0017", period:"Oct 2025", issued:"1 Oct 2025", dueOn:"15 Oct 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"7 Oct 2025", daysLate:-8, daysToPay:6, method:"Bank transfer" },
          { ref:"INV-2025-0021", period:"Nov 2025", issued:"1 Nov 2025", dueOn:"15 Nov 2025", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"4 Nov 2025", daysLate:-11, daysToPay:3, method:"Bank transfer" },
          { ref:"INV-2025-0026", period:"Dec 2025", issued:"1 Dec 2025", dueOn:"15 Dec 2025", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"8 Dec 2025", daysLate:-7, daysToPay:7, method:"Bank transfer" },
          { ref:"INV-2026-0001", period:"Jan 2026", issued:"1 Jan 2026", dueOn:"15 Jan 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"5 Jan 2026", daysLate:-10, daysToPay:4, method:"Bank transfer" },
          { ref:"INV-2026-0008", period:"Feb 2026", issued:"1 Feb 2026", dueOn:"15 Feb 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"3 Feb 2026", daysLate:-12, daysToPay:2, method:"Bank transfer" },
          { ref:"INV-2026-0016", period:"Mar 2026", issued:"1 Mar 2026", dueOn:"15 Mar 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"11 Mar 2026", daysLate:-4, daysToPay:10, method:"Bank transfer", note:"Ramadan bank hours — the transfer sat a week" },
          { ref:"INV-2026-0024", period:"Apr 2026", issued:"1 Apr 2026", dueOn:"15 Apr 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"7 Apr 2026", daysLate:-8, daysToPay:6, method:"Bank transfer" },
          { ref:"INV-2026-0032", period:"May 2026", issued:"1 May 2026", dueOn:"15 May 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"5 May 2026", daysLate:-10, daysToPay:4, method:"Bank transfer" },
          { ref:"INV-2026-0040", period:"Jun 2026", issued:"1 Jun 2026", dueOn:"15 Jun 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"3 Jun 2026", daysLate:-12, daysToPay:2, method:"Bank transfer" },
          { ref:"INV-2026-0047", period:"Jul 2026", issued:"1 Jul 2026", dueOn:"15 Jul 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"8 Jul 2026", daysLate:-7, daysToPay:7, method:"Bank transfer" }
        ] },
      /* Card on file — charged the moment the invoice is raised, so days-to-pay is zero in ten
         months of eleven. February is the exception: the stored card had expired, the first attempt
         was declined, and the charge captured two days later once Samer re-authorised. Nothing has
         ever gone past its due date. The April jump to 149 is the expansion spike. */
      { name:"Rawi Coffee House", ar:"بيت راوي", initial:"R", plan:"Unlimited", state:"active", mrrJod:149,
        since:"9 Sep 2025", signedBy:"Lina", paymentMethod:"Card on file",
        billingContact: { name:"Samer Rawi", ar:"سامر الراوي", email:"samer@rawicoffee.jo", phone:"+962 79 555 0122" },
        planHistory: [
          { on:"9 Sep 2025", plan:"Growth", priceMonthly:79, listMonthly:79, note:"signed — came in on Growth, 4 cards in the first week" },
          { on:"1 Apr 2026", plan:"Unlimited", priceMonthly:149, listMonthly:149, note:"upgraded — not for cards. Rawi runs 8 of the 10 Growth allows and has never asked for an eleventh. Growth caps broadcasts at 10 a month and Rawi hit the cap in January, February and March; Unlimited lifts it. The JOD 70 buys sends, not card slots." }
        ],
        totals: { invoices:11, firstInvoice:"Sep 2025", lastInvoice:"Jul 2026",
                  lifetimeBilledJod:1149, lifetimeCollectedJod:1149, creditedJod:0,
                  outstandingJod:0, writtenOffJod:0, avgDaysToPay:0.2,
                  netJod:990.513, taxJod:158.487, creditedNetJod:0, creditedTaxJod:0 },
        invoices: [
          { ref:"INV-2025-0016", period:"Sep 2025", issued:"9 Sep 2025", dueOn:"23 Sep 2025", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"9 Sep 2025", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2025-0018", period:"Oct 2025", issued:"1 Oct 2025", dueOn:"15 Oct 2025", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"1 Oct 2025", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2025-0022", period:"Nov 2025", issued:"1 Nov 2025", dueOn:"15 Nov 2025", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"1 Nov 2025", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2025-0027", period:"Dec 2025", issued:"1 Dec 2025", dueOn:"15 Dec 2025", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"1 Dec 2025", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2026-0002", period:"Jan 2026", issued:"1 Jan 2026", dueOn:"15 Jan 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"1 Jan 2026", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2026-0009", period:"Feb 2026", issued:"1 Feb 2026", dueOn:"15 Feb 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"3 Feb 2026", daysLate:-12, daysToPay:2, method:"Card on file", note:"first attempt declined — the card on file had expired. Samer re-authorised the same card on 3 Feb and the charge captured." },
          { ref:"INV-2026-0017", period:"Mar 2026", issued:"1 Mar 2026", dueOn:"15 Mar 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"1 Mar 2026", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2026-0025", period:"Apr 2026", issued:"1 Apr 2026", dueOn:"15 Apr 2026", amountJod:149, netJod:128.448, taxJod:20.552, plan:"Unlimited", state:"paid", paidOn:"1 Apr 2026", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2026-0033", period:"May 2026", issued:"1 May 2026", dueOn:"15 May 2026", amountJod:149, netJod:128.448, taxJod:20.552, plan:"Unlimited", state:"paid", paidOn:"1 May 2026", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2026-0041", period:"Jun 2026", issued:"1 Jun 2026", dueOn:"15 Jun 2026", amountJod:149, netJod:128.448, taxJod:20.552, plan:"Unlimited", state:"paid", paidOn:"1 Jun 2026", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2026-0048", period:"Jul 2026", issued:"1 Jul 2026", dueOn:"15 Jul 2026", amountJod:149, netJod:128.448, taxJod:20.552, plan:"Unlimited", state:"paid", paidOn:"1 Jul 2026", daysLate:-14, daysToPay:0, method:"Card on file" }
        ] },
      /* One month out of nine went badly, and it was our fault: the March invoice was sent to an
         address Nara had already replaced, nobody saw it, and it settled 43 days past due on 27 Apr.
         A JOD 25 goodwill credit went against May. Every other month is two to six days. */
      { name:"Nara Pharmacy", ar:"صيدلية نارة", initial:"N", plan:"Growth", state:"active", mrrJod:79,
        since:"3 Nov 2025", signedBy:"Omar", paymentMethod:"Bank transfer",
        billingContact: { name:"Reem Nasser", ar:"ريم ناصر", email:"reem@narapharmacy.jo", phone:"+962 77 555 0135" },
        planHistory: [
          { on:"3 Nov 2025", plan:"Starter", priceMonthly:25, listMonthly:25, note:"signed" },
          { on:"1 Feb 2026", plan:"Growth", priceMonthly:79, listMonthly:79, note:"upgraded — second and third branch card" }
        ],
        totals: { invoices:9, firstInvoice:"Nov 2025", lastInvoice:"Jul 2026",
                  lifetimeBilledJod:549, lifetimeCollectedJod:524, creditedJod:25,
                  outstandingJod:0, writtenOffJod:0, avgDaysToPay:9.7,
                  /* Billed basis, like every other account: 473.274 + 75.726 = 549 = lifetimeBilledJod,
                     the exact sum of the nine invoice rows below. The JOD 25 credit note is NOT netted
                     in here — it is CN-2026-0001 below with its own split, repeated on the next line so
                     the screen can print the subtraction. Net after credits 451.722 + tax after credits
                     72.278 = 524 = lifetimeCollectedJod. */
                  netJod:473.274, taxJod:75.726, creditedNetJod:-21.552, creditedTaxJod:-3.448 },
        invoices: [
          { ref:"INV-2025-0025", period:"Nov 2025", issued:"3 Nov 2025", dueOn:"17 Nov 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"6 Nov 2025", daysLate:-11, daysToPay:3, method:"Bank transfer" },
          { ref:"INV-2025-0028", period:"Dec 2025", issued:"1 Dec 2025", dueOn:"15 Dec 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"4 Dec 2025", daysLate:-11, daysToPay:3, method:"Bank transfer" },
          { ref:"INV-2026-0003", period:"Jan 2026", issued:"1 Jan 2026", dueOn:"15 Jan 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"6 Jan 2026", daysLate:-9, daysToPay:5, method:"Bank transfer" },
          { ref:"INV-2026-0010", period:"Feb 2026", issued:"1 Feb 2026", dueOn:"15 Feb 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"3 Feb 2026", daysLate:-12, daysToPay:2, method:"Bank transfer" },
          { ref:"INV-2026-0018", period:"Mar 2026", issued:"1 Mar 2026", dueOn:"15 Mar 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"27 Apr 2026", daysLate:43, daysToPay:57, method:"Bank transfer", note:"sent to a superseded address — Reem never saw it. Wasla’s error, chased on 22 Apr, settled 27 Apr." },
          { ref:"INV-2026-0026", period:"Apr 2026", issued:"1 Apr 2026", dueOn:"15 Apr 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"7 Apr 2026", daysLate:-8, daysToPay:6, method:"Bank transfer" },
          { ref:"INV-2026-0034", period:"May 2026", issued:"1 May 2026", dueOn:"15 May 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"5 May 2026", daysLate:-10, daysToPay:4, method:"Bank transfer", note:"JOD 25 goodwill credit applied against this invoice — see CN-2026-0001. Cash received: JOD 54." },
          { ref:"INV-2026-0042", period:"Jun 2026", issued:"1 Jun 2026", dueOn:"15 Jun 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"3 Jun 2026", daysLate:-12, daysToPay:2, method:"Bank transfer" },
          { ref:"INV-2026-0049", period:"Jul 2026", issued:"1 Jul 2026", dueOn:"15 Jul 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"6 Jul 2026", daysLate:-9, daysToPay:5, method:"Bank transfer" }
        ],
        creditNotes: [
          { ref:"CN-2026-0001", on:"1 May 2026", amountJod:-25, netJod:-21.552, taxJod:-3.448, appliedTo:"May 2026", reason:"Goodwill. The March invoice went to an address Nara had already replaced, so it aged 43 days past its due date for a reason that was ours, not theirs. One month at a third off, once, agreed by Omar." }
        ] },
      /* Joint-largest account by price, cleanest by behaviour: Unlimited from day one, card on
         file, seven invoices, seven same-day captures. It pays JOD 70 a month over Growth for a
         dedicated Apple certificate, which is stated on the plan record so the price is never read
         as an account that was oversold. */
      { name:"Marmar Lounge", ar:"مرمر لاونج", initial:"M", plan:"Unlimited", state:"active", mrrJod:149,
        since:"5 Jan 2026", signedBy:"Lina", paymentMethod:"Card on file",
        billingContact: { name:"Dana Malas", ar:"دانا ملص", email:"dana@marmarlounge.jo", phone:"+962 78 555 0148" },
        planHistory: [
          { on:"5 Jan 2026", plan:"Unlimited", priceMonthly:149, listMonthly:149, note:"signed straight onto Unlimited with four cards, which Growth would have covered. The reason is not quota: Marmar is the only account on the platform with its own Apple Wallet certificate, issued in its own name and renewing 2 Feb 2027, and a dedicated certificate is an Unlimited-only term. Hani asked for it so the passes say Marmar and not Wasla. The JOD 70 over Growth is the certificate, not headroom." }
        ],
        totals: { invoices:7, firstInvoice:"Jan 2026", lastInvoice:"Jul 2026",
                  lifetimeBilledJod:1043, lifetimeCollectedJod:1043, creditedJod:0,
                  outstandingJod:0, writtenOffJod:0, avgDaysToPay:0,
                  netJod:899.136, taxJod:143.864, creditedNetJod:0, creditedTaxJod:0 },
        invoices: [
          { ref:"INV-2026-0007", period:"Jan 2026", issued:"5 Jan 2026", dueOn:"19 Jan 2026", amountJod:149, netJod:128.448, taxJod:20.552, plan:"Unlimited", state:"paid", paidOn:"5 Jan 2026", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2026-0011", period:"Feb 2026", issued:"1 Feb 2026", dueOn:"15 Feb 2026", amountJod:149, netJod:128.448, taxJod:20.552, plan:"Unlimited", state:"paid", paidOn:"1 Feb 2026", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2026-0019", period:"Mar 2026", issued:"1 Mar 2026", dueOn:"15 Mar 2026", amountJod:149, netJod:128.448, taxJod:20.552, plan:"Unlimited", state:"paid", paidOn:"1 Mar 2026", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2026-0027", period:"Apr 2026", issued:"1 Apr 2026", dueOn:"15 Apr 2026", amountJod:149, netJod:128.448, taxJod:20.552, plan:"Unlimited", state:"paid", paidOn:"1 Apr 2026", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2026-0035", period:"May 2026", issued:"1 May 2026", dueOn:"15 May 2026", amountJod:149, netJod:128.448, taxJod:20.552, plan:"Unlimited", state:"paid", paidOn:"1 May 2026", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2026-0043", period:"Jun 2026", issued:"1 Jun 2026", dueOn:"15 Jun 2026", amountJod:149, netJod:128.448, taxJod:20.552, plan:"Unlimited", state:"paid", paidOn:"1 Jun 2026", daysLate:-14, daysToPay:0, method:"Card on file" },
          { ref:"INV-2026-0050", period:"Jul 2026", issued:"1 Jul 2026", dueOn:"15 Jul 2026", amountJod:149, netJod:128.448, taxJod:20.552, plan:"Unlimited", state:"paid", paidOn:"1 Jul 2026", daysLate:-14, daysToPay:0, method:"Card on file" }
        ] },
      /* Habitually four to eleven days past the due date — never a bad debt, always a chase. June
         is the exception and it is the useful one: Sami phoned on the 8th and the money arrived four
         days early. July went straight back over. Petra is on Starter as of 27 Jul; the price moves
         on the 1 Aug invoice, so all six invoices here are at Growth. */
      { name:"Petra Gym", ar:"نادي البتراء", initial:"P", plan:"Starter", state:"active", mrrJod:25,
        since:"17 Feb 2026", signedBy:"Lina", paymentMethod:"Bank transfer",
        billingContact: { name:"Odai Masri", ar:"عدي المصري", email:"odai@petragym.jo", phone:"+962 77 555 0156" },
        planHistory: [
          { on:"17 Feb 2026", plan:"Growth", priceMonthly:79, listMonthly:79, note:"signed on Growth. Odai bought for a plan he described at the demo: one card per branch across four sites by summer. The second branch never opened, and Petra has run a single card for five months." },
          { on:"27 Jul 2026", plan:"Starter", priceMonthly:25, listMonthly:25, effectiveFrom:"1 Aug 2026", note:"downgraded at the client’s request — one card is all they use. Sami made the change on 27 Jul and the account is on Starter from that moment; the price only moves on the next invoice, so the 1 Aug run is the first at JOD 25 and every invoice in this book is still at Growth. The Growth TERM runs to the 30 Aug renewal, which is the date the quota re-arms at Starter’s three. Petra therefore gets August on a Growth term at Starter money — JOD 54 given away, knowingly, to keep an account that was going to leave. In practice it costs nothing: Petra has run one card since February." }
        ],
        totals: { invoices:6, firstInvoice:"Feb 2026", lastInvoice:"Jul 2026",
                  lifetimeBilledJod:474, lifetimeCollectedJod:474, creditedJod:0,
                  outstandingJod:0, writtenOffJod:0, avgDaysToPay:18.8,
                  netJod:408.618, taxJod:65.382, creditedNetJod:0, creditedTaxJod:0 },
        invoices: [
          { ref:"INV-2026-0015", period:"Feb 2026", issued:"17 Feb 2026", dueOn:"3 Mar 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"10 Mar 2026", daysLate:7, daysToPay:21, method:"Bank transfer" },
          { ref:"INV-2026-0020", period:"Mar 2026", issued:"1 Mar 2026", dueOn:"15 Mar 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"19 Mar 2026", daysLate:4, daysToPay:18, method:"Bank transfer" },
          { ref:"INV-2026-0028", period:"Apr 2026", issued:"1 Apr 2026", dueOn:"15 Apr 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"26 Apr 2026", daysLate:11, daysToPay:25, method:"Bank transfer" },
          { ref:"INV-2026-0036", period:"May 2026", issued:"1 May 2026", dueOn:"15 May 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"21 May 2026", daysLate:6, daysToPay:20, method:"Bank transfer" },
          { ref:"INV-2026-0044", period:"Jun 2026", issued:"1 Jun 2026", dueOn:"15 Jun 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"11 Jun 2026", daysLate:-4, daysToPay:10, method:"Bank transfer", note:"Sami called on 8 Jun; Odai paid four days before the due date. It did not hold — July went back over." },
          { ref:"INV-2026-0051", period:"Jul 2026", issued:"1 Jul 2026", dueOn:"15 Jul 2026", amountJod:79, netJod:68.103, taxJod:10.897, plan:"Growth", state:"paid", paidOn:"20 Jul 2026", daysLate:5, daysToPay:19, method:"Bank transfer" }
        ] },
      /* Cash, collected by the rep on the Amman route in the first days of the month. The three
         months at six and nine days are the route slipping, not the client. Cash on a Friday or a
         Saturday is a rep with a receipt book, not a bank — those dates are real. */
      { name:"Qamar Sweets", ar:"حلويات قمر", initial:"Q", plan:"Starter", state:"active", mrrJod:25,
        since:"6 May 2025", signedBy:"Lina", paymentMethod:"Cash — collected by the rep",
        billingContact: { name:"Abeer Qamar", ar:"عبير قمر", email:"abeer@qamarsweets.jo", phone:"+962 79 555 0163" },
        planHistory: [
          { on:"6 May 2025", plan:"Starter", priceMonthly:25, listMonthly:25, note:"signed" }
        ],
        totals: { invoices:15, firstInvoice:"May 2025", lastInvoice:"Jul 2026",
                  lifetimeBilledJod:375, lifetimeCollectedJod:375, creditedJod:0,
                  outstandingJod:0, writtenOffJod:0, avgDaysToPay:2.6,
                  netJod:323.28, taxJod:51.72, creditedNetJod:0, creditedTaxJod:0 },
        invoices: [
          { ref:"INV-2025-0004", period:"May 2025", issued:"6 May 2025", dueOn:"20 May 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"8 May 2025", daysLate:-12, daysToPay:2, method:"Cash — collected by the rep" },
          { ref:"INV-2025-0006", period:"Jun 2025", issued:"1 Jun 2025", dueOn:"15 Jun 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"2 Jun 2025", daysLate:-13, daysToPay:1, method:"Cash — collected by the rep" },
          { ref:"INV-2025-0008", period:"Jul 2025", issued:"1 Jul 2025", dueOn:"15 Jul 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"3 Jul 2025", daysLate:-12, daysToPay:2, method:"Cash — collected by the rep" },
          { ref:"INV-2025-0011", period:"Aug 2025", issued:"1 Aug 2025", dueOn:"15 Aug 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"7 Aug 2025", daysLate:-8, daysToPay:6, method:"Cash — collected by the rep", note:"the rep’s Amman route slipped a week" },
          { ref:"INV-2025-0014", period:"Sep 2025", issued:"1 Sep 2025", dueOn:"15 Sep 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"2 Sep 2025", daysLate:-13, daysToPay:1, method:"Cash — collected by the rep" },
          { ref:"INV-2025-0019", period:"Oct 2025", issued:"1 Oct 2025", dueOn:"15 Oct 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"3 Oct 2025", daysLate:-12, daysToPay:2, method:"Cash — collected by the rep" },
          { ref:"INV-2025-0023", period:"Nov 2025", issued:"1 Nov 2025", dueOn:"15 Nov 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"2 Nov 2025", daysLate:-13, daysToPay:1, method:"Cash — collected by the rep" },
          { ref:"INV-2025-0029", period:"Dec 2025", issued:"1 Dec 2025", dueOn:"15 Dec 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"10 Dec 2025", daysLate:-5, daysToPay:9, method:"Cash — collected by the rep", note:"the rep’s Amman route slipped a week" },
          { ref:"INV-2026-0004", period:"Jan 2026", issued:"1 Jan 2026", dueOn:"15 Jan 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"3 Jan 2026", daysLate:-12, daysToPay:2, method:"Cash — collected by the rep" },
          { ref:"INV-2026-0012", period:"Feb 2026", issued:"1 Feb 2026", dueOn:"15 Feb 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"2 Feb 2026", daysLate:-13, daysToPay:1, method:"Cash — collected by the rep" },
          { ref:"INV-2026-0021", period:"Mar 2026", issued:"1 Mar 2026", dueOn:"15 Mar 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"3 Mar 2026", daysLate:-12, daysToPay:2, method:"Cash — collected by the rep" },
          { ref:"INV-2026-0029", period:"Apr 2026", issued:"1 Apr 2026", dueOn:"15 Apr 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"2 Apr 2026", daysLate:-13, daysToPay:1, method:"Cash — collected by the rep" },
          { ref:"INV-2026-0037", period:"May 2026", issued:"1 May 2026", dueOn:"15 May 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"7 May 2026", daysLate:-8, daysToPay:6, method:"Cash — collected by the rep", note:"the rep’s Amman route slipped a week" },
          { ref:"INV-2026-0045", period:"Jun 2026", issued:"1 Jun 2026", dueOn:"15 Jun 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"3 Jun 2026", daysLate:-12, daysToPay:2, method:"Cash — collected by the rep" },
          { ref:"INV-2026-0052", period:"Jul 2026", issued:"1 Jul 2026", dueOn:"15 Jul 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"2 Jul 2026", daysLate:-13, daysToPay:1, method:"Cash — collected by the rep" }
        ] },
      /* Read this one top to bottom — it is why the account is at-risk, and it was visible here
         months before the state flag caught up. Days-to-pay: 2, 5, 12, 17, 23 — then Omar drove out
         on 4 May and the next month came in at 4. That is the whole point: the chase worked, once.
         June then took 44 days, July has not been paid at all, and the renewal is on 5 August. */
      { name:"Wared Flowers", ar:"ورد", initial:"W", plan:"Starter", state:"at-risk", mrrJod:25,
        since:"8 Dec 2025", signedBy:"Omar", paymentMethod:"Cash — collected by the rep",
        billingContact: { name:"Dalia Wared", ar:"داليا ورد", email:"dalia@waredflowers.jo", phone:"+962 78 555 0171" },
        planHistory: [
          { on:"8 Dec 2025", plan:"Starter", priceMonthly:25, listMonthly:25, note:"signed" }
        ],
        totals: { invoices:8, firstInvoice:"Dec 2025", lastInvoice:"Jul 2026",
                  lifetimeBilledJod:200, lifetimeCollectedJod:175, creditedJod:0,
                  outstandingJod:25, writtenOffJod:0, avgDaysToPay:15.3,
                  netJod:172.416, taxJod:27.584, creditedNetJod:0, creditedTaxJod:0 },
        invoices: [
          { ref:"INV-2025-0031", period:"Dec 2025", issued:"8 Dec 2025", dueOn:"22 Dec 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"10 Dec 2025", daysLate:-12, daysToPay:2, method:"Cash — collected by the rep" },
          { ref:"INV-2026-0005", period:"Jan 2026", issued:"1 Jan 2026", dueOn:"15 Jan 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"6 Jan 2026", daysLate:-9, daysToPay:5, method:"Cash — collected by the rep" },
          { ref:"INV-2026-0013", period:"Feb 2026", issued:"1 Feb 2026", dueOn:"15 Feb 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"13 Feb 2026", daysLate:-2, daysToPay:12, method:"Cash — collected by the rep" },
          { ref:"INV-2026-0022", period:"Mar 2026", issued:"1 Mar 2026", dueOn:"15 Mar 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"18 Mar 2026", daysLate:3, daysToPay:17, method:"Cash — collected by the rep" },
          { ref:"INV-2026-0030", period:"Apr 2026", issued:"1 Apr 2026", dueOn:"15 Apr 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"24 Apr 2026", daysLate:9, daysToPay:23, method:"Cash — collected by the rep" },
          { ref:"INV-2026-0038", period:"May 2026", issued:"1 May 2026", dueOn:"15 May 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"5 May 2026", daysLate:-10, daysToPay:4, method:"Cash — collected by the rep", note:"Omar drove to the shop on 4 May and Dalia paid the next morning — four days, the fastest month since January." },
          { ref:"INV-2026-0046", period:"Jun 2026", issued:"1 Jun 2026", dueOn:"15 Jun 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"15 Jul 2026", daysLate:30, daysToPay:44, method:"Cash — collected by the rep", note:"back over immediately — 44 days, and it took three visits" },
          { ref:"INV-2026-0053", period:"Jul 2026", issued:"1 Jul 2026", dueOn:"15 Jul 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"overdue", paidOn:null, daysLate:15, daysToPay:null, method:"Cash — collected by the rep" }
        ] },
      /* The churn, and it is eleven invoices — count them here, not in the sentence. Six months
         paid between six and thirteen days, which is ordinary. Then January took 18. Lina phoned on
         4 Feb and February came back at seven — the one clean month inside the slide. March took 42.
         April and May were never going to be paid and were written off at close on 22 May 2026, as a
         loss rather than a hopeful receivable. */
      { name:"Bayt Books", ar:"بيت الكتب", initial:"B", plan:"Starter", state:"closed", mrrJod:0,
        since:"21 Jul 2025", signedBy:"Lina", paymentMethod:"Bank transfer",
        billingContact: { name:"Faris Haddad", ar:"فارس حداد", email:"faris@baytbooks.jo", phone:"+962 77 555 0188" },
        planHistory: [
          { on:"21 Jul 2025", plan:"Starter", priceMonthly:25, listMonthly:25, note:"signed" }
        ],
        totals: { invoices:11, firstInvoice:"Jul 2025", lastInvoice:"May 2026",
                  lifetimeBilledJod:275, lifetimeCollectedJod:225, creditedJod:0,
                  outstandingJod:0, writtenOffJod:50, avgDaysToPay:13.6,
                  netJod:237.072, taxJod:37.928, creditedNetJod:0, creditedTaxJod:0 },
        closedOn:"22 May 2026",
        closeReason:"Shop closed — the Jabal Amman branch did not renew its lease. Passes voided, member list exported to the owner on 22 May 2026.",
        invoices: [
          { ref:"INV-2025-0009", period:"Jul 2025", issued:"21 Jul 2025", dueOn:"4 Aug 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"27 Jul 2025", daysLate:-8, daysToPay:6, method:"Bank transfer" },
          { ref:"INV-2025-0012", period:"Aug 2025", issued:"1 Aug 2025", dueOn:"15 Aug 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"10 Aug 2025", daysLate:-5, daysToPay:9, method:"Bank transfer" },
          { ref:"INV-2025-0015", period:"Sep 2025", issued:"1 Sep 2025", dueOn:"15 Sep 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"8 Sep 2025", daysLate:-7, daysToPay:7, method:"Bank transfer" },
          { ref:"INV-2025-0020", period:"Oct 2025", issued:"1 Oct 2025", dueOn:"15 Oct 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"12 Oct 2025", daysLate:-3, daysToPay:11, method:"Bank transfer" },
          { ref:"INV-2025-0024", period:"Nov 2025", issued:"1 Nov 2025", dueOn:"15 Nov 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"10 Nov 2025", daysLate:-5, daysToPay:9, method:"Bank transfer" },
          { ref:"INV-2025-0030", period:"Dec 2025", issued:"1 Dec 2025", dueOn:"15 Dec 2025", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"14 Dec 2025", daysLate:-1, daysToPay:13, method:"Bank transfer" },
          { ref:"INV-2026-0006", period:"Jan 2026", issued:"1 Jan 2026", dueOn:"15 Jan 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"19 Jan 2026", daysLate:4, daysToPay:18, method:"Bank transfer" },
          { ref:"INV-2026-0014", period:"Feb 2026", issued:"1 Feb 2026", dueOn:"15 Feb 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"8 Feb 2026", daysLate:-7, daysToPay:7, method:"Bank transfer", note:"Lina phoned on 4 Feb. Faris paid the same week — seven days, the fastest month Bayt ever had." },
          { ref:"INV-2026-0023", period:"Mar 2026", issued:"1 Mar 2026", dueOn:"15 Mar 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"paid", paidOn:"12 Apr 2026", daysLate:28, daysToPay:42, method:"Bank transfer" },
          { ref:"INV-2026-0031", period:"Apr 2026", issued:"1 Apr 2026", dueOn:"15 Apr 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"written-off", paidOn:null, daysLate:37, daysToPay:null, method:"Bank transfer", writtenOffOn:"22 May 2026" },
          { ref:"INV-2026-0039", period:"May 2026", issued:"1 May 2026", dueOn:"15 May 2026", amountJod:25, netJod:21.552, taxJod:3.448, plan:"Starter", state:"written-off", paidOn:null, daysLate:7, daysToPay:null, method:"Bank transfer", writtenOffOn:"22 May 2026" }
        ] }
    ],

    /* Company MRR walk, oldest first. mrr[i] = mrr[i-1] + new + expansion − contraction − churn.
       Every non-zero movement carries the account and the date that caused it in `events`, so the
       chart can be clicked through to the account that moved it. MRR is the contracted monthly
       price, stated gross — tax-inclusive, as the client pays it. The Aug 2026 row is booked, not
       billed: Petra's downgrade was signed on 27 Jul and takes effect on the 1 Aug invoice, which
       has not been raised yet. July, at 585, is the last month with cash behind it. */
    mrrHistory: [
      { m:"Mar 2025", accounts:1, mrr:15, newMrr:15, expansionMrr:0, contractionMrr:0, churnedMrr:0,
        events: [
          { kind:"new", account:"Tala Hospitality Group", on:"14 Mar 2025", amountJod:15, detail:"signed on Starter at the founding-customer rate — JOD 15, list is 25" }
        ] },
      { m:"Apr 2025", accounts:1, mrr:15, newMrr:0, expansionMrr:0, contractionMrr:0, churnedMrr:0,
        events: [] },
      { m:"May 2025", accounts:2, mrr:40, newMrr:25, expansionMrr:0, contractionMrr:0, churnedMrr:0,
        events: [
          { kind:"new", account:"Qamar Sweets", on:"6 May 2025", amountJod:25, detail:"signed on Starter" }
        ] },
      { m:"Jun 2025", accounts:2, mrr:40, newMrr:0, expansionMrr:0, contractionMrr:0, churnedMrr:0,
        events: [] },
      { m:"Jul 2025", accounts:3, mrr:65, newMrr:25, expansionMrr:0, contractionMrr:0, churnedMrr:0,
        events: [
          { kind:"new", account:"Bayt Books", on:"21 Jul 2025", amountJod:25, detail:"signed on Starter" }
        ] },
      { m:"Aug 2025", accounts:3, mrr:65, newMrr:0, expansionMrr:0, contractionMrr:0, churnedMrr:0,
        events: [] },
      { m:"Sep 2025", accounts:4, mrr:154, newMrr:79, expansionMrr:10, contractionMrr:0, churnedMrr:0,
        events: [
          { kind:"expansion", account:"Tala Hospitality Group", on:"1 Sep 2025", amountJod:10, detail:"founding-customer rate ended on schedule — JOD 15 back to list at 25. The price moved, the plan did not; it is expansion because the contracted monthly amount went up." },
          { kind:"new", account:"Rawi Coffee House", on:"9 Sep 2025", amountJod:79, detail:"signed on Growth" }
        ] },
      { m:"Oct 2025", accounts:4, mrr:154, newMrr:0, expansionMrr:0, contractionMrr:0, churnedMrr:0,
        events: [] },
      { m:"Nov 2025", accounts:5, mrr:233, newMrr:25, expansionMrr:54, contractionMrr:0, churnedMrr:0,
        events: [
          { kind:"expansion", account:"Tala Hospitality Group", on:"1 Nov 2025", amountJod:54, detail:"Starter → Growth" },
          { kind:"new", account:"Nara Pharmacy", on:"3 Nov 2025", amountJod:25, detail:"signed on Starter" }
        ] },
      { m:"Dec 2025", accounts:6, mrr:258, newMrr:25, expansionMrr:0, contractionMrr:0, churnedMrr:0,
        events: [
          { kind:"new", account:"Wared Flowers", on:"8 Dec 2025", amountJod:25, detail:"signed on Starter" }
        ] },
      { m:"Jan 2026", accounts:7, mrr:407, newMrr:149, expansionMrr:0, contractionMrr:0, churnedMrr:0,
        events: [
          { kind:"new", account:"Marmar Lounge", on:"5 Jan 2026", amountJod:149, detail:"signed on Unlimited — dedicated Apple certificate" }
        ] },
      { m:"Feb 2026", accounts:8, mrr:540, newMrr:79, expansionMrr:54, contractionMrr:0, churnedMrr:0,
        events: [
          { kind:"expansion", account:"Nara Pharmacy", on:"1 Feb 2026", amountJod:54, detail:"Starter → Growth" },
          { kind:"new", account:"Petra Gym", on:"17 Feb 2026", amountJod:79, detail:"signed on Growth" }
        ] },
      { m:"Mar 2026", accounts:8, mrr:540, newMrr:0, expansionMrr:0, contractionMrr:0, churnedMrr:0,
        note:"Ramadan, 18 Feb – 19 Mar. No demos booked, nothing signed — the flat month is a closed funnel, not a missing entry.",
        events: [] },
      { m:"Apr 2026", accounts:8, mrr:610, newMrr:0, expansionMrr:70, contractionMrr:0, churnedMrr:0,
        events: [
          { kind:"expansion", account:"Rawi Coffee House", on:"1 Apr 2026", amountJod:70, detail:"Growth → Unlimited — for the broadcast cap, not the card quota" }
        ] },
      { m:"May 2026", accounts:7, mrr:585, newMrr:0, expansionMrr:0, contractionMrr:0, churnedMrr:25,
        events: [
          { kind:"churn", account:"Bayt Books", on:"22 May 2026", amountJod:25, detail:"closed on Starter" }
        ] },
      { m:"Jun 2026", accounts:7, mrr:585, newMrr:0, expansionMrr:0, contractionMrr:0, churnedMrr:0,
        note:"No new business in this book since Feb. Al-Quds Falafel is won but has no invoice, so it is not here.",
        events: [] },
      { m:"Jul 2026", accounts:7, mrr:585, newMrr:0, expansionMrr:0, contractionMrr:0, churnedMrr:0,
        note:"Last month with cash behind it. Collected JOD 585 between 1 and 30 July.",
        events: [] },
      { m:"Aug 2026", accounts:7, mrr:531, newMrr:0, expansionMrr:0, contractionMrr:54, churnedMrr:0, booked:true,
        note:"Booked, not billed — the 1 Aug run has not gone out. This is what it will bill.",
        events: [
          { kind:"contraction", account:"Petra Gym", on:"1 Aug 2026", amountJod:54, detail:"Growth → Starter — changed on the account 27 Jul, first billed on the 1 Aug invoice" }
        ] }
    ],

    /* Pre-computed so the screen never re-derives money. `gloss` is the line printed under the
       number — say what it is and what moved it, nothing else. */
    summary: {
      mrrNow: { v:531, billedThisMonthJod:585,
        gloss:"The seven live accounts at the plan price each one is on today, added up. Petra Gym moved to Starter on 27 July, so 531 is what the 1 August run will bill; July billed 585, at Petra's old price. Stated gross — the 16% tax is inside it." },
      arrNow: { v:6372,
        gloss:"MRR × 12. A run rate, not booked revenue — nobody has prepaid a year." },
      arpaNow: { v:75.86,
        gloss:"MRR divided by seven live accounts. The two Unlimited accounts pull this well above the Starter crowd." },
      liveAccounts: { v:7,
        gloss:"Paying accounts. Bayt Books closed on 22 May 2026 and is excluded from every live figure." },
      mrrDeltaMonth: { v:-54, pct:-9.2,
        gloss:"Petra Gym went from Growth to Starter on 27 July; the price moves on the 1 August invoice. Nothing else changed, so the whole of it is that one downgrade." },
      collectedThisMonth: { v:585, fromDate:"1 Jul 2026", toDate:"30 Jul 2026",
        gloss:"Cash received in July: six of the seven July invoices, JOD 560, plus Wared Flowers' June invoice at 44 days, JOD 25. It matches July's MRR of 585 by coincidence — one month's arrears came in while one month's invoice stayed out." },
      outstandingNow: { v:25,
        gloss:"Issued and unpaid: Wared Flowers, July, JOD 25. Everything else raised up to today has settled. The August invoices do not exist yet, so they are not here — they are in cashForecast90." },
      overdueNow: { v:25,
        gloss:"Past the 14-day term and still unpaid — Wared Flowers, July, 15 days over as of 30 July." },
      lifetimeBilledTotal: { v:4916,
        gloss:"Every invoice ever raised against these eight accounts, including the two that were written off. Gross, tax included." },
      lifetimeCollectedTotal: { v:4816,
        gloss:"Cash actually received against those invoices, after the one credit note." },
      lifetimeCreditedTotal: { v:25,
        gloss:"Credit notes issued: CN-2026-0001, Nara Pharmacy, JOD 25, for an invoice we sent to the wrong address." },
      lifetimeWrittenOffTotal: { v:50,
        gloss:"Bayt Books' last two invoices. Billed, never collected, closed off on 22 May 2026. Billed = collected + credited + outstanding + written-off: 4916 = 4816 + 25 + 25 + 50." },
      /* The tile is labelled "Tax collected, all time", so it is stated on what was COLLECTED —
         the only tile in this file that is, and deliberately: everywhere else the label says
         "billed" and the basis follows it. Mirrors tax.lifetimeCollectedTaxJod. */
      lifetimeTaxCollected: { v:664.282,
        gloss:"The 16% inside every invoice that has actually been paid, net of the one credit note — JOD 664.282 of the JOD 678.074 billed. The JOD 6.896 inside Bayt Books' two write-offs came back as bad-debt relief, and the JOD 3.448 inside Wared Flowers' unpaid July invoice has been raised but not collected. The bi-monthly return is filed on what was invoiced, not on this: 678.074 less the 3.448 credit note and the 6.896 relief is 667.730 across the life of the book." },
      avgDaysToPay: { v:6.8,
        gloss:"Mean days from invoice date to payment across all 81 settled invoices. Terms are 14 days." },
      concentrationTopAccountPct: { v:28.1, account:"Rawi Coffee House",
        gloss:"Rawi Coffee House is JOD 149 of JOD 531. Marmar Lounge is the same size — the two Unlimited accounts together are 56.1% of MRR." },
      atRiskMrr: { v:25,
        gloss:"MRR sitting on accounts marked at-risk — Wared Flowers: no scans in 19 days, July invoice 15 days past due, renewal on 5 August." },
      netRevenueRetention: { pct12mo:160, cohort12mo:3, pct6mo:98.3, cohort6mo:8,
        headline:"98% over six months, on eight accounts.",
        gloss:"The six-month figure is the honest one: the eight accounts live on 1 Mar 2026 were worth JOD 540 a month then and JOD 531 now — Rawi's upgrade almost covering Bayt Books closing and Petra downgrading. The twelve-month figure is 160%, but its cohort is three accounts, one of which is now zero and one of which never moved; the whole of it is Tala coming off a founding rate and then upgrading. Quoting that to a decimal beside a 28.1% concentration would be borrowing a precision it has not earned." },
      logoChurnCount: { v:1,
        gloss:"Accounts closed in the trailing twelve months: Bayt Books, 22 May 2026." }
    },

    /* CASH. What is expected to arrive in the 90 days from 30 Jul 2026 to 28 Oct 2026, under the
       model this file states at the top: monthly, in advance, net 14. Two components and nothing
       else — arrears already issued and unpaid, and the three invoice runs that fall in the window.
       Every live account is in it, including Marmar Lounge. This is NOT the renewals list below;
       a renewal moves no money. */
    cashForecast90: {
      fromDate: "30 Jul 2026", toDate: "28 Oct 2026", windowDays: 90,
      basis: "Invoices that will be raised inside the window at the plan price in force, plus everything already issued and still unpaid. Timed on the due date, not the issue date — net 14 is when the money is actually expected.",
      totalExpectedJod: 1618,
      arrears: [
        { name:"Wared Flowers", ref:"INV-2026-0053", period:"Jul 2026", dueOn:"15 Jul 2026", amountJod:25, daysOverdue:15, state:"overdue",
          note:"Already 15 days past term on an at-risk account. Counted, but it is the least certain 25 in the window." }
      ],
      runs: [
        { raisedOn:"1 Aug 2026", dueOn:"15 Aug 2026", amountJod:531, accounts:7, netJod:457.758, taxJod:73.242,
          lines:[ {n:"Rawi Coffee House",a:149}, {n:"Marmar Lounge",a:149}, {n:"Tala Hospitality Group",a:79}, {n:"Nara Pharmacy",a:79}, {n:"Petra Gym",a:25}, {n:"Qamar Sweets",a:25}, {n:"Wared Flowers",a:25} ] },
        { raisedOn:"1 Sep 2026", dueOn:"15 Sep 2026", amountJod:531, accounts:7, netJod:457.758, taxJod:73.242,
          lines:[ {n:"Rawi Coffee House",a:149}, {n:"Marmar Lounge",a:149}, {n:"Tala Hospitality Group",a:79}, {n:"Nara Pharmacy",a:79}, {n:"Petra Gym",a:25}, {n:"Qamar Sweets",a:25}, {n:"Wared Flowers",a:25} ] },
        { raisedOn:"1 Oct 2026", dueOn:"15 Oct 2026", amountJod:531, accounts:7, netJod:457.758, taxJod:73.242,
          lines:[ {n:"Rawi Coffee House",a:149}, {n:"Marmar Lounge",a:149}, {n:"Tala Hospitality Group",a:79}, {n:"Nara Pharmacy",a:79}, {n:"Petra Gym",a:25}, {n:"Qamar Sweets",a:25}, {n:"Wared Flowers",a:25} ] }
      ],
      /* [days from 30 Jul, cumulative JOD expected by then], keyed on due dates. */
      cumulative: [ [0, 25], [16, 556], [47, 1087], [77, 1618] ],
      riskNote: "JOD 100 of the 1,618 is Wared Flowers — one overdue invoice and three months it may not pay. The forecast states it rather than trimming it.",
      /* WHY THIS SENTENCE CARRIES NO STATE. It used to say Al-Quds was "closed-won and
         activating", which was true of the seed and false the moment Omar clicked
         Activate — at which point the Activations register said "Account live" and the
         account drill-in said "live, and empty", and one console disagreed with itself
         about one business. The clause that goes stale is the STATE clause, so it is
         gone. What is left is a billing fact this forecast owns and no activation can
         falsify: activating an account raises no invoice, and this window forecasts
         invoices. It reads the same before the click and after it. */
      notInHere: "Al-Quds Falafel is not in this window. No invoice has been scheduled against it — and activating an account does not schedule one — so there is no cash to forecast from it yet."
    },

    /* CALENDAR, NOT CASH. The annual term date for each live account: when the contract re-commits
       and the card quota re-arms. No invoice is raised on these dates and no money moves — billing
       is monthly regardless. `monthlyJod` is the plan price the renewal re-commits to, shown so the
       row means something; `cashJod` is 0 on every row, on purpose.
       `daysAway` and `verdict` are computed from the same 30 Jul clock and the same rule the
       console uses (more than 30 days out = not yet due), so the two screens cannot disagree. */
    renewals: {
      asOf: "30 Jul 2026", rule: "daysAway > 30 → notyet, else due. Identical to the console's payState.",
      cashJod: 0,
      list: [
        { name:"Wared Flowers", date:"5 Aug 2026", daysAway:6, verdict:"due", monthlyJod:25, cashJod:0, accountState:"at-risk" },
        { name:"Tala Hospitality Group", date:"12 Aug 2026", daysAway:13, verdict:"due", monthlyJod:79, cashJod:0, accountState:"active" },
        { name:"Petra Gym", date:"30 Aug 2026", daysAway:31, verdict:"notyet", monthlyJod:25, cashJod:0, accountState:"active" },
        { name:"Qamar Sweets", date:"14 Sep 2026", daysAway:46, verdict:"notyet", monthlyJod:25, cashJod:0, accountState:"active" },
        { name:"Nara Pharmacy", date:"22 Sep 2026", daysAway:54, verdict:"notyet", monthlyJod:79, cashJod:0, accountState:"active" },
        { name:"Rawi Coffee House", date:"3 Oct 2026", daysAway:65, verdict:"notyet", monthlyJod:149, cashJod:0, accountState:"active" },
        { name:"Marmar Lounge", date:"1 Dec 2026", daysAway:124, verdict:"notyet", monthlyJod:149, cashJod:0, accountState:"active" }
      ],
      note: "Petra Gym at exactly 31 days is the boundary case and it is deliberate: it is NOT due, it owes nothing, and nothing on any screen should offer to settle it early. Its August invoice is a separate thing that goes out on the 1st.",
      quotaNote: "Petra Gym's renewal on 30 Aug is also when the Growth card quota shrinks to Starter's three — a month after the price drops. See concessions."
    }
  }
};

/* ══ THE SUBMISSION CHANNEL · one key, four readers, two writers ══════════════
   Published here — not in any one surface — because five files share it and a
   drifting payload is invisible until a card turns up in the till with no rules.
   It is a plain localStorage key, defensively parsed like every other shared key
   in this prototype (try/catch, shape-check, tolerant of unknown fields).

   KEY      wasla_demo_submissions
   VALUE    a flat object, one entry per submitted card, keyed  acctSlug + ':' + cardId
   ROW      { v:1, acct, acctName, cardId, card, ar, type, color, color2, initial,
              tagline, goal, reward, branches, stampStyle, fields, customFields,
              cfg, rules, by, submitted, head, checks,
              state:'pending'|'approved'|'rejected', reason?, decidedBy?, decidedAt? }

   WRITERS  the Dashboard wizard writes the row at state 'pending';
            the Console's approve/reject writes state (+ reason/decidedBy/decidedAt)
            back into the SAME row and changes nothing else on it.
   READERS  the Console approvals queue, the Dashboard verdict poll, and — the part
            that makes a wizard-born card real — Customer and Scanner, each merging
            the rows whose `state` is 'approved' AND whose `acct` equals
            window.WASLA_ACCT into its own card list. Neither of them ever learns
            what the Dashboard's private state blob is.

   THIS KEY IS NOT SUFFIXED. It is keyed BY account inside the value, so one key
   holds every account's submissions and each reader filters on `acct`. The live
   bus (wasla_demo_live_events) is un-suffixed for the same reason and must stay
   that way. Everything else — every per-surface local-state blob — DOES take
   window.WASLA_ACCT_SUFFIX, or an Al-Quds session silently overwrites Tala's. */
window.WASLA_SUBMISSIONS_KEY = "wasla_demo_submissions";

/* ══ THE RESOLVER ════════════════════════════════════════════════════════════
   Runs at load time, before a single line of component code. Picks the account,
   fills the nine slots on window.WASLA_DB, and publishes who we ended up as.

   Slugification is character-for-character the rule the Console and the Dashboard
   already use for the links they hand out (lowercase → non-alphanumerics to dashes
   → trim leading/trailing dashes), so a link minted anywhere resolves here.

   PUBLISHED, and all five surfaces may rely on them:
     window.WASLA_ACCT            resolved slug — always a key of WASLA_ACCOUNTS
     window.WASLA_ACCT_NAME       resolved account.company
     window.WASLA_ACCT_SUFFIX     '' for Tala, '_<slug>' otherwise. Append to every
                                  per-surface localStorage key. Never to the live bus.
     window.WASLA_ACCT_REQUESTED  the slugified ?acct= as asked for; '' when absent
     window.WASLA_ACCT_KNOWN      false ONLY when ?acct= named an account we do not
                                  have. Absent ?acct= is true — that is not a miss,
                                  that is the default. A surface that echoes the
                                  requested name MUST check this first: on a miss the
                                  data below is Tala's, and printing a foreign name
                                  over it is the defect, not the fallback. */
(function () {
  var ACC = window.WASLA_ACCOUNTS, DEF = "tala-hospitality-group";
  var FIELDS = ["account", "cardExtras", "memberTimelines", "signup", "cards",
                "members", "activity", "staff", "broadcasts"];
  var slugOf = function (n) {
    return String(n == null ? "" : n).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };
  var asked = "";
  try {
    var q = (window.location && window.location.search) || "";
    var m = q.match(/[?&]acct=([^&]*)/);
    if (m) asked = slugOf(decodeURIComponent(m[1]));
  } catch (e) { asked = ""; }
  var has = !!asked && Object.prototype.hasOwnProperty.call(ACC, asked);
  var slug = has ? asked : DEF;
  var src = ACC[slug] || ACC[DEF];
  /* Copy the nine BY NAME rather than Object.assign'ing the whole entry: the field
     list is the contract, and a tenth key added to an account entry later must not
     silently become a top-level WASLA_DB field nobody declared. */
  for (var i = 0; i < FIELDS.length; i++) window.WASLA_DB[FIELDS[i]] = src[FIELDS[i]];
  window.WASLA_ACCT = slug;
  window.WASLA_ACCT_NAME = (src.account && src.account.company) || "";
  window.WASLA_ACCT_SUFFIX = (slug === DEF) ? "" : ("_" + slug);
  window.WASLA_ACCT_REQUESTED = asked;
  window.WASLA_ACCT_KNOWN = asked ? has : true;
  /* The Sukkar hand-off is Tala's own channel and predates all of this. Suffixing it
     keeps a second account's review verdict out of Tala's saved demo — and on Tala
     the suffix is '', so the key is the same string it has always been. */
  window.WASLA_DB.demoFlags.sukkarKey = window.WASLA_DB.demoFlags.sukkarKey + window.WASLA_ACCT_SUFFIX;
})();
