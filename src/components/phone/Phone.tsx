import { useEffect, useState } from "react";
import { ChevronLeft, Wifi, BatteryFull, Signal, Delete } from "lucide-react";
import { character } from "@/data/character";
import { APPS, type AppId } from "./apps";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function StatusBar({ dark }: { dark?: boolean }) {
  const now = useClock();
  const time = now ? now.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: false }) : "9:41";
  return (
    <div className={`absolute inset-x-0 top-0 z-40 flex h-12 items-center justify-between px-8 pt-1 text-[15px] font-semibold ${dark ? "text-[var(--ink)]" : "text-[var(--paper)]"}`}>
      <span>{time}</span>
      <div className="absolute left-1/2 top-2.5 h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-[var(--ink)]" />
      <span className="flex items-center gap-1">
        <Signal size={16} /> <Wifi size={16} /> <BatteryFull size={22} />
      </span>
    </div>
  );
}

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const now = useClock();
  const [mode, setMode] = useState<"lock" | "code">("lock");
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const len = character.passcode.length;

  const press = (d: string) => {
    if (code.length >= len) return;
    const next = code + d;
    setCode(next);
    if (next.length === len) {
      setTimeout(() => {
        if (next === character.passcode) onUnlock();
        else {
          setErr(true);
          setTimeout(() => { setErr(false); setCode(""); }, 450);
        }
      }, 120);
    }
  };

  const bg = { backgroundImage: `url(${character.wallpaper})`, backgroundSize: "cover", backgroundPosition: "center" };

  if (mode === "lock")
    return (
      <button onClick={() => setMode("code")} className="absolute inset-0 flex flex-col items-center text-[var(--paper)]" style={bg}>
        <div className="mt-20 text-lg font-medium">
          {now?.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}
        </div>
        <div className="text-[88px] font-bold leading-none tracking-tight">
          {now ? now.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: false }) : "9:41"}
        </div>
        <div className="glass mx-4 mt-8 flex w-[88%] items-center gap-3 rounded-2xl p-3 text-left">
          <img src={character.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
          <div className="min-w-0 text-sm">
            <div className="font-semibold">카카오톡 · 지우</div>
            <div className="truncate opacity-90">그럼 성수 카페 가자 ☕</div>
          </div>
        </div>
        <div className="mt-auto mb-10 animate-pulse text-sm opacity-90">탭하여 잠금 해제</div>
      </button>
    );

  return (
    <div className="absolute inset-0 flex flex-col items-center text-[var(--paper)]" style={bg}>
      <div className="glass absolute inset-0" />
      <div className="relative mt-24 text-lg">암호 입력</div>
      <div className="relative mt-1 text-xs opacity-80">힌트: {character.passcode}</div>
      <div className={`relative mt-5 flex gap-5 ${err ? "shake" : ""}`}>
        {Array.from({ length: len }).map((_, i) => (
          <span key={i} className={`h-3.5 w-3.5 rounded-full border-2 border-[var(--paper)] ${i < code.length ? "bg-[var(--paper)]" : ""}`} />
        ))}
      </div>
      <div className="relative mt-12 grid grid-cols-3 gap-x-6 gap-y-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button key={d} onClick={() => press(d)} className="key h-[76px] w-[76px] rounded-full text-3xl">{d}</button>
        ))}
        <span />
        <button onClick={() => press("0")} className="key h-[76px] w-[76px] rounded-full text-3xl">0</button>
        <button onClick={() => setCode(code.slice(0, -1))} className="flex items-center justify-center"><Delete /></button>
      </div>
      <button onClick={() => { setMode("lock"); setCode(""); }} className="relative mt-auto mb-10 text-sm">취소</button>
    </div>
  );
}

function Home({ open }: { open: (id: AppId) => void }) {
  const main = APPS.slice(0, 8);
  const dock: AppId[] = ["phone", "messages", "kakao", "music"];
  return (
    <div className="absolute inset-0" style={{ backgroundImage: `url(${character.wallpaper})`, backgroundSize: "cover" }}>
      <div className="glass mx-5 mt-16 flex items-center gap-3 rounded-3xl p-4 text-[var(--paper)]">
        <img src={character.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
        <div>
          <div className="text-lg font-bold">{character.name}</div>
          <div className="text-sm opacity-90">{character.status}</div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-4 gap-y-6 px-6">
        {main.map((a) => (
          <button key={a.id} onClick={() => open(a.id)} className="flex flex-col items-center gap-1.5 active:scale-90 transition">
            <span className={`${a.cls} flex h-[60px] w-[60px] items-center justify-center rounded-[16px] shadow-lg`}>{a.icon}</span>
            <span className="text-[11px] text-[var(--paper)] drop-shadow">{a.name}</span>
          </button>
        ))}
      </div>
      <div className="glass absolute inset-x-3 bottom-6 flex justify-around rounded-[32px] p-3">
        {dock.map((id) => {
          const a = APPS.find((x) => x.id === id)!;
          return (
            <button key={id} onClick={() => open(id)} className={`${a.cls} flex h-[60px] w-[60px] items-center justify-center rounded-[16px] active:scale-90 transition`}>{a.icon}</button>
          );
        })}
      </div>
    </div>
  );
}

export function Phone() {
  const [locked, setLocked] = useState(true);
  const [app, setApp] = useState<AppId | null>(null);
  const [backSignal, setBackSignal] = useState(0);
  const current = APPS.find((a) => a.id === app);
  const darkBar = !!current && current.lightUi;

  const goHome = () => setApp(null);

  return (
    <main className="stage flex min-h-[100dvh] items-center justify-center sm:p-8">
      <div className="phone-frame-wrap relative h-[100dvh] w-full overflow-hidden bg-[var(--ink)] sm:phone-frame sm:h-[844px] sm:max-h-[92vh] sm:w-[390px] sm:rounded-[54px]">
        <StatusBar dark={!locked && darkBar} />
        {locked ? (
          <LockScreen onUnlock={() => setLocked(false)} />
        ) : (
          <>
            <Home open={setApp} />
            {current && (
              <div key={current.id} className="app-in absolute inset-0 z-30 overflow-hidden bg-[var(--paper)]">
                <current.Component onExit={goHome} backSignal={backSignal} />
              </div>
            )}
          </>
        )}
        {/* 하단 내비게이션: 뒤로 / 홈 바 / 잠금 */}
        <div className="absolute inset-x-0 bottom-0 z-50 flex h-8 items-center justify-between px-6">
          <button aria-label="뒤로" onClick={() => (app ? setBackSignal((s) => s + 1) : null)} className={`rounded-full p-1 ${darkBar ? "text-[var(--ink)]" : "text-[var(--paper)]"} ${app ? "opacity-80" : "opacity-0"}`}>
            <ChevronLeft size={18} />
          </button>
          <button aria-label="홈" onClick={goHome} className={`h-[5px] w-[134px] rounded-full ${darkBar ? "bg-[var(--ink)]" : "bg-[var(--paper)]"}`} />
          <button aria-label="잠금" onClick={() => { setLocked(true); setApp(null); }} className={`text-[10px] ${darkBar ? "text-[var(--ink)]" : "text-[var(--paper)]"} opacity-70`}>잠금</button>
        </div>
      </div>
    </main>
  );
}
