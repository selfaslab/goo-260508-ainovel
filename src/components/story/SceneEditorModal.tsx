import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Scene } from "../../types/story";
import { useSceneEdit } from "../../hooks/useSceneEdit";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";

interface SceneEditorModalProps {
  scene: Scene | null;
  onClose: () => void;
}

export function SceneEditorModal({
  scene,
  onClose,
}: SceneEditorModalProps): JSX.Element {
  const [instruction, setInstruction] = useState("");
  const revision = useSceneEdit();

  useEffect(() => {
    if (scene) setInstruction("");
  }, [scene]);

  const open = scene !== null;

  const handleSubmit = () => {
    if (!scene) return;
    if (!instruction.trim()) return;
    revision.mutate(
      { scene, instruction: instruction.trim() },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-purple-900/40"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Scene Edit
                </p>
                <h3 className="text-lg font-semibold text-zinc-50">
                  SCENE {String(scene.sceneNumber).padStart(2, "0")} ·{" "}
                  {scene.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-100"
              >
                닫기
              </button>
            </div>

            <div className="mb-4 space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-zinc-300">
              <p className="text-xs font-semibold text-zinc-400">현재 본문</p>
              <p className="leading-relaxed">{scene.story}</p>
            </div>

            <div className="space-y-3">
              <Textarea
                label="무엇을 수정할까요?"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="예: 남자 캐릭터 등장 / 밤바다로 변경 / 더 감정적으로 / 반전 추가"
                rows={5}
              />
              {revision.isError ? (
                <p className="text-xs text-red-300">
                  {revision.error instanceof Error
                    ? revision.error.message
                    : "수정 중 오류가 발생했습니다."}
                </p>
              ) : null}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                  취소
                </Button>
                <Button
                  type="button"
                  loading={revision.isPending}
                  onClick={handleSubmit}
                >
                  AI 수정하기
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
