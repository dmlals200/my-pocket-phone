import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "@/components/phone/Phone";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "서윤의 폰 — 인터랙티브 가상 스마트폰" },
      { name: "description", content: "잠금화면부터 메시지, 사진, 메모, 음악, 카톡까지 직접 눌러보는 가상 iPhone." },
      { property: "og:title", content: "서윤의 폰 — 인터랙티브 가상 스마트폰" },
      { property: "og:description", content: "잠금을 풀고 캐릭터의 폰을 직접 탐험해 보세요." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Phone,
});
