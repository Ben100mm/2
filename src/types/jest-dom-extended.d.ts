/**
 * Extended Jest DOM type declarations
 * This ensures TypeScript recognizes the custom Jest matchers from @testing-library/jest-dom
 */

import '@testing-library/jest-dom';

// Extend the global Jest namespace
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveValue(value: string | string[] | number): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toHaveFocus(): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toHaveDescription(text?: string | RegExp): R;
      toHaveAccessibleDescription(text?: string | RegExp): R;
      toHaveAccessibleName(text?: string | RegExp): R;
      toHaveFormValues(expectedValues: Record<string, any>): R;
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
      toHaveStyle(css: string | Record<string, any>): R;
      toHaveAccessibleErrorMessage(text?: string | RegExp): R;
    }
  }
}

export {};
