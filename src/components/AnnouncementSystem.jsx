import useAnnouncements from "../hooks/useAnnouncements";
import "../styles/announcement.css";

export default function AnnouncementSystem() {
  const { announcement, setAnnouncement } = useAnnouncements();

  if (!announcement) return null;

  return (
    <div className="announcement-wrapper">
      <div className="announcement-card">
        <button className="announcement-close" onClick={() => setAnnouncement(null)}>
          ✖
        </button>
        <p>{announcement}</p>
      </div>
    </div>
  );
}
