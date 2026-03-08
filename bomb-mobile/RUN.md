# Don't Explode - Bomb Defusal Game

## How to Run

### 1. Navigate to the app directory
```bash
cd bomb-mobile
```

### 2. Install dependencies (if not already done)
```bash
npm install
```

### 3. Start the Expo development server
```bash
npx expo start
```

### 4. Run on your device

**Option A: On your phone**
- Install "Expo Go" app from App Store (iOS) or Play Store (Android)
- Scan the QR code shown in the terminal with Expo Go

**Option B: iOS Simulator**
- Press `i` in the terminal

**Option C: Android Emulator**
- Press `a` in the terminal

**Option D: Web Browser**
- Press `w` in the terminal

## Game Flow
1. Welcome Screen → Tap to start
2. Home Screen → Select players, timer, game mode
3. Player Rules → Each player sees their 2 rules
4. Bomb Screen → Defuse the bomb before time runs out!

## Troubleshooting

If port 8081 is already in use:
```bash
lsof -ti:8081 | xargs kill -9
npx expo start
```
