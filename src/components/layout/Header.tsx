import { useEffect, useState } from "react";
import { Download, FileJson, Link2, RotateCcw } from "lucide-react";
import { useStoryStore } from "../../store/storyStore";
import type { GeneratedStory } from "../../types/story";
import { buildShareUrl } from "../../utils/shareLink";
import { exportGraphicNovelPdf } from "../../utils/exportPdf";
import { downloadJson } from "../../utils/exportJson";
import { Button } from "../ui/Button";

export function Header(): JSX.Element {
  const [notice, setNotice] = useState<string | null>(null);
  const generatedStory = useStoryStore((s) => s.generatedStory);
  const sceneImages = useStoryStore((s) => s.sceneImages);
  const storyConfig = useStoryStore((s) => s.storyConfig);
  const customPrompt = useStoryStore((s) => s.customPrompt);
  const resetProject = useStoryStore((s) => s.resetProject);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(t);
  }, [notice]);

  const bundle = (): { story: GeneratedStory; images: Record<string, string> } | null => {
    if (!generatedStory) return null;
    return { story: generatedStory, images: sceneImages };
  };

  const handlePdf = async () => {
    const data = bundle();
    if (!data) return;
    try {
      await exportGraphicNovelPdf({
        story: data.story,
        images: data.images,
      });
      setNotice("PDF 저장을 시작했습니다.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "PDF 생성 실패";
      setNotice(msg);
    }
  };

  const handleJson = () => {
    const data = bundle();
    if (!data) return;
    downloadJson(
      "graphic-novel-project.json",
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          storyConfig,
          customPrompt,
          generatedStory: data.story,
          sceneImages: data.images,
        },
        null,
        2
      )
    );
    setNotice("JSON 파일을 다운로드했습니다.");
  };

  const handleShare = async () => {
    const data = bundle();
    if (!data) return;
    const url = buildShareUrl(data.story, data.images);
    try {
      await navigator.clipboard.writeText(url);
      setNotice("공유 링크를 클립보드에 복사했습니다.");
    } catch {
      setNotice(`복사에 실패했습니다. 아래 링크를 직접 저장하세요:\n${url}`);
    }
  };

  const disabled = !generatedStory;

  return (
    <header className="flex flex-col gap-2 border-b border-zinc-800 bg-zinc-950/80 px-4 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">Canvas</p>
          <h2 className="text-sm font-semibold text-zinc-100">
            그래픽 노블 보드
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="px-3 py-2 text-xs"
            disabled={disabled}
            onClick={() => {
              void handlePdf();
            }}
          >
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="px-3 py-2 text-xs"
            disabled={disabled}
            onClick={handleJson}
          >
            <FileJson className="h-4 w-4" />
            JSON
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="px-3 py-2 text-xs"
            disabled={disabled}
            onClick={() => {
              void handleShare();
            }}
          >
            <Link2 className="h-4 w-4" />
            공유 링크
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="px-3 py-2 text-xs text-zinc-400"
            onClick={() => {
              const ok = window.confirm(
                "프로젝트를 초기화할까요? 저장된 로컬 데이터도 비웁니다."
              );
              if (ok) resetProject();
            }}
          >
            <RotateCcw className="h-4 w-4" />
            초기화
          </Button>
        </div>
      </div>
      {notice ? (
        <p className="whitespace-pre-wrap rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
          {notice}
        </p>
      ) : null}
    </header>
  );
}
