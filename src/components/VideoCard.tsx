import { Video } from "@/lib/news-data";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

export default function VideoCard({ video }: { video: Video }) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;
  
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
        <Image 
          src={thumbnailUrl} 
          alt={video.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized 
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-dark/80 backdrop-blur-sm text-white text-xs font-bold uppercase px-2 py-1 rounded">
            {video.category}
          </span>
        </div>
      </div>
      <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
        {video.title}
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        {new Date(video.date).toLocaleDateString()}
      </p>
    </div>
  );
}
