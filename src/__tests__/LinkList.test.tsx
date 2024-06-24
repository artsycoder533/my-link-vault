import { test, expect, describe, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import LinkList from "../components/LinkList";
import mockDb from "../__mocks__/db";
import userEvent from "@testing-library/user-event";

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

const renderWithMockDb = async (links = sampleLinks) => {
  await mockDb.links.bulkAdd(links);
  render(<LinkList dbInstance={mockDb} />);
};

describe("LinkList", () => {
  beforeEach(async () => {
    // clear the mock db before each test
    await mockDb.links.clear();
  });

  test("should render your list is empty by default", async() => {
    await renderWithMockDb();

    const showFiltersButton = screen.getByText(/empty/i);
    expect(showFiltersButton).toBeInTheDocument();
  });

  test("should render filter form if list is not empty", async () => {
    await renderWithMockDb();
    await waitFor(() => {
      const link1 = screen.getByText("Example 1");
      const link2 = screen.getByText("Example 2");
      expect(link1).toBeInTheDocument();
      expect(link2).toBeInTheDocument();
    });

    const filterButton = screen.getByRole("button", { name: /show filters/i });

    expect(filterButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(filterButton);

    const selectTag = screen.getByLabelText(/select tag/i);
    const selectCategory = screen.getByLabelText(
      /select category/i
    ) as HTMLSelectElement;
    const removeFiltersButton = screen.getByRole("button", {
      name: /hide filters/i,
    });

    expect(selectTag).toBeInTheDocument();
    expect(selectCategory).toBeInTheDocument();
    expect(removeFiltersButton).toBeInTheDocument();

    const options = Array.from(selectCategory.options).map(
      (option) => option.value
    );
    const expectedOptions = [
      "",
      "website",
      "tool",
      "blog",
      "youtube",
      "course",
      "documentation",
    ];

    expect(options).toEqual(expectedOptions);
  });

  test("should toggle show filters button to hide filters when pressed", async () => {
    await renderWithMockDb();

    await waitFor(() => {
      screen.getByText("Example 1");
      screen.getByText("Example 2");
    });

    const filterButton = screen.getByRole("button", { name: /show filters/i });
    const user = userEvent.setup();

    await user.click(filterButton);

    expect(filterButton).toHaveTextContent(/hide filters/i);
    await user.click(filterButton);
    expect(filterButton).toHaveTextContent(/show filters/i);
  });

  test("should filter links by tag", async () => {
    await renderWithMockDb();

    await waitFor(() => {
      screen.getByText("Example 1");
      screen.getByText("Example 2");
    });

    const filterButton = screen.getByText(/show filters/i);
    const user = userEvent.setup();
    await user.click(filterButton);
    const selectTag = screen.getByLabelText(/select tag/i);
    await user.selectOptions(selectTag, "next");
    const link1 = screen.getByText("Example 1");
    const link2 = screen.queryByText("Example 2");
    expect(link1).toBeInTheDocument();
    expect(link2).not.toBeInTheDocument();
  });

  test("should filter links by category", async () => {
    await renderWithMockDb();

    await waitFor(() => {
      screen.getByText("Example 1");
      screen.getByText("Example 2");
    });

    const filterButton = screen.getByText(/show filters/i);
    const user = userEvent.setup();
    await user.click(filterButton);
    const selectCategory = screen.getByLabelText(/select category/i);
    await user.selectOptions(selectCategory, "documentation");
    const link1 = screen.queryByText("Example 1");
    const link2 = screen.getByText("Example 2");
    expect(link2).toBeInTheDocument();
    expect(link1).not.toBeInTheDocument();
  });

  test("should remove filters when remove filters button pressed", async () => {
    await renderWithMockDb();

    await waitFor(() => {
      screen.getByText("Example 1");
      screen.getByText("Example 2");
    });

    const filterButton = screen.getByText(/show filters/i);
    const user = userEvent.setup();
    await user.click(filterButton);
    const selectTag = screen.getByLabelText(/select tag/i);
    const selectCategory = screen.getByLabelText(/select category/i);
    await user.selectOptions(selectCategory, "documentation");
    await user.selectOptions(selectTag, "react");
    const link1 = screen.queryByText("Example 1");
    const link2 = screen.getByText("Example 2");
    await user.selectOptions(selectCategory, "documentation");
    await user.selectOptions(selectTag, "react");
    expect(link2).toBeInTheDocument();
    expect(link1).not.toBeInTheDocument();
    const removeFiltersButton = screen.getByRole("button", {
      name: /remove filters/i,
    });
    await user.click(removeFiltersButton);
    const resetLink1 = screen.getByText("Example 1");
    const resetLink2 = screen.getByText("Example 2");
    expect(resetLink1).toBeInTheDocument();
    expect(resetLink2).toBeInTheDocument();
  });

  test("should display message if no links match the filters", async () => {
    await renderWithMockDb();

    await waitFor(() => {
      screen.getByText("Example 1");
      screen.getByText("Example 2");
    });

    const filterButton = screen.getByText(/show filters/i);
    const user = userEvent.setup();
    await user.click(filterButton);
    const selectTag = screen.getByLabelText(/select tag/i);
    const selectCategory = screen.getByLabelText(/select category/i);
    await user.selectOptions(selectTag, "react");
    await user.selectOptions(selectCategory, "course");

    const message = screen.getByText(/no links match your filters.../i);
    expect(message).toBeInTheDocument();
    const link1 = screen.queryByText("Example 1");
    const link2 = screen.queryByText("Example 2");
    expect(link1).not.toBeInTheDocument();
    expect(link2).not.toBeInTheDocument();
  });

  test("should update link name when edited", async () => {
    await renderWithMockDb();

    await waitFor(() => {
      screen.getByText("Example 1");
      screen.getByText("Example 2");
    });

    const user = userEvent.setup();

    const linkList = screen.getByRole("list");
    const firstLink = within(linkList).getAllByRole("listitem")[0];
    const editButton = within(firstLink).getByTestId("edit-button");
    await user.click(editButton);

    const editInput = within(firstLink).getByTestId("edit-input");
    await user.clear(editInput);
    await user.type(editInput, "new title");
    expect(editInput).toHaveValue("new title");

    const saveButton = within(firstLink).getByTestId("save-button");
    await user.click(saveButton);

    await waitFor(
      () => {
        const updatedTitle = screen.getByText(/new title/i);
        expect(updatedTitle).toBeInTheDocument();

        expect(screen.getByText("new title")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    const updatedLink = await mockDb.links.get(1);

    expect(updatedLink?.title).toBe("new title");

    expect(screen.getByText("Example 2")).toBeInTheDocument();
  });

  test("should remove link from list when delete button is pressed", async () => {
    await renderWithMockDb();

    await waitFor(() => {
      screen.getByText("Example 1");
      screen.getByText("Example 2");
    });

    const user = userEvent.setup();

    const linkList = screen.getByRole("list");
    const firstLink = within(linkList).getAllByRole("listitem")[0];
    const deleteButton = within(firstLink).getByTestId("delete-button");
    await user.click(deleteButton);

    await waitFor(
      () => {
        expect(firstLink).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    const remainingLinks = await mockDb.links.toArray();
    expect(remainingLinks.length).toBe(1);
  });

  test("should navigate the user to the links url in a new tab when clicked", async () => {
    // Mock window.open
    const mockWindowOpen = vi.fn();
    Object.defineProperty(window, "open", {
      value: mockWindowOpen,
    });

    await renderWithMockDb();

    await waitFor(() => {
      screen.getByText("Example 1");
      screen.getByText("Example 2");
    });

    const user = userEvent.setup();

    const linkList = screen.getByRole("list");
    const firstLink = within(linkList).getAllByRole("listitem")[0];
    const anchorElement = within(firstLink).getByRole("link", {
      name: /example 1/i,
    });

    await user.click(anchorElement);

    waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
      expect(mockWindowOpen).toHaveBeenCalledWith(
        "https://example.com",
        "_blank"
      );
    });
  });
});
