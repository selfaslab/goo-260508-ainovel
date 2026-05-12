import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useGenerateStory } from "../../hooks/useGenerateStory";
import { useStoryStore } from "../../store/storyStore";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { CharacterForm } from "../sidebar/CharacterForm";
import { CustomStoryPrompt } from "../sidebar/CustomStoryPrompt";
import { CutAspectSelector } from "../sidebar/CutAspectSelector";
import { GenreSelector } from "../sidebar/GenreSelector";
import { ImageStyleSelector } from "../sidebar/ImageStyleSelector";
import { KeywordTags } from "../sidebar/KeywordTags";
import { MoodSelector } from "../sidebar/MoodSelector";
import { QuickPromptChips } from "../sidebar/QuickPromptChips";
import { SettingSelector } from "../sidebar/SettingSelector";
import { StoryLengthSelector } from "../sidebar/StoryLengthSelector";
import { StoryStructure } from "../sidebar/StoryStructure";

export function Sidebar(): JSX.Element {
  const storyConfig = useStoryStore((s) => s.storyConfig);
  const customPrompt = useStoryStore((s) => s.customPrompt);
  const setStoryConfig = useStoryStore((s) => s.setStoryConfig);
  const setProtagonist = useStoryStore((s) => s.setProtagonist);
  const setExtraCharacters = useStoryStore((s) => s.setExtraCharacters);
  const setCustomPrompt = useStoryStore((s) => s.setCustomPrompt);
  const appendCustomPrompt = useStoryStore((s) => s.appendCustomPrompt);

  const generate = useGenerateStory();

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-zinc-800 bg-zinc-950 lg:w-[33%] lg:max-w-md lg:min-w-[320px]">
      <div className="border-b border-zinc-800 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Studio
        </p>
        <h1 className="text-lg font-semibold text-zinc-50">
          AI Graphic Novel Engine
        </h1>
        <p className="text-xs text-zinc-500">
          설정을 채우고 한 번에 Scene 스토리를 생성하세요.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <Card className="space-y-3">
          <Input
            label="작품 제목"
            value={storyConfig.title}
            onChange={(e) => setStoryConfig({ title: e.target.value })}
            placeholder="예: 바람과 조개"
          />
        </Card>

        <GenreSelector
          value={storyConfig.genres}
          onChange={(genres) => setStoryConfig({ genres })}
        />

        <Card className="space-y-3">
          <MoodSelector
            value={storyConfig.mood}
            onChange={(mood) => setStoryConfig({ mood })}
          />
          <SettingSelector
            value={storyConfig.setting}
            onChange={(setting) => setStoryConfig({ setting })}
          />
          <StoryLengthSelector
            value={storyConfig.storyLength}
            onChange={(storyLength) => setStoryConfig({ storyLength })}
          />
          <StoryStructure
            value={storyConfig.structure}
            onChange={(structure) => setStoryConfig({ structure })}
          />
        </Card>

        <CharacterForm
          protagonist={storyConfig.protagonist}
          onProtagonistChange={setProtagonist}
          extraCharacters={storyConfig.extraCharacters}
          onExtrasChange={setExtraCharacters}
        />

        <Card className="space-y-3">
          <ImageStyleSelector
            value={storyConfig.imageStyle}
            onChange={(imageStyle) => setStoryConfig({ imageStyle })}
          />
          <CutAspectSelector
            value={storyConfig.aspectRatio}
            onChange={(aspectRatio) => setStoryConfig({ aspectRatio })}
          />
        </Card>

        <KeywordTags
          value={storyConfig.keywords}
          onChange={(keywords) => setStoryConfig({ keywords })}
        />

        <Card className="space-y-3">
          <CustomStoryPrompt
            value={customPrompt}
            onChange={setCustomPrompt}
          />
          <QuickPromptChips onAppend={appendCustomPrompt} />
        </Card>
      </div>

      <div className="border-t border-zinc-800 bg-zinc-950/90 p-4 backdrop-blur">
        <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
          <Button
            type="button"
            className="w-full py-3 text-base font-semibold"
            loading={generate.isPending}
            onClick={() => generate.mutate()}
          >
            <Sparkles className="h-5 w-5" />
            🎬 그래픽노블 생성
          </Button>
        </motion.div>
        <p className="mt-2 text-center text-[11px] text-zinc-500">
          API 키는 저장소에 없습니다. 본인 키만 <code className="text-zinc-400">.env.local</code>·
          Vercel 환경변수에 넣으세요. 브라우저·프론트 env에는 넣지 마세요.
        </p>
      </div>
    </aside>
  );
}
