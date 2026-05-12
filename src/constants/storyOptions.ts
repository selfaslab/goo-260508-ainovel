import type { StoryLengthId } from "../types/story";

export const GENRES: string[] = [
  "판타지",
  "SF",
  "미스터리",
  "스릴러",
  "로맨스",
  "호러",
  "코미디",
  "느와르",
  "심리",
  "철학",
  "힐링",
  "성장",
  "무협",
  "디스토피아",
  "학원물",
];

export const MOODS: string[] = [
  "몽환적",
  "감성적",
  "우울함",
  "긴장감",
  "희망적",
  "철학적",
  "서정적",
  "음침함",
  "사이버펑크",
  "따뜻함",
];

export const SETTINGS: string[] = [
  "현대 도시",
  "미래 도시",
  "바닷가",
  "시골",
  "학교",
  "병원",
  "우주",
  "꿈속 세계",
  "숲",
  "전쟁터",
];

export const STORY_LENGTH_OPTIONS: {
  id: StoryLengthId;
  label: string;
  scenes: number;
}[] = [
  { id: "short", label: "짧음 (5 Scene)", scenes: 5 },
  { id: "normal", label: "일반 (10 Scene)", scenes: 10 },
  { id: "long", label: "길게 (20 Scene)", scenes: 20 },
];

export const STRUCTURES: string[] = [
  "영웅의 여정",
  "성장 서사",
  "로맨스 구조",
  "추리 구조",
  "복수극",
  "자유 생성",
];

export const IMAGE_STYLES: string[] = [
  "웹툰 스타일",
  "일본 애니",
  "시네마틱",
  "수채화",
  "유화",
  "흑백 만화",
  "노벨 일러스트",
  "지브리풍",
  "픽사풍",
  "사이버펑크",
];

export const ASPECT_RATIOS: { id: string; label: string }[] = [
  { id: "1:1", label: "1:1" },
  { id: "16:9", label: "16:9" },
  { id: "4:5", label: "4:5" },
  { id: "9:16", label: "세로 웹툰" },
];

export const QUICK_PROMPT_CHIPS: string[] = [
  "[반전]",
  "[감정선 강화]",
  "[철학적 대사]",
  "[슬픈 결말]",
  "[희망적 결말]",
  "[로맨스]",
  "[서스펜스]",
];

export function getSceneCount(length: StoryLengthId): number {
  const found = STORY_LENGTH_OPTIONS.find((o) => o.id === length);
  return found?.scenes ?? 10;
}
