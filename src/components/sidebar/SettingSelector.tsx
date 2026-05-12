import { SETTINGS } from "../../constants/storyOptions";
import { Select } from "../ui/Select";

interface SettingSelectorProps {
  value: string;
  onChange: (next: string) => void;
}

export function SettingSelector({
  value,
  onChange,
}: SettingSelectorProps): JSX.Element {
  return (
    <Select label="배경" value={value} onChange={(e) => onChange(e.target.value)}>
      {SETTINGS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </Select>
  );
}
