import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HeroGallery from '../components/gallery/HeroGallery';

const photos = [1, 2, 3, 4, 5].map((id) => ({
  id: `photo-${id}`,
  url: `/images/photo-${id}.jpg`,
  alt: `Room photo ${id}`,
  sectionId: 'bedroom',
}));

describe('hero gallery', () => {
  it('opens the photo tour from a hero image', () => {
    const onOpenPhoto = vi.fn();
    render(<HeroGallery photos={photos} onOpenPhoto={onOpenPhoto} onShowAll={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /photo 1 of 5/i }));
    expect(onOpenPhoto).toHaveBeenCalledWith(photos[0]);
  });

  it('opens the photo tour from Show all photos', () => {
    const onShowAll = vi.fn();
    render(<HeroGallery photos={photos} onOpenPhoto={vi.fn()} onShowAll={onShowAll} />);
    fireEvent.click(screen.getByRole('button', { name: /show all photos/i }));
    expect(onShowAll).toHaveBeenCalledTimes(1);
  });
});
