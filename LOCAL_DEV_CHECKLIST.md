# 🎯 Local Development Checklist

Follow these steps in order to get Journey 360 running on your machine with full styling.

---

## ☑️ Pre-Installation Checklist

- [ ] I have Node.js 18 or higher installed
  - Check: `node --version`
- [ ] I have npm installed
  - Check: `npm --version`
- [ ] I'm in the project root directory
  - Check: `pwd` (should end with journey-360 or similar)

---

## ☑️ Installation Steps

### Step 1: Install Dependencies
```bash
npm install
```

**Expected outcome:** 
- ✅ No errors in terminal
- ✅ `node_modules` folder created
- ✅ Takes 1-3 minutes to complete

**If you see errors:** Check that you're in the project root directory

---

### Step 2: Verify Setup
```bash
npm run check-setup
```

**Expected outcome:**
```
✅ package.json exists
✅ postcss.config.js exists
✅ next.config.js exists
✅ app/layout.tsx exists
✅ styles/globals.css exists
✅ @tailwindcss/postcss in dependencies
✅ Tailwind imported in globals.css
✅ CSS variables defined
```

**If checks fail:** 
- Re-run `npm install`
- Check that you have the latest files from the repository

---

### Step 3: Clear Next.js Cache (Important!)
```bash
# Mac/Linux
rm -rf .next

# Windows Command Prompt
rmdir /s .next

# Windows PowerShell
Remove-Item -Recurse -Force .next
```

**Expected outcome:**
- ✅ `.next` folder deleted (if it existed)
- ✅ No errors

**Why this matters:** Old build cache can prevent styles from loading

---

### Step 4: Start Development Server
```bash
npm run dev
```

**Expected outcome:**
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000
```

**Keep this terminal window open!**

---

### Step 5: Open in Browser
1. Open your browser
2. Go to: `http://localhost:3000`
3. Wait 5-10 seconds for initial compilation

---

## ☑️ Visual Verification Checklist

Once the page loads, verify these visual elements:

### Landing Page (Page 1)
- [ ] I see the Journey 360 logo (blue circular icon with sparkle)
- [ ] Background is light gray/off-white (not pure white)
- [ ] "Journey 360" heading is visible in large text
- [ ] Three cards are visible: "Paste as Text", "Speech to Text", "Upload Document"
- [ ] Cards have subtle borders and shadows
- [ ] Cards have hover effects when I move my mouse over them
- [ ] Icons (FileText, Mic, Upload) are visible in blue
- [ ] "Recent Prompts" section at bottom with example journeys
- [ ] Dark mode toggle button appears somewhere (usually top right)

### Colors to Verify
- [ ] Primary color is dark blue (#001C56)
- [ ] Cards are white with gray borders
- [ ] Text is dark gray/black (not pure black)
- [ ] "Get Started" buttons are visible and styled

### Typography
- [ ] All text is in Inter font (looks modern and clean)
- [ ] Headings are bold
- [ ] Body text is regular weight
- [ ] Text is readable and well-spaced

---

## ☑️ Functionality Verification

Test these features:

- [ ] Click a card → Takes me to input screen
- [ ] Dark mode toggle works (changes background to dark)
- [ ] Hover effects work on buttons and cards
- [ ] Can type in the input field (if you proceeded to input screen)

---

## ❌ If Styles Are NOT Loading

### Symptom: Unstyled HTML (looks like your screenshot)

**Quick Fix:**
1. Stop dev server (Ctrl+C in terminal)
2. Run these commands:
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```
3. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Symptom: Some styles but not all

**Quick Fix:**
1. Clear browser cache
2. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
3. Check browser console (F12) for errors

### Symptom: Errors in terminal

**Common Errors & Fixes:**

**Error:** "Cannot find module '@tailwindcss/postcss'"
```bash
npm install @tailwindcss/postcss --save-dev
npm run dev
```

**Error:** "Module not found: Can't resolve 'postcss'"
```bash
npm install
npm run dev
```

**Error:** Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
# Then open http://localhost:3001
```

---

## ☑️ Success Indicators

You're ready to develop when:

1. ✅ Dev server running without errors
2. ✅ Browser shows styled application (not plain HTML)
3. ✅ All visual elements from checklist are visible
4. ✅ Interactions work (hover, click)
5. ✅ Dark mode toggle works
6. ✅ No errors in browser console (F12)
7. ✅ No errors in terminal

---

## 🎉 You're Done!

If all checkboxes above are checked, your local environment is ready!

### Next Steps:
1. Explore the application
2. Try creating a journey
3. Make changes to the code and see live updates
4. Customize the design system in `/styles/globals.css`

### Helpful Resources:
- **Detailed Setup:** `README_LOCAL_SETUP.md`
- **Troubleshooting:** `SETUP_INSTRUCTIONS_LOCAL.md`
- **Project Overview:** `PROJECT_OVERVIEW.md`

---

## 🆘 Still Having Issues?

1. Run diagnostics: `npm run check-setup`
2. Check terminal for errors
3. Check browser console (F12) for errors
4. See `README_LOCAL_SETUP.md` for detailed troubleshooting
5. Try the "Nuclear Option":
```bash
rm -rf node_modules
rm -rf .next
npm install
npm run dev
```

---

**Good luck! 🚀**

*Last Updated: November 4, 2025*
