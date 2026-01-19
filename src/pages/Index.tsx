import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileCallBtn, setShowMobileCallBtn] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);
      
      setShowMobileCallBtn(scrollPosition > 300 && distanceFromBottom > 400);
      setShowScrollTop(scrollPosition > 500 && distanceFromBottom > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: 'MapPin',
      text: 'В наличии в Екатеринбурге'
    },
    {
      icon: 'Package',
      text: 'Полная комплектация: шкаф + зажим + ЗИП'
    },
    {
      icon: 'Shield',
      text: 'Гарантия 12 месяцев'
    },
    {
      icon: 'Truck',
      text: 'Доставка по России и СНГ'
    }
  ];

  const specifications = [
    { label: 'Мощность двигателя, кВ', value: '90' },
    { label: 'Эксцентриковый момент, кг/м', value: '0-58' },
    { label: 'Центробежная сила, кН', value: '0-579' },
    { label: 'Частота, об/мин', value: '0-960' },
    { label: 'Максимальная амплитуда, мм', value: '11.5' },
    { label: 'Максимальное натяжение троса, кН', value: '254' },
    { label: 'Габариты, мм', value: '1850х1300х2500' },
    { label: 'Вес без зажима, кг', value: '5700' },
    { label: 'Сечение кабеля, мм²', value: '50' },
    { label: 'Зажим', value: 'одинарный/двойной' },
    { label: 'Диапазон применения зажима, мм', value: '530-1500' },
    { label: 'Мощность генератора, кВ', value: '250' },
    { label: 'Минимальная грузоподъемность крана, T', value: '50' }
  ];

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(7|8)?(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    
    if (match) {
      const parts = ['+7'];
      if (match[2]) parts.push(` (${match[2]}`);
      if (match[3]) parts.push(match[2].length === 3 ? `) ${match[3]}` : match[3]);
      if (match[4]) parts.push(`-${match[4]}`);
      if (match[5]) parts.push(`-${match[5]}`);
      return parts.join('');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    const emailBody = `
Новая заявка с сайта KGS-Ural

Имя: ${formData.name}
Телефон: ${formData.phone}
Email: ${formData.email || 'не указан'}
Предложение: Yongan DZJ-90 - 8 150 000 ₽
    `.trim();

    const mailtoLink = `mailto:info@kgs-ural.ru?subject=Заявка на Yongan DZJ-90&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Заявка отправлена',
        description: 'Мы свяжемся с вами в ближайшее время'
      });
      setFormData({ name: '', phone: '', email: '' });
    }, 1000);
  };

  const handleCall = () => {
    window.location.href = 'tel:88006007465';
  };

  const scrollToForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/40 bg-[#272D49] md:sticky md:top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-5">
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between md:gap-4">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
              <a href="https://kgs-ural.ru" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                <img src="https://cdn.poehali.dev/files/KGS_logo_white_yellow.png" alt="KGS" className="h-10 md:h-12 object-contain hover:opacity-80 transition-opacity" style={{minWidth: '120px'}} />
              </a>
              <div className="md:border-l md:border-border/40 md:pl-4 text-center md:text-left">
                <p className="text-sm md:text-base font-medium text-foreground leading-tight">
                  Производство и поставка оборудования для<br />строительства свайных фундаментов
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <a href="tel:88006007465" className="text-sm font-semibold hover:text-[#F6A327] transition-colors">
                  8 (800) 600-74-65
                </a>
                <a href="tel:+73433467475" className="text-sm font-semibold hover:text-[#F6A327] transition-colors">
                  8 (343) 346-74-75
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <a href="https://t.me/kgs_ural" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <Icon name="Send" size={24} className="text-[#229ED9]" />
                </a>
                <a href="https://kgs-ural.ru" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Перейти на сайт KGS-Ural">
                  <Icon name="Globe" size={24} className="text-[#F6A327]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #273369 0%, #272D49 100%)' }}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-center md:justify-start">
                <div className="inline-flex items-center gap-2 bg-[#F6A327]/15 border-2 border-[#F6A327]/50 rounded-lg px-6 py-3">
                  <span className="text-base md:text-lg font-bold text-[#F6A327] uppercase tracking-wider">
                    СПЕЦПРЕДЛОЖЕНИЕ
                  </span>
                </div>
              </div>
              
              <a href="https://kgs-ural.ru/catalog/vibropogruzhateli-kranovie/seriya-dzj/yongan-dzj-90/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-all duration-300">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Вибропогружатель<br />
                  электрический крановый<br />
                  <span className="text-[#F6A327]">Yongan DZJ-90</span>
                </h1>
              </a>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-foreground/90">
                    <div className="w-10 h-10 rounded-lg bg-[#F6A327]/10 border border-[#F6A327]/30 flex items-center justify-center flex-shrink-0">
                      <Icon name={feature.icon} size={20} className="text-[#F6A327]" />
                    </div>
                    <span className="text-base">{feature.text}</span>
                  </div>
                ))}
              </div>

              <Card className="p-4 md:p-6 bg-card/80 backdrop-blur-sm border-[#F6A327]/20 animate-scale-in">
                <div className="mb-3 md:mb-4">
                  <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-wide">
                    Специальная цена
                  </span>
                </div>
                <div className="mb-4 md:mb-6">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 text-[#F6A327]">8 150 000 ₽</div>
                  <div className="text-xs md:text-sm text-muted-foreground">с НДС</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleCall} className="flex-1 bg-[#10B981] hover:bg-[#10B981]/90 text-white text-sm md:text-base">
                    <Icon name="Phone" size={18} className="mr-2" />
                    Позвонить
                  </Button>
                  <Button onClick={scrollToForm} className="flex-1 bg-[#F6A327] hover:bg-[#F6A327]/90 text-[#273369] text-sm md:text-base">
                    <Icon name="Send" size={18} className="mr-2" />
                    Оставить заявку
                  </Button>
                </div>
              </Card>
            </div>

            <div className="relative animate-fade-in flex items-center justify-center" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F6A327]/20 to-transparent rounded-2xl blur-3xl" />
              <img 
                src="https://cdn.poehali.dev/files/Вибрик без фона.png" 
                alt="Вибропогружатель электрический крановый Yongan DZJ-90 - оборудование для строительства свайных фундаментов" 
                className="relative w-full max-w-xl h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: 'linear-gradient(135deg, #273369 0%, #272D49 100%)' }}>
        <div className="container mx-auto px-4">
          <a href="https://kgs-ural.ru/catalog/vibropogruzhateli-kranovie/seriya-dzj/yongan-dzj-90/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Характеристики Yongan DZJ-90
            </h2>
          </a>
          <Card className="max-w-4xl mx-auto p-4 md:p-8 bg-card/80 backdrop-blur-sm border-[#F6A327]/10">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 md:gap-y-4">
              {specifications.map((spec, index) => (
                <div key={index} className="flex flex-col md:flex-row md:justify-between md:items-center py-2 md:py-3 border-b border-border/40 last:border-0 gap-1">
                  <span className="text-muted-foreground text-xs md:text-sm">{spec.label}</span>
                  <span className="font-semibold text-foreground text-sm md:text-base">{spec.value}</span>
                </div>
              ))}
            </div>
          </Card>
          <div className="text-center mt-8">
            <a href="https://kgs-ural.ru/catalog/vibropogruzhateli-kranovie/seriya-dzj/yongan-dzj-90/" target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#F6A327] hover:bg-[#F6A327]/90 text-[#273369] font-semibold px-8">
                Подробнее
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section id="contact-form" className="py-16 bg-[#272D49]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Оставьте заявку
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Наши специалисты свяжутся с вами в ближайшее время
            </p>
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-[#F6A327]/10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Ваше имя <span className="text-[#F6A327]">*</span>
                  </label>
                  <Input 
                    placeholder="Иван Иванов" 
                    className="bg-background/50"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Телефон <span className="text-[#F6A327]">*</span>
                  </label>
                  <Input 
                    type="tel" 
                    placeholder="+7 (___) ___-__-__" 
                    className="bg-background/50"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <Input 
                    type="email" 
                    placeholder="example@mail.ru" 
                    className="bg-background/50"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#F6A327] hover:bg-[#F6A327]/90 text-[#273369] font-semibold"
                >
                  <Icon name="Send" size={18} className="mr-2" />
                  {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 bg-[#272D49] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              <a href="https://kgs-ural.ru" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                <img src="https://cdn.poehali.dev/files/KGS_logo_white_yellow.png" alt="KGS" className="h-10 object-contain hover:opacity-80 transition-opacity" style={{minWidth: '100px'}} />
              </a>
              <span className="text-sm text-muted-foreground text-center md:text-left">© 2016-2026 КоперГруппСервис</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <a href="tel:88006007465" className="text-sm hover:text-[#F6A327] transition-colors">
                  8 (800) 600-74-65
                </a>
                <a href="tel:+73433467475" className="text-sm hover:text-[#F6A327] transition-colors">
                  8 (343) 346-74-75
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <a href="https://t.me/kgs_ural" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <Icon name="Send" size={20} className="text-[#229ED9]" />
                </a>
                <a href="https://kgs-ural.ru" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Перейти на сайт KGS-Ural">
                  <Icon name="Globe" size={20} className="text-[#F6A327]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showMobileCallBtn && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 animate-fade-in">
          <Button 
            onClick={handleCall} 
            className="w-full h-14 bg-[#10B981] hover:bg-[#10B981]/90 text-white text-lg font-semibold shadow-2xl"
          >
            <Icon name="Phone" size={24} className="mr-2" />
            Позвонить 8 (800) 600-74-65
          </Button>
        </div>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed z-50 w-12 h-12 bg-[#F6A327] hover:bg-[#F6A327]/90 text-[#273369] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 animate-fade-in ${
            showMobileCallBtn ? 'bottom-20 right-4' : 'bottom-4 right-4'
          }`}
          aria-label="Прокрутить наверх"
        >
          <Icon name="ArrowUp" size={24} />
        </button>
      )}
    </div>
  );
};

export default Index;