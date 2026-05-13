# 📸 Screenshot Export Guide (Recommended Method)

## Why Screenshots Instead of Plugin?

The html.to.design plugin can have iframe loading issues with complex apps. **Screenshots are:**
- ✅ More reliable
- ✅ Faster
- ✅ Capture exact pixel-perfect state
- ✅ No CORS or security issues

---

## 🚀 **Step-by-Step Screenshot Method**

### **Preparation**

1. **Restart your dev server** with the new CORS settings:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

2. **Open your browser** (Chrome or Firefox recommended)

3. **Install a screenshot extension** (optional but helpful):
   - Chrome: "Full Page Screen Capture" or "GoFullPage"
   - Firefox: Built-in (Ctrl+Shift+S → "Save full page")

---

## 📋 **Pages to Capture**

### **1. Landing Page**

```
URL: http://localhost:5173/

Steps:
1. Open the URL
2. Make sure page is fully loaded
3. Scroll to top
4. SCREENSHOT METHOD A (Chrome):
   - Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Win)
   - Type: "Capture full size screenshot"
   - Press Enter
   - Screenshot saves to Downloads

5. SCREENSHOT METHOD B (Extension):
   - Click extension icon
   - Click "Capture entire page"
   - Download the image

6. In Figma:
   - Drag screenshot from Downloads folder
   - Drop onto canvas
   - Rename layer: "Landing Page"
```

---

### **2. Admin Login**

```
URL: http://localhost:5173/admin

Steps:
1. Open the URL
2. Take full page screenshot
3. Drag into Figma
4. Rename: "Admin Login"
```

---

### **3. Admin Dashboard - Content Manager (Default View)**

```
URL: http://localhost:5173/admin/preview

Steps:
1. Open the URL
2. Content Manager tab should be selected by default
3. Make sure you have 3-4 sections added
4. Take screenshot
5. Drag into Figma
6. Rename: "Admin Dashboard - Content Manager"
```

---

### **4. Content Manager - Edit Panel Open**

```
URL: http://localhost:5173/admin/preview

Steps:
1. Stay on Content Manager tab
2. Click "Edit" button on one section
3. Wait for edit panel to expand
4. Take screenshot
5. Drag into Figma
6. Rename: "Content Manager - Editing"
```

---

### **5. Content Manager - Add Modal**

```
URL: http://localhost:5173/admin/preview

Steps:
1. Stay on Content Manager tab
2. Click "Add Section" button
3. Wait for modal to appear
4. Take screenshot
5. Drag into Figma
6. Rename: "Content Manager - Add Modal"
```

---

### **6. Admin Dashboard - Preview Tab**

```
URL: http://localhost:5173/admin/preview

Steps:
1. Click "Preview" tab
2. Select a user type from dropdown
3. Take screenshot
4. Drag into Figma
5. Rename: "Admin - Preview Tab"
```

---

### **7. Admin Dashboard - Subscribers Tab**

```
URL: http://localhost:5173/admin/preview

Steps:
1. Click "Subscribers" tab
2. Make sure you have some test subscribers
3. Take screenshot
4. Drag into Figma
5. Rename: "Admin - Subscribers"
```

---

### **8. Admin Dashboard - Email Templates Tab**

```
URL: http://localhost:5173/admin/preview

Steps:
1. Click "Email Templates" tab
2. Take screenshot
3. Drag into Figma
4. Rename: "Admin - Email Templates"
```

---

### **9. Admin Dashboard - Timelines Tab**

```
URL: http://localhost:5173/admin/preview

Steps:
1. Click "Timelines" tab
2. Make sure you have at least one timeline created
3. Take screenshot
4. Drag into Figma
5. Rename: "Admin - Timelines"
```

---

### **10. Admin Dashboard - Landing Page Editor Tab**

```
URL: http://localhost:5173/admin/preview

Steps:
1. Click "Landing Page Editor" tab
2. Take screenshot
3. Drag into Figma
4. Rename: "Admin - Landing Page Editor"
```

---

### **11. Admin Dashboard - Fonts Tab**

```
URL: http://localhost:5173/admin/preview

Steps:
1. Click "Fonts" tab
2. Take screenshot
3. Drag into Figma
4. Rename: "Admin - Fonts"
```

---

### **12. Admin Dashboard - Settings Tab**

```
URL: http://localhost:5173/admin/preview

Steps:
1. Click "Settings" tab
2. Take screenshot
3. Drag into Figma
4. Rename: "Admin - Settings"
```

---

### **13-19. Content Viewer for Each User Type**

For each of the 7 user types, capture their view:

```
Steps for EACH type:
1. Go to: http://localhost:5173/
2. Fill out signup form:
   - Name: Test User
   - Email: test@example.com
3. Select user type:
   - Filmmaker
   - Parent
   - Educator
   - Teen
   - Investor
   - Donor
   - Just Curious
4. Click submit
5. Take screenshot of content viewer
6. Drag into Figma
7. Rename: "Content Viewer - [User Type]"
8. Go back (browser back button)
9. Repeat for next user type
```

**Result: 7 screenshots total** (one for each user type)

---

## 📐 **Organize in Figma**

### **Create Page Structure:**

```
📄 01 - Landing
   └─ Landing Page screenshot

📄 02 - Admin Login
   └─ Admin Login screenshot

📄 03 - Admin Dashboard
   └─ Content Manager (default)
   └─ Content Manager (editing)
   └─ Content Manager (add modal)
   └─ Preview tab
   └─ Subscribers tab
   └─ Email Templates tab
   └─ Timelines tab
   └─ Landing Page Editor tab
   └─ Fonts tab
   └─ Settings tab

📄 04 - Content Viewers
   └─ Filmmaker view
   └─ Parent view
   └─ Educator view
   └─ Teen view
   └─ Investor view
   └─ Donor view
   └─ Just Curious view

📄 05 - Design System
   (Extract components from screenshots)
```

---

## 🎨 **Extract Components from Screenshots**

Once you have all screenshots in Figma:

### **1. Create Component Frames**

1. Create a new page: "Design System"
2. Use **Rectangle** tool (R) to draw frames
3. Copy/paste elements from screenshots
4. Or use screenshots as reference to rebuild

### **2. Extract Button Styles**

From screenshots, identify:
- Primary button (purple-to-pink gradient)
- Secondary button (gray)
- Add button (green)
- Delete button (red)
- Send button (blue)

**Rebuild in Figma:**
1. Rectangle tool → Draw button shape
2. Fill → Add gradient
3. Text → Add label
4. Create component (Cmd+Option+K)
5. Create variants (Default, Hover, Pressed)

### **3. Extract Card Styles**

From screenshots, identify:
- White cards (rounded-3xl, shadow-2xl)
- Gradient section cards
- Stat cards

**Rebuild in Figma:**
1. Rectangle → rounded corners (24px)
2. Add drop shadow
3. Create component

### **4. Extract Form Elements**

From screenshots, identify:
- Text inputs
- Dropdowns
- Textareas
- Checkboxes

**Rebuild in Figma:**
1. Copy visual style
2. Create components
3. Add variants (Default, Focused, Error)

---

## ✅ **Quick Checklist**

Before you start:
- [ ] Dev server running (`npm run dev`)
- [ ] Can access site at http://localhost:5173/
- [ ] Know how to take screenshots in your browser
- [ ] Figma file open and ready

Capture these:
- [ ] Landing Page
- [ ] Admin Login
- [ ] Admin Dashboard - Content Manager (3 states)
- [ ] Admin Dashboard - 7 tabs
- [ ] Content Viewer - 7 user types

Total: **19 screenshots**

---

## 🎯 **Pro Tips**

### **For Consistent Screenshots:**

1. **Use the same browser window size**
   - Set browser to specific width (e.g., 1440px)
   - Keep same zoom level (100%)

2. **Clear cache between captures**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Win)

3. **Wait for animations to complete**
   - Let page fully load
   - Wait for images to load
   - Wait for fonts to load

4. **Capture modals properly**
   - Make sure modal is centered
   - Include overlay/backdrop
   - Capture full page, not just visible area

### **In Figma:**

1. **Set uniform frame size**
   - Select all screenshots
   - Right-click → "Frame selection"
   - Resize to standard size (1440x900 or 1920x1080)

2. **Use Auto Layout for organization**
   - Shift+A to add Auto Layout
   - Set gap: 40px between frames
   - Align to top

3. **Create annotations**
   - Add text labels
   - Note interactive elements
   - Mark hover/active states

---

## 🔄 **After Editing in Figma**

Once you've made design changes:

### **Method 1: Annotate Changes**

1. **Create a "Changes" page** in Figma
2. **List all modifications:**
   ```
   ✓ Hero title: 40px → 48px (text-4xl → text-5xl)
   ✓ Button padding: 16px → 20px (px-6 py-3 → px-8 py-5)
   ✓ Card shadow: stronger (shadow-xl → shadow-2xl)
   ```
3. **Use inspect panel** for exact values
4. **Update code** based on your list

### **Method 2: Side-by-Side Comparison**

1. **Export updated designs** from Figma
2. **Place old and new side by side**
3. **Identify differences visually**
4. **Update Tailwind classes** accordingly

---

## 🚀 **No Plugin Required!**

This screenshot method:
- ✅ Works every time
- ✅ No iframe errors
- ✅ Captures exact visual state
- ✅ Easier to annotate
- ✅ Better for presentations

**The html.to.design plugin is great for simple sites, but for complex apps with authentication, routing, and backend integration, screenshots are more reliable!**

---

## 📞 **Quick Commands**

```bash
# Start dev server
npm run dev

# If port is busy
npm run dev -- --port 5174

# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

---

## ✨ **You're Ready!**

With screenshots, you can:
1. ✅ Capture every state of your app
2. ✅ Edit freely in Figma Design
3. ✅ Reference exact visuals
4. ✅ Convert back to code using inspect panel
5. ✅ No iframe or CORS issues

Happy designing! 🎨✨
