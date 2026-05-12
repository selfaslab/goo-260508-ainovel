export interface Scene {
  sceneNumber: number;
  title: string;
  story: string;
}

export interface GeneratedStory {
  title: string;
  theme: string;
  scenes: Scene[];
}

export interface Protagonist {
  name: string;
  gender: string;
  age: string;
  appearance: string;
  personality: string;
  goal: string;
  trauma: string;
}

export interface ExtraCharacter {
  id: string;
  name: string;
  role: string;
  appearance: string;
  personality: string;
  relationship: string;
  secret: string;
}

export type StoryLengthId = "short" | "normal" | "long";

export interface StoryConfig {
  title: string;
  genres: string[];
  mood: string;
  setting: string;
  storyLength: StoryLengthId;
  structure: string;
  protagonist: Protagonist;
  extraCharacters: ExtraCharacter[];
  imageStyle: string;
  aspectRatio: string;
  keywords: string[];
}

export interface GenerateStoryRequestBody {
  storyConfig: StoryConfig;
  customPrompt: string;
}

export interface ReviseSceneRequestBody {
  storyConfig: StoryConfig;
  customPrompt: string;
  fullStory: GeneratedStory;
  sceneNumber: number;
  revisionInstruction: string;
}

export interface GenerateImageRequestBody {
  scene: Scene;
  imageStyle: string;
  aspectRatio: string;
  storyTitle: string;
}
