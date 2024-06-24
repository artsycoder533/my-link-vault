import { test, expect, describe, vi } from "vitest";
import { render, screen } from '@testing-library/react';
import Footer from "../components/Footer";
import { getDate } from "../util/helpers"; 

describe('Footer', () => {
    test('should render Footer with correct content', () => {
        const mockYear = 2024;
        // Mock the getDate function
        vi.spyOn({ getDate }, 'getDate').mockReturnValue(mockYear);
        
        render(<Footer />);

        expect(screen.getByText(/made with/i)).toBeInTheDocument();
        expect(screen.getByRole('link', {
            name: /natasha johnson/i
        })).toBeInTheDocument();
        
        expect(screen.getByText(mockYear)).toBeInTheDocument();

        // Restore the original implementation
        vi.restoreAllMocks();
    });
});
