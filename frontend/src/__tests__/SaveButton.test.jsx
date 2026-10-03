import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SaveButton } from '../components/common/ShareSave';

describe('save control', () => {
  it('toggles the saved state', () => {
    const onToggle = vi.fn();
    const { rerender } = render(<SaveButton saved={false} onToggle={onToggle} />);
    const button = screen.getByRole('button', { name: /^save$/i });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
    rerender(<SaveButton saved onToggle={onToggle} />);
    expect(screen.getByRole('button', { name: /^saved$/i })).toHaveAttribute('aria-pressed', 'true');
  });
});
