import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Cpu,
  Network,
  Activity,
  Users,
  Globe,
  Compass,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Mic,
  Eye,
  EyeOff,
  Type,
  Database,
  GitBranch,
  Sliders,
  ArrowRight,
  CheckCircle2,
  Layers,
  Terminal,
  Scale,
  TrendingUp,
  FileSpreadsheet,
  Code2,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // 강의 프롬프터(낭독 대본) 표시 여부 및 글자 크기 상태
  const [showScript, setShowScript] = useState(true);
  const [fontScale, setFontScale] = useState('lg'); // 'base' | 'lg' | 'xl'

  // 논문 1 (지식 그래프) 선택된 노드 상태
  const [selectedKgNode, setSelectedKgNode] = useState('event');

  // 실시간 역사 실험실 (SDM + ABM 통합 샌드박스) 상태
  const [laborCount, setLaborCount] = useState(600); // 초기 노동자 수 n (기준 900명)
  const [plagueSeverity, setPlagueSeverity] = useState(65); // 흑사병 병리학적 충격 강도 (%)
  const [statuteStrictness, setStatuteStrictness] = useState(70); // 1351 노동자 법령 규제 강도 (%)

  // 글자 크기 클래스 매핑
  const scriptSizeClass = {
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
    xl: 'text-xl leading-loose'
  }[fontScale];

  // 존 해처(John Hatcher, 2008) 및 황기우·이상동 외(2025) 한계생산성 공식 계산
  // f(n) = -(1 / 405000) * n^2 + (1 / 450) * n + 1
  const marginalProductivity = useMemo(() => {
    const n = laborCount;
    const val = -(1 / 405000) * (n * n) + (1 / 450) * n + 1;
    return val.toFixed(4);
  }, [laborCount]);

  // 100년 시계열 시뮬레이션 데이터 생성 (3번의 흑사병 파고 & 농노 실질 소득 변화)
  const simulationSeries = useMemo(() => {
    const points = [];
    const severityFactor = plagueSeverity / 100;
    const regulationFactor = statuteStrictness / 100;

    for (let year = 0; year <= 100; year += 2) {
      // 3번의 파고(Three Waves) 모델링: t=16, t=40(최대 정점), t=70(소규모 정점)
      const wave1 = Math.exp(-Math.pow((year - 16) / 5, 2)) * 0.35 * severityFactor;
      const wave2 = Math.exp(-Math.pow((year - 40) / 6, 2)) * 0.65 * severityFactor;
      const wave3 = Math.exp(-Math.pow((year - 70) / 7, 2)) * 0.20 * severityFactor;

      // 인구(Population) 추이: 초기 완만한 감소 + 3번의 파고 충격과 부분 회복
      let pop = 300;
      if (year > 10) pop -= wave1 * 220;
      if (year >= 16 && year < 36) pop = 280 - (wave1 * 180) + (year - 16) * 2.2;
      if (year >= 36) {
        const postSecondDrop = 140 * severityFactor;
        pop = Math.max(85, 290 - postSecondDrop - wave2 * 150 - wave3 * 80 + Math.sin(year / 6) * 12);
      }

      // 감염자(Infected) 추이: 3번의 피크
      const infected = Math.round((wave1 * 120) + (wave2 * 160) + (wave3 * 55));

      // 농노 평균 실질 소득(Total Wealth Blue) 및 최상위 적응 집단(Total Wealth Red)
      const laborScarcityBoost = (300 - pop) * 0.22;
      const cashSuppression = laborScarcityBoost * (regulationFactor * 0.35);
      const baseWealth = 25 + (year * 0.25) + laborScarcityBoost - cashSuppression + Math.sin(year / 4) * 3;
      const topGroupWealth = baseWealth * 1.45 + (severityFactor * 15 * (year / 100));

      points.push({
        year,
        pop: Math.round(Math.max(60, Math.min(320, pop))),
        infected: Math.min(150, infected),
        avgWealth: Math.round(Math.max(15, Math.min(80, baseWealth))),
        topWealth: Math.round(Math.max(20, Math.min(95, topGroupWealth)))
      });
    }
    return points;
  }, [plagueSeverity, statuteStrictness]);

  // ABM 미시적 지표 계산 (화폐 임금 인상률 vs 현물 우회 보상 비율 vs 노동자 A 이동률)
  const abmMetrics = useMemo(() => {
    const scarcity = ((900 - laborCount) / 700) * (plagueSeverity / 100);
    const strictness = statuteStrictness / 100;

    // 규제가 강할수록 명목 화폐 임금 상승은 억제되고, 현물(식량·토지) 우회 보상이 급증함
    const cashWageRise = Math.round(Math.max(5, scarcity * 120 * (1 - strictness * 0.65)));
    const inKindCompensation = Math.round(Math.min(95, 15 + strictness * 75 * (0.5 + scarcity * 0.5)));
    const workerAMobility = Math.round(Math.min(98, 30 + scarcity * 65 + (1 - strictness) * 15));
    const workerBMobility = Math.round(Math.max(10, workerAMobility * 0.48));

    return { cashWageRise, inKindCompensation, workerAMobility, workerBMobility };
  }, [laborCount, plagueSeverity, statuteStrictness]);

  // 윈체스터 주교구 내 임금과 곡물 가격 실증 데이터 (황기우·이상동 외 2025, 자료 4)
  const winchesterData = [
    { period: '1300-19', wagePence: '3.85', wagePct: 100, grainPence: '7.00', grainPct: 100, note: '흑사병 이전 기준점 (인구 과잉·저임금·고곡물가)' },
    { period: '1320-39', wagePence: '6.27', wagePct: 124, grainPence: '4.78', grainPct: 90, note: '기후 변화 및 대기근 시기 변동' },
    { period: '1340-59', wagePence: '5.12', wagePct: 133, grainPence: '6.30', grainPct: 90, note: '1347-49 1차 흑사병 발병 및 1351 노동자 법령 제정' },
    { period: '1360-79', wagePence: '6.55', wagePct: 169, grainPence: '7.56', grainPct: 106, note: '2차 유행 파고 이후 임금 백분율 급상승(169%)' },
    { period: '1380-99', wagePence: '7.22', wagePct: 188, grainPence: '5.58', grainPct: 80, note: '임금 188% 상승 · 곡물가 80%로 하락 (실질소득 도약)' },
    { period: '1400-19', wagePence: '7.33', wagePct: 189, grainPence: '6.35', grainPct: 90, note: '고임금·저곡물가 구조 고착화' },
    { period: '1420-39', wagePence: '7.32', wagePct: 189, grainPence: '6.55', grainPct: 93, note: '농노의 노동 선택권 및 실질 소득 유지' },
    { period: '1440-59', wagePence: '7.29', wagePct: 189, grainPence: '5.65', grainPct: 80, note: '한계생산성 향상 및 곡물 가격 안정' },
    { period: '1460-79', wagePence: '7.22', wagePct: 188, grainPence: '6.02', grainPct: 86, note: '장기 구조적 전환 완료 (포스탄 테제 부합)' },
  ];

  // 지식 그래프 노드 상세 정보 (이현주·이상동 2026, 그림 5 & 표 1)
  const kgNodeDetails = {
    person: {
      badge: 'Person (인물 엔티티)',
      title: '김입견 (金立堅)',
      color: 'text-sky-400 border-sky-500/40 bg-sky-950/30',
      triples: [
        '(:Person {koreanName: "김입견"}) -[:PARTICIPATED_IN {role: "賀聖節使"}]-> (:MissionEvent {year: 1393})',
      ],
      attributes: [
        { k: 'koreanName', v: '김입견 (한글 성명)' },
        { k: 'hanjaName', v: '金立堅 (한자 성명)' },
        { k: 'birthYear', v: '1340 (숫자형 데이터 - 시계열 분석용)' },
        { k: 'birthYearRaw', v: '1340년 (사료 원문 보존 속성)' },
        { k: '설계 특징', v: '동일 인물이 사행마다 정사·부사·서장관 등 다른 역할을 수행하므로 Role(역할)을 Person과 분리 설계' }
      ]
    },
    event: {
      badge: 'MissionEvent (사건 중심 허브 노드)',
      title: '賀聖節使, 1393 (태조 2년 8월 2일)',
      color: 'text-amber-400 border-amber-500/40 bg-amber-950/30',
      triples: [
        '(:MissionEvent) -[:IN_REIGN]-> (:Reign {name: "태조"})',
        '(:MissionEvent) -[:FROM]-> (:Place {name: "朝鮮"})',
        '(:MissionEvent) -[:VIA]-> (:Place {name: "遼東"})',
        '(:MissionEvent) -[:TO]-> (:Place {name: "京師"})'
      ],
      attributes: [
        { k: '구축 단위', v: '실록의 여러 기사("사신을 보내다", "명에 다녀오다", "귀환하다")를 하나의 사건(MissionEvent)으로 정합화(Reconciliation)' },
        { k: 'direction', v: '조선 → 명/일본 (사신 국적 기준 기본 외교 성격 유지)' },
        { k: 'travelLegDirection', v: '실제 이동 구간 방향 별도 기록 (귀환 구간이라도 사행 성격과 실제 경로 동시 보존)' }
      ]
    },
    reign: {
      badge: 'Period / Reign (시기·왕대 엔티티)',
      title: '태조 (太祖, 1393년)',
      color: 'text-purple-400 border-purple-500/40 bg-purple-950/30',
      triples: [
        '(:MissionEvent {id: "1393_Haseongjeolsa"}) -[:IN_REIGN]-> (:Reign {name: "태조"})'
      ],
      attributes: [
        { k: 'ETL 변환 함수', v: 'parse_date() 함수를 통해 왕대·연호 기록을 서기 연도(1393)로 정규화 환산' },
        { k: '확장성', v: '향후 시간 지식 그래프(Temporal Knowledge Graph) 및 종단적 네트워크 분석의 기준축' }
      ]
    },
    places: {
      badge: 'Place (공간 네트워크 엔티티)',
      title: '朝鮮(출발) → 遼東(경유) → 京師(도착)',
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30',
      triples: [
        '(:MissionEvent) -[:FROM]-> (:Place {name: "朝鮮", country: "조선"})',
        '(:MissionEvent) -[:VIA]-> (:Place {name: "遼東", country: "명"})',
        '(:MissionEvent) -[:TO]-> (:Place {name: "京師", country: "명"})'
      ],
      attributes: [
        { k: 'place_country()', v: '출발지·경유지·도착지 지명에 대상 국가(조선, 명 등) 태그 부여' },
        { k: '이칭(異稱) 보존 원칙', v: '동일 문자열만 병합(merge)하고, 京師·北京·京城 등 서로 다른 당대 표기는 임의 통합하지 않고 원문 구분 유지' }
      ]
    }
  };

  // 직접 만든 역사 SW 포트폴리오 데이터
  const mySwList = [
    {
      id: 'silver',
      title: '대항해시대 글로벌 은(Silver) 무역망 & 4부작 시뮬레이터',
      domain: 'silver.soohwalee.com',
      url: 'https://silver.soohwalee.com',
      badge: 'SDM 거시 물자 흐름 + 짚인간 에이전트',
      accent: 'from-amber-500/20 to-yellow-600/5 border-amber-500/40',
      btnColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
      inspiration: '주경철 교수 『대항해시대』 기반 5개 에피소드 인터랙티브 시뮬레이터',
      features: [
        '포토시 광산 → 아카풀코 → 마닐라 갈레온 → 명나라로 이어지는 글로벌 은(Silver) 유동성(Stock & Flow) 시각화',
        '생태학적 제국주의, 대서양 삼각 무역, 해양 패권 이동, 호르무즈 해협 실시간 관제 등 다층위 시뮬레이션',
        '역사 속 행위자를 인지적 확장 매개체인 "짚인간(Straw Man) 에이전트"로 구현하여 거시 구조와 미시 서사 결합'
      ],
      paperLink: '황기우·이상동 외(2025)의 시스템 역학(Stock-Flow-Links) 및 이상동(2024)의 ABM 에이전트 상호작용을 세계사 교역망에 구현'
    },
    {
      id: 'jsn-dogma',
      title: '예수회 과학 네트워크(JSN) & 교리(Dogma) 역공학 시뮬레이터',
      domain: 'jsn.soohwalee.com / dogma.soohwalee.com',
      url: 'https://jsn.soohwalee.com',
      subUrl: 'https://dogma.soohwalee.com',
      badge: '시맨틱 지식 그래프 + 소스코드 역공학',
      accent: 'from-sky-500/20 to-indigo-600/5 border-sky-500/40',
      btnColor: 'bg-sky-500 hover:bg-sky-400 text-slate-950',
      inspiration: '서양 근대 초 예수회 선교사·과학자 지식망 역공학 및 교리-과학 논쟁 분석',
      features: [
        '유럽과 동아시아를 잇던 예수회 과학 네트워크(JSN)의 데이터 구조와 소스코드를 리버스 엔지니어링하여 사료 재해석',
        '종교적 교리(Dogma)와 근대 과학 지식이 충돌·타협·변용되는 개념 관계망을 시맨틱 그래프로 시각화',
        '텍스트 사료 읽기와 소프트웨어 코드 분석을 나란히 수행하는 "병렬적 역사학(Parallel Historiography)" 실험'
      ],
      paperLink: '이현주·이상동(2026)의 온톨로지·RDF 지식 그래프 구축 및 이상동(2024)의 텍스트 마이닝·네트워크 분석 방법론과 직결'
    },
    {
      id: 'bulge',
      title: '1944 발지 전투(바스토뉴 공방전) 전장 아카이브 & AI 전술 브리핑',
      domain: 'bulge.soohwalee.com',
      url: 'https://bulge.soohwalee.com',
      badge: '역사 GIS 물리 환경 + 미시 전술 고증 DB',
      accent: 'from-emerald-500/20 to-teal-600/5 border-emerald-500/40',
      btnColor: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
      inspiration: '제2차 세계대전 서부전선 아르덴 대공세 지리 공간 매핑 & 스케일 모형 고증 연동',
      features: [
        '1944년 12월 아르덴 삼림과 바스토뉴 격전지의 지리·기상 환경 위에 투입 기갑 장비와 부대 이동을 공간 매핑',
        '실제 스케일 밀리터리 프라모델의 물리적 조형·고증 점수·역사적 차량 변형(Variant) DB와 영상 아카이브 통합',
        '거시적 작전선이 아닌 전장 환경(눈보라, 도로망, 연료 부족) 속에서 개별 전차·부대 단위가 겪는 미시적 조건 재현'
      ],
      paperLink: '이상동(2024)이 강조한 "역사 시뮬레이션 환경으로서의 지리·물리적 공간(GIS)" 설정 및 미시적 사료 데이터 정합성 검증'
    },
    {
      id: 'blog',
      title: '소프트웨어 역사학 & 서사 엔지니어링 연구 아카이브',
      domain: 'blog.soohwalee.com',
      url: 'https://blog.soohwalee.com',
      badge: '라뒤리(1968) 번역 + 데이터·SW 역사학 이론',
      accent: 'from-purple-500/20 to-fuchsia-600/5 border-purple-500/40',
      btnColor: 'bg-purple-500 hover:bg-purple-400 text-slate-950',
      inspiration: '『AI와 짚인간』 및 디지털·시뮬레이션 역사학 연구 노트',
      features: [
        '에마뉘엘 르 루아 라뒤리(1968)의 고전 논문 번역 및 "역사가-프로그래머" 테제의 현대적 재해석 수록',
        '데이터 역사학(Data History)에서 소프트웨어 역사학(Software History)으로 나아가는 이론적 프레임워크 정리',
        '수업 및 콜로키움에서 논의되는 시뮬레이션 역사학 칼럼과 기술 문서 아카이빙'
      ],
      paperLink: '황기우·이상동 외(2025)의 맺음말에서 제기한 "복잡계 알고리즘을 통한 역사가의 인식 확장과 구조주의의 부활"에 대한 철학적 응답'
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 pb-28">
      {/* 상단 고정 컨트롤 네비게이션 바 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090d16]/90 border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Compass className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  디지털역사학과 서양사의 이해
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">Lecture Interactive Deck</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                시뮬레이션 역사학의 이론(이상동 교수 연구팀)과 소프트웨어 역사학의 실천
              </h1>
            </div>
          </div>

          {/* 섹션 퀵 점프 & 프롬프터 컨트롤 */}
          <div className="flex flex-wrap items-center gap-2">
            <nav className="hidden xl:flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs">
              <a href="#part1" className="px-2.5 py-1.5 rounded hover:bg-slate-800 text-slate-300 transition">1. 프롤로그</a>
              <a href="#paper1" className="px-2.5 py-1.5 rounded hover:bg-slate-800 text-sky-400 transition">2. 지식그래프(2026)</a>
              <a href="#paper2" className="px-2.5 py-1.5 rounded hover:bg-slate-800 text-amber-400 transition">3. 시스템역학(2025)</a>
              <a href="#paper3" className="px-2.5 py-1.5 rounded hover:bg-slate-800 text-emerald-400 transition">4. 행위자모델(2024)</a>
              <a href="#sandbox" className="px-2.5 py-1.5 rounded hover:bg-slate-800 text-purple-400 transition">5. 실시간 실험실</a>
              <a href="#mysw" className="px-2.5 py-1.5 rounded hover:bg-slate-800 text-rose-400 transition">6. 나의 역사 SW</a>
            </nav>

            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              <Type className="w-3.5 h-3.5 text-slate-400" />
              {['base', 'lg', 'xl'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontScale(sz)}
                  className={`px-2 py-0.5 text-xs rounded font-medium transition ${
                    fontScale === sz
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sz === 'base' ? '기본' : sz === 'lg' ? '강단대' : '강단특대'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowScript(!showScript)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                showScript
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {showScript ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showScript ? '낭독 대본 켜짐' : '낭독 대본 숨김'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨테이너 (수업 시간에 위에서 아래로 쭉 스크롤하며 읽는 구조) */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 space-y-16">

        {/* =====================================================================
            PART 1. 프롤로그: 라뒤리의 예언과 역사 연구 방법론의 진화
        ===================================================================== */}
        <section id="part1" className="scroll-mt-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PART 1 · 문제의식과 방법론적 전환</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black font-serif-kr tracking-tight text-white leading-tight">
            “내일의 역사가는 프로그래머가 되거나, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-sky-400">
              아니면 더 이상 존재하지 않을 것이다”
            </span>
          </h2>
          <p className="text-sm text-slate-400">
            — 에마뉘엘 르 루아 라뒤리(Emmanuel Le Roy Ladurie), 1968년 5월 『르 누벨 옵세르바퇴르』 기고문 中
          </p>

          {/* 교수님 강의 낭독 대본 1 */}
          {showScript && (
            <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-900/90 border-l-4 border-amber-400 p-6 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Mic className="w-4 h-4 animate-pulse" />
                <span>교수님 강의 낭독 대본 #1 — 도입부</span>
              </div>
              <div className={`text-slate-100 space-y-3 font-normal ${scriptSizeClass}`}>
                <p>
                  “여러분, 오늘 『디지털역사학과 서양사의 이해』 시간에는 우리가 그동안 다뤄온 사료의 디지털화나 텍스트 분석에서 한 걸음 더 나아가, <strong>‘시뮬레이션 역사학(Historical Simulation)’</strong>을 잠깐 소개하려고 합니다.”
                </p>
                <p>
                  “프랑스 아날학파의 거장 에마뉘엘 르 루아 라뒤리는 이미 1968년에 <em>‘내일의 역사가는 프로그래머가 되거나, 아니면 더 이상 존재하지 않을 것이다’</em>라고 선언했습니다. 전통적으로 역사학은 문헌 사료와 고고학 발굴 자료에 의존해 왔지만, 사료가 침묵하는 공백을 메우기 위해 자연과학의 DNA 분석법을 도입했고, 이제는 컴퓨터 알고리즘을 활용해 역사가 머릿속에서만 하던 <strong>‘사고실험(Thought Experiment)’을 컴퓨터 시뮬레이션으로 구현하는 단계</strong>에 도달했습니다.”
                </p>
                <p>
                  “오늘은 국내에서 이 분야를 선도적으로 개척하고 계신 성균관대 사학과 <strong>이상동 교수님 연구팀의 최신 논문 3편(2024~2026)</strong>을 통해 데이터 구조화부터 거시·미시 시뮬레이션까지의 이론적 뼈대를 짚어보고, 이어서 제가 직접 리액트(React)와 도커(Docker)로 만들어 서버에 띄워둔 <strong>서양사·세계사 시뮬레이션 웹앱들</strong>이 이 이론들과 어떻게 만나는지 함께 살펴보겠습니다.”
                </p>
              </div>
            </div>
          )}

          {/* 역사학 방법론의 4단계 진화 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="text-xs font-mono-code text-slate-400">STAGE 01 · 자연과학의 도입</div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                문헌·고고학 + DNA 분석법
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                문헌만으로 알 수 없던 <strong>14세기 흑사병의 병인(페스트균, <em>Yersinia pestis</em>)</strong>을 라울(Raoult, 2000) 등이 고대 DNA 분석으로 규명하고, 길다스·베다가 단지 “세 척의 배”로 기록한 <strong>앵글로색슨의 브리튼 이주</strong> 역시 현대 잉글랜드인 유전자의 30~70%를 차지하는 장기 동화 과정이었음을 규명함(Gretzinger, 2022).
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="text-xs font-mono-code text-slate-400">STAGE 02 · 1세대 디지털 역사학</div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                사료의 전산화와 아카이빙
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                1966년 전북대 송준호 교수와 하버드대 에드워드 와그너 교수의 <strong>‘와그너-송 조선문과방목 프로젝트’</strong> 및 1995년 『국역 조선왕조실록』 CD-ROM 간행. 종이 사료를 디지털 코드로 전환·축적·분류했으나, 컴퓨터가 역사가의 인지와 해석을 대신하는 질적 분석 단계로 나아가지는 못함.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="text-xs font-mono-code text-slate-400">STAGE 03 · 2세대 디지털 역사학</div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-emerald-400" />
                GIS · 텍스트마이닝 · 네트워크
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>역사 GIS</strong>(물렌의 미국 노예제 확산 지도, Locating London's Past, 정요근의 1910년 행정구역 복원), <strong>텍스트 마이닝</strong>(독일 아동 도서 3,500권 분석, 허수의 1980년대 ‘민중’ 공기어 분석), <strong>네트워크 분석</strong>(이상국의 245년간 342개 혼인 관계망 분석) 및 <strong>온톨로지 지식 그래프</strong>.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/40 rounded-xl p-5 space-y-2">
              <div className="text-xs font-mono-code text-amber-400">STAGE 04 · 컴퓨테이셔널 역사학</div>
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                역사 시뮬레이션 (SDM & ABM)
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                기존 디지털 역사학을 포괄하되 <strong>기계학습과 시뮬레이션</strong>을 추구함. 역사가의 머릿속 <strong>‘사고실험’</strong>을 컴퓨터 알고리즘 기반의 복잡계로 대체하여, 거시적 <strong>시스템 역학(SDM)</strong>과 미시적 <strong>행위자기반모델(ABM)</strong>로 ‘역사 실험(History Experiment)’을 수행함.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================================
            PART 2-1. 논문 ① 온톨로지 기반 지식 그래프 (이현주·이상동, 2026)
        ===================================================================== */}
        <section id="paper1" className="scroll-mt-20 space-y-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
              <GitBranch className="w-3.5 h-3.5" />
              <span>논문 ① 데이터 구조화 · 『사림』 제97호 (2026. 7)</span>
            </div>
            <span className="text-xs font-mono-code text-slate-400">
              이현주(제1저자)·이상동(교신저자), 「역사 데이터의 온톨로지 기반 지식 그래프 구축 ― 『조선왕조실록』의 대명 사행 기록을 중심으로 ―」
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif-kr text-white">
            1단계: 비정형 사료를 어떻게 컴퓨터가 이해하는 ‘관계망’으로 바꿀 것인가?
          </h2>

          {/* 교수님 강의 낭독 대본 2 */}
          {showScript && (
            <div className="rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900/90 to-slate-900/90 border-l-4 border-sky-400 p-6 shadow-xl">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Mic className="w-4 h-4" />
                <span>교수님 강의 낭독 대본 #2 — 온톨로지와 지식 그래프(2026 논문)</span>
              </div>
              <div className={`text-slate-100 space-y-3 ${scriptSizeClass}`}>
                <p>
                  “시뮬레이션을 돌리려면 먼저 서술형 텍스트로 된 역사 사료를 컴퓨터가 계산하고 탐색할 수 있는 구조화된 데이터로 바꿔야 합니다. 이현주·이상동 두 분 선생님의 2026년 논문은 『조선왕조실록』에 나오는 대명 사행(명나라에 사신을 파견한 기록)을 어떻게 <strong>온톨로지(Ontology)와 지식 그래프(Knowledge Graph)</strong>로 구축하는지 보여줍니다.”
                </p>
                <p>
                  “여기서 아주 중요한 역사학적 통찰이 나옵니다. 실록에는 <em>‘사신을 보냈다’</em>, <em>‘명에 다녀왔다’</em>, <em>‘사신이 돌아왔다’</em>처럼 하나의 외교 사행이 여러 날짜의 기사에 뿔뿔이 흩어져 기록되어 있습니다. 그래서 연구팀은 단순한 인물 목록이 아니라 <strong>‘사행 사건(MissionEvent)’을 중심 허브로 놓는 사건 중심(Event-centric) 모델</strong>을 설계했습니다. 또한 한 인물이 이번 사행에는 서장관으로 갔다가 다음 사행에는 정사로 갈 수 있기 때문에, <strong>역할(Role)을 인물(Person)에서 분리</strong>해 모델링했습니다.”
                </p>
                <p>
                  “아래 다이어그램의 노드를 클릭해 보시면, 1393년 태조 2년에 김입견이 하성절사로 파견되어 조선을 출발(FROM)해 요동을 경유(VIA)하고 경사에 도착(TO)하는 과정이 어떻게 주어-서술어-목적어의 <strong>RDF 삼중구조(Triple)</strong>와 <strong>Neo4j 그래프 데이터베이스</strong>로 변환되는지 한눈에 보실 수 있습니다.”
                </p>
              </div>
            </div>
          )}

          {/* ETL 파이프라인 + 인터랙티브 지식 그래프 2단 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 좌측: 4단계 ETL 아키텍처 (그림 1 & 그림 3 요약) */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-sky-300 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                전체 시스템 아키텍처 (4단계 ETL 파이프라인)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-mono-code text-sky-400 font-semibold">STEP 1 · 원자료 및 정형 데이터셋 구축</div>
                  <p className="text-slate-300">
                    『조선왕조실록』 대명 사행 기록을 추출하여 <code className="text-amber-300">Ming_envoy.xlsx</code> 엑셀 표로 전사 후 Pandas <code className="text-amber-300">read_excel()</code>로 로드.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-mono-code text-sky-400 font-semibold">STEP 2 · Python (run.py) ETL 정제 및 RDF 직렬화</div>
                  <ul className="text-slate-300 space-y-1 list-disc list-inside">
                    <li><code className="text-emerald-300">parse_date()</code>: 왕대·연호 → 서기 연도 환산</li>
                    <li><code className="text-emerald-300">classify_title()</code>: 칭호 분류(사행명 / 관직명)</li>
                    <li><code className="text-emerald-300">place_country()</code>: 지명별 국가 분류 (이칭인 <strong>京師·北京·京城은 임의 통합하지 않고 당대 표기 보존</strong>)</li>
                    <li><code className="text-emerald-300">build_ontology()</code> & <code className="text-emerald-300">build_instances()</code>: W3C 표준 <strong>RDF Triple (주어-서술어-목적어)</strong> 생성 (Turtle / JSON-LD / N-Triples)</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-mono-code text-sky-400 font-semibold">STEP 3 · Neo4j 그래프 DB 적재 (n10s & merge)</div>
                  <p className="text-slate-300">
                    분산된 파견·도착·귀환 기사를 날짜·핵심인물·목적 기준으로 <strong>정합화(Reconciliation)</strong>하여 단일 <code className="text-amber-300">MissionEvent</code> 노드로 병합.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-mono-code text-sky-400 font-semibold">STEP 4 · Bolt 프로토콜 및 Cypher 질의 분석</div>
                  <p className="text-slate-300">
                    Neo4j Browser에서 <code className="text-purple-300">MATCH / UNWIND</code> 질의로 특정 인물의 반복 사행 참여, 외교 거점 경로, 시기별 연결망 탐색.
                  </p>
                </div>
              </div>
            </div>

            {/* 우측: 사건 중심 지식 그래프 인터랙티브 뷰 (그림 2, 그림 4, 그림 5) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Network className="w-4 h-4 text-amber-400" />
                    사건 중심(Event-centric) 지식 그래프 모델 (클릭하여 탐색)
                  </h3>
                  <span className="text-xs text-slate-400">논문 &lt;그림 2, 4, 5&gt; 재구성</span>
                </div>

                {/* 인터랙티브 노드 다이어그램 */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* 좌: Person 노드 */}
                    <button
                      onClick={() => setSelectedKgNode('person')}
                      className={`p-4 rounded-xl border text-left transition transform hover:-translate-y-0.5 ${
                        selectedKgNode === 'person'
                          ? 'bg-sky-950/60 border-sky-400 ring-2 ring-sky-500/30'
                          : 'bg-slate-900/80 border-slate-800 hover:border-sky-500/50'
                      }`}
                    >
                      <div className="text-[11px] font-mono-code text-sky-400">:Person (인물)</div>
                      <div className="text-base font-bold text-white mt-0.5">김입견 (金立堅)</div>
                      <div className="text-xs text-slate-400 mt-1">출생: 1340년 / 역할 분리</div>
                      <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-mono-code px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                        PARTICIPATED_IN →
                      </div>
                    </button>

                    {/* 중: MissionEvent 허브 노드 */}
                    <button
                      onClick={() => setSelectedKgNode('event')}
                      className={`p-4 rounded-xl border text-left transition transform hover:-translate-y-0.5 ${
                        selectedKgNode === 'event'
                          ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-500/30'
                          : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="text-[11px] font-mono-code text-amber-400">:MissionEvent (중심 사건)</div>
                      <div className="text-base font-bold text-white mt-0.5">賀聖節使, 1393</div>
                      <div className="text-xs text-slate-300 mt-1">태조 2년 8월 2일</div>
                      <div className="text-[11px] text-amber-300/90 mt-1 font-mono-code">
                        role: 賀聖節使
                      </div>
                    </button>

                    {/* 우: Reign & Place 노드들 */}
                    <div className="space-y-2.5">
                      <button
                        onClick={() => setSelectedKgNode('reign')}
                        className={`w-full p-3 rounded-xl border text-left transition ${
                          selectedKgNode === 'reign'
                            ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-500/30'
                            : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono-code text-purple-400">--IN_REIGN--&gt; :Reign</span>
                          <span className="text-xs font-bold text-white">태조 (太祖)</span>
                        </div>
                      </button>

                      <button
                        onClick={() => setSelectedKgNode('places')}
                        className={`w-full p-3 rounded-xl border text-left transition ${
                          selectedKgNode === 'places'
                            ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-500/30'
                            : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50'
                        }`}
                      >
                        <div className="text-[11px] font-mono-code text-emerald-400 mb-1">
                          --FROM / VIA / TO--&gt; :Place
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-200 font-semibold">
                          <span>朝鮮(출발)</span>
                          <ArrowRight className="w-3 h-3 text-emerald-400" />
                          <span>遼東(경유)</span>
                          <ArrowRight className="w-3 h-3 text-emerald-400" />
                          <span>京師(도착)</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 선택된 노드의 RDF Triple & 온톨로지 속성 상세 */}
              <div className={`rounded-xl border p-4 space-y-3 ${kgNodeDetails[selectedKgNode].color}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code font-bold uppercase">
                    {kgNodeDetails[selectedKgNode].badge}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {kgNodeDetails[selectedKgNode].title}
                  </span>
                </div>

                <div className="bg-slate-950/90 rounded-lg p-3 font-mono-code text-xs text-slate-200 space-y-1">
                  {kgNodeDetails[selectedKgNode].triples.map((t, idx) => (
                    <div key={idx} className="truncate">• {t}</div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {kgNodeDetails[selectedKgNode].attributes.map((attr, idx) => (
                    <div key={idx} className="bg-slate-950/60 rounded p-2 border border-slate-800/80">
                      <span className="font-mono-code text-slate-400 block text-[11px]">{attr.k}</span>
                      <span className="text-slate-200 font-medium">{attr.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            PART 2-2. 논문 ② 시스템 역학(SDM)과 전염병(황기우·이상동 외, 2025)
        ===================================================================== */}
        <section id="paper2" className="scroll-mt-20 space-y-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>논문 ② 거시사 시뮬레이션 (SDM) · 『한국사학사학보』 제51집 (2025. 6)</span>
            </div>
            <span className="text-xs font-mono-code text-slate-400">
              황기우·이상동·양재혁·박충식, 「시스템 역학(System Dynamics)을 활용한 역사 연구의 특징 - 전염병과 역사의 관계를 예시로 -」
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif-kr text-white">
            2단계: 거시적 구조와 함수 관계로 ‘역사 실험(History Experiment)’ 수행하기
          </h2>

          {/* 교수님 강의 낭독 대본 3 */}
          {showScript && (
            <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-900/90 border-l-4 border-amber-400 p-6 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Mic className="w-4 h-4" />
                <span>교수님 강의 낭독 대본 #3 — 시스템 역학(SDM)과 포스탄 테제 검증(2025 논문)</span>
              </div>
              <div className={`text-slate-100 space-y-3 ${scriptSizeClass}`}>
                <p>
                  “두 번째로 살펴볼 황기우·이상동·양재혁·박충식 교수님의 2025년 논문은 거시사를 재현하는 <strong>시스템 역학 모델(System Dynamics Model, SDM)</strong>을 다룹니다. 원래 시뮬레이션은 1945년 원자폭탄 실험을 위한 몬테카를로 방법에서 출발해 ‘현재의 조건으로 미래를 예측’하는 기법이었기 때문에, 이미 지나간 과거를 다루는 역사학계에서는 거부감이 있었습니다.”
                </p>
                <p>
                  “하지만 논문은 중요한 인식론적 전환을 제시합니다. 시뮬레이션에서 <strong>인간(역사가)의 행위는 오직 ‘조건(요소 선택)’까지만 허용되고, 그 ‘결과’는 전적으로 컴퓨터 알고리즘이 책임진다</strong>는 것입니다. 즉 현재와 미래의 관계를 ‘과거의 조건과 역사적 사건’의 관계로 옮기면, 역사가들의 서로 다른 주장을 알고리즘으로 검증하는 <strong>‘역사 실험(History Experiment)’</strong>이 가능해집니다.”
                </p>
                <p>
                  “연구팀은 이를 통해 유명한 <strong>포스탄(M. M. Postan)의 테제</strong>—즉 14세기 중반 흑사병으로 인구가 급감하자 노동력 부족과 한계생산성 향상, 곡물가 하락이 맞물려 농노의 실질 소득이 증가했다는 가설—를 SDM과 전염병학의 <strong>SIR 모델</strong>로 재현했습니다. 그 결과 기존 역사가들이 단순한 1회성 인구 급감으로만 생각했던 흑사병이 시뮬레이션 내에서는 <strong>‘3번의 파고(Three Waves)’</strong>를 그리며 점차 적응해 가는 <strong>‘역사적 창발성(Emergence)’</strong>을 보여주었습니다. 논문 맺음말의 표현처럼, 포스트모더니즘 이후 이야기 속에 매장되었던 <strong>‘구조주의 역사관’에 복잡계 알고리즘이 새로운 생명력</strong>을 불어넣은 것입니다.”
                </p>
              </div>
            </div>
          )}

          {/* SDM 4대 구성 요소 & 층위별 가중치 / 수식 카드 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SDM 4대 구성 요소 (자료 1 & 자료 2 동막골 콜레라 예시) */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  시스템 역학(SDM)의 4대 실체와 동막골 모델
                </h3>
                <span className="text-xs text-slate-400">논문 &lt;자료 1, 2&gt;</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/30">
                  <div className="font-mono-code font-bold text-sky-400">1. Stock (스톡 · 그릇)</div>
                  <p className="text-slate-300 mt-1">
                    시뮬레이션 요소를 담는 그릇. 예: <strong>‘동막골 사람들 A·B’</strong> (인구수, 성비, 연령 분포, 농업 생산량 등 속성 보유)
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                  <div className="font-mono-code font-bold text-emerald-400">2. Flow (플로우 · 흐름)</div>
                  <p className="text-slate-300 mt-1">
                    시간에 따라 스톡의 상태가 변하는 과정. 예: <strong>감염 가능자(S) → 감염자(I) → 회복/사망자(R)</strong>로의 상태 전이(SIR 모델)
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30">
                  <div className="font-mono-code font-bold text-amber-400">3. Variables (변수)</div>
                  <p className="text-slate-300 mt-1">
                    동적 상태나 고정값. 예: <strong>‘콜레라/흑사병’</strong>의 병리학적 전염률, 치명률, 회복률 및 자연 출생률
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30">
                  <div className="font-mono-code font-bold text-purple-400">4. Links (링크 · 연결)</div>
                  <p className="text-slate-300 mt-1">
                    요소 간 정보 전달과 피드백 루프(Jay Forrester). 인구 변화 → 농업 생산량 → 고용 조건으로 이어지는 연쇄 작용
                  </p>
                </div>
              </div>

              {/* 양적 데이터 부재 시 층위별 비례식 & 한계생산성 함수식 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-200">
                  양적 데이터 보완을 위한 층위별 가중치 및 가공 데이터(한계생산성 함수식)
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                    흑사병 (+강) →
                  </span>
                  <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold">
                    곡물 가격 (-강) →
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    한계생산성 (+약) →
                  </span>
                  <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                    곡물생산량 (-중) →
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold">
                    농노의 실질 소득
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs text-slate-400">
                    John Hatcher(2008) 기반 노동자 900명 기준 1인당 한계생산성 함수:
                  </div>
                  <div className="font-mono-code text-xs sm:text-sm text-amber-300 bg-amber-950/30 px-3 py-1.5 rounded border border-amber-500/30">
                    f(n) = -(1/405000)n² + (1/450)n + 1
                  </div>
                </div>
              </div>
            </div>

            {/* 우측: 윈체스터 주교구 내 임금과 곡물 가격 실증 데이터 (자료 4) */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  영국 윈체스터 주교구 내 임금과 곡물 가격 (1300~1479)
                </h3>
                <span className="text-xs text-slate-400">논문 &lt;자료 4&gt; 실증 환경 데이터</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono-code">
                      <th className="py-2 px-2">연도</th>
                      <th className="py-2 px-2">임금(펜스)</th>
                      <th className="py-2 px-2">임금(%)</th>
                      <th className="py-2 px-2">곡물가(펜스)</th>
                      <th className="py-2 px-2">곡물가(%)</th>
                      <th className="py-2 px-2">역사적 맥락</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {winchesterData.map((row, idx) => (
                      <tr
                        key={idx}
                        className={
                          row.period === '1340-59' || row.period === '1380-99'
                            ? 'bg-amber-500/10 text-amber-200 font-medium'
                            : 'text-slate-300'
                        }
                      >
                        <td className="py-2 px-2 font-mono-code font-semibold">{row.period}</td>
                        <td className="py-2 px-2 font-mono-code">{row.wagePence}</td>
                        <td className="py-2 px-2 font-mono-code text-emerald-400 font-bold">{row.wagePct}%</td>
                        <td className="py-2 px-2 font-mono-code">{row.grainPence}</td>
                        <td className="py-2 px-2 font-mono-code text-sky-400">{row.grainPct}%</td>
                        <td className="py-2 px-2 text-[11px] text-slate-400">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                * 핵심 발견: SDM에 SIR 전염병 모델을 결합한 결과(&lt;자료 7, 8&gt;), 흑사병은 1회성 사건이 아니라 <strong>3번의 파고(정점)</strong>로 나타났으며, 발병 후 60~80년 뒤 세대는 피해와 적응 양상이 달랐음(<strong>역사적 창발성</strong>).
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================================
            PART 2-3. 논문 ③ 행위자기반모델(ABM) 시뮬레이션 (이상동, 2024)
        ===================================================================== */}
        <section id="paper3" className="scroll-mt-20 space-y-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>논문 ③ 미시사 시뮬레이션 (ABM) · 『역사학보』 제264집 (2024. 12)</span>
            </div>
            <span className="text-xs font-mono-code text-slate-400">
              이상동, 「역사 연구 방법론의 변화와 행위자기반모델 시뮬레이션의 가능성」
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif-kr text-white">
            3단계: 자율적이고 이질적인 미시적 행위자(Agent)들의 상호작용 모델링
          </h2>

          {/* 교수님 강의 낭독 대본 4 */}
          {showScript && (
            <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-slate-900/90 border-l-4 border-emerald-400 p-6 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Mic className="w-4 h-4" />
                <span>교수님 강의 낭독 대본 #4 — 행위자기반모델(ABM)과 노동자 법령(2024 논문)</span>
              </div>
              <div className={`text-slate-100 space-y-3 ${scriptSizeClass}`}>
                <p>
                  “그렇다면 거시적 함수 관계만으로는 포착할 수 없는 당대 인간들의 미시적인 선택과 갈등은 어떻게 다룰까요? 이상동 교수님의 2024년 『역사학보』 논문은 바로 <strong>행위자기반모델(Agent-Based Model, ABM)</strong>을 제시합니다.”
                </p>
                <p>
                  “ABM에서 ‘행위자(Agent)’는 다섯 가지 특징을 가집니다. <strong>자율성, 이질성, 목적 지향성, 상호작용, 그리고 학습과 유연성</strong>입니다. 똑같은 흑사병 직후의 잉글랜드 노동자라 하더라도, 부양가족이 많은 ‘노동자 A’와 부양가족이 적은 ‘노동자 B’는 이질적인 존재입니다. 노동자 A는 가족을 먹여 살리기 위해 더 많은 임금을 주는 영주를 찾아 이동할 가능성이 훨씬 높습니다.”
                </p>
                <p>
                  “여기에 국왕(권력 당국)이 1349년 노동자 조례와 1351년 노동자 법령을 반포해 임금 인상을 법으로 금지하고 처벌하려 합니다. 이때 ABM 시뮬레이션을 돌려보면 아주 흥미로운 상호작용이 나타납니다. 왕실의 단속이 약하면 영주가 법정 기준보다 높은 현금 임금을 주지만, <strong>왕실의 규제가 강하면 영주는 표면적으로 법정 화폐 임금을 지키는 척하면서 실제로는 식량이나 토지 같은 ‘현물 보상’으로 노동 가치를 우회 지급</strong>합니다. 이처럼 당대 법령에서 행동 규칙을 가져오는 <strong>연역적 방법</strong>과 실제 사료 데이터로 모델의 정합성을 검증하는 <strong>귀납적 방법</strong>이 ABM 안에서 하나로 결합됩니다.”
                </p>
              </div>
            </div>
          )}

          {/* ABM 5대 특징 & 7단계 설계 프로세스 + SDM vs ABM 비교표 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 좌측: 행위자 5대 특성 및 흑사병 노동 시장 3주체 상호작용 */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                행위자(Agent)의 5대 특징과 14세기 잉글랜드 3주체 설계
              </h3>

              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  '① 자율성 (Autonomy)',
                  '② 이질성 (Heterogeneity)',
                  '③ 목적 지향성 (Goal-directed)',
                  '④ 상호작용 (Interaction)',
                  '⑤ 유연성·학습 (Flexibility)'
                ].map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30">
                  <div className="font-bold text-rose-300">권력 당국 (국왕 · 1349 노동자 조례 / 1351 노동자 법령)</div>
                  <p className="text-slate-300 mt-1">
                    <strong>행동 규칙(연역적 기반):</strong> 흑사병 이전 수준으로 임금 상승을 억제하고 위반자를 처벌하고자 함.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30">
                  <div className="font-bold text-amber-300">고용주 (영주 · 토지 소유주)</div>
                  <p className="text-slate-300 mt-1">
                    <strong>행동 규칙 & 상호작용:</strong> 부족한 농업 노동력을 어떻게든 확보해야 함. 당국의 규제가 약하면 법정 기준 초과 현금 지급, <strong>규제가 강하면 법정 임금을 준수하되 현물(곡물·토지 등)로 우회 보상</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/30">
                  <div className="font-bold text-sky-300">이질적 노동자 집단 (노동자 A vs 노동자 B · 자유/반자유/비자유민)</div>
                  <p className="text-slate-300 mt-1">
                    <strong>속성 차이:</strong> 부양가족이 많은 <strong>노동자 A</strong>는 부양가족이 적은 <strong>노동자 B</strong>보다 고임금 고용주를 찾아 지역 내 이동할 확률이 훨씬 높음.
                  </p>
                </div>
              </div>
            </div>

            {/* 우측: SDM vs ABM 비교 및 ABM 설계 7단계 */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                시스템 다이나믹스(SDM) vs 행위자기반모델(ABM) 상호보완성
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 px-2">비교 기준</th>
                      <th className="py-2 px-2 text-amber-400">시스템 역학 (SDM)</th>
                      <th className="py-2 px-2 text-emerald-400">행위자기반모델 (ABM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2 px-2 font-semibold text-white">분석 스케일</td>
                      <td className="py-2 px-2">거시사(Macro) · 전체 집단의 집합적 동작</td>
                      <td className="py-2 px-2">미시사(Micro) · 개별 행위자의 자율적 행동</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-semibold text-white">작동 원리</td>
                      <td className="py-2 px-2">Stock, Flow, 피드백 루프와 수학적 함수식</td>
                      <td className="py-2 px-2">개별 행위자의 고유 속성·행동 규칙·상호작용</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-semibold text-white">도시 토지 예시</td>
                      <td className="py-2 px-2">인간 영역 ↔ 토지 사용 ↔ 자연환경 피드백(Haase)</td>
                      <td className="py-2 px-2">토지주·기업·가정의 생애주기(결혼·출산·이직) 결정</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-semibold text-white">강점과 한계</td>
                      <td className="py-2 px-2">장기 추세 파악에 강점 / 돌발 변수·내부 구조 설명 한계</td>
                      <td className="py-2 px-2">데이터 부재 시에도 보편/특수 행동 규칙으로 재현 가능</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="font-bold text-emerald-400">ABM 설계 시 필수 고려 7단계 (특히 1·6·7단계가 과학성의 핵심)</div>
                <p className="text-slate-300 leading-relaxed">
                  <strong>① 해결할 역사적 문제 명확화</strong> → ② 행위자 및 이질적 속성 설계 → ③ 지리·물리적 환경 공간 설정(SNS 같은 추상적 행동 공간 지양) → ④ 행동 규칙 설정(연역적) → ⑤ 행위자 간 상호작용 설정 → <strong>⑥ 실제 사료 데이터 확보</strong> → <strong>⑦ 과거 사실과의 정합성·타당성 검증(귀납적, 역사 왜곡 방지)</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            PART 3. 실시간 역사 실험실 (Live Sandbox: SDM + ABM 통합 시뮬레이터)
        ===================================================================== */}
        <section id="sandbox" className="scroll-mt-20 space-y-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
              <Sliders className="w-3.5 h-3.5" />
              <span>PART 3 · 인터랙티브 역사 실험실 (History Experiment Sandbox)</span>
            </div>
            <button
              onClick={() => {
                setLaborCount(600);
                setPlagueSeverity(65);
                setStatuteStrictness(70);
              }}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기 조건 복원</span>
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif-kr text-white">
            실시간 역사 실험: 조건(변수)을 바꾸면 알고리즘의 결과는 어떻게 달라지는가?
          </h2>

          {/* 교수님 강의 낭독 대본 5 */}
          {showScript && (
            <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-slate-900/90 border-l-4 border-purple-400 p-6 shadow-xl">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Mic className="w-4 h-4" />
                <span>교수님 강의 낭독 대본 #5 — 실시간 시뮬레이터 시연 멘트</span>
              </div>
              <div className={`text-slate-100 space-y-3 ${scriptSizeClass}`}>
                <p>
                  “자, 이제 논문 속에 있던 수식과 그래프를 우리가 직접 움직여 보겠습니다. 왼쪽 슬라이더 세 개가 바로 역사가가 설정하는 <strong>‘과거의 조건’</strong>이고, 오른쪽 그래프와 지표가 컴퓨터 알고리즘이 산출하는 <strong>‘역사 실험의 결과’</strong>입니다.”
                </p>
                <p>
                  “첫 번째 슬라이더로 노동자 수 <em>n</em>을 줄여보면 존 해처의 이차함수 공식에 따라 1인당 한계생산성이 실시간으로 계산됩니다. 두 번째 슬라이더로 흑사병의 병리학적 충격을 조절해 보면, 오른쪽 그래프에서 <strong>붉은색 감염자 곡선이 3번의 파고(Three Waves)</strong>를 일으키며 인구가 요동치고, 그럼에도 불구하고 파란색과 초록색으로 표시된 농노의 실질 소득(Total Wealth)은 장기적으로 우상향하는 창발적 패턴을 확인할 수 있습니다.”
                </p>
                <p>
                  “세 번째 슬라이더인 <strong>‘1351년 노동자 법령 규제 강도’</strong>를 끝까지 올려보겠습니다. 국왕이 임금 인상을 강력히 탄압하자, 명목 화폐 임금 상승률은 떨어지지만 영주들이 노동력을 붙잡기 위해 <strong>현물·토지로 우회 보상하는 비율이 급격히 치솟는 ABM의 미시적 역학</strong>이 그대로 재현됩니다.”
                </p>
              </div>
            </div>
          )}

          {/* 시뮬레이터 컨트롤 + 차트 2단 구성 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 좌측: 3대 조건 슬라이더 패널 */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                역사가의 조건 설정 (Input Parameters)
              </h3>

              {/* 슬라이더 1: 노동자 수 n */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">1. 장원 내 농업 노동자 수 (n)</span>
                  <span className="font-mono-code font-bold text-amber-400">{laborCount}명 (기준 900명)</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="900"
                  step="10"
                  value={laborCount}
                  onChange={(e) => setLaborCount(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400">산출된 1인당 한계생산성 f(n):</span>
                  <span className="font-mono-code font-bold text-sm text-emerald-400">{marginalProductivity}</span>
                </div>
              </div>

              {/* 슬라이더 2: 흑사병 병리학적 충격 */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">2. 흑사병(SIR) 병리학적 전파·치명률</span>
                  <span className="font-mono-code font-bold text-rose-400">{plagueSeverity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  step="5"
                  value={plagueSeverity}
                  onChange={(e) => setPlagueSeverity(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  * SIR 미분방정식 모델에 따라 1차(16년경)·2차(40년경 최대 정점)·3차(70년경) 파고의 진폭을 결정합니다.
                </p>
              </div>

              {/* 슬라이더 3: 1351 노동자 법령 규제 강도 */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">3. 1351년 노동자 법령(왕실 규제 강도)</span>
                  <span className="font-mono-code font-bold text-sky-400">{statuteStrictness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={statuteStrictness}
                  onChange={(e) => setStatuteStrictness(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  * 규제가 강할수록 영주는 법정 화폐 임금을 지키는 대신 식량·토지 등 현물 우회 보상을 늘립니다(이상동, 2024).
                </p>
              </div>

              {/* ABM 미시 행동 결과 요약 바 */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">명목 화폐 임금 상승압력</div>
                  <div className="text-lg font-bold font-mono-code text-amber-400 mt-0.5">+{abmMetrics.cashWageRise}%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">영주의 현물 우회 보상률</div>
                  <div className="text-lg font-bold font-mono-code text-emerald-400 mt-0.5">{abmMetrics.inKindCompensation}%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">노동자 A(대가족) 이동률</div>
                  <div className="text-lg font-bold font-mono-code text-sky-400 mt-0.5">{abmMetrics.workerAMobility}%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">노동자 B(소규모) 이동률</div>
                  <div className="text-lg font-bold font-mono-code text-slate-300 mt-0.5">{abmMetrics.workerBMobility}%</div>
                </div>
              </div>
            </div>

            {/* 우측: SDM 100년 시계열 창발성 그래프 (자료 7 & 자료 8 통합 시각화) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">
                    SDM 100년 시뮬레이션 결과: 흑사병 3차 파고와 농노 실질 소득(Total Wealth)
                  </h3>
                  <p className="text-xs text-slate-400">
                    황기우·이상동 외(2025) &lt;자료 7: 흑사병에 의한 인구 변화&gt; 및 &lt;자료 8: 농노 소득 변화&gt; 인터랙티브 재현
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                    감염 가능 인구(S)
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                    흑사병 감염 파고(I · 3 Waves)
                  </span>
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span>
                    농노 평균 실질소득
                  </span>
                </div>
              </div>

              {/* SVG 시계열 차트 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <svg viewBox="0 0 640 280" className="w-full h-64 overflow-visible">
                  {/* 배경 그리드 라인 */}
                  {[0, 1, 2, 3, 4].map((g) => (
                    <g key={g}>
                      <line
                        x1="40"
                        y1={30 + g * 50}
                        x2="610"
                        y2={30 + g * 50}
                        stroke="#1e293b"
                        strokeDasharray="4 4"
                      />
                      <text x="8" y={34 + g * 50} fill="#64748b" fontSize="10">
                        {320 - g * 70}
                      </text>
                    </g>
                  ))}

                  {/* X축 연도 라벨 */}
                  {[0, 20, 40, 60, 80, 100].map((yr) => {
                    const x = 40 + (yr / 100) * 570;
                    return (
                      <text key={yr} x={x - 10} y="255" fill="#94a3b8" fontSize="11">
                        {yr}년
                      </text>
                    );
                  })}

                  {/* 3번의 파고 하이라이트 영역 표시 */}
                  <rect x={40 + (12 / 100) * 570} y="20" width="45" height="210" fill="#f43f5e" fillOpacity="0.06" />
                  <rect x={40 + (35 / 100) * 570} y="20" width="60" height="210" fill="#f43f5e" fillOpacity="0.10" />
                  <rect x={40 + (65 / 100) * 570} y="20" width="50" height="210" fill="#f43f5e" fillOpacity="0.05" />

                  <text x={40 + (13 / 100) * 570} y="35" fill="#fb7185" fontSize="10" fontWeight="bold">1차 파고</text>
                  <text x={40 + (36 / 100) * 570} y="35" fill="#f43f5e" fontSize="10" fontWeight="bold">2차 대파고(창발성)</text>
                  <text x={40 + (66 / 100) * 570} y="35" fill="#fb7185" fontSize="10" fontWeight="bold">3차 파고(적응기)</text>

                  {/* 1) 감염 가능 인구(Susceptible) 폴리라인 */}
                  <polyline
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2.5"
                    points={simulationSeries
                      .map((p) => {
                        const x = 40 + (p.year / 100) * 570;
                        const y = 230 - (p.pop / 320) * 200;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* 2) 흑사병 감염자(Infected - 3 Waves) 폴리라인 */}
                  <polyline
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    points={simulationSeries
                      .map((p) => {
                        const x = 40 + (p.year / 100) * 570;
                        const y = 230 - (p.infected / 320) * 200;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* 3) 농노 평균 실질 소득(Avg Wealth) 폴리라인 */}
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    points={simulationSeries
                      .map((p) => {
                        const x = 40 + (p.year / 100) * 570;
                        const y = 230 - ((p.avgWealth * 3.2) / 320) * 200;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* 4) 상위 건강·연령 집단 소득(Top Wealth E) 점선 */}
                  <polyline
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="1.8"
                    strokeDasharray="5 3"
                    points={simulationSeries
                      .map((p) => {
                        const x = 40 + (p.year / 100) * 570;
                        const y = 230 - ((p.topWealth * 3.0) / 320) * 200;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 space-y-1">
                <div className="font-bold text-amber-300">시뮬레이션 판독 요약 (포스탄 테제 검증 결과)</div>
                <p className="leading-relaxed">
                  • <strong>역사적 창발성(Emergence):</strong> 단순 감소로만 알았던 인구가 SIR 모델과 결합하자 <strong>3번의 파고(16년·40년·70년경)</strong>를 보이며, 60~80년 뒤 세대는 병리학적 적응과 개선된 노동 조건 속에서 살아감. <br />
                  • <strong>조건과 결과의 부합:</strong> 농노의 실질 소득(파란 실선 및 초록 점선)은 흑사병 이전보다 유의미하게 상승하여 포스탄이 제시한 조건과 결과가 알고리즘상 상호 부합함을 입증함.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            PART 4. 내가 만든 서양사·세계사 시뮬레이션 SW 아카이브 쇼케이스
        ===================================================================== */}
        <section id="mysw" className="scroll-mt-20 space-y-6 pt-6 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <Code2 className="w-3.5 h-3.5" />
              <span>PART 4 · 이론에서 실천으로: 내가 만든 역사 시뮬레이션 SW 쇼케이스</span>
            </div>
            <span className="text-xs font-mono-code text-slate-400">
              React · Node.js · Docker · Oracle Cloud ARM · Vibe Coding & Software History
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif-kr text-white">
            사변적 텍스트를 넘어 ‘작동하는 코드’로 육화된 소프트웨어 역사학
          </h2>

          {/* 교수님 강의 낭독 대본 6 */}
          {showScript && (
            <div className="rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-slate-900/90 border-l-4 border-rose-400 p-6 shadow-xl">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Mic className="w-4 h-4" />
                <span>교수님 강의 낭독 대본 #6 — 직접 제작한 SW 시연 소개 멘트</span>
              </div>
              <div className={`text-slate-100 space-y-3 ${scriptSizeClass}`}>
                <p>
                  “지금까지 이상동 교수님 연구팀의 논문 세 편을 통해 지식 그래프, 시스템 역학(SDM), 그리고 행위자기반모델(ABM)의 원리를 살펴보았습니다. 그렇다면 역사가가 이 방법론들을 직접 코드로 짜서 웹 애플리케이션으로 구축하면 어떤 모습이 될까요?”
                </p>
                <p>
                  “아래 네 가지 프로젝트는 제가 직접 리액트(React)와 도커(Docker)를 활용해 오라클 클라우드 서버에 배포해 둔 <strong>역사 시뮬레이션 소프트웨어</strong>들입니다. 첫 번째 <strong>‘대항해시대 은 무역망 시뮬레이터(silver.soohwalee.com)’</strong>는 주경철 교수님의 『대항해시대』를 바탕으로 포토시 은광부터 명나라까지 흐르는 은의 물동량(Stock & Flow)과 ‘짚인간 에이전트’를 결합한 시뮬레이터입니다.”
                </p>
                <p>
                  “두 번째 <strong>‘예수회 과학 네트워크와 도그마(jsn / dogma.soohwalee.com)’</strong>는 서양 근대 초 예수회 학자들의 지식 그래프 소스코드를 리버스 엔지니어링하며 교리와 과학의 상호작용을 추적한 작업이고, 세 번째 <strong>‘1944 발지 전투 아카이브(bulge.soohwalee.com)’</strong>는 아르덴 전장의 지리·물리적 환경 위에 실제 기갑 장비의 물성과 전술 브리핑을 결합한 공간 아카이브입니다. 하나씩 새 창으로 띄워서 실제 작동하는 모습을 보여드리겠습니다.”
                </p>
              </div>
            </div>
          )}

          {/* SW 4종 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mySwList.map((sw) => (
              <div
                key={sw.id}
                className={`rounded-2xl bg-gradient-to-br ${sw.accent} bg-slate-900/90 border p-6 flex flex-col justify-between space-y-5 shadow-lg`}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono-code px-2.5 py-1 rounded-md bg-slate-950/80 text-slate-200 border border-slate-700">
                      {sw.badge}
                    </span>
                    <span className="text-xs font-mono-code text-slate-400">{sw.domain}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white leading-snug">{sw.title}</h3>
                  <p className="text-xs text-amber-300/90 font-medium">{sw.inspiration}</p>

                  <ul className="space-y-2 text-xs text-slate-200 pt-1">
                    {sw.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-white block mb-0.5">🔗 이상동 교수 연구팀 논문과의 방법론적 연결:</span>
                    {sw.paperLink}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={sw.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${sw.btnColor}`}
                    >
                      <Globe className="w-4 h-4" />
                      <span>{sw.domain.split(' ')[0]} 라이브 시연 열기</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {sw.subUrl && (
                      <a
                        href={sw.subUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition"
                      >
                        <Terminal className="w-4 h-4 text-sky-400" />
                        <span>dogma.soohwalee.com 열기</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================================
            PART 5. 에필로그: 강의를 마무리하며 (역사철학적 종합)
        ===================================================================== */}
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-amber-400 uppercase">
            <BookOpen className="w-4 h-4" />
            <span>Epilogue · 문학과 과학의 경계에서 구조주의의 부활로</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-kr text-white">
            과거를 ‘읽는(Reading)’ 역사학에서, 과거를 ‘실행하는(Executing)’ 역사학으로
          </h3>
          {showScript ? (
            <div className={`text-slate-200 space-y-3 ${scriptSizeClass}`}>
              <p>
                “오늘 내용을 정리하며 수업을 마무리하겠습니다. 역사는 늘 법칙성을 추구하는 과학과 우연성을 다루는 문학의 경계에서 줄타기를 해왔습니다. 포스트모더니즘 이후 역사학은 모든 것을 관찰자의 주관적 서사로 환원하며 ‘구조주의의 외투’를 벗어야 할 위기에 놓였습니다.”
              </p>
              <p>
                “하지만 오늘 살펴본 <strong>온톨로지 지식 그래프, 시스템 역학(SDM), 행위자기반모델(ABM)</strong>, 그리고 제가 직접 구현한 <strong>역사 시뮬레이션 웹앱들</strong>은 컴퓨터 기반 복잡계 이론을 통해 인간 역사가의 인지적 한계를 보완하고 거시 구조와 미시 행위자의 만남을 다시금 과학적인 실험대 위에 올려놓습니다. 사료를 텍스트로만 읽는 것을 넘어 소프트웨어로 직접 설계하고 실행해 보는 것, 그것이 바로 우리가 함께 탐구할 디지털 역사학의 미래입니다.”
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-300 leading-relaxed">
              온톨로지 기반 지식 그래프(이현주·이상동, 2026)로 비정형 사료를 관계망으로 구조화하고, 시스템 역학(황기우·이상동 외, 2025)과 행위자기반모델(이상동, 2024)로 거시적 창발성과 미시적 행위자의 상호작용을 실험하며, 이를 실제 웹 소프트웨어로 육화하는 과정은 역사가의 사고실험을 확장하고 구조주의 역사관에 새로운 생명력을 불어넣습니다.
            </p>
          )}
        </section>

      </main>
    </div>
  );
}