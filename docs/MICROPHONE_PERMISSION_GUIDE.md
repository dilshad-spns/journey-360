# 🎤 Microphone Permission Troubleshooting Guide

## ❌ Error: "NotAllowedError: Permission denied"

This error means your browser is blocking microphone access. Here's how to fix it:

---

## 🔧 Quick Fixes (Try in Order)

### 1. **Allow Permission When Prompted**
When you click the microphone button, your browser should show a permission popup:
- ✅ Click **"Allow"** or **"Yes"**
- ❌ Don't click "Block" or "Deny"

### 2. **Check Browser Address Bar**
Look for a 🔒 lock icon or 🎤 microphone icon in the address bar:

**Chrome/Edge:**
1. Click the 🔒 or 🎤 icon in the address bar (left of URL)
2. Find "Microphone" in the list
3. Change from "Block" to "Allow"
4. Refresh the page (Cmd+R or Ctrl+R)

**Safari:**
1. Go to **Safari** menu → **Settings for This Website**
2. Find "Microphone" dropdown
3. Select **"Allow"**
4. Refresh the page

**Firefox:**
1. Click the 🔒 icon in the address bar
2. Click **"Connection Secure"** → **"More Information"**
3. Go to **"Permissions"** tab
4. Find "Use the Microphone"
5. Uncheck "Use Default" and check **"Allow"**
6. Refresh the page

### 3. **Check System Permissions**

**macOS:**
1. Open **System Settings** → **Privacy & Security**
2. Click **Microphone**
3. Make sure your browser (Chrome/Safari/Firefox) is checked ✓
4. Restart your browser

**Windows:**
1. Open **Settings** → **Privacy & Security** → **Microphone**
2. Make sure "Microphone access" is **On**
3. Make sure your browser is allowed
4. Restart your browser

### 4. **Ensure HTTPS Connection**
Microphone access requires a secure connection:

- ✅ URL starts with `https://` (secure)
- ✅ URL is `localhost` or `127.0.0.1` (development)
- ❌ URL starts with `http://` (not secure)

**If using HTTP:**
- Contact your site administrator to enable HTTPS
- For development: Use `localhost` instead of your computer's IP address

### 5. **Check Microphone Hardware**
- Ensure your microphone is connected
- Test it works in other apps (Zoom, Teams, etc.)
- Check it's not muted (hardware button or system settings)
- Make sure no other app is using it exclusively

---

## 🌐 Browser-Specific Issues

### Chrome
**Clear Site Settings:**
1. Click 🔒 icon in address bar
2. Click "Site settings"
3. Find "Microphone" → Select "Allow"
4. Scroll down → Click "Clear data"
5. Refresh page and try again

**Reset All Permissions:**
1. Go to `chrome://settings/content/microphone`
2. Remove the site from "Block" list if present
3. Refresh the page

### Safari
**Reset Website Preferences:**
1. Safari menu → Settings → Websites
2. Find "Microphone" in left sidebar
3. Find your site and set to "Allow"

**If Still Not Working:**
1. Safari menu → Settings → Privacy
2. Click "Manage Website Data"
3. Search for your site and remove it
4. Refresh the page

### Firefox
**Temporary Permission Blocks:**
Firefox sometimes temporarily blocks permissions. Try:
1. Close ALL Firefox windows
2. Reopen Firefox
3. Navigate to the site again
4. Try microphone again

---

## 🚨 Common Issues & Solutions

### Issue: "Permission was denied and now it won't ask again"
**Solution:**
1. Click the 🔒 icon in address bar
2. Look for blocked permissions
3. Change microphone to "Allow"
4. Refresh the page

### Issue: "No microphone found"
**Solution:**
1. Check microphone is plugged in
2. In Windows: Check Device Manager → Audio inputs
3. In macOS: Check System Settings → Sound → Input
4. Make sure it's set as default input device
5. Refresh the browser

### Issue: "Permission prompt doesn't appear"
**Solution:**
- Permission was already denied previously
- Follow browser-specific instructions above to reset
- Check the address bar for blocked permission icon

### Issue: "Microphone works in other apps but not here"
**Solution:**
1. Close other apps using the microphone
2. Check browser-specific microphone settings
3. Check system permissions for the browser
4. Try incognito/private mode (permission will be asked fresh)

### Issue: "Using company computer / managed device"
**Solution:**
- IT policies might block microphone access
- Contact your IT administrator
- Use your personal device as alternative
- Use text input mode instead

---

## ✅ Verify It's Working

1. Go to: https://www.onlinemictest.com/
2. Click "Play Test Sound"
3. Speak into your microphone
4. You should see the levels moving

If this works, the issue is with browser permissions for our site.

---

## 🔄 Step-by-Step Reset (Last Resort)

If nothing else works, completely reset browser permissions:

### Chrome/Edge:
```
1. Type in address bar: chrome://settings/content/microphone
2. Find your site in "Block" list
3. Click ⋮ (three dots) → Remove
4. Close all browser windows
5. Reopen browser
6. Visit site again
7. Accept permission when prompted
```

### Safari:
```
1. Safari → Settings → Websites → Microphone
2. Remove your site or set to "Ask"
3. Safari → Settings → Privacy → Manage Website Data
4. Remove your site's data
5. Quit Safari completely (Cmd+Q)
6. Reopen Safari
7. Visit site again
```

### Firefox:
```
1. Type in address bar: about:preferences#privacy
2. Scroll to "Permissions" → Microphone → Settings
3. Remove your site from list
4. Close Firefox completely
5. Reopen Firefox
6. Visit site again
7. Accept permission when prompted
```

---

## 🎯 Testing Checklist

Before reporting as a bug, verify:

- [ ] Microphone works in other applications
- [ ] Browser has system-level microphone permission
- [ ] Site is accessed via HTTPS or localhost
- [ ] No blocking extensions (Privacy Badger, uBlock Origin, etc.)
- [ ] Not in incognito/private mode (some browsers block by default)
- [ ] Browser is up to date
- [ ] Tried in a different browser
- [ ] Checked browser console for errors (F12 → Console tab)

---

## 💡 Alternative: Use Text Input Instead

If you can't get the microphone working:
1. Click the **Back** button
2. Choose **"Paste User Story"** instead
3. Type your requirements manually
4. You'll get the same great results!

---

## 📞 Still Having Issues?

If you've tried everything above and it still doesn't work:

1. **Share your setup:**
   - Operating System (Windows/Mac/Linux)
   - Browser name and version
   - Whether you're on HTTP or HTTPS
   - Any error messages in browser console (F12)

2. **Workaround:**
   - Use the "Paste User Story" mode instead
   - Try a different browser (Chrome recommended)
   - Try on a different device

3. **Check our updated docs:**
   - See `/SPEECH_PERMISSION_FIX.md` for technical details
   - See `/SPEECH_UPLOAD_FEATURES.md` for feature overview

---

## 🎓 Understanding the Error

**Why does this happen?**
- Browsers require explicit user permission for security
- Microphone access requires HTTPS (except localhost)
- Previous denials are remembered by browser
- System settings can block browser access
- Company IT policies may restrict access

**Why it's important:**
- Protects your privacy
- Prevents malicious websites from listening
- Gives you control over when sites can record

**The good news:**
- Once allowed, permission is remembered
- You can revoke it anytime from browser settings
- No audio is stored - only text transcription is kept

---

## ⚡ Quick Reference Card

| Problem | Quick Fix |
|---------|-----------|
| Permission denied | Click 🔒 in address bar → Microphone → Allow |
| No prompt appears | Permission already denied - reset in browser settings |
| Using HTTP | Switch to HTTPS or use localhost |
| No microphone found | Check hardware connection and system permissions |
| Works elsewhere | Check browser-specific permissions for this site |
| Company laptop | Contact IT or use text input instead |

---

## 🔐 Privacy & Security Notes

- ✅ Audio is processed locally by your browser
- ✅ Only text transcription is sent to the app
- ✅ No audio recordings are stored
- ✅ You can revoke permission anytime
- ✅ Secure (HTTPS) connection required
- ✅ Browser notifies you when microphone is active

---

**Remember:** You can always use the "Paste User Story" mode if speech input doesn't work for you!
