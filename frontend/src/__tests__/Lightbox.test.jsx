import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Lightbox from '../components/gallery/Lightbox';

const photos = [
  { id: 'a', url: '/a.jpg', alt: 'Bedroom', sectionTitle: 'Bedroom' },
  { id: 'b', url: '/b.jpg', alt: 'Kitchen', sectionTitle: 'Full kitchen' },
];

describe('lightbox keyboard controls', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('moves with ArrowRight and ArrowLeft and closes on Escape', () => {
    const onClose = vi.fn();
    render(
      <Lightbox photos={photos} initialIndex={0} onClose={onClose} saved={false} onToggleSaved={vi.fn()} />,
    );

    expect(screen.getByText('1 of 2')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    act(() => { vi.advanceTimersByTime(150); });
    expect(screen.getByText('2 of 2')).toBeInTheDocument();
    expect(screen.getByText('Full kitchen')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    act(() => { vi.advanceTimersByTime(150); });
    expect(screen.getByText('1 of 2')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('changes the photo from the next and previous buttons', () => {
    render(<Lightbox photos={photos} initialIndex={0} onClose={vi.fn()} saved={false} onToggleSaved={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /next photo/i }));
    act(() => { vi.advanceTimersByTime(150); });
    expect(screen.getByText('2 of 2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /previous photo/i }));
    act(() => { vi.advanceTimersByTime(150); });
    expect(screen.getByText('1 of 2')).toBeInTheDocument();
  });
});
