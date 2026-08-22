import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';

export function Footer() {
  const year = new Date().getFullYear();
  const { theme } = useThemeStore();

  return (
    <footer className="border-t-2 border-ink pt-[52px] pb-[36px] font-inter">
      <div className="vv-container">
        {/* 4-column grid, collapses to 2 on mobile */}
        <div className="grid grid-cols-1 min-[481px]:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 mb-11">
          {/* Brand column */}
          <div>
            <Link to="/" className="inline-block mb-3">
              <img 
                src={theme === 'dark' ? "/vocab_mitra_logo.png" : "/vocab_mitra_logo_white.png"} 
                alt="Vocab Mitra Logo" 
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-[13.5px] text-ink-soft leading-[1.6] max-w-[32ch]">
              A flashcard deck built for remembering, not just looking up — memory hooks and exam-tagged words for CAT, UPSC, GRE and more.
            </p>
          </div>

          {/* About */}
          <div>
            <h4 className="font-space text-[11px] font-bold tracking-[0.05em] uppercase text-ink-soft mb-3.5">
              About
            </h4>
            {['Our approach', 'How it works', 'FAQ'].map((link) => (
              <a
                key={link}
                href="#"
                className="block text-[13.5px] font-medium text-ink opacity-85 mb-2.5 transition-all duration-200 hover:text-upsc hover:opacity-100"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-space text-[11px] font-bold tracking-[0.05em] uppercase text-ink-soft mb-3.5">
              Quick Links
            </h4>
            {[
              { label: 'Vocabulary', to: '/vocabulary' },
              { label: 'Card of the Day', to: '/#wod' },
              { label: 'Categories', to: '/vocabulary' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="block text-[13.5px] font-medium text-ink opacity-85 mb-2.5 transition-all duration-200 hover:text-upsc hover:opacity-100"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Contact / Social */}
          <div>
            <h4 className="font-space text-[11px] font-bold tracking-[0.05em] uppercase text-ink-soft mb-3.5">
              Contact
            </h4>
            {[
              { label: 'Support', href: 'mailto:support@vocabmitra.app' },
              { label: 'Twitter', href: '#' },
              { label: 'Instagram', href: '#' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="block text-[13.5px] font-medium text-ink opacity-85 mb-2.5 transition-all duration-200 hover:text-upsc hover:opacity-100"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="flex justify-between items-center pt-6 border-t-2 border-line font-space text-[11.5px] text-ink-soft">
          <span>© {year} Vocab Mitra</span>
          <span>Made for word people</span>
        </div>
      </div>
    </footer>
  );
}
