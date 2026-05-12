import { STRUCTURES } from "../../constants/storyOptions";
import { Select } from "../ui/Select";

interface StoryStructureProps {
  value: string;
  onChange: (next: string) => void;
}

export function StoryStructure({
  value,
  onChange,
}: StoryStructureProps): JSX.Element {
  return (
    <Select
      label="이야기 구조"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {STRUCTURES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </Select>
  );
}
