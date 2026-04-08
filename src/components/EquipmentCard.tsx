import Icon from '@/components/ui/icon';

type EquipmentRow = { n: number; name: string; vin: string; loc: string; year: number | null; hours: string; price: string };

interface Props {
  row: EquipmentRow;
  onClose: () => void;
  onRequest: (name: string, vin: string) => void;
}

export default function EquipmentCard({ row, onClose, onRequest }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_0_40px_6px_rgba(246,163,39,0.18)]"
        style={{ background: 'linear-gradient(160deg, #1a2455 0%, #0f1529 100%)', border: '1px solid rgba(246,163,39,0.25)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="relative px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Truck" size={16} className="text-[#F6A327] flex-shrink-0" />
            <span className="text-[#F6A327] text-xs font-semibold uppercase tracking-widest">Б/у техника</span>
          </div>
          <h3 className="text-white font-bold text-lg leading-snug pr-6">{row.name}</h3>
        </div>

        {/* Параметры */}
        <div className="px-5 py-4 space-y-3">

          {/* Цена */}
          <div className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(246,163,39,0.08)', border: '1px solid rgba(246,163,39,0.2)' }}>
            <span className="text-white/60 text-sm">Цена</span>
            {row.price && row.price !== 'по запросу' ? (
              <span className="text-[#F6A327] font-bold text-xl">{row.price} <span className="text-sm font-normal">₽</span></span>
            ) : (
              <span className="text-white/40 italic text-sm">по запросу</span>
            )}
          </div>

          {/* Остальные параметры */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {row.year && (
              <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="flex items-center gap-2 text-white/50 text-sm">
                  <Icon name="Calendar" size={14} className="flex-shrink-0" />
                  Год выпуска
                </span>
                <span className="text-white font-semibold text-sm">{row.year}</span>
              </div>
            )}
            {row.hours && (
              <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="flex items-center gap-2 text-white/50 text-sm">
                  <Icon name="Gauge" size={14} className="flex-shrink-0" />
                  Наработка
                </span>
                <span className="text-white font-semibold text-sm">{row.hours}</span>
              </div>
            )}
            {row.loc && (
              <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="flex items-center gap-2 text-white/50 text-sm">
                  <Icon name="MapPin" size={14} className="flex-shrink-0" />
                  Местонахождение
                </span>
                <span className="text-white font-semibold text-sm text-right max-w-[55%]">{row.loc}</span>
              </div>
            )}
            {row.vin && (
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="flex items-center gap-2 text-white/50 text-sm flex-shrink-0">
                  <Icon name="Hash" size={14} className="flex-shrink-0" />
                  VIN
                </span>
                <span className="text-white/70 font-mono text-xs text-right break-all ml-3">{row.vin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Кнопки */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Закрыть
          </button>
          <button
            onClick={() => { onRequest(row.name, row.vin); onClose(); }}
            className="flex-[2] py-2.5 rounded-xl text-sm font-bold text-[#273369] transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #F6A327, #e8911a)' }}
          >
            <Icon name="Send" size={15} className="flex-shrink-0" />
            Оставить заявку
          </button>
        </div>
      </div>
    </div>
  );
}
