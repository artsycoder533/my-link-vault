import { test, expect, describe } from "vitest";
import {render, screen} from '@testing-library/react';
import Footer from "../components/Footer";
import { getDate } from "../util/helpers";

describe('Footer', () => {
    test('should render Footer with correct content', () => {     
        render(<Footer />);

        expect(screen.getByText(/made with/i)).toBeInTheDocument();
        expect(screen.getByRole('link', {
            name: /natasha johnson/i
          })).toBeInTheDocument();
        const currentYear = getDate();
        expect(screen.getByText(currentYear)).toBeInTheDocument();
        expect(screen.getByText('2024')).toBeInTheDocument(); // Use the mocked value directly
    })
})