import { STORY_LENGTH_OPTIONS } from "../../constants/storyOptions";
import type { StoryLengthId } from "../../types/story";
import { Select } from "../ui/Select";

interface StoryLengthSelectorProps {
  value: StoryLengthId;
  onChange: (next: StoryLengthId) => void;
}

export function StoryLengthSelector({
  value,
  onChange,
}: StoryLengthSelectorProps): JSX.Element {
  return (
    <Select
      label="이야기 길이"
      value={value}
      onChange={(e) => onChange(e.target.value as StoryLengthId)}
    >
      {STORY_LENGTH_OPTIONS.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}
