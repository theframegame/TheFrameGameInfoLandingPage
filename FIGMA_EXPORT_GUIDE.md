# Figma Export Guide for The Frame Game

## 🎯 Quick Start

You now have a special **Admin Dashboard Preview** at `/admin/preview` that bypasses authentication for easy export!

---

## 📋 Export Checklist

### **Pages to Export:**

1. ✅ **Landing Page** - `http://localhost:5173/`
2. ✅ **Admin Login** - `http://localhost:5173/admin`
3. ✅ **Admin Dashboard (ALL TABS)** - `http://localhost:5173/admin/preview`
4. ✅ **Content Viewer** - (after signup, each user type)

---

## 🚀 Method 1: Using html.to.design (Recommended)

### Step 1: Run Your App
```bash
npm run dev
```

### Step 2: Export Each Page

#### A. Landing Page
1. Visit: `http://localhost:5173/`
2. Open Figma → Plugins → html.to.design
3. Paste URL → Import
4. Name layer: "Landing Page - Default"

#### B. Admin Dashboard - Content Manager Tab
1. Visit: `http://localhost:5173/admin/preview`
2. It will open with "Content Manager" active by default
3. Open Figma → Plugins → html.to.design
4. Paste URL → Import
5. Name layer: "Admin - Content Manager"

#### C. Admin Dashboard - All Other Tabs
For each tab, you need to capture separately:

**Option A: Screenshot Method** (Recommended for tabs)
1. Visit `/admin/preview`
2. Click each tab (Preview, Subscribers, Email Templates, etc.)
3. Take full-page screenshot (Chrome: Cmd+Shift+P → "Capture full size screenshot")
4. Import to Figma
5. Recreate or trace over screenshot

**Option B: Browser Console Trick**
1. Visit `/admin/preview`
2. Open DevTools Console
3. Run this to click each tab programmatically:
```javascript
// Click Subscribers tab
document.querySelectorAll('button')[2].click();
```
4. Screenshot each state
5. Import to Figma

#### D. User Type Views (After Signup)
1. Fill out signup form with test email
2. Select each user type (Filmmaker, Parent, Educator, etc.)
3. For each: Screenshot the content viewer
4. Import to Figma

---

## 🎨 Method 2: Manual Recreation (Most Control)

### Advantages:
- ✅ Cleanest Figma-native result
- ✅ Full control over components
- ✅ Easy to maintain
- ✅ No authentication issues

### Time Estimate:
- Landing Page: 45 minutes
- Admin Dashboard: 2 hours
- Content Manager: 1.5 hours
- **Total: ~4 hours**

### Process:

#### 1. Extract Design Tokens
Open DevTools on your live site and copy these values:

**Colors:**
```
Gradients:
- Main: from-blue-600 via-purple-500 to-pink-400
- Button: from-purple-600 to-pink-600

Text Colors:
- Headings: Use gradient text-transparent
- Body: gray-600, gray-700, gray-800
- White text on colored backgrounds
```

**Fonts:**
```
- Primary: Fredoka (Bold headings)
- Secondary: Comic Neue (Body text, labels)
- Mono: System mono (Timeline, code)
```

**Spacing:**
```
- Base: 4px
- Padding: p-4 (16px), p-6 (24px), p-8 (32px)
- Gaps: gap-2 (8px), gap-3 (12px), gap-4 (16px)
- Border radius: rounded-2xl (16px), rounded-3xl (24px)
```

#### 2. Create Component Library in Figma

**Base Components:**
- Button (Primary gradient)
- Button (Secondary gray)
- Input field
- Card container (white, rounded-3xl, shadow-2xl)
- Tab button (active/inactive states)
- Section card (colored gradients)

**Admin Components:**
- Section row (drag handle, title, controls)
- Preview card (for user type preview)
- Modal overlay
- Font picker dropdown
- Color picker
- Email template editor layout

#### 3. Build Pages from Components
- Use Auto Layout for everything
- Set proper constraints (left+right, top+bottom)
- Create variants for interactive states

---

## 📸 Method 3: Hybrid Approach (Fast + Quality)

Best of both worlds:

1. **Use html.to.design for basic layouts**
   - Landing page structure
   - Admin header/navigation
   - Card layouts

2. **Manually recreate interactive elements**
   - Buttons with hover states
   - Modals and popups
   - Drag & drop sections
   - Form inputs with focus states

3. **Screenshot reference for complex parts**
   - Content Manager with multiple sections
   - Preview panel with embedded content
   - Timeline filmstrip

---

## 🎯 Content Manager Export Tips

The Content Manager is the most complex. Here's how to capture all states:

### States to Capture:

1. **Empty State** (no sections)
2. **With Sections** (2-3 sections added)
3. **Section Expanded** (showing edit panel)
4. **Add Section Modal** (open)
5. **Preview Mode** (showing different user types)

### How to Capture Each State:

#### State 1: Empty
- Delete all sections in the preview
- Screenshot

#### State 2: With Sections
- Add 2-3 different section types
- Screenshot the list view

#### State 3: Edit Panel Open
- Click "Edit" on a section
- Screenshot the expanded edit panel

#### State 4: Add Section Modal
- Click "Add Section" button
- Screenshot the modal overlay

#### State 5: Preview Mode
- Switch to Preview tab
- Select each user type from dropdown
- Screenshot each user type's view

---

## 🛠️ Troubleshooting

### Problem: html.to.design can't access localhost
**Solution:**
```bash
# Deploy to free hosting temporarily
npm run build
npx serve dist -l 3000

# Or use ngrok to expose localhost
npx ngrok http 5173
# Use the ngrok URL in html.to.design
```

### Problem: Fonts not loading in Figma
**Solution:**
1. Download fonts locally:
   - Fredoka: https://fonts.google.com/specimen/Fredoka
   - Comic Neue: https://fonts.google.com/specimen/Comic+Neue
2. Install on your system
3. Apply manually in Figma

### Problem: Gradients import as flat colors
**Solution:**
- Manually recreate gradients in Figma
- Reference: Use eyedropper on live site to get exact colors

### Problem: Animations don't transfer
**Solution:**
- Animations won't export - that's normal
- Document hover states separately
- Use Figma's interactive components for prototypes

---

## ✅ Post-Export Cleanup

After importing to Figma:

1. **Rename Layers**
   - "div" → "Card"
   - "button" → "Primary Button"
   - Group related elements

2. **Convert to Components**
   - Buttons → Component
   - Cards → Component
   - Sections → Component

3. **Add Auto Layout**
   - Select frames → Add Auto Layout (Shift+A)
   - Set proper spacing and padding

4. **Create Variants**
   - Button: Default, Hover, Pressed
   - Tab: Active, Inactive
   - Section Card: Collapsed, Expanded

5. **Organize Pages**
   ```
   🏠 Landing Page
   🔐 Admin Login
   📊 Admin Dashboard
      ↳ Content Manager
      ↳ Preview
      ↳ Subscribers
      ↳ Email Templates
      ↳ Timelines
      ↳ Landing Page Editor
      ↳ Fonts
      ↳ Settings
   🎬 Content Viewer (User Types)
      ↳ Filmmaker View
      ↳ Parent View
      ↳ Educator View
      ↳ Teen View
      ↳ Investor View
      ↳ Donor View
      ↳ Just Curious View
   ```

---

## 🎨 Design System Export

Create a separate Figma page called "Design System":

### Colors
- Create color styles for all main colors
- Name them: Primary/Purple, Primary/Pink, Neutral/Gray-600, etc.

### Typography
- Create text styles:
  - H1 (Fredoka, 40px, Bold)
  - H2 (Fredoka, 32px, Bold)
  - H3 (Fredoka, 24px, Bold)
  - Body (Comic Neue, 16px, Regular)
  - Small (Comic Neue, 14px, Regular)
  - Tiny (Comic Neue, 12px, Regular)

### Components
- Button/Primary
- Button/Secondary
- Card/White
- Card/Gradient
- Input/Text
- Input/Email
- Section/Collapsed
- Section/Expanded

---

## 🚨 Important: Remove Preview Page Before Production

The `/admin/preview` route bypasses authentication!

**Before deploying to production:**
```bash
# Delete this file:
rm /src/app/pages/admin-dashboard-preview.tsx

# Remove from routes:
# Edit /src/app/routes.tsx and remove the preview route
```

Or add password protection:
```typescript
// In admin-dashboard-preview.tsx
const [password, setPassword] = useState('');
if (password !== 'design-export-2026') {
  return <PasswordPrompt />;
}
```

---

## 📞 Next Steps

1. ✅ Visit `/admin/preview` to see auth-free dashboard
2. 📸 Export each tab/state to Figma
3. 🎨 Organize and clean up in Figma
4. 🔄 Iterate on design
5. 🚀 Export clean HTML back to production

Need help? Check these resources:
- html.to.design docs: https://html.to.design
- Figma Auto Layout: https://help.figma.com/hc/en-us/articles/360040451373
- Design tokens: Check your `/src/styles/theme.css`

---

## 🎯 Quick Command Reference

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Serve built files
npx serve dist

# Expose localhost (if needed)
npx ngrok http 5173
```

Happy exporting! 🎨✨
