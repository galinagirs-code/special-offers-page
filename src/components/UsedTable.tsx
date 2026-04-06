import { useEffect, useRef } from 'react';
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

const B = '1px solid rgba(255,255,255,0.08)';
const BG_H = '#1e2a5e';
const BG_G = 'rgba(39,51,105,0.65)';
const BG_EVEN = 'rgba(255,255,255,0.02)';
const BG_ODD = 'rgba(0,0,0,0.0)';

function td(extra: React.CSSProperties = {}): React.CSSProperties {
  return { padding: '9px 8px', border: B, fontSize: 13, verticalAlign: 'middle', ...extra };
}

export default function UsedTable({ filteredRows, search, onRequest }: Props) {
  const theadRef = useRef<HTMLTableSectionElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Синхронизируем горизонтальный скролл заголовка с телом
  const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (theadRef.current) {
      theadRef.current.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
    }
  };

  // Вычисляем высоту sticky-блоков над таблицей
  useEffect(() => {
    const calcTop = () => {
      const els = document.querySelectorAll('[data-sticky-header]');
      let h = 0;
      els.forEach(el => { h += (el as HTMLElement).offsetHeight; });
      if (containerRef.current && h > 0) {
        containerRef.current.style.setProperty('--thead-top', `${h}px`);
      }
    };
    const t = setTimeout(calcTop, 80);
    window.addEventListener('resize', calcTop);
    return () => { clearTimeout(t); window.removeEventListener('resize', calcTop); };
  }, []);

  const count = filteredRows.filter(r => 'n' in r).length;

  const cols = [
    { label: 'п/п', w: 36, align: 'center' as const },
    { label: 'Наименование', w: 220, align: 'left' as const },
    { label: 'VIN номер', w: 95, align: 'left' as const },
    { label: 'Местонахождение', w: 110, align: 'left' as const },
    { label: 'Год выпуска', w: 62, align: 'center' as const },
    { label: 'Наработка / пробег (м/ч, км)', w: 115, align: 'left' as const },
    { label: 'Стоимость (руб)', w: 120, align: 'right' as const },
    { label: 'Заявка', w: 72, align: 'center' as const },
  ];
  const totalW = cols.reduce((s, c) => s + c.w, 0);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>

      {/* Sticky заголовок — отдельный div, overflow hidden, translateX синхронизируется */}
      <div
        style={{
          position: 'sticky',
          top: 'var(--thead-top, 174px)',
          zIndex: 20,
          overflowX: 'hidden',
          background: BG_H,
        }}
      >
        <table style={{ minWidth: totalW, width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            {cols.map(c => <col key={c.label} style={{ width: c.w }} />)}
          </colgroup>
          <thead ref={theadRef} style={{ display: 'table-header-group' }}>
            <tr>
              {cols.map(c => (
                <th key={c.label} style={{
                  padding: '10px 8px',
                  border: '1px solid rgba(246,163,39,0.2)',
                  background: BG_H,
                  color: '#F6A327',
                  fontWeight: 800,
                  fontSize: 12,
                  textAlign: c.align,
                  lineHeight: 1.3,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase' as const,
                }}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Тело таблицы — горизонтальный скролл синхронизирует заголовок */}
      <div style={{ overflowX: 'auto' }} onScroll={handleBodyScroll}>
        <table style={{ minWidth: totalW, width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            {cols.map(c => <col key={c.label} style={{ width: c.w }} />)}
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
                const isEven = rowIdx++ % 2 === 0;
                return (
                  <tr
                    key={i}
                    style={{ background: isEven ? BG_ODD : BG_EVEN, transition: 'background 0.15s' }}
                    className="hover:bg-[#273369]/30"
                  >
                    <td style={td({ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12 })}>{row.n}</td>
                    <td style={td({ fontWeight: 600, fontSize: 13 })}>{row.name}</td>
                    <td style={td({ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'monospace', wordBreak: 'break-all' })}>{row.vin}</td>
                    <td style={td({ color: 'rgba(255,255,255,0.65)', fontSize: 12 })}>{row.loc}</td>
                    <td style={td({ textAlign: 'center', color: 'rgba(255,255,255,0.65)', fontSize: 12 })}>{row.year || ''}</td>
                    <td style={td({ color: 'rgba(255,255,255,0.65)', fontSize: 12 })}>{row.hours}</td>
                    <td style={td({
                      textAlign: 'right', fontWeight: 700, fontSize: 13,
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
    </div>
  );
}