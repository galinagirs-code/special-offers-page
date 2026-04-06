import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type EquipmentRow = { n: number; name: string; vin: string; loc: string; year: number | null; hours: string; price: string };
type GroupRow = { group: string };
type Row = EquipmentRow | GroupRow;

interface Props {
  filteredRows: Row[];
  search: string;
  onRequest: (name: string, vin: string) => void;
}

const BG_G = 'rgba(39,51,105,0.65)';

// Единое определение колонок — используется и в заголовке, и в теле
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

// Заголовок таблицы — экспортируется отдельно, вставляется в sticky-блок в Index.tsx
export function UsedTableHead() {
  return (
    <div style={{ overflowX: 'hidden', background: '#1e2a5e' }}>
      <table style={{ width: '100%', minWidth: TOTAL_W, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          {COLS.map(c => <col key={c.label} style={{ width: c.w }} />)}
        </colgroup>
        <thead>
          <tr>
            {COLS.map(c => (
              <th key={c.label} style={{
                padding: '11px 10px',
                background: '#1e2a5e',
                color: '#F6A327',
                fontWeight: 700,
                fontSize: 13,
                textAlign: c.align,
                lineHeight: 1.3,
                border: '1px solid rgba(246,163,39,0.2)',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
}

// Тело таблицы — горизонтальный скролл
export default function UsedTable({ filteredRows, search, onRequest }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);

  // Синхронизация горизонтального скролла тела → заголовок
  const onBodyScroll = () => {
    const headDiv = bodyRef.current?.closest('main')?.querySelector('[data-sticky-header] div[style]') as HTMLElement | null;
    if (headDiv && bodyRef.current) {
      headDiv.scrollLeft = bodyRef.current.scrollLeft;
    }
  };

  const count = filteredRows.filter(r => 'n' in r).length;

  return (
    <div ref={bodyRef} style={{ overflowX: 'auto' }} onScroll={onBodyScroll}>
      <table style={{ width: '100%', minWidth: TOTAL_W, borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          {COLS.map(c => <col key={c.label} style={{ width: c.w }} />)}
        </colgroup>
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
                <tr key={i} style={{ background: even ? 'transparent' : 'rgba(255,255,255,0.025)', transition: 'background 0.12s' }} className="hover:bg-[#273369]/30">
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
                      onClick={() => onRequest(row.name, row.vin)}
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

      {count === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-30" />
          <p>Ничего не найдено по запросу «{search}»</p>
        </div>
      )}
    </div>
  );
}
