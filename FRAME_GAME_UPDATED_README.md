# The Frame Game - Updated Landing Page System

## 🎉 Major Updates

Your landing page now features **7 visitor categories** and a powerful **Access Control System** that lets you completely customize what each type of visitor sees!

## 👥 Visitor Categories

1. **Filmmaker** - Aspiring content creators
2. **Parent** - Parents supporting their children
3. **Educator** - Teachers and instructors
4. **Teen** - Young creators
5. **Investor** - Potential investors
6. **Donor** - Arts education supporters
7. **Just Curious** - General interest visitors

## 📦 Content Sections Available

### Product Demos
- **Frame Game Studio** - Your editing interface showcase
- **Teacher/Student Dashboard** - Educational management tools
- **Camera Overlay System** - Professional filming aids (future phase)

### Information Pages
- **Beta Tester Information** - Launch timeline and benefits
- **Parent/Educator Information** - Why it matters for families and classrooms
- **Investor Information** - Market opportunity and ROI
- **General Information** - Mission, journey, and screen credits

## 🎛️ Access Control System (NEW!)

### How It Works

In the Admin Dashboard → **Access Control** tab, you can:

1. **Select a visitor category** (e.g., Filmmaker, Parent, Investor)
2. **Choose which content sections** they should see
3. **Arrange the order** of content sections
4. **Save the configuration**

### Default Configuration

- **Filmmaker**: Studio Demo → General Info → Beta Info
- **Parent**: General Info → Parent/Educator Info → Dashboard Demo
- **Educator**: General Info → Parent/Educator Info → Dashboard Demo
- **Teen**: Studio Demo → General Info → Beta Info
- **Investor**: Investor Info → General Info → Studio Demo → Dashboard Demo
- **Donor**: General Info → Parent/Educator Info
- **Just Curious**: General Info only

### Customizing Access

**Example: Give Investors full access**
1. Go to Admin → Access Control
2. Select "Investor"
3. Click on each content section you want to show
4. Use ↑↓ arrows to reorder sections
5. Click "Save Access Control Configuration"

**Example: Hide beta info from general visitors**
1. Select "Just Curious"
2. Uncheck "Beta Tester Information"
3. Save

## 🎨 Admin Dashboard Features

### 1. Subscribers Tab
- View all **7 visitor types** with color-coded badges
- **8 stat cards**: Total + one for each visitor type
- **8 filter buttons**: Filter by any visitor category
- Export to CSV
- Send individualized emails

### 2. Email Templates Tab
- Customize email templates for each visitor type
- Use `{name}` placeholder for personalization
- Live preview of emails
- Save templates independently

### 3. Timelines Tab
- Create custom timelines for different audiences
- Add/edit/remove milestones
- Each milestone has: date, event, description

### 4. Access Control Tab (NEW!)
- **Left panel**: Toggle which content sections are visible
- **Right panel**: Reorder sections with drag arrows
- Configure separately for all 7 visitor types
- Real-time visual feedback

## 🚀 User Experience Flow

1. **Visitor lands on page** → Sees hero and signup form with 7 options
2. **Selects their role** → Filmmaker, Parent, Educator, etc.
3. **Enters email** → Submits form
4. **Gets personalized content** → Only sees sections you've configured for their type
5. **Content appears in order** → Exactly as you arranged it in Access Control

## 💡 Use Cases

### For Beta Testing Launch
- Show Studio Demo to Filmmakers and Teens
- Show Beta Info only to testers
- Hide investor materials from general users

### For Fundraising Campaign
- Prioritize Donor and Investor information
- Show all visitors the Parent/Educator benefits
- Highlight Dashboard Demo to educators

### For Product Demo Event
- Enable all product demos for everyone
- Put Studio Demo first for creators
- Put Dashboard Demo first for educators

## 🔧 Technical Implementation

### Content Sections
Each section is a React component in `/src/app/components/content/`:
- `studio-demo.tsx` - Frame Game Studio showcase
- `dashboard-demo.tsx` - Teacher/Student Dashboard
- `camera-overlay-demo.tsx` - Camera overlay system
- `beta-info.tsx` - Beta tester benefits and timeline
- `parent-educator-info.tsx` - Parent and educator value prop
- `investor-info.tsx` - Investment opportunity details
- `general-info.tsx` - Mission, journey, screen credits

### Access Control Storage
- Configuration stored in: `access_control:config`
- Format: `{ filmmaker: ["studio-demo", "general-info"], ... }`
- Public endpoint fetches config for visitors
- Admin endpoint (protected) updates config

## 📊 Data Collection

All visitor data includes:
- Name (optional)
- Email (required)
- Visitor type (7 options)
- Subscription timestamp

Export to CSV anytime from the Subscribers tab!

## 🎯 Best Practices

1. **Start simple**: Begin with default configuration
2. **Test as visitor**: Sign up as different types to see their experience
3. **Update gradually**: Change one visitor type at a time
4. **Monitor stats**: Check which types are signing up most
5. **Adjust content**: Reorder based on what converts best

## 🔐 Security Notes

- Admin password: `frameGameAdmin2026` (changeable via environment variable)
- Access Control is user-facing (public can fetch config)
- Only admins can UPDATE access control settings
- Subscriber data is admin-only

## 🎬 Next Steps

1. **Configure Access Control** for your primary audience
2. **Customize Email Templates** for each visitor type
3. **Set Your Timelines** with real launch dates
4. **Share Your Landing Page** and watch subscribers roll in!
5. **Monitor and Adjust** based on who signs up

---

**Pro Tip**: Use the Access Control system to A/B test different content orders. Try showing Studio Demo first vs. General Info first and see which converts better!

Enjoy your fully customizable landing page! 🚀
