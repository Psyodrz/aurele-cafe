import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const CATEGORIES = [
  {
    id: 'Coffee',
    metric: 'Intensity',
    items: [
      { name: 'Espresso', desc: 'The pure essence of coffee, distilled into a single sip.', price: '€4.50', notes: ['Cocoa', 'Bold', 'Short'], intensity: 5, img: '/images/menu/espresso.png' },
      { name: 'Cappuccino', desc: 'Golden foam, perfect balance, an assertive character.', price: '€5.00', notes: ['Velvety', 'Balanced', 'Classic'], intensity: 4, img: '/images/menu/cappuccino.png' },
      { name: 'Latte Art', desc: 'A work of art in your cup, every single morning.', price: '€5.50', notes: ['Smooth', 'Creamy', 'Sweet'], intensity: 3, img: '/images/menu/latte.png' },
      { name: 'Flat White', desc: 'Double ristretto beneath a silky micro-foam.', price: '€5.20', notes: ['Strong', 'Silky', 'Compact'], intensity: 4, img: '/images/menu/flat-white.png' },
      { name: 'Cortado', desc: 'An Andalusian balance of espresso and warm milk.', price: '€4.80', notes: ['Mellow', 'Warm', 'Even'], intensity: 3, img: '/images/menu/cortado.png' },
      { name: 'Filter Coffee', desc: 'Slow extraction, floral notes, single origin.', price: '€4.20', notes: ['Floral', 'Clean', 'Light'], intensity: 2, img: '/images/menu/filter-coffee.png' },
    ],
  },
  {
    id: 'Pastries',
    metric: 'Richness',
    items: [
      { name: 'Butter Croissant', desc: 'Golden lamination, AOP Charentes-Poitou butter.', price: '€3.20', notes: ['Flaky', 'Buttery', 'Airy'], intensity: 4, img: '/images/menu/butter-croissant.png' },
      { name: 'Pain au Chocolat', desc: 'Two bars of 70% dark chocolate in laminated dough.', price: '€3.50', notes: ['Rich', 'Dark', 'Flaky'], intensity: 5, img: '/images/menu/pain-au-chocolat.png' },
      { name: 'Canelé', desc: 'Caramelised crust, a tender vanilla heart.', price: '€3.00', notes: ['Caramel', 'Vanilla', 'Dense'], intensity: 4, img: '/images/menu/canele.png' },
      { name: 'Coffee Éclair', desc: 'Coffee pastry cream beneath a glossy glaze.', price: '€5.80', notes: ['Coffee', 'Creamy', 'Sweet'], intensity: 3, img: '/images/menu/coffee-eclair.png' },
      { name: 'Madeleine', desc: 'A soft honey shell with a hint of lemon.', price: '€2.80', notes: ['Honey', 'Lemon', 'Light'], intensity: 2, img: '/images/menu/madeleine.png' },
    ],
  },
  {
    id: 'Cold Drinks',
    metric: 'Freshness',
    items: [
      { name: 'Iced Coffee', desc: 'Espresso over ice, refreshing and smooth.', price: '€5.00', notes: ['Cold', 'Smooth', 'Light'], intensity: 4, img: '/images/menu/iced-coffee.png' },
      { name: 'Cold Brew', desc: '18-hour cold infusion, round and never bitter.', price: '€5.50', notes: ['Round', 'Smooth', 'Bold'], intensity: 5, img: '/images/menu/cold-brew.png' },
      { name: 'Affogato', desc: 'Vanilla gelato drowned in a hot espresso.', price: '€6.20', notes: ['Sweet', 'Contrast', 'Rich'], intensity: 3, img: '/images/menu/affogato.png' },
      { name: 'House Lemonade', desc: 'Pressed lemon, fresh mint, sparkling water.', price: '€4.80', notes: ['Zesty', 'Minty', 'Bright'], intensity: 5, img: '/images/menu/house-lemonade.png' },
    ],
  },
]

export default function MenuSection() {
  const sectionRef = useRef(null)
  const listRef = useRef(null)
  const [active, setActive] = useState(CATEGORIES[0].items[0])
  const [failedImgs, setFailedImgs] = useState({})

  // Which category the previewed item belongs to (for the metric + counter)
  const activeCategory =
    CATEGORIES.find((c) => c.items.some((i) => i.name === active.name)) || CATEGORIES[0]
  const activeIndex = activeCategory.items.findIndex((i) => i.name === active.name)

  // Intro reveal (StrictMode-safe)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.menu__title, .menu__tag', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        opacity: 0, y: 40, duration: 1, ease: 'expo.out', stagger: 0.1,
      })
      // Reveal every category group + its rows as they scroll into view
      gsap.utils.toArray('.menu__group').forEach((group) => {
        gsap.from(group.querySelectorAll('.menu__group-label, .menu__row'), {
          scrollTrigger: { trigger: group, start: 'top 85%' },
          opacity: 0, y: 22, duration: 0.7, ease: 'expo.out', stagger: 0.06,
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="menu" id="menu">
      <div className="menu__header">
        <h2 className="menu__title">Our Selection</h2>
        <span className="menu__tag">01 — The Menu</span>
      </div>

      <div className="menu__interactive">
        <div ref={listRef} className="menu__list">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="menu__group">
              <h3 className="menu__group-label">{cat.id}</h3>
              {cat.items.map((item) => (
                <article
                  key={item.name}
                  className={`menu__row${active.name === item.name ? ' menu__row--active' : ''}`}
                  onMouseEnter={() => setActive(item)}
                  onClick={() => setActive(item)}
                >
                  <div className="menu__row-head">
                    <h3 className="menu__row-name">{item.name}</h3>
                    <span className="menu__row-leader" />
                    <span className="menu__row-price">{item.price}</span>
                  </div>
                  <p className="menu__row-desc">{item.desc}</p>
                </article>
              ))}
            </div>
          ))}
        </div>

        <aside className="menu__preview" aria-live="polite">
          <div key={`${activeCategory.id}-${active.name}`} className="menu__preview-inner">
            <div className="menu__preview-frame">
              {active.img && !failedImgs[active.img] ? (
                <img
                  src={active.img}
                  alt={active.name}
                  className="menu__preview-img"
                  onError={() => setFailedImgs((f) => ({ ...f, [active.img]: true }))}
                />
              ) : (
                <span className="menu__preview-monogram">{active.name.charAt(0)}</span>
              )}
            </div>
            <span className="menu__preview-number">
              {String(activeIndex + 1).padStart(2, '0')} / {String(activeCategory.items.length).padStart(2, '0')}
            </span>
            <h3 className="menu__preview-name">{active.name}</h3>
            <p className="menu__preview-desc">{active.desc}</p>
            <div className="menu__preview-notes">
              {active.notes.map((n) => (
                <span key={n} className="menu__note">{n}</span>
              ))}
            </div>
            <div className="menu__intensity">
              <span className="menu__intensity-label">{activeCategory.metric}</span>
              <span className="menu__dots">
                {[1, 2, 3, 4, 5].map((d) => (
                  <span key={d} className={`menu__dot${d <= active.intensity ? ' menu__dot--on' : ''}`} />
                ))}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
