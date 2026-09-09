import { getVideos } from "@/lib/news-data";
import VideoCard from "@/components/VideoCard";

export default function VideosPage() {
  const videos = getVideos();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 border-b-4 border-primary inline-block pb-2">
        <h1 className="text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
          Latest Videos
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
