import "./UploadOverlay.css";

type UploadImagesProps = {
  progress: number;
  ms: number;
};

function eta(progress: number, ms: number) {
  if (progress < 1) return null;
  const elapsed = ms;
  const estTotal = (elapsed / progress) * 100;
  return Math.round((estTotal - elapsed) / 1000);
}

const UploadOverlay = ({ progress, ms }: UploadImagesProps) => {
  if (progress === 0 || progress === 100) return null;

  const secs = eta(progress, ms);

  return (
    <div className="uploadOverlay">
      <div className="uploadBox">
        <div className="title">Ladataan kuvaa…</div>

        <div className="barContainer">
          <div className="barFill" style={{ width: `${progress}%` }} />
        </div>

        <div className="meta">
          {progress}% {secs !== null ? `(${secs}s jäljellä)` : ""}
        </div>
      </div>
    </div>
  );
};

export default UploadOverlay;
