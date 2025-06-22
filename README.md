# Spartan Gym – Front-End

React Native (Expo) application powered by **TypeScript**, **Tailwind CSS/NativeWind**, **Storybook**, and **Jest**.

---

## 1. Quick Start

```bash
# clone the repo (new devs)
$ git clone https://github.com/piyush0028/Sealth.git
$ cd Sealth
# switch to the FrontEnd branch
$ git checkout FrontEnd

# install dependencies
$ npm install

# start the app (Expo CLI)
$ npm start            # or: expo start
```

Open the QR-code with **Expo Go** on a physical device or run an emulator with `i` (ios) / `a` (android).

---

## 2. Project Structure (FrontEnd branch)

```
FrontEnd/
├─ App.tsx                 # entry-point, registers providers & routes
├─ global.css              # Tailwind directives (@tailwind base …)
├─ tailwind.config.js      # Tailwind paths & theme
├─ babel.config.js         # Babel + NativeWind plugin
├─ metro.config.js         # Metro (default)
├─ nativewind-env.d.ts     # Type support for className
├─ src/
│  ├─ EssentialComponents/ # generic UI wrappers (Screen, Header …)
│  ├─ UI(Universal)/       # atomic-design folders
│  │  ├─ atoms/
│  │  │   └─ Heading.tsx
│  │  ├─ molecules/
│  │  └─ organisms/
│  ├─ Forms/
│  │  └─ screens/          # authentication screens (SignIn, …)
│  ├─ hooks/               # custom hooks
│  ├─ utils/               # helpers & test utils
│  └─ types/               # global TS types
├─ tests & stories         # co-located next to components (*.test.tsx / *.stories.tsx)
└─ README.md               # this file
```

---

## 3. NPM Scripts

| Script               | What it does                           |
| -------------------- | -------------------------------------- |
| `npm start`          | Run Metro & Expo app                   |
| `npm android / ios`  | Open Android / iOS simulator           |
| `npm web`            | Run Expo for web                       |
| `npm test`           | Jest unit tests                        |
| `npm run test:watch` | Jest in watch mode                     |
| `npm run storybook`  | Launch Storybook (native on-device UI) |

---

## 4. Tooling & Dependencies

| Category       | Packages (key versions)                                   |
| -------------- | --------------------------------------------------------- |
| Core           | react 19 · react-native 0.79 · expo 53                    |
| Styling        | tailwindcss 3.3 · nativewind 2.0                          |
| Testing        | jest 29 · jest-expo 53 · @testing-library/react-native 12 |
| Component Docs | @storybook/react-native 6.5                               |
| Build Tools    | babel-preset-expo · metro                                 |

---

## 5. Setting Up Locally – Step-by-Step

1. **Node 18+** & **Expo CLI** (`npm i -g expo-cli`).
2. Clone & checkout the `FrontEnd` branch (see Quick Start).
3. `npm install` – installs all dependencies.
4. Run `npm start` → scan QR with Expo Go.
5. Optional: `npm run storybook` for isolated component UI, `npm test` for unit tests.

---

## 6. Storybook & Testing

• **Storybook** stories live next to components (`*.stories.tsx`).  
• **Jest** tests live next to components (`*.test.tsx`).  
• Custom render helper at `src/utils/test-utils.tsx` injects providers.

---

## 7. Troubleshooting

| Problem                       | Fix / Command                                       |
| ----------------------------- | --------------------------------------------------- |
| Metro cache issues            | `npm start -- --reset-cache`                        |
| Tailwind classes not applying | Ensure only **one** `global.css` import (App.tsx)   |
| NativeWind typings missing    | Check `nativewind-env.d.ts`                         |
| Storybook fails to start      | Ensure Expo is **not** already running on port 8081 |

---

Happy coding! 🎉
