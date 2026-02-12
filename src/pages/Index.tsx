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
    email: '',
    consent: false
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
    { label: 'Мощность двигателя, кВ', value: '90', category: 'technical' },
    { label: 'Эксцентриковый момент, кг/м', value: '0-58', category: 'technical' },
    { label: 'Центробежная сила, кН', value: '0-579', category: 'technical' },
    { label: 'Частота, об/мин', value: '0-960', category: 'technical' },
    { label: 'Максимальная амплитуда, мм', value: '11.5', category: 'technical' },
    { label: 'Максимальное натяжение троса, кН', value: '254', category: 'technical' },
    { label: 'Габариты, мм', value: '1850х1300х2500', category: 'dimensions' },
    { label: 'Вес без зажима, кг', value: '5700', category: 'dimensions' },
    { label: 'Сечение кабеля, мм²', value: '50', category: 'technical' },
    { label: 'Зажим', value: 'одинарный/двойной', category: 'equipment' },
    { label: 'Диапазон применения зажима, мм', value: '530-1500', category: 'equipment' },
    { label: 'Мощность генератора, кВ', value: '250', category: 'technical' },
    { label: 'Минимальная грузоподъемность крана, T', value: '50', category: 'requirements' }
  ];

  const advantages = [
    'Прочная грузоподъемная рама',
    'Усиленные пружины для работы в различных грунтовых условиях',
    'Электродвигатель Siemens с внутренней защитой от замыканий и вибрации рассчитан на долгий срок эксплуатации',
    'Редуктора устойчивы к огромной вибрации, которую создают эксцентрики и другие механизмы',
    'Система зажима разработана из литых блоков для предотвращения возможных неприятных проблем',
    'Шкивы и ремни имеют защитную оболочку во избежание повреждений во время работы',
    'Цена до 60% ниже гидравлических вибропогружателей, не уступая в качестве'
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

    try {
      const response = await fetch('https://functions.poehali.dev/858f33e4-bf36-459f-8130-c16cf2b083ca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Заявка отправлена',
          description: 'Мы свяжемся с вами в ближайшее время'
        });
        setFormData({ name: '', phone: '', email: '', consent: false });
      } else {
        toast({
          title: 'Ошибка отправки',
          description: result.error || 'Попробуйте позже',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка сети',
        description: 'Проверьте интернет-соединение',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  Вибропогружатель электрический крановый<br />
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
                    Специальная цена до конца февраля
                  </span>
                </div>
                <div className="mb-4 md:mb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="text-2xl md:text-3xl font-bold text-muted-foreground line-through opacity-50">8 150 000 ₽</div>
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F6A327]">8 000 000 ₽</div>
                  </div>
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
              <a href="https://kgs-ural.ru/catalog/vibropogruzhateli-kranovie/seriya-dzj/yongan-dzj-90/" target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#F6A327]/20 to-transparent rounded-2xl blur-3xl group-hover:blur-2xl transition-all" />
                <img 
                  src="https://cdn.poehali.dev/files/Вибрик без фона.png" 
                  alt="Вибропогружатель в наличии в Екатеринбурге - электрический крановый Yongan DZJ-90" 
                  className="relative w-full max-w-xl h-auto drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
              </a>
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
          <Card className="max-w-5xl mx-auto p-4 md:p-8 bg-card/80 backdrop-blur-sm border-[#F6A327]/10">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#F6A327]">Технические характеристики</h3>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 md:gap-y-3">
                  {specifications.filter(s => s.category === 'technical').map((spec, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:justify-between md:items-center py-2 border-b border-border/20 last:border-0 gap-1">
                      <span className="text-muted-foreground text-xs md:text-sm">{spec.label}</span>
                      <span className="font-semibold text-foreground text-sm md:text-base">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#F6A327]">Габариты и вес</h3>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 md:gap-y-3">
                  {specifications.filter(s => s.category === 'dimensions').map((spec, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:justify-between md:items-center py-2 border-b border-border/20 last:border-0 gap-1">
                      <span className="text-muted-foreground text-xs md:text-sm">{spec.label}</span>
                      <span className="font-semibold text-foreground text-sm md:text-base">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#F6A327]">Комплектация</h3>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 md:gap-y-3">
                  {specifications.filter(s => s.category === 'equipment').map((spec, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:justify-between md:items-center py-2 border-b border-border/20 last:border-0 gap-1">
                      <span className="text-muted-foreground text-xs md:text-sm">{spec.label}</span>
                      <span className="font-semibold text-foreground text-sm md:text-base">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#F6A327]">Требования</h3>
                <div className="space-y-2 md:space-y-3">
                  {specifications.filter(s => s.category === 'requirements').map((spec, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:justify-between md:items-start py-2 border-b border-border/20 last:border-0 gap-1">
                      <span className="text-muted-foreground text-xs md:text-sm">{spec.label}</span>
                      <span className="font-semibold text-foreground text-sm md:text-base md:text-right md:max-w-md">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#F6A327]">Преимущества</h3>
                <ul className="space-y-3">
                  {advantages.map((advantage, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Icon name="CheckCircle2" size={20} className="text-[#10B981] flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/90 text-sm md:text-base leading-relaxed">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
            <p className="text-center text-lg text-muted-foreground mb-8">
              Для получения консультации оставьте заявку — наши специалисты свяжутся с вами в ближайшее время
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
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-border bg-background/50 accent-[#F6A327]"
                    required
                  />
                  <label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed">
                    Я согласен на обработку персональных данных в соответствии с{' '}
                    <a 
                      href="https://kgs-ural.ru/politika-konfidencialnosti/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#F6A327] hover:underline"
                    >
                      политикой конфиденциальности
                    </a>
                  </label>
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting || !formData.consent}
                  className="w-full bg-[#F6A327] hover:bg-[#F6A327]/90 text-[#273369] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between lg:items-center">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              <a href="https://kgs-ural.ru" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                <img src="https://cdn.poehali.dev/files/KGS_logo_white_yellow.png" alt="KGS" className="h-10 object-contain hover:opacity-80 transition-opacity" style={{minWidth: '100px'}} />
              </a>
              <span className="text-sm text-muted-foreground text-center md:text-left">© 2016-2026 КоперГруппСервис</span>
            </div>
            
            <div className="flex items-center gap-3">
              <a href="https://kgs-ural.ru" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center" aria-label="Официальный сайт KGS-Ural">
                <img src="https://cdn.poehali.dev/files/ab89b6d0-e482-4e19-b301-0836a2e5c081.png" alt="Сайт" style={{width: '36px', height: '36px', imageRendering: 'crisp-edges'}} />
              </a>
              <a href="https://t.me/kgs_ural" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center" aria-label="Telegram">
                <img src="https://cdn.poehali.dev/files/1c40a264-c680-489a-bc74-e3172c5be1e8.png" alt="Telegram" style={{width: '36px', height: '36px', imageRendering: 'crisp-edges'}} />
              </a>
              <a href="https://vk.com/club187384782" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center" aria-label="ВКонтакте">
                <img src="https://cdn.poehali.dev/files/76d43b5b-eb24-4809-b159-4ba105761eac.png" alt="ВКонтакте" style={{width: '36px', height: '36px', imageRendering: 'crisp-edges'}} />
              </a>
              <a href="https://rutube.ru/channel/37307143/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center" aria-label="Rutube">
                <img src="https://cdn.poehali.dev/files/4fdf768a-bf39-4b40-8167-95bea08f096c.png" alt="Rutube" style={{width: '36px', height: '36px', imageRendering: 'crisp-edges'}} />
              </a>
              <a href="https://max.ru/id6670440671_biz" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex items-center" aria-label="Макс Мессенджер">
                <img src="https://cdn.poehali.dev/projects/938a0919-e555-433d-8c86-2368777f7c7a/files/10678ff2-64af-4352-87d1-cd568b6a9111.jpg" alt="Макс" style={{width: '36px', height: '36px', imageRendering: 'crisp-edges'}} />
              </a>
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
            </div>
          </div>

          <div className="flex gap-3 justify-center mt-6 pt-4 border-t border-border/40">
            <a href="https://kgs-ural.ru/politika-konfidencialnosti/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-[#F6A327] transition-colors">
              Политика конфиденциальности
            </a>
            <span className="text-xs text-muted-foreground">•</span>
            <a href="https://kgs-ural.ru/cookie/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-[#F6A327] transition-colors">
              Cookie
            </a>
          </div>
        </div>
      </footer>

      <section className="sr-only" aria-hidden="true">
        <h1>Вибропогружатель электрический крановый Yongan DZJ-90 купить в Екатеринбурге</h1>
        <h2>Вибрик 90 кВт в наличии на складе - полная комплектация</h2>
        <p>
          Вибропогружатель электрический крановый Yongan DZJ-90 (Вибропогружатель электрический крановый Yongan Dzj-90, 
          Вибропогружатель электрический крановый Yongan DZJ90) - вибрик 90 купить в Екатеринбурге. 
          ВИБРОПОГРУЖАТЕЛЬ DZJ 90 производства Yongan (вибропогружатель ёнган, вибрик йонган, вибропогружатель yongan dzj-90).
        </p>
        <p>
          Вибропогружатель серии DZJ модель DZJ-90 (вибропогружатель ДЗЖ-90, вибропогружатель DZJ90, вибропогружатель dzj 90, 
          вибрик dzj90, dzj-90, DZJ 90, DZJ-90, вибропогружатель дизиджей 90) - вибропогружатель крановый электрический.
          Вибрик крановый, вибрик yongan, вибропогружатель yongan, вибрик электрический.
        </p>
        <p>
          Технические характеристики: вибропогружатель 90 квт (вибропогружатель 90 кВ), мощность двигателя 90 кВт, 
          эксцентриковый момент 0-58 кг/м, центробежная сила 0-579 кН, частота 0-960 об/мин.
        </p>
        <p>
          Вибропогружатель полная комплектация: вибропогружатель со шкафом управления, вибропогружатель с зажимом 
          (вибропогружатель с нижним зажимом, одинарный/двойной), вибропогружатель с зип (запасные части).
        </p>
        <p>
          Вибропогружатель в наличии на складе в Екатеринбурге (вибропогружатель екатеринбург, купить вибропогружатель екатеринбург).
          Вибропогружатель гарантия 12 месяцев от производителя. Вибропогружатель с доставкой по России и СНГ транспортной компанией.
          Цена вибропогружатель купить: 8 150 000 рублей. Свайный вибратор, крановый вибропогружатель для строительства свайных фундаментов.
        </p>
      </section>

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