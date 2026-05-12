import { useEffect, useRef } from "react";
import { Textarea } from "../ui/Textarea";

interface CustomStoryPromptProps {
  value: string;
  onChange: (next: string) => void;
}

const MAX_LEN = 2000;

export function CustomStoryPrompt({
  value,
  onChange,
}: CustomStoryPromptProps): JSX.Element {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <Textarea
      ref={ref}
      label="추가 스토리 요청"
      value={value}
      maxLength={MAX_LEN}
      rows={4}
      placeholder={`예:\n후반부에 기억상실 설정 추가\n남자 주인공 등장\n철학적인 대사 포함\n밤바다 장면 많이 넣기\n슬프지만 희망적인 결말`}
      onChange={(e) => onChange(e.target.value.slice(0, MAX_LEN))}
    />
  );
}
