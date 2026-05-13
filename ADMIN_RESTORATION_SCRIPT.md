# 🔐 Admin Login Restoration Script

## When to Run This
After you've exported your design to Figma and made your changes, run this to restore secure admin login.

---

## Step 1: Delete the Preview File

### Option A: In Figma Make
Tell the AI:
```
Delete the file /src/app/pages/admin-dashboard-preview.tsx
```

### Option B: In Terminal
```bash
rm /src/app/pages/admin-dashboard-preview.tsx
```

---

## Step 2: Update Routes

Edit `/src/app/routes.tsx`

### Current Code (with preview):
```tsx
import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { AdminLogin } from "./pages/admin-login";
import { AdminDashboard } from "./pages/admin-dashboard";
import { AdminDashboardPreview } from "./pages/admin-dashboard-preview";

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
  {
    path: "/admin/preview",
    Component: AdminDashboardPreview,
  },
]);
```

### Updated Code (secure):
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

### Changes Made:
1. ❌ Removed import: `AdminDashboardPreview`
2. ❌ Removed route: `/admin/preview`

---

## Step 3: Test Admin Login

### A. Visit Admin Login
```
http://localhost:5173/admin
```

### B. Enter Password
```
Default password: frameGameAdmin2026
```

### C. Verify Redirect
- Should redirect to: `http://localhost:5173/admin/dashboard`
- Should see all 8 tabs
- Should NOT see yellow "Preview Mode" banner

### D. Test Features
- Click each tab
- Verify Content Manager works
- Verify Subscribers works
- Verify all features work

---

## Step 4: Change Default Password (IMPORTANT!)

### In Admin Dashboard:
1. Go to **Settings** tab
2. Find "Admin Password" section
3. Enter new strong password
4. Click "Save"

### Or Set via Environment Variable:
In your deployment platform (Vercel/Netlify):
```
ADMIN_PASSWORD=your-secure-password-here
```

---

## Step 5: Verify Security

### ✅ Security Checklist
- [ ] `/admin/preview` returns 404 error
- [ ] Can't access dashboard without login
- [ ] Admin password changed from default
- [ ] SUPABASE_SERVICE_ROLE_KEY not in frontend code
- [ ] No console.log with sensitive data

### Test Security:
1. Open browser incognito mode
2. Try to visit: `http://localhost:5173/admin/dashboard`
3. Should redirect to login page
4. Try old preview URL: `http://localhost:5173/admin/preview`
5. Should show 404 or redirect to home

---

## Step 6: Deploy

### Build Production Version
```bash
npm run build
```

### Test Build Locally
```bash
npx serve dist
```

Visit `http://localhost:3000` and test everything.

### Deploy to Production
```bash
# Vercel
npx vercel --prod

# OR Netlify
npx netlify deploy --prod --dir=dist
```

---

## Step 7: Test Production Site

### Test Live Admin:
1. Visit your production URL + `/admin`
2. Enter your password
3. Verify all features work
4. Test adding/deleting subscribers
5. Test uploading fonts
6. Test content manager
7. Test email templates

---

## ✅ Completion Checklist

- [ ] Preview file deleted
- [ ] Routes updated (no preview route)
- [ ] Local admin login works
- [ ] All features tested locally
- [ ] Admin password changed
- [ ] Security verified
- [ ] Production build created
- [ ] Production deployed
- [ ] Production admin tested

---

## 🆘 If Something Breaks

### Can't log in?
**Check:**
- Routes.tsx has `/admin` route
- `/src/app/pages/admin-login.tsx` exists
- Password is correct (default: `frameGameAdmin2026`)
- localStorage has `adminToken` after login

**Fix:**
```bash
# Clear browser localStorage
# In browser console:
localStorage.clear()
# Try login again
```

### Dashboard not loading?
**Check:**
- Routes.tsx has `/admin/dashboard` route
- `/src/app/pages/admin-dashboard.tsx` exists
- No import errors in console

**Fix:**
```bash
# Check for errors:
npm run dev
# Look at terminal and browser console
```

### 404 errors everywhere?
**Check:**
- You didn't accidentally delete other files
- All imports in routes.tsx are correct
- No typos in file paths

**Fix:**
```bash
# Verify all files exist:
ls /src/app/pages/
# Should see:
# - landing-page.tsx
# - admin-login.tsx
# - admin-dashboard.tsx
```

---

## 📞 Emergency Restore

If you need to restore the preview route temporarily:

### 1. Re-add to routes.tsx:
```tsx
{
  path: "/admin/preview",
  Component: AdminDashboard, // Reuse existing dashboard
}
```

### 2. This allows:
- Temporary access without login
- Export to Figma again
- Debugging

### 3. Remember to remove again before production!

---

## 🎉 You're Done!

Your admin dashboard is now:
- ✅ Secure (requires login)
- ✅ Fully functional (all features work)
- ✅ Production ready (no debug routes)
- ✅ Password protected (custom password)

The Frame Game is ready to launch! 🚀
