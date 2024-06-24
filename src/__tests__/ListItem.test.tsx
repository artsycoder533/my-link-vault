import { test, expect, describe, vi, beforeEach } from "vitest";
import { render, screen } from '@testing-library/react';
import ListItem from "../components/ListItem";
import userEvent, { UserEvent } from '@testing-library/user-event';

// Define the type for the link object
interface Link {
    id: number;
    url: string;
    title: string;
    tag: string;
    category: string;
}


// Define the types for the onEdit and onDelete functions
type OnEdit = (linkId: number, newTitle: string) => Promise<void>;
type OnDelete = (linkId: number) => Promise<void>;

describe('ListItem', () => {
    let mockOnEdit: OnEdit;
    let mockOnDelete: OnDelete;
    let link: Link;
    let user: UserEvent;

    beforeEach(() => {
        mockOnEdit = vi.fn();
        mockOnDelete = vi.fn();
        link = {
            id: 1,
            url: "http://www.example.com",
            title: 'my title',
            tag: 'react',
            category: 'website'
        };
        user = userEvent.setup();

        render(<ListItem link={link} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    });

    test('should render ListItem with correct content', () => {
        const titleLink = screen.getByRole('link', { name: 'my title' });
        expect(titleLink).toBeInTheDocument();
        expect(titleLink).toHaveAccessibleName();

        const editInput = screen.queryByTestId('edit-input');
        expect(editInput).not.toBeInTheDocument();

        const editButton = screen.getByTestId('edit-button');
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveAccessibleName();

        const deleteButton = screen.getByTestId('delete-button');
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveAccessibleName();
    });

    test('clicking edit button renders input box', async () => {
        const editButton = screen.getByTestId('edit-button');
        await user.click(editButton);
        const editInput = screen.getByTestId('edit-input');
        expect(editInput).toBeInTheDocument();
        expect(editInput).toHaveAccessibleName();
    });

    test('typing in the input box updates the rendered text', async () => {
        const editButton = screen.getByTestId('edit-button');
        await user.click(editButton);

        const editInput = screen.getByRole('textbox');
        await user.type(editInput, 'new title');
        expect(editInput).toHaveValue('new title');
    });

    test('clicking the save button updates the title of the link', async () => {
        const editButton = screen.getByTestId('edit-button');
        await user.click(editButton);

        const editInput = screen.getByRole('textbox');
        await user.type(editInput, 'new title');
        
        const saveButton = screen.getByTestId('save-button');
        await user.click(saveButton);
        
        expect(mockOnEdit).toHaveBeenCalledWith(link.id, 'new title');
        expect(mockOnEdit).toHaveBeenCalledTimes(1);
        expect(await screen.findByTestId('edit-button')).toBeInTheDocument();
        expect(screen.queryByTestId('save-button')).not.toBeInTheDocument();
    });

    test('clicking on the link title should take user to the url of the link', () => {
        const titleLink = screen.getByRole('link', { name: link.title });
        expect(titleLink).toHaveAttribute('href', "http://www.example.com");
    });

    test('clicking the delete button calls correct function with parameters', async () => {
        const deleteButton = screen.getByTestId('delete-button');
        await user.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalledWith(link.id);
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
});
