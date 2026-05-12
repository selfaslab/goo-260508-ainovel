import { GENRES } from "../../constants/storyOptions";
import { Card } from "../ui/Card";

interface GenreSelectorProps {
  value: string[];
  onChange: (next: string[]) => void;
}

export function GenreSelector({
  value,
  onChange,
}: GenreSelectorProps): JSX.Element {
  const toggle = (genre: string) => {
    if (value.includes(genre)) {
      onChange(value.filter((g) => g !== genre));
    } else {
      onChange([...value, genre]);
    }
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-100">장르 (복수 선택)</h3>
        <span className="text-xs text-zinc-500">{value.length}개 선택</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {GENRES.map((genre) => {
          const active = value.includes(genre);
          return (
            <button
              key={genre}
              type="button"
              onClick={() => toggle(genre)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                active
                  ? "border-purple-500 bg-purple-500/20 text-purple-100"
                  : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
