export function flattenPhotos(sections = []) {
  const photos = [];
  sections.forEach((section) => {
    section.photos.forEach((photo, index) => {
      photos.push({
        ...photo,
        sectionId: section.id,
        sectionTitle: section.title,
        indexInSection: index,
        sectionCount: section.photos.length,
      });
    });
  });
  return photos;
}
