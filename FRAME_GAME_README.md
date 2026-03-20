# The Frame Game - Landing Page Guide

## 🎬 Overview

Your landing page is now a fully-featured platform for collecting and managing your mailing list with three distinct user types: Beta Testers, Donors, and Investors.

## ✨ Features

### Public Landing Page
- **Interactive Signup Form**: Visitors select their role (Beta Tester, Donor, or Investor) and submit their email
- **Personalized Content**: After signup, users see content tailored to their role
- **Social Sharing**: Twitter, Facebook, LinkedIn, and link copying functionality
- **Responsive Design**: Works beautifully on all devices
- **Vibrant Branding**: Matches your Frame Game arts education aesthetic

### Admin Dashboard
Access at: `/admin`

**Default Admin Password**: `frameGameAdmin2026`

#### Dashboard Features:

1. **Subscribers Tab**
   - View all subscribers in a beautiful table
   - Filter by user type (All, Beta Testers, Donors, Investors)
   - Stats cards showing totals for each category
   - Export subscriber list to CSV
   - Send individual emails to subscribers
   - View subscription dates and names

2. **Email Templates Tab**
   - Customize email templates for each user type
   - Real-time preview of emails
   - Use `{name}` placeholder for personalization
   - Default templates already set up for all three user types

3. **Timelines Tab**
   - Create custom timelines for each user type
   - Add/edit/delete milestones
   - Each milestone has: date, event name, and description
   - Fully customizable for your launch schedule

## 🔐 Admin Access

1. Navigate to the landing page
2. Click "Admin Login →" at the bottom
3. Enter password: `frameGameAdmin2026`
4. Access the full dashboard

**Security Note**: For production, you should set a custom password using the `ADMIN_PASSWORD` environment variable in Supabase.

## 📧 Email Management

### Email Templates
Each user type has a dedicated email template:

- **Beta Tester**: Welcome email with beta access info
- **Donor**: Thank you message with impact information
- **Investor**: Professional outreach with next steps

### Sending Emails
Currently, emails are **simulated** (logged to console). To send real emails in production:

1. Integrate with an email service (SendGrid, AWS SES, Mailgun, etc.)
2. Update the `/make-server-a8ba6828/admin/send-email` endpoint in `/supabase/functions/server/index.tsx`
3. Add your email API key as an environment variable

## 📊 Data Management

All data is stored in the Supabase KV store with these prefixes:

- `mailing_list:` - Subscriber data
- `email_template:` - Email templates
- `timeline:` - Timeline configurations
- `admin_token:` - Admin authentication tokens

### Exporting Data
Use the "Export CSV" button in the Subscribers tab to download your mailing list.

## 🎨 Customization

### Visual Style
The app uses:
- **Fonts**: Fredoka (headings), Comic Neue (body text)
- **Colors**: Purple-to-pink gradients, vibrant accent colors
- **Animation**: Motion (Framer Motion) for smooth transitions

### Content Updates
1. **Landing Page Text**: Edit `/src/app/components/hero.tsx` and `/src/app/components/signup-form.tsx`
2. **User-Specific Content**: Edit `/src/app/components/content-sections.tsx`
3. **Timelines**: Use the Admin Dashboard Timeline Editor

## 🚀 Sharing Your Landing Page

The social sharing buttons allow visitors to share on:
- Twitter
- Facebook  
- LinkedIn
- Copy link to clipboard

Share your landing page URL to start building your mailing list!

## 📈 Next Steps

1. **Customize Email Templates**: Go to Admin → Email Templates and personalize each message
2. **Set Your Timelines**: Update launch dates and milestones in Admin → Timelines
3. **Share Your Page**: Use social sharing to spread the word
4. **Monitor Growth**: Check the Admin Dashboard regularly to see new subscribers
5. **Export Your List**: Download CSV when ready to import into your email marketing tool

## 🔧 Technical Notes

- Built with React + TypeScript
- Backend: Supabase Edge Functions (Hono web server)
- Database: Supabase KV store
- Routing: React Router
- Animations: Motion (formerly Framer Motion)
- UI: Tailwind CSS v4

## 📝 Important Reminders

- The default admin password is visible in the login page for easy access
- Emails are currently simulated - integrate a real email service for production
- All subscriber data is stored securely in Supabase
- You can change timelines and email templates at any time without affecting existing subscribers

---

**Need Help?** All your subscriber data is safely stored and can be accessed anytime through the admin dashboard. Happy launching! 🎉
