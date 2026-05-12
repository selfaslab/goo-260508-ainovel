import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ExtraCharacter,
  GeneratedStory,
  Protagonist,
  Scene,
  StoryConfig,
} from "../types/story";

const emptyProtagonist = (): Protagonist => ({
  name: "",
  gender: "",
  age: "",
  appearance: "",
  personality: "",
  goal: "",
  trauma: "",
});

const defaultStoryConfig = (): StoryConfig => ({
  title: "",
  genres: [],
  mood: "몽환적",
  setting: "현대 도시",
  storyLength: "normal",
  structure: "자유 생성",
  protagonist: emptyProtagonist(),
  extraCharacters: [],
  imageStyle: "웹툰 스타일",
  aspectRatio: "16:9",
  keywords: [],
});

export interface StoryStoreState {
  storyConfig: StoryConfig;
  generatedStory: GeneratedStory | null;
  sceneImages: Record<string, string>;
  customPrompt: string;
  selectedScene: Scene | null;
  isGeneratingStory: boolean;
  imageLoadingSceneNumber: number | null;
  storyError: string | null;
  imageError: string | null;
  setStoryConfig: (patch: Partial<StoryConfig>) => void;
  setProtagonist: (patch: Partial<Protagonist>) => void;
  setExtraCharacters: (characters: ExtraCharacter[]) => void;
  setCustomPrompt: (value: string) => void;
  appendCustomPrompt: (snippet: string) => void;
  setGeneratedStory: (story: GeneratedStory | null) => void;
  setSceneImages: (images: Record<string, string>) => void;
  setImageForScene: (sceneNumber: number, url: string) => void;
  removeImageForScene: (sceneNumber: number) => void;
  editScene: (sceneNumber: number, next: Pick<Scene, "title" | "story">) => void;
  reorderScenes: (scenes: Scene[]) => void;
  setSelectedScene: (scene: Scene | null) => void;
  setIsGeneratingStory: (value: boolean) => void;
  setImageLoadingSceneNumber: (value: number | null) => void;
  setStoryError: (value: string | null) => void;
  setImageError: (value: string | null) => void;
  resetProject: () => void;
}

export const useStoryStore = create<StoryStoreState>()(
  persist(
    (set, get) => ({
      storyConfig: defaultStoryConfig(),
      generatedStory: null,
      sceneImages: {},
      customPrompt: "",
      selectedScene: null,
      isGeneratingStory: false,
      imageLoadingSceneNumber: null,
      storyError: null,
      imageError: null,

      setStoryConfig: (patch) =>
        set((s) => ({ storyConfig: { ...s.storyConfig, ...patch } })),

      setProtagonist: (patch) =>
        set((s) => ({
          storyConfig: {
            ...s.storyConfig,
            protagonist: { ...s.storyConfig.protagonist, ...patch },
          },
        })),

      setExtraCharacters: (characters) =>
        set((s) => ({
          storyConfig: { ...s.storyConfig, extraCharacters: characters },
        })),

      setCustomPrompt: (value) => set({ customPrompt: value }),

      appendCustomPrompt: (snippet) =>
        set((s) => {
          const base = s.customPrompt.trim();
          const next = base.length > 0 ? `${base}\n${snippet}` : snippet;
          return { customPrompt: next };
        }),

      setGeneratedStory: (story) => set({ generatedStory: story }),

      setSceneImages: (images) => set({ sceneImages: images }),

      setImageForScene: (sceneNumber, url) =>
        set((s) => ({
          sceneImages: { ...s.sceneImages, [String(sceneNumber)]: url },
        })),

      removeImageForScene: (sceneNumber) =>
        set((s) => {
          const key = String(sceneNumber);
          const { [key]: _removed, ...rest } = s.sceneImages;
          return { sceneImages: rest };
        }),

      editScene: (sceneNumber, next) => {
        const current = get().generatedStory;
        if (!current) return;
        const scenes = current.scenes.map((sc) =>
          sc.sceneNumber === sceneNumber ? { ...sc, ...next } : sc
        );
        set({ generatedStory: { ...current, scenes } });
      },

      reorderScenes: (scenes) => {
        const current = get().generatedStory;
        if (!current) return;
        const images = get().sceneImages;
        const renumbered = scenes.map((sc, idx) => ({
          ...sc,
          sceneNumber: idx + 1,
        }));
        const nextImages: Record<string, string> = {};
        scenes.forEach((sc, idx) => {
          const url = images[String(sc.sceneNumber)];
          if (url) nextImages[String(idx + 1)] = url;
        });
        set({
          generatedStory: { ...current, scenes: renumbered },
          sceneImages: nextImages,
        });
      },

      setSelectedScene: (scene) => set({ selectedScene: scene }),

      setIsGeneratingStory: (value) => set({ isGeneratingStory: value }),

      setImageLoadingSceneNumber: (value) =>
        set({ imageLoadingSceneNumber: value }),

      setStoryError: (value) => set({ storyError: value }),

      setImageError: (value) => set({ imageError: value }),

      resetProject: () =>
        set({
          storyConfig: defaultStoryConfig(),
          generatedStory: null,
          sceneImages: {},
          customPrompt: "",
          selectedScene: null,
          storyError: null,
          imageError: null,
        }),
    }),
    {
      name: "ai-graphic-novel-engine-mvp",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        storyConfig: state.storyConfig,
        generatedStory: state.generatedStory,
        sceneImages: state.sceneImages,
        customPrompt: state.customPrompt,
      }),
    }
  )
);
