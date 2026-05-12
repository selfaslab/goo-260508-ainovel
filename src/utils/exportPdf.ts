import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { GeneratedStory } from "../types/story";

const PT_TO_CSS_PX = 96 / 72;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function renderHtmlToCanvas(
  html: string,
  widthPx: number
): Promise<HTMLCanvasElement> {
  const wrap = document.createElement("div");
  wrap.style.cssText = [
    "position:fixed",
    "left:-12000px",
    "top:0",
    `width:${widthPx}px`,
    "box-sizing:border-box",
    "padding:20px 24px",
    "background:#ffffff",
    "color:#18181b",
    "font-family:'Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo','Nanum Gothic','Segoe UI',sans-serif",
    "word-break:keep-all",
    "overflow:visible",
  ].join(";");
  wrap.innerHTML = html;
  document.body.appendChild(wrap);
  await document.fonts.ready;
  const canvas = await html2canvas(wrap, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });
  document.body.removeChild(wrap);
  return canvas;
}

async function fetchDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("이미지 로드 실패"));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function addCanvasToPdf(
  doc: jsPDF,
  canvas: HTMLCanvasElement,
  margin: number,
  y: number,
  contentWidthPt: number,
  pageHeight: number
): number {
  const dataUrl = canvas.toDataURL("image/png");
  const imgW = contentWidthPt;
  const imgH = (canvas.height / canvas.width) * imgW;
  let nextY = y;
  if (nextY + imgH > pageHeight - margin) {
    doc.addPage();
    nextY = margin;
  }
  doc.addImage(dataUrl, "PNG", margin, nextY, imgW, imgH);
  return nextY + imgH + 14;
}

function addRasterImageToPdf(
  doc: jsPDF,
  dataUrl: string,
  margin: number,
  y: number,
  contentWidthPt: number,
  imgHeightPt: number,
  pageHeight: number
): number {
  let nextY = y;
  if (nextY + imgHeightPt > pageHeight - margin) {
    doc.addPage();
    nextY = margin;
  }
  const fmt = dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
  doc.addImage(dataUrl, fmt, margin, nextY, contentWidthPt, imgHeightPt);
  return nextY + imgHeightPt + 16;
}

export async function exportGraphicNovelPdf(params: {
  story: GeneratedStory;
  images: Record<string, string>;
}): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  try {
    await document.fonts.load("16px 'Noto Sans KR'");
    await document.fonts.load("34px 'Noto Sans KR'");
  } catch {
    await document.fonts.ready;
  }
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidthPt = pageWidth - margin * 2;
  const widthPx = Math.max(320, Math.floor(contentWidthPt * PT_TO_CSS_PX));

  let y = margin;

  const coverHtml = `
    <h1 style="margin:0 0 14px;font-size:34px;font-weight:800;line-height:1.25;color:#09090b;">
      ${escapeHtml(params.story.title || "제목 없음")}
    </h1>
    <p style="margin:0;font-size:16px;color:#52525b;line-height:1.5;">
      <strong>테마</strong> · ${escapeHtml(params.story.theme)}
    </p>
  `;
  const coverCanvas = await renderHtmlToCanvas(coverHtml, widthPx);
  y = addCanvasToPdf(doc, coverCanvas, margin, y, contentWidthPt, pageHeight);

  const imgHeightPt = 200;

  for (const scene of params.story.scenes) {
    const label = `SCENE ${String(scene.sceneNumber).padStart(2, "0")}`;
    const sceneHtml = `
      <div style="font-size:14px;line-height:1.55;">
        <div style="color:#7c3aed;font-weight:700;font-size:12px;letter-spacing:0.12em;margin-bottom:6px;">
          ${escapeHtml(label)}
        </div>
        <div style="font-size:20px;font-weight:700;margin-bottom:10px;color:#18181b;">
          ${escapeHtml(scene.title)}
        </div>
        <p style="margin:0;white-space:pre-wrap;color:#3f3f46;">
          ${escapeHtml(scene.story)}
        </p>
      </div>
    `;
    const sceneCanvas = await renderHtmlToCanvas(sceneHtml, widthPx);
    y = addCanvasToPdf(doc, sceneCanvas, margin, y, contentWidthPt, pageHeight);

    const imgUrl = params.images[String(scene.sceneNumber)];
    if (imgUrl) {
      const dataUrl = await fetchDataUrl(imgUrl);
      if (dataUrl) {
        y = addRasterImageToPdf(
          doc,
          dataUrl,
          margin,
          y,
          contentWidthPt,
          imgHeightPt,
          pageHeight
        );
      }
    }
  }

  const safeName = (params.story.title || "graphic-novel")
    .replace(/[\\/:*?"<>|]/g, "_")
    .slice(0, 80);
  doc.save(`${safeName}.pdf`);
}
