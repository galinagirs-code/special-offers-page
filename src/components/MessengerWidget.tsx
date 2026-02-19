import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const MessengerWidget = () => {
  const [isClosed, setIsClosed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || isClosed) return null;

  return (
    <div className="fixed left-4 bottom-20 md:bottom-4 z-50 animate-fade-in">
      <div
        className="bg-[#272D49] border border-border/40 rounded-2xl shadow-2xl p-5 w-[260px] md:w-[280px] relative"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
      >
        <button
          onClick={() => setIsClosed(true)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Закрыть"
        >
          <Icon name="X" size={20} />
        </button>

        <p className="text-[#F6A327] font-semibold text-sm mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Нужен быстрый ответ?
        </p>
        <p className="text-foreground/70 text-xs mb-4">
          Напишите менеджеру напрямую в
        </p>

        <div className="flex flex-col gap-2.5">
          <a
            href="https://max.ru/u/f9LHodD0cOIP8_25Pol0FgGthbuYFvPpONLlW4R8sdoUUmuprdyzEwbPSy0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#1E2440] hover:bg-[#273369] rounded-xl px-4 py-3 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-[#F6A327] flex items-center justify-center flex-shrink-0">
              <Icon name="MessageCircle" size={18} className="text-[#272D49]" />
            </div>
            <div>
              <span className="text-foreground text-sm font-semibold block">MAX</span>
              <span className="text-foreground/50 text-xs">Мессенджер</span>
            </div>
            <Icon name="ExternalLink" size={14} className="text-foreground/30 ml-auto group-hover:text-[#F6A327] transition-colors" />
          </a>

          <a
            href="https://t.me/kgs_ural"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#1E2440] hover:bg-[#273369] rounded-xl px-4 py-3 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-[#26A5E4] flex items-center justify-center flex-shrink-0">
              <Icon name="Send" size={18} className="text-white" />
            </div>
            <div>
              <span className="text-foreground text-sm font-semibold block">Telegram</span>
              <span className="text-foreground/50 text-xs">@kgs_ural</span>
            </div>
            <Icon name="ExternalLink" size={14} className="text-foreground/30 ml-auto group-hover:text-[#26A5E4] transition-colors" />
          </a>
        </div>

        <p className="text-foreground/40 text-[11px] mt-3 text-center">
          Ответим в течение 5 минут
        </p>
      </div>
    </div>
  );
};

export default MessengerWidget;
