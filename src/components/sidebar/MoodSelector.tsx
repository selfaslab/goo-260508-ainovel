import { MOODS } from "../../constants/storyOptions";
import { Select } from "../ui/Select";

interface MoodSelectorProps {
  value: string;
  onChange: (next: string) => void;
}

export function MoodSelector({
  value,
  onChange,
}: MoodSelectorProps): JSX.Element {
  return (
    <Select label="분위기" value={value} onChange={(e) => onChange(e.target.value)}>
      {MOODS.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </Select>
  );
}
