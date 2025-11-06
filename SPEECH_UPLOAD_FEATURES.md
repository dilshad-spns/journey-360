# Speech & Upload Features Implementation

## ✅ Features Implemented

### 🎤 Speech Recognition (Narrate User Story)
The speech feature now uses the **Web Speech API** for real-time speech-to-text transcription.

#### How It Works:
1. **Click the microphone button** in the footer to start recording
2. **Speak naturally** - the system will transcribe in real-time
3. **See live preview** of what you're saying (interim results)
4. **Final text** is automatically added to the input area
5. **Click again** to stop recording

#### Features:
- ✅ Real-time transcription using Web Speech API
- ✅ Continuous recording (keeps listening until you stop)
- ✅ Live interim transcript preview
- ✅ Recording timer showing elapsed time
- ✅ Visual pulsing microphone hint when mode is 'speech'
- ✅ Animated recording indicator with red dot
- ✅ Browser compatibility fallback (shows simulation if API not supported)
- ✅ Mode-specific placeholder and tips

#### Visual Indicators:
- **Empty speech mode**: Shows pulsing microphone icon with hint text
- **Recording**: Red badge with timer "Recording 0:15"
- **Live transcript**: Shows what's being said in real-time
- **Microphone button**: Pulses in speech mode, turns red when recording

---

### 📤 File Upload (Upload Requirement Document)
The upload feature now supports **drag-and-drop** and multiple file types.

#### How It Works:
1. **Navigate to Upload mode** from landing page
2. **Drag and drop** files into the drop zone OR click to browse
3. **File is processed** and text is extracted
4. **Extracted text** appears in the input area for review/editing

#### Supported File Types:
- ✅ **Text files** (.txt) - Direct text extraction
- ✅ **PDF files** (.pdf) - Simulated extraction with structured format
- ✅ **Word documents** (.docx, .doc) - Simulated extraction
- ✅ **Images** (all image types) - Upload confirmation with prompt

#### Features:
- ✅ Drag-and-drop zone with hover effects
- ✅ Click to browse file system
- ✅ File processing indicator
- ✅ File badge showing uploaded file name
- ✅ Remove file button (X) to clear and start over
- ✅ Drag state visual feedback (border highlights on drag)
- ✅ Mode-specific tips and examples
- ✅ Support for file input buttons throughout the app

#### Visual Indicators:
- **Empty upload mode**: Shows large drop zone with upload icon
- **Dragging file**: Drop zone highlights with primary color
- **Processing**: Spinner badge "Processing file..."
- **Uploaded**: Green badge with file name and remove button

---

## 🎨 Mode-Specific UI

### Text Mode (Default)
- Standard textarea with rich text editing
- Grammar correction button
- Import options (URL, Jira, GitHub, Code)
- Example: "Create a travel insurance quote..."

### Speech Mode
- **Pulsing microphone button** to draw attention
- **Visual hint** when empty (pulsing mic icon + text)
- **Live transcript preview** during recording
- **Recording timer** badge
- Example: "I need a travel insurance form..."
- Tips focused on speaking clearly

### Upload Mode
- **Drag-and-drop zone** replaces textarea when empty
- **File type indicators** showing supported formats
- **Upload icon** with clear call-to-action
- Example: "Upload user stories from Jira..."
- Tips focused on file types and review process

---

## 🧪 Testing Guide

### Test Speech Recognition:
1. Go to Landing Page
2. Click "Narrate User Story" card
3. Click the pulsing microphone button
4. Speak: "Create a travel insurance form with trip details and payment"
5. Verify text appears in the textarea
6. Click microphone again to stop

### Test File Upload:
1. Go to Landing Page
2. Click "Upload Requirement Document" card
3. **Drag a .txt file** into the drop zone
4. Verify file is processed and text appears
5. Click X to remove file
6. **Click the drop zone** to browse and select file
7. Verify same behavior

### Test File Types:
- `.txt` file → Direct text extraction
- `.pdf` file → Simulated extraction with format note
- `.docx` file → Simulated extraction
- Image file → Upload confirmation message

---

## 🔧 Technical Implementation

### New State Variables:
```typescript
const [isDragging, setIsDragging] = useState(false);
const [isProcessingFile, setIsProcessingFile] = useState(false);
const [transcriptText, setTranscriptText] = useState('');
const recognitionRef = useRef<any>(null);
const dropZoneRef = useRef<HTMLDivElement>(null);
```

### Key Functions:
- `toggleRecording()` - Enhanced with Web Speech API integration
- `handleFileSelect()` - Enhanced with file type detection and parsing
- `handleDragEnter/Leave/Over/Drop()` - New drag-and-drop handlers

### Browser Compatibility:
- Uses `window.SpeechRecognition` or `window.webkitSpeechRecognition`
- Falls back to 3-second simulation if API not available
- Works in Chrome, Edge, Safari (with webkit prefix)
- Firefox: Limited support, uses fallback

---

## 🎯 Design System Compliance

All UI elements use CSS variables from your design system:

### Colors:
- `bg-primary`, `text-primary`, `border-primary`
- `bg-destructive`, `text-destructive` (for recording)
- `bg-success`, `text-success` (for uploaded files)
- `bg-muted`, `text-muted-foreground`

### Radius:
- `--radius-card` for drop zone and cards
- `--radius-button` for badges and buttons
- `--radius-pill` for status badges
- `--radius-input` for inputs

### Typography:
- Uses default Inter font from globals.css
- No hardcoded font sizes, weights, or line-heights
- Relies on base HTML element styles

### Elevation:
- `--elevation-sm`, `--elevation-md` for shadows

---

## 📝 User Flow

### Landing Page → Speech Mode:
```
1. Click "Narrate User Story" card
2. Navigate to /prompt?mode=speech
3. See pulsing microphone hint
4. Click microphone button
5. Start speaking
6. See live transcript
7. Stop recording
8. Edit if needed
9. Click Continue
```

### Landing Page → Upload Mode:
```
1. Click "Upload Requirement Document" card
2. Navigate to /prompt?mode=upload
3. See drag-and-drop zone
4. Drag file or click to browse
5. File processes automatically
6. See extracted text
7. Edit if needed
8. Click Continue
```

---

## 🐛 Known Limitations

1. **PDF/DOCX Parsing**: Currently simulated - real parsing would require additional libraries (pdf.js, mammoth.js)
2. **Speech Recognition**: Only works in browsers that support Web Speech API (Chrome, Edge, Safari)
3. **File Size**: No file size limits implemented (should add for production)
4. **Language**: Speech recognition set to English only (`lang: 'en-US'`)

---

## 🚀 Future Enhancements

- [ ] Real PDF parsing with pdf.js
- [ ] Real DOCX parsing with mammoth.js
- [ ] Multiple language support for speech
- [ ] File size validation
- [ ] Multiple file upload
- [ ] Audio playback of recordings
- [ ] Speech confidence scoring
- [ ] Custom vocabulary training
