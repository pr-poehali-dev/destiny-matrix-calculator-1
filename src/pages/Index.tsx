import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

// Расчет чисел судьбы
const calculateDestinyMatrix = (day: number, month: number, year: number) => {
  const reduceToSingle = (num: number): number => {
    while (num > 22) {
      num = String(num).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    }
    return num;
  };

  const dayNum = reduceToSingle(day);
  const monthNum = reduceToSingle(month);
  const yearDigits = String(year).split('').map(Number);
  const yearNum = reduceToSingle(yearDigits.reduce((a, b) => a + b, 0));
  
  const lifePathNum = reduceToSingle(day + month + year);
  const personalityNum = reduceToSingle(dayNum + monthNum);
  const soulNum = reduceToSingle(dayNum + yearNum);
  const destinyNum = reduceToSingle(monthNum + yearNum);
  
  return {
    day: dayNum,
    month: monthNum,
    year: yearNum,
    lifePath: lifePathNum,
    personality: personalityNum,
    soul: soulNum,
    destiny: destinyNum,
    center: reduceToSingle(lifePathNum + personalityNum),
  };
};

// Описания арканов
const arcanaDescriptions: Record<number, { title: string; meaning: string; talent: string; color: string }> = {
  1: { title: 'Маг', meaning: 'Энергия начинаний, воля, лидерство', talent: 'Способность воплощать идеи в реальность', color: 'from-red-500 to-orange-500' },
  2: { title: 'Жрица', meaning: 'Интуиция, мудрость, тайные знания', talent: 'Глубокая интуиция и понимание', color: 'from-blue-500 to-cyan-500' },
  3: { title: 'Императрица', meaning: 'Женская сила, творчество, изобилие', talent: 'Творческая реализация и забота', color: 'from-pink-500 to-rose-500' },
  4: { title: 'Император', meaning: 'Структура, стабильность, власть', talent: 'Организаторские способности', color: 'from-purple-500 to-violet-500' },
  5: { title: 'Иерофант', meaning: 'Традиции, обучение, духовность', talent: 'Передача знаний и мудрости', color: 'from-indigo-500 to-blue-500' },
  6: { title: 'Влюбленные', meaning: 'Выбор, гармония, партнерство', talent: 'Умение находить баланс', color: 'from-red-400 to-pink-400' },
  7: { title: 'Колесница', meaning: 'Движение, победа, контроль', talent: 'Целеустремленность и воля', color: 'from-yellow-500 to-amber-500' },
  8: { title: 'Справедливость', meaning: 'Баланс, правда, карма', talent: 'Справедливость и объективность', color: 'from-green-500 to-emerald-500' },
  9: { title: 'Отшельник', meaning: 'Мудрость, поиск истины, одиночество', talent: 'Глубокий внутренний поиск', color: 'from-gray-500 to-slate-500' },
  10: { title: 'Колесо Фортуны', meaning: 'Циклы, удача, перемены', talent: 'Понимание ритмов жизни', color: 'from-purple-400 to-pink-400' },
  11: { title: 'Сила', meaning: 'Внутренняя сила, смелость, страсть', talent: 'Преодоление препятствий', color: 'from-orange-500 to-red-500' },
  12: { title: 'Повешенный', meaning: 'Жертва, новый взгляд, переход', talent: 'Способность видеть иначе', color: 'from-blue-400 to-indigo-400' },
  13: { title: 'Смерть', meaning: 'Трансформация, завершение, обновление', talent: 'Способность к перерождению', color: 'from-black to-gray-700' },
  14: { title: 'Умеренность', meaning: 'Гармония, баланс, терпение', talent: 'Алхимия и трансформация', color: 'from-teal-500 to-cyan-500' },
  15: { title: 'Дьявол', meaning: 'Искушение, материальность, зависимость', talent: 'Понимание теневых сторон', color: 'from-red-600 to-black' },
  16: { title: 'Башня', meaning: 'Разрушение, откровение, освобождение', talent: 'Прорыв через кризис', color: 'from-orange-600 to-red-600' },
  17: { title: 'Звезда', meaning: 'Надежда, вдохновение, исцеление', talent: 'Дар исцеления и вдохновения', color: 'from-blue-300 to-purple-300' },
  18: { title: 'Луна', meaning: 'Подсознание, иллюзии, интуиция', talent: 'Работа с подсознанием', color: 'from-indigo-400 to-purple-500' },
  19: { title: 'Солнце', meaning: 'Радость, успех, ясность', talent: 'Энергия жизни и света', color: 'from-yellow-400 to-orange-400' },
  20: { title: 'Суд', meaning: 'Пробуждение, возрождение, призвание', talent: 'Духовное пробуждение', color: 'from-violet-500 to-purple-600' },
  21: { title: 'Мир', meaning: 'Завершение, целостность, успех', talent: 'Мастерство и завершенность', color: 'from-green-400 to-teal-400' },
  22: { title: 'Шут', meaning: 'Начало пути, спонтанность, свобода', talent: 'Детская непосредственность', color: 'from-rainbow-400 to-rainbow-600' },
};

const Index = () => {
  const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
  const [matrix, setMatrix] = useState<ReturnType<typeof calculateDestinyMatrix> | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');

  const handleCalculate = () => {
    const day = parseInt(birthDate.day);
    const month = parseInt(birthDate.month);
    const year = parseInt(birthDate.year);

    if (day && month && year && day <= 31 && month <= 12 && year > 1900 && year < 2100) {
      const result = calculateDestinyMatrix(day, month, year);
      setMatrix(result);
      setActiveTab('results');
    }
  };

  const getArcanaInfo = (num: number) => arcanaDescriptions[num] || arcanaDescriptions[22];

  return (
    <div className="min-h-screen stars-bg py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 float-animation">
          <h1 className="text-6xl font-bold mb-4 mystic-glow bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Матрица Судьбы
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Раскройте тайны своего предназначения через древнюю науку нумерологии и арканов Таро
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-card/50 backdrop-blur">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-primary/20">
              <Icon name="Calculator" className="mr-2 h-4 w-4" />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!matrix} className="data-[state=active]:bg-primary/20">
              <Icon name="Sparkles" className="mr-2 h-4 w-4" />
              Расшифровка
            </TabsTrigger>
            <TabsTrigger value="years" disabled={!matrix} className="data-[state=active]:bg-primary/20">
              <Icon name="Calendar" className="mr-2 h-4 w-4" />
              Годы
            </TabsTrigger>
            <TabsTrigger value="months" disabled={!matrix} className="data-[state=active]:bg-primary/20">
              <Icon name="CalendarDays" className="mr-2 h-4 w-4" />
              Месяцы
            </TabsTrigger>
            <TabsTrigger value="compatibility" disabled={!matrix} className="data-[state=active]:bg-primary/20">
              <Icon name="Heart" className="mr-2 h-4 w-4" />
              Совместимость
            </TabsTrigger>
          </TabsList>

          {/* Калькулятор */}
          <TabsContent value="calculator">
            <Card className="card-glow bg-card/80 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-3xl">Введите дату рождения</CardTitle>
                <CardDescription>Узнайте свою матрицу судьбы и предназначение</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">День</label>
                    <Input
                      type="number"
                      placeholder="15"
                      min="1"
                      max="31"
                      value={birthDate.day}
                      onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
                      className="bg-input/50 border-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Месяц</label>
                    <Input
                      type="number"
                      placeholder="08"
                      min="1"
                      max="12"
                      value={birthDate.month}
                      onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}
                      className="bg-input/50 border-primary/30 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Год</label>
                    <Input
                      type="number"
                      placeholder="1990"
                      min="1900"
                      max="2100"
                      value={birthDate.year}
                      onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
                      className="bg-input/50 border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCalculate}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg h-12"
                >
                  <Icon name="Wand2" className="mr-2 h-5 w-5" />
                  Рассчитать матрицу
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Результаты */}
          <TabsContent value="results">
            {matrix && (
              <div className="space-y-6">
                {/* Квадрат матрицы */}
                <Card className="card-glow bg-card/80 backdrop-blur border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-3xl">Ваша матрица судьбы</CardTitle>
                    <CardDescription>Квадрат Пифагора с числами вашей судьбы</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative max-w-md mx-auto aspect-square">
                      <div className="absolute inset-0 border-2 border-primary/50 rotate-45 rounded-lg"></div>
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-4 p-8">
                        <div className="col-start-2 flex items-center justify-center">
                          <Badge className={`text-2xl font-bold px-6 py-3 bg-gradient-to-r ${getArcanaInfo(matrix.day).color}`}>
                            {matrix.day}
                          </Badge>
                        </div>
                        <div></div>
                        <div></div>
                        <div className="flex items-center justify-center">
                          <Badge className={`text-2xl font-bold px-6 py-3 bg-gradient-to-r ${getArcanaInfo(matrix.month).color}`}>
                            {matrix.month}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-center">
                          <Badge className={`text-3xl font-bold px-8 py-4 bg-gradient-to-r ${getArcanaInfo(matrix.center).color} mystic-glow`}>
                            {matrix.center}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-center">
                          <Badge className={`text-2xl font-bold px-6 py-3 bg-gradient-to-r ${getArcanaInfo(matrix.year).color}`}>
                            {matrix.year}
                          </Badge>
                        </div>
                        <div></div>
                        <div></div>
                        <div className="col-start-2 flex items-center justify-center">
                          <Badge className={`text-2xl font-bold px-6 py-3 bg-gradient-to-r ${getArcanaInfo(matrix.lifePath).color}`}>
                            {matrix.lifePath}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ключевые характеристики */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="card-glow bg-card/80 backdrop-blur border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="Target" className="h-5 w-5 text-primary" />
                        Число Жизненного Пути
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Badge className={`text-4xl font-bold px-6 py-3 bg-gradient-to-r ${getArcanaInfo(matrix.lifePath).color}`}>
                          {matrix.lifePath}
                        </Badge>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{getArcanaInfo(matrix.lifePath).title}</h4>
                          <p className="text-muted-foreground text-sm">{getArcanaInfo(matrix.lifePath).meaning}</p>
                          <p className="text-accent text-sm mt-2">✨ {getArcanaInfo(matrix.lifePath).talent}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-glow bg-card/80 backdrop-blur border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="User" className="h-5 w-5 text-primary" />
                        Число Личности
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Badge className={`text-4xl font-bold px-6 py-3 bg-gradient-to-r ${getArcanaInfo(matrix.personality).color}`}>
                          {matrix.personality}
                        </Badge>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{getArcanaInfo(matrix.personality).title}</h4>
                          <p className="text-muted-foreground text-sm">{getArcanaInfo(matrix.personality).meaning}</p>
                          <p className="text-accent text-sm mt-2">✨ {getArcanaInfo(matrix.personality).talent}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-glow bg-card/80 backdrop-blur border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="Heart" className="h-5 w-5 text-primary" />
                        Число Души
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Badge className={`text-4xl font-bold px-6 py-3 bg-gradient-to-r ${getArcanaInfo(matrix.soul).color}`}>
                          {matrix.soul}
                        </Badge>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{getArcanaInfo(matrix.soul).title}</h4>
                          <p className="text-muted-foreground text-sm">{getArcanaInfo(matrix.soul).meaning}</p>
                          <p className="text-accent text-sm mt-2">✨ {getArcanaInfo(matrix.soul).talent}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-glow bg-card/80 backdrop-blur border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="Star" className="h-5 w-5 text-primary" />
                        Число Судьбы
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Badge className={`text-4xl font-bold px-6 py-3 bg-gradient-to-r ${getArcanaInfo(matrix.destiny).color}`}>
                          {matrix.destiny}
                        </Badge>
                        <div>
                          <h4 className="font-bold text-lg mb-1">{getArcanaInfo(matrix.destiny).title}</h4>
                          <p className="text-muted-foreground text-sm">{getArcanaInfo(matrix.destiny).meaning}</p>
                          <p className="text-accent text-sm mt-2">✨ {getArcanaInfo(matrix.destiny).talent}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Прогноз по годам */}
          <TabsContent value="years">
            {matrix && (
              <Card className="card-glow bg-card/80 backdrop-blur border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl">Прогностика по годам</CardTitle>
                  <CardDescription>Энергия предстоящих лет вашей жизни</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[2024, 2025, 2026, 2027, 2028].map((year) => {
                      const yearEnergy = (matrix.lifePath + (year % 100)) % 22 || 22;
                      const info = getArcanaInfo(yearEnergy);
                      return (
                        <div key={year} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <Badge className={`text-2xl font-bold px-5 py-2 bg-gradient-to-r ${info.color}`}>
                            {yearEnergy}
                          </Badge>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-lg">{year}</h4>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-primary">{info.title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{info.meaning}</p>
                          </div>
                          <Icon name="ChevronRight" className="h-5 w-5 text-muted-foreground" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Прогноз по месяцам */}
          <TabsContent value="months">
            {matrix && (
              <Card className="card-glow bg-card/80 backdrop-blur border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl">Прогностика по месяцам 2025</CardTitle>
                  <CardDescription>Энергии каждого месяца текущего года</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'].map((month, idx) => {
                      const monthEnergy = (matrix.lifePath + idx + 1) % 22 || 22;
                      const info = getArcanaInfo(monthEnergy);
                      return (
                        <div key={month} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <Badge className={`text-xl font-bold px-4 py-1 bg-gradient-to-r ${info.color}`}>
                            {monthEnergy}
                          </Badge>
                          <div className="flex-1">
                            <h4 className="font-bold">{month}</h4>
                            <p className="text-xs text-muted-foreground">{info.title}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Совместимость */}
          <TabsContent value="compatibility">
            {matrix && (
              <Card className="card-glow bg-card/80 backdrop-blur border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl">Анализ совместимости</CardTitle>
                  <CardDescription>Введите дату рождения партнера для расчета</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Icon name="Heart" className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                    <p className="text-muted-foreground">
                      Функция анализа совместимости будет доступна в следующей версии
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
