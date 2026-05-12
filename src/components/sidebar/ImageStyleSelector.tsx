import { IMAGE_STYLES } from "../../constants/storyOptions";
import { Select } from "../ui/Select";

interface ImageStyleSelectorProps {
  value: string;
  onChange: (next: string) => void;
}

export function ImageStyleSelector({
  value,
  onChange,
}: ImageStyleSelectorProps): JSX.Element {
  return (
    <Select
      label="이미지 스타일"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {IMAGE_STYLES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </Select>
  );
}
