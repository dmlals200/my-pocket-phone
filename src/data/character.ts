// ✏️ 캐릭터 설정 파일 — 이 파일만 수정하면 프로필/대화/사진 등이 바뀝니다.
import wallpaper from "@/assets/wallpaper.jpg";
import profile from "@/assets/profile.jpg";
import photo1 from "@/assets/photo1.jpg";
import photo2 from "@/assets/photo2.jpg";

export type Msg = { from: "me" | "them"; text: string; time?: string };
export type Thread = { id: string; name: string; avatar?: string; messages: Msg[] };

export const character = {
  name: "한서윤",
  phone: "010-1234-5678",
  status: "오늘도 반짝반짝 ✨",
  avatar: profile,
  wallpaper,
  passcode: "0101", // 잠금 비밀번호 (4자리)
};

export const photos: { src: string; caption: string; date: string }[] = [
  { src: photo1, caption: "아침 카페", date: "2026년 10월 15일" },
  { src: photo2, caption: "한강 노을", date: "2026년 10월 12일" },
  { src: profile, caption: "셀카", date: "2026년 10월 10일" },
  { src: wallpaper, caption: "바다", date: "2026년 9월 28일" },
];

export const messageThreads: Thread[] = [
  {
    id: "mom",
    name: "엄마",
    messages: [
      { from: "them", text: "서윤아 밥은 먹었니?", time: "오전 9:12" },
      { from: "me", text: "응 먹었어! 오늘 연습 늦게 끝나", time: "오전 9:20" },
      { from: "them", text: "무리하지 말고 😊", time: "오전 9:21" },
    ],
  },
  {
    id: "manager",
    name: "매니저 실장님",
    messages: [
      { from: "them", text: "내일 촬영 7시 픽업입니다", time: "어제" },
      { from: "me", text: "네 알겠습니다!", time: "어제" },
    ],
  },
];

export const kakaoChats: Thread[] = [
  {
    id: "jiwoo",
    name: "지우",
    avatar: photo1,
    messages: [
      { from: "them", text: "야 이번 주말 시간 돼?" },
      { from: "me", text: "토요일 오후 괜찮아!" },
      { from: "them", text: "그럼 성수 카페 가자 ☕" },
    ],
  },
  {
    id: "team",
    name: "멤버 단톡방 (5)",
    avatar: photo2,
    messages: [
      { from: "them", text: "오늘 안무 영상 올렸어요~" },
      { from: "me", text: "수고했어 다들 💜" },
    ],
  },
];

export const notes: { id: string; title: string; body: string; date: string }[] = [
  { id: "n1", title: "오늘 할 일", body: "- 보컬 레슨 2시\n- 팬레터 답장\n- 운동 1시간", date: "오늘" },
  { id: "n2", title: "가사 메모", body: "노을 끝에 서서\n너를 부르면…", date: "어제" },
];

export const songs: { title: string; artist: string; cover: string; duration: number }[] = [
  { title: "Sunset Letter", artist: "한서윤", cover: wallpaper, duration: 214 },
  { title: "Han River", artist: "Moonlight", cover: photo2, duration: 189 },
  { title: "Morning Latte", artist: "Cafe Band", cover: photo1, duration: 176 },
];

export const contacts: { name: string; number: string }[] = [
  { name: "엄마", number: "010-1111-2222" },
  { name: "매니저 실장님", number: "010-3333-4444" },
  { name: "지우", number: "010-5555-6666" },
];

export const bstagePosts: { author: string; text: string; image?: string; likes: number; time: string }[] = [
  { author: "한서윤", text: "오늘 팬미팅 와주셔서 고마워요! 💌", image: photo2, likes: 12840, time: "2시간 전" },
  { author: "한서윤", text: "아침 커피 한 잔 ☕ 다들 좋은 하루!", image: photo1, likes: 9321, time: "어제" },
];
