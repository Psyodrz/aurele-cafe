export default function FooterSection() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <span className="footer__brand">Aurèle</span>
        <p className="footer__tagline">A sensory experience · Paris</p>
        <nav className="footer__links">
          <a href="#menu" className="footer__link">Menu</a>
          <a href="#gallery" className="footer__link">Atmosphere</a>
          <a href="#hours" className="footer__link">Hours</a>
          <a href="#reserve" className="footer__link">Reserve</a>
        </nav>
      </div>
      <div className="footer__bottom">
        © 2026 Aurèle. All rights reserved.
      </div>
    </footer>
  )
}
