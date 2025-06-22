# Testing Setup Guide

This project is configured with Jest, React Native Testing Library, and Storybook for comprehensive UI testing.

## Running Tests

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Storybook

```bash
# Start Storybook
npm run storybook
```

## File Structure

### Tests

- Test files should be named: `ComponentName.test.tsx` or `ComponentName.spec.tsx`
- Place test files next to the component they test
- Use the custom render function from `src/utils/test-utils.tsx` for consistent provider setup

### Stories

- Story files should be named: `ComponentName.stories.tsx`
- Place story files next to the component they showcase
- Import stories in `storybook.requires.js`

## Writing Tests

### Example Test

```typescript
import React from "react";
import { render, screen } from "@testing-library/react-native";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Expected Text")).toBeTruthy();
  });
});
```

### Example Story

```typescript
import React from "react";
import MyComponent from "./MyComponent";

export default {
  title: "Atoms/MyComponent",
  component: MyComponent,
};

export const Default = () => <MyComponent />;
export const WithProps = () => <MyComponent prop="value" />;
```

## Testing Best Practices

1. **Test behavior, not implementation**
2. **Use semantic queries** (getByText, getByRole, etc.)
3. **Test accessibility** where applicable
4. **Keep tests focused and isolated**
5. **Use descriptive test names**

## Storybook Best Practices

1. **Create multiple stories** for different states
2. **Use controls** for interactive props
3. **Add notes** for component documentation
4. **Test different backgrounds** and contexts
5. **Group related components** in the same folder
