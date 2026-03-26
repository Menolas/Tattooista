/**
 * Image URL helpers.
 * If the stored value is already a full URL (from Uploadthing), return it directly.
 * Otherwise, construct a local path for dev compatibility.
 */

function isExternalUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://")
}

// Seed data stores full relative paths (e.g. "styles/mg_xxx/file.jpg")
// Admin uploads store just the filename (resolved with entity ID)
function isRelativePath(value: string): boolean {
  return value.includes("/")
}

export function galleryImageUrl(fileName: string): string {
  if (isExternalUrl(fileName)) return fileName
  if (isRelativePath(fileName)) return fileName.startsWith("/") ? fileName : `/${fileName}`
  return `/gallery/${fileName}`
}

export function userAvatarUrl(userId: string, avatar: string): string {
  if (isExternalUrl(avatar)) return avatar
  return `/users/${userId}/avatar/${avatar}`
}

export function clientAvatarUrl(clientId: string, avatar: string): string {
  if (isExternalUrl(avatar)) return avatar
  return `/clients/${clientId}/avatar/${avatar}`
}

export function styleWallpaperUrl(styleId: string, wallPaper: string): string {
  if (isExternalUrl(wallPaper)) return wallPaper
  if (isRelativePath(wallPaper)) return `/${wallPaper}`
  return `/styleWallpapers/${styleId}/${wallPaper}`
}

export function serviceWallpaperUrl(serviceId: string, wallPaper: string): string {
  if (isExternalUrl(wallPaper)) return wallPaper
  return `/serviceWallpapers/${serviceId}/${wallPaper}`
}

export function pageWallpaperUrl(pageId: string, wallPaper: string): string {
  if (isExternalUrl(wallPaper)) return wallPaper
  return `/pageWallpapers/${pageId}/${wallPaper}`
}

export function reviewImageUrl(reviewId: string, fileName: string): string {
  if (isExternalUrl(fileName)) return fileName
  return `/reviews/${reviewId}/${fileName}`
}

export function clientGalleryImageUrl(clientId: string, fileName: string): string {
  if (isExternalUrl(fileName)) return fileName
  return `/clients/${clientId}/${fileName}`
}
