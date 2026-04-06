import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import MessengerWidget from '@/components/MessengerWidget';

type EquipmentRow = { n: number; name: string; vin: string; loc: string; year: number | null; hours: string; price: string };
type GroupRow = { group: string };
type Row = EquipmentRow | GroupRow;

const usedEquipment: Row[] = [
  { group: 'Краны гусеничные тяжелые' },
  { n: 1, name: 'Кран гусеничный Sany SCC2000', vin: 'SYCCH200ACCDZ0005', loc: 'г. Владивосток', year: 2022, hours: '11739 м/ч', price: '72 050 000' },
  { n: 2, name: 'Кран гусеничный Sany SCC1800А', vin: 'CC0180CB2767/HYCBC180ACCDZ00004', loc: 'п.г.т. Хасан', year: 2022, hours: '19334 м/ч', price: '53 900 000' },
  { n: 3, name: 'Кран гусеничный Zoomlion ZCC1500', vin: 'ZCC150-0086', loc: 'г. Хабаровск', year: 2023, hours: '8538 м/ч', price: '49 500 000' },
  { n: 4, name: 'Кран гусеничный Sany SCC1350А-5', vin: 'SYCCG135A-5CCDZ01/CC0135CC1313', loc: 'п.г.т. Хасан', year: 2022, hours: '14204 м/ч', price: '45 100 000' },
  { group: 'Автокраны' },
  { n: 5, name: 'Кран самоходный Zoomlion ZRT600', vin: 'ZRT600-0152', loc: 'п.г.т. Хасан', year: 2023, hours: '15020 м/ч', price: '26 400 000' },
  { n: 6, name: 'Автокран Галичанин г/п 25 тн Камаз 6х6', vin: 'Z8C55713TH0000057', loc: 'п.г.т. Хасан', year: 2018, hours: '40980 м/ч', price: '10 450 000' },
  { group: 'Буровые установки' },
  { n: 7, name: 'Роторная буровая установка Zoomlion ZR360L', vin: 'ZR360-617', loc: 'п. Екатериновка', year: 2023, hours: '8820 м/ч', price: '66 000 000' },
  { n: 8, name: 'Роторная буровая установка Zoomlion ZR255D', vin: 'ZR255-123', loc: 'п. Екатериновка', year: 2023, hours: '6765 м/ч', price: '44 000 000' },
  { n: 9, name: 'Роторная буровая установка Zoomlion ZR255D', vin: 'ZR255-073', loc: 'п. Екатериновка', year: 2022, hours: '8524 м/ч', price: '40 700 000' },
  { n: 10, name: 'Роторная буровая установка Sany SR235 с обсадным столом Leffer 1500', vin: 'SR235FCD00528', loc: 'п.г.т. Хасан', year: 2023, hours: '10670 м/ч', price: 'по запросу' },
  { n: 11, name: 'Буровая установка RCD Buma R1820, в комплекте с буровой колонной D1220мм', vin: '1208-092', loc: 'п. Екатериновка', year: 2012, hours: '7768 м/ч', price: '60 500 000' },
  { group: 'Погружное оборудование и иная техника' },
  { n: 12, name: 'Вибропогружатель Ozkanlar SVR 120 NF', vin: '1112-1', loc: 'п. Екатериновка', year: 2017, hours: '4429 м/ч', price: '63 800 000' },
  { n: 13, name: 'Вибропогружатель Ozkanlar SVR 120 NF', vin: 'OZ-AA7121-PP-01', loc: 'п. Екатериновка', year: 2023, hours: '1374 м/ч', price: '71 500 000' },
  { n: 14, name: 'Вибропогружатель Ozkanlar SVR 120 NF', vin: 'OZ-AA7122-PP-01', loc: 'п. Екатериновка', year: 2023, hours: '3430 м/ч', price: '71 500 000' },
  { n: 15, name: 'Вибропогружатель Ozkanlar SVR 101 NF', vin: '', loc: 'п.г.т. Хасан', year: 2018, hours: '3629 м/ч', price: '' },
  { n: 16, name: 'Гидромолот Junttan HHK 15/18A без маслостанции', vin: '2711', loc: 'п. Екатериновка', year: 2004, hours: 'нет', price: '12 100 000' },
  { n: 17, name: 'Гидромолот Junttan HHK 12/14A с маслостанцией CCU15', vin: '6858', loc: 'п. Екатериновка', year: 2005, hours: '', price: '16 500 000' },
  { n: 18, name: 'Гидромолот Junttan HHK10A с маслостанцией JPACK10B', vin: '2296', loc: 'п. Екатериновка', year: 1995, hours: '3664 м/ч', price: '8 910 000' },
  { n: 19, name: 'Дизель молот труб Starke HD62', vin: 'ZC20230611A', loc: 'п. Екатериновка', year: 2023, hours: '', price: '14 850 000' },
  { n: 20, name: 'Дизель молот DELMAG SEMW D62-22', vin: '348567', loc: 'п. Екатериновка', year: 2020, hours: 'нет', price: '14 300 000' },
  { n: 21, name: 'Самоходная роторная дробилка McCloskey I54', vin: 'SA9000KPQ6M066067', loc: 'г. Советская Гавань', year: 2023, hours: '', price: '24 200 000' },
  { n: 22, name: 'Мобильная сортировочная установка NFLG NFS350 (Грохот)', vin: '22NFS350A39', loc: 'г. Советская Гавань', year: 2022, hours: '', price: '24 200 000' },
  { n: 23, name: 'Экскаватор Hyundai R330LC-9S', vin: 'HHKZ905HL0004891', loc: 'п. Екатериновка', year: 2020, hours: '24557 м/ч', price: '8 800 000' },
  { n: 24, name: 'Экскаватор Hyundai R300 с длинной рукой', vin: 'HHKHE859VE0001795', loc: 'п. Екатериновка', year: 2023, hours: '8422 м/ч', price: '11 000 000' },
  { n: 25, name: 'Экскаватор Hyundai R260LC-9S', vin: 'HHKHZ703AE0002237', loc: 'п. Екатериновка', year: 2022, hours: '10801 м/ч', price: '9 900 000' },
  { n: 26, name: 'Экскаватор Hyundai HX220S', vin: 'HHKHK606AE0001467', loc: 'п. Екатериновка', year: 2021, hours: '26023 м/ч', price: '7 150 000' },
  { n: 27, name: 'Бульдозер Shantui SD-16', vin: 'CHSD16AAAM1050744', loc: 'п. Екатериновка', year: 2021, hours: '8929 м/ч', price: '7 700 000' },
  { n: 28, name: 'Фронтальный погрузчик Shantui L39-B3', vin: '86SLA39ANMB004526', loc: 'п. Екатериновка', year: 2021, hours: '16570 м/ч', price: '4 180 000' },
  { n: 29, name: 'Фронтальный погрузчик Shantui L55-B5', vin: '86SLA55ANNB000534', loc: 'п. Екатериновка', year: 2022, hours: '', price: '4 950 000' },
  { group: 'Колесная техника' },
  { n: 30, name: 'Автомобиль Камаз 6х6 (вакуумная ассенизационная машина), 10м3', vin: 'X894665C1N1FF3040', loc: 'г. Хабаровск', year: 2022, hours: '25128 км', price: '5 500 000' },
  { n: 31, name: 'Самоходный бетононасос Scorpion СР-40.321 Р', vin: '710-41', loc: 'г. Хабаровск', year: 2017, hours: '830 м/ч', price: '4 400 000' },
  { n: 32, name: 'Бетононасос Zoomlion модель НВТ80.16.199RSU', vin: '', loc: 'п. Екатериновка', year: null, hours: '', price: '4 950 000' },
  { n: 33, name: 'Автосамосвал Камаз 65222 6х6, 15м3', vin: 'XTC652225N1486547', loc: 'г. Хабаровск', year: 2022, hours: '55166 км', price: '5 500 000' },
  { n: 34, name: 'Автосамосвал Камаз 65222 6х6, 15м3', vin: 'XTC652225N1486449', loc: 'г. Хабаровск', year: 2022, hours: '', price: '5 500 000' },
  { n: 35, name: 'Автосамосвал Shacman SX32586V385, 19,3м3', vin: 'LZGJR4V55PX013620', loc: 'п. Екатериновка', year: 2023, hours: '', price: '7 700 000' },
  { n: 36, name: 'Автосамосвал SINOTRUK HOWO; 0107', vin: 'LZZ5DVSD1NB080072', loc: 'г. Хабаровск', year: 2022, hours: '', price: '4 400 000' },
  { n: 37, name: 'Автосамосвал SINOTRUK HOWO; 0108', vin: 'LZZ5DVSD1NB080069', loc: 'г. Советская Гавань', year: 2022, hours: '', price: '' },
  { n: 38, name: 'Трал низкорамный Juterborg 985245 г/п 50 тн', vin: '', loc: 'г. Санкт-Петербург', year: 2024, hours: '', price: 'по запросу' },
  { n: 39, name: 'Тягач МАЗ 6430C9-520-020 6х4', vin: 'Y3M6430C9L0000943', loc: 'г. Хабаровск', year: 2019, hours: '', price: '3 300 000' },
  { n: 40, name: 'Полуприцеп ТЗА 588521-0000024-10', vin: '', loc: 'г. Советская Гавань', year: null, hours: '', price: 'по запросу' },
  { n: 41, name: 'Автобус вахтовый Камаз Нефаз 6х6, 28+2 мест', vin: 'X1F4208J0P2001983', loc: 'п. Екатериновка', year: 2023, hours: '', price: '7 700 000' },
  { n: 42, name: 'Автобус вахтовый Камаз Нефаз 6х6, 28+2 мест', vin: 'X89422612N0DA8646', loc: 'п.г.т. Хасан', year: 2022, hours: '12434 км', price: '7 700 000' },
  { n: 43, name: 'Автобус вахтовый КАМАЗ НЕФАЗ', vin: 'X89422612K0DA8074', loc: 'г. Хабаровск', year: null, hours: '', price: '7 700 000' },
  { n: 44, name: 'Автобетоносмеситель Камаз 6х4, 9м3', vin: 'X6S5814Z9K0000212', loc: 'п.г.т. Хасан', year: 2019, hours: '52156 км', price: '4 950 000' },
  { n: 45, name: 'Автотопливозаправщик Камаз 6х6, 11м3', vin: 'X895339B9J0FU5025', loc: 'п.г.т. Хасан', year: 2018, hours: '7089 м/ч', price: 'по запросу' },
  { n: 46, name: 'Автоцистерна Камаз 43118-48 6х6 (водовоз), 11м3', vin: 'XVU568746R0000237', loc: 'г. Хабаровск', year: 2024, hours: '39380 км', price: '12 650 000' },
  { n: 47, name: 'Автомобиль Mitsubishi Pajero Sport', vin: '', loc: 'г. Советская Гавань', year: null, hours: '', price: 'по запросу' },
  { group: 'Малая механизация (ДЭС, мачты и прочее)' },
  { n: 48, name: 'ДЭС АД-200-Т400-1PKM5', vin: 'ДГ001220', loc: 'г. Советская Гавань', year: 2021, hours: '14982', price: '' },
  { n: 49, name: 'ДЭС KTС-345GF 250 кВт', vin: '', loc: 'г. Хабаровск', year: 2022, hours: '3041', price: '2 090 000' },
  { n: 50, name: 'ДЭС в кожухе Genmac ROYAL G250IS (275 кВт)', vin: '23651', loc: 'г. Хабаровск', year: 2021, hours: '15740', price: '3 300 000' },
  { n: 51, name: 'ДЭС Stafford 200 кВт TOD-C250LS', vin: '15010354', loc: 'п. Екатериновка', year: 2015, hours: '', price: '1 650 000' },
  { n: 52, name: 'ДЭС Метрикс / КТС-345GF 250 кВт', vin: '2022062202', loc: 'п. Екатериновка', year: 2022, hours: '', price: '1 650 000' },
  { n: 53, name: 'ДЭС MPMC MP635D-S в кожухе 500 кВт Doosan', vin: 'MLI1-11034-01/01', loc: 'г. Советская Гавань', year: null, hours: '', price: '1 650 000' },
  { n: 54, name: 'ДЭС АД-200С-Т400-1РКМ5 200 кВт', vin: 'ДГ001220', loc: 'г. Советская Гавань', year: null, hours: '', price: '1 650 000' },
  { n: 55, name: 'ДЭС ATLAS Copco QES200 200 кВт', vin: 'ESF406544', loc: 'г. Хабаровск', year: 2021, hours: '9169', price: '1 650 000' },
  { n: 56, name: 'ДЭС АД 500С-Т400-1D М17', vin: '2306287', loc: 'г. Хабаровск', year: null, hours: '', price: '1 650 000' },
  { n: 57, name: 'ДЭС GMP275 DKC 200 кВт №626227, 0034', vin: '', loc: 'п.г.т. Хасан', year: null, hours: '', price: '1 650 000' },
  { n: 58, name: 'ДЭС ТСС АД-100С-Т400-1РКМ11', vin: '9383', loc: 'г. Хабаровск', year: null, hours: '', price: '1 650 000' },
  { n: 59, name: 'ДЭС ЭнергоЮнитс EF200E 200кВт', vin: 'EF200E2208061490', loc: 'г. Хабаровск', year: null, hours: '', price: '1 650 000' },
  { n: 60, name: 'ДЭС GENMAC Queen G160IS (140 кВт)', vin: '21461', loc: 'г. Хабаровск', year: 2020, hours: '', price: '1 650 000' },
  { n: 61, name: 'ДЭС GMP 275 DKC в кожухе 200 кВт Doosan', vin: '626235', loc: 'г. Хабаровск', year: 2023, hours: '', price: '1 650 000' },
  { n: 62, name: 'Мачта осветительная KEDASA KLD5000', vin: '221496', loc: 'г. Хабаровск', year: null, hours: '1672 м/ч', price: '1 430 000' },
  { n: 63, name: 'Передвижная осветительная мачта FENIX 4X320W', vin: '231054', loc: 'г. Хабаровск', year: 2023, hours: '947 м/ч', price: '1 430 000' },
  { n: 64, name: 'Передвижная осветительная мачта FENIX 4X320W', vin: '231043', loc: 'г. Хабаровск', year: 2023, hours: '2583 м/ч', price: '1 430 000' },
  { n: 65, name: 'Передвижная осветительная мачта FENIX 4X320W', vin: '231044', loc: 'г. Хабаровск', year: 2023, hours: '2021 м/ч', price: '1 430 000' },
  { n: 66, name: 'Компрессор AIRMAN PDSJ750S', vin: '', loc: 'г. Хабаровск', year: 2022, hours: '', price: '8 800 000' },
  { n: 67, name: 'Парогенератор стационарный STEAMPRESSOR HYBRID модель SH-1', vin: '21', loc: 'п. Екатериновка', year: 2023, hours: '', price: '2 530 000' },
];

const specifications = [
  { label: 'Мощность двигателя, кВт', value: '90', category: 'technical' },
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
  { label: 'Мощность генератора, кВт', value: '250', category: 'technical' },
  { label: 'Минимальная грузоподъемность крана, т', value: '50', category: 'requirements' },
];

const advantages = [
  'Прочная грузоподъемная рама',
  'Усиленные пружины для работы в различных грунтовых условиях',
  'Электродвигатель Siemens с внутренней защитой от замыканий и вибрации',
  'Редуктора устойчивы к огромной вибрации от эксцентриков',
  'Система зажима из литых блоков для надёжной работы',
  'Шкивы и ремни с защитной оболочкой',
  'Цена до 60% ниже гидравлических вибропогружателей',
];

const BACKEND_URL = 'https://functions.poehali.dev/858f33e4-bf36-459f-8130-c16cf2b083ca';

interface ModalFormProps {
  equipment: string;
  onClose: () => void;
}

const ModalForm = ({ equipment, onClose }: ModalFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', consent: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhone = (value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({ title: 'Ошибка', description: 'Заполните все обязательные поля', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, phone: formData.phone, email: formData.email, equipment }),
      });
      const result = await response.json();
      if (response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).ym?.(106468852, 'reachGoal', 'form_submit');
        toast({ title: 'Заявка отправлена', description: 'Мы свяжемся с вами в ближайшее время' });
        onClose();
      } else {
        toast({ title: 'Ошибка отправки', description: result.error || 'Попробуйте позже', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Ошибка сети', description: 'Проверьте интернет-соединение', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <Card className="relative z-10 w-full max-w-md p-6 bg-[#1e2340] border-[#F6A327]/20" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="X" size={20} />
        </button>
        <h3 className="text-lg font-bold mb-1">Оставить заявку</h3>
        <p className="text-sm text-[#F6A327] mb-4 leading-snug">{equipment}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Ваше имя <span className="text-[#F6A327]">*</span></label>
            <Input placeholder="Иван Иванов" className="bg-background/50" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Телефон <span className="text-[#F6A327]">*</span></label>
            <Input type="tel" placeholder="+7 (___) ___-__-__" className="bg-background/50" value={formData.phone} onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })} required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input type="email" placeholder="example@mail.ru" className="bg-background/50" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" id="modal-consent" checked={formData.consent} onChange={e => setFormData({ ...formData, consent: e.target.checked })} className="mt-1 h-4 w-4 rounded border-border bg-background/50 accent-[#F6A327]" required />
            <label htmlFor="modal-consent" className="text-xs text-muted-foreground leading-relaxed">
              Я согласен на обработку персональных данных в соответствии с{' '}
              <a href="https://kgs-ural.ru/politika-konfidencialnosti/" target="_blank" rel="noopener noreferrer" className="text-[#F6A327] hover:underline">политикой конфиденциальности</a>
            </label>
          </div>
          <Button type="submit" disabled={isSubmitting || !formData.consent} className="w-full bg-[#F6A327] hover:bg-[#F6A327]/90 text-[#273369] font-semibold disabled:opacity-50">
            <Icon name="Send" size={16} className="mr-2" />
            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'spec' | 'used'>('spec');
  const [search, setSearch] = useState('');
  const [modalEquipment, setModalEquipment] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', consent: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileCallBtn, setShowMobileCallBtn] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (activeTab === 'used') {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [activeTab]);

  const formatPhone = (value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({ title: 'Ошибка', description: 'Заполните все обязательные поля', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, phone: formData.phone, email: formData.email }),
      });
      const result = await response.json();
      if (response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).ym?.(106468852, 'reachGoal', 'form_submit');
        toast({ title: 'Заявка отправлена', description: 'Мы свяжемся с вами в ближайшее время' });
        setFormData({ name: '', phone: '', email: '', consent: false });
      } else {
        toast({ title: 'Ошибка отправки', description: result.error || 'Попробуйте позже', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Ошибка сети', description: 'Проверьте интернет-соединение', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCall = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ym?.(106468852, 'reachGoal', 'click_call');
    window.location.href = 'tel:88006007465';
  };

  const scrollToForm = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ym?.(106468852, 'reachGoal', 'click_cta');
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const filteredRows = search.trim()
    ? usedEquipment.filter(row => 'name' in row && row.name.toLowerCase().includes(search.toLowerCase()))
    : usedEquipment;

  const equipmentItems = usedEquipment.filter((r): r is EquipmentRow => 'n' in r);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Шапка */}
      <header className="border-b border-border/40 bg-[#272D49] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <a href="https://kgs-ural.ru" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.poehali.dev/files/KGS_logo_white_yellow.png" alt="KGS" className="h-9 md:h-11 object-contain hover:opacity-80 transition-opacity" style={{ minWidth: '100px' }} />
              </a>
              <div className="hidden md:block md:border-l md:border-border/40 md:pl-4">
                <p className="text-sm font-medium text-foreground leading-tight">
                  Производство и поставка оборудования для<br />строительства свайных фундаментов
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-0.5 text-right">
                <a href="tel:88006007465" className="text-xs md:text-sm font-semibold hover:text-[#F6A327] transition-colors">8 (800) 600-74-65</a>
                <a href="tel:+73433467475" className="text-xs md:text-sm font-semibold hover:text-[#F6A327] transition-colors">8 (343) 346-74-75</a>
              </div>
              <a href="https://kgs-ural.ru" target="_blank" rel="noopener noreferrer" aria-label="Сайт KGS">
                <Icon name="Globe" size={22} className="text-[#F6A327]" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Навигационные вкладки — крупные, под шапкой */}
      <div className="flex w-full sticky top-[61px] md:top-[69px] z-40">
        <button
          onClick={() => setActiveTab('spec')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-4 md:py-5 text-base md:text-lg font-bold transition-all border-b-4 ${activeTab === 'spec' ? 'bg-[#F6A327] text-[#273369] border-[#d4861a]' : 'bg-[#c4821a]/80 text-[#273369]/80 border-transparent hover:bg-[#F6A327]/80'}`}
        >
          <Icon name="Star" size={20} />
          <span>Спецпредложение</span>
        </button>
        <button
          onClick={() => setActiveTab('used')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-4 md:py-5 text-base md:text-lg font-bold transition-all border-b-4 ${activeTab === 'used' ? 'bg-[#F6A327] text-[#273369] border-[#d4861a]' : 'bg-[#c4821a]/80 text-[#273369]/80 border-transparent hover:bg-[#F6A327]/80'}`}
        >
          <Icon name="Truck" size={20} />
          <span>Б/у техника от партнёров</span>
        </button>
      </div>

      {/* ===== СПЕЦПРЕДЛОЖЕНИЕ ===== */}
      {activeTab === 'spec' && (
        <main className="flex-1">
          <section className="py-12 md:py-20" style={{ background: 'linear-gradient(135deg, #273369 0%, #272D49 100%)' }}>
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 bg-[#F6A327]/15 border-2 border-[#F6A327]/50 rounded-lg px-5 py-2.5">
                    <Icon name="Star" size={16} className="text-[#F6A327]" />
                    <span className="text-base font-bold text-[#F6A327] uppercase tracking-wider">СПЕЦПРЕДЛОЖЕНИЕ</span>
                  </div>
                  <a href="https://kgs-ural.ru/catalog/vibropogruzhateli-kranovie/seriya-dzj/yongan-dzj-90/" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                      Вибропогружатель электрический крановый<br />
                      <span className="text-[#F6A327]">Yongan DZJ-90</span>
                    </h1>
                  </a>
                  <div className="space-y-2.5">
                    {[
                      { icon: 'MapPin', text: 'В наличии в Екатеринбурге' },
                      { icon: 'Package', text: 'Полная комплектация: шкаф + зажим + ЗИП' },
                      { icon: 'Shield', text: 'Гарантия 12 месяцев' },
                      { icon: 'Truck', text: 'Доставка по России и СНГ' },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F6A327]/10 border border-[#F6A327]/30 flex items-center justify-center flex-shrink-0">
                          <Icon name={f.icon} size={18} className="text-[#F6A327]" />
                        </div>
                        <span className="text-base text-foreground/90">{f.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button onClick={handleCall} className="flex-1 bg-[#10B981] hover:bg-[#10B981]/90 text-white font-semibold">
                      <Icon name="Phone" size={18} className="mr-2" />Позвонить
                    </Button>
                    <Button onClick={scrollToForm} className="flex-1 bg-[#F6A327] hover:bg-[#F6A327]/90 text-[#273369] font-semibold">
                      <Icon name="Send" size={18} className="mr-2" />Оставить заявку
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <a href="https://kgs-ural.ru/catalog/vibropogruzhateli-kranovie/seriya-dzj/yongan-dzj-90/" target="_blank" rel="noopener noreferrer" className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#F6A327]/20 to-transparent rounded-2xl blur-3xl group-hover:blur-2xl transition-all" />
                    <img src="https://cdn.poehali.dev/files/Вибрик без фона.png" alt="Вибропогружатель Yongan DZJ-90" className="relative w-full max-w-md h-auto drop-shadow-2xl group-hover:scale-105 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Характеристики */}
          <section className="py-14 bg-[#1e2340]">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Характеристики Yongan DZJ-90</h2>
              <Card className="max-w-5xl mx-auto p-5 md:p-8 bg-card/80 border-[#F6A327]/10">
                <div className="space-y-7">
                  {[
                    { title: 'Технические характеристики', cat: 'technical' },
                    { title: 'Габариты и вес', cat: 'dimensions' },
                    { title: 'Комплектация', cat: 'equipment' },
                    { title: 'Требования', cat: 'requirements' },
                  ].map(({ title, cat }) => (
                    <div key={cat}>
                      <h3 className="text-lg font-bold mb-3 text-[#F6A327]">{title}</h3>
                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
                        {specifications.filter(s => s.category === cat).map((spec, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-border/15 last:border-0 gap-4">
                            <span className="text-muted-foreground text-sm">{spec.label}</span>
                            <span className="font-semibold text-sm text-right">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-[#F6A327]">Преимущества</h3>
                    <ul className="space-y-2">
                      {advantages.map((adv, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Icon name="CheckCircle2" size={17} className="text-[#10B981] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground/90">{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
              <div className="text-center mt-6">
                <a href="https://kgs-ural.ru/catalog/vibropogruzhateli-kranovie/seriya-dzj/yongan-dzj-90/" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#F6A327] hover:bg-[#F6A327]/90 text-[#273369] font-semibold px-8">
                    <Icon name="ExternalLink" size={16} className="mr-2" />Подробнее на сайте
                  </Button>
                </a>
              </div>
            </div>
          </section>

          {/* Форма */}
          <section id="contact-form" className="py-16 bg-[#272D49]">
            <div className="container mx-auto px-4 max-w-2xl">
              <p className="text-center text-lg text-muted-foreground mb-8">
                Для получения консультации оставьте заявку — наши специалисты свяжутся с вами в ближайшее время
              </p>
              <Card className="p-8 bg-card/80 border-[#F6A327]/10">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ваше имя <span className="text-[#F6A327]">*</span></label>
                    <Input placeholder="Иван Иванов" className="bg-background/50" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Телефон <span className="text-[#F6A327]">*</span></label>
                    <Input type="tel" placeholder="+7 (___) ___-__-__" className="bg-background/50" value={formData.phone} onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="example@mail.ru" className="bg-background/50" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="consent" checked={formData.consent} onChange={e => setFormData({ ...formData, consent: e.target.checked })} className="mt-1 h-4 w-4 rounded border-border bg-background/50 accent-[#F6A327]" required />
                    <label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed">
                      Я согласен на обработку персональных данных в соответствии с{' '}
                      <a href="https://kgs-ural.ru/politika-konfidencialnosti/" target="_blank" rel="noopener noreferrer" className="text-[#F6A327] hover:underline">политикой конфиденциальности</a>
                    </label>
                  </div>
                  <Button type="submit" disabled={isSubmitting || !formData.consent} className="w-full bg-[#F6A327] hover:bg-[#F6A327]/90 text-[#273369] font-semibold disabled:opacity-50">
                    <Icon name="Send" size={18} className="mr-2" />
                    {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                  </Button>
                </form>
              </Card>
            </div>
          </section>
        </main>
      )}

      {/* ===== Б/У ТЕХНИКА ===== */}
      {activeTab === 'used' && (
        <main className="flex-1 flex flex-col bg-[#181c30]">
          {/* Поиск */}
          <div className="bg-[#1e2340] border-b border-border/20 px-4 py-3 sticky top-[122px] md:top-[138px] z-30">
            <div className="container mx-auto max-w-5xl">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    ref={searchRef}
                    placeholder="Поиск по названию..."
                    className="pl-9 bg-background/30 border-border/30"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <Icon name="X" size={14} />
                    </button>
                  )}
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {search ? `${filteredRows.filter(r => 'n' in r).length} из ${equipmentItems.length}` : `${equipmentItems.length} позиций`}
                </span>
              </div>
            </div>
          </div>

          {/* Заголовок таблицы — sticky, отдельно от overflow-x-auto */}
          <div className="sticky top-[175px] md:top-[191px] z-20 bg-[#181c30] overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-[#273369] text-[#F6A327]">
                  <th className="border border-border/20 px-3 py-2.5 text-left font-semibold w-10">№</th>
                  <th className="border border-border/20 px-3 py-2.5 text-left font-semibold">Наименование</th>
                  <th className="border border-border/20 px-3 py-2.5 text-left font-semibold hidden lg:table-cell">VIN</th>
                  <th className="border border-border/20 px-3 py-2.5 text-left font-semibold hidden md:table-cell">Местонахождение</th>
                  <th className="border border-border/20 px-3 py-2.5 text-center font-semibold w-14">Год</th>
                  <th className="border border-border/20 px-3 py-2.5 text-left font-semibold hidden md:table-cell">Наработка</th>
                  <th className="border border-border/20 px-3 py-2.5 text-right font-semibold">Стоимость</th>
                  <th className="border border-border/20 px-3 py-2.5 text-center font-semibold w-24">Заявка</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Таблица */}
          <div className="flex-1 overflow-x-auto">
            <div className="container mx-auto px-2 pb-4">
              <table className="w-full text-sm border-collapse min-w-[750px]">
                <tbody>
                  {filteredRows.map((row, i) => {
                    if ('group' in row) {
                      if (search) return null;
                      return (
                        <tr key={i} className="bg-[#273369]/70">
                          <td colSpan={8} className="border border-border/20 px-3 py-2 font-bold text-[#F6A327] text-xs uppercase tracking-wide">
                            {row.group}
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={i} className="hover:bg-[#273369]/20 transition-colors border-b border-border/10">
                        <td className="border-x border-border/20 px-3 py-2.5 text-muted-foreground text-center text-xs">{row.n}</td>
                        <td className="border-x border-border/20 px-3 py-2.5 font-medium">{row.name}</td>
                        <td className="border-x border-border/20 px-3 py-2.5 text-muted-foreground text-xs font-mono hidden lg:table-cell">{row.vin}</td>
                        <td className="border-x border-border/20 px-3 py-2.5 text-muted-foreground text-xs hidden md:table-cell">{row.loc}</td>
                        <td className="border-x border-border/20 px-3 py-2.5 text-center text-muted-foreground text-xs">{row.year || ''}</td>
                        <td className="border-x border-border/20 px-3 py-2.5 text-muted-foreground text-xs hidden md:table-cell">{row.hours}</td>
                        <td className={`border-x border-border/20 px-3 py-2.5 text-right text-sm font-semibold whitespace-nowrap ${row.price === 'по запросу' ? 'text-muted-foreground italic text-xs' : row.price ? 'text-[#F6A327]' : 'text-muted-foreground'}`}>
                          {row.price ? (row.price === 'по запросу' ? 'по запросу' : `${row.price} ₽`) : '—'}
                        </td>
                        <td className="border-x border-border/20 px-2 py-2 text-center">
                          <Button
                            size="sm"
                            className="bg-[#F6A327] hover:bg-[#F6A327]/90 text-[#273369] text-xs font-semibold h-7 px-2"
                            onClick={() => setModalEquipment(`${row.name}${row.vin ? ` (VIN: ${row.vin})` : ''}`)}
                          >
                            Заявка
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredRows.filter(r => 'n' in r).length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Ничего не найдено по запросу «{search}»</p>
                </div>
              )}
            </div>

            {/* Форма заявки в конце списка */}
            <div className="container mx-auto px-4 py-10 max-w-2xl">
              <p className="text-center text-lg text-muted-foreground mb-6">
                Для получения консультации оставьте заявку — наши специалисты свяжутся с вами в ближайшее время
              </p>
              <Card className="p-8 bg-card/80 border-[#F6A327]/10">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ваше имя <span className="text-[#F6A327]">*</span></label>
                    <Input placeholder="Иван Иванов" className="bg-background/50" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Телефон <span className="text-[#F6A327]">*</span></label>
                    <Input type="tel" placeholder="+7 (___) ___-__-__" className="bg-background/50" value={formData.phone} onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="example@mail.ru" className="bg-background/50" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="used-consent" checked={formData.consent} onChange={e => setFormData({ ...formData, consent: e.target.checked })} className="mt-1 h-4 w-4 rounded border-border bg-background/50 accent-[#F6A327]" required />
                    <label htmlFor="used-consent" className="text-xs text-muted-foreground leading-relaxed">
                      Я согласен на обработку персональных данных в соответствии с{' '}
                      <a href="https://kgs-ural.ru/politika-konfidencialnosti/" target="_blank" rel="noopener noreferrer" className="text-[#F6A327] hover:underline">политикой конфиденциальности</a>
                    </label>
                  </div>
                  <Button type="submit" disabled={isSubmitting || !formData.consent} className="w-full bg-[#F6A327] hover:bg-[#F6A327]/90 text-[#273369] font-semibold disabled:opacity-50">
                    <Icon name="Send" size={18} className="mr-2" />
                    {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-border/40 bg-[#272D49] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between lg:items-center">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              <a href="https://kgs-ural.ru" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn.poehali.dev/files/KGS_logo_white_yellow.png" alt="KGS" className="h-10 object-contain hover:opacity-80 transition-opacity" style={{ minWidth: '100px' }} />
              </a>
              <span className="text-sm text-muted-foreground text-center md:text-left">© 2016-2026 КоперГруппСервис</span>
            </div>
            <div className="flex items-center gap-4">
              {[
                { href: 'https://kgs-ural.ru', src: '/Website.png', alt: 'Сайт' },
                { href: 'https://t.me/kgs_ural', src: '/Telegram.png', alt: 'Telegram' },
                { href: 'https://vk.com/club187384782', src: '/VK.png', alt: 'ВКонтакте' },
                { href: 'https://rutube.ru/channel/37307143/', src: '/Rutube.png', alt: 'Rutube' },
                { href: 'https://max.ru/id6670440671_biz', src: '/MAX.png', alt: 'MAX' },
              ].map(({ href, src, alt }) => (
                <a key={alt} href={href} target="_blank" rel="noopener noreferrer" className="hover:scale-110 hover:rotate-12 hover:shadow-lg transition-all duration-300">
                  <img src={src} alt={alt} style={{ width: '44px', height: '44px' }} />
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-1 text-center md:text-right">
              <a href="tel:88006007465" className="text-sm hover:text-[#F6A327] transition-colors">8 (800) 600-74-65</a>
              <a href="tel:+73433467475" className="text-sm hover:text-[#F6A327] transition-colors">8 (343) 346-74-75</a>
            </div>
          </div>
          <div className="flex gap-3 justify-center mt-6 pt-4 border-t border-border/40">
            <a href="https://kgs-ural.ru/politika-konfidencialnosti/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-[#F6A327] transition-colors">Политика конфиденциальности</a>
            <span className="text-xs text-muted-foreground">•</span>
            <a href="https://kgs-ural.ru/cookie/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-[#F6A327] transition-colors">Cookie</a>
          </div>
        </div>
      </footer>

      <section className="sr-only" aria-hidden="true">
        <h1>Вибропогружатель электрический крановый Yongan DZJ-90 купить в Екатеринбурге</h1>
        <p>Вибропогружатель электрический крановый Yongan DZJ-90 в наличии в Екатеринбурге. Полная комплектация. Гарантия 12 месяцев. Доставка по России и СНГ.</p>
      </section>

      {showMobileCallBtn && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
          <Button onClick={handleCall} className="w-full h-14 bg-[#10B981] hover:bg-[#10B981]/90 text-white text-lg font-semibold shadow-2xl">
            <Icon name="Phone" size={24} className="mr-2" />Позвонить 8 (800) 600-74-65
          </Button>
        </div>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed z-50 w-12 h-12 bg-[#F6A327] hover:bg-[#F6A327]/90 text-[#273369] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${showMobileCallBtn ? 'bottom-20 right-4' : 'bottom-4 right-4'}`}
          aria-label="Прокрутить наверх"
        >
          <Icon name="ArrowUp" size={24} />
        </button>
      )}

      {modalEquipment && (
        <ModalForm equipment={modalEquipment} onClose={() => setModalEquipment(null)} />
      )}

      <MessengerWidget />
    </div>
  );
};

export default Index;