declare module "@storybook/react-native" {
  export function getStorybookUI(options: any): React.ComponentType<any>;
  export function configure(loader: () => void, module: any): void;
  export function addDecorator(decorator: any): void;
}

declare module "@storybook/addon-ondevice-backgrounds" {
  export function withBackgrounds(story: any): any;
}

declare module "@storybook/addon-ondevice-controls" {
  // Add type definitions as needed
}

declare module "@storybook/addon-ondevice-notes" {
  // Add type definitions as needed
}
