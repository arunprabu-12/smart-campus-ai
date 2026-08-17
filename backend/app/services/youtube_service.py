"""Spec section 5 — YouTube Data API v3 integration. Never fabricates video URLs."""
import httpx
from app.config import settings

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


def search_videos(query: str, max_results: int = 3) -> list[dict]:
    """
    Call YouTube Data API v3 search endpoint.
    Returns [] if the API key is missing or the call fails.
    Each result: { video_title, channel_name, duration, video_url, video_id }
    """
    if not settings.youtube_api_key:
        return []

    try:
        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": max_results,
            "relevanceLanguage": "en",
            "key": settings.youtube_api_key,
        }
        response = httpx.get(YOUTUBE_SEARCH_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        videos = []
        for item in data.get("items", []):
            video_id = item["id"].get("videoId")
            if not video_id:
                continue
            snippet = item.get("snippet", {})
            videos.append({
                "video_id": video_id,
                "video_title": snippet.get("title", ""),
                "channel_name": snippet.get("channelTitle", ""),
                "duration": "",  # duration requires a separate /videos?part=contentDetails call
                "video_url": f"https://www.youtube.com/watch?v={video_id}",
                "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
            })
        return videos

    except Exception as e:
        print(f"[YouTube API Error] {e}")
        return []


def fetch_video_duration(video_id: str) -> str:
    """
    Optionally fetch ISO-8601 duration for a single video.
    Returns a human-readable string like '12:34' or '' on failure.
    """
    if not settings.youtube_api_key:
        return ""
    try:
        params = {
            "part": "contentDetails",
            "id": video_id,
            "key": settings.youtube_api_key,
        }
        response = httpx.get(
            "https://www.googleapis.com/youtube/v3/videos",
            params=params,
            timeout=10,
        )
        response.raise_for_status()
        items = response.json().get("items", [])
        if not items:
            return ""
        raw = items[0]["contentDetails"]["duration"]  # e.g. "PT12M34S"
        return _parse_iso_duration(raw)
    except Exception:
        return ""


def _parse_iso_duration(iso: str) -> str:
    """Convert PT12M34S → '12:34'."""
    import re
    match = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso)
    if not match:
        return ""
    h, m, s = match.group(1), match.group(2), match.group(3)
    parts = []
    if h:
        parts.append(h.zfill(2))
    parts.append((m or "0").zfill(2))
    parts.append((s or "0").zfill(2))
    return ":".join(parts)
