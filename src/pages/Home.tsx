import { useEffect } from "react";
import { MainPanel } from "../components/layout/MainPanel";
import { Sidebar } from "../components/layout/Sidebar";
import { useStoryStore } from "../store/storyStore";
import { parseShareFromLocation } from "../utils/shareLink";

export function Home(): JSX.Element {
  useEffect(() => {
    const shared = parseShareFromLocation();
    if (!shared) return;
    const { setGeneratedStory, setSceneImages } = useStoryStore.getState();
    setGeneratedStory(shared.story);
    setSceneImages(shared.images);
    const { pathname, search } = window.location;
    window.history.replaceState(null, "", `${pathname}${search}`);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 lg:flex-row">
      <Sidebar />
      <MainPanel />
    </div>
  );
}
