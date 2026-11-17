/* =====================================================================
   Pre-footer band (Varun V10): one line, one white pill, the window
   glyph faint behind it. The line names the gesture the hero's blinds
   make (content/copy.md, Pre-footer band). The pill brings the search
   back into view and puts focus in From.
   ===================================================================== */
import { SearchLink } from '@/components/home/SearchLink';
import { Photo } from '@/components/Photo';
import { HERO_VIEW } from '@/lib/site';

export function PreFooterBand({ mode = 'flights' }: { mode?: 'flights' | 'hotels' }) {
  return (
    <section className="o-homeBand" aria-labelledby="home-band-title">
      <div className="o-homeBand__panel">
        {/* revision 2026-11-11, item 20: a real window with the hero view behind the line (decorative) */}
        <span className="o-homeBand__window" aria-hidden="true">
          <Photo name={HERO_VIEW} alt="" sizes="(min-width: 1025px) 330px, 180px" className="o-homeBand__img" />
        </span>
        <h2 className="o-homeBand__title a-h1" id="home-band-title">Pull up the blind on your next trip</h2>
        {/* round 3 (spec A13): the button follows the mode */}
        <SearchLink mode={mode} label={mode === 'hotels' ? 'Find a hotel' : 'Search flights'} />
      </div>
    </section>
  );
}
