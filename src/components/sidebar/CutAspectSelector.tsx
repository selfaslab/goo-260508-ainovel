import { ASPECT_RATIOS } from "../../constants/storyOptions";
import { Select } from "../ui/Select";

interface CutAspectSelectorProps {
  value: string;
  onChange: (next: string) => void;
}

export function CutAspectSelector({
  value,
  onChange,
}: CutAspectSelectorProps): JSX.Element {
  return (
    <Select
      label="컷 비율"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {ASPECT_RATIOS.map((a) => (
        <option key={a.id} value={a.id}>
          {a.label}
        </option>
      ))}
    </Select>
  );
}
