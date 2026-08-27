export const PROJECT_MODAL_SLIDE_INTERVAL_MS = 2500;

export function getAdjacentProjectId(projects, currentId, direction) {
  if (!projects?.length) return null;

  const currentIndex = projects.findIndex((project) => project.id === currentId);
  const safeIndex = currentIndex < 0 ? 0 : currentIndex;
  const nextIndex = (safeIndex + direction + projects.length) % projects.length;

  return projects[nextIndex].id;
}

export function getProjectVisitUrl(project) {
  return project?.visitUrl || project?.githubUrl || null;
}

export function preloadProjectGallery(gallery, createImage = () => new Image()) {
  return Promise.all((gallery ?? []).map((src) => new Promise((resolve) => {
    const image = createImage();
    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;
  })));
}
