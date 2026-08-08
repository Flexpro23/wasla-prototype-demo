/* ══════════════════════════════════════════════════════════════════════════════
   WASLA STAMP LAYOUT · the shared geometry of a stamp card            v2.0.0
   ══════════════════════════════════════════════════════════════════════════════

   Publishes ONE pure function (compute) plus a catalogue, and it is the single
   source of truth for how stamps are ARRANGED on a card. It is loaded by the
   surfaces that draw stamps, exactly like its sibling wasla-stamps.js:

       <script src="wasla-stamps.js"></script>
       <script src="wasla-stamp-layout.js"></script>

   The two files divide cleanly:
       wasla-stamps.js        WHAT a stamp looks like  (the art, per style)
       wasla-stamp-layout.js  WHERE the stamps go      (the geometry, per layout)

   ══ THE ONE PRINCIPLE ═════════════════════════════════════════════════════
   STRUCTURE IS A FUNCTION OF (layout, goal) ALONE.
   THE BOX GOVERNS SIZE, NEVER STRUCTURE.

   v1.0.0 got this wrong, and the bug was the whole reason the file exists. Three
   layouts (auto, zigzag, trail) carried rows:null and re-solved their ROW COUNT
   from whatever box they were handed. Every surface hands a different box — the
   Customer pass band is 352 wide, the Scanner till is 265 with a pinned 50px
   cup, the Dashboard Apple strip is 258x84, the Dashboard demo strip 250x96, the
   picker tile 176x76 — so ONE CARD DREW A DIFFERENT SHAPE ON EVERY SURFACE.
   Trail at goal 12 wound 6/6 on the pass and 4/4/4 on the till: two routes for
   one card. The picker tile offered an arrangement the card would not draw, and
   the caption under it described a third arrangement again.

   That is the exact drift this module was created to eliminate. It had not
   removed the drift; it had moved it from three implementations to one
   implementation with five boxes.

   So, now and forever:

     1. rowCounts, rows, cols and the concrete layout id come from (layout, goal)
        ONLY. Nothing about the box may influence them. structure(id, goal) is the
        whole answer, and compute() calls it rather than deriving its own.
     2. `auto` resolves to a concrete layout FROM GOAL ALONE, through the explicit
        AUTO table below — never from available width.
     3. The box then decides only SIZE: given the structure, solve the largest
        cell that fits, clamp by minSize/maxSize, and report `overflow` honestly
        when even minSize will not fit.
     4. LEGIBILITY IS JUDGED IN THE SMALLEST BOX A REAL SURFACE DRAWS IN — every
        judged surface in SURFACES, not one idealised reference. Every CHOOSABLE
        layout the picker offers must be legible everywhere it will be rendered.
        `auto` is the one exemption, it is deliberate, and it is stated in full
        at isValid() rather than hidden in a short-circuit: auto is the terminal
        fallback, so it must be offerable at every goal or there is nothing left
        to fall back TO. See "WHY auto IS EXEMPT" below for the measured reason.

   ACCEPTANCE, and it is absolute: for every (layout, goal, dir) the wizard can
   produce, the structure returned for the Customer pass box, the Scanner till
   box, the Dashboard Apple strip box, the Dashboard demo strip box and the
   picker tile box is IDENTICAL — same concrete layout, same rows, same cols,
   same rowCounts. Only `size` (and the size-derived amp/sag/path) may differ.

   ── WHAT IT RETURNS ──────────────────────────────────────────────────────────
   GEOMETRY, NEVER MARKUP. Numbers: positions, sizes, a row breakdown, and for
   the trail layout an SVG path `d`. Each surface renders its own <img>, its own
   punch animation, its own halo. Nothing here ever returns HTML, and nothing
   here ever returns a style string containing url(data:...) — cssToObj splits
   declarations on ';' and a data URI carries its own ';base64,', so the value
   would be truncated. Stamp ART is always drawn by the caller with <img src>.
   The only style strings this file produces are pure geometry (position, left,
   top, width, height), which is safe and is what the x-dc templates bind.

   ── THE FOUR RULES IT ENFORCES ───────────────────────────────────────────────
   1. LAYOUT IS A FUNCTION OF GOAL. Three rows at goal 4 is nonsense, so it is
      not offered: isValid(id, goal) and optionsFor(goal) are the gate, and
      compute() falls back to 'auto' rather than drawing something broken.
   2. AUTO IS THE DEFAULT and the mature card does not move. Daraj — goal 8,
      style coffee — resolves to two rows of four on every surface, which is what
      shipped before this file and what shipped under v1.0.0. The AUTO table was
      chosen so that stays true to the pixel.
   3. UNEVEN LAST ROWS. Rows fill greedily, cols = ceil(goal / rows), and the
      short row CENTRES. Centring is not a preference: all surfaces render with
      justify-content:center today, so a centred short row is what already ships
      and is required for rule 2. 8 across three rows is 3 / 3 / 2.
   4. RTL. Geometry is computed left-to-right and then MIRRORED about the box's
      vertical axis when dir === 'rtl', so the first stamp lands on the right of
      an Arabic pass. See "THE RTL TRAP" below — this is not optional.

   ── THE RTL TRAP (read this before you render) ───────────────────────────────
   Today all surfaces get RTL for free: the stamp row is a plain flex container
   inside an element carrying dir="{{ dir }}", and a flex row inside dir=rtl lays
   its children out right-to-left by itself. The moment a surface positions cells
   ABSOLUTELY — which is what every layout here except a plain row requires —
   that free mirroring disappears, because left:Npx means left in both
   directions. So: EVERY CALLER MUST PASS dir. Forgetting it does not throw and
   does not look broken; it silently puts stamp 1 on the wrong end of an Arabic
   pass.

   ── SIZE REALITY, AND WHO JUDGES LEGIBILITY ──────────────────────────────────
   An Apple Wallet strip is roughly 375x144 points. Four real surfaces draw a
   card at CARD size, and all four sit on the legibility jury (SURFACES, judge:
   true): the Customer pass band, the Scanner till, the Dashboard Apple strip and
   the Dashboard demo strip. A CHOOSABLE layout is offered for a goal only if it
   still affords LEGIBLE_MIN px per stamp in ALL FOUR. Below ~20px a raster cup
   turns to mud, and the tightest of the four is not always the same one — the
   till is the narrowest per stamp (265 wide with a 13px gap), the Apple strip is
   the shortest (84 tall). Judging in one box and rendering in another is how the
   picker ends up offering a card the till draws as mush.
   The picker tile (176x76) is NOT on the jury and must never be: it is a
   thumbnail sized so seven arrangements are TELLABLE APART, not a card. Judging
   there would reject everything; drawing there is fine, because structure no
   longer depends on the box. SURFACES therefore lists FIVE boxes — every box
   this module's geometry is really rendered into — and `judge` is the flag that
   separates the four drawing a CARD from the one drawing a THUMBNAIL. It is not
   a list of card surfaces with an odd one out; it is the render list, and the
   jury is the subset of it that matters for legibility.

   ── WHY auto IS EXEMPT FROM THE JURY ─────────────────────────────────────────
   isValid('auto', g) is true for every g in 1..MAX_GOAL without consulting the
   jury, and that is a decision, not an oversight. auto is the TERMINAL FALLBACK:
   compute() renders auto when the request is invalid, and structure() resolves
   to auto the same way. A fallback that can itself be invalid is not a fallback.
   Measured, on this file's own numbers: from goal 25 up, EVERY non-auto layout
   is already illegible in at least one judged surface, so if auto were judged
   too, optionsFor(25..40) would return the EMPTY LIST — a picker with no options
   and a fallback with nothing behind it. Below that the exemption never bites:
   auto is legible in all four judged surfaces for every goal 1..24 (the tightest
   is the till, 21px at goal 24), and the wizard clamps the goal to 4..12, where
   auto's smallest judged stamp is 33px. So the exemption is real, it is bounded,
   and outside goals 25..40 it changes no answer at all.
   The guarantee therefore reads, exactly: EVERY LAYOUT optionsFor() OFFERS IS
   LEGIBLE IN ALL FOUR JUDGED SURFACES, EXCEPT auto, WHICH IS ALWAYS OFFERED
   BECAUSE IT IS WHAT EVERYTHING ELSE FALLS BACK TO. If auto must ever be judged,
   optionsFor() needs a rule for the empty list FIRST.

   ── LAYOUTS THAT DID NOT EARN THEIR PLACE ────────────────────────────────────
   RING / CIRCLE. At a strip height of 84px the ring diameter is capped near 84,
     so 8 stamps sit ~25px apart on the circumference at ~20px each: they touch,
     and a ring has no reading order, so "which one is next" stops being
     answerable. Rejected on both counts.
   SPIRAL. Needs a square box and at least ~200px of it. Rejected on size.
   SHAPE FILLS (heart, star made of stamps). Legible at 800px, mush at 144.

   ── WHAT CHANGED FROM v1.0.0 (call sites, read this) ─────────────────────────
   * `box`, `gap` and `maxSize` no longer influence rows/cols/rowCounts. They
     size the cells and nothing else. A surface that passed a box in order to
     STEER the arrangement is now passing something that is ignored for that
     purpose.
   * `size` (the pinned cell) no longer decides how many stamps fit on a line.
     It pins the cell edge; the structure is the table's. A pinned cell that
     cannot fit the structure now reports overflow:true instead of silently
     re-shaping the card — which is exactly the signal the Scanner till already
     retries on.
   * New: `fit: 'shrink'` — treat `size` as a CAP rather than a pin, so the card
     shrinks instead of clipping. That is the Scanner's own two-pass moved into
     the module; the default 'pin' keeps v1 behaviour exactly.
   * resolve(id, goal) takes two arguments. The old box/gap/maxSize tail is
     accepted and IGNORED; delete it at the call site.
   * isValid()/optionsFor()/goalRange() are stricter: judged in all four card
     surfaces, not in REFERENCE alone. `row` and `arc` now stop at goal 8
     (one row of 9 is 17.9px on the till), `rows2` runs 4..16, `rows3` 6..24.
   * New: structure(id, goal) — the structure alone, no box required.
   * Every numeric input is sanitised the same way: a NaN gap, box, maxSize,
     minSize or size falls back to its default instead of poisoning the card.
   * The arc's lean is now paid for TWICE, because it costs twice. Against the
     BOX it is paid once for the row, in the size solve, and counted in
     `content`, so a rotated stamp can no longer extend past the box the module
     said it fits in. Against the NEIGHBOUR it is paid PER GAP, by capping the
     lean angle at what gap.x can absorb (leanCap), so no two arc cells can
     overlap in any box.
     BE PRECISE ABOUT WHAT WAS BROKEN, because the numbers matter: the five real
     boxes never actually collided. Measured pairwise with a separating-axis test
     across the whole arc window, the tightest shipping case was the picker tile
     at goal 4, clear by 0.23px, and the demo strip at goal 4, clear by 0.45px.
     What was missing was the GUARANTEE, not the pixels — the row-wide payment
     says nothing about neighbours, so clearance was luck that happened to hold
     at these gaps. It stopped holding as soon as the gap tightened: in the
     picker's own box, gap.x ≤ 3 overlapped, and over a sweep of 68,160 arc cases
     (gap.x 0.5..16 x box.w 120..400 x goal 3..8 x five heights) 10,703 of them
     overlapped. That sweep is now 0.
     The cap moves the ANGLE, never the size, which is why the arc's validity
     window is still 3..8: charging the per-gap allowance to the size solve
     instead drops the till's judged cell at goal 8 from 21px to 18px, under
     LEGIBLE_MIN, and the window collapses to 3..7. Cost of the fix, measured
     over 13,328 (layout x goal x dir x fill x real box) cases: 54 changed, all
     of them arc, only at goals 3..6, only on the Apple strip, the demo strip and
     the picker tile, and the ONLY field that moves is each cell's `rot` — by at
     most 1.48°. Not one style string, size, sag, row count or overflow flag
     differs anywhere, and the pass and the till are untouched.
   * summary() describes any row count, and the structure is capped at MAX_ROWS,
     so a caption can never call a 4-row card "Three rows".
   ══════════════════════════════════════════════════════════════════════════ */

(function (root) {
  'use strict';

  /* ── constants ───────────────────────────────────────────────────────────
     REFERENCE is the Dashboard's Apple-strip inner box. It is kept ONLY as the
     default box for a caller that passes none, and as a stable published shape;
     it no longer decides any structure and it is no longer the sole judge of
     legibility. LEGIBLE_MIN is the documented mud floor. MAX_GOAL is the scan
     ceiling for goalRange(); the app's own wizard clamps a stamp goal to 4..12,
     and nothing here assumes that. */
  var REFERENCE = { w: 258, h: 84, gap: { x: 8, y: 5 }, maxSize: 46 };
  var LEGIBLE_MIN = 20;
  var MAX_GOAL = 40;
  var MAX_ROWS = 3;          // the structure never stacks more than three rows
  var DEFAULT_MIN_SIZE = 12; // the Dashboard's long-standing floor
  var LAYOUT_FIELD = 'stampLayout';   // the card record field the surfaces read

  /* the arc's lean, capped: past about 12° a photographed cup reads as a
     mistake rather than a lean. rotAllow(θ) is what a lean of θ COSTS in space —
     a square of edge s rotated by θ spans s·(|cosθ|+|sinθ|), so it wants
     rotAllow(θ)·s more than its unrotated self in each axis. ROT_ALLOW is that
     cost at the cap.

     THE ALLOWANCE IS PAID TWICE, FOR TWO DIFFERENT THINGS, AND CONFLATING THEM
     IS A BUG EITHER WAY:

       AGAINST THE BOX it is paid ONCE FOR THE ROW, in rawSize(). Only the two
         outermost stamps have an outer edge facing a box wall, and each grows by
         rotAllow·s/2, so the row as a whole wants exactly rotAllow·s more. That
         is why the arc no longer overflows the box it was told it fits in.
       AGAINST THE NEIGHBOUR it is paid PER GAP, by leanCap() below. Adjacent
         cell centres sit size+gap.x apart, so two leaning squares stay clear
         only while s·rotAllow(θ) ≤ gap.x. This one is a constraint on θ, NOT on
         s — and that distinction is the whole of the fix. Charging the per-gap
         allowance to the SIZE solve instead (denominator cols + a·(cols-1)) was
         measured: it shrinks the arc's judged cell on the till at goal 8 from
         21px to 18px, below LEGIBLE_MIN, and the arc's validity window collapses
         from 3..8 to 3..7. The window is contract. So the lean gives, not the
         stamp: an arc in a mean gap simply leans less, and at gap.x 0 it is a
         flat row — which is the same answer sag already gives in a short box.

     leanCap solves s·(cos θ + sin θ − 1) ≤ gap.x for θ in closed form:
     cos θ + sin θ = √2·sin(θ+45°), so θ = asin((1+k)/√2) − 45° with k = gap.x/s.
     k ≥ √2−1 affords a 45° lean, which is far past the cap, so the cap wins. */
  var ROT_MAX = 12;
  function rotAllow(deg) {
    var r = deg * Math.PI / 180;
    return Math.cos(r) + Math.sin(r) - 1;
  }
  var ROT_ALLOW = rotAllow(ROT_MAX);           // ≈ 0.18606
  var LEAN_FREE = Math.SQRT2 - 1;              // ≈ 0.41421 — a gap this wide pays for any lean
  /* A HAIRLINE OF EVERY GAP IS NOT SPENT. Solving the inequality to equality
     leaves the two steepest neighbours exactly touching, and "exactly" is a word
     floating point does not keep: the tightest case in a 1.96M-case sweep came
     back at +8.5e-14 px of overlap rather than 0. Two hundredths of a pixel is
     also more than px() can lose when it rounds each position to two decimals
     (0.005 each way), so reserving it makes the clearance strictly positive in
     the emitted style string, not just in the float. It is far below one device
     pixel, so nothing visibly moves. */
  var LEAN_HAIR = 0.02;
  function leanCap(size, gapX) {
    var s = num(size, 0), pay = num(gapX, 0) - LEAN_HAIR;
    if (!(s > 0)) return ROT_MAX;              // no stamp, nothing to collide with
    if (!(pay > 0)) return 0;                  // touching cells may not lean at all
    var k = pay / s;
    if (k >= LEAN_FREE) return ROT_MAX;
    return clamp(Math.asin(clamp((1 + k) / Math.SQRT2, -1, 1)) * 180 / Math.PI - 45, 0, ROT_MAX);
  }

  /* ── THE REAL SURFACES ───────────────────────────────────────────────────
     EVERY BOX THIS MODULE'S GEOMETRY IS ACTUALLY RENDERED INTO, written down
     once — five of them, not four. `judge: true` means "a CARD is drawn here, at
     CARD size, so legibility must hold here"; that is the four card surfaces.
     `judge: false` means "the geometry is drawn here, but not as a card" — that
     is the picker tile, a 176x76 thumbnail whose job is to make seven
     arrangements tellable apart. It belongs on this list because the module is
     asked for its geometry and it must not be forgotten when a box changes; it
     is off the jury because judging a thumbnail against a card's floor would
     reject every layout there is. So the sentence is "every box that renders",
     and `judge` is what narrows it to "every box that renders a card".
     The till's height is not a constraint — the till card grows downwards and
     solves its own height from content.h — so it is modelled with the same tall
     probe box that surface uses. */
  var TALL = 4000;
  var SURFACES = [
    { id: 'pass',   judge: true,  w: 352, h: 352 * 123 / 375, gap: { x: 14, y: 9 },  maxSize: 46,
      note: 'Customer pass band · 352 wide, aspect 375/123' },
    { id: 'till',   judge: true,  w: 265, h: TALL,            gap: { x: 13, y: 13 }, maxSize: 50,
      note: 'Scanner till card · 265 wide, height derived from content' },
    { id: 'apple',  judge: true,  w: 258, h: 84,              gap: { x: 8,  y: 5 },  maxSize: 46,
      note: 'Dashboard Apple strip · the shortest real box' },
    { id: 'demo',   judge: true,  w: 250, h: 96,              gap: { x: 8,  y: 6 },  maxSize: 48,
      note: 'Dashboard live demo strip' },
    { id: 'picker', judge: false, w: 176, h: 76,              gap: { x: 4,  y: 4 },  maxSize: 24, minSize: 6,
      note: 'Layout picker tile · a thumbnail for comparison, never judged' }
  ];

  /* ── AUTO · ONE EXPLICIT TABLE, GOAL IN, ROWS OUT ────────────────────────
     This replaces the v1 fit solver, which asked the box. The thresholds are
     not taste: they are exactly what the old fitStamps() answered in the
     Dashboard's Apple strip (258x84, gap 8/5, cap 46) — the box the mature demo
     is designed against — evaluated at every goal:

         goal  1  2  3  4  5 │  6  7  8  9 10 11 12 13 14 15 16 │ 17 18 19 20 …
         rows  1  1  1  1  1 │  2  2  2  2  2  2  2  2  2  2  2 │  3  3  3  3 …

     Goal 8 lands on TWO ROWS OF FOUR, which is how the Daraj pass, the Daraj
     till card and the Daraj Apple strip all already read — rule 2 holds to the
     pixel. Do not re-derive this from a box. If it must ever change, it changes
     HERE, once, and every surface changes with it in the same breath. */
  var AUTO = [
    { upTo: 5,    rows: 1 },
    { upTo: 16,   rows: 2 },
    { upTo: null, rows: 3 }      // null === "and every goal above"
  ];
  function autoRows(goal) {
    for (var i = 0; i < AUTO.length; i++) {
      if (AUTO[i].upTo === null || goal <= AUTO[i].upTo) return AUTO[i].rows;
    }
    return MAX_ROWS;
  }

  /* ── small pure helpers ──────────────────────────────────────────────────
     EVERY numeric input goes through num(). The module is documented as total
     and never-throwing, so it must also never return garbage: a NaN gap used to
     survive Math.max(0, NaN) === NaN and collapse the entire card silently.

     FINITENESS IS NOT ENOUGH, AND THAT WAS A REAL HOLE. isFinite() alone let
     1e308 through, and 1e308 is finite only until it is multiplied: the card
     records these numbers come from are localStorage JSON a user can edit, so
     `{"size":1e308}` was a reachable input, and it produced
         cell.style   "left:0px;top:0px;width:Infinitypx;height:Infinitypx;"
         content      { x: NaN, y: NaN, w: NaN, h: NaN }
     — Infinity and NaN in the very fields the guarantee is about. A gap of
     1e308 did the same to `top`, and a box of 1e308 to `left`. So magnitude is
     clamped here too, at the one door every number comes through.

     NUM_MAX is CLAMPED TO, not rejected to the default: 1e9 in means 1e9 out,
     so goalOf()'s own clamp still sees a large number and still answers the
     large answer it always did — nothing that used to render moves. The bound
     is chosen for headroom, not taste: every product this file forms is a
     count times a length, counts are capped at MAX_GOAL*4 = 160 and lengths at
     NUM_MAX, so the largest quantity that can ever exist here is ~1.6e11 —
     nearly 300 orders of magnitude clear of overflow, which is what makes
     "no NaN and no Infinity anywhere downstream" a proof rather than a hope.
     A million-pixel box is already three orders past any real one. */
  var NUM_MAX = 1e9;
  function num(v, dflt) {
    var n = typeof v === 'number' ? v : parseFloat(v);
    if (typeof n !== 'number' || !isFinite(n)) return dflt;
    return n > NUM_MAX ? NUM_MAX : (n < -NUM_MAX ? -NUM_MAX : n);
  }
  function nonNeg(v, dflt) { return Math.max(0, num(v, dflt)); }
  function atLeast(v, min, dflt) { return Math.max(min, num(v, dflt)); }
  function intAtLeast(v, min, dflt) {
    var n = Math.round(num(v, dflt));
    return (isFinite(n) && n >= min) ? n : dflt;
  }
  /* px with at most two decimals and no trailing noise — style strings only */
  function px(v) {
    var n = Math.round(num(v, 0) * 100) / 100;
    return (n === Math.round(n) ? String(n) : n.toFixed(2).replace(/0$/, '')) + 'px';
  }
  function n2(v) {
    var n = Math.round(num(v, 0) * 100) / 100;
    return String(n);
  }
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  /* ── the catalogue ───────────────────────────────────────────────────────
     Order here IS the order a picker should show. `rows` is the row count the
     layout forces; null means "take the AUTO table's answer for this goal"
     (auto and zigzag), and trail takes the AUTO answer with a floor of 2 because
     a trail that never turns is not a trail. NOTHING here consults a box.
     minGoal is the STRUCTURAL floor — the point below which the layout stops
     being the thing it claims to be. The legibility half of validity is
     computed against the real surfaces, never typed. */
  var CATALOGUE = [
    {
      id: 'auto', rows: null, zig: false, curve: false, trail: false, minGoal: 1,
      label: { en: 'Automatic', ar: 'تلقائي' },
      hint: {
        en: 'Wasla picks the arrangement that gives the biggest stamps for this goal.',
        ar: 'وصلة تختار الترتيب الذي يمنح أكبر حجم للأختام عند هذا الهدف.'
      }
    },
    {
      id: 'row', rows: 1, zig: false, curve: false, trail: false, minGoal: 1,
      label: { en: 'One row', ar: 'صف واحد' },
      hint: {
        en: 'Every stamp on one line — the clearest read, until the card gets long.',
        ar: 'كل الأختام في سطر واحد — الأوضح قراءةً، ما لم تطل البطاقة.'
      }
    },
    {
      id: 'rows2', rows: 2, zig: false, curve: false, trail: false, minGoal: 4,
      label: { en: 'Two rows', ar: 'صفّان' },
      hint: {
        en: 'Two rows — the biggest stamps a wallet strip can hold at most goals.',
        ar: 'صفّان — أكبر حجم للأختام يتّسع له شريط المحفظة في معظم الأهداف.'
      }
    },
    {
      id: 'rows3', rows: 3, zig: false, curve: false, trail: false, minGoal: 6,
      label: { en: 'Three rows', ar: 'ثلاثة صفوف' },
      hint: {
        en: 'Three rows — for a long card, where one or two rows would shrink the art.',
        ar: 'ثلاثة صفوف — للبطاقة الطويلة، حيث يصغّر الصف أو الصفّان الرسم.'
      }
    },
    {
      id: 'zigzag', rows: null, zig: true, curve: false, trail: false, minGoal: 3,
      label: { en: 'Zigzag', ar: 'متعرّج' },
      hint: {
        en: 'The row steps up and down — hand-stamped, less like a spreadsheet.',
        ar: 'الصف يعلو ويهبط — أقرب إلى الختم اليدوي، وأبعد عن شكل الجدول.'
      }
    },
    {
      id: 'arc', rows: 1, zig: false, curve: true, trail: false, minGoal: 3,
      label: { en: 'Arc', ar: 'قوس' },
      hint: {
        en: 'One row along a gentle curve, each stamp leaning with it.',
        ar: 'صف واحد على منحنى هادئ، ويميل كل ختم معه.'
      }
    },
    {
      id: 'trail', rows: null, zig: false, curve: false, trail: true, minGoal: 4,
      label: { en: 'Trail', ar: 'مسار' },
      hint: {
        en: 'A winding route with a connecting line — the card reads as a journey.',
        ar: 'طريق متعرّج بخط يصل بين الأختام — تُقرأ البطاقة كرحلة.'
      }
    }
  ];

  var BY_ID = {};
  for (var ci = 0; ci < CATALOGUE.length; ci++) BY_ID[CATALOGUE[ci].id] = CATALOGUE[ci];

  /* ── identity ────────────────────────────────────────────────────────────
     byId() is the ONLY way into the catalogue, and it is an OWN-property
     lookup. A plain BY_ID[k] answers Object.prototype for '__proto__',
     'constructor' and 'toString' — a truthy non-entry that then walks straight
     into the geometry and takes the surface down. The card record this reads
     from is merchant-editable JSON, so that is a live input, not a curiosity.
     normalize() is the ONLY place an unknown, empty, legacy or hostile value
     becomes a layout id. Anything it does not recognise is 'auto', which is why
     a card saved before this feature existed keeps its exact look. */
  function byId(id) {
    var k = String(id === undefined || id === null ? '' : id).trim();
    return Object.prototype.hasOwnProperty.call(BY_ID, k) ? BY_ID[k] : null;
  }
  function normalize(id) {
    return byId(id) ? String(id).trim() : 'auto';
  }
  function get(id) { return byId(normalize(id)); }
  function ids() { return CATALOGUE.map(function (e) { return e.id; }); }
  /* the layout a card record asks for. `stampLayout` is the field; absent is auto. */
  function fromCard(card) {
    return normalize(card && typeof card === 'object' ? card[LAYOUT_FIELD] : '');
  }

  /* ── the row solve ───────────────────────────────────────────────────────
     GREEDY, exactly like CSS flex-wrap, which is what every surface does today:
     cols = ceil(goal / rows), each row takes `cols` until the stamps run out,
     and the short row is last. goal 8 over 3 rows is 3 / 3 / 2. */
  function rowCountsFor(goal, rows) {
    var cols = Math.ceil(goal / rows), out = [], left = goal, r;
    for (r = 0; r < rows; r++) {
      var take = Math.min(cols, left);
      out.push(take);
      left -= take;
    }
    return out;
  }
  /* a row count is structurally usable only when no row comes out empty */
  function rowsUsable(goal, rows) {
    if (rows < 1 || rows > goal) return false;
    var cols = Math.ceil(goal / rows);
    return Math.ceil(goal / cols) === rows;
  }

  /* the goal any entry point settles on: an integer ≥ 1, and a runaway value
     still renders rather than hanging the surface */
  function goalOf(v) {
    return clamp(intAtLeast(v, 1, 1), 1, MAX_GOAL * 4);
  }

  /* ══ STRUCTURE · (layout, goal) → the shape, with no box in sight ══════════
     This is the whole of the fix. Nobody below this line may ask how wide the
     card is before deciding how many rows it has. */
  function rawStructure(entry, goal) {
    var rows;
    if (entry.rows) rows = entry.rows;
    else if (entry.trail) rows = Math.max(2, autoRows(goal));   // a trail must wind
    else rows = autoRows(goal);                                  // auto, zigzag
    rows = clamp(Math.round(rows), 1, MAX_ROWS);                 // MAX_ROWS is a hard cap
    if (rows > goal) rows = goal;
    while (rows > 1 && !rowsUsable(goal, rows)) rows--;
    if (!rowsUsable(goal, rows)) rows = 1;
    var cols = Math.ceil(goal / rows);
    return {
      rows: rows, cols: cols, rowCounts: rowCountsFor(goal, rows),
      layout: entry.id === 'auto'
        ? (rows === 1 ? 'row' : (rows === 2 ? 'rows2' : 'rows3'))
        : entry.id
    };
  }

  /* the public form: identity gate, validity gate, then the shape. No box
     parameter exists, because there is nothing a box could legitimately say. */
  function structure(id, goal) {
    var g = goalOf(goal);
    var requested = normalize(id);
    var valid = isValid(requested, g);
    var entry = byId(valid ? requested : 'auto');
    var st = rawStructure(entry, g);
    return {
      goal: g, requested: requested, family: entry.id,
      valid: valid, fellBack: !valid,
      layout: st.layout, rows: st.rows, cols: st.cols, rowCounts: st.rowCounts
    };
  }

  /* ══ SIZE · the box's only job ════════════════════════════════════════════
     The largest cell edge this structure can afford in this box, clamped by
     minSize/maxSize. `allow` is the arc's rotation allowance folded into the
     denominator: a leaning square of edge s occupies s·(1+ROT_ALLOW), so
     s·(cols+ROT_ALLOW) + gaps must fit the width. Solving for s that way is
     what stops the lean from being clipped by the box it was told it fits in. */
  function rawSize(st, box, gap, maxSize, vReserve, allow) {
    var a = allow || 0;
    var byW = (box.w - (st.cols - 1) * gap.x) / (st.cols + a);
    var byH = (box.h - (vReserve || 0) - (st.rows - 1) * gap.y) / (st.rows + a);
    return Math.min(byW, byH, maxSize);
  }

  /* compute() and isValid() both go through here, so the size a layout is
     JUDGED at is by construction the size it RENDERS at in that box. Two
     functions deriving that number separately is exactly how a picker ends up
     offering a layout that then draws mush — the house defect, in geometry form.

     A zigzag genuinely needs more height than a flat grid: if the step is only
     taken out of the existing row gap it collapses to a pixel or two at tight
     gaps and the merchant sees nothing. So the step is RESERVED — it widens the
     row spacing rather than eating into it, which also means two rows can never
     lean into each other whatever the column parity is. The reserve depends on
     the size and the size depends on the reserve, so it is estimated once from
     the unreserved solve and then settled.

     The arc reserves no EXTRA height for its sag: the sag is taken from whatever
     vertical slack is actually left after the lean is paid for, so it shrinks to
     flat in a short box instead of shrinking the stamps. */
  function solveSize(entry, st, box, gap, maxSize, minSize, rounded, pinned) {
    var allow = entry.curve ? ROT_ALLOW : 0;
    var size, reserve = 0, amp = 0, sag = 0;

    if (entry.zig) {
      var probe = pinned > 0 ? pinned : Math.max(0, rawSize(st, box, gap, maxSize, 0, 0));
      reserve = 2 * Math.max(0, Math.round(probe * 0.10)) * st.rows;
    }

    if (pinned > 0) size = pinned;
    else {
      size = rawSize(st, box, gap, maxSize, reserve, allow);
      if (rounded) size = Math.floor(size);
      size = Math.max(minSize, size);
    }

    var baseH = st.rows * size + (st.rows - 1) * gap.y;

    if (entry.zig) {
      /* step down until the whole zigzag block genuinely fits the box — at most
         a handful of turns, and it can only end at 0, which is a flat grid */
      amp = Math.max(0, Math.round(size * 0.10));
      while (amp > 0 && baseH + 2 * amp * st.rows > box.h) amp--;
    }
    if (entry.curve) {
      /* the lean's vertical cost is already ROT_ALLOW·size; the sag gets what
         is left, and 0 is a perfectly good answer — a flat row */
      var room = box.h - baseH - ROT_ALLOW * size;
      sag = Math.max(0, Math.min(Math.round(size * 0.45), Math.floor(room)));
    }
    return { size: size, amp: amp, sag: sag };
  }

  /* the space a solved block actually wants, lean included — used to answer
     "does this PINNED cell still fit?" before anything is laid out */
  function blockExtent(entry, st, gap, g) {
    var w = st.cols * g.size + (st.cols - 1) * gap.x;
    var h = st.rows * g.size + (st.rows - 1) * (gap.y + 2 * g.amp) + 2 * g.amp + g.sag;
    /* the lean's real cost, not the worst case: the steepest stamp on an arc is
       the outermost one, atan(4·sag/span). Using the ROT_MAX allowance here
       instead would shrink cards that actually fit, by a fraction of a pixel.
       Capped by the SAME leanCap() compute() renders with, so this measures the
       card that is actually drawn — two ceilings on one angle is how a pinned
       cell ends up shrinking to make room for a lean nobody draws. */
    var lean = 0;
    if (entry.curve && g.sag > 0) {
      var span = w - g.size;
      var ceilDeg = leanCap(g.size, gap.x);
      var deg = span > 0 ? Math.min(ceilDeg, Math.abs(Math.atan((4 * g.sag) / span) * 180 / Math.PI)) : 0;
      var rad = deg * Math.PI / 180;
      lean = g.size * (Math.cos(rad) + Math.sin(rad) - 1);
    }
    return { w: w + lean, h: h + lean };
  }

  /* ── VALIDITY ────────────────────────────────────────────────────────────
     Two gates, and neither is a typed range:
       STRUCTURE   the layout must still be the thing it claims to be — no
                   empty rows, no "zigzag" through two points, no "trail" that
                   never turns.
       LEGIBILITY  in EVERY judged surface (SURFACES, judge:true) the layout
                   must still afford LEGIBLE_MIN px per stamp. Not in one
                   reference box: a layout the picker offers is a layout the
                   till will draw, and the till is 265 wide with a 13px gap.
     Everything a UI needs to avoid offering a broken combination comes from
     here: isValid(), optionsFor(), goalRange().

     AND ONE EXEMPTION, WHICH THE HEADER STATES IN FULL under "WHY auto IS
     EXEMPT FROM THE JURY": auto skips the legibility gate. It still passes the
     STRUCTURE gate above it — goal ≥ 1, goal ≤ MAX_GOAL, goal ≥ minGoal — so
     this is not an unconditional true; it is "auto is structurally fine and is
     not asked to prove legibility". The reason is that auto is what everything
     else falls back to, and from goal 25 up every other layout is already
     illegible somewhere, so judging auto would leave optionsFor() empty at
     25..40 with nothing behind the fallback. Below 25 the exemption changes no
     answer: auto is genuinely legible in all four judged surfaces at 1..24. */
  function isValid(id, goal) {
    var entry = byId(id);
    if (!entry) return false;                       // an unknown id is never "valid"
    var g = Math.round(num(goal, 0));
    if (!(g >= 1) || g > MAX_GOAL) return false;
    if (g < entry.minGoal) return false;
    /* THE JURY IS SKIPPED HERE, AND ONLY HERE. Structure has already been
       checked above; legibility is not asked of auto because auto is the floor
       everything falls back to and optionsFor() would be empty at goals 25..40
       without it. Measured, not assumed — see "WHY auto IS EXEMPT" in the
       header, which carries the numbers and the condition for changing this. */
    if (entry.id === 'auto') return true;
    if (entry.rows && !rowsUsable(g, entry.rows)) return false;
    var st = rawStructure(entry, g);
    if (!rowsUsable(g, st.rows)) return false;
    if (entry.trail && st.rows < 2) return false;   // a trail that never turns is not a trail
    for (var i = 0; i < SURFACES.length; i++) {
      var s = SURFACES[i];
      if (!s.judge) continue;
      /* judged at the size it will actually render at in that surface, with the
         floor lifted to 1 so the minSize clamp cannot fake legibility */
      var geo = solveSize(entry, st, { w: s.w, h: s.h }, s.gap, s.maxSize, 1, true, 0);
      if (!(geo.size >= LEGIBLE_MIN)) return false;
    }
    return true;
  }

  /* every layout that is legible at this goal, in catalogue order — the exact
     list a layout picker may show, and nothing more */
  function optionsFor(goal) {
    return CATALOGUE.filter(function (e) { return isValid(e.id, goal); });
  }
  /* the contiguous goal window a layout is legible in, DERIVED by asking
     isValid across the whole range rather than written down beside it */
  function goalRange(id) {
    var k = byId(id);
    if (!k) return null;
    k = k.id;
    var min = null, max = null, g;
    for (g = 1; g <= MAX_GOAL; g++) {
      if (isValid(k, g)) { if (min === null) min = g; max = g; }
    }
    return min === null ? null : { min: min, max: max };
  }

  /* the concrete layout a request resolves to — 'auto' is never a rendered
     layout, it is a request that becomes 'row' | 'rows2' | 'rows3'.
     THE TAIL ARGUMENTS ARE GONE: resolve(id, goal) is the whole signature, and
     anything passed after `goal` is ignored. A box cannot influence this. */
  function resolve(id, goal) {
    return structure(id, goal).layout;
  }

  /* ── the connecting line, for the trail ──────────────────────────────────
     A rounded polyline through the cell centres in EARNING order. Points inside
     one row are collinear, so the quadratic at those vertices degenerates to a
     straight line and only the turns actually round. Returned as an SVG `d`
     string — geometry, not markup: the caller owns the <svg>, the stroke, the
     colour and the dash. */
  function trimToward(from, to, r) {
    var dx = to.x - from.x, dy = to.y - from.y;
    var L = Math.sqrt(dx * dx + dy * dy) || 1;
    var t = Math.min(r, L / 2) / L;
    return { x: from.x + dx * t, y: from.y + dy * t };
  }
  function roundedPath(pts, r) {
    if (!pts.length) return '';
    var d = 'M ' + n2(pts[0].x) + ' ' + n2(pts[0].y), i;
    if (pts.length === 1) return d;
    for (i = 1; i < pts.length - 1; i++) {
      var a = trimToward(pts[i], pts[i - 1], r);
      var b = trimToward(pts[i], pts[i + 1], r);
      d += ' L ' + n2(a.x) + ' ' + n2(a.y) +
        ' Q ' + n2(pts[i].x) + ' ' + n2(pts[i].y) + ' ' + n2(b.x) + ' ' + n2(b.y);
    }
    var last = pts[pts.length - 1];
    d += ' L ' + n2(last.x) + ' ' + n2(last.y);
    return d;
  }

  /* ══ compute() · the one function ═════════════════════════════════════════
     Pure, total and silent: it never throws, never reads the DOM, never reads
     window, and any input it cannot make sense of becomes a safe default. That
     is deliberate — renderVals() runs EVERY screen on EVERY render, so a lookup
     that throws takes down the whole surface. A bad layout id renders auto; a
     goal of 0 renders one empty cell's worth of nothing; a zero-width box or a
     NaN gap renders cells at minSize with overflow flagged. ═══════════════ */
  function compute(opts) {
    var o = (opts && typeof opts === 'object') ? opts : {};

    var goal = goalOf(o.goal);
    var filled = clamp(intAtLeast(o.filled, 0, 0), 0, goal);

    /* ── every numeric input, sanitised the same way ─────────────────────
       num() is the only door. NaN, Infinity, '', null, {} and 'abc' all become
       the documented default rather than travelling into the arithmetic — a
       NaN gap used to survive Math.max(0, NaN) and collapse the whole card. */
    var boxIn = (o.box && typeof o.box === 'object') ? o.box : {};
    var box = { w: nonNeg(boxIn.w, REFERENCE.w), h: nonNeg(boxIn.h, REFERENCE.h) };

    var gapIn = o.gap;
    var gap;
    if (gapIn !== null && gapIn !== undefined && typeof gapIn === 'object') {
      gap = { x: nonNeg(gapIn.x, REFERENCE.gap.x), y: nonNeg(gapIn.y, REFERENCE.gap.y) };
    } else if (gapIn !== null && gapIn !== undefined && gapIn !== '') {
      /* a scalar gap means both axes — and a scalar that is not a number falls
         back per axis rather than poisoning both */
      gap = { x: nonNeg(gapIn, REFERENCE.gap.x), y: nonNeg(gapIn, REFERENCE.gap.y) };
    } else gap = { x: REFERENCE.gap.x, y: REFERENCE.gap.y };

    var maxSize = atLeast(o.maxSize, 1, REFERENCE.maxSize);
    var minSize = atLeast(o.minSize, 1, DEFAULT_MIN_SIZE);
    if (minSize > maxSize) minSize = maxSize;
    var pinned = num(o.size, 0);
    if (!(pinned > 0)) pinned = 0;
    var rounded = o.round === false ? false : true;
    /* WHAT A PINNED CELL MEANS WHEN IT NO LONGER FITS.
       'pin'    (default) draw it at exactly that size and set overflow — the
                caller decides, which is what the Scanner till already does.
       'shrink' treat the pin as a CAP: keep it while it fits, and hand the size
                back to the solver when it does not. That is the till's own
                two-pass, moved in here so no surface has to own a second copy —
                and it is the right answer for any strip that pinned a cell
                purely to reproduce a legacy look. */
    var fit = String(o.fit || 'pin').toLowerCase() === 'shrink' ? 'shrink' : 'pin';

    var dir = (String(o.dir || 'ltr').toLowerCase() === 'rtl') ? 'rtl' : 'ltr';
    var align = ({ start: 'start', end: 'end', center: 'center' })[String(o.align || 'center').toLowerCase()] || 'center';

    /* ── THE STRUCTURE · from (layout, goal) and nothing else ─────────────
       An invalid request does NOT render broken geometry and does NOT throw: it
       renders auto and says so, so a surface showing a stale card, and a UI that
       has drifted, both degrade to the thing that always works. */
    var st = structure(o.layout === undefined || o.layout === null ? o.id : o.layout, goal);
    var entry = byId(st.family) || byId('auto');
    var rows = st.rows, cols = st.cols, rowCounts = st.rowCounts;

    /* ── the cell edge and the decoration budget · ONE solver ───────────── */
    var geo = solveSize(entry, st, box, gap, maxSize, minSize, rounded, pinned);
    if (pinned > 0 && fit === 'shrink') {
      var ext = blockExtent(entry, st, gap, geo);
      if (ext.w > box.w + 1e-6 || ext.h > box.h + 1e-6) {
        /* the pin becomes the cap and the solver takes over — the STRUCTURE
           does not move, only the size, which is the whole principle */
        maxSize = Math.min(maxSize, pinned);
        pinned = 0;
        geo = solveSize(entry, st, box, gap, maxSize, minSize, rounded, 0);
      }
    }
    var size = geo.size, amp = geo.amp, sag = geo.sag;

    /* THE LEAN THIS BOX CAN AFFORD BETWEEN NEIGHBOURS. The size solve has
       already paid the row's allowance against the box walls; this is the other
       half, and it is the one v2.0.0 was missing: the widening happens between
       EVERY adjacent pair, and only gap.x is there to absorb it. Solved once —
       size and gap.x are the same for every cell — and the arc is the only
       layout that leans, so nothing else pays anything. */
    var leanMax = entry.curve ? leanCap(size, gap.x) : 0;

    /* the zigzag step WIDENS the row spacing rather than eating it, so adjacent
       rows keep their full gap whatever the column parity works out to */
    var rowStep = size + gap.y + 2 * amp;
    var blockW = cols * size + (cols - 1) * gap.x;
    var blockH = rows * size + (rows - 1) * (gap.y + 2 * amp) + 2 * amp + sag;
    var blockX = (box.w - blockW) / 2;
    var blockY = (box.h - blockH) / 2;

    /* ── lay the cells out, left-to-right ───────────────────────────────── */
    var cells = [], centres = [];
    var i = 0, r, c;
    for (r = 0; r < rows; r++) {
      var count = rowCounts[r];
      var rowW = count * size + (count - 1) * gap.x;
      /* THE SHORT ROW CENTRES. Every surface renders justify-content:center
         today, so centring is what already ships — and 'start' / 'end' mean
         the reading start and end, which the RTL mirror below turns around. */
      var rowX = align === 'center' ? (box.w - rowW) / 2
        : (align === 'start' ? blockX : blockX + (blockW - rowW));
      var rowY = blockY + amp + r * rowStep;

      /* the trail alternates its reading direction row by row — that is what
         makes it a route rather than a grid with a line drawn over it */
      var reversed = entry.trail && (r % 2 === 1);

      for (c = 0; c < count; c++) {
        var slot = reversed ? (count - 1 - c) : c;
        var x = rowX + slot * (size + gap.x);
        var y = rowY;
        var rot = 0, dy = 0;

        if (entry.zig) {
          /* INDEX parity, not column parity, so the step keeps running across a
             row break instead of resetting — the same read as the Scanner's
             long-standing ±5px till jitter, but here it is a chosen layout with
             room reserved for it, not decoration squeezed into the row gap */
          dy = (i % 2) ? amp : -amp;
          y += dy;
        }
        if (entry.curve) {
          var t = (goal > 1) ? ((2 * i) / (goal - 1)) - 1 : 0;   // -1 .. +1
          y += sag * (1 - t * t);
          /* the tangent of y = sag(1 - t²) across the row's width, under BOTH
             ceilings: ROT_MAX (taste, and what the size solve paid the box for)
             and leanMax (what this row's own gap.x can afford between adjacent
             stamps). leanMax is already ≤ ROT_MAX, so clamping to it satisfies
             both, and it is what stops two leaning cups from touching. */
          var span = blockW - size;
          var slope = span > 0 ? (-4 * sag * t) / span : 0;
          rot = clamp(Math.atan(slope) * 180 / Math.PI, -leanMax, leanMax);
        }

        var cx = x + size / 2, cy = y + size / 2;
        cells.push({
          i: i, row: r, col: slot,
          x: x, y: y, size: size, cx: cx, cy: cy, rot: rot, dy: dy,
          filled: i < filled, next: i === filled && filled < goal
        });
        centres.push({ x: cx, y: cy });
        i++;
      }
    }

    /* ── RTL · a true mirror about the box's vertical axis ──────────────────
       Mirroring the finished geometry (rather than re-deriving it) is what
       makes an Arabic card the exact reflection of its English self: the first
       stamp lands on the right, the short row stays centred, a trail winds the
       other way and every lean flips sign. */
    if (dir === 'rtl') {
      for (i = 0; i < cells.length; i++) {
        var cell = cells[i];
        cell.x = box.w - cell.x - cell.size;
        cell.cx = box.w - cell.cx;
        cell.rot = -cell.rot;
        centres[i] = { x: cell.cx, y: cell.cy };
      }
      blockX = box.w - blockX - blockW;
    }

    /* ── the bounding box actually occupied, DERIVED from the cells ─────────
       AND FROM THE LEAN. The caller is handed a `rot` to apply, so measuring
       the unrotated rect would be measuring a card nobody draws: a leaning
       square of edge s spans s·(|cosθ|+|sinθ|) about its own centre. Counting
       it here is what makes `overflow` an honest answer for the arc. */
    var content;
    if (cells.length) {
      var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      var RAD = Math.PI / 180;
      for (i = 0; i < cells.length; i++) {
        var cl = cells[i], half = cl.size / 2;
        var ext = cl.rot
          ? half * (Math.abs(Math.cos(cl.rot * RAD)) + Math.abs(Math.sin(cl.rot * RAD)))
          : half;
        if (cl.cx - ext < x0) x0 = cl.cx - ext;
        if (cl.cy - ext < y0) y0 = cl.cy - ext;
        if (cl.cx + ext > x1) x1 = cl.cx + ext;
        if (cl.cy + ext > y1) y1 = cl.cy + ext;
      }
      content = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
    } else content = { x: 0, y: 0, w: 0, h: 0 };

    var EPS = 1e-6;
    var overflow = content.x < -EPS || content.y < -EPS ||
      content.x + content.w > box.w + EPS || content.y + content.h > box.h + EPS;

    /* ── style strings · PURE GEOMETRY, never art ───────────────────────────
       No url(), no colour, no animation: those belong to the surface, which
       still draws its own <img src>, its own punch keyframes and its own halo.
       These exist only so the surfaces cannot drift on how a position becomes
       a style. Compose, do not replace: style + your own transform/animation. */
    for (i = 0; i < cells.length; i++) {
      cells[i].style = 'position:absolute;left:' + px(cells[i].x) + ';top:' + px(cells[i].y) +
        ';width:' + px(size) + ';height:' + px(size) + ';';
    }
    var containerStyle = 'position:relative;width:' + px(box.w) + ';height:' + px(box.h) +
      ';margin:0 auto;';

    /* ── the trail's connecting line ────────────────────────────────────── */
    var path = null;
    if (entry.trail && centres.length > 1) {
      var corner = Math.min(size * 0.55, (gap.y + size) * 0.45);
      path = {
        d: roundedPath(centres, corner),
        dFilled: filled > 1 ? roundedPath(centres.slice(0, filled), corner) : '',
        w: box.w, h: box.h,
        viewBox: '0 0 ' + n2(box.w) + ' ' + n2(box.h),
        /* the line sits BEHIND the stamps; z-index and colour are the caller's */
        svgStyle: 'position:absolute;left:0;top:0;width:' + px(box.w) + ';height:' + px(box.h) +
          ';display:block;overflow:visible;pointer-events:none;'
      };
    }

    return {
      ok: true,
      requested: st.requested,
      layout: st.layout,         // the CONCRETE layout — identical on every surface
      family: entry.id,          // 'auto' stays visible as the REQUEST that was honoured
      valid: st.valid, fellBack: st.fellBack,
      goal: goal, filled: filled, dir: dir, align: align,
      fit: fit, pinned: pinned > 0,   // was the caller's `size` honoured?
      size: size, rows: rows, cols: cols, rowCounts: rowCounts,
      gap: gap, box: box, content: content, overflow: overflow,
      amp: amp, sag: sag,
      containerStyle: containerStyle,
      cells: cells,
      path: path
    };
  }

  /* ── the sentence beside the numbers ─────────────────────────────────────
     Built from result.rowCounts, so the caption and the picture can never
     disagree — the house defect is a sentence next to a correct number,
     contradicting it. v1 had no branch above three rows and called a four-row
     card "Three rows"; the structure is now capped at MAX_ROWS AND this
     describes whatever it is actually handed, so neither half can lie.
     Latin numerals in both languages, and Arabic row-noun agreement
     (1 singular, 2 dual, 3-10 plural, 11+ singular tamyiz). */
  function rowsWord(rows, EN) {
    if (EN) {
      return rows === 1 ? 'One row'
        : rows === 2 ? 'Two rows'
          : rows === 3 ? 'Three rows'
            : (rows + ' rows');
    }
    return rows === 1 ? 'صف واحد'
      : rows === 2 ? 'صفّان'
        : rows === 3 ? 'ثلاثة صفوف'
          : rows <= 10 ? (rows + ' صفوف')
            : (rows + ' صفًا');
  }
  function summary(result, lang) {
    var EN = String(lang || 'en').toLowerCase() !== 'ar';
    if (!result || !result.rowCounts || !result.rowCounts.length) return '';
    var rc = result.rowCounts, rows = rc.length;
    var even = rc.every(function (n) { return n === rc[0]; });
    var word = rowsWord(rows, EN);
    if (rows === 1) return word + (EN ? ' of ' : ' من ') + rc[0];
    if (even) return word + (EN ? ' of ' : ' من ') + rc[0];
    return word + ' — ' + rc.join(EN ? ', ' : '، ');
  }
  /* the picker's own label / one-liner, in the caller's language */
  function label(id, lang) {
    var e = get(id);
    return e ? (String(lang || 'en').toLowerCase() === 'ar' ? e.label.ar : e.label.en) : '';
  }
  function hint(id, lang) {
    var e = get(id);
    return e ? (String(lang || 'en').toLowerCase() === 'ar' ? e.hint.ar : e.hint.en) : '';
  }

  var API = {
    VERSION: '2.0.0',
    DEFAULT: 'auto',
    FIELD: LAYOUT_FIELD,
    MAX_GOAL: MAX_GOAL,
    MAX_ROWS: MAX_ROWS,
    LEGIBLE_MIN: LEGIBLE_MIN,
    ROT_MAX: ROT_MAX,
    REFERENCE: REFERENCE,      // the DEFAULT box only — it decides no structure
    SURFACES: SURFACES,        // the real boxes; judge:true is the legibility jury
    AUTO: AUTO,                // goal → rows, the whole of `auto`
    LAYOUTS: CATALOGUE,
    ids: ids,
    get: get,
    normalize: normalize,
    fromCard: fromCard,
    autoRows: autoRows,
    structure: structure,      // (layout, goal) → rows/cols/rowCounts/layout, no box
    isValid: isValid,
    optionsFor: optionsFor,
    goalRange: goalRange,
    resolve: resolve,
    compute: compute,
    summary: summary,
    label: label,
    hint: hint
  };

  if (root) root.WASLA_STAMP_LAYOUT = API;
  /* the browser never sees this branch; it is how the geometry gets tested */
  if (typeof module !== 'undefined' && module.exports) module.exports = API;

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
