import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  AlertTriangle,
  Flame,
  Zap,
  Twitter,
  Copy
} from 'lucide-react';

// --- QUESTION DATA ---
interface Option {
  id: string;
  label: string;
  subtext?: string;
  points: number; // 1 = Minimal gap, 4 = Huge gap
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
    question: "早晨 8 點鬧鐘狂響時，你腦中浮現的第一個念頭通常是？",
    situation: "週一早晨的靈魂拷問，決定了你的勞碌命指數",
    options: [
      { id: 'A', label: "「再撐幾年就完全自由了！為五斗米折腰我驕傲。」", subtext: "有既定退休目標，按部就班中", points: 2 },
      { id: 'B', label: "「好想中威力彩頭獎，立刻把辭呈甩在老闆臉上！」", subtext: "滿腦子想提早退休，但缺乏實際行動", points: 3 },
      { id: 'C', label: "「上班真有趣！我熱愛我的工作，沒想過要停下來。」", subtext: "工作狂或極度幸運兒，根本不需要退休", points: 1 },
      { id: 'D', label: "「算了一下戶頭餘額，默默嘆氣爬起來穿衣服...」", subtext: "手停口就停，連生病都不敢請假", points: 4 },
    ]
  },
  {
    id: 2,
    question: "和朋友吃早午餐，看到菜單上一份「酪梨水波蛋吐司」要價 420 元，你的反應是？",
    situation: "面對精緻生活的誘惑，你的錢包防禦力有多高？",
    options: [
      { id: 'A', label: "「點！毫不猶豫再加點 180 元拿鐵，錢只是變成喜歡的樣子。」", subtext: "及時行樂派，退休開銷需求極大", points: 4 },
      { id: 'B', label: "「辛苦工作一週，偶爾吃一頓好的犒賞自己很合理吧。」", subtext: "標準小確幸，容易忽略隱形開銷", points: 3 },
      { id: 'C', label: "「420元？自己去全聯買酪梨和蛋做不用 80 塊，點最便宜的。」", subtext: "CP值至上，自帶物欲控制結界", points: 2 },
      { id: 'D', label: "「默默打開記帳 App，確認這個月伙食費有沒有超支。」", subtext: "紀律嚴明（或現金流極度緊繃）", points: 1 },
    ]
  },
  {
    id: 3,
    question: "你目前每個月的薪水進帳後，大概都是怎麼分配的？",
    situation: "檢視你的儲蓄蓄水池與現金流去向",
    options: [
      { id: 'A', label: "「月初富豪，月底吃草。存錢是什麼？能吃嗎？」", subtext: "純粹的月光族，抗風險能力為零", points: 4 },
      { id: 'B', label: "「超過 60% 都在繳房貸、車貸或養家，根本存不到什麼錢。」", subtext: "重擔壓肩，資產流動性極低", points: 3 },
      { id: 'C', label: "「佛系存錢法，扣掉房租和生活費，戶頭剩多少就算存多少。」", subtext: "隨緣型儲蓄，退休進度全看心情", points: 2 },
      { id: 'D', label: "「鐵血紀律！發薪水當天先自動扣款 30% 拿去投資或定存。」", subtext: "穩健積累中，時間的朋友", points: 1 },
    ]
  },
  {
    id: 4,
    question: "想像一下你理想中的 65 歲退休生活，畫面長什麼樣子？",
    situation: "決定你未來需要準備多大包的「退休糧草」",
    options: [
      { id: 'A', label: "「每年飛兩次歐洲，住五星飯店，每天打高爾夫、做SPA！」", subtext: "富豪級退休生活（每月開銷估計 > 12 萬）", points: 4 },
      { id: 'B', label: "「在市郊買個小房子種花養貓，跟老友喝茶，偶爾國內旅遊。」", subtext: "中產舒適型（每月開銷估計約 5-6 萬）", points: 3 },
      { id: 'C', label: "「繼續做點輕鬆的兼職或顧問，保持社會接觸，不想完全閒著。」", subtext: "半退休狀態，有持續性被動/兼職收入", points: 2 },
      { id: 'D', label: "「不敢想...只要沒生大病、不用看人臉色、有冷氣吹就好。」", subtext: "低欲望生存型（每月開銷估計約 2.5 萬）", points: 1 },
    ]
  },
  {
    id: 5,
    question: "當聽到同事們狂熱討論「美股」、「ETF」、「台積電」或「比特幣」時，你的狀態是？",
    situation: "投資理財觀念大會考",
    options: [
      { id: 'A', label: "「曾經跟風亂買被當韭菜割過，現在看到 K 線圖就胃痛。」", subtext: "一朝被蛇咬，只敢放定存被通膨侵蝕", points: 4 },
      { id: 'B', label: "「聽不懂也不想碰，我覺得投資像賭博，放銀行最安全。」", subtext: "極度保守派，退休資產增長緩慢", points: 3 },
      { id: 'C', label: "「只買大盤或高股息 ETF，設定定期定額後就去睡覺。」", subtext: "聰明懶人投資法，享受大盤紅利", points: 2 },
      { id: 'D', label: "「我都有佈局！懂得做資產配置與動態調整，自認理財達人。」", subtext: "積極主動，有機會大幅縮短退休時程", points: 1 },
    ]
  },
  {
    id: 6,
    question: "萬一明天突然生病或遇到意外，需要立刻拿出一筆 20 萬元的緊急支出，你...？",
    situation: "測試你的「財務安全氣囊」是否會隨時爆掉",
    options: [
      { id: 'A', label: "「20萬？！我連拿出 2 萬都有困難，直接原地破產...」", subtext: "財務防禦力 F 級，走鋼索的人生", points: 4 },
      { id: 'B', label: "「可能得刷信用卡分 24 期，或者厚著臉皮找家人求救。」", subtext: "財務防禦力 C 級，高度依賴外部救援", points: 3 },
      { id: 'C', label: "「擠一下拿得出來，不過要解約定存或忍痛賣掉一些股票。」", subtext: "財務防禦力 A 級，但略傷長期資產", points: 2 },
      { id: 'D', label: "「完全沒問題，我的緊急預備金帳戶隨時躺著半年的生活費。」", subtext: "財務防禦力 S 級，心如止水", points: 1 },
    ]
  },
  {
    id: 7,
    question: "最後一題！你覺得自己目前離「財務自由、隨時能把老闆開除」的終極夢想，完成度大概是多少？",
    situation: "直面現實的最後一擊",
    options: [
      { id: 'A', label: "「0%！我就是天選的終極打工人，準備活到老、做到老 😭」", subtext: "完全放棄治療", points: 4 },
      { id: 'B', label: "「不到 20%...每天都在被錢追著跑，退休比登月還遠。」", subtext: "焦慮感破表", points: 3 },
      { id: 'C', label: "「大概 50% 吧，革命尚未成功，同志仍須努力。」", subtext: "穩步前進中", points: 2 },
      { id: 'D', label: "「80% 以上！萬事俱備，只差挑個黃道吉日宣佈退休。」", subtext: "準退休貴族", points: 1 },
    ]
  }
];

// --- RESULT DATA DEFINITIONS ---
interface ResultProfile {
  title: string;
  subtitle: string;
  emoji: string;
  badgeColor: string;
  gapAmount: number; // For slider interactive base
  gapText: string;
  difficulty: string;
  projectedRetireAge: number;
  xShareText: string;
  diagnosis: string;
  prescription: string[];
  actionCta: string;
}

const RESULTS: Record<string, ResultProfile> = {
  VERSAILLES: {
    title: "躺平金字塔頂端：財富自由的凡爾賽大師",
    subtitle: "你的戶頭根本沒有缺口，只有滿出來的自由！",
    emoji: "👑",
    badgeColor: "from-amber-500 to-yellow-300 text-slate-950",
    gapAmount: 0,
    gapText: "NT$ 0 元",
    difficulty: "🏖️ 天選之子",
    projectedRetireAge: 45,
    xShareText: "實測發現我的退休缺口是 0 元！被認證為『財富自由的凡爾賽大師』👑 30秒殘酷實測，你敢來看看自己還差幾千萬嗎？",
    diagnosis: "你擁有超凡的財務紀律與極佳的資產配置觀念（或是擁有讓人羨慕的富爸爸）。緊急預備金充足，投資穩健，對生活物欲有著極高的掌控力。上班對你來說只是打發時間或做身體健康的。",
    prescription: [
      "持續優化資產配置，將重心逐步移往低波動、高穩健的全球型債券或大盤 ETF。",
      "留意通膨對現金購買力的長期侵蝕，保持合理的投資成長率（約 5-6% 即可）。",
      "開始規劃人生第二曲線或公益志業，享受真正的精神與財富雙重自由。"
    ],
    actionCta: "立即領取 $500 迎新贈金，體驗 VIP 級家族財富管理工具"
  },
  CHILL: {
    title: "佛系微躺派：只差一步的準退休貴族",
    subtitle: "革命即將成功，再累積最後一桶金就能奔向大海！",
    emoji: "🍹",
    badgeColor: "from-emerald-400 to-teal-500 text-slate-950",
    gapAmount: 4500000,
    gapText: "約 NT$ 450 萬",
    difficulty: "🌟 輕鬆愜意",
    projectedRetireAge: 58,
    xShareText: "我的退休缺口還差 450 萬！被診斷為『佛系微躺派』🍹 再加把勁就能去海邊喝調酒了！30秒殘酷實測，算算你離退休還有多遠！",
    diagnosis: "你的理財基礎相當不錯，已經建立起初步的被動收入或穩健的儲蓄習慣。面對突發狀況有一定抵禦能力，但距離心中完美、豪放的退休生活藍圖，還差最後幾年的資本雪球滾動。",
    prescription: [
      "運用『核心-衛星策略』，80% 放穩健 ETF，20% 投入具爆發力的新興科技趨勢加速資產增長。",
      "定期檢視手邊的保單與隱形開銷，將多餘的資金轉化為能生息的資產。",
      "善用智能定投工具設定『自動逢低加碼』，提早 3-5 年達成完全退休目標。"
    ],
    actionCta: "下載 App 開啟智能定投，領 $500 贈金再享 8.8% 加碼券"
  },
  LATTE: {
    title: "拿鐵因子重患：看似精緻實則戶頭見底的享樂族",
    subtitle: "你的錢包沒有失蹤，只是都變成了早午餐與出國的機票！",
    emoji: "☕",
    badgeColor: "from-amber-400 to-orange-500 text-slate-950",
    gapAmount: 11800000,
    gapText: "約 NT$ 1,180 萬",
    difficulty: "⚠️ 充滿警報",
    projectedRetireAge: 68,
    xShareText: "崩潰！被診斷為『拿鐵因子重患』☕ 退休缺口破千萬 💸 戒掉酪梨吐司跟早午餐還來得及嗎？快來測你的真實退休缺口！",
    diagnosis: "你在職場上表現不俗，收入中等偏上，但患有嚴重的『精緻窮』傾向。追求當下高質感生活，對 400 元的早午餐毫無抵抗力，導致每個月結餘少得可憐，資產累積速度遠遠趕不上老化的速度。",
    prescription: [
      "奉行『先儲蓄/投資，後消費』的鐵律！每月發薪水當天強制轉出 20% 到獨立投資帳戶。",
      "揪出生活中的『拿鐵因子』（如用不到的訂閱制、頻繁的外送、過度昂貴的咖啡），每月省下 5,000 元直接投入大盤。",
      "建立緊急預備金，避免意外發生時被迫中斷現有生活水準。"
    ],
    actionCta: "下載 App 設定自動無痛扣款，領 $500 迎新贈金拯救戶頭"
  },
  HAMSTER: {
    title: "無盡滾輪天竺鼠：為五斗米無限續杯的終極打工人",
    subtitle: "一覺醒來又在去上班的路上，退休對你來說是都市傳說！",
    emoji: "🐹",
    badgeColor: "from-rose-500 to-pink-600 text-white",
    gapAmount: 18500000,
    gapText: "約 NT$ 1,850 萬",
    difficulty: "⚡ 地獄難度",
    projectedRetireAge: 75,
    xShareText: "淚奔...我的退休缺口高達 1,850 萬，獲頒『終極打工人』稱號 🐹 感覺得在公司做到 75 歲，誰來救救我！快來測測你是不是同道中人！",
    diagnosis: "你深受沈重的房貸、車貸或家庭開銷所困，每天像在滾輪上狂奔的天竺鼠，不敢停下腳步。對於投資理財充滿恐懼或毫無概念，大部分資產要嘛鎖在自住房屋，要嘛放在利息微薄的銀行定存。",
    prescription: [
      "打破『只有有錢才能投資』的迷思！從每個月 $3,000 元小額定期定額開始，建立第一筆會長大的現金流。",
      "積極提升職場核心技能或尋找副業機會，突破目前的收入天花板。",
      "尋求專業資產負債整合建議，降低不必要的高利息負債（如信用卡循環利息或信貸）。"
    ],
    actionCta: "領取 $500 贈金立即開啟新手 $1,000 定投，打破滾輪宿命"
  },
  JELLYFISH: {
    title: "財務急診室常客：徘徊破產邊緣的月光水母",
    subtitle: "戶頭清澈見底，下個月的薪水是你唯一的氧氣瓶！",
    emoji: "🚨",
    badgeColor: "from-purple-600 to-indigo-600 text-white",
    gapAmount: 26800000,
    gapText: "破 NT$ 2,500 萬",
    difficulty: "💀 生存極限",
    projectedRetireAge: 82, // Basically never
    xShareText: "🚨 緊急呼救！我的退休缺口直接破表，被認證為『財務急診室常客』💀 只能做到老活到老了... 30秒測出你的財務健康度，心臟夠大顆再點！",
    diagnosis: "你的財務狀況處於極度危險的紅色警戒狀態！沒有任何緊急預備金，完全是『手停口就停』。可能習慣性透支或背負高額壞帳，面對未來的退休生活完全不敢想像，每天都在為生存而戰。",
    prescription: [
      "【緊急止血】立刻停止任何分期付款與非必要開銷，剪掉會讓你過度消費的信用卡！",
      "【強行儲蓄】無論賺多賺少，每個月硬性存下 1,000 ~ 2,000 元作為保命緊急預備金。",
      "【建立防線】當預備金滿 3 個月後，全面導入低門檻的智能機器人理財，讓系統幫你克服人性弱點。"
    ],
    actionCta: "下載 App 領取 $500 救急啟動金，啟動智能財務重建計畫"
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
    "掃描戶頭殘酷餘額中...",
    "調閱近一年外送與早午餐帳單...",
    "計算通膨巨獸吞噬速率...",
    "分析老年保健食品與醫療開銷...",
    "生成專屬財務續命診斷報告..."
  ];

  // Result matching
  const [resultKey, setResultKey] = useState<string>('LATTE');
  const resultData = RESULTS[resultKey];

  // Interactive Bonus Slider states (Only visible in 'result' step)
  const [extraSave, setExtraSave] = useState<number>(5000); // Monthly extra saving
  const [extraReturn, setExtraReturn] = useState<number>(3); // Extra annual return %
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
      // Finished all questions!
      processAnswers(nextAnswers);
      setStep('calculating');
    }
  };

  // Process and determine Result
  const processAnswers = (finalAnswers: number[]) => {
    const totalPoints = finalAnswers.reduce((sum, p) => sum + p, 0);
    // Min total = 7, Max total = 28
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
            // Trigger Confetti
            setTimeout(() => {
              confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 }
              });
            }, 300);
            return prev;
          }
        });
      }, 600); // Total ~3 seconds

      return () => clearInterval(interval);
    }
  }, [step]);

  // Update Adjusted Gap whenever slider or resultKey changes
  useEffect(() => {
    if (!resultData) return;
    const baseGap = resultData.gapAmount;
    if (baseGap === 0) {
      setAdjustedGap(0);
      setYearsSaved(0);
      return;
    }

    // A simple yet compelling financial impact formula for the slider:
    // Every $1,000 monthly saving reduces gap by ~ $300,000 over 15 years.
    // Every 1% extra return reduces gap by ~ 8% of the remaining gap.
    const reductionFromSave = (extraSave / 1000) * 280000; 
    const reductionFromReturn = baseGap * (extraReturn * 0.075);
    const totalReduction = reductionFromSave + reductionFromReturn;

    const newGap = Math.max(0, baseGap - totalReduction);
    setAdjustedGap(Math.round(newGap / 10000) * 10000); // round to ten thousands

    // Compute years saved
    const reducedPercent = Math.min(1, totalReduction / baseGap);
    const potentialYears = Math.round(reducedPercent * 14); // save up to 14 years
    setYearsSaved(potentialYears);
  }, [extraSave, extraReturn, resultData]);

  // Share to Twitter / X
  const handleXShare = () => {
    if (!resultData) return;
    const shareUrl = "https://retirerapid.vercel.app"; // Sample URL
    const text = encodeURIComponent(`${resultData.xShareText}\n\n👉 快來測：${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  // Copy share text
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!resultData) return;
    const shareUrl = window.location.href;
    const text = `${resultData.xShareText}\n👉 快來實測：${shareUrl}`;
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
        <section className="w-full max-w-4xl flex flex-col items-center text-center animate-fadeIn my-auto">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs sm:text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>2026 年度最犀利財務心理測驗</span>
          </div>

          {/* Provocative Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-slate-100 mb-6 max-w-3xl">
            你以為 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-amber-400 to-yellow-300">65 歲</span>能順利退休，但你知道自己的戶頭<span className="underline decoration-rose-500 decoration-wavy decoration-2">還差幾千萬</span>嗎？
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl font-medium">
            別再憑空幻想！<span className="text-slate-200 font-bold">30 秒、7 道</span>毒舌又殘酷的靈魂拷問，精準診斷你的「真實退休缺口」與專屬財務續命指南。
          </p>

          {/* Hero CTA Button */}
          <button
            onClick={handleStart}
            className="w-full sm:w-auto min-w-[280px] px-8 py-5 rounded-2xl bg-gradient-to-r from-primary-500 via-amber-500 to-yellow-400 text-slate-950 font-black text-lg sm:text-xl shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-3 group cursor-pointer"
          >
            <Zap className="w-6 h-6 fill-slate-950 animate-bounce-slow" />
            <span>馬上測！算出我的退休缺口</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Social Proof / Hint */}
          <p className="text-xs sm:text-sm text-slate-500 mt-4 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>無須註冊，全程匿名實測，只需 30 秒</span>
          </p>

          {/* Feature Grid / Sneak Peek */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 text-left border border-slate-900 bg-slate-950/50 p-6 rounded-3xl backdrop-blur-sm">
            <div className="flex items-start gap-4 p-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 font-black text-lg">
                1
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm mb-1">直面財務靈魂拷問</h3>
                <p className="text-slate-400 text-xs leading-relaxed">從日常消費到投資偏好，每題都戳中打工人的真實痛點。</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 font-black text-lg">
                2
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm mb-1">生成專屬人格標籤</h3>
                <p className="text-slate-400 text-xs leading-relaxed">5 大毒舌退休稱號，完美支援一鍵截圖分享回 X/Twitter。</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 font-black text-lg">
                3
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm mb-1">領取 $500 退休迎新金</h3>
                <p className="text-slate-400 text-xs leading-relaxed">提供具體理財解方與 App 專屬下載福利，馬上行動。</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 2. INTERACTIVE QUIZ PAGE */}
      {/* ======================================================== */}
      {step === 'quiz' && q && (
        <section className="w-full max-w-2xl flex flex-col my-auto animate-fadeIn">
          {/* Progress Bar */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 font-bold mb-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              進度診斷中
            </span>
            <span className="bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              第 <span className="text-primary-400 font-black">{currentQuestionIdx + 1}</span> / {QUESTIONS.length} 題
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden mb-8 border border-slate-800 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-amber-400 rounded-full transition-all duration-500 ease-out shadow-sm shadow-primary-500/50"
              style={{ width: `${((currentQuestionIdx + 1) / QUESTIONS.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Text */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 mb-6 backdrop-blur-md shadow-xl relative">
            <span className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[11px] font-bold">
              {q.situation}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-100 leading-snug mt-2">
              {q.question}
            </h2>
          </div>

          {/* Options List */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {q.options.map((opt, idx) => {
              const optionLetters = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt.points)}
                  className="w-full text-left p-5 sm:p-6 rounded-2xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 hover:border-primary-500/50 transition-all duration-200 flex items-start gap-4 group cursor-pointer hover:shadow-lg hover:shadow-primary-500/10 active:scale-[0.99]"
                >
                  <span className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-primary-500 group-hover:text-slate-950 text-slate-300 font-black flex items-center justify-center flex-shrink-0 transition-colors shadow-sm text-sm">
                    {optionLetters[idx]}
                  </span>
                  <div className="flex flex-col justify-center">
                    <span className="text-base sm:text-lg font-bold text-slate-200 group-hover:text-white transition-colors leading-normal">
                      {opt.label}
                    </span>
                    {opt.subtext && (
                      <span className="text-xs text-slate-500 group-hover:text-slate-400 mt-1 transition-colors">
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
          {/* Radar Scanner Animation */}
          <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin"></div>
            <div className="absolute inset-4 rounded-full border-4 border-blue-500/20 border-b-blue-500 animate-spin [animation-direction:reverse]"></div>
            <span className="text-5xl animate-bounce">🛠️</span>
          </div>

          <h2 className="text-2xl font-black text-slate-100 mb-3">
            大數據 AI 財務診斷中...
          </h2>
          
          {/* Dynamic Steps */}
          <div className="h-12 flex items-center justify-center">
            <p className="text-primary-400 font-bold text-sm sm:text-base animate-pulse">
              ⚡ {calcMessages[calcStep]}
            </p>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full mt-6 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-primary-500 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${((calcStep + 1) / calcMessages.length) * 100}%` }}
            ></div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 4. RESULT PAGE (CRITICAL) */}
      {/* ======================================================== */}
      {step === 'result' && resultData && (
        <section className="w-full max-w-4xl flex flex-col items-center animate-fadeIn my-auto">
          
          {/* Top banner / retake */}
          <div className="w-full flex items-center justify-between mb-6">
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>重新診斷</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleXShare}
                className="inline-flex items-center gap-2 text-xs font-black text-slate-950 bg-[#1DA1F2] hover:bg-[#1a8cd8] px-4 py-2 rounded-xl transition-all shadow-md shadow-[#1DA1F2]/20 cursor-pointer"
              >
                <Twitter className="w-3.5 h-3.5 fill-current" />
                <span>一鍵分享至 X</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800 transition-all cursor-pointer"
                title="複製分享文案"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? '已複製！' : '複製文案'}</span>
              </button>
            </div>
          </div>

          {/* Critical Result Card */}
          <div className="w-full bg-gradient-to-b from-slate-900/90 to-slate-950 border-2 border-slate-800/80 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-12">
            
            {/* Ambient glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-8 border-b border-slate-800">
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center text-6xl shadow-inner flex-shrink-0">
                  {resultData.emoji}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold mb-2">
                    <Award className="w-3.5 h-3.5 text-primary-400" />
                    <span>你的專屬退休人格診斷</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
                    {resultData.title}
                  </h1>
                  <p className="text-sm sm:text-base text-primary-400 font-bold mt-1">
                    {resultData.subtitle}
                  </p>
                </div>
              </div>

              {/* Gap Highlight */}
              <div className="flex flex-col items-center md:items-end justify-center bg-slate-950/60 border border-slate-800/80 p-5 rounded-3xl min-w-[220px]">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">診斷退休缺口金額</span>
                <span className="text-3xl sm:text-4xl font-black text-rose-500 tracking-tight">
                  {resultData.gapText}
                </span>
                <span className="text-xs text-slate-500 mt-1.5 flex items-center gap-1 font-medium">
                  <span>難度評級：</span>
                  <span className="text-slate-300 font-bold">{resultData.difficulty}</span>
                </span>
              </div>

            </div>

            {/* Crucial Section: Diagnosis & Prescription */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              
              {/* Left Diagnosis */}
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wider mb-3">
                    <AlertTriangle className="w-4 h-4" />
                    <span>殘酷現狀剖析</span>
                  </div>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {resultData.diagnosis}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>照現狀預計退休年齡：</span>
                  <span className="text-lg font-black text-slate-200">
                    {resultData.projectedRetireAge > 80 ? '做到人生盡頭 💀' : `${resultData.projectedRetireAge} 歲`}
                  </span>
                </div>
              </div>

              {/* Right Prescription */}
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm uppercase tracking-wider mb-3">
                  <TrendingUp className="w-4 h-4" />
                  <span>專屬財務續命處方箋</span>
                </div>
                <ul className="space-y-3">
                  {resultData.prescription.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
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
          {/* BONUS INTERACTIVE TOOL: GAP CALCULATOR SLIDER */}
          {/* ======================================================== */}
          <div className="w-full bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-12 shadow-xl">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  🛠️
                </div>
                <h3 className="text-lg font-black text-slate-100">
                  互動實測：如果現在開始定投，能扭轉多少未來？
                </h3>
              </div>
              <span className="text-xs text-slate-400">拖拉滑桿試算你的 App 理財加速器</span>
            </div>

            {resultData.gapAmount === 0 ? (
              <div className="text-center py-6 text-slate-400 font-bold">
                🎉 你已經毫無缺口！下載 App 讓資產持續穩健傳承，享受極致自由。
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                
                {/* Sliders */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Slider 1 */}
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-slate-300">每月在 App 設定智能定投：</span>
                      <span className="text-primary-400 font-mono text-base">NT$ {extraSave.toLocaleString()} / 月</span>
                    </div>
                    <input 
                      type="range" 
                      min="1000" 
                      max="30000" 
                      step="1000" 
                      value={extraSave}
                      onChange={(e) => setExtraSave(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-primary-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>$1,000</span>
                      <span>$15,000</span>
                      <span>$30,000</span>
                    </div>
                  </div>

                  {/* Slider 2 */}
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-slate-300">使用智能組合提升年化報酬率：</span>
                      <span className="text-emerald-400 font-mono text-base">+{extraReturn}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="8" 
                      step="1" 
                      value={extraReturn}
                      onChange={(e) => setExtraReturn(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>保守 (+1%)</span>
                      <span>穩健 (+4%)</span>
                      <span>積極 (+8%)</span>
                    </div>
                  </div>

                </div>

                {/* Impact Output */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-inner">
                  <span className="text-xs text-slate-400 font-bold mb-1">調整後的新退休缺口</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-mono mb-3">
                    NT$ {adjustedGap.toLocaleString()}
                  </span>
                  
                  {yearsSaved > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black animate-bounce-slow">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>可提早 {yearsSaved} 年退休！</span>
                    </div>
                  )}

                  <span className="text-[11px] text-slate-500 mt-3 leading-tight">
                    *以上基於智能定投 15 年複利模型試算，實際依市場而定。
                  </span>
                </div>

              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* 5. DOWNLOAD CTA BANNER (CRITICAL) */}
          {/* ======================================================== */}
          <div id="app-cta" className="w-full bg-gradient-to-r from-primary-600 via-amber-600 to-yellow-500 rounded-[2.5rem] p-8 sm:p-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary-500/20 relative overflow-hidden group">
            
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform pointer-events-none"></div>

            <div className="flex flex-col text-center md:text-left max-w-xl z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/10 border border-slate-950/20 font-black text-xs uppercase tracking-wider mb-3 w-fit mx-auto md:mx-0">
                <Flame className="w-4 h-4 fill-slate-950" />
                <span>限時新手紅利</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
                下載 App 領 <span className="underline decoration-slate-950 decoration-4">$500 贈金</span>，挑戰馬上退休！
              </h2>
              <p className="text-slate-900 font-bold text-sm sm:text-base leading-relaxed">
                別讓退休缺口永遠只是嚇人的數字！立即開啟智能機器人資產配置與自動化定投，首次入金再加碼送 <span className="bg-slate-950 text-white px-2 py-0.5 rounded-md font-black">8.8% 年化收益券</span>，每天少喝一杯飲料，找回人生自由主導權。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto z-10 flex-shrink-0">
              
              {/* iOS Download */}
              <button 
                onClick={() => alert("🎉 感謝下載 RetireRadar App！正為您轉跳至 App Store...")}
                className="px-8 py-4 rounded-2xl bg-slate-950 text-white font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div className="text-xl">🍎</div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 font-medium -mb-1">Download on the</span>
                  <span className="text-base tracking-tight font-black">App Store</span>
                </div>
              </button>

              {/* Android Download */}
              <button 
                onClick={() => alert("🎉 感謝下載 RetireRadar App！正為您轉跳至 Google Play...")}
                className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer border border-slate-800"
              >
                <div className="text-xl">🤖</div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 font-medium -mb-1">GET IT ON</span>
                  <span className="text-base tracking-tight font-black">Google Play</span>
                </div>
              </button>

              <span className="text-[11px] text-slate-900 font-bold text-center mt-1">
                ⭐ 雙平台 4.9 星極高評價
              </span>

            </div>

          </div>

        </section>
      )}

    </main>
  );
}
