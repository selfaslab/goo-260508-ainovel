import { QUICK_PROMPT_CHIPS } from "../../constants/storyOptions";

interface QuickPromptChipsProps {
  onAppend: (snippet: string) => void;
}

export function QuickPromptChips({
  onAppend,
}: QuickPromptChipsProps): JSX.Element {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-zinc-400">Quick Prompt</p>
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPT_CHIPS.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onAppend(chip)}
            className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-200 transition hover:border-purple-500 hover:text-purple-100"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
