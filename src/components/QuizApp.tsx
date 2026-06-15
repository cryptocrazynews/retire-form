import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  RefreshCw, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  AlertTriangle,
  Zap,
  Twitter,
  Copy,
  ExternalLink,
  ShieldCheck,
  Coins,
  Headphones,
  Sparkles
} from 'lucide-react';

// --- TARGET URL ---
const TARGET_URL = "https://asduoin.com/common/app_tg.html?utm_source=tg";

// --- QUESTION DATA ---
interface Option {
  id: string;
  label: string;
  subtext?: string;
  points: number; // 1 = minimal gap, 4 = huge gap
}

interface Question {
  id: number;
  question: string;
  situation: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "早晨 8 点闹钟狂响时，你脑中浮现的第一个念头通常是？",
    situation: "周一早晨的灵魂拷问",
    options: [
      { id: 'A', label: "「再撑几年就拿养老金自由了！打工赚钱我骄傲。」", subtext: "有既定退休目标，按部就班", points: 2 },
      { id: 'B', label: "「好想中彩票头奖，立刻把辞职信甩在老板脸上！」", subtext: "满脑子想提前退休，但缺乏实际行动", points: 3 },
      { id: 'C', label: "「上班真有趣！我热爱我的工作，根本没想过退休。」", subtext: "事业狂或极度幸运儿，不需要退休", points: 1 },
      { id: 'D', label: "「算了一下银行卡余额，默默叹气爬起来穿衣服……」", subtext: "手停口就停，连生病都不敢请假", points: 4 },
    ]
  },
  {
    id: 2,
    question: "和朋友去吃早午餐，看到菜单上一份「牛油果水波蛋吐司」售价 88 元，你的反应是？",
    situation: "消费防御力测试",
    options: [
      { id: 'A', label: "「点！毫不犹豫再加杯 35 元的拿铁，钱只是变成了喜欢的样子。」", subtext: "及时行乐派，未来退休开销需求极大", points: 4 },
      { id: 'B', label: "「辛苦工作一周，周末吃顿好的犒劳自己很合理吧。」", subtext: "标准小确幸，容易忽略隐形开销", points: 3 },
      { id: 'C', label: "「88元？自己去超市买牛油果和蛋做成本不到 15 块，点最便宜的。」", subtext: "性价比至上，自带物欲控制结界", points: 2 },
      { id: 'D', label: "「默默打开记账 App，确认这个月的伙食费额度还有没有剩。」", subtext: "纪律严明或现金流极度紧绷", points: 1 },
    ]
  },
  {
    id: 3,
    question: "每个月发工资后，你的收入大概都是怎么分配的？",
    situation: "现金流去向检视",
    options: [
      { id: 'A', label: "「月初富豪，月底吃土。存钱是什么？能吃吗？」", subtext: "纯粹的月光族，抗风险能力极低", points: 4 },
      { id: 'B', label: "「超过 60% 都在还房贷、车贷或养家，根本存不下什么钱。」", subtext: "重担压肩，资产流动性低", points: 3 },
      { id: 'C', label: "「随缘存钱法，扣掉房租和生活费，卡里剩多少就算存多少。」", subtext: "缺乏系统规划，退休进度全看运气", points: 2 },
      { id: 'D', label: "「铁血纪律！发工资当天自动扣款 30% 拿去投资或定投。」", subtext: "稳健积累中，做时间的朋友", points: 1 },
    ]
  },
  {
    id: 4,
    question: "想象一下你理想中的 65 岁退休生活，画面长什么样子？",
    situation: "未来养老粮草预估",
    options: [
      { id: 'A', label: "「每年飞两次欧洲，住五星酒店，每天打高尔夫、做SPA！」", subtext: "富豪级退休生活（每月开销预估 > 3万元）", points: 4 },
      { id: 'B', label: "「在郊区买个小院子种花养猫，跟老友喝茶，偶尔国内旅游。」", subtext: "中产舒适型（每月开销预估大概 1.2万元）", points: 3 },
      { id: 'C', label: "「继续做点轻松的兼职或顾问，保持社会接触，不想完全闲着。」", subtext: "半退休状态，有持续性被动/兼职收入", points: 2 },
      { id: 'D', label: "「不敢想……只要没生大病、不用看人脸色、有空调吹就行。」", subtext: "低欲望生存型（每月开销预估大概 5000元）", points: 1 },
    ]
  },
  {
    id: 5,
    question: "当听到身边的人狂热讨论「美股」、「ETF」、「比特币」或「指数交易」时，你的状态是？",
    situation: "投资理财观念大会考",
    options: [
      { id: 'A', label: "「曾经跟风乱买被当韭菜割过，现在看到 K 线图就胃痛。」", subtext: "一朝被蛇咬，只敢放银行被通胀侵蚀", points: 4 },
      { id: 'B', label: "「听不懂也不想碰，我觉得投资像赌博，存定期最安全。」", subtext: "极度保守派，资产跑赢通胀难度高", points: 3 },
      { id: 'C', label: "「只买宽基大盘或红利 ETF，设定定期定额后就去睡觉。」", subtext: "聪明懒人投资法，享受市场红利", points: 2 },
      { id: 'D', label: "「我都有布局！懂得借助工具做趋势交易，自认理财达人。」", subtext: "积极主动，有机会大幅缩短退休时程", points: 1 },
    ]
  },
  {
    id: 6,
    question: "万一明天突然生病或遇到意外，需要立刻拿出一笔 5 万元的紧急支出，你……？",
    situation: "财务安全气囊压力测试",
    options: [
      { id: 'A', label: "「5万？！我连拿出 5000 块都有困难，直接原地破产……」", subtext: "财务防御力 F 级，走钢丝的人生", points: 4 },
      { id: 'B', label: "「可能得刷信用卡分期，或者厚着脸皮找家里人借。」", subtext: "财务防御力 C 级，高度依赖外部救援", points: 3 },
      { id: 'C', label: "「挤一下拿得出来，不过要提前支取定期或忍痛卖掉一些股票。」", subtext: "财务防御力 A 级，但略伤长期资产", points: 2 },
      { id: 'D', label: "「完全没问题，我的紧急预备金账户随时躺着半年的生活费。」", subtext: "财务防御力 S 级，心如止水", points: 1 },
    ]
  },
  {
    id: 7,
    question: "最后一题！你觉得自己目前离「财务自由、随时能把老板开除」的终极梦想，完成度大概是多少？",
    situation: "直面现实的最后一击",
    options: [
      { id: 'A', label: "「0%！我就是天选的终极打工人，准备活到老、干到老 😭」", subtext: "完全放弃治疗", points: 4 },
      { id: 'B', label: "「不到 20%……每天都在被钱追着跑，退休比登月还远。」", subtext: "焦虑感破表", points: 3 },
      { id: 'C', label: "「大概 50% 吧，革命尚未成功，同志仍须努力。」", subtext: "稳步前进中", points: 2 },
      { id: 'D', label: "「80% 以上！万事俱备，只差挑个黄道吉日宣布退休。」", subtext: "准退休贵族", points: 1 },
    ]
  }
];

// --- RESULT DATA DEFINITIONS ---
interface ResultProfile {
  title: string;
  subtitle: string;
  badge: string;
  gapAmount: number; // For slider interactive base
  gapText: string;
  difficulty: string;
  projectedRetireAge: number;
  xShareText: string;
  diagnosis: string;
  prescription: string[];
}

const RESULTS: Record<string, ResultProfile> = {
  VERSAILLES: {
    title: "直接躺平 VIP：财富自由的凡尔赛大师",
    subtitle: "你的账户里根本没有缺口，只有溢出来的自由。",
    badge: "天选之子",
    gapAmount: 0,
    gapText: "¥ 0 元",
    difficulty: "轻松躺赢",
    projectedRetireAge: 45,
    xShareText: "实测发现我的退休缺口是 0 元！被认证为『财富自由的凡尔赛大师』🎯 30秒残酷实测，看看你离退休还差多少？",
    diagnosis: "你拥有超凡的财务纪律与极佳的资产配置观念。紧急预备金充足，投资稳健，对生活物欲有着极高的掌控力。上班对你来说只是打发时间或保持社会脱敏的消遣。",
    prescription: [
      "持续优化资产配置，借助白鲸 App 探索全球核心资产。",
      "留意通胀对现金购买力的长期侵蚀，保持合理的投资成长率（约 5-6% 即可）。",
      "开启人生第二曲线或公益探索，享受真正的精神与财富双重自由。"
    ]
  },
  CHILL: {
    title: "准退休贵族：离沙滩海浪只差最后一步",
    subtitle: "破局在即，再积累最后一桶金就能奔向自由大海。",
    badge: "前途光明",
    gapAmount: 1500000,
    gapText: "约 ¥ 150 万",
    difficulty: "普通难度",
    projectedRetireAge: 58,
    xShareText: "我的退休缺口还差 150 万！被诊断为『准退休贵族』🎯 再加把劲就能提前去海边度假了！30秒真实测算，算算你离退休还有多远！",
    diagnosis: "你的理财基础相当不错，已经建立起初步的被动收入或稳健的储蓄习惯。面对突发状况有一定抵御能力，但距离心中完美、毫无顾忌的退休生活蓝图，还差最后几年的复利雪球滚动。",
    prescription: [
      "借助白鲸 App 的一站式指数交易，轻松捕捉确定性高的市场轮动红利。",
      "定期检视手边的保单与隐形开销，将多余的闲置资金转化为能生息的资产。",
      "建立纪律化交易策略，提早 3-5 年达成完全退休目标。"
    ]
  },
  LATTE: {
    title: "精致穷病友：钱没消失，只是变成了好看的样子",
    subtitle: "追求当下的高质感，却让未来的养老金账户连连告急。",
    badge: "警钟敲响",
    gapAmount: 3800000,
    gapText: "约 ¥ 380 万",
    difficulty: "进阶挑战",
    projectedRetireAge: 68,
    xShareText: "崩溃！被诊断为『精致穷病友』🎯 退休缺口高达 380 万 💸 戒掉打车和早午餐还来得及吗？快来测你的真实退休缺口！",
    diagnosis: "你在职场上表现不俗，收入中等偏上，但患有严重的『精致穷』倾向。对一杯几十块的咖啡或昂贵的餐厅毫无抵抗力，导致每个月结余少得可怜，资产积累速度远远赶不上老化的速度。",
    prescription: [
      "奉行『先储蓄/投资，后消费』的铁律！每月发工资当天强制转出 20% 到独立投资账户。",
      "借助白鲸 App 开启低门槛的指数定投，把早午餐的钱转变成未来的自由雪球。",
      "建立紧急预备金，避免意外发生时被迫中断现有的生活水准。"
    ]
  },
  HAMSTER: {
    title: "终极打工人：在工位上发光发热到 75 岁",
    subtitle: "一觉醒来又在去上班的路上，退休对你来说是都市传说。",
    badge: "压力山大",
    gapAmount: 6500000,
    gapText: "约 ¥ 650 万",
    difficulty: "地狱模式",
    projectedRetireAge: 75,
    xShareText: "泪奔……我的退休缺口高达 650 万，获颁『终极打工人』称号 🎯 感觉得在工位干到 75 岁，谁来救救我！快来测测你是不是同道中人！",
    diagnosis: "你深受沉重的房贷、车贷或家庭开销所困，每天像在滚轮上狂奔的仓鼠，不敢停下脚步。对于投资理财充满恐惧或毫无概念，大部分资产要么锁在自住房屋，要么放在利息微薄的银行活期。",
    prescription: [
      "打破『只有有钱才能投资』的迷思！白鲸 App 支持便捷出入金，门槛极低，从今天开始迈出第一步。",
      "积极提升职场核心技能或寻找副业变现机会，突破目前的收入天花板。",
      "寻求专业的资产负债整合建议，降低不必要的高利息负债。"
    ]
  },
  JELLYFISH: {
    title: "财务急诊室常客：下个月工资是唯一的救生圈",
    subtitle: "卡里清澈见底，没有任何财务缓冲带，每天都在为生存而战。",
    badge: "红色预警",
    gapAmount: 9800000,
    gapText: "破 ¥ 900 万",
    difficulty: "极限生存",
    projectedRetireAge: 82, 
    xShareText: "🚨 紧急呼救！我的退休缺口直接破表，被认证为『财务急诊室常客』💀 只能干到老活到老了…… 30秒测出你的财务健康度，心脏够大再点！",
    diagnosis: "你的财务状况处于极度危险的红色警戒状态！没有任何紧急预备金，完全是『手停口就停』。可能习惯性超支或背负坏账，面对未来的退休生活完全不敢想象，每天都在走钢丝。",
    prescription: [
      "【紧急止血】立刻停止任何分期付款与非必要开销，剪掉或冻结会让你过度消费的额度！",
      "【强行储蓄】无论赚多赚少，每个月硬性存下 500 ~ 1000 元作为保命紧急预备金。",
      "【建立防线】当预备金满 3 个月后，通过白鲸 App 等专业一站式工具进行稳健的指数布局，让系统帮你克服人性弱点。"
    ]
  }
};

export default function QuizApp() {
  // App Steps: 'hero' | 'quiz' | 'calculating' | 'result'
  const [step, setStep] = useState<'hero' | 'quiz' | 'calculating' | 'result'>('hero');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  
  // Quiz active question
  const q = QUESTIONS[currentQuestionIdx];

  // Calculation processing
  const [calcStep, setCalcStep] = useState(0);
  const calcMessages = [
    "扫描账户真实余额中……",
    "调阅近一年外卖与消费账单……",
    "计算通胀对购买力的吞噬速率……",
    "分析老年医疗与基础生活开销……",
    "匹配白鲸智能交易破局模型……"
  ];

  // Result matching
  const [resultKey, setResultKey] = useState<string>('LATTE');
  const resultData = RESULTS[resultKey];

  // Interactive Bonus Slider states
  const [extraSave, setExtraSave] = useState<number>(2000); // Monthly extra saving
  const [extraReturn, setExtraReturn] = useState<number>(5); // Extra annual return %
  const [adjustedGap, setAdjustedGap] = useState<number>(0);
  const [yearsSaved, setYearsSaved] = useState<number>(0);

  // Trigger Quiz Start
  const handleStart = () => {
    setCurrentQuestionIdx(0);
    setAnswers([]);
    setStep('quiz');
  };

  // Select Option
  const handleOptionSelect = (points: number) => {
    const nextAnswers = [...answers, points];
    setAnswers(nextAnswers);

    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      processAnswers(nextAnswers);
      setStep('calculating');
    }
  };

  // Process and determine Result
  const processAnswers = (finalAnswers: number[]) => {
    const totalPoints = finalAnswers.reduce((sum, p) => sum + p, 0);
    if (totalPoints <= 10) {
      setResultKey('VERSAILLES');
    } else if (totalPoints <= 15) {
      setResultKey('CHILL');
    } else if (totalPoints <= 20) {
      setResultKey('LATTE');
    } else if (totalPoints <= 25) {
      setResultKey('HAMSTER');
    } else {
      setResultKey('JELLYFISH');
    }
  };

  // Calculating effect
  useEffect(() => {
    if (step === 'calculating') {
      const interval = setInterval(() => {
        setCalcStep(prev => {
          if (prev < calcMessages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setStep('result');
            setTimeout(() => {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff6600', '#ff8a4c', '#ffd6bb', '#ffffff']
              });
            }, 200);
            return prev;
          }
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Update Adjusted Gap
  useEffect(() => {
    if (!resultData) return;
    const baseGap = resultData.gapAmount;
    if (baseGap === 0) {
      setAdjustedGap(0);
      setYearsSaved(0);
      return;
    }

    const reductionFromSave = extraSave * 12 * 15 * 1.35; // Rough compound effect over 15 yrs
    const reductionFromReturn = baseGap * (extraReturn * 0.08);
    const totalReduction = reductionFromSave + reductionFromReturn;

    const newGap = Math.max(0, baseGap - totalReduction);
    setAdjustedGap(Math.round(newGap / 10000) * 10000);

    const reducedPercent = Math.min(1, totalReduction / baseGap);
    const potentialYears = Math.round(reducedPercent * 12);
    setYearsSaved(potentialYears);
  }, [extraSave, extraReturn, resultData]);

  // Share to Twitter / X
  const handleXShare = () => {
    if (!resultData) return;
    const shareUrl = window.location.href;
    const text = encodeURIComponent(`${resultData.xShareText}\n\n👉 立即测算：${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  // Copy share text
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!resultData) return;
    const shareUrl = window.location.href;
    const text = `${resultData.xShareText}\n👉 立即测算：${shareUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-16 flex-1 flex flex-col justify-center items-center">
      {/* ======================================================== */}
      {/* 1. HERO ENTRY PAGE */}
      {/* ======================================================== */}
      {step === 'hero' && (
        <section className="w-full max-w-3xl flex flex-col items-center text-center animate-fadeIn my-auto">
          
          {/* Brand Collab Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-xs font-bold mb-8">
            <Coins className="w-4 h-4" />
            <span>白鲸 BaiJing App 特约 · 2026 独家财务自测</span>
          </div>

          {/* Clean Editorial Provocative Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.2] text-white mb-6">
            你以为 <span className="text-primary-500 underline decoration-primary-500/40 decoration-wavy">65 岁</span>能顺利退休，但查完余额……你确定不是在开玩笑？
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-10 max-w-2xl font-normal">
            7 道直击打工人痛点的真实自测，只需 30 秒，精准诊断你的<strong className="text-white font-semibold">真实退休缺口</strong>，并获取白鲸独家定制破局指南。
          </p>

          {/* CTA Button */}
          <button
            onClick={handleStart}
            className="w-full sm:w-auto min-w-[280px] px-8 py-5 rounded-2xl bg-primary-500 hover:bg-primary-600 active:scale-98 text-white font-black text-lg sm:text-xl transition-all shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <Zap className="w-6 h-6 fill-white" />
            <span>开始测算我的退休缺口</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Real user hint */}
          <div className="mt-16 pt-8 border-t border-border w-full grid grid-cols-2 sm:grid-cols-3 gap-6 text-left text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              <span><strong>38,421+</strong> 人已测算</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              <span><strong>5 大</strong> 专属人格标签</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-2.5 text-primary-400 font-semibold">
              <span>🎁 注册最高领 50% 赠金</span>
            </div>
          </div>

        </section>
      )}

      {/* ======================================================== */}
      {/* 2. INTERACTIVE QUIZ PAGE */}
      {/* ======================================================== */}
      {step === 'quiz' && q && (
        <section className="w-full max-w-2xl flex flex-col my-auto animate-fadeIn">
          
          {/* Top minimal progress */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3 font-medium">
            <span>{q.situation}</span>
            <span className="font-mono">
              <strong className="text-primary-500 font-bold">{currentQuestionIdx + 1}</strong> / {QUESTIONS.length}
            </span>
          </div>

          <div className="w-full h-2 bg-surface rounded-full overflow-hidden mb-8 border border-border p-0.5">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-300 ease-out shadow-sm shadow-primary-500/50"
              style={{ width: `${((currentQuestionIdx + 1) / QUESTIONS.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Box */}
          <div className="mb-8 bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug tracking-tight">
              {q.question}
            </h2>
          </div>

          {/* Clean Options */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {q.options.map((opt, idx) => {
              const letters = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt.points)}
                  className="w-full text-left p-5 sm:p-6 rounded-2xl bg-surface hover:bg-surface-hover border border-border hover:border-primary-500/50 transition-all flex items-start gap-4 group cursor-pointer active:scale-[0.99] shadow-sm hover:shadow-md"
                >
                  <span className="w-9 h-9 rounded-xl bg-card group-hover:bg-primary-500 group-hover:text-white text-slate-400 font-mono font-black flex items-center justify-center flex-shrink-0 transition-colors text-sm sm:text-base mt-0.5 shadow-inner">
                    {letters[idx]}
                  </span>
                  <div className="flex flex-col justify-center">
                    <span className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-white transition-colors leading-relaxed">
                      {opt.label}
                    </span>
                    {opt.subtext && (
                      <span className="text-xs text-slate-500 mt-1">
                        💡 {opt.subtext}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </section>
      )}

      {/* ======================================================== */}
      {/* 3. CALCULATING OVERLAY */}
      {/* ======================================================== */}
      {step === 'calculating' && (
        <section className="w-full max-w-md my-auto flex flex-col items-center justify-center text-center p-8 animate-fadeIn">
          
          <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-surface border-t-primary-500 animate-spin"></div>
            <img src="/logo.png" alt="白鲸 App" className="w-12 h-12 rounded-xl object-cover animate-pulse" />
          </div>

          <h2 className="text-xl font-bold text-white mb-3 tracking-tight">
            正在生成你的退休诊断报告……
          </h2>
          
          <div className="h-8 flex items-center justify-center">
            <p className="text-primary-500 text-xs sm:text-sm font-semibold animate-pulse">
              ⚡ {calcMessages[calcStep]}
            </p>
          </div>

          <div className="w-full bg-surface h-1.5 rounded-full mt-6 overflow-hidden border border-border">
            <div 
              className="bg-primary-500 h-full transition-all duration-300"
              style={{ width: `${((calcStep + 1) / calcMessages.length) * 100}%` }}
            ></div>
          </div>

        </section>
      )}

      {/* ======================================================== */}
      {/* 4. RESULT PAGE (Clean, Fintech Professional Style) */}
      {/* ======================================================== */}
      {step === 'result' && resultData && (
        <section className="w-full max-w-4xl flex flex-col animate-fadeIn my-auto">
          
          {/* Top utility actions */}
          <div className="w-full flex items-center justify-between mb-6">
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer bg-surface px-4 py-2 rounded-xl border border-border shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>重新测算</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleXShare}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#1DA1F2] hover:bg-[#1a8cd8] px-4 py-2 rounded-xl transition-all shadow-md shadow-[#1DA1F2]/20 cursor-pointer"
              >
                <Twitter className="w-3.5 h-3.5 fill-current" />
                <span>一键分享至 X</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 bg-surface hover:bg-surface-hover px-4 py-2 rounded-xl border border-border transition-all cursor-pointer shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? '复制成功！' : '复制文案'}</span>
              </button>
            </div>
          </div>

          {/* Main Professional Result Card */}
          <div className="w-full bg-surface border-2 border-border rounded-[2.5rem] p-6 sm:p-10 shadow-2xl mb-10 relative overflow-hidden">
            
            {/* Minimal Background corner decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-bl-full pointer-events-none blur-xl"></div>

            <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-8 border-b border-border">
              
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 border border-primary-500/20 text-xs font-bold w-fit">
                  <Award className="w-3.5 h-3.5" />
                  <span>专属退休人格标签</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {resultData.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-400 mt-1 font-medium">
                  {resultData.subtitle}
                </p>
              </div>

              {/* Big Data Callout */}
              <div className="bg-card border border-border p-6 rounded-3xl flex flex-col min-w-[220px] flex-shrink-0 shadow-inner">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">测算退休缺口金额</span>
                <span className="text-3xl sm:text-4xl font-black text-primary-500 tracking-tight font-mono">
                  {resultData.gapText}
                </span>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/80 text-xs text-slate-400 font-medium">
                  <span>生存难度：</span>
                  <span className="text-white font-bold">{resultData.difficulty}</span>
                </div>
              </div>

            </div>

            {/* Diagnosis & Action Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              
              {/* Reality Analysis */}
              <div className="bg-card/50 border border-border rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-200 font-extrabold text-sm mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>现实剖析</span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                    {resultData.diagnosis}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>照现状预期退休年龄：</span>
                  <span className="text-base font-black text-white font-mono">
                    {resultData.projectedRetireAge > 80 ? '一辈子打工 💀' : `${resultData.projectedRetireAge} 岁`}
                  </span>
                </div>
              </div>

              {/* Action Plan */}
              <div className="bg-card/50 border border-border rounded-2xl p-6">
                <div className="flex items-center gap-2 text-slate-200 font-extrabold text-sm mb-3">
                  <TrendingUp className="w-4 h-4 text-primary-500" />
                  <span>白鲸专属破局指南</span>
                </div>
                <ul className="space-y-3">
                  {resultData.prescription.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      <span className="w-5 h-5 rounded bg-primary-500/10 text-primary-500 border border-primary-500/20 flex items-center justify-center flex-shrink-0 font-mono text-[10px] font-black mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          {/* ======================================================== */}
          {/* INTERACTIVE BONUS SLIDER */}
          {/* ======================================================== */}
          <div className="w-full bg-surface border border-border rounded-3xl p-6 sm:p-8 mb-10 shadow-xl">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-black">
                  🛠️
                </div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  推演未来：如果借助白鲸 App 开启定投，能扭转多少缺口？
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">拖拉滑杆即时试算</span>
            </div>

            {resultData.gapAmount === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm font-bold">
                🎉 你已经没有任何缺口！下载白鲸 App，体验极速一站式指数交易，让资产稳健增长。
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                
                {/* Sliders */}
                <div className="lg:col-span-2 space-y-6">
                  
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm font-bold mb-2.5">
                      <span className="text-slate-300">每月在白鲸设定定投金额：</span>
                      <span className="text-primary-500 font-mono font-extrabold text-base">¥ {extraSave.toLocaleString()} / 月</span>
                    </div>
                    <input 
                      type="range" 
                      min="500" 
                      max="15000" 
                      step="500" 
                      value={extraSave}
                      onChange={(e) => setExtraSave(Number(e.target.value))}
                      className="w-full h-2.5 bg-card rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5 font-bold">
                      <span>¥500</span>
                      <span>¥7,500</span>
                      <span>¥15,000</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs sm:text-sm font-bold mb-2.5">
                      <span className="text-slate-300">使用智能策略提升年化收益率：</span>
                      <span className="text-white font-mono font-extrabold text-base">+{extraReturn}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="8" 
                      step="1" 
                      value={extraReturn}
                      onChange={(e) => setExtraReturn(Number(e.target.value))}
                      className="w-full h-2.5 bg-card rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5 font-bold">
                      <span>保守 (+1%)</span>
                      <span>稳健 (+4%)</span>
                      <span>积极 (+8%)</span>
                    </div>
                  </div>

                </div>

                {/* Trial Result Output */}
                <div className="bg-card border border-border rounded-3xl p-6 flex flex-col justify-center items-center text-center shadow-inner">
                  <span className="text-xs text-slate-500 font-bold mb-1">调整后的新退休缺口</span>
                  <span className="text-2xl sm:text-3xl font-black text-primary-500 tracking-tight font-mono mb-3">
                    ¥ {adjustedGap.toLocaleString()}
                  </span>
                  
                  {yearsSaved > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary-500/10 text-primary-500 border border-primary-500/20 text-xs font-black animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>可提前 {yearsSaved} 年退休！</span>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-500 mt-3 leading-relaxed">
                    *基于白鲸智能交易 15 年复利模型估算，实际依市场而定。
                  </span>
                </div>

              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 5. CRITICAL CTA BANNER: BaiJing App BaiJing Logo + Orange UI */}
          {/* ======================================================== */}
          <div className="w-full bg-gradient-to-r from-[#ff6600] via-[#ff7519] to-[#ff8c40] rounded-[2.5rem] p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary-500/25 relative overflow-hidden group">
            
            {/* Background glow & watermark */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left max-w-xl z-10">
              
              {/* BaiJing Brand Logo */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/30 flex-shrink-0 group-hover:rotate-3 transition-transform duration-300 bg-white flex items-center justify-center p-1">
                <img src="/logo.png" alt="白鲸 App Logo" className="w-full h-full object-cover rounded-2xl" />
              </div>

              <div className="flex flex-col justify-center">
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-white font-mono text-xs font-extrabold uppercase tracking-widest mb-3 w-fit mx-auto md:mx-0 backdrop-blur-sm">
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>白鲸 BaiJing App 官方推荐</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-snug mb-3 text-white">
                  下载白鲸 App 体验一站式指数交易，<span className="underline decoration-black decoration-4">本周注册还送最高 50% 赠金返现</span>
                </h2>

                <p className="text-primary-50 font-bold text-xs sm:text-sm leading-relaxed opacity-95">
                  支持银行卡快速出入金，支持 USDT 便捷入金，24 小时客服在线支援！打破死工资，找回人生财务自由主导权。
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 pt-4 border-t border-white/20 text-[11px] font-black text-white">
                  <span className="flex items-center gap-1 bg-black/15 px-2.5 py-1 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    <span>极速出入金</span>
                  </span>
                  <span className="flex items-center gap-1 bg-black/15 px-2.5 py-1 rounded-lg">
                    <Coins className="w-3.5 h-3.5 text-white" />
                    <span>USDT 零门槛</span>
                  </span>
                  <span className="flex items-center gap-1 bg-black/15 px-2.5 py-1 rounded-lg">
                    <Headphones className="w-3.5 h-3.5 text-white" />
                    <span>24/7 在线客服</span>
                  </span>
                </div>

              </div>
            </div>

            {/* Action CTA Button */}
            <div className="flex flex-col gap-3 w-full lg:w-auto z-10 flex-shrink-0">
              
              <a 
                href={TARGET_URL}
                target="_blank"
                rel="noreferrer"
                className="w-full lg:w-auto min-w-[240px] px-8 py-5 rounded-2xl bg-black hover:bg-slate-900 active:scale-95 text-white font-black text-base sm:text-lg flex items-center justify-center gap-3 transition-all shadow-2xl text-center cursor-pointer group hover:ring-4 hover:ring-white/30"
              >
                <span>🚀 领取 50% 新人赠金</span>
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform text-primary-400" />
              </a>

              <span className="text-[11px] text-white font-black text-center tracking-wider">
                ⭐ 双平台 4.9 星极高评价
              </span>

            </div>

          </div>

        </section>
      )}

    </main>
  );
}
