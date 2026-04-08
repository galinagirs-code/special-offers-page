import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export type EquipmentRow = { n: number; name: string; vin: string; loc: string; year: number | null; hours: string; price: string };
type GroupRow = { group: string };
type Row = EquipmentRow | GroupRow;

interface Props {
  filteredRows: Row[];
  search: string;
  onRequest: (name: string, vin: string) => void;
  onCardOpen: (row: EquipmentRow) => void;
}

const BG_G = 'rgba(39,51,105,0.65)';

export const COLS = [
  { label: 'п/п',                         align: 'center' as const, w: 44 },
  { label: 'Наименование',                 align: 'left'   as const, w: 260 },
  { label: 'VIN номер',                    align: 'left'   as const, w: 130 },
  { label: 'Местонахождение',              align: 'left'   as const, w: 140 },
  { label: 'Год выпуска',                  align: 'center' as const, w: 72 },
  { label: 'Наработка / пробег (м/ч, км)', align: 'left'   as const, w: 140 },
  { label: 'Стоимость (руб)',              align: 'right'  as const, w: 145 },
  { label: 'Заявка',                       align: 'center' as const, w: 85 },
];
export const TOTAL_W = COLS.reduce((s, c) => s + c.w, 0);

function td(extra: React.CSSProperties = {}): React.CSSProperties {
  return { padding: '9px 10px', border: '1px solid rgba(255,255,255,0.07)', fontSize: 13, verticalAlign: 'middle', ...extra };
}

// ─── Заголовок для десктопа ───────────────────────────────────────────────────
export function UsedTableHead() {
  return (
    <>
      {/* Десктоп */}
      <div className="hidden md:block" style={{ overflowX: 'hidden', background: '#1e2a5e' }}>
        <table style={{ width: '100%', minWidth: TOTAL_W, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>{COLS.map(c => <col key={c.label} style={{ width: c.w }} />)}</colgroup>
          <thead>
            <tr>
              {COLS.map(c => (
                <th key={c.label} style={{
                  padding: '11px 10px', background: '#1e2a5e', color: '#F6A327',
                  fontWeight: 700, fontSize: 13, textAlign: c.align, lineHeight: 1.3,
                  border: '1px solid rgba(246,163,39,0.2)', whiteSpace: 'normal', wordBreak: 'break-word',
                }}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Мобильный заголовок */}
      <div className="md:hidden" style={{ background: '#1e2a5e', borderBottom: '1px solid rgba(246,163,39,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '36%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '7%' }} />
          </colgroup>
          <thead>
            <tr>
              {['Наименование', 'Год', 'Стоимость', 'Заявка', ''].map(h => (
                <th key={h} style={{
                  padding: '9px 3px', background: '#1e2a5e', color: '#F6A327',
                  fontWeight: 700, fontSize: 11, textAlign: h === 'Год' ? 'center' : h === 'Стоимость' ? 'right' : h === 'Заявка' ? 'center' : 'left',
                  border: '1px solid rgba(246,163,39,0.2)', lineHeight: 1.2, whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
    </>
  );
}

// ─── Строка с раскрывалкой (мобильная) ───────────────────────────────────────
function MobileRow({ row, even, onRequest, onCardOpen }: { row: EquipmentRow; even: boolean; onRequest: (n: string, v: string) => void; onCardOpen: (row: EquipmentRow) => void }) {
  const [hovered, setHovered] = useState(false);
  const bg = hovered ? 'rgba(39,51,105,0.55)' : even ? 'transparent' : 'rgba(255,255,255,0.03)';
  const border = hovered ? '1px solid rgba(246,163,39,0.22)' : '1px solid rgba(255,255,255,0.06)';
  const boxShadow = hovered ? '0 0 14px 1px rgba(246,163,39,0.13)' : 'none';

  return (
    <>
      <tr
        style={{ background: bg, transition: 'background 0.18s, box-shadow 0.18s', boxShadow, cursor: 'pointer' }}
        onClick={() => onCardOpen(row)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Название */}
        <td style={{ padding: '6px 7px', fontSize: 12, fontWeight: 600, border, verticalAlign: 'top', lineHeight: 1.35, paddingTop: 8 }}>
          {row.name}
        </td>
        {/* Год */}
        <td style={{ padding: '6px 4px', fontSize: 12, textAlign: 'center', color: 'rgba(255,255,255,0.6)', border, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
          {row.year || '—'}
        </td>
        {/* Цена */}
        <td style={{
          padding: '6px 5px', fontSize: 11, textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap',
          color: row.price && row.price !== 'по запросу' ? '#F6A327' : 'rgba(255,255,255,0.35)',
          fontStyle: !row.price || row.price === 'по запросу' ? 'italic' : 'normal',
          border, verticalAlign: 'middle', lineHeight: 1.25,
        }}>
          {row.price && row.price !== 'по запросу'
            ? <>{row.price}<br /><span style={{ fontSize: 10, fontWeight: 400, opacity: 0.7 }}>руб</span></>
            : 'по запросу'}
        </td>
        {/* Кнопка заявки */}
        <td style={{ padding: '5px 4px', textAlign: 'center', border, verticalAlign: 'middle' }}>
          <button
            style={{ background: 'linear-gradient(135deg,#10B981,#0d9268)', color: '#fff', fontWeight: 700, fontSize: 10, borderRadius: 5, padding: '6px 2px', border: 'none', cursor: 'pointer', lineHeight: 1.2, width: '100%', boxShadow: '0 1px 6px rgba(16,185,129,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}
            onClick={e => { e.stopPropagation(); onRequest(row.name, row.vin); }}
          >
            Заявка
          </button>
        </td>
        {/* Стрелка — подсказка что кликабельно */}
        <td style={{ padding: '4px 2px', textAlign: 'center', border, verticalAlign: 'middle' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 20, height: 20, borderRadius: '50%',
            background: hovered ? 'rgba(246,163,39,0.2)' : 'rgba(255,255,255,0.08)',
            color: hovered ? '#F6A327' : 'rgba(255,255,255,0.4)',
            transition: 'background 0.18s, color 0.18s',
          }}>
            <Icon name="ChevronRight" size={13} />
          </span>
        </td>
      </tr>
    </>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────
export default function UsedTable({ filteredRows, search, onRequest, onCardOpen }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);

  const onBodyScroll = () => {
    const headDiv = bodyRef.current?.closest('main')?.querySelector('[data-sticky-header] div[style]') as HTMLElement | null;
    if (headDiv && bodyRef.current) headDiv.scrollLeft = bodyRef.current.scrollLeft;
  };

  const count = filteredRows.filter(r => 'n' in r).length;

  return (
    <>
      {/* ── ДЕСКТОП ── */}
      <div ref={bodyRef} className="hidden md:block" style={{ overflowX: 'auto' }} onScroll={onBodyScroll}>
        <table style={{ width: '100%', minWidth: TOTAL_W, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>{COLS.map(c => <col key={c.label} style={{ width: c.w }} />)}</colgroup>
          <tbody>
            {(() => {
              let rowIdx = 0;
              return filteredRows.map((row, i) => {
                if ('group' in row) {
                  if (search) return null;
                  return (
                    <tr key={i} style={{ background: BG_G }}>
                      <td colSpan={8} style={td({ color: '#F6A327', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '7px 10px' })}>
                        {row.group}
                      </td>
                    </tr>
                  );
                }
                const even = rowIdx++ % 2 === 0;
                return (
                  <tr key={i} style={{ background: even ? 'transparent' : 'rgba(255,255,255,0.025)', transition: 'background 0.18s, box-shadow 0.18s' }} className="hover:bg-[#273369]/40 hover:shadow-[0_0_18px_2px_rgba(246,163,39,0.18)] cursor-pointer group" onClick={() => onCardOpen(row)}>
                    <td style={td({ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12 })}>{row.n}</td>
                    <td style={td({ fontWeight: 600 })}>{row.name}</td>
                    <td style={td({ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'monospace', wordBreak: 'break-all' })}>{row.vin}</td>
                    <td style={td({ color: 'rgba(255,255,255,0.65)', fontSize: 12 })}>{row.loc}</td>
                    <td style={td({ textAlign: 'center', color: 'rgba(255,255,255,0.65)', fontSize: 12 })}>{row.year || ''}</td>
                    <td style={td({ color: 'rgba(255,255,255,0.65)', fontSize: 12 })}>{row.hours}</td>
                    <td style={td({
                      textAlign: 'right', fontWeight: 700,
                      color: row.price && row.price !== 'по запросу' ? '#F6A327' : 'rgba(255,255,255,0.45)',
                      fontStyle: !row.price || row.price === 'по запросу' ? 'italic' : 'normal',
                    })}>
                      {row.price && row.price !== 'по запросу' ? `${row.price} ₽` : 'по запросу'}
                    </td>
                    <td style={td({ textAlign: 'center', padding: '5px' })}>
                      <Button
                        size="sm"
                        style={{ background: 'linear-gradient(135deg,#10B981,#0d9268)', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }}
                        className="text-white text-xs font-bold h-7 px-2.5 hover:opacity-90 transition-opacity"
                        onClick={e => { e.stopPropagation(); onRequest(row.name, row.vin); }}
                      >
                        Заявка
                      </Button>
                    </td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>

      {/* ── МОБИЛЬНЫЙ ── */}
      <div className="md:hidden">
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '36%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '7%' }} />
          </colgroup>
          <tbody>
            {(() => {
              let rowIdx = 0;
              return filteredRows.map((row, i) => {
                if ('group' in row) {
                  if (search) return null;
                  return (
                    <tr key={i} style={{ background: BG_G }}>
                      <td colSpan={5} style={{ padding: '6px 8px', color: '#F6A327', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {row.group}
                      </td>
                    </tr>
                  );
                }
                const even = rowIdx++ % 2 === 0;
                return <MobileRow key={i} row={row} even={even} onRequest={onRequest} onCardOpen={onCardOpen} />;
              });
            })()}
          </tbody>
        </table>
      </div>

      {count === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-30" />
          <p>Ничего не найдено по запросу «{search}»</p>
        </div>
      )}
    </>
  );
}