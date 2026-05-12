import { motion } from "framer-motion";

interface SceneImageProps {
  src?: string;
  alt: string;
  loading?: boolean;
}

export function SceneImage({
  src,
  alt,
  loading = false,
}: SceneImageProps): JSX.Element {
  if (loading) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        <div className="aspect-video w-full animate-pulse bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900" />
        <p className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400">
          이미지 생성 중...
        </p>
      </div>
    );
  }

  if (!src) {
    return (
      <div className="flex min-h-[52px] w-full items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 px-3 py-2 text-[11px] text-zinc-500">
        아직 이미지가 없습니다.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden rounded-2xl border border-zinc-800 bg-black"
    >
      <div className="aspect-video w-full">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </motion.div>
  );
}
