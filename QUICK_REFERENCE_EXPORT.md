# 🎯 Quick Reference: Figma Export & Admin Restoration

## 📸 EXPORT TO FIGMA (5 Steps)

### 1. Run App
```bash
npm run dev
```

### 2. Open Figma & Install Plugin
- Open Figma Desktop
- Install **html.to.design** plugin

### 3. Export Pages (One by One)
```
✓ Landing Page:        http://localhost:5173/
✓ Admin Login:         http://localhost:5173/admin
✓ Admin Dashboard:     http://localhost:5173/admin/preview
✓ Content Viewer:      (signup & screenshot each user type)
```

### 4. Screenshot Interactive States
- Content Manager with sections
- Edit panel open
- Add section modal
- Each admin tab (Preview, Subscribers, Emails, etc.)

### 5. Organize in Figma
- Create pages for each section
- Extract components (buttons, cards, forms)
- Set up Auto Layout (Shift+A)

---

## 🎨 EDIT IN FIGMA (3 Steps)

### 1. Make Visual Changes
- Adjust colors
- Change spacing
- Update typography
- Modify layouts

### 2. Document Changes
Create a list:
```
✓ Hero title: 40px → 48px
✓ Button padding: 16px → 20px
✓ Card shadow: lighter → stronger
✓ Section color: purple → blue
```

### 3. Use Inspect Panel
- Select element in Figma
- Click **Inspect** tab
- Copy CSS values
- Convert to Tailwind classes

---

## 💻 APPLY TO CODE (4 Steps)

### 1. Find Component File
```
Landing page:        /src/app/pages/landing-page.tsx
Admin dashboard:     /src/app/pages/admin-dashboard.tsx
Subscribers:         /src/app/components/admin/subscribers-table.tsx
Content Manager:     /src/app/components/admin/section-manager.tsx
```

### 2. Convert CSS to Tailwind

| Figma Inspector | Tailwind Class |
|----------------|----------------|
| padding: 16px | p-4 |
| padding: 20px | p-5 |
| padding: 24px | p-6 |
| padding: 32px | p-8 |
| gap: 8px | gap-2 |
| gap: 16px | gap-4 |
| gap: 24px | gap-6 |
| border-radius: 16px | rounded-2xl |
| border-radius: 24px | rounded-3xl |
| font-size: 48px | text-5xl |
| font-size: 40px | text-4xl |
| font-size: 32px | text-3xl |

### 3. Update className

**Before:**
```tsx
className="text-4xl px-6 py-3 rounded-2xl"
```

**After (if Figma shows larger):**
```tsx
className="text-5xl px-8 py-5 rounded-3xl"
```

### 4. Test Locally
```bash
npm run dev
# Visit http://localhost:5173/
# Verify changes look correct
```

---

## 🔐 RESTORE ADMIN LOGIN (3 Steps)

### ⚠️ CRITICAL: Remove Preview Route

#### Step 1: Delete Preview File
In Figma Make, tell the AI:
```
"Delete /src/app/pages/admin-dashboard-preview.tsx"
```

Or manually:
```bash
rm /src/app/pages/admin-dashboard-preview.tsx
```

#### Step 2: Remove from Routes
Edit `/src/app/routes.tsx`

**Remove these lines:**
```tsx
import { AdminDashboardPreview } from "./pages/admin-dashboard-preview";

{
  path: "/admin/preview",
  Component: AdminDashboardPreview,
},
```

**Final routes.tsx should look like:**
```tsx
import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { AdminLogin } from "./pages/admin-login";
import { AdminDashboard } from "./pages/admin-dashboard";

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

#### Step 3: Test Admin Login
1. Visit `http://localhost:5173/admin`
2. Enter password: `frameGameAdmin2026`
3. Should redirect to `/admin/dashboard`
4. All tabs should work
5. All features should work

---

## ✅ FEATURE TEST CHECKLIST

After restoring admin login, test everything:

### Landing Page
- [ ] Signup form works
- [ ] User type selection works
- [ ] Email validation works
- [ ] Redirects to content viewer

### Admin Dashboard
- [ ] Login with password works
- [ ] All 8 tabs load correctly
- [ ] Logout works

### Content Manager
- [ ] Can add sections
- [ ] Can edit sections  
- [ ] Can delete sections
- [ ] Can drag & reorder
- [ ] Can upload images
- [ ] Visibility toggles work

### Subscribers
- [ ] View all subscribers
- [ ] Add subscriber manually
- [ ] Delete subscriber
- [ ] Send email
- [ ] Export CSV
- [ ] Filters work

### Email Templates
- [ ] View templates
- [ ] Edit subject/body
- [ ] Save changes

### Timelines
- [ ] Create timeline
- [ ] Edit timeline
- [ ] Add/remove slides
- [ ] Reorder slides

### Landing Page Editor
- [ ] Edit hero text
- [ ] Change colors
- [ ] Update CTA
- [ ] Changes reflect live

### Fonts
- [ ] Upload fonts
- [ ] View uploaded fonts
- [ ] Fonts in pickers
- [ ] Delete fonts

### Settings
- [ ] Change password
- [ ] Update settings
- [ ] Save changes

### Preview
- [ ] Select user types
- [ ] Content changes
- [ ] All 7 types work

---

## 🚀 DEPLOY CHECKLIST

### Before Production
- [ ] `/admin/preview` deleted
- [ ] Admin password changed
- [ ] Environment variables set
- [ ] All features tested
- [ ] Mobile responsive checked

### Deploy Frontend
```bash
npm run build
npx vercel --prod
# OR
npx netlify deploy --prod --dir=dist
```

### Test Production
- [ ] Visit live site
- [ ] Test admin login
- [ ] Test signup flow
- [ ] Test all admin features

---

## 🆘 TROUBLESHOOTING

### Admin login not working?
1. Check routes.tsx has `/admin` route
2. Check localStorage has `adminToken` after login
3. Check backend has `/admin/login` route
4. Password is: `frameGameAdmin2026` (default)

### Features missing?
1. Verify all `.tsx` files exist
2. Check imports are correct
3. Verify backend routes work
4. Check console for errors

### Styles look different?
1. Check Tailwind classes match Figma
2. Verify fonts loaded
3. Check `/src/styles/theme.css`
4. Use DevTools inspector

### Images not loading?
1. Check Supabase Storage bucket exists
2. Verify signed URLs generated
3. Check bucket permissions
4. Check file paths correct

---

## 📞 QUICK COMMANDS

```bash
# Start dev server
npm run dev

# Build production
npm run build

# Preview build
npx serve dist

# Deploy to Vercel
npx vercel --prod

# Deploy to Netlify
npx netlify deploy --prod --dir=dist
```

---

## 🎯 TL;DR

1. **Export**: Use html.to.design plugin in Figma
2. **Edit**: Make changes in Figma Design
3. **Apply**: Update Tailwind classes in code
4. **Restore**: Delete `/admin/preview` route
5. **Test**: Verify admin login works
6. **Deploy**: Build and deploy to production

**Your backend never changes!** All functionality stays intact. Only frontend visuals change.

---

## 📄 Full Guide
See `/FIGMA_DESIGN_EXPORT_COMPLETE_GUIDE.md` for detailed instructions.

---

## 🎉 Done!

Your Frame Game app flows between:
- **Figma Make** (build features)
- **Figma Design** (refine visuals)
- **Production** (live site)

With full functionality preserved! 🚀
