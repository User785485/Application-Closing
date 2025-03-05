import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../components/ui/button';

describe('Button Component', () => {
  // Test de rendu de base
  test('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  // Test de variants
  test.each([
    ['primary', 'bg-primary-600'],
    ['secondary', 'bg-secondary-600'],
    ['success', 'bg-success-600'],
    ['danger', 'bg-danger-600'],
    ['outline', 'bg-transparent'],
    ['ghost', 'bg-transparent']
  ])('renders %s variant with correct classes', (variant, expectedClass) => {
    render(<Button variant={variant as any}>Button</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain(expectedClass);
  });

  // Test de tailles
  test.each([
    ['xs', 'px-2 py-1 text-xs'],
    ['sm', 'px-3 py-1.5 text-sm'],
    ['md', 'px-4 py-2 text-base'],
    ['lg', 'px-6 py-3 text-lg']
  ])('renders %s size with correct classes', (size, expectedClasses) => {
    render(<Button size={size as any}>Button</Button>);
    const button = screen.getByRole('button');
    
    // Vu00e9rifie chaque classe individuellement pour plus de pru00e9cision
    expectedClasses.split(' ').forEach(expectedClass => {
      expect(button.className).toContain(expectedClass);
    });
  });

  // Test de l'u00e9tat de chargement
  test('displays loading spinner when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    const spinner = document.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  // Test de l'u00e9tat de du00e9sactivation
  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  // Test des icons
  test('renders with left and right icons', () => {
    const LeftIcon = () => <span data-testid="left-icon">L</span>;
    const RightIcon = () => <span data-testid="right-icon">R</span>;
    
    render(
      <Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
        With Icons
      </Button>
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  // Test de la largeur
  test('has full width when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('w-full');
  });

  // Test d'u00e9vu00e9nement de clic
  test('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test de valeurs invalides (pour tester la ru00e9silience)
  test('uses default values for invalid props', () => {
    // @ts-ignore - Test intentionnel de valeur invalide
    render(<Button variant="invalid" size="invalid">Invalid Props</Button>);
    
    const button = screen.getByRole('button');
    // Devrait avoir les classes par du00e9faut
    expect(button.className).toContain('bg-primary-600');
    expect(button.className).toContain('px-4 py-2 text-base');
  });
});
