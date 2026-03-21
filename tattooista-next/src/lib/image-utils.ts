/**
 * Image URL helpers matching the original MERN app's file storage structure.
 * Files are served from /public/ which maps to Server/uploads/ via symlinks.
 */

export function galleryImageUrl(fileName: string): string {
  return `/gallery/${fileName}`
}

export function userAvatarUrl(userId: string, avatar: string): string {
  return `/users/${userId}/avatar/${avatar}`
}

export function clientAvatarUrl(clientId: string, avatar: string): string {
  return `/clients/${clientId}/avatar/${avatar}`
}

export function styleWallpaperUrl(styleId: string, wallPaper: string): string {
  return `/styleWallpapers/${styleId}/${wallPaper}`
}

export function serviceWallpaperUrl(serviceId: string, wallPaper: string): string {
  return `/serviceWallpapers/${serviceId}/${wallPaper}`
}

export function pageWallpaperUrl(pageId: string, wallPaper: string): string {
  return `/pageWallpapers/${pageId}/${wallPaper}`
}

export function reviewImageUrl(reviewId: string, fileName: string): string {
  return `/reviews/${reviewId}/${fileName}`
}