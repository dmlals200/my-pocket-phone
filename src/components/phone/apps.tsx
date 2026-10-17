import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  MessageCircle, Image as ImageIcon, StickyNote, Music, Camera, Phone as PhoneIcon,
  ChevronLeft, Send, Plus, Play, Pause, SkipBack, SkipForward, Heart, Search, Delete, PhoneOff, RefreshCw,
} from "lucide-react";
import {
  character, photos, messageThreads, kakaoChats, notes as initialNotes, songs, contacts, bstagePosts, type Thread,
} from "@/data/character";

export type AppId = "messages" | "photos" | "notes" | "music" | "bstage" | "camera" | "kakao" | "phone";
type Props = { onExit: () => void; backSignal: number };

/** 뒤로 버튼: 하위 화면이면 한 단계 뒤로, 아니면 홈으로 */
function useBack(backSignal: number, canPop: boolean, pop: () => void, onExit: () => void) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (canPop) pop(); else onExit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backSignal]);
}

function Header({ title, onBack, backLabel = "", right, large }: { title: string; onBack?: () => void; backLabel?: string; right?: ReactNode; large?: boolean }) {
  return (
    <div className="shrink-0 pt-12">
      <div className="flex h-11 items-center justify-between px-3">
        <button onClick={onBack} className="flex items-center text-[var(--ios-blue)]">
          {onBack && <><ChevronLeft size={26} />{backLabel}</>}
        </button>
        {!large && <span className="font-semibold">{title}</span>}
        <div className="min-w-8 text-right text-[var(--ios-blue)]">{right}</div>
      </div>
      {large && <h1 className="px-4 pb-2 text-3xl font-bold">{title}</h1>}
    </div>
  );
}

/* ---------------- Chat (shared by 메시지 & 카카오톡) ---------------- */
function ChatView({ thread, kakao, onSend }: { thread: Thread; kakao?: boolean; onSend: (t: string) => void }) {
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [thread.messages.length]);
  const send = () => { if (text.trim()) { onSend(text.trim()); setText(""); } };
  return (
    <>
      <div className={`no-scrollbar flex-1 space-y-2 overflow-y-auto p-3 ${kakao ? "bg-[var(--kakao-bg)]" : ""}`}>
        {thread.messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} items-end gap-2`}>
            {kakao && m.from === "them" && <img src={thread.avatar} alt="" className="h-8 w-8 rounded-xl object-cover" />}
            <div className={`max-w-[72%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[15px] ${
              m.from === "me"
                ? kakao ? "bg-[var(--kakao)] text-[var(--ink)]" : "bg-[var(--ios-blue)] text-[var(--paper)]"
                : kakao ? "bg-[var(--paper)]" : "bg-[var(--ios-gray)]"}`}>{m.text}</div>
          </div>
        ))}
        <div ref={end} />
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t border-[var(--ios-gray2)] p-2 pb-9">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={kakao ? "메시지 입력" : "iMessage"} className="flex-1 rounded-full border border-[var(--ios-gray2)] px-4 py-2 text-[15px] outline-none" />
        <button onClick={send} className={`flex h-9 w-9 items-center justify-center rounded-full ${kakao ? "bg-[var(--kakao)] text-[var(--ink)]" : "bg-[var(--ios-blue)] text-[var(--paper)]"}`}><Send size={16} /></button>
      </div>
    </>
  );
}

function useThreads(initial: Thread[]) {
  const [threads, setThreads] = useState(initial);
  const send = (id: string, text: string) => {
    setThreads((ts) => ts.map((t) => (t.id === id ? { ...t, messages: [...t.messages, { from: "me", text }] } : t)));
    const replies = ["ㅎㅎ 그렇구나!", "알겠어 😊", "진짜?", "좋아 좋아!", "나중에 얘기하자~"];
    setTimeout(() => setThreads((ts) => ts.map((t) => (t.id === id ? { ...t, messages: [...t.messages, { from: "them", text: replies[Math.floor(Math.random() * replies.length)] }] } : t))), 1200);
  };
  const create = (name: string) => {
    const id = `t${Date.now()}`;
    setThreads((ts) => [{ id, name, messages: [] }, ...ts]);
    return id;
  };
  return { threads, send, create };
}

function MessagesApp({ onExit, backSignal }: Props) {
  const { threads, send, create } = useThreads(messageThreads);
  const [open, setOpen] = useState<string | null>(null);
  useBack(backSignal, !!open, () => setOpen(null), onExit);
  const t = threads.find((x) => x.id === open);
  if (t) return (
    <div className="flex h-full flex-col">
      <Header title={t.name} onBack={() => setOpen(null)} />
      <ChatView thread={t} onSend={(x) => send(t.id, x)} />
    </div>
  );
  return (
    <div className="flex h-full flex-col">
      <Header title="메시지" large right={<button onClick={() => { const n = prompt("받는 사람"); if (n) setOpen(create(n)); }}><Plus /></button>} />
      <div className="flex-1 overflow-y-auto">
        {threads.map((x) => (
          <button key={x.id} onClick={() => setOpen(x.id)} className="flex w-full items-center gap-3 border-b border-[var(--ios-gray)] px-4 py-3 text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ios-gray2)] font-semibold">{x.name[0]}</span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{x.name}</div>
              <div className="truncate text-sm text-[var(--ios-text2)]">{x.messages.at(-1)?.text ?? "새로운 메시지"}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function KakaoApp({ onExit, backSignal }: Props) {
  const { threads, send } = useThreads(kakaoChats);
  const [open, setOpen] = useState<string | null>(null);
  const [tab, setTab] = useState<"friends" | "chats">("chats");
  useBack(backSignal, !!open, () => setOpen(null), onExit);
  const t = threads.find((x) => x.id === open);
  if (t) return (
    <div className="flex h-full flex-col bg-[var(--kakao-bg)]">
      <Header title={t.name} onBack={() => setOpen(null)} />
      <ChatView thread={t} kakao onSend={(x) => send(t.id, x)} />
    </div>
  );
  return (
    <div className="flex h-full flex-col">
      <Header title={tab === "chats" ? "채팅" : "친구"} large right={<Search size={20} />} />
      <div className="flex-1 overflow-y-auto">
        {tab === "friends" ? (
          <>
            <div className="flex items-center gap-3 px-4 py-3">
              <img src={character.avatar} alt="" className="h-14 w-14 rounded-2xl object-cover" />
              <div><div className="font-bold">{character.name}</div><div className="text-sm text-[var(--ios-text2)]">{character.status}</div></div>
            </div>
            <div className="px-4 pt-2 text-xs text-[var(--ios-text2)]">친구 {threads.length}</div>
            {threads.map((x) => (
              <button key={x.id} onClick={() => setOpen(x.id)} className="flex w-full items-center gap-3 px-4 py-2 text-left">
                <img src={x.avatar} alt="" className="h-11 w-11 rounded-2xl object-cover" /><span>{x.name}</span>
              </button>
            ))}
          </>
        ) : threads.map((x) => (
          <button key={x.id} onClick={() => setOpen(x.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
            <img src={x.avatar} alt="" className="h-12 w-12 rounded-2xl object-cover" />
            <div className="min-w-0"><div className="font-semibold">{x.name}</div><div className="truncate text-sm text-[var(--ios-text2)]">{x.messages.at(-1)?.text}</div></div>
          </button>
        ))}
      </div>
      <div className="flex shrink-0 justify-around border-t border-[var(--ios-gray2)] pb-9 pt-2 text-xs">
        <button onClick={() => setTab("friends")} className={tab === "friends" ? "font-bold" : "text-[var(--ios-text2)]"}>친구</button>
        <button onClick={() => setTab("chats")} className={tab === "chats" ? "font-bold" : "text-[var(--ios-text2)]"}>채팅</button>
      </div>
    </div>
  );
}

/* ---------------- 사진 ---------------- */
function PhotosApp({ onExit, backSignal }: Props) {
  const [idx, setIdx] = useState<number | null>(null);
  useBack(backSignal, idx !== null, () => setIdx(null), onExit);
  if (idx !== null) {
    const p = photos[idx];
    return (
      <div className="flex h-full flex-col bg-[var(--ink)] text-[var(--paper)]">
        <div className="flex items-center justify-between px-3 pt-12">
          <button onClick={() => setIdx(null)} className="flex items-center text-[var(--ios-blue)]"><ChevronLeft size={26} />보관함</button>
          <div className="text-center text-xs"><div className="font-semibold">{p.caption}</div>{p.date}</div>
          <span className="w-16" />
        </div>
        <div className="relative flex flex-1 items-center">
          <img src={p.src} alt={p.caption} className="max-h-full w-full object-contain" />
          <button className="absolute inset-y-0 left-0 w-1/3" onClick={() => setIdx((idx - 1 + photos.length) % photos.length)} aria-label="이전" />
          <button className="absolute inset-y-0 right-0 w-1/3" onClick={() => setIdx((idx + 1) % photos.length)} aria-label="다음" />
        </div>
        <div className="pb-10 text-center text-xs opacity-70">{idx + 1} / {photos.length} · 좌우를 눌러 넘기기</div>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col">
      <Header title="보관함" large />
      <div className="grid grid-cols-3 gap-0.5 overflow-y-auto">
        {photos.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)}><img src={p.src} alt={p.caption} loading="lazy" className="aspect-square w-full object-cover" /></button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 메모 ---------------- */
function NotesApp({ onExit, backSignal }: Props) {
  const [list, setList] = useState(initialNotes);
  const [open, setOpen] = useState<string | null>(null);
  useBack(backSignal, !!open, () => setOpen(null), onExit);
  const n = list.find((x) => x.id === open);
  const update = (body: string) => setList((l) => l.map((x) => (x.id === open ? { ...x, body, title: body.split("\n")[0] || "새로운 메모", date: "방금" } : x)));
  if (n) return (
    <div className="flex h-full flex-col">
      <Header title="" onBack={() => setOpen(null)} backLabel="메모" right={<button onClick={() => setOpen(null)} className="font-semibold">완료</button>} />
      <textarea autoFocus value={n.body} onChange={(e) => update(e.target.value)} className="flex-1 resize-none px-5 pb-10 text-[17px] leading-relaxed outline-none" />
    </div>
  );
  return (
    <div className="flex h-full flex-col bg-[var(--ios-gray)]">
      <Header title="메모" large />
      <div className="mx-4 overflow-hidden rounded-xl bg-[var(--paper)]">
        {list.map((x) => (
          <button key={x.id} onClick={() => setOpen(x.id)} className="block w-full border-b border-[var(--ios-gray)] px-4 py-3 text-left">
            <div className="font-semibold">{x.title}</div>
            <div className="truncate text-sm text-[var(--ios-text2)]">{x.date} {x.body.split("\n")[1] ?? ""}</div>
          </button>
        ))}
      </div>
      <button onClick={() => { const id = `n${Date.now()}`; setList((l) => [{ id, title: "새로운 메모", body: "", date: "방금" }, ...l]); setOpen(id); }}
        className="mt-auto mb-10 self-end px-6 text-[var(--ios-blue)]"><StickyNote /></button>
    </div>
  );
}

/* ---------------- 음악 ---------------- */
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
function MusicApp({ onExit, backSignal }: Props) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [liked, setLiked] = useState(false);
  useBack(backSignal, false, () => {}, onExit);
  const s = songs[i];
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setPos((p) => (p + 1 >= s.duration ? (setI((x) => (x + 1) % songs.length), 0) : p + 1)), 1000);
    return () => clearInterval(t);
  }, [playing, s.duration]);
  const go = (d: number) => { setI((i + d + songs.length) % songs.length); setPos(0); };
  return (
    <div className="relative flex h-full flex-col items-center overflow-hidden px-8 pt-20 text-[var(--paper)]">
      <img src={s.cover} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover blur-3xl brightness-50" />
      <img src={s.cover} alt={s.title} className={`relative aspect-square w-full rounded-2xl object-cover shadow-2xl transition ${playing ? "scale-100" : "scale-90"}`} />
      <div className="relative mt-8 flex w-full items-center justify-between">
        <div><div className="text-xl font-bold">{s.title}</div><div className="opacity-70">{s.artist}</div></div>
        <button onClick={() => setLiked(!liked)}><Heart className={liked ? "fill-current" : ""} /></button>
      </div>
      <input type="range" min={0} max={s.duration} value={pos} onChange={(e) => setPos(+e.target.value)} className="relative mt-6 w-full accent-[var(--paper)]" />
      <div className="relative flex w-full justify-between text-xs opacity-70"><span>{fmt(pos)}</span><span>-{fmt(s.duration - pos)}</span></div>
      <div className="relative mt-6 flex items-center gap-12">
        <button onClick={() => go(-1)}><SkipBack size={34} className="fill-current" /></button>
        <button onClick={() => setPlaying(!playing)}>{playing ? <Pause size={52} className="fill-current" /> : <Play size={52} className="fill-current" />}</button>
        <button onClick={() => go(1)}><SkipForward size={34} className="fill-current" /></button>
      </div>
      <div className="relative mt-8 w-full space-y-1 text-sm">
        {songs.map((x, k) => (
          <button key={k} onClick={() => { setI(k); setPos(0); setPlaying(true); }} className={`flex w-full justify-between rounded-lg px-2 py-1 ${k === i ? "bg-[var(--glass)]" : ""}`}>
            <span>{x.title}</span><span className="opacity-60">{x.artist}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- b.stage ---------------- */
function BstageApp({ onExit, backSignal }: Props) {
  useBack(backSignal, false, () => {}, onExit);
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  return (
    <div className="flex h-full flex-col bg-[var(--ink)] text-[var(--paper)]">
      <div className="px-4 pb-3 pt-14 text-2xl font-black tracking-tight">b.stage</div>
      <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-4 pb-10">
        {bstagePosts.map((p, k) => (
          <div key={k} className="overflow-hidden rounded-2xl bg-[var(--glass)]">
            <div className="flex items-center gap-2 p-3">
              <img src={character.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              <div className="text-sm"><div className="font-semibold">{p.author} ✔</div><div className="opacity-60">{p.time}</div></div>
            </div>
            {p.image && <img src={p.image} alt="" className="aspect-square w-full object-cover" />}
            <div className="p-3 text-sm">{p.text}</div>
            <button onClick={() => setLikes({ ...likes, [k]: !likes[k] })} className="flex items-center gap-1 px-3 pb-3 text-sm">
              <Heart size={18} className={likes[k] ? "fill-current" : ""} /> {(p.likes + (likes[k] ? 1 : 0)).toLocaleString()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 카메라 ---------------- */
function CameraApp({ onExit, backSignal }: Props) {
  useBack(backSignal, false, () => {}, onExit);
  const video = useRef<HTMLVideoElement>(null);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [shot, setShot] = useState<string | null>(null);
  const [err, setErr] = useState(false);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    let stream: MediaStream | undefined;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: facing } })
      .then((s) => { stream = s; if (video.current) video.current.srcObject = s; setErr(false); })
      .catch(() => setErr(true));
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [facing]);
  const take = () => {
    setFlash(true); setTimeout(() => setFlash(false), 150);
    const v = video.current;
    if (!v || err || !v.videoWidth) { setShot(character.avatar); return; }
    const c = document.createElement("canvas"); c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0); setShot(c.toDataURL("image/jpeg"));
  };
  return (
    <div className="relative flex h-full flex-col bg-[var(--ink)] text-[var(--paper)]">
      <div className="relative mt-24 flex-1 overflow-hidden">
        {err ? <img src={character.avatar} alt="" className="h-full w-full object-cover opacity-80" />
          : <video ref={video} autoPlay playsInline muted className="h-full w-full object-cover" />}
        {err && <div className="absolute inset-x-0 top-3 text-center text-xs">카메라 권한이 없어 미리보기 이미지로 표시 중</div>}
        {flash && <div className="absolute inset-0 bg-[var(--paper)]" />}
      </div>
      <div className="flex items-center justify-between px-10 pb-12 pt-6">
        <span className="h-12 w-12 overflow-hidden rounded-lg bg-[var(--glass)]">{shot && <img src={shot} alt="" className="h-full w-full object-cover" />}</span>
        <button onClick={take} aria-label="촬영" className="h-[72px] w-[72px] rounded-full border-4 border-[var(--paper)] p-1"><span className="block h-full w-full rounded-full bg-[var(--paper)]" /></button>
        <button onClick={() => setFacing(facing === "user" ? "environment" : "user")} className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--glass)]"><RefreshCw /></button>
      </div>
    </div>
  );
}

/* ---------------- 전화 ---------------- */
function PhoneApp({ onExit, backSignal }: Props) {
  const [tab, setTab] = useState<"keypad" | "contacts">("keypad");
  const [num, setNum] = useState("");
  const [calling, setCalling] = useState<string | null>(null);
  const [sec, setSec] = useState(0);
  useBack(backSignal, !!calling, () => setCalling(null), onExit);
  useEffect(() => {
    if (!calling) return; setSec(0);
    const t = setInterval(() => setSec((s) => s + 1), 1000); return () => clearInterval(t);
  }, [calling]);
  if (calling) return (
    <div className="flex h-full flex-col items-center bg-[var(--ink)] pt-28 text-[var(--paper)]">
      <div className="text-3xl font-semibold">{calling}</div>
      <div className="mt-2 opacity-70">{sec < 3 ? "통화 연결 중…" : fmt(sec - 3)}</div>
      <button onClick={() => setCalling(null)} className="mt-auto mb-20 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--ios-red)]"><PhoneOff /></button>
    </div>
  );
  const keys: [string, string][] = [["1", ""], ["2", "ABC"], ["3", "DEF"], ["4", "GHI"], ["5", "JKL"], ["6", "MNO"], ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"], ["*", ""], ["0", "+"], ["#", ""]];
  return (
    <div className="flex h-full flex-col">
      {tab === "keypad" ? (
        <div className="flex flex-1 flex-col items-center pt-24">
          <div className="h-12 text-4xl">{num}</div>
          <div className="mt-6 grid grid-cols-3 gap-x-6 gap-y-4">
            {keys.map(([d, l]) => (
              <button key={d} onClick={() => setNum(num + d)} className="flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full bg-[var(--ios-gray)] active:bg-[var(--ios-gray2)]">
                <span className="text-3xl leading-none">{d}</span><span className="text-[9px] font-semibold tracking-widest">{l}</span>
              </button>
            ))}
            <span />
            <button onClick={() => num && setCalling(num)} className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[var(--ios-green)] text-[var(--paper)]"><PhoneIcon className="fill-current" /></button>
            <button onClick={() => setNum(num.slice(0, -1))} className={`flex items-center justify-center ${num ? "" : "invisible"}`}><Delete /></button>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <Header title="연락처" large />
          {contacts.map((c) => (
            <button key={c.name} onClick={() => setCalling(c.name)} className="flex w-full justify-between border-b border-[var(--ios-gray)] px-4 py-3">
              <span>{c.name}</span><span className="text-sm text-[var(--ios-text2)]">{c.number}</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex shrink-0 justify-around border-t border-[var(--ios-gray2)] pb-9 pt-2 text-xs">
        <button onClick={() => setTab("contacts")} className={tab === "contacts" ? "text-[var(--ios-blue)]" : "text-[var(--ios-text2)]"}>연락처</button>
        <button onClick={() => setTab("keypad")} className={tab === "keypad" ? "text-[var(--ios-blue)]" : "text-[var(--ios-text2)]"}>키패드</button>
      </div>
    </div>
  );
}

const W = "text-[var(--paper)]";
export const APPS: { id: AppId; name: string; cls: string; icon: ReactNode; lightUi: boolean; Component: (p: Props) => ReactNode }[] = [
  { id: "messages", name: "메시지", cls: "ic-messages", icon: <MessageCircle size={32} className={`${W} fill-current`} />, lightUi: true, Component: MessagesApp },
  { id: "photos", name: "사진", cls: "ic-photos", icon: <ImageIcon size={30} className={W} />, lightUi: true, Component: PhotosApp },
  { id: "notes", name: "메모", cls: "ic-notes", icon: <StickyNote size={28} className="text-[var(--ios-text2)]" />, lightUi: true, Component: NotesApp },
  { id: "music", name: "음악", cls: "ic-music", icon: <Music size={30} className={W} />, lightUi: false, Component: MusicApp },
  { id: "bstage", name: "b.stage", cls: "ic-bstage", icon: <span className={`${W} text-lg font-black`}>b.</span>, lightUi: false, Component: BstageApp },
  { id: "camera", name: "카메라", cls: "ic-camera", icon: <Camera size={30} className="text-[var(--ink)]" />, lightUi: false, Component: CameraApp },
  { id: "kakao", name: "카카오톡", cls: "ic-kakao", icon: <span className="rounded-full bg-[var(--ink)] px-2 py-0.5 text-[10px] font-black text-[var(--kakao)]">TALK</span>, lightUi: true, Component: KakaoApp },
  { id: "phone", name: "전화", cls: "ic-phone", icon: <PhoneIcon size={30} className={`${W} fill-current`} />, lightUi: true, Component: PhoneApp },
];
