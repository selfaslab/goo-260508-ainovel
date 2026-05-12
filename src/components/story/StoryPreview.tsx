import { motion } from "framer-motion";
import type { GeneratedStory } from "../../types/story";
import { Card } from "../ui/Card";

interface StoryPreviewProps {
  story: GeneratedStory | null;
}

export function StoryPreview({ story }: StoryPreviewProps): JSX.Element {
  if (!story) {
    return (
      <Card className="border-dashed border-zinc-800 bg-zinc-950/40">
        <p className="text-sm text-zinc-400">
          아직 생성된 스토리가 없습니다. 좌측에서 설정을 마친 뒤{" "}
          <span className="text-purple-300">그래픽노블 생성</span>을 눌러주세요.
        </p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="flex flex-col gap-2 border-purple-500/20 bg-gradient-to-br from-zinc-900 to-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Generated
            </p>
            <h3 className="text-lg font-semibold text-zinc-50">{story.title}</h3>
          </div>
          <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
            {story.scenes.length} Scene
          </span>
        </div>
        <p className="text-sm text-zinc-400">
          <span className="font-medium text-zinc-200">테마</span> · {story.theme}
        </p>
      </Card>
    </motion.div>
  );
}
