import { Plus, Trash2 } from "lucide-react";
import type { ExtraCharacter, Protagonist } from "../../types/story";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

interface CharacterFormProps {
  protagonist: Protagonist;
  onProtagonistChange: (patch: Partial<Protagonist>) => void;
  extraCharacters: ExtraCharacter[];
  onExtrasChange: (next: ExtraCharacter[]) => void;
}

function createEmptyExtra(): ExtraCharacter {
  return {
    id: crypto.randomUUID(),
    name: "",
    role: "",
    appearance: "",
    personality: "",
    relationship: "",
    secret: "",
  };
}

export function CharacterForm({
  protagonist,
  onProtagonistChange,
  extraCharacters,
  onExtrasChange,
}: CharacterFormProps): JSX.Element {
  const addExtra = () => {
    if (extraCharacters.length >= 10) return;
    onExtrasChange([...extraCharacters, createEmptyExtra()]);
  };

  const updateExtra = (id: string, patch: Partial<ExtraCharacter>) => {
    onExtrasChange(
      extraCharacters.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  const removeExtra = (id: string) => {
    onExtrasChange(extraCharacters.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-100">주인공</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            label="이름"
            value={protagonist.name}
            onChange={(e) => onProtagonistChange({ name: e.target.value })}
            placeholder="예: 하연"
          />
          <Input
            label="성별"
            value={protagonist.gender}
            onChange={(e) => onProtagonistChange({ gender: e.target.value })}
          />
          <Input
            label="나이"
            value={protagonist.age}
            onChange={(e) => onProtagonistChange({ age: e.target.value })}
          />
          <Input
            label="외형 특징"
            value={protagonist.appearance}
            onChange={(e) =>
              onProtagonistChange({ appearance: e.target.value })
            }
            placeholder="예: 단발머리"
          />
          <Input
            label="성격"
            value={protagonist.personality}
            onChange={(e) =>
              onProtagonistChange({ personality: e.target.value })
            }
            placeholder="예: 내성적"
          />
          <Input
            label="목표"
            value={protagonist.goal}
            onChange={(e) => onProtagonistChange({ goal: e.target.value })}
          />
          <Input
            label="트라우마"
            value={protagonist.trauma}
            onChange={(e) => onProtagonistChange({ trauma: e.target.value })}
            placeholder="예: 과거의 상처"
          />
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">추가 캐릭터</h3>
            <p className="text-xs text-zinc-500">최대 10명</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="px-3 py-1 text-xs"
            onClick={addExtra}
            disabled={extraCharacters.length >= 10}
          >
            <Plus className="h-4 w-4" />
            캐릭터 추가
          </Button>
        </div>

        <div className="space-y-4">
          {extraCharacters.length === 0 ? (
            <p className="text-xs text-zinc-500">
              필요하면 캐릭터를 추가해 조연·적대자 등을 설정하세요.
            </p>
          ) : null}
          {extraCharacters.map((c, idx) => (
            <div
              key={c.id}
              className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                  캐릭터 {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeExtra(c.id)}
                  className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-red-300"
                  aria-label="캐릭터 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                  label="이름"
                  value={c.name}
                  onChange={(e) => updateExtra(c.id, { name: e.target.value })}
                />
                <Input
                  label="역할"
                  value={c.role}
                  onChange={(e) => updateExtra(c.id, { role: e.target.value })}
                />
                <Input
                  label="외형"
                  value={c.appearance}
                  onChange={(e) =>
                    updateExtra(c.id, { appearance: e.target.value })
                  }
                />
                <Input
                  label="성격"
                  value={c.personality}
                  onChange={(e) =>
                    updateExtra(c.id, { personality: e.target.value })
                  }
                />
                <Input
                  label="관계"
                  value={c.relationship}
                  onChange={(e) =>
                    updateExtra(c.id, { relationship: e.target.value })
                  }
                />
                <Input
                  label="비밀"
                  value={c.secret}
                  onChange={(e) =>
                    updateExtra(c.id, { secret: e.target.value })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
