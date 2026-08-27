import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  AtSign,
  Award,
  BadgeCheck,
  Briefcase,
  CalendarRange,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  FlaskConical,
  Gauge,
  Layers,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Monitor,
  Phone,
  Play,
  Plus,
  ShoppingBag,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react'
import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  useLocation,
  useParams,
  useNavigate,
} from 'react-router-dom'

// ---------------------------------------------------------------------------
// Données (dossier développeur · contenu du site)
// ---------------------------------------------------------------------------

const AGENCY_WA = '212780931067'
const WHATSAPP_ID = AGENCY_WA.replace(/^212/, '07') // 07 80 93 10 67

const MODULES = [
  {
    id: 'pathologies',
    name: 'Pathologies et cas de comptoir',
    short: 'Pathologies',
    desc: "Reconnaître, conseiller, orienter : les situations cliniques du quotidien, de l'urgence vitale à l'ordonnance à risque.",
  },
  {
    id: 'nutrition',
    name: 'Nutrition et micronutrition',
    short: 'Nutrition',
    desc: "Microbiote, compléments et micronutriments : conseiller juste sur des demandes qui explosent au comptoir.",
  },
  {
    id: 'dermo',
    name: 'Dermocosmétique',
    short: 'Dermocosmétique',
    desc: "Lire une peau et bâtir la bonne routine : le conseil dermo qui rassure et fidélise.",
  },
  {
    id: 'management',
    name: 'Management officinal',
    short: 'Management',
    desc: "Piloter son officine par les chiffres : gestion, comptabilité, trésorerie, stocks, données et IA.",
  },
  {
    id: 'relation',
    name: 'Développement personnel et relation client',
    short: 'Relation client',
    desc: "Mieux écouter, mieux conseiller, mieux vendre : la relation client au service du patient.",
  },
  {
    id: 'naturelles',
    name: 'Médecines naturelles',
    short: 'Médecines naturelles',
    desc: "Phytothérapie et approches naturelles : un conseil complémentaire, maîtrisé et sécurisé.",
  },
]

const WORKSHOPS = [
  {
    id: 1,
    jour: 'Mar',
    d: '6',
    mois: 'oct',
    date: 'mardi 6 oct.',
    module: 'nutrition',
    finalised: true,
    title: "Micronutrition à l'officine : l'atelier immersif pour transformer votre conseil",
    speaker: 'Dr Misk Mouri',
    accro: 'Workshop 100 % interactif : cas de comptoir réels, quiz, mises en situation et fiche pratique clé en main.',
    axes: [
      "Le microbiote : comprendre et l'expliquer simplement.",
      'Probiotiques, prébiotiques, synbiotiques : bien orienter.',
      'Médicament ou complément : faire le bon choix.',
      'Micronutriments selon les pathologies (HTA, diabète, thyroïde).',
      'Cas réels, quiz et arbre décisionnel.',
    ],
  },
  {
    id: 2,
    jour: 'Jeu',
    d: '8',
    mois: 'oct',
    date: 'jeudi 8 oct.',
    module: 'pathologies',
    finalised: true,
    title: "Quand l'urgence vitale survient en pleine officine",
    speaker: 'Pr Mohammed Mouhaoui',
    accro: 'Workshop avec simulation : reconnaître les signes de gravité, agir, orienter.',
    axes: [
      'Reconnaître les signes de gravité.',
      'Les gestes immédiats de secours.',
      'Orienter le patient selon la gravité.',
      'Scénario de simulation en direct.',
      "La trousse d'urgence à l'officine.",
    ],
  },
  {
    id: 3,
    jour: 'Mar',
    d: '13',
    mois: 'oct',
    date: 'mardi 13 oct.',
    module: 'management',
    finalised: true,
    title: 'Pharmacien et expert-comptable : décoder la relation pour mieux collaborer',
    speaker: 'Mr Zohair Kazmane',
    accro: 'Décoder la relation entre le pharmacien et son expert-comptable pour mieux collaborer : missions, obligations et bonnes pratiques.',
    axes: [
      'Ce que fait vraiment votre comptable.',
      'Vos obligations et responsabilités.',
      'Zones de tension et erreurs fréquentes.',
      'Outils et bonnes pratiques de collaboration.',
      'Simulations : trésorerie, contrôle fiscal, cession.',
    ],
  },
  {
    id: 4,
    jour: 'Jeu',
    d: '15',
    mois: 'oct',
    date: 'jeudi 15 oct.',
    module: 'pathologies',
    finalised: true,
    title: "Interactions médicamenteuses à l'officine : les réflexes qui évitent l'iatrogénie",
    speaker: 'Dr Saadia Skalli',
    accro: null,
    axes: [
      "Repérer l'interaction à risque réel.",
      'Interaction réelle ou théorique ?',
      'Conduite à tenir : substituer, adapter, orienter.',
      'Le rôle du pharmacien en pharmacovigilance.',
      'Études de cas concrets.',
    ],
  },
  {
    id: 5,
    jour: 'Mar',
    d: '20',
    mois: 'oct',
    date: 'mardi 20 oct.',
    module: 'relation',
    finalised: true,
    title: 'Le comptoir autrement : conseiller, convaincre, fidéliser',
    speaker: 'Dr Maha El Haddaj',
    accro: 'Workshop 100 % interactif : écoute active, objections, vente additionnelle et fidélisation (exemples concrets, quiz, jeux).',
    axes: [
      'Écoute active : cerner le vrai besoin.',
      'Un conseil clair, utile et vendeur.',
      'Traiter les objections avec justesse.',
      'Vente additionnelle, sans forcer.',
      "Quiz et plan d'action concret.",
    ],
  },
  {
    id: 6,
    jour: 'Jeu',
    d: '22',
    mois: 'oct',
    date: 'jeudi 22 oct.',
    module: 'management',
    finalised: true,
    title: "Les angles morts de votre officine : ce que vous ignorez de vos données",
    speaker: 'Dr Nabyl Bentayeb',
    accro: 'Diagnostic data et IA, cas réels, outils prêts à l\u2019emploi.',
    axes: [
      'Le quiz du titulaire, en direct.',
      "Les 5 chiffres qui pilotent l'officine.",
      'Le cash qui dort dans vos rayons.',
      "L'IA en direct sur vos ventes.",
      'Données patients : la limite à ne pas franchir.',
    ],
  },
  {
    id: 7,
    jour: 'Mar',
    d: '27',
    mois: 'oct',
    date: 'mardi 27 oct.',
    module: 'management',
    finalised: true,
    title: "Les réflexes comptoir qui font la différence sur votre chiffre d'affaires",
    speaker: 'Marouane Zahir',
    accro: null,
    axes: [
      'Mieux conseiller pour mieux vendre, sans vente forcée.',
      'Les techniques de vente adaptées au comptoir.',
      'Développer les ventes associées : OTC, parapharmacie, compléments et accessoires.',
      'Détecter les besoins non exprimés et poser les bonnes questions.',
      'Répondre aux objections : prix, hésitation, refus, comparaison.',
      'Cas concrets et mises en situation, réflexes applicables immédiatement.',
    ],
  },
  {
    id: 8,
    jour: 'Jeu',
    d: '29',
    mois: 'oct',
    date: 'jeudi 29 oct.',
    module: 'dermo',
    finalised: true,
    title: "Diagnostic de peau à l'officine : le conseil dermocosmétique qui rassure et fidélise",
    speaker: 'Dr Najla Boujaddaini',
    accro: null,
    axes: [
      'Lire une peau : types de peau et vrais besoins.',
      'Le diagnostic express : les bonnes questions au comptoir.',
      'La routine de base : nettoyer, hydrater, protéger, et les actifs clés.',
      'Les cas fréquents : acné, taches, sensibilité, vieillissement.',
      'Le conseil qui fidélise, et savoir quand réorienter.',
    ],
  },
]

const SPEAKERS = [
  {
    name: 'Dr Misk Mouri',
    ini: 'MM',
    photo: '/intervenant/Photo_Misk_Mouri.jpg.jpeg',
    finalised: true,
    role: 'Nutrition · Microbiote',
    points: [
      'Docteure en pharmacie et docteure en nutrition-santé.',
      "Plus de 23 ans d'exercice en officine, titulaire de la Pharmacie Misk (Rabat).",
      "Certifiée en naturopathie ; expertise microbiote et micronutrition.",
      'Enseignante universitaire, conférencière et auteure de publications scientifiques.',
    ],
  },
  {
    name: 'Dr Saadia Skalli',
    ini: 'SS',
    photo: '/intervenant/Photo_Saadia_Skalli.png',
    finalised: true,
    role: 'Pharmacovigilance · Sécurité du médicament',
    points: [
      'Pharmacienne clinicienne, consultante et formatrice en pharmacovigilance.',
      'Parcours hospitalier de référence (Lyon, Grenoble, CHU Sainte-Justine de Montréal).',
      "Spécialiste de l'analyse pharmaceutique et de la sécurisation du médicament.",
      "Expertise sécurité du médicament pendant la grossesse et l'allaitement.",
    ],
  },
  {
    name: 'Dr Maha El Haddaj',
    ini: 'MH',
    photo: '/intervenant/Photo_Maha_El_Haddaj.jpg.jpeg',
    finalised: true,
    role: 'Relation client · Bien-être au comptoir',
    points: [
      "Pharmacienne d'officine diplômée de l'Université d'Alcalá de Henares (Madrid).",
      'Coach mentale certifiée (école APR Madelrieux, Bordeaux).',
      'Praticienne en thérapies brèves (hypnose, EFT, EMDR).',
      'Approche alliant rigueur scientifique et mieux-être au comptoir.',
    ],
  },
  {
    name: 'Dr Nabyl Bentayeb',
    ini: 'NB',
    photo: '/intervenant/Photo_Nabyl_Bentayeb.png',
    finalised: true,
    role: 'Data, santé digitale et IA',
    points: [
      "Titulaire de la Pharmacie Rita, fondateur de CureData.io (data science et IA).",
      'Créateur de PharmaDash, solution de pilotage pour les officines.',
      'MBA Health Data Science et Master en Marketing (HEC Montréal).',
      'Enseignant en santé digitale et IA.',
    ],
  },
  {
    name: 'Mr Zohair Kazmane',
    ini: 'ZK',
    photo: '/intervenant/Photo_Zohair_Kazmane.jpg.jpeg',
    finalised: true,
    role: 'Gestion et comptabilité officinale',
    points: [
      "Expert-comptable et commissaire aux comptes (Ordre des Experts-Comptables au Maroc).",
      "18 ans d'expérience internationale en audit et conseil financier et fiscal.",
      "Missions de commissariat aux comptes et accompagnement de fusions-acquisitions.",
      "Fondateur du cabinet ELIOS CONSEIL.",
    ],
  },
  {
    name: 'Pr Mohammed Mouhaoui',
    ini: 'PM',
    photo: '/intervenant/Photo_Mohammed_Mouhaoui.png',
    finalised: true,
    role: 'Urgences · Simulation en santé',
    points: [
      "Professeur en anesthésie-réanimation, chef des urgences du CHU de Casablanca.",
      "Président de Morocco Sim et de l'Arab Council for Simulation in Healthcare.",
      'Formateur en santé digitale.',
    ],
  },
  {
    name: 'Marouane Zahir',
    ini: 'MZ',
    photo: '/intervenant/Photo_Marouane_Zahir.jpg.jpeg',
    finalised: true,
    role: 'Vente · Performance du comptoir',
    points: [
      "Directeur d'ANOVA PHARMA CONSULTING.",
      "Pharmacien formé en France et en Espagne, plus de 20 ans d'expérience en officine.",
      'Expérience de terrain variée : grandes villes, pharmacies de quartier, zones rurales.',
      'Accompagne les pharmacies : performance commerciale, expérience client et compétences des équipes.',
    ],
  },
  {
    name: 'Dr Najla Boujaddaini',
    ini: 'NB',
    photo: '/intervenant/Photo_Najla_Boujaddaini.jpg.jpeg',
    finalised: true,
    role: 'Dermocosmétique · Diagnostic de peau',
    points: [
      'Docteure en pharmacie et cosmétologue.',
      'Spécialiste du conseil dermocosmétique : peau, actifs et routines de soin.',
      'Créatrice de contenu en vulgarisation scientifique.',
      "Communication claire et fiable, au service d'un conseil qui fidélise.",
    ],
  },
]

const FAQ = [
  ['Puis-je ne prendre qu\u2019un seul atelier ?', "Oui. La formule à l'unité est faite pour ça. Si vous en ajoutez plusieurs, la remise pack s'applique automatiquement."],
  ['Présentiel ou distanciel ?', 'Chaque atelier est hybride. En présentiel, vous êtes sur place à Casablanca ; en distanciel, vous suivez la même séance en direct, à un tarif réduit de 100 DH.'],
  ['Comment se passe le paiement ?', "Vous finalisez sur WhatsApp. Nous confirmons le montant et vous envoyons le RIB ; votre place est réservée dès réception du justificatif."],
  ['Y a-t-il une attestation ?', 'Oui, une attestation de participation est remise à l\u2019issue de chaque atelier.'],
  ['Où ont lieu les ateliers ?', "À l'Espace Le Carré d'Or, à Casablanca (à côté de la gare Casa Oasis), et en direct à distance."],
  ['Les packs sont-ils nominatifs ?', "Oui. Chaque inscription est nominative : le tarif dégressif s'applique selon le nombre d'ateliers que vous suivez vous-même. Il ne s'agit pas de places à répartir dans une équipe."],
]

const TIERS = [
  { min: 6, label: 'Pack de 6', pres: 700, dist: 600 },
  { min: 3, label: 'Pack de 3', pres: 800, dist: 700 },
  { min: 0, label: "À l'unité", pres: 900, dist: 800 },
]

function findTier(n: number) {
  return TIERS.find((t) => n >= t.min)!
}

function tierLabel(n: number) {
  if (n >= 6) return 'Pack de 6 appliqué (le plus avantageux)'
  if (n >= 3) return 'Pack de 3 appliqué'
  return 'Tarif à l\u2019unité'
}

const PHILOSOPHIE = [
  ['Cas réels de comptoir', "On part de situations vécues à l'officine, pas de théorie.", 'FlaskConical'],
  ['Quiz et mises en situation', 'Vous participez et testez vos réflexes en direct.', 'Target'],
  ['Interactif, en petit comité', 'Des échanges avec l\u2019expert et entre pairs.', 'Users'],
  ['Fiche pratique offerte', 'Une synthèse à emporter à la fin de chaque atelier.', 'FileText'],
  ['Présentiel & distanciel', 'À Casablanca ou en direct à distance, au choix.', 'Monitor'],
  ['Attestation', 'Remise à l\u2019issue de chaque atelier.', 'Award'],
] as const

const PHIL_ICONS: Record<string, React.ReactNode> = {
  FlaskConical: <FlaskConical size={20} strokeWidth={1.8} />,
  Target: <Target size={20} strokeWidth={1.8} />,
  Users: <Users size={20} strokeWidth={1.8} />,
  FileText: <FileText size={20} strokeWidth={1.8} />,
  Monitor: <Monitor size={20} strokeWidth={1.8} />,
  Award: <Award size={20} strokeWidth={1.8} />,
}

// ---------------------------------------------------------------------------
// Contexte panier
// ---------------------------------------------------------------------------

type Line = { workshopId: number; format: 'P' | 'D' }
type CartCtx = {
  lines: Line[]
  add: (id: number, format: 'P' | 'D') => void
  remove: (id: number) => void
  setFormat: (id: number, format: 'P' | 'D') => void
  clear: () => void
  count: number
}

const CartContext = createContext<CartCtx>({
  lines: [],
  add: () => {},
  remove: () => {},
  setFormat: () => {},
  clear: () => {},
  count: 0,
})

function unitPrice(n: number, format: 'P' | 'D') {
  const tier = findTier(n)
  return format === 'P' ? tier.pres : tier.dist
}

function useCart(): CartCtx {
  const ctx = useContext(CartContext)
  return ctx
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

function ReReveal({ children, as: Tag = 'div', delay = 0, className = '' }: any) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let io: IntersectionObserver | null = null
    const show = () => setShown(true)

    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              show()
              io && io.unobserve(entry.target)
            }
          }),
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
      )
      io.observe(el)
      // Si l'élément est déjà visible à l'écran, le révéler immédiatement.
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) show()
    } else {
      show()
    }
    return () => {
      if (io) io.disconnect()
    }
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={{ ['--d' as any]: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

function ModuleBadge({ id }: { id: string }) {
  const m = MODULES.find((x) => x.id === id)
  return <span className="tag">{m ? m.short : id}</span>
}

function Cursor() {
  const [hover, setHover] = useState(false)
  const dot = useRef<HTMLDivElement | null>(null)
  const ring = useRef<HTMLDivElement | null>(null)
  const [fine, setFine] = useState(false)
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mq =
      window.matchMedia('(any-pointer: fine)').matches ||
      window.matchMedia('(pointer: fine)').matches
    setFine(mq)
  }, [])

  useEffect(() => {
    if (!fine) return
    let raf = 0
    const move = (e: MouseEvent) => {
      document.body.classList.add('has-mouse')
      pos.current = { x: e.clientX, y: e.clientY }
      if (dot.current) dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      const el = e.target as HTMLElement
      setHover(!!el.closest('a, button, [role="button"], .spk, .mod-card, input, textarea, .pillar, .ci, .hero-tag'))
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (ring.current) ring.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) scale(${hover ? 1.6 : 1})`
      })
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [fine, hover])

  if (!fine) return null
  return (
    <>
      <div ref={dot} className="cur-dot" aria-hidden="true" />
      <div ref={ring} className={`cur-ring${hover ? ' grow' : ''}`} aria-hidden="true" />
    </>
  )
}



function SpeakerAvatar({ name, ini, photo, finalised }: { name: string; ini: string; photo: string | null; finalised: boolean }) {
  if (photo) {
    return (
      <div className={`av av-photo${finalised ? '' : ' av-tbd'}`}>
        <img src={photo} alt={name} loading="lazy" />
        {!finalised && <span className="av-note">à venir</span>}
      </div>
    )
  }
  return (
    <div className={`av${finalised ? '' : ' av-tbd'}`}>
      {ini}
      {!finalised && <span className="av-note">à venir</span>}
    </div>
  )
}

function AxesBlock({ w }: { w: (typeof WORKSHOPS)[number] }) {
  if (w.finalised) {
    return (
      <>
        {w.accro && <div className="accro">{w.accro}</div>}
        {w.axes && (
          <ul className="axes">
            <li className="lbl">Axes abordés</li>
            {w.axes.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        )}
      </>
    )
  }
  return (
    <span className="to-come">
      <span className="badge warn">Non finalisé · détail à venir</span>
    </span>
  )
}

function WorkshopCard({ w }: { w: (typeof WORKSHOPS)[number] }) {
  const cart = useCart()
  const line = cart.lines.find((l) => l.workshopId === w.id)
  const [sel, setSel] = useState<'P' | 'D'>(line ? line.format : 'P')
  const format: 'P' | 'D' = line ? line.format : sel
  const price = unitPrice(cart.count || 1, format)
  const module = MODULES.find((m) => m.id === w.module)!
  const pick = (f: 'P' | 'D') => {
    setSel(f)
    if (line) cart.setFormat(w.id, f)
  }

  return (
    <article className={`card ${line ? 'on' : ''}`}>
      <div className="top">
        <div className="datebox">
          <b>{w.d}</b>
          <span>
            {w.jour} {w.mois}
          </span>
        </div>
        <div className="top-right">
          {w.finalised ? (
            <ModuleBadge id={w.module} />
          ) : (
            <span className="badge warn">Non finalisé</span>
          )}
        </div>
      </div>

      <Link to={`/module/${module.id}`} className="card-module">
        {module.short} <ChevronRight size={13} />
      </Link>
      <h3>{w.title}</h3>
      <div className="exp">
        <Users size={14} /> {w.speaker}
      </div>

      <AxesBlock w={w} />

      <div className="row">
        <div className="toggle">
          <button
            className={format === 'P' ? 'on' : ''}
            onClick={() => pick('P')}
          >
            Présentiel
          </button>
          <button
            className={format === 'D' ? 'on' : ''}
            onClick={() => pick('D')}
          >
            Distanciel
          </button>
        </div>
        <button
          className={`add ${line ? 'in' : ''}`}
          onClick={() => (line ? cart.remove(w.id) : cart.add(w.id, format))}
        >
          {line ? (
            <>
              <Check size={15} /> Ajouté
            </>
          ) : (
            <>
              <Plus size={15} /> Ajouter
            </>
          )}
        </button>
      </div>
      <div className="price-line">
    {price} DH <span>/ atelier</span>
  </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// En-tête / pied de page
// ---------------------------------------------------------------------------

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

function Header({ onCartOpen }: { onCartOpen: () => void }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const cart = useCart()
  const links = [
    ['/', 'Accueil'],
    ['/philosophie', 'Philosophie'],
    ['/modules', 'Modules'],
    ['/programme', 'Programme'],
    ['/intervenants', 'Intervenants'],
    ['/tarifs', 'Tarifs'],
    ['/faq', 'FAQ'],
  ]

  return (
    <header className="nav">
      <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="Passeport Formation Pharmaciens">
        <img src="/images/logo.png" alt="Passeport Formation Pharmaciens" className="brand-logo" />
      </Link>

      <nav className={`nav-links ${open ? 'open' : ''}`}>
        {links.map(([href, label]) => (
          <Link
            key={href}
            to={href}
            className={pathname === href || pathname.startsWith(href + '/') ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="nav-actions">
          <Link to="/inscription" className="nav-cta">
            Réserver ma place <ArrowRight size={16} />
          </Link>
          <button
            className="nav-cart"
            aria-label={`Ouvrir le panier (${cart.count} ateliers)`}
            onClick={() => {
              setOpen(false)
              onCartOpen()
            }}
          >
            <ShoppingBag size={17} />
            <b>{cart.count}</b>
          </button>
          <button
            className="menu-button"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
  )
}

function MarqueeRow() {
  return (
    <span className="marquee-row">
      <span>FORMEZ-VOUS AUTREMENT</span>
      <span>·</span>
      <span>DES COMPÉTENCES QUI RESTENT</span>
      <span>·</span>
      <span>PROCHAIN RENDEZ-VOUS · OCTOBRE 2026</span>
      <span>·</span>
      <span>PRÉSENTIEL &amp; DISTANCIEL EN DIRECT</span>
      <span>·</span>
    </span>
  )
}

function TopMarquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <MarqueeRow key={k} />
        ))}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div className="foot-brand">
          <Link to="/" className="brand" aria-label="Passeport Formation Pharmaciens">
            <img src="/images/logo.png" alt="Passeport Formation Pharmaciens" className="brand-logo" />
          </Link>
          <p>
            La formation continue des pharmaciens d'officine, en présentiel à Casablanca et en
            direct à distance.
          </p>
        </div>
        <div className="foot-col">
          <h4>Programme</h4>
          {MODULES.map((m) => (
            <Link key={m.id} to={`/module/${m.id}`}>
              {m.short}
            </Link>
          ))}
        </div>
        <div className="foot-col">
          <h4>Informations</h4>
          <Link to="/tarifs">Formules et tarifs</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/inscription">S'inscrire</Link>
          <Link to="/intervenants">Intervenants</Link>
        </div>
        <div className="foot-col">
          <h4>Contact</h4>
          <a href={`https://wa.me/${AGENCY_WA}`}>
            <Phone size={14} /> WhatsApp {WHATSAPP_ID}
          </a>
          <a href="https://instagram.com/lpmacademy" target="_blank" rel="noreferrer">
            <AtSign size={14} /> @lpmacademy
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <Briefcase size={14} /> Pharmacien Manager Academy
          </a>
          <span>
            <MapPin size={14} /> Espace Le Carré d'Or, Casablanca
          </span>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 Passeport Formation · Pharmacien Manager (agence Easycom)</span>
        <span>Lpmacademy.com</span>
      </div>
    </footer>
  )
}

// ---------------------------------------------------------------------------
// Sections de la page d'accueil
// ---------------------------------------------------------------------------

function Hero() {
  const next = WORKSHOPS[0]
  const module = MODULES.find((m) => m.id === next.module)!
  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">
          <Sparkles size={14} strokeWidth={1.6} />
          FORMATION CONTINUE · PHARMACIENS D'OFFICINE
        </p>
        <h1>
          La formation continue des pharmaciens, <em>en présentiel et en direct.</em>
        </h1>
        <p className="hero-text">
          Deux ateliers par semaine, animés par des experts reconnus. Des cas de comptoir concrets,
          des quiz, une pédagogie vivante et une attestation à la clé. Composez votre sélection et
          réservez en un message.
        </p>
        <div className="hero-actions">
          <Link to="/programme" className="button primary">
            Voir le programme d'octobre <ArrowRight size={18} />
          </Link>
          <Link to="/philosophie" className="text-link">
            <Play size={15} fill="currentColor" /> Comment ça marche
          </Link>
        </div>
        <div className="hero-stripe">
          <span>
            <MapPin size={15} /> Présentiel à <b>Casablanca</b>
          </span>
          <span>
            <Monitor size={15} /> Distanciel <b>en direct</b>
          </span>
          <span>
            <Clock size={15} /> Mardi &amp; jeudi · <b>15h à 18h30</b>
          </span>
        </div>

        <div className="hero-stats">
          <div className="hs-item">
            <Gauge size={20} strokeWidth={1.8} />
            <div>
              <b>02</b>
              <span>ateliers / semaine</span>
            </div>
          </div>
          <div className="hs-item">
            <Layers size={20} strokeWidth={1.8} />
            <div>
              <b>06</b>
              <span>modules de formation</span>
            </div>
          </div>
          <div className="hs-item">
            <BadgeCheck size={20} strokeWidth={1.8} />
            <div>
              <b>08+</b>
              <span>experts reconnus</span>
            </div>
          </div>
          <div className="hs-item">
            <Award size={20} strokeWidth={1.8} />
            <div>
              <b>01</b>
              <span>attestation / atelier</span>
            </div>
          </div>
        </div>

        <div className="hero-tags">
          {MODULES.slice(0, 6).map((m) => (
            <Link key={m.id} to={`/module/${m.id}`} className="hero-tag">
              {m.short}
            </Link>
          ))}
        </div>
      </div>
      <div className="hero-card-wrap">
        <div className="hero-card">
          <div className="hc-bar" aria-hidden="true" />
          <div className="hc-top">
            <span className="card-label">
              <CalendarRange size={14} /> Prochaine session
            </span>
            <span className="hc-fmt">En direct</span>
          </div>
          <div className="hc-date">
            <span className="hc-bb">{next.d}</span>
            <span className="hc-bm">
              {next.jour}. {next.mois}
            </span>
          </div>
          <p className="hc-title">{next.title}</p>
          <div className="hc-who">
            <span className="dot" />
            {next.speaker} · {module.short}
          </div>
          <div className="hc-meta">
            <span>
              <MapPin size={13} /> Présentiel · Casablanca
            </span>
            <span>15h – 18h30</span>
          </div>
          <Link to="/programme" className="card-link">
            Réserver ma place <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Philosophie() {
  return (
    <section className="section philosophie" id="philosophie">
      <ReReveal>
        <p className="eyebrow">01 / Notre philosophie</p>
      </ReReveal>
      <ReReveal delay={60}>
        <h2>
          Des ateliers vivants, <span>pas des cours magistraux.</span>
        </h2>
      </ReReveal>
      <ReReveal delay={120}>
        <p className="lead">
          On part de situations réelles, on fait participer, et on repart avec des réflexes
          applicables dès le lendemain.
        </p>
      </ReReveal>
      <div className="pillars">
        {PHILOSOPHIE.map(([t, d, icon], i) => (
          <ReReveal key={t} delay={i * 70} className="pillar">
            <div className="pillar-ico">{PHIL_ICONS[icon as keyof typeof PHIL_ICONS]}</div>
            <h3>{t}</h3>
            <p>{d}</p>
          </ReReveal>
        ))}
      </div>
    </section>
  )
}

function ModulesSection() {
  return (
    <section className="section modules" id="modules">
      <ReReveal>
        <p className="eyebrow">02 / Le catalogue</p>
      </ReReveal>
      <ReReveal delay={60}>
        <h2>
          Les <span>6 modules</span> de formation.
        </h2>
      </ReReveal>
      <ReReveal delay={120}>
        <p className="lead">
          Le catalogue est organisé en six modules, qui servent aussi de filtres. Cliquez un module
          pour ouvrir sa vue dédiée.
        </p>
      </ReReveal>
      <div className="mod-grid">
        {MODULES.map((m, i) => {
          const w = WORKSHOPS.filter((x) => x.module === m.id)
          return (
            <ReReveal key={m.id} delay={i * 50} className={`mod r-${['left', 'right', 'zoom'][i % 3]}`}>
              <Link to={`/module/${m.id}`} className="mod-link">
                <span className="mod-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{m.name}</h3>
                <p>{m.desc}</p>
                <div className="mod-foot">
                  <span>
                    {w.length} atelier{w.length > 1 ? 's' : ''}
                  </span>
                  <span className="mod-go">
                    Explorer <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            </ReReveal>
          )
        })}
      </div>
    </section>
  )
}

function Programme() {
  const [filter, setFilter] = useState('all')
  const shown = filter === 'all' ? WORKSHOPS : WORKSHOPS.filter((w) => w.module === filter)
  return (
    <section className="section programme" id="programme" style={{ background: 'var(--cloud)' }}>
      <ReReveal>
        <p className="eyebrow">03 / Le programme d'octobre</p>
      </ReReveal>
      <ReReveal delay={60}>
        <h2>
          Le <span>programme</span> du mois.
        </h2>
      </ReReveal>
      <ReReveal delay={120}>
        <p className="lead">
          Horaire 15h–18h30. Le prix affiché est le tarif à l'unité ; il baisse selon votre panier.
          Le distanciel coûte 100 DH de moins par atelier.
        </p>
      </ReReveal>

      <ReReveal delay={160} className="filters">
        <button className={`chip ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>
          Tous
        </button>
        {MODULES.map((m) => (
          <button
            key={m.id}
            className={`chip ${filter === m.id ? 'on' : ''}`}
            onClick={() => setFilter(m.id)}
          >
            {m.short}
          </button>
        ))}
      </ReReveal>

      <div className="cards">
        {shown.map((w, i) => (
          <ReReveal key={w.id} delay={Math.min(i * 40, 200)} className="card-slot">
            <WorkshopCard w={w} />
          </ReReveal>
        ))}
      </div>
    </section>
  )
}

function Intervenants() {
  return (
    <section className="section intervenants" id="intervenants">
      <ReReveal>
        <p className="eyebrow">04 / Les intervenants</p>
      </ReReveal>
      <ReReveal delay={60}>
        <h2>
          Ceux qui <span>vous forment.</span>
        </h2>
      </ReReveal>
      <ReReveal delay={120}>
        <p className="lead">
          Des experts reconnus. Un intervenant peut animer plusieurs ateliers au fil des éditions ;
          on ne le lie donc pas à un seul titre.
        </p>
      </ReReveal>
      <div className="spk-grid">
        {SPEAKERS.map((s, i) => (
          <ReReveal key={s.name} delay={Math.min(i * 40, 200)} className={`spk r-${i % 2 ? 'right' : 'left'}`}>
            <span className="spk-idx">{String(i + 1).padStart(2, '0')}</span>
            <SpeakerAvatar name={s.name} ini={s.ini} photo={s.photo} finalised={s.finalised} />
            <div className="spk-body">
              <div className={`st ${s.finalised ? '' : 'warn'}`}>
                {s.finalised ? 'Intervenant' : 'Non finalisé · à modifier'}
              </div>
              <h3>{s.name}</h3>
              <p className="role">{s.role}</p>
              <ul>
                {s.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          </ReReveal>
        ))}
      </div>
    </section>
  )
}

function Tarifs() {
  return (
    <section className="pricing" id="tarifs">
      <div className="pricing-copy">
        <ReReveal delay={60}>
          <h2>
            Trois formules, <i>dégressives.</i>
          </h2>
        </ReReveal>
        <ReReveal delay={120}>
          <p>
            Le prix par atelier baisse selon le nombre d'ateliers dans votre panier ; le distanciel
            retire 100 DH par atelier à chaque palier. Le panier applique automatiquement le
            meilleur palier. Chaque inscription est nominative (un seul participant).
          </p>
        </ReReveal>
      </div>
      <div className="price-stack">
        {[
          ['À l\u2019unité', 900, 800, '1 à 2 ateliers'],
          ['Pack de 3', 800, 700, 'dès 3 ateliers'],
        ].map(([label, pres, dist, cond], i) => (
          <ReReveal key={label as string} className="price-card">
            <span className="pc-num">0{i + 1}</span>
            <h3>{label}</h3>
            <div className="price">
              <strong>{pres} DH</strong> <span>en présentiel</span>
            </div>
            <div className="dist">{dist} DH en distanciel</div>
            <div className="cond">{cond}</div>
          </ReReveal>
        ))}
        <ReReveal className="price-card best">
          <span className="pc-num">03</span>
          <div className="rib">Le plus choisi</div>
          <h3>Pack de 6</h3>
          <div className="price">
            <strong>700 DH</strong> <span>en présentiel</span>
          </div>
          <div className="dist">600 DH en distanciel</div>
          <div className="cond">dès 6 ateliers · le plus avantageux</div>
          <Link to="/inscription" className="price-cta">
            Je choisis ce pack <ArrowRight size={16} />
          </Link>
        </ReReveal>
      </div>
    </section>
  )
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className="section faq" id="faq">
      <div className="faq-head">
        <ReReveal>
          <p className="eyebrow">06 / Vos questions</p>
        </ReReveal>
        <ReReveal delay={60}>
          <h2>
            On vous <span>éclaire.</span>
          </h2>
        </ReReveal>
      </div>
      <div className="faq-list">
        {FAQ.map(([q, a], i) => (
          <ReReveal key={q} delay={i * 40} className="faq-item">
            <button onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="faq-q">
                <span className="faq-n">0{i + 1}</span>
                <span>{q}</span>
              </span>
              {open === i ? <X size={18} /> : <ChevronDown size={18} />}
            </button>
            <div className={`faq-a ${open === i ? 'open' : ''}`}>
              <p>{a}</p>
            </div>
          </ReReveal>
        ))}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Vue module dédiée
// ---------------------------------------------------------------------------

function ModuleView() {
  const { id } = useParams()
  const module = MODULES.find((m) => m.id === id)
  const cart = useCart()
  const navigate = useNavigate()

  if (!module) {
    return (
      <section className="section page">
        <h2>Module introuvable</h2>
        <Link className="button primary" to="/">
          Retour à l'accueil
        </Link>
      </section>
    )
  }

  const current = WORKSHOPS.filter((w) => w.module === module.id && w.finalised)
  const addAll = () => {
    current.forEach((w) => {
      if (!cart.lines.find((l) => l.workshopId === w.id)) cart.add(w.id, 'P')
    })
    navigate('/inscription')
  }

  const idx = String(MODULES.indexOf(module) + 1).padStart(2, '0')

  return (
    <section className="module-view">
      <div className="mv-top">
        <p className="eyebrow">Module {idx} / 06</p>
        <Link to="/" className="back oc-back">
          <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} /> Retour à l'accueil
        </Link>
      </div>
      <div className="mv-head">
        <h1>{module.name}</h1>
        <p className="lead">{module.desc}</p>
        {current.length > 0 && (
          <button className="button primary" onClick={addAll}>
            <Plus size={17} /> Réserver les {current.length} atelier{current.length > 1 ? 's' : ''}
          </button>
        )}
      </div>

      <div className="mv-body">
        <div className="mv-block">
          <h2>Les <span>ateliers</span></h2>
          {current.length ? (
            <div className="cards">
              {current.map((w, i) => (
                <ReReveal key={w.id} delay={i * 40} className="card-slot">
                  <WorkshopCard w={w} />
                </ReReveal>
              ))}
            </div>
          ) : (
            <p className="empty">Aucune session programmée pour le moment.</p>
          )}
        </div>

        <div className="mv-block">
          <h2>À <span>venir</span></h2>
          <p className="empty">
            D'autres thématiques de ce module seront bientôt programmées. Manifestez votre
            intérêt : on vous prévient dès qu'une session s'ouvre.
          </p>
          <a
            className="button primary"
            href={`https://wa.me/${AGENCY_WA}?text=${encodeURIComponent(
              `Bonjour, je souhaite être informé(e) des prochaines sessions du module « ${module.name} ».`,
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} /> Manifester mon intérêt
          </a>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Page inscription (panier + formulaire + WhatsApp)
// ---------------------------------------------------------------------------

function Inscription() {
  const cart = useCart()
  const n = cart.count
  const tier = findTier(n || 1)
  const [form, setForm] = useState({ prenom: '', nom: '', tel: '', pharma: '', ville: '' })
  const [tried, setTried] = useState(false)

  const total = useMemo(
    () => cart.lines.reduce((s, l) => s + unitPrice(cart.count, l.format), 0),
    [cart.lines, cart.count],
  )
  const ref = useMemo(
    () => cart.lines.reduce((s, l) => s + unitPrice(1, l.format), 0),
    [cart.lines],
  )
  const save = ref - total

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const empty = (Object.keys(form) as (keyof typeof form)[]).filter((k) => !form[k].trim())

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (empty.length || n === 0) return
    const lignes = cart.lines.map((l) => {
      const w = WORKSHOPS.find((x) => x.id === l.workshopId)!
      const p = unitPrice(cart.count, l.format)
      return `- ${w.title.split(' : ')[0]} (${l.format === 'P' ? 'présentiel' : 'distanciel'}, ${w.date}) : ${p} DH`
    })
    const msg = [
      'Bonjour, je souhaite m\u2019inscrire au Passeport Formation.',
      '',
      'Mes coordonnées :',
      `- Nom et prénom : ${form.prenom} ${form.nom}`,
      `- Téléphone : ${form.tel}`,
      `- Pharmacie ou faculté : ${form.pharma}`,
      `- Ville : ${form.ville}`,
      '',
      `Formule : ${tier.label} (${tier.pres} DH/atelier en présentiel)`,
      'Ateliers :',
      ...lignes,
      'Total à régler : ' + total.toLocaleString('fr-FR') + ' DH',
      save > 0 ? `Économie vs tarif unité : ${save.toLocaleString('fr-FR')} DH` : '',
      '',
      'Merci de me confirmer et de m\u2019envoyer le RIB.',
    ]
      .filter(Boolean)
      .join('\n')
    window.open(`https://wa.me/${AGENCY_WA}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section className="inscription">
      <div className="insc-head">
        <p className="eyebrow">07 / S'inscrire</p>
        <h1>
          Réservez votre <span>place.</span>
        </h1>
        <p className="lead">
          Composez votre panier, choisissez le format de chaque atelier, puis finalisez sur
          WhatsApp. On confirme le montant, on vous envoie le RIB, votre place est réservée.
        </p>
      </div>

      <div className="insc-grid">
        <div className="insc-form">
          <div className="form-card">
            <h2>Vos coordonnées</h2>
            <p className="hint">Tous les champs sont obligatoires.</p>
            <form onSubmit={submit} noValidate>
              <div className="field-row">
                <label>
                  <span>Prénom</span>
                  <input
                    placeholder="Votre prénom"
                    value={form.prenom}
                    onChange={set('prenom')}
                    className={tried && !form.prenom.trim() ? 'err' : ''}
                  />
                </label>
                <label>
                  <span>Nom</span>
                  <input
                    placeholder="Votre nom"
                    value={form.nom}
                    onChange={set('nom')}
                    className={tried && !form.nom.trim() ? 'err' : ''}
                  />
                </label>
              </div>
              <label>
                <span>Téléphone</span>
                <input
                  placeholder="06 XX XX XX XX"
                  value={form.tel}
                  onChange={set('tel')}
                  className={tried && !form.tel.trim() ? 'err' : ''}
                />
              </label>
              <div className="field-row">
                <label>
                  <span>Pharmacie ou faculté</span>
                  <input
                    placeholder="Ex : Pharmacie Centrale"
                    value={form.pharma}
                    onChange={set('pharma')}
                    className={tried && !form.pharma.trim() ? 'err' : ''}
                  />
                </label>
                <label>
                  <span>Ville</span>
                  <input
                    placeholder="Votre ville"
                    value={form.ville}
                    onChange={set('ville')}
                    className={tried && !form.ville.trim() ? 'err' : ''}
                  />
                </label>
              </div>
              {tried && empty.length > 0 && (
                <p className="form-err">Merci de renseigner : {empty.join(', ')}.</p>
              )}
              {tried && n === 0 && <p className="form-err">Votre panier est vide.</p>}
            </form>
          </div>
        </div>

        <div className="cart-card">
          <div className="cart-hd">
            <h2>Votre panier</h2>
            <span className="cart-count">
              {n} atelier{n > 1 ? 's' : ''}
            </span>
          </div>

          {n === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={30} />
              <p>
                Votre panier est vide. Ajoutez des ateliers depuis le{' '}
                <Link to="/programme" className="text-link">
                  programme <ArrowRight size={13} />
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="cart-lines">
                {cart.lines.map((l) => {
                  const w = WORKSHOPS.find((x) => x.id === l.workshopId)!
                  return (
                    <div className="ci" key={l.workshopId}>
                      <div>
                        <b>
                          {w.d} {w.mois}
                        </b>
                        <span>{w.title.split(' : ')[0]}</span>
                        <button
                          className={`ci-fmt ${l.format === 'P' ? 'on' : ''}`}
                          onClick={() => cart.setFormat(l.workshopId, 'P')}
                        >
                          Présentiel
                        </button>
                        <button
                          className={`ci-fmt ${l.format === 'D' ? 'on' : ''}`}
                          onClick={() => cart.setFormat(l.workshopId, 'D')}
                        >
                          Distanciel
                        </button>
                      </div>
                      <div className="ci-right">
                        <strong>{unitPrice(cart.count, l.format)} DH</strong>
                        <button className="ci-x" onClick={() => cart.remove(l.workshopId)}>
                          <Minus size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="cart-ft">
                <div className="tier">{tierLabel(n)}</div>
                <div className="sum-row">
                  <span>Total</span>
                  <strong>{total.toLocaleString('fr-FR')} DH</strong>
                </div>
                {save > 0 && <div className="save-row">Vous économisez {save.toLocaleString('fr-FR')} DH</div>}
                <button className="button wa full" onClick={submit}>
                  <MessageCircle size={18} /> Finaliser sur WhatsApp
                </button>
                <p className="rib-note">
                  Règlement par RIB après confirmation sur WhatsApp. Place réservée dès réception du
                  justificatif.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([])
  const value: CartCtx = {
    lines,
    add: (id, format) => setLines((l) => (l.find((x) => x.workshopId === id) ? l : [...l, { workshopId: id, format }])),
    remove: (id) => setLines((l) => l.filter((x) => x.workshopId !== id)),
    setFormat: (id, format) => setLines((l) => l.map((x) => (x.workshopId === id ? { ...x, format } : x))),
    clear: () => setLines([]),
    count: lines.length,
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

function PageSection({ children, page }: { children: React.ReactNode; page: string }) {
  return (
    <div className="subpage">
      <div className="subpage-nav">
        <Link to="/" className="text-link back">
          <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} /> Accueil
        </Link>
        <span className="crumb">{page}</span>
      </div>
      {children}
    </div>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <Philosophie />
      <ModulesSection />
      <Programme />
      <Intervenants />
      <Tarifs />
      <FAQSection />
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/philosophie" element={<PageSection page="Philosophie"><Philosophie /></PageSection>} />
      <Route path="/modules" element={<PageSection page="Les modules"><ModulesSection /></PageSection>} />
      <Route path="/programme" element={<PageSection page="Programme"><Programme /></PageSection>} />
      <Route path="/intervenants" element={<PageSection page="Intervenants"><Intervenants /></PageSection>} />
      <Route path="/tarifs" element={<PageSection page="Formules et tarifs"><Tarifs /></PageSection>} />
      <Route path="/faq" element={<PageSection page="FAQ"><FAQSection /></PageSection>} />
      <Route path="/module/:id" element={<ModuleView />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart()
  const navigate = useNavigate()
  const n = cart.count
  const total = useMemo(
    () => cart.lines.reduce((s, l) => s + unitPrice(cart.count, l.format), 0),
    [cart.lines, cart.count],
  )
  const ref = useMemo(() => cart.lines.reduce((s, l) => s + unitPrice(1, l.format), 0), [cart.lines])
  const save = ref - total
  const tier = findTier(n || 1)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  const goFinalize = () => {
    onClose()
    navigate('/inscription')
  }

  return (
    <>
      <div className={`cart-overlay ${open ? 'open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`cart-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Votre panier">
        <div className="cd-head">
          <div>
            <h3>Votre panier</h3>
            {n > 0 && (
              <span className="cart-count">
                {n} atelier{n > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button className="cd-close" onClick={onClose} aria-label="Fermer le panier">
            <X size={20} />
          </button>
        </div>

        {n === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={34} />
            <p>
              Votre panier est vide. Ajoutez des ateliers depuis le{' '}
              <button className="text-link" onClick={() => { onClose(); navigate('/programme') }}>
                programme <ArrowRight size={13} />
              </button>
              .
            </p>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {cart.lines.map((l) => {
                const w = WORKSHOPS.find((x) => x.id === l.workshopId)!
                return (
                  <div className="ci" key={l.workshopId}>
                    <div>
                      <b>
                        {w.d} {w.mois}
                      </b>
                      <span>{w.title.split(' : ')[0]}</span>
                      <div className="ci-fmts">
                        <button
                          className={`ci-fmt ${l.format === 'P' ? 'on' : ''}`}
                          onClick={() => cart.setFormat(l.workshopId, 'P')}
                        >
                          Présentiel
                        </button>
                        <button
                          className={`ci-fmt ${l.format === 'D' ? 'on' : ''}`}
                          onClick={() => cart.setFormat(l.workshopId, 'D')}
                        >
                          Distanciel
                        </button>
                      </div>
                    </div>
                    <div className="ci-right">
                      <strong>{unitPrice(cart.count, l.format)} DH</strong>
                      <button className="ci-x" onClick={() => cart.remove(l.workshopId)} aria-label="Retirer du panier">
                        <Minus size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="cart-ft">
              <div className="tier">{tierLabel(n)}</div>
              <div className="sum-row">
                <span>Total</span>
                <strong>{total.toLocaleString('fr-FR')} DH</strong>
              </div>
              {save > 0 && <div className="save-row">Vous économisez {save.toLocaleString('fr-FR')} DH</div>}
              <button className="button wa full" onClick={goFinalize}>
                <MessageCircle size={18} /> Finaliser sur WhatsApp
              </button>
              <button className="cd-secondary" onClick={goFinalize}>
                Renseigner mes coordonnées <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function AppShell() {
  const cart = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  return (
    <div className="site-shell">
      <Cursor />
      <ScrollToTop />
      <TopMarquee />
      <Header onCartOpen={() => setCartOpen(true)} />
      <main>
        <AppRoutes />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppShell />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
