import { useAppSelector } from "../../hooks/useRedux.js";

import "./UploadOverlay.css";

function eta(progress: number | null, ms: number | null) {
  if (progress === null || ms === null) return null;
  const elapsed = ms;
  const estTotal = (elapsed / progress) * 100;
  return Math.round((estTotal - elapsed) / 1000);
}

const UploadOverlay = () => {
  const progress = useAppSelector((state) => {
    return state.progress;
  });

  if (progress === null) return null;
  if (progress?.progress === null || progress?.progress === 100) return null;

  const secs = eta(progress.progress, progress.ms);

  return (
    <div className="uploadOverlay">
      <div className="uploadBox">
        <div className="title">Ladataan kuvaa…</div>

        <div className="barContainer">
          <div className="barFill" style={{ width: `${progress.progress}%` }} />
        </div>

        <div className="meta">
          {progress.progress}% {secs !== null ? `(${secs}s jäljellä)` : ""}
        </div>
      </div>
    </div>
  );
};

export default UploadOverlay;
