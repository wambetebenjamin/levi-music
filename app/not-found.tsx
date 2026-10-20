import Link from "next/link";
import { Music } from "lucide-react";

export default function NotFound() {
  return (
    <div className="levi-error-page">
      <div className="levi-error-inner">
        <p className="levi-error-code">Error 404</p>
        <div className="levi-error-icon" aria-hidden="true">
          <Music size={34} />
        </div>
        <h1>This track could not be found</h1>
        <p>
          The page, artist or track you are looking for is not in the catalogue. It may have been
          renamed or removed by the artist.
        </p>
        <div className="levi-error-actions">
          <Link href="/music" className="btn oneMusic-btn">
            Back to Music
          </Link>
          <Link href="/" className="btn oneMusic-btn">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
