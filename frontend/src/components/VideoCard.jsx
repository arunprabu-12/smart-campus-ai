/** VideoCard component for YouTube search results. */
export default function VideoCard({ video }) {
  return (
    <a
      href={video.video_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {video.thumbnail && (
        <img
          src={video.thumbnail}
          alt={video.video_title}
          className="w-20 h-14 rounded object-cover flex-shrink-0"
        />
      )}
      <div className="overflow-hidden">
        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{video.video_title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{video.channel_name}</p>
        <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1">▶ Watch on YouTube</span>
      </div>
    </a>
  )
}
