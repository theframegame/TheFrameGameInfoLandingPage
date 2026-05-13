# Complete Guide: Figma Make → Figma Design → Back to Code

## 🎯 Overview

This guide covers:
1. **Exporting** your Figma Make app to Figma Design
2. **Editing** in Figma Design
3. **Exporting** back to code with html.to.design
4. **Reinstating** admin login and all backend functionality

---

## Part 1: Export from Figma Make to Figma Design

### Step 1: Run Your App Locally

```bash
npm run dev
```

Your app should now be running at `http://localhost:5173/`

### Step 2: Open Figma Desktop

1. Open Figma Desktop app (download from figma.com if needed)
2. Create a new Design file
3. Name it: **"The Frame Game - Full App"**

### Step 3: Install html.to.design Plugin

1. In Figma, go to **Plugins** → **Find more plugins**
2. Search for **"html.to.design"**
3. Click **"Install"**
4. Close the plugin browser

---

## Part 2: Capture Every Page/State

### 📋 Pages to Export Checklist

Export each of these as separate pages in Figma:

#### ✅ Page 1: Landing Page
```
URL: http://localhost:5173/
Steps:
1. Load the URL in your browser
2. In Figma: Plugins → html.to.design
3. Enter URL: http://localhost:5173/
4. Click "Import"
5. Wait for import to complete
6. Rename layer: "Landing Page"
```

#### ✅ Page 2: Admin Login
```
URL: http://localhost:5173/admin
Steps:
1. Load the URL
2. In Figma: Plugins → html.to.design
3. Enter URL: http://localhost:5173/admin
4. Click "Import"
5. Rename layer: "Admin Login"
```

#### ✅ Page 3: Admin Dashboard - Content Manager
```
URL: http://localhost:5173/admin/preview
Steps:
1. Load the URL (opens to Content Manager by default)
2. Make sure Content Manager tab is selected
3. In Figma: Plugins → html.to.design
4. Enter URL: http://localhost:5173/admin/preview
5. Click "Import"
6. Rename layer: "Admin - Content Manager"

IMPORTANT: Capture multiple states of Content Manager
```

**Content Manager States to Capture Separately:**

**State A: With Sections List**
- Have 3-4 sections added
- All sections collapsed
- Screenshot this state

**State B: Section Editing Panel Open**
- Click "Edit" on one section
- Screenshot the expanded edit panel

**State C: Add Section Modal**
- Click "Add Section" button
- Screenshot the modal overlay

**How to capture states:**
- Use browser screenshot: Chrome → Cmd+Shift+P → "Capture full size screenshot"
- Drag screenshots into Figma
- Place on separate frames
- Label each frame

#### ✅ Page 4: Admin Dashboard - All Other Tabs

For each tab, you need to manually click and screenshot:

```
Tabs to capture:
1. Preview Tab
2. Subscribers Tab
3. Email Templates Tab
4. Timelines Tab
5. Landing Page Editor Tab
6. Fonts Tab
7. Settings Tab

Method 1: Screenshot Each Tab
1. Visit http://localhost:5173/admin/preview
2. Click each tab
3. For each: Cmd+Shift+P → "Capture full size screenshot"
4. Import all screenshots to Figma
5. Arrange on separate frames

Method 2: Use html.to.design with Browser Console
1. Visit http://localhost:5173/admin/preview
2. Open DevTools Console (Cmd+Option+J)
3. Click each tab, then run in console:
   document.querySelector('[data-tab="preview"]').click();
4. Use html.to.design to import
5. Repeat for each tab
```

#### ✅ Page 5: Content Viewer (User Type Views)

After a user signs up, they see content based on their type.

```
Steps to capture each user type view:
1. Go to http://localhost:5173/
2. Fill out signup form with test email
3. Select user type: Filmmaker
4. Submit form
5. Screenshot the content viewer
6. Go back, repeat for each user type:
   - Filmmaker
   - Parent
   - Educator
   - Teen
   - Investor
   - Donor
   - Just Curious

Import all 7 screenshots to Figma
Label each: "Content Viewer - [User Type]"
```

---

## Part 3: Organize in Figma

### Create Page Structure

In Figma, organize into pages:

```
📄 01 - Landing Page
   └─ Landing Page frame

📄 02 - Admin Login
   └─ Admin Login frame

📄 03 - Admin Dashboard
   └─ Navigation/Header
   └─ Content Manager (Default)
   └─ Content Manager (Editing)
   └─ Content Manager (Add Modal)
   └─ Preview Tab
   └─ Subscribers Tab
   └─ Email Templates Tab
   └─ Timelines Tab
   └─ Landing Page Editor Tab
   └─ Fonts Tab
   └─ Settings Tab

📄 04 - Content Viewer
   └─ Filmmaker View
   └─ Parent View
   └─ Educator View
   └─ Teen View
   └─ Investor View
   └─ Donor View
   └─ Just Curious View

📄 05 - Components (Design System)
   └─ Buttons
   └─ Cards
   └─ Forms
   └─ Modals
   └─ Icons
```

### Create Design System Components

Extract reusable components:

1. **Buttons**
   - Primary Gradient (purple-to-pink)
   - Secondary Gray
   - Green Add Button
   - Red Delete Button
   - Blue Send Button
   - Create variants: Default, Hover, Pressed, Disabled

2. **Cards**
   - White card (rounded-3xl, shadow-2xl)
   - Gradient cards (for sections)
   - Stat cards (colored gradients)

3. **Form Elements**
   - Text input
   - Email input
   - Dropdown/Select
   - Textarea

4. **Modal Overlay**
   - Background overlay (black 50% opacity)
   - Modal container (white, rounded-3xl)

5. **Section Card**
   - Drag handle
   - Title
   - Icon
   - Edit/Delete buttons
   - Collapsed/Expanded states

6. **Tab Button**
   - Active state (gradient)
   - Inactive state (gray)

### Set Up Auto Layout

For each frame:
1. Select the frame
2. Press **Shift+A** to add Auto Layout
3. Set proper spacing (8px, 16px, 24px)
4. Set proper padding
5. Set constraints (Left+Right, Top+Bottom)

---

## Part 4: Design Work in Figma

Now you can edit your design:

### Colors
- Use existing gradient styles
- Create color styles in Figma:
  - Purple-600: #9333EA
  - Pink-600: #DB2777
  - Blue-600: #2563EB
  - Green-500: #22C55E
  - Red-500: #EF4444
  - Gray shades

### Typography
Install fonts on your system:
1. **Fredoka** - https://fonts.google.com/specimen/Fredoka
2. **Comic Neue** - https://fonts.google.com/specimen/Comic+Neue

Create text styles:
- H1: Fredoka Bold, 40px
- H2: Fredoka Bold, 32px
- H3: Fredoka Bold, 24px
- Body: Comic Neue Regular, 16px
- Small: Comic Neue Regular, 14px

### Make Edits
- Adjust colors
- Change layouts
- Update text
- Modify spacing
- Add new sections
- Change visual hierarchy

---

## Part 5: Export Back to Code

### Method 1: Using html.to.design in Reverse (RECOMMENDED)

**Coming Soon Feature**: html.to.design doesn't currently export Figma → Code. Instead, use Method 2.

### Method 2: Manual Recreation (Most Reliable)

This is where you preserve ALL functionality:

#### Step A: Identify What Changed

1. Open your Figma design
2. Make a list of all visual changes:
   - Colors changed
   - Spacing changed
   - Font sizes changed
   - Layout modifications
   - New components added
   - Components removed

Example change list:
```
✓ Landing Page hero title: Changed from 40px to 48px
✓ Button padding: Changed from 16px to 20px
✓ Card shadows: Made stronger
✓ Section colors: Changed purple gradient to blue
✓ Admin header: Added new logo
```

#### Step B: Apply Changes to Code

For each change, update the corresponding component:

**Example 1: Change Button Padding**

Your Figma shows: `padding: 20px 32px`

Find the button component in code:
```tsx
// File: /src/app/components/admin/subscribers-table.tsx
// Find:
className="px-6 py-3 ..."

// Change to:
className="px-8 py-5 ..."
```

**Example 2: Change Heading Size**

Your Figma shows: `font-size: 48px` (was 40px)

Find the heading:
```tsx
// File: /src/app/pages/landing-page.tsx
// Find:
className="text-4xl ..."

// Change to:
className="text-5xl ..."
```

**Example 3: Change Color Gradient**

Your Figma shows: Blue to cyan gradient

```tsx
// Find:
className="bg-gradient-to-r from-purple-600 to-pink-600"

// Change to:
className="bg-gradient-to-r from-blue-600 to-cyan-500"
```

#### Step C: Use Figma Inspect Panel

1. In Figma, select any element
2. Click **Inspect** tab (right panel)
3. Copy the CSS values
4. Convert to Tailwind classes

**CSS → Tailwind Conversion Guide:**

```
Padding/Margin:
padding: 16px        → p-4
padding: 24px        → p-6
padding: 32px        → p-8
margin: 16px         → m-4

Gap:
gap: 8px             → gap-2
gap: 16px            → gap-4
gap: 24px            → gap-6

Border Radius:
border-radius: 16px  → rounded-2xl
border-radius: 24px  → rounded-3xl
border-radius: 12px  → rounded-xl

Font Size:
font-size: 12px      → text-xs
font-size: 14px      → text-sm
font-size: 16px      → text-base
font-size: 24px      → text-2xl
font-size: 32px      → text-3xl
font-size: 40px      → text-4xl
font-size: 48px      → text-5xl

Colors:
background: #9333EA  → bg-purple-600
color: #DB2777       → text-pink-600
```

---

## Part 6: Reintegrate Backend Functionality

### 🚨 CRITICAL: Remove Preview Route

The `/admin/preview` route was only for Figma export. Now remove it:

#### Step 1: Delete Preview File

```bash
rm /src/app/pages/admin-dashboard-preview.tsx
```

Or in Figma Make, use the delete_tool.

#### Step 2: Remove from Routes

Edit `/src/app/routes.tsx`:

**Find:**
```tsx
import { AdminDashboardPreview } from "./pages/admin-dashboard-preview";

export const router = createBrowserRouter([
  // ...
  {
    path: "/admin/preview",
    Component: AdminDashboardPreview,
  },
]);
```

**Change to:**
```tsx
// Remove the import line
// Remove the preview route

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
]);
```

### Step 3: Verify Admin Authentication

Test the admin login flow:

1. Visit `http://localhost:5173/admin`
2. Enter password: `frameGameAdmin2026` (or custom password)
3. Should redirect to `/admin/dashboard`
4. All tabs should work
5. Logout should clear token

### Step 4: Test All Admin Features

**Checklist:**

✅ **Content Manager**
- [ ] Can add sections
- [ ] Can edit sections
- [ ] Can delete sections
- [ ] Can reorder sections (drag & drop)
- [ ] Can upload images
- [ ] Can choose section types
- [ ] Visibility toggles work

✅ **Subscribers**
- [ ] Can view all subscribers
- [ ] Can add subscriber manually
- [ ] Can delete subscriber
- [ ] Can send email
- [ ] Can export CSV
- [ ] Filters work
- [ ] Stats update

✅ **Email Templates**
- [ ] Can view templates
- [ ] Can edit subject/body
- [ ] Can save changes
- [ ] Variables work ({name}, {email})

✅ **Timelines**
- [ ] Can create timeline
- [ ] Can edit timeline
- [ ] Can add slides to timeline
- [ ] Can reorder slides
- [ ] Can delete timeline

✅ **Landing Page Editor**
- [ ] Can edit hero title
- [ ] Can edit subtitle
- [ ] Can change background
- [ ] Can edit CTA button
- [ ] Changes reflect on landing page

✅ **Fonts**
- [ ] Can upload custom fonts
- [ ] Can see uploaded fonts
- [ ] Fonts appear in pickers
- [ ] Can delete fonts

✅ **Settings**
- [ ] Can change admin password
- [ ] Can update site settings
- [ ] Can save changes

✅ **Preview**
- [ ] Can select user type
- [ ] Content changes per user type
- [ ] All 7 user types work

---

## Part 7: Deployment Checklist

Before deploying to production:

### Security Audit

✅ **Remove Development Routes**
- [ ] `/admin/preview` deleted
- [ ] No debug console.log statements
- [ ] No exposed API keys in frontend

✅ **Environment Variables Set**
- [ ] ADMIN_PASSWORD set in production
- [ ] SUPABASE_URL set
- [ ] SUPABASE_ANON_KEY set
- [ ] SUPABASE_SERVICE_ROLE_KEY set (server only!)
- [ ] SUPABASE_DB_URL set

✅ **Admin Password Changed**
- [ ] Change from default `frameGameAdmin2026`
- [ ] Use strong password
- [ ] Document securely

### Build & Test

```bash
# Build production version
npm run build

# Test production build locally
npx serve dist

# Visit http://localhost:3000
# Test all features
```

### Deploy

Choose your deployment platform:

**Option A: Vercel**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Option B: Netlify**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

**Option C: Supabase (for backend)**
Your backend is already on Supabase!
Just deploy frontend to Vercel/Netlify.

---

## Part 8: Troubleshooting

### Problem: Admin login not working after export

**Solution:**
1. Check `/src/app/routes.tsx` has correct routes
2. Verify `/src/app/pages/admin-login.tsx` exists
3. Check localStorage in DevTools: Should have `adminToken` after login
4. Verify backend at `/supabase/functions/server/index.tsx` has `/admin/login` route

### Problem: Features missing after Figma export

**Solution:**
- Only visual design should change
- All `.tsx` files should remain
- All backend routes should remain
- Check that imports are correct
- Verify no files were accidentally deleted

### Problem: Styles look different than Figma

**Solution:**
1. Check all Tailwind classes are correct
2. Verify custom styles in `/src/styles/theme.css`
3. Check fonts are loaded in `/src/styles/fonts.css`
4. Inspect in browser DevTools to see computed styles

### Problem: Backend not working

**Solution:**
1. Check Supabase Edge Functions are deployed
2. Verify environment variables are set
3. Check browser console for errors
4. Check Supabase logs for server errors

### Problem: Can't upload images/fonts

**Solution:**
1. Verify Supabase Storage bucket exists: `make-a8ba6828-slides`
2. Check bucket permissions (should be private)
3. Verify signed URLs are generated for downloads
4. Check file size limits

---

## Part 9: Maintaining Design-Code Sync

### Workflow for Future Changes

```
Design Change → Code Update → Deploy
```

**When you change design in Figma:**
1. Document the change
2. Find corresponding code component
3. Update Tailwind classes
4. Test locally
5. Deploy

**When you add new features in code:**
1. Build the feature
2. Export to Figma (optional)
3. Update design system in Figma
4. Keep documentation updated

### Version Control

Use git to track changes:

```bash
# Before making changes
git checkout -b design-update-2026-03

# After making changes
git add .
git commit -m "Updated design from Figma: larger buttons, new colors"
git push origin design-update-2026-03

# Merge when tested
```

---

## Quick Reference: File Structure

```
/src/app/
├── App.tsx                              # Main entry point
├── routes.tsx                           # React Router config
├── pages/
│   ├── landing-page.tsx                 # Public landing page
│   ├── admin-login.tsx                  # Admin login form
│   ├── admin-dashboard.tsx              # Admin dashboard (protected)
│   └── admin-dashboard-preview.tsx      # ❌ DELETE BEFORE PRODUCTION
├── components/
│   ├── admin/
│   │   ├── subscribers-table.tsx        # Subscriber management
│   │   ├── email-template-editor.tsx    # Email templates
│   │   ├── timeline-editor.tsx          # Timeline management
│   │   ├── section-manager.tsx          # Content manager
│   │   ├── user-preview.tsx             # Preview mode
│   │   ├── landing-page-editor.tsx      # Landing page settings
│   │   ├── font-manager.tsx             # Custom fonts
│   │   └── settings-panel.tsx           # Admin settings
│   ├── filmstrip-timeline.tsx           # Timeline display
│   └── signup-form.tsx                  # Public signup form
└── styles/
    ├── theme.css                        # Design tokens
    ├── fonts.css                        # Font imports
    └── app.css                          # Global styles

/supabase/functions/server/
├── index.tsx                            # Main server file
└── kv_store.tsx                         # ❌ DO NOT EDIT (protected)
```

---

## Final Checklist

Before going live:

### Pre-Production
- [ ] All features tested locally
- [ ] `/admin/preview` route removed
- [ ] Admin password changed from default
- [ ] Environment variables set in production
- [ ] Fonts uploaded and working
- [ ] Images uploaded and displaying
- [ ] Mobile responsive verified
- [ ] All 7 user types work
- [ ] Email templates tested
- [ ] Supabase Storage working
- [ ] Backend routes all responding

### Production
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Backend deployed (Supabase Edge Functions)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics added (optional)
- [ ] Error monitoring setup (optional)

### Post-Launch
- [ ] Test live site
- [ ] Test admin login on production
- [ ] Test signup flow
- [ ] Test email sending
- [ ] Test all admin features
- [ ] Monitor for errors
- [ ] Document for team

---

## Need Help?

### Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npx serve dist

# Install new package
npm install package-name

# Deploy Supabase functions
npx supabase functions deploy server

# Check Supabase logs
npx supabase functions logs server
```

### Resources

- **Figma Docs**: https://help.figma.com
- **html.to.design**: https://html.to.design
- **Tailwind Docs**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com
- **Supabase Docs**: https://supabase.com/docs

---

## Summary

**To Export:**
1. Run app locally
2. Use html.to.design plugin in Figma
3. Capture all pages and states
4. Organize in Figma

**To Edit:**
1. Make design changes in Figma
2. Extract new values from Inspect panel
3. Update Tailwind classes in code
4. Test locally

**To Restore Functionality:**
1. Delete `/admin/preview` route
2. Verify all `.tsx` files intact
3. Test admin login
4. Test all features
5. Deploy

**Your backend stays intact!** All database operations, authentication, and API routes remain functional. Only the frontend visual design changes.

---

🎉 **You're all set!** Your Frame Game app can now flow freely between Figma Make → Figma Design → Production, with full functionality preserved.
