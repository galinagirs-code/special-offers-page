import { useEffect, useState } from 'react';
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

const th = (extra: React.CSSProperties, top: number): React.CSSProperties => ({
  position: 'sticky',
  top,
  zIndex: 10,
  background: '#273369',
  color: '#F6A327',
  fontWeight: 700,
  fontSize: 12,
  padding: '9px 8px',
  border: B,
  textAlign: 'left',
  ...extra,
});

const td = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  padding: '8px',
  border: B,
  fontSize: 12,
  verticalAlign: 'middle',
  ...extra,
});

export default function UsedTable({ filteredRows, search, onRequest }: Props) {
  const [top, setTop] = useState(174);

  useEffect(() => {
    const calc = () => {
      const els = document.querySelectorAll('[data-sticky-header]');
      let h = 0;
      els.forEach(el => { h += (el as HTMLElement).offsetHeight; });
      if (h > 0) setTop(h);
    };
    const t = setTimeout(calc, 80);
    window.addEventListener('resize', calc);
    return () => { clearTimeout(t); window.removeEventListener('resize', calc); };
  }, []);

  const count = filteredRows.filter(r => 'n' in r).length;

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'] }}>
      <table style={{ minWidth: 760, width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
        <thead>
          <tr>
            <th style={th({ textAlign: 'center', width: 36 }, top)}>п/п</th>
            <th style={th({ minWidth: 200 }, top)}>Наименование</th>
            <th style={th({ minWidth: 90 }, top)}>VIN номер</th>
            <th style={th({ minWidth: 100 }, top)}>Местонахождение</th>
            <th style={th({ textAlign: 'center', width: 58 }, top)}>Год выпуска</th>
            <th style={th({ minWidth: 105 }, top)}>Наработка / пробег (м/ч, км)</th>
            <th style={th({ textAlign: 'right', minWidth: 115 }, top)}>Стоимость (руб)</th>
            <th style={th({ textAlign: 'center', width: 70 }, top)}>Заявка</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, i) => {
            if ('group' in row) {
              if (search) return null;
              return (
                <tr key={i} style={{ background: 'rgba(39,51,105,0.55)' }}>
                  <td colSpan={8} style={td({ color: '#F6A327', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' })}>
                    {row.group}
                  </td>
                </tr>
              );
            }
            return (
              <tr key={i} className="hover:bg-[#273369]/20 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={td({ textAlign: 'center', color: 'rgba(255,255,255,0.45)', width: 36 })}>{row.n}</td>
                <td style={td({ fontWeight: 500 })}>{row.name}</td>
                <td style={td({ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'monospace' })}>{row.vin}</td>
                <td style={td({ color: 'rgba(255,255,255,0.6)' })}>{row.loc}</td>
                <td style={td({ textAlign: 'center', color: 'rgba(255,255,255,0.6)' })}>{row.year || ''}</td>
                <td style={td({ color: 'rgba(255,255,255,0.6)' })}>{row.hours}</td>
                <td style={td({
                  textAlign: 'right', fontWeight: 600, whiteSpace: 'nowrap',
                  color: row.price && row.price !== 'по запросу' ? '#F6A327' : 'rgba(255,255,255,0.45)',
                  fontStyle: row.price === 'по запросу' ? 'italic' : 'normal',
                })}>
                  {row.price ? (row.price === 'по запросу' ? 'по запросу' : `${row.price} ₽`) : '—'}
                </td>
                <td style={td({ textAlign: 'center', padding: '5px' })}>
                  <Button
                    size="sm"
                    className="bg-[#10B981] hover:bg-[#10B981]/90 text-white text-xs font-semibold h-7 px-2"
                    onClick={() => onRequest(row.name, row.vin)}
                  >
                    Заявка
                  </Button>
                </td>
              </tr>
            );
          })}
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
