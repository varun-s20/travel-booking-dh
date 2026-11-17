/* =====================================================================
   Landfall (working name, a placeholder): the landfall line
   Round 3 shared component (round3-spec.md, shared components 2). The
   concept's mark: a fine 1.25px line in --c-field that ends in the 8px
   landing dot (--c-action, ringed in the ground colour). It marks routes,
   durations, stay lengths and steps.
   - from, to: end labels (airport codes or short words), optional
   - label: the middle label under the line ("2h 45m, nonstop", "4 nights")
   - stops: dots on the line, each with its code shown on hover and in the name
   - size: "card" (120px), "fluid" (fills its box)
   - grow: 0 to 1, how much of the box the line takes (the trending board
     scales each route to the longest); the end label sits after it
   - dark: on the photo or a dark band (white line, shallows dot)
   - name: the accessible name; without it the line is decorative
   ===================================================================== */

type Stop = { code: string; label?: string };
type Props = {
  from?: string; to?: string; label?: string; stops?: Stop[]; size?: 'card' | 'fluid';
  grow?: number; dark?: boolean; name?: string; className?: string;
};

export default function LandfallLine({ from, to, label, stops = [], size = 'fluid', grow, dark, name, className }: Props) {
  const cls = ['a-lline', `-${size}`, dark ? '-dark' : '', className || ''].filter(Boolean).join(' ');
  const style = grow !== undefined ? ({ ['--grow' as string]: Math.max(0.12, Math.min(1, grow)).toFixed(3) } as React.CSSProperties) : undefined;
  return (
    <span className={cls} style={style} role={name ? 'img' : undefined} aria-label={name} aria-hidden={name ? undefined : true}>
      <span className="a-lline__row">
        {from && <span className="a-lline__end t-code">{from}</span>}
        <span className="a-lline__track">
          <span className="a-lline__rule" />
          {stops.map((s, i) => (
            <span key={s.code + i} className="a-lline__stop" style={{ left: `${((i + 1) / (stops.length + 1)) * 100}%` }} data-code={s.code} title={s.label || s.code} />
          ))}
          <span className="a-lline__dot" />
        </span>
        {to && <span className="a-lline__end t-code">{to}</span>}
      </span>
      {label && <span className="a-lline__label t-num">{label}</span>}
    </span>
  );
}
