import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter, Link } from 'wouter';
import { ArrowDown, ArrowRight, ArrowUpRight, Building2, Check, Globe, Instagram, Linkedin, Mail, MapPin, Menu, MoveUpRight, Phone, ScanLine, X } from 'lucide-react';

const queryClient = new QueryClient();

const services = [
  { number: '01', title: '3D printing', detail: 'Additive manufacturing for functional parts, design iterations and low-volume needs.', href: '/services/3d-printing', icon: '01' },
  { number: '02', title: 'CAD & product design', detail: 'From a rough concept or existing part to a considered, manufacturable digital model.', href: '/services/cad-design', icon: '02' },
  { number: '03', title: '3D scanning & reverse engineering', detail: 'Capture physical geometry and use it as a foundation for digital work.', href: '/services/3d-scanning-reverse-engineering', icon: '03' },
  { number: '04', title: 'Product prototyping', detail: 'Explore form, fit and function through practical development iterations.', href: '/services/product-prototyping', icon: '04' },
];

const pageDetails: Record<string, { title: string; eyebrow: string; intro: string; description: string; sections: { label: string; title: string; body: string; bullets: string[] }[] }> = {
  '/about': {
    title: 'Engineering ideas into something tangible.',
    eyebrow: 'About AMX VERSE',
    intro: 'AMX VERSE PRIVATE LIMITED works at the point where digital design meets the physical world.',
    description: 'We bring additive manufacturing, design and engineering thinking together to help teams investigate, refine and realise product ideas.',
    sections: [
      { label: '01 / Our approach', title: 'Start with the problem, not the process.', body: 'Every brief begins with context: what needs to work, what is known, and what still needs to be learned. That shapes the right path through design, scanning, prototyping or manufacture.', bullets: ['Understand the intended use', 'Choose a fitting route to explore', 'Keep decisions and trade-offs visible'] },
      { label: '02 / Who we work with', title: 'Built around real-world development.', body: 'Our capabilities are relevant to industrial and MSME buyers, product teams, educational institutions, and R&D collaborators.', bullets: ['Industrial and MSME requirements', 'Product development teams', 'Education and technical learning', 'Research and development collaboration'] },
      { label: '03 / What matters', title: 'Technical clarity over theatre.', body: 'We favour considered communication, practical exploration and clear boundaries. Scope, material choices and technical assumptions should be discussed before a project proceeds.', bullets: ['Specific conversations', 'Purposeful iteration', 'Honest scope and limitations'] },
      { label: '04 / Operational base', title: 'Based in Bhubaneswar, Odisha.', body: 'Our facility is situated at Unit-35, Badagarh, Elegance society on the Cuttack - Puri Bypass corridor, providing hands-on engineering, prototyping, scanning and additive manufacturing support.', bullets: ['Unit- 35, Badagarh, Elegance society, Plot No-9429, Bhubaneswar', 'Direct phone: 070081 56007', 'Official email: amx-verse@amxverse.in'] },
    ],
  },
  '/services/3d-printing': {
    title: 'Additive manufacturing, applied with purpose.',
    eyebrow: 'Capability / 01',
    intro: '3D printing for teams who need to explore a design, evaluate a part or consider a low-volume manufacturing route.',
    description: 'The process and material should follow the intended part and its use. We discuss the brief before recommending a suitable approach.',
    sections: [
      { label: '01 / Where it fits', title: 'A useful route from digital file to physical part.', body: 'Additive manufacturing can support product development, functional exploration and selected low-volume requirements. It is one tool in a wider engineering process.', bullets: ['Design and form studies', 'Functional prototypes', 'Part iteration and evaluation', 'Selected low-volume applications'] },
      { label: '02 / Start with the brief', title: 'The details change the process.', body: 'A useful recommendation depends on geometry, intended use, environment, quantity and the level of finish required. These details are reviewed before the route is agreed.', bullets: ['What does the part need to do?', 'What environment will it see?', 'How many parts and what finish?', 'Are there existing CAD files or references?'] },
      { label: '03 / A considered process', title: 'Review, prepare, produce.', body: 'We align on inputs and expectations, review the digital model for the intended process, then discuss next steps and any required iteration.', bullets: ['Brief and file review', 'Process and material discussion', 'Preparation and manufacturing', 'Review of the resulting part'] },
    ],
  },
  '/services/cad-design': {
    title: 'CAD design made useful to the next step.',
    eyebrow: 'Capability / 02',
    intro: 'Product and CAD design support for teams moving from a concept, sketch or physical reference toward a digital model.',
    description: 'Design work is shaped around its purpose: clear visual communication, a prototype, an engineering discussion or a considered manufacturing route.',
    sections: [
      { label: '01 / Inputs', title: 'Start wherever the idea is.', body: 'A first conversation can begin with a sketch, a physical object, a set of requirements, or an existing model that needs refinement.', bullets: ['Concepts and hand sketches', 'Physical reference parts', 'Existing CAD requiring updates', 'Functional and contextual requirements'] },
      { label: '02 / Design intent', title: 'A model should answer a question.', body: 'The intended output and downstream use inform how the design is developed and communicated. Assumptions are made visible for review.', bullets: ['Shape and proportion exploration', 'Part and assembly development', 'Preparation for prototyping', 'Iterative design review'] },
      { label: '03 / Next steps', title: 'Keep the path connected.', body: 'Where appropriate, CAD work can inform prototype iterations, additive manufacturing or scanning and reverse engineering.', bullets: ['Review scope and deliverables', 'Confirm reference information', 'Develop and review the model', 'Discuss prototype or manufacturing options'] },
    ],
  },
  '/services/3d-scanning-reverse-engineering': {
    title: 'Bring physical geometry into the digital conversation.',
    eyebrow: 'Capability / 03',
    intro: '3D scanning and reverse-engineering support when an existing physical form is an important design reference.',
    description: 'Captured geometry can support inspection, modelling and design exploration. The appropriate method and output depend on the part and the question being asked.',
    sections: [
      { label: '01 / Capture', title: 'A digital reference for what exists.', body: 'Scanning can help document the form of an existing object as a starting point for further engineering work.', bullets: ['Physical components and assemblies', 'Legacy or reference geometry', 'Design comparisons and documentation', 'Inputs to model reconstruction'] },
      { label: '02 / Interpret', title: 'Capture is not the whole answer.', body: 'A scan is a representation of geometry, not automatically a finished CAD model or a validated inspection result. The intended use shapes what follows.', bullets: ['Clarify the question first', 'Review access and surface conditions', 'Agree the useful digital output', 'Set expectations for interpretation'] },
      { label: '03 / Apply', title: 'From reference to next decision.', body: 'Depending on scope, scanned data can inform reverse engineering, redesign, prototyping or further technical evaluation.', bullets: ['Scan data as a reference', 'Model reconstruction discussion', 'Comparison to a design reference', 'Downstream prototype planning'] },
    ],
  },
  '/services/product-prototyping': {
    title: 'Make the next iteration easier to evaluate.',
    eyebrow: 'Capability / 04',
    intro: 'Product prototyping brings design decisions into a form teams can inspect, discuss and refine.',
    description: 'A prototype has value when its purpose is clear. We help connect the question, the model and the physical iteration.',
    sections: [
      { label: '01 / The question', title: 'Decide what the prototype needs to teach.', body: 'A prototype may help communicate an idea, review proportions, check fit or explore a functional detail. These are different jobs and may call for different approaches.', bullets: ['Form and proportion', 'Fit and assembly exploration', 'Functional evaluation', 'Stakeholder communication'] },
      { label: '02 / Iteration', title: 'Progress through tangible reviews.', body: 'Reviewing a physical iteration can reveal questions that are difficult to resolve on screen. The next revision can then be based on what the team learns.', bullets: ['Establish a baseline concept', 'Create a reviewable iteration', 'Collect specific observations', 'Update the design direction'] },
      { label: '03 / Connect capabilities', title: 'One development path, several tools.', body: 'Prototyping can draw on CAD design, scanning and additive manufacturing depending on the project brief.', bullets: ['CAD and design development', '3D-printed iterations', 'Scanning existing references', 'Clear handoff to the next step'] },
    ],
  },
  '/innovation': {
    title: 'Exploring what manufacturing can make possible.',
    eyebrow: 'Innovation',
    intro: 'A space for investigating materials, product concepts and practical applications of additive manufacturing.',
    description: 'Innovation at AMX VERSE is an ongoing process of enquiry. Ideas are explored with care, and development status is stated plainly.',
    sections: [
      { label: '01 / Areas of enquiry', title: 'Curiosity with an engineering frame.', body: 'We are interested in useful applications and new ways to think about material, design and manufacture.', bullets: ['Material-led product concepts', 'Additive manufacturing applications', 'Design for practical use', 'Research and development collaboration'] },
      { label: '02 / In development', title: 'EcoFil', body: 'EcoFil is an AMX VERSE initiative under development. Its concept explores material reuse and additive manufacturing. It is not presented as a validated product or available service.', bullets: ['Concept and direction are being developed', 'No performance claims are made', 'Availability and specifications are not confirmed'] },
      { label: '03 / Collaboration', title: 'Bring a question worth exploring.', body: 'We welcome thoughtful conversations with product teams, educational institutions and R&D collaborators where the scope and goals can be clearly discussed.', bullets: ['Share the context', 'Define the question', 'Discuss a suitable scope', 'Set out what is known and unknown'] },
    ],
  },
  '/innovation/ecofil': {
    title: 'EcoFil is under development.',
    eyebrow: 'Innovation / EcoFil',
    intro: 'An AMX VERSE initiative exploring material reuse and additive manufacturing.',
    description: 'EcoFil is at an early development stage. There are no confirmed specifications, performance results, commercial availability or validated environmental claims to share at this time.',
    sections: [
      { label: '01 / Current status', title: 'An exploration, not a released product.', body: 'The initiative is being developed. Public details will be updated only when there is verified information to communicate.', bullets: ['Status: under development', 'Specifications: not confirmed', 'Availability: not announced'] },
      { label: '02 / Scope', title: 'A question of material and application.', body: 'The work sits within broader enquiry into material use and additive manufacturing. Any eventual application would require appropriate technical evaluation.', bullets: ['Material exploration', 'Process considerations', 'Application-led evaluation'] },
      { label: '03 / Enquiries', title: 'Start a conversation about the idea.', body: 'For R&D, education or collaboration enquiries, please use the contact form. No partnership or collaboration is implied by this invitation.', bullets: ['Describe your interest', 'Include the context', 'Avoid sharing confidential information in this form'] },
    ],
  },
  '/training': {
    title: 'Build practical understanding of additive manufacturing.',
    eyebrow: 'Technical training',
    intro: 'Technical training and learning conversations for educational institutions, teams and people developing their understanding of 3D printing.',
    description: 'Training is shaped to the audience and the learning objective. Specific formats, schedules and availability should be discussed before they are confirmed.',
    sections: [
      { label: '01 / Learning areas', title: 'Understand the process behind the part.', body: 'Learning can cover the fundamentals of additive manufacturing and the decisions involved in taking a digital model toward a physical output.', bullets: ['Additive manufacturing fundamentals', 'Design considerations for 3D printing', 'Materials and process discussion', 'Prototype-led learning'] },
      { label: '02 / Who it is for', title: 'Designed around the room.', body: 'The audience and its prior experience shape the level, examples and structure of a learning session.', bullets: ['Educational institutions', 'Product and engineering teams', 'MSME and industrial audiences', 'R&D groups and collaborators'] },
      { label: '03 / Plan a session', title: 'Begin with your learning goal.', body: 'Tell us who the session is for and what participants should understand or be able to discuss afterwards.', bullets: ['Audience and experience', 'Topics of interest', 'Preferred format and timing', 'Any specific context to consider'] },
    ],
  },
  '/projects': {
    title: 'Work in progress deserves an honest record.',
    eyebrow: 'Projects',
    intro: 'We are preparing this section for project stories that can be shared with permission and verified context.',
    description: 'No client examples, project outcomes or case studies are published here at this stage. We will not present illustrative work as customer proof.',
    sections: [
      { label: '01 / What belongs here', title: 'Context, contribution and clarity.', body: 'A useful project story explains the challenge, the work completed and what can fairly be learned from it.', bullets: ['A clear project brief', 'The role and contribution described accurately', 'Permission for any shared material', 'Limitations and context where relevant'] },
      { label: '02 / In the meantime', title: 'Talk through your own brief.', body: 'If you are evaluating additive manufacturing, design, scanning or prototyping, we can discuss your requirements directly.', bullets: ['Describe the part or concept', 'Share the intended use', 'Outline the constraints', 'Explore a practical next step'] },
      { label: '03 / No borrowed proof', title: 'Specificity without invented credentials.', body: 'Until approved project materials are available, this page stays intentionally factual rather than implying client relationships or results.', bullets: ['No fabricated client names', 'No invented performance data', 'No unverified claims'] },
    ],
  },
};

const titles: Record<string, [string, string]> = {
  '/': ['AMX VERSE | Additive Manufacturing & Product Engineering', 'AMX VERSE PRIVATE LIMITED brings additive manufacturing, CAD design, 3D scanning and prototyping together for product teams and industry.'],
  '/about': ['About AMX VERSE | Engineering & Additive Manufacturing', 'Meet AMX VERSE PRIVATE LIMITED: a practical engineering partner for additive manufacturing, design and physical product development.'],
  '/services': ['Capabilities | AMX VERSE Additive Manufacturing', 'Explore AMX VERSE capabilities in 3D printing, CAD design, 3D scanning, reverse engineering and product prototyping.'],
  '/services/3d-printing': ['3D Printing | AMX VERSE Additive Manufacturing', 'Additive manufacturing for functional parts, product development and selected low-volume applications. Start with a clear project brief.'],
  '/services/cad-design': ['CAD & Product Design | AMX VERSE', 'CAD and product design support for concepts, physical references and iterative product development.'],
  '/services/3d-scanning-reverse-engineering': ['3D Scanning & Reverse Engineering | AMX VERSE', 'Bring physical geometry into the digital workflow with 3D scanning and reverse-engineering support.'],
  '/services/product-prototyping': ['Product Prototyping | AMX VERSE', 'Explore product ideas through purposeful prototypes, design iteration and additive manufacturing.'],
  '/innovation': ['Innovation | AMX VERSE', 'Explore AMX VERSE research and innovation interests in additive manufacturing, material and product development.'],
  '/innovation/ecofil': ['EcoFil — Under Development | AMX VERSE', 'EcoFil is an AMX VERSE initiative under development exploring material reuse and additive manufacturing.'],
  '/training': ['Technical Training | AMX VERSE', 'Technical learning in additive manufacturing and 3D printing for institutions, teams and product development audiences.'],
  '/projects': ['Projects | AMX VERSE', 'A transparent look at AMX VERSE work. Project stories will be published only with permission and verified context.'],
  '/contact': ['Contact AMX VERSE | Discuss an Engineering Brief', 'Start a conversation about additive manufacturing, product design, 3D scanning, prototyping or technical training.'],
  '/privacy': ['Privacy Notice | AMX VERSE', 'Review the draft privacy notice for the AMX VERSE website. Corporate and contact details require verification before publication.'],
  '/terms': ['Website Terms | AMX VERSE', 'Review draft website terms for AMX VERSE. These terms are not legal advice and require review before public launch.'],
};

function CompanyLogo({ inverse = false, size = 'default' }: { inverse?: boolean; size?: 'default' | 'large' }) {
  return (
    <Link
      href="/"
      className={`brand-logo ${inverse ? 'brand-logo-inverse' : ''} ${size === 'large' ? 'brand-logo-large' : ''}`}
      aria-label="AMX VERSE home"
      data-testid="link-wordmark"
    >
      <img
        src="/logo.png"
        alt="AMX VERSE"
        className="brand-logo-emblem"
      />
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [path] = useLocation();
  useEffect(() => setOpen(false), [path]);
  const nav = [
    { label: 'Company', href: '/about' }, { label: 'Capabilities', href: '/services' },
    { label: 'Innovation', href: '/innovation' }, { label: 'Training', href: '/training' }, { label: 'Projects', href: '/projects' },
  ];
  return <header className="site-header">
    <div className="header-inner">
      <CompanyLogo />
      <nav className="desktop-nav" aria-label="Main navigation">
        {nav.map(item => <Link key={item.href} href={item.href} className="nav-link" aria-current={path === item.href || path.startsWith(item.href + '/') ? 'page' : undefined} data-testid={`nav-${item.label.toLowerCase()}`}>{item.label}</Link>)}
      </nav>
      <Link className="header-cta btn-link" href="/contact" data-testid="nav-contact">Start a conversation <ArrowUpRight size={15} /></Link>
      <button className="menu-toggle" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} onClick={() => setOpen(!open)} data-testid="button-mobile-menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
    </div>
    {open && <nav className="mobile-nav" aria-label="Mobile navigation">
      {nav.map(item => <Link key={item.href} href={item.href} data-testid={`mobile-${item.label.toLowerCase()}`}>{item.label}<ArrowUpRight size={16} /></Link>)}
      <Link href="/contact" className="mobile-contact" data-testid="mobile-contact">Start a conversation <ArrowUpRight size={16} /></Link>
    </nav>}
  </header>;
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand">
        <CompanyLogo size="large" inverse />
        <p>Engineering ideas into something tangible.</p>
        <span className="eyebrow">Additive manufacturing · Design · Prototyping</span>
        <div className="footer-company-meta">
          <span>AMX VERSE PRIVATE LIMITED</span>
          <span>
            CIN: U46909OD2025PTC048861 ·{' '}
            <a
              href="https://www.zaubacorp.com/AMX-VERSE-PRIVATE-LIMITED-U46909OD2025PTC048861"
              target="_blank"
              rel="noopener noreferrer"
              className="zauba-link"
            >
              Verify on Zauba Corp <ArrowUpRight size={10} />
            </a>
          </span>
        </div>
        <div className="footer-socials">
          <a
            href="https://www.linkedin.com/company/amxverse/?originalSubdomain=in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AMX VERSE on LinkedIn"
            className="social-btn"
          >
            <Linkedin size={14} />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://www.instagram.com/amx_verse/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AMX VERSE on Instagram"
            className="social-btn"
          >
            <Instagram size={14} />
            <span>Instagram</span>
          </a>
          <a
            href="https://www.justdial.com/Bhubaneshwar/Amx-Verse-Near-Sr-Valley-Roadbhubaneswar-Badagada-Village/0674PX674-X674-251207081907-F6H1_BZDET"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AMX VERSE on JustDial"
            className="social-btn"
          >
            <Building2 size={14} />
            <span>JustDial</span>
          </a>
        </div>
      </div>
      <div className="footer-column">
        <span className="eyebrow">Explore</span>
        <Link href="/about">About</Link>
        <Link href="/services">Capabilities</Link>
        <Link href="/innovation">Innovation</Link>
        <Link href="/training">Training</Link>
        <Link href="/projects">Projects</Link>
      </div>
      <div className="footer-column">
        <span className="eyebrow">Capabilities</span>
        {services.map(s => <Link key={s.href} href={s.href}>{s.title}</Link>)}
      </div>
      <div className="footer-column footer-contact">
        <span className="eyebrow">Get in touch</span>
        <p className="footer-phone"><a href="tel:07008156007">070081 56007</a></p>
        <p className="footer-email"><a href="mailto:amx-verse@amxverse.in">amx-verse@amxverse.in</a></p>
        <p className="footer-location">
          Unit- 35, Badagarh, Elegance society,<br />
          Plot No. 9429, Cuttack - Puri Bypass Rd,<br />
          Bhubaneswar, Odisha 751002
        </p>
        <a className="footer-map-link" href="https://maps.app.goo.gl/cTn8Jyoak3to5aMQ8" target="_blank" rel="noopener noreferrer">
          Google Maps Location <ArrowUpRight size={13} />
        </a>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} AMX VERSE PRIVATE LIMITED · All rights reserved</span>
      <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
    </div>
  </footer>;
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="site-grain"><a className="skip-link" href="#main">Skip to content</a><Header />{children}<Footer /></div>;
}

function ArrowLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return <Link href={href} className={`arrow-link ${light ? 'arrow-link-light' : ''}`} data-testid={`link-${href.replaceAll('/', '-').replace(/^-/, '')}`}><span>{children}</span><ArrowRight size={16} /></Link>;
}

function SectionIntro({ eyebrow, title, body, light = false }: { eyebrow: string; title: ReactNode; body?: string; light?: boolean }) {
  return <div className={`section-intro ${light ? 'section-intro-light' : ''}`}><span className="eyebrow">{eyebrow}</span><h2 className="display">{title}</h2>{body && <p>{body}</p>}</div>;
}

function TechnicalOrb() {
  return <div className="technical-visual" aria-label="Abstract technical drawing of a layered additive manufactured form" role="img">
    <div className="visual-index mono">FIG. 01 <span>AM / FORM STUDY</span></div>
    <div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit orbit-c" />
    <svg className="part-drawing" viewBox="0 0 460 440" fill="none" aria-hidden="true">
      <path d="M230 44 353 112v147l-123 71-123-71V112L230 44Z" stroke="rgba(203,181,130,.9)" strokeWidth="1.2"/>
      <path d="m107 112 123 70 123-70M230 182v148m-123-71 123-72 123 72M148 90l123 69v90l-41 25-82-48V136l41-23m123-1-41 23v95" stroke="rgba(244,239,227,.55)" strokeWidth="1"/>
      <path d="M188 145v-34l41-24 41 24v45m-41 24 41-24m-82-21 41 21m-41 21 41 24m0 0 41-24m-41 24v50m0-50-41-24" stroke="rgba(203,181,130,.7)" strokeWidth="1.2"/>
      <path d="m189 210 41 24 41-24m-82 48 41 24 41-24m-41-24v48m-41-72v48m82-48v48" stroke="rgba(244,239,227,.36)" strokeWidth="1"/>
      <circle cx="230" cy="182" r="4" fill="#cbb582"/><circle cx="230" cy="330" r="4" fill="#cbb582"/>
      <path d="M69 347h85m152-236h75M61 112h35m269 147h34" stroke="rgba(203,181,130,.45)" strokeWidth="1"/>
    </svg>
    <div className="visual-caption"><span>DESIGN / MATERIAL / PROCESS</span><span>01—04</span></div>
    <div className="visual-coordinate mono">X 042.18<br />Y 018.62</div>
  </div>;
}

function ServiceCards({ compact = false }: { compact?: boolean }) {
  return <div className={`service-grid ${compact ? 'service-grid-compact' : ''}`}>
    {services.map(service => <Link href={service.href} key={service.href} className="service-card" data-testid={`card-service-${service.number}`}>
      <div className="service-card-top"><span className="eyebrow">CAPABILITY / {service.number}</span><MoveUpRight size={18} /></div>
      <div className="service-number">{service.number}</div><h3>{service.title}</h3><p>{service.detail}</p>
      <span className="service-discover">Explore capability <ArrowRight size={14} /></span>
    </Link>)}
  </div>;
}

function HomePage() {
  return <main id="main">
    <section className="hero">
      <video
        className="hero-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="hero-video-overlay" />
      <div className="hero-grid grid-overlay" />
      <div className="hero-inner">
        <div className="hero-copy enter">
          <span className="hero-eyebrow eyebrow"><span className="gold-mark" /> AMX VERSE PRIVATE LIMITED <span className="hero-eyebrow-line" /></span>
          <h1 className="display">From digital<br />thinking to <em>real</em><br />world making.</h1>
          <p className="hero-intro">Additive manufacturing, product design and engineering support for ideas ready to take shape.</p>
          <div className="hero-actions"><Link href="/services" className="button-primary btn-link" data-testid="button-explore-capabilities">Explore capabilities <ArrowRight size={16} /></Link><Link href="/contact" className="button-quiet btn-link" data-testid="button-discuss-brief">Discuss a brief <ArrowUpRight size={15} /></Link></div>
          <div className="hero-detail"><span className="hero-detail-line" />A practical partner for product development, industry and learning.</div>
        </div>
        <TechnicalOrb />
        <div className="hero-edge mono"><span>AMX / 001</span><span>MAKE IT CONSIDERED.</span></div>
      </div>
      <a className="scroll-cue" href="#capabilities"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
    </section>
    <section className="home-intro page-pad" id="capabilities">
      <div className="intro-aside eyebrow">01 / WHAT WE DO</div>
      <div className="intro-copy"><h2 className="display">Good engineering starts with a better question.</h2><p>We help teams move between a physical reference and a digital model, between a product idea and a part worth evaluating. The right process depends on what you need to learn or make.</p><ArrowLink href="/about">Get to know AMX VERSE</ArrowLink></div>
      <div className="intro-stamp"><ScanLine size={23} strokeWidth={1.3} /><span className="eyebrow">DESIGN<br />TO PART</span><span className="stamp-circle" /></div>
    </section>
    <section className="capabilities-section page-pad">
      <div className="capabilities-heading"><SectionIntro eyebrow="02 / CAPABILITIES" title={<>The tools to move<br />an idea forward.</>} body="A connected set of capabilities for product development, manufacturing exploration and technical learning." /><ArrowLink href="/services">View all capabilities</ArrowLink></div>
      <ServiceCards />
    </section>
    <section className="process-band">
      <div className="process-inner page-pad">
        <div className="process-lede"><span className="eyebrow">03 / HOW WE WORK</span><h2 className="display">Practical at<br />every stage.</h2><p>Clear thinking, a considered process and the right next step for the brief.</p></div>
        <div className="process-steps">
          {[['01', 'Understand', 'Start with intended use, context and constraints.'], ['02', 'Explore', 'Choose a process that helps answer the right question.'], ['03', 'Refine', 'Use what the work reveals to shape what happens next.']].map(step => <article className="process-step" key={step[0]}><span className="eyebrow">{step[0]} <i /></span><h3>{step[1]}</h3><p>{step[2]}</p></article>)}
        </div>
      </div>
    </section>
    <section className="audience-section page-pad">
      <div className="audience-heading"><SectionIntro eyebrow="04 / WHO WE SUPPORT" title={<>Different briefs.<br />Shared curiosity.</>} body="Working with people who build, teach, test and improve." /></div>
      <div className="audience-list">{[['Industry & MSMEs', 'Explore additive manufacturing and practical product development support.'], ['Product teams', 'Develop concepts through CAD, scanning and tangible iterations.'], ['Education', 'Build understanding through technical learning and applied exploration.'], ['R&D collaborators', 'Discuss a clear question, scope and development direction.']].map((item, i) => <article className="audience-row" key={item[0]}><span className="eyebrow">0{i + 1}</span><h3>{item[0]}</h3><p>{item[1]}</p><ArrowUpRight size={16} /></article>)}</div>
    </section>
    <section className="innovation-feature">
      <div className="innovation-grid" />
      <div className="innovation-feature-inner page-pad"><div><span className="eyebrow"><span className="gold-mark" /> AN INITIATIVE IN DEVELOPMENT</span><h2 className="display">Material thinking.<br /><em>In progress.</em></h2><p>EcoFil is an AMX VERSE initiative exploring material reuse and additive manufacturing. It is under development; specifications and availability are not confirmed.</p><ArrowLink href="/innovation/ecofil" light>Explore EcoFil</ArrowLink></div><div className="innovation-emblem"><span className="emblem-ring emblem-ring-1" /><span className="emblem-ring emblem-ring-2" /><span className="emblem-ring emblem-ring-3" /><span className="emblem-center">E<span>F</span></span><span className="emblem-note mono">MATERIAL STUDY<br />IN DEVELOPMENT</span></div></div>
    </section>
    <section className="training-strip page-pad"><div><span className="eyebrow">05 / TECHNICAL TRAINING</span><h2 className="display">Understand the process.<br />Make informed decisions.</h2></div><div><p>Practical technical learning for institutions, teams and people exploring additive manufacturing.</p><ArrowLink href="/training">Explore training</ArrowLink></div></section>
    <section className="closing-cta"><span className="eyebrow">HAVE A QUESTION TO WORK THROUGH?</span><h2 className="display">Let's start with<br />the brief.</h2><Link className="button-primary btn-link" href="/contact" data-testid="button-contact-cta">Talk to AMX VERSE <ArrowUpRight size={16} /></Link><span className="closing-index mono">AMX / END OF INTRODUCTION</span></section>
  </main>;
}

function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        <div className="page-hero-copy enter">
          <div className="breadcrumb eyebrow">
            <Link href="/">AMX VERSE</Link>
            <span>/</span>
            {eyebrow}
          </div>
          <h1 className="display">{title}</h1>
          <p>{intro}</p>
        </div>
        <div className="page-hero-mark">
          <div className="page-hero-halo" />
          <img
            src="/logo.png"
            alt="AMX VERSE Emblem"
            className="page-hero-emblem"
          />
        </div>
      </div>
    </section>
  );
}

function DetailPage({ path }: { path: string }) {
  const page = pageDetails[path];
  return <main id="main"><PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
    <section className="detail-lead page-pad"><span className="eyebrow">THE PERSPECTIVE</span><p className="display">{page.description}</p></section>
    {page.sections.map((section, i) => <section key={section.label} className={`detail-section page-pad ${i % 2 ? 'detail-section-alt' : ''}`}><div className="detail-label eyebrow">{section.label}</div><div className="detail-content"><h2 className="display">{section.title}</h2><p>{section.body}</p><ul>{section.bullets.map(b => <li key={b}><span className="list-mark" />{b}</li>)}</ul></div><span className="detail-index mono">0{i + 1} / 0{page.sections.length}</span></section>)}
    {path === '/about' && (
      <section className="founder-section page-pad">
        <div className="founder-header">
          <span className="eyebrow">EXECUTIVE LEADERSHIP</span>
          <h2 className="display">Founded with engineering curiosity.</h2>
        </div>
        <div className="founder-card">
          <div className="founder-photo-wrap">
            <img
              src="/founder.png"
              alt="Acharya Swayam Sambit, Founder & CEO of AMX VERSE"
              className="founder-photo"
            />
            <div className="founder-badge mono">
              <span>FOUNDER &amp; CEO</span>
              <span>AMX VERSE</span>
            </div>
          </div>
          <div className="founder-content">
            <span className="eyebrow">FOUNDER &amp; CHIEF EXECUTIVE OFFICER</span>
            <h3 className="display">Acharya Swayam Sambit</h3>
            <p className="founder-lead">
              Leading the vision, additive engineering processes, and R&amp;D directions at AMX VERSE PRIVATE LIMITED.
            </p>
            <p>
              With a focus on bridging the gap between digital CAD concepts and functional physical parts, Sambit oversees AMX VERSE&apos;s manufacturing workflows, prototyping delivery, technical training programs, and the EcoFil material-sustainability initiative.
            </p>
            <div className="founder-actions">
              <a
                href="https://www.linkedin.com/in/acharya-swayam-sambit-44a7251a3/"
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary btn-link founder-cta"
              >
                <Linkedin size={16} />
                <span>Connect on LinkedIn</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    )}
    {path === '/innovation' && <section className="related-feature page-pad"><div><span className="eyebrow">INITIATIVE / UNDER DEVELOPMENT</span><h2 className="display">Meet EcoFil.</h2><p>A material and additive manufacturing exploration. No confirmed product specifications or availability.</p></div><ArrowLink href="/innovation/ecofil">EcoFil development note</ArrowLink></section>}
    {path === '/projects' && <section className="projects-placeholder page-pad"><div className="placeholder-frame"><span className="eyebrow">PROJECT ARCHIVE</span><span className="placeholder-grid" /><span className="placeholder-text display">No published<br />case studies yet.</span><span className="mono placeholder-foot">A truthful record is better than an invented one.</span></div></section>}
    <section className="detail-cta page-pad"><div><span className="eyebrow">NEXT / START A CONVERSATION</span><h2 className="display">Have a specific<br />question in mind?</h2></div><ArrowLink href="/contact">Tell us about your brief</ArrowLink></section>
  </main>;
}

function ServicesPage() {
  return <main id="main"><PageHero eyebrow="Capabilities" title="Connected capabilities. Clear next steps." intro="Explore design, scanning, additive manufacturing and prototyping support for product development and practical engineering." />
    <section className="service-overview page-pad"><div className="overview-lead"><span className="eyebrow">A CONNECTED WORKFLOW</span><p className="display">The process follows the problem. Not the other way around.</p><p>Capabilities can be considered individually or as part of a wider development conversation. Scope and technical requirements are agreed for each brief.</p></div><div className="overview-graphic"><div className="workflow-node node-a">01<br /><span>DESIGN</span></div><div className="workflow-node node-b">02<br /><span>CAPTURE</span></div><div className="workflow-node node-c">03<br /><span>MAKE</span></div><div className="workflow-node node-d">04<br /><span>REFINE</span></div><div className="workflow-lines" /></div></section>
    <section className="overview-capabilities page-pad"><SectionIntro eyebrow="THE CAPABILITIES" title="Choose a starting point." body="Each capability page explains where the work may fit and what to consider before beginning." /><ServiceCards /></section>
    <section className="capability-note page-pad"><span className="eyebrow">GOOD TO KNOW</span><p>Requirements vary by geometry, material, use and delivery context. We confirm scope and technical assumptions before work proceeds; no universal tolerances or outcomes are implied here.</p><ArrowLink href="/contact">Discuss your requirements</ArrowLink></section>
  </main>;
}

function ContactPage() {
  const [status, setStatus] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const name = String(values.get('name') || '');
    const email = String(values.get('email') || '');
    const phone = String(values.get('phone') || '');
    const subject = String(values.get('subject') || 'Project enquiry');
    const message = String(values.get('message') || '');
    const verifiedRecipient = 'amx-verse@amxverse.in';

    const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nArea of Interest: ${subject}\n\nProject Brief:\n${message}`;
    window.location.href = `mailto:${verifiedRecipient}?subject=${encodeURIComponent(`[RFQ Enquiry] ${subject} - ${name}`)}&body=${encodeURIComponent(body)}`;
    setStatus(`Your email client has opened with a prepared enquiry draft addressed to ${verifiedRecipient}. You may review and attach CAD/drawings before sending.`);
  };
  return <main id="main">
    <section className="contact-content page-pad">
      <div className="contact-aside">
        <span className="eyebrow">A GOOD BRIEF STARTS WITH</span>
        <h2 className="display">A little context<br />goes a long way.</h2>
        <p>What are you trying to make, understand or improve? Share the intended use and where you are in the process.</p>
        <div className="contact-points">
          {['The product, part or idea', 'What you need it to do', 'Current files or references', 'Constraints or timing to discuss'].map((t, i) => (
            <div key={t}><span className="eyebrow">0{i + 1}</span>{t}</div>
          ))}
        </div>

        <div className="contact-details-box">
          <span className="eyebrow">OFFICE & DIRECT CONTACT</span>
          <div className="contact-detail-row">
            <MapPin size={17} />
            <div>
              <strong>Operating Facility</strong>
              <p>Unit- 35, Badagarh, Elegance society, Plot No-9429, Cuttack - Puri Bypass Rd, near SR Valley Road, Mandap, Bhubaneswar, Odisha 751002</p>
              <a href="https://maps.app.goo.gl/cTn8Jyoak3to5aMQ8" target="_blank" rel="noopener noreferrer" className="map-link">
                View on Google Maps <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
          <div className="contact-detail-row">
            <Phone size={17} />
            <div>
              <strong>Direct Telephone</strong>
              <p><a href="tel:07008156007">070081 56007</a></p>
            </div>
          </div>
          <div className="contact-detail-row">
            <Mail size={17} />
            <div>
              <strong>Direct Mail</strong>
              <p><a href="mailto:amx-verse@amxverse.in">amx-verse@amxverse.in</a></p>
            </div>
          </div>
          <div className="contact-detail-row">
            <Globe size={17} />
            <div>
              <strong>Verified Presence &amp; Social</strong>
              <div className="contact-social-links">
                <a
                  href="https://www.linkedin.com/company/amxverse/?originalSubdomain=in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                >
                  <Linkedin size={13} />
                  <span>LinkedIn</span>
                  <ArrowUpRight size={11} />
                </a>
                <a
                  href="https://www.instagram.com/amx_verse/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                >
                  <Instagram size={13} />
                  <span>Instagram</span>
                  <ArrowUpRight size={11} />
                </a>
                <a
                  href="https://www.zaubacorp.com/AMX-VERSE-PRIVATE-LIMITED-U46909OD2025PTC048861"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                >
                  <Building2 size={13} />
                  <span>Zauba Corp (MCA)</span>
                  <ArrowUpRight size={11} />
                </a>
                <a
                  href="https://www.justdial.com/Bhubaneshwar/Amx-Verse-Near-Sr-Valley-Roadbhubaneswar-Badagada-Village/0674PX674-X674-251207081907-F6H1_BZDET"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-pill"
                >
                  <Building2 size={13} />
                  <span>JustDial</span>
                  <ArrowUpRight size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form className="contact-form" onSubmit={submit} noValidate={false} data-testid="form-contact">
        <div className="form-heading">
          <span className="eyebrow">PROJECT ENQUIRY / RFQ</span>
          <span className="form-required">* REQUIRED</span>
        </div>
        <label htmlFor="name">Your name <span>*</span>
          <input id="name" name="name" type="text" autoComplete="name" required minLength={2} placeholder="Full name" data-testid="input-name" />
        </label>
        <label htmlFor="email">Email address <span>*</span>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" data-testid="input-email" />
        </label>
        <label htmlFor="phone">Phone number
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 00000 00000" data-testid="input-phone" />
        </label>
        <label htmlFor="subject">What would you like to discuss? <span>*</span>
          <select id="subject" name="subject" required defaultValue="" data-testid="select-subject">
            <option value="" disabled>Select an area</option>
            <option>3D printing / additive manufacturing</option>
            <option>CAD or product design</option>
            <option>3D scanning / reverse engineering</option>
            <option>Product prototyping</option>
            <option>Innovation / EcoFil</option>
            <option>Technical training</option>
            <option>Other enquiry</option>
          </select>
        </label>
        <label htmlFor="message">A little about your brief <span>*</span>
          <textarea id="message" name="message" required minLength={15} rows={5} placeholder="Describe the part or idea, intended use, materials or constraints, and what you'd like to achieve." data-testid="input-message" />
        </label>
        <p className="form-privacy">
          Submitting this brief generates a pre-addressed email draft to <strong>amx-verse@amxverse.in</strong> where you can attach CAD files (STEP, STL, drawings) safely.
        </p>
        <button className="button-primary form-submit btn-link" type="submit" data-testid="button-submit-contact">
          Submit project brief <ArrowRight size={16} />
        </button>
        {status && <div className="form-status" role="status" aria-live="polite" data-testid="status-contact"><Check size={17} /><p>{status}</p></div>}
      </form>
    </section>
  </main>;
}

function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const privacy = type === 'privacy';
  const title = privacy ? 'A privacy notice in draft.' : 'Website terms in draft.';
  return <main id="main"><PageHero eyebrow={privacy ? 'Privacy' : 'Terms'} title={title} intro="This draft page is provided for review and is not a substitute for final legal advice or approved corporate disclosures." />
    <section className="legal-content page-pad"><div className="legal-alert"><span className="eyebrow">REVIEW REQUIRED</span><p>Company identity, registered details, contact destination, data practices and applicable legal wording must be verified before publication.</p></div>
      {(privacy ? [
        ['01 / Information submitted', 'This website draft includes an enquiry form interface. It does not transmit or store form submissions automatically. Browser validation runs locally, and no analytics or backend submission integration has been added.'],
        ['02 / Email drafts', 'A future verified contact destination may allow the form to prepare an email draft. A visitor would review and send that draft using their own email application. No draft should be described as sent automatically.'],
        ['03 / Cookies and tracking', 'No tracking or analytics feature has been intentionally added to this website draft. Hosting infrastructure may process technical information; details should be confirmed with the hosting provider before publication.'],
        ['04 / Contact and updates', 'A verified privacy contact and final data-retention and handling details must be supplied before this notice is finalised.'],
      ] : [
        ['01 / Website information', 'Website content is intended as general information about AMX VERSE capabilities. It is not a technical specification, quote, warranty or commitment to accept a project.'],
        ['02 / Project scope', 'Any work, deliverables, material selection, process, timing and commercial terms must be agreed separately in writing. Requirements and outcomes depend on the specific brief.'],
        ['03 / Use of content', 'Content on this draft website should not be copied or relied upon as approved corporate, legal or technical disclosure. Rights and permissions require confirmation.'],
        ['04 / Contact and governing terms', 'Registered company information, applicable law, dispute terms and a verified contact destination must be reviewed and approved before public launch.'],
      ]).map(item => <article className="legal-row" key={item[0]}><span className="eyebrow">{item[0]}</span><p>{item[1]}</p></article>)}
      <p className="legal-date mono">DRAFT FOR REVIEW · NOT FINAL LEGAL ADVICE</p></section>
  </main>;
}

function RouteView({ path }: { path: string }) {
  useEffect(() => {
    const [title, description] = titles[path] || ['AMX VERSE | Engineering & Additive Manufacturing', 'Additive manufacturing, product design and engineering support from AMX VERSE PRIVATE LIMITED.'];
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
    meta.setAttribute('content', description);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [path]);
  if (path === '/') return <HomePage />;
  if (path === '/services') return <ServicesPage />;
  if (path === '/contact') return <ContactPage />;
  if (path === '/privacy') return <LegalPage type="privacy" />;
  if (path === '/terms') return <LegalPage type="terms" />;
  if (pageDetails[path]) return <DetailPage path={path} />;
  return <NotFound />;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#')) return;

      const targetPath = href.split('?')[0].split('#')[0];
      if (targetPath === location || targetPath === window.location.pathname) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [location]);

  return null;
}

function Router() {
  const paths = [
    '/',
    '/about',
    '/services',
    '/services/3d-printing',
    '/services/cad-design',
    '/services/3d-scanning-reverse-engineering',
    '/services/product-prototyping',
    '/innovation',
    '/innovation/ecofil',
    '/training',
    '/projects',
    '/contact',
    '/privacy',
    '/terms',
  ];
  return (
    <RoutedErrorBoundary>
      <ScrollToTop />
      <Switch>
        {paths.map((path) => (
          <Route key={path} path={path}>
            <Shell>
              <RouteView path={path} />
            </Shell>
          </Route>
        ))}
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
