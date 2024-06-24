import { render, screen, waitFor } from '@testing-library/react';
import { test, expect, describe, vi, afterEach } from "vitest";
import Export from '../components/Export';
import userEvent from '@testing-library/user-event';

const sampleLinks = [
  {
    id: 1,
    url: "https://example.com",
    title: "Example 1",
    tag: "next",
    category: "website",
  },
  {
    id: 2,
    url: "https://example2.com",
    title: "Example 2",
    tag: "react",
    category: "documentation",
  },
];

const setup = async (list = sampleLinks) => {
  render(<Export list={list} />);
  const user = userEvent.setup();
  return { user };
};

describe('Export', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render upload form under details section', async () => {
    const { user } = await setup();

    await user.click(screen.getByText(/already exported your links\?/i));
    const inputElement = screen.getByLabelText(/upload your json file here/i) as HTMLInputElement;

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'file');
    expect(inputElement).toHaveAttribute('name', 'data');
    expect(inputElement).toHaveAttribute('accept', '.json');
    expect(inputElement.files).toHaveLength(0);

    await user.click(screen.getByText(/need to backup your links?/i));
    expect(screen.getByText(/this will save your data to a json file/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export links/i })).toBeInTheDocument();
  });

  test('should not render export dropdown if list is empty', async () => {
    await setup([]);
    expect(screen.queryByText(/need to backup your links?/i)).not.toBeInTheDocument();
  });

  test('should trigger export on button click', async () => {
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = vi.fn(() => 'mock-url');
    URL.revokeObjectURL = vi.fn();

    const { user } = await setup();

    await user.click(screen.getByText(/need to backup your links?/i));
    await user.click(screen.getByRole('button', { name: /export links/i }));

    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
    });

    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });
});
