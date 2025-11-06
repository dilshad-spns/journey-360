# Speech Recognition Permission Fix

## ✅ Fixed Issue: "NotAllowedError: Permission denied"

The error occurs when the browser blocks microphone access. This has been fixed with comprehensive permission handling, security checks, and user-friendly error messages with actionable solutions.

---

## 🔧 What Was Fixed

### 1. **Secure Context Detection (HTTPS Check)**
Before attempting microphone access, the app now:
- Checks if the site is accessed via HTTPS or localhost
- Shows a clear warning banner if using HTTP
- Prevents permission errors by detecting insecure contexts early
- Explains why HTTPS is required for microphone access

### 2. **Proper Microphone Permission Request**
Before starting speech recognition, the app now:
- Explicitly requests microphone permission using `navigator.mediaDevices.getUserMedia()`
- Checks if mediaDevices API is available (browser support)
- Waits for user approval before initializing speech recognition
- Handles permission denial gracefully with clear error messages

### 2. **Permission State Tracking**
Added state management for microphone permissions:
```typescript
const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
```

### 3. **Browser-Specific Error Messages**
Now handles all error types with context-aware, browser-specific instructions:
- ✅ `NotAllowedError` → Detects browser (Chrome/Edge/Safari/Firefox) and provides specific instructions
- ✅ `NotFoundError` → "No microphone found. Please connect a microphone and try again."
- ✅ `NotSupportedError` → "Your browser doesn't support microphone access. Use Chrome, Edge, or Safari."
- ✅ `NotReadableError` → "Microphone is already in use by another application."
- ✅ `OverconstrainedError` → "Unable to access microphone with requested settings."
- ✅ `SecurityError` → "Microphone access blocked due to security settings (HTTPS required)."
- ✅ `no-speech` → "No speech detected. Please try speaking again."
- ✅ `audio-capture` → "No microphone found. Please check your microphone connection."
- ✅ `network` → "Network error. Please check your internet connection."
- ✅ `aborted` → Silent (user stopped recording)

### 4. **Visual Feedback & Actionable Help**
Added multiple visual indicators and helpful tools:

#### Top Banner Warnings (New)
- **Permission Denied Banner**: Shows collapsible browser-specific instructions in speech mode
- **HTTPS Warning Banner**: Displays if site is accessed via HTTP (not secure)
- Both banners appear at the top before the header for maximum visibility

#### Error Alert Box (Enhanced)
- Shows at the top of the input area when an error occurs
- Red/destructive color scheme with clear error message
- **"Test Microphone" button** - Opens online mic test tool in new tab
- **"View detailed guide" link** - Opens comprehensive troubleshooting guide
- Dismissible with X button
- Browser-specific instructions included in error text

#### Microphone Button Indicators
- **Normal**: Gray with hover effect
- **Speech Mode**: Blue/primary with pulsing animation
- **Recording**: Red background
- **Permission Denied**: Red dot badge on top-right corner

#### Empty State Hint
- **Permission Granted**: Pulsing blue microphone icon + "Click the microphone button below to start"
- **Permission Denied**: Red microphone icon + "Microphone access denied. Please enable it in browser settings or type instead."

---

## 🎯 How It Works Now

### User Flow with Permission:

1. **User clicks microphone button**
2. **Browser shows permission prompt** (first time only)
3. **User clicks "Allow"**
4. **Permission granted** → Recording starts
5. **Speech is transcribed** in real-time

### User Flow with Denied Permission:

1. **User clicks microphone button**
2. **Browser shows permission prompt** OR permission was previously denied
3. **User clicks "Block"** OR permission is already blocked
4. **Error message displays**: "Microphone access denied..."
5. **Helpful instructions shown**: "To enable: Click the microphone icon in your browser's address bar..."
6. **User can dismiss error** and type manually instead

### Automatic Permission Check:

On component mount, the app:
- Checks current permission status using `navigator.permissions.query()`
- Updates UI to show permission state
- Listens for permission changes
- Falls back gracefully if Permissions API is not supported

---

## 🎨 Visual Error States

### Error Alert (New Component)
```
┌─────────────────────────────────────────────────────┐
│ ⊗  Microphone access denied. Please allow           │
│    microphone access in your browser settings.      │
│                                                      │
│    To enable: Click the microphone icon in your   X │
│    browser's address bar and allow access.          │
└─────────────────────────────────────────────────────┘
```

### Microphone Button States
- **Default**: `🎤` (gray)
- **Speech Mode**: `🎤` (blue, pulsing)
- **Recording**: `🎤` (red background)
- **Permission Denied**: `🎤🔴` (red dot badge)

### Empty State (Speech Mode)
- **With Permission**: Pulsing blue mic + encouraging text
- **Without Permission**: Static red mic + instructions

---

## 🧪 Testing Guide

### Test Permission Grant:
1. Go to Landing Page
2. Click "Narrate User Story"
3. Click microphone button
4. Browser shows permission prompt
5. Click **"Allow"**
6. ✅ Recording should start immediately
7. Speak and verify transcription appears

### Test Permission Deny:
1. Go to Landing Page
2. Click "Narrate User Story"
3. Click microphone button
4. Browser shows permission prompt
5. Click **"Block"**
6. ✅ Error message appears explaining the issue
7. ✅ Red dot appears on mic button
8. ✅ Empty state shows red mic icon
9. User can dismiss error and type instead

### Test Permission Already Denied:
1. Ensure mic permission is already denied (block it in browser)
2. Go to "Narrate User Story"
3. ✅ Empty state shows red mic icon immediately
4. Click microphone button
5. ✅ Error message appears immediately (no browser prompt)
6. ✅ Instructions show how to re-enable

### Test Re-Enabling Permission:
1. After denying permission, click the 🔒 lock icon in browser address bar
2. Find "Microphone" permission
3. Change to "Allow"
4. Refresh the page
5. ✅ Blue mic icon should appear
6. Click mic button
7. ✅ Recording starts without error

---

## 🌐 Browser Support

### Full Support:
- ✅ **Chrome** (all versions with Web Speech API)
- ✅ **Edge** (Chromium-based)
- ✅ **Safari** (with webkit prefix)

### Permission API Support:
- ✅ Chrome 43+
- ✅ Edge 79+
- ✅ Safari 16+
- ⚠️ Firefox (limited - falls back gracefully)

### Error Handling:
- All browsers get proper error messages
- Unsupported browsers show: "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari, or type your requirements instead."

---

## 📝 Error Messages Reference

| Error Code | User-Friendly Message | Action |
|------------|----------------------|---------|
| `not-allowed` | Microphone access denied. Please allow microphone access in your browser settings. | Shows how to enable in browser |
| `no-speech` | No speech detected. Please try speaking again. | User can retry |
| `audio-capture` | No microphone found. Please check your microphone connection. | Check hardware |
| `network` | Network error. Please check your internet connection. | Check connection |
| `not-supported` | Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari, or type your requirements instead. | Use different browser or type |

---

## 🔒 Security & Privacy

### HTTPS Requirement:
- Microphone access requires HTTPS in production
- Works on `localhost` for development
- Users will see security warnings on HTTP sites

### Permission Persistence:
- Permission choice is saved by the browser
- Persists across sessions
- Users can revoke at any time from browser settings

### No Audio Storage:
- Audio is processed in real-time by browser
- Not sent to any server
- Not stored or recorded by the app
- Only text transcription is kept

---

## 🛠️ Technical Implementation

### New State Variables:
```typescript
const [speechError, setSpeechError] = useState<string>('');
const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
```

### Permission Check on Mount:
```typescript
useEffect(() => {
  const checkMicPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' });
      setMicPermission(result.state);
      result.onchange = () => setMicPermission(result.state);
    } catch {
      setMicPermission('prompt');
    }
  };
  checkMicPermission();
}, []);
```

### Permission Request Before Recording:
```typescript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
stream.getTracks().forEach(track => track.stop());
setMicPermission('granted');
```

### Error Handling in Recognition:
```typescript
recognition.onerror = (event) => {
  switch (event.error) {
    case 'not-allowed':
      setSpeechError('Microphone access denied...');
      setMicPermission('denied');
      break;
    // ... other cases
  }
};
```

---

## 💡 User Instructions (Copy-Paste Ready)

### For Chrome/Edge Users:
```
To enable microphone:
1. Click the 🔒 icon in the address bar (left of URL)
2. Find "Microphone" in the permissions list
3. Select "Allow"
4. Refresh the page
```

### For Safari Users:
```
To enable microphone:
1. Go to Safari > Settings for This Website
2. Find "Microphone" dropdown
3. Select "Allow"
4. Refresh the page
```

### For Firefox Users:
```
To enable microphone:
1. Click the 🔒 icon in the address bar
2. Click "Connection Secure"
3. Click "More Information"
4. Go to "Permissions" tab
5. Find "Use the Microphone"
6. Uncheck "Use Default" and check "Allow"
7. Refresh the page
```

---

## ✨ Benefits

1. **Better UX**: Users know exactly what went wrong and how to fix it
2. **No Confusion**: Clear error messages instead of silent failures
3. **Visual Feedback**: Multiple indicators show permission status
4. **Graceful Fallback**: Users can always type if speech fails
5. **Persistent State**: Permission is checked and tracked throughout session
6. **Helpful Instructions**: Built-in guides for enabling permissions

---

## 🐛 Troubleshooting

### "Microphone access denied" even after allowing:
- Try refreshing the page (Cmd+R / Ctrl+R)
- Clear site data in browser settings
- Check system microphone permissions (macOS/Windows)

### No browser permission prompt appears:
- Permission was previously denied - check browser settings
- Using HTTP instead of HTTPS - switch to HTTPS
- Browser doesn't support Permissions API - try Chrome

### Recording stops immediately:
- Microphone is being used by another app
- Browser lost microphone access
- Network connection interrupted (speech API uses internet)

### Transcript not appearing:
- Speak louder or closer to microphone
- Check microphone is not muted
- Ensure language is set to English (currently hardcoded)
- Check internet connection (API requires network)
