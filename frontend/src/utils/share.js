export async function shareCurrentPage(title) {
  const url = window.location.href;
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, url });
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') return 'aborted';
    }
  }
  await navigator.clipboard.writeText(url);
  return 'copied';
}
