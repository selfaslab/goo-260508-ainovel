import { AnimatePresence, motion } from "framer-motion";
import { useStoryStore } from "../../store/storyStore";
import { Header } from "./Header";
import { SceneEditorModal } from "../story/SceneEditorModal";
import { StoryList } from "../story/StoryList";
import { StoryPreview } from "../story/StoryPreview";

export function MainPanel(): JSX.Element {
  const generatedStory = useStoryStore((s) => s.generatedStory);
  const isGeneratingStory = useStoryStore((s) => s.isGeneratingStory);
  const storyError = useStoryStore((s) => s.storyError);
  const imageError = useStoryStore((s) => s.imageError);
  const selectedScene = useStoryStore((s) => s.selectedScene);
  const setSelectedScene = useStoryStore((s) => s.setSelectedScene);

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-zinc-950 via-zinc-950 to-black lg:w-[67%]">
      <Header />

      <div className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        <AnimatePresence>
          {isGeneratingStory ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-zinc-950/80 backdrop-blur-sm"
            >
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-700 border-t-purple-500" />
              <p className="text-sm font-medium text-zinc-200">
                AI가 그래픽노블을 쓰는 중...
              </p>
              <p className="text-xs text-zinc-500">
                Scene 구조와 감정선을 맞추고 있어요.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {storyError ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            {storyError}
          </div>
        ) : null}

        {imageError ? (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
            {imageError}
          </div>
        ) : null}

        <StoryPreview story={generatedStory} />

        <StoryList scenes={generatedStory?.scenes ?? []} />
      </div>

      <SceneEditorModal
        scene={selectedScene}
        onClose={() => setSelectedScene(null)}
      />
    </section>
  );
}
