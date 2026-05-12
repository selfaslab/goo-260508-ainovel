import { useState } from "react";
import { X } from "lucide-react";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

interface KeywordTagsProps {
  value: string[];
  onChange: (next: string[]) => void;
}

export function KeywordTags({
  value,
  onChange,
}: KeywordTagsProps): JSX.Element {
  const [draft, setDraft] = useState("");

  const addFromDraft = () => {
    const parts = draft
      .split(/[,，\n]/g)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const merged = [...value];
    parts.forEach((p) => {
      if (!merged.includes(p)) merged.push(p);
    });
    onChange(merged);
    setDraft("");
  };

  const remove = (tag: string) => {
    onChange(value.filter((v) => v !== tag));
  };

  return (
    <Card className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-zinc-100">키워드</h3>
        <p className="text-xs text-zinc-500">
          쉼표 또는 Enter로 태그를 추가할 수 있습니다.
        </p>
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex-1">
          <Input
            label="태그 입력"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="예: 상실, 치유, 기억"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFromDraft();
              }
            }}
          />
        </div>
        <button
          type="button"
          onClick={addFromDraft}
          className="self-end rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-200 transition hover:border-purple-500 hover:text-purple-100 md:mb-[2px]"
        >
          추가
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs text-purple-100"
          >
            {tag}
            <button
              type="button"
              className="rounded-full p-0.5 text-purple-200 hover:bg-purple-500/30"
              onClick={() => remove(tag)}
              aria-label={`${tag} 삭제`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </Card>
  );
}
