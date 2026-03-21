import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Admin credentials — KV override takes priority, then env var, then hardcoded fallback
const ENV_ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD') || 'frameGameAdmin2026';

async function getAdminPassword(): Promise<string> {
  try {
    const override = await kv.get('admin_password_override');
    if (override && typeof override === 'object' && override.password) {
      return override.password;
    }
  } catch (_) { /* fallback to env */ }
  return ENV_ADMIN_PASSWORD;
}

// Supabase client for storage
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const BUCKET_NAME = 'make-a8ba6828-slides';

// Idempotently create storage bucket on startup
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket: any) => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, { public: false });
      console.log(`Created storage bucket: ${BUCKET_NAME}`);
    } else {
      console.log(`Storage bucket already exists: ${BUCKET_NAME}`);
    }
  } catch (error) {
    console.error('Error creating storage bucket:', error);
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a8ba6828/health", (c) => {
  return c.json({ status: "ok" });
});

// Admin login
app.post("/make-server-a8ba6828/admin/login", async (c) => {
  try {
    const { password } = await c.req.json();
    
    if (password === await getAdminPassword()) {
      // Generate a simple token (in production, use JWT)
      const token = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(`admin_token:${token}`, { 
        createdAt: new Date().toISOString(),
        valid: true 
      });
      
      console.log(`Admin logged in with token: ${token}`);
      
      return c.json({ success: true, token });
    }
    
    return c.json({ error: "Invalid password" }, 401);
  } catch (error) {
    console.error("Error during admin login:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});

// Verify admin token middleware
const verifyAdmin = async (token: string | null) => {
  if (!token) {
    console.log("No token provided");
    return false;
  }
  
  try {
    const tokenData = await kv.get(`admin_token:${token}`);
    console.log(`Token verification for ${token}:`, tokenData ? 'VALID' : 'INVALID');
    return tokenData && tokenData.valid === true;
  } catch (error) {
    console.error("Error verifying admin token:", error);
    return false;
  }
};

// Subscribe to mailing list
app.post("/make-server-a8ba6828/subscribe", async (c) => {
  try {
    const { email, name, userType } = await c.req.json();
    
    if (!email || !userType) {
      return c.json({ error: "Email and user type are required" }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Validate user type
    const validTypes = ["filmmaker", "parent", "educator", "teen", "investor", "donor", "just-curious"];
    if (!validTypes.includes(userType)) {
      return c.json({ error: "Invalid user type" }, 400);
    }

    // Generate unique ID
    const subscriberId = `subscriber_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store subscriber data
    const subscriberData = {
      id: subscriberId,
      email,
      name: name || "",
      userType,
      subscribedAt: new Date().toISOString(),
    };

    await kv.set(`mailing_list:${subscriberId}`, subscriberData);
    
    console.log(`New subscriber added: ${email} as ${userType}`);
    
    return c.json({ 
      success: true, 
      message: "Successfully subscribed!",
      userType 
    });
  } catch (error) {
    console.error("Error subscribing user to mailing list:", error);
    return c.json({ error: "Failed to subscribe. Please try again." }, 500);
  }
});

// Get all subscribers (admin only)
app.get("/make-server-a8ba6828/admin/subscribers", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const subscribers = await kv.getByPrefix("mailing_list:");
    return c.json({ subscribers, count: subscribers.length });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return c.json({ error: "Failed to fetch subscribers" }, 500);
  }
});

// Get email templates
app.get("/make-server-a8ba6828/admin/email-templates", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const templates = await kv.getByPrefix("email_template:");
    
    // Return default templates if none exist
    if (templates.length === 0) {
      return c.json({
        templates: [
          {
            userType: "beta-tester",
            subject: "Welcome to The Frame Game Beta! 🎬",
            body: "Hey {name},\n\nWe're thrilled to have you as a beta tester! Get ready to turn screen time into screen credits.\n\nYou'll be the first to try our platform when we launch in Spring 2026. We'll send you early access details soon.\n\nStay creative!\nThe Frame Game Team"
          },
          {
            userType: "donor",
            subject: "Thank You for Supporting Arts Education! ❤️",
            body: "Dear {name},\n\nThank you for your interest in supporting The Frame Game! Your generosity will help us empower young creators and make arts education accessible to all.\n\nWe'll be in touch soon with ways to contribute and make a real impact.\n\nWith gratitude,\nThe Frame Game Team"
          },
          {
            userType: "investor",
            subject: "The Frame Game - Investment Opportunity",
            body: "Hello {name},\n\nThank you for your interest in The Frame Game! We're excited to share our vision for revolutionizing arts education.\n\nOur team will reach out shortly to schedule a call and provide our pitch deck, financials, and growth strategy.\n\nBest regards,\nThe Frame Game Team"
          }
        ]
      });
    }
    
    return c.json({ templates });
  } catch (error) {
    console.error("Error fetching email templates:", error);
    return c.json({ error: "Failed to fetch templates" }, 500);
  }
});

// Update email template
app.post("/make-server-a8ba6828/admin/email-templates", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { userType, subject, body } = await c.req.json();
    
    if (!userType || !subject || !body) {
      return c.json({ error: "userType, subject, and body are required" }, 400);
    }
    
    await kv.set(`email_template:${userType}`, { userType, subject, body });
    
    return c.json({ success: true, message: "Template updated successfully" });
  } catch (error) {
    console.error("Error updating email template:", error);
    return c.json({ error: "Failed to update template" }, 500);
  }
});

// Get timelines
app.get("/make-server-a8ba6828/timelines", async (c) => {
  try {
    const timelines = await kv.getByPrefix("timeline:");
    
    // Return default timeline if none exists
    if (timelines.length === 0) {
      return c.json({
        timelines: [
          {
            userType: "beta-tester",
            title: "Beta Launch Timeline",
            milestones: [
              { date: "Spring 2026", event: "Beta Testing Begins", description: "First wave of testers get access" },
              { date: "Summer 2026", event: "Feature Expansion", description: "New challenges and tutorials added" },
              { date: "Fall 2026", event: "Public Launch", description: "Platform opens to everyone" }
            ]
          }
        ]
      });
    }
    
    return c.json({ timelines });
  } catch (error) {
    console.error("Error fetching timelines:", error);
    return c.json({ error: "Failed to fetch timelines" }, 500);
  }
});

// Update timeline (admin only)
app.post("/make-server-a8ba6828/admin/timelines", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { userType, title, milestones } = await c.req.json();
    
    if (!userType || !title || !milestones) {
      return c.json({ error: "userType, title, and milestones are required" }, 400);
    }
    
    await kv.set(`timeline:${userType}`, { userType, title, milestones });
    
    return c.json({ success: true, message: "Timeline updated successfully" });
  } catch (error) {
    console.error("Error updating timeline:", error);
    return c.json({ error: "Failed to update timeline" }, 500);
  }
});

// Send email to subscriber (admin only - simulated)
app.post("/make-server-a8ba6828/admin/send-email", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { subscriberId, templateType } = await c.req.json();
    
    // Get subscriber
    const subscriber = await kv.get(`mailing_list:${subscriberId}`);
    if (!subscriber) {
      return c.json({ error: "Subscriber not found" }, 404);
    }
    
    // Get template
    const template = await kv.get(`email_template:${templateType}`);
    
    // In production, this would send an actual email via SendGrid, AWS SES, etc.
    // For now, we'll just log it
    console.log(`[EMAIL SIMULATION] Sending to: ${subscriber.email}`);
    console.log(`Subject: ${template?.subject || 'Welcome!'}`);
    console.log(`Body: ${template?.body || 'Welcome to The Frame Game!'}`);
    
    return c.json({ 
      success: true, 
      message: "Email sent successfully (simulated)",
      details: {
        to: subscriber.email,
        subject: template?.subject,
        preview: template?.body?.substring(0, 100)
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return c.json({ error: "Failed to send email" }, 500);
  }
});

// Get access control configuration
app.get("/make-server-a8ba6828/access-control", async (c) => {
  try {
    const config = await kv.get("access_control:config");
    
    // Return default configuration if none exists
    if (!config) {
      return c.json({
        config: {
          filmmaker: ["studio-demo", "general-info", "beta-info"],
          parent: ["general-info", "parent-educator-info", "dashboard-demo"],
          educator: ["general-info", "parent-educator-info", "dashboard-demo"],
          teen: ["studio-demo", "general-info", "beta-info"],
          investor: ["investor-info", "general-info", "studio-demo", "dashboard-demo"],
          donor: ["general-info", "parent-educator-info"],
          "just-curious": ["general-info"]
        }
      });
    }
    
    return c.json({ config });
  } catch (error) {
    console.error("Error fetching access control:", error);
    return c.json({ error: "Failed to fetch access control" }, 500);
  }
});

// Update access control configuration (admin only)
app.post("/make-server-a8ba6828/admin/access-control", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { config } = await c.req.json();
    
    if (!config) {
      return c.json({ error: "config is required" }, 400);
    }
    
    await kv.set("access_control:config", config);
    
    return c.json({ success: true, message: "Access control updated successfully" });
  } catch (error) {
    console.error("Error updating access control:", error);
    return c.json({ error: "Failed to update access control" }, 500);
  }
});

// Get all embed configurations
app.get("/make-server-a8ba6828/embeds", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const embeds = await kv.getByPrefix("embed_config:");
    const embedsObj: Record<string, any> = {};
    
    embeds.forEach((embed: any) => {
      if (embed.section) {
        embedsObj[embed.section] = embed;
      }
    });
    
    return c.json(embedsObj);
  } catch (error) {
    console.error("Error fetching embeds:", error);
    return c.json({ error: "Failed to fetch embeds" }, 500);
  }
});

// Get specific embed configuration
app.get("/make-server-a8ba6828/embeds/:section", async (c) => {
  try {
    const section = c.req.param('section');
    const config = await kv.get(`embed_config:${section}`);
    
    if (!config) {
      return c.json({ config: null });
    }
    
    return c.json({ config });
  } catch (error) {
    console.error("Error fetching embed config:", error);
    return c.json({ error: "Failed to fetch embed configuration" }, 500);
  }
});

// Update embed configuration (admin only)
app.post("/make-server-a8ba6828/embeds/:section", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const section = c.req.param('section');
    const { config } = await c.req.json();
    
    if (!config) {
      return c.json({ error: "config is required" }, 400);
    }
    
    // Add section to config for easier retrieval
    config.section = section;
    
    await kv.set(`embed_config:${section}`, config);
    
    return c.json({ success: true, message: "Embed configuration saved successfully" });
  } catch (error) {
    console.error("Error saving embed config:", error);
    return c.json({ error: "Failed to save embed configuration" }, 500);
  }
});

// Delete embed configuration (admin only)
app.delete("/make-server-a8ba6828/embeds/:section", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const section = c.req.param('section');
    await kv.del(`embed_config:${section}`);
    
    return c.json({ success: true, message: "Embed configuration deleted successfully" });
  } catch (error) {
    console.error("Error deleting embed config:", error);
    return c.json({ error: "Failed to delete embed configuration" }, 500);
  }
});

// Get section configuration (admin only)
app.get("/make-server-a8ba6828/sections", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const sections = await kv.get("sections_config");
    return c.json({ sections: sections || [] });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return c.json({ error: "Failed to fetch sections" }, 500);
  }
});

// Get section configuration (public - for users viewing content)
app.get("/make-server-a8ba6828/sections/public", async (c) => {
  try {
    const sections = await kv.get("sections_config");
    return c.json({ sections: sections || [] });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return c.json({ error: "Failed to fetch sections" }, 500);
  }
});

// Save section configuration (admin only)
app.post("/make-server-a8ba6828/sections", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { sections } = await c.req.json();
    
    if (!sections) {
      return c.json({ error: "sections array is required" }, 400);
    }
    
    await kv.set("sections_config", sections);
    
    return c.json({ success: true, message: "Section configuration saved successfully" });
  } catch (error) {
    console.error("Error saving sections:", error);
    return c.json({ error: "Failed to save section configuration" }, 500);
  }
});

// Get landing page configuration (public)
app.get("/make-server-a8ba6828/landing-config", async (c) => {
  try {
    const config = await kv.get("landing_page_config");
    return c.json({ config: config || null });
  } catch (error) {
    console.error("Error fetching landing page config:", error);
    return c.json({ error: "Failed to fetch landing page config" }, 500);
  }
});

// Save landing page configuration (admin only)
app.post("/make-server-a8ba6828/admin/landing-config", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { config } = await c.req.json();
    
    if (!config) {
      return c.json({ error: "config object is required" }, 400);
    }
    
    await kv.set("landing_page_config", config);
    
    return c.json({ success: true, message: "Landing page config saved successfully" });
  } catch (error) {
    console.error("Error saving landing page config:", error);
    return c.json({ error: "Failed to save landing page config" }, 500);
  }
});

// ═══ FILE UPLOAD (admin only) ═══
// Accepts multipart form data with a "file" field
// Stores in Supabase Storage and returns a signed URL
app.post("/make-server-a8ba6828/admin/upload", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    
    if (!isAdmin) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return c.json({ error: "No file provided. Include a 'file' field in multipart form data." }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'font/ttf', 'font/otf', 'font/woff', 'font/woff2', 'application/x-font-ttf', 'application/x-font-otf', 'application/font-woff', 'application/font-woff2', 'application/octet-stream'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: `File type '${file.type}' not allowed. Accepted: JPG, PNG, GIF, WebP, PDF, TTF, OTF, WOFF, WOFF2` }, 400);
    }

    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      return c.json({ error: "File too large. Maximum size is 50MB." }, 400);
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'bin';
    const fileName = `slide_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.${ext}`;
    
    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return c.json({ error: `Storage upload failed: ${error.message}` }, 500);
    }

    // Generate a long-lived signed URL (7 days)
    const { data: signedData, error: signError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 days

    if (signError) {
      console.error("Error creating signed URL:", signError);
      return c.json({ error: `Failed to create signed URL: ${signError.message}` }, 500);
    }

    console.log(`File uploaded: ${fileName}, type: ${file.type}, size: ${file.size}`);

    return c.json({
      success: true,
      url: signedData.signedUrl,
      fileName,
      fileType: file.type,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return c.json({ error: `File upload failed: ${error}` }, 500);
  }
});

// ═══ CUSTOM FONTS ═══

// Upload a custom font file (admin only)
app.post("/make-server-a8ba6828/admin/fonts/upload", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    if (!isAdmin) return c.json({ error: "Unauthorized" }, 401);

    const formData = await c.req.formData();
    const file = formData.get('file') as File | null;
    const fontName = formData.get('name') as string | null;

    if (!file || !fontName) {
      return c.json({ error: "Both 'file' (font file) and 'name' (font name) are required." }, 400);
    }

    // Validate it's a font file by extension
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!['ttf', 'otf', 'woff', 'woff2'].includes(ext)) {
      return c.json({ error: `Invalid font file. Accepted: .ttf, .otf, .woff, .woff2` }, 400);
    }

    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: "Font file too large. Maximum 10MB." }, 400);
    }

    // Sanitize font name for filename
    const safeName = fontName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const storagePath = `fonts/${safeName}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Content type mapping
    const contentTypes: Record<string, string> = {
      'ttf': 'font/ttf',
      'otf': 'font/otf',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
    };

    // Upload to storage (upsert to allow re-upload)
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: contentTypes[ext] || 'application/octet-stream',
        upsert: true,
      });

    if (uploadError) {
      console.error("Font upload storage error:", uploadError);
      return c.json({ error: `Storage upload failed: ${uploadError.message}` }, 500);
    }

    // Save font metadata to KV
    const fontId = `font_${safeName}`;
    const fontMeta = {
      id: fontId,
      name: fontName.trim(),
      safeName,
      storagePath,
      format: ext,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    };

    await kv.set(`custom_font:${fontId}`, fontMeta);

    console.log(`Custom font uploaded: ${fontName} (${storagePath})`);

    return c.json({ success: true, font: fontMeta });
  } catch (error) {
    console.error("Error uploading font:", error);
    return c.json({ error: `Font upload failed: ${error}` }, 500);
  }
});

// Get all custom fonts (public — needed to load @font-face on every page)
app.get("/make-server-a8ba6828/fonts", async (c) => {
  try {
    const fonts = await kv.getByPrefix("custom_font:");
    const fontsWithUrls = await Promise.all(
      (fonts || []).map(async (font: any) => {
        // Generate a long-lived signed URL (30 days) for the actual font file
        const { data: signedData, error: signError } = await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(font.storagePath, 60 * 60 * 24 * 30); // 30 days

        if (signError) {
          console.error(`Error creating signed URL for font ${font.name}:`, signError);
          return { ...font, fontUrl: null };
        }
        return { ...font, fontUrl: signedData.signedUrl };
      })
    );
    return c.json({ fonts: fontsWithUrls });
  } catch (error) {
    console.error("Error fetching custom fonts:", error);
    return c.json({ fonts: [] });
  }
});

// Delete a custom font (admin only)
app.delete("/make-server-a8ba6828/admin/fonts/:fontId", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    if (!isAdmin) return c.json({ error: "Unauthorized" }, 401);

    const fontId = c.req.param('fontId');
    const fontMeta = await kv.get(`custom_font:${fontId}`);

    if (!fontMeta) {
      return c.json({ error: "Font not found" }, 404);
    }

    // Delete from storage
    await supabase.storage.from(BUCKET_NAME).remove([fontMeta.storagePath]);
    // Delete metadata
    await kv.del(`custom_font:${fontId}`);

    console.log(`Custom font deleted: ${fontMeta.name}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting font:", error);
    return c.json({ error: `Failed to delete font: ${error}` }, 500);
  }
});

// ═══ CHANGE ADMIN PASSWORD ═══
app.post("/make-server-a8ba6828/admin/change-password", async (c) => {
  try {
    const token = c.req.header('X-Admin-Token');
    const isAdmin = await verifyAdmin(token);
    if (!isAdmin) return c.json({ error: "Unauthorized" }, 401);

    const { currentPassword, newPassword } = await c.req.json();

    if (!currentPassword || !newPassword) {
      return c.json({ error: "Both currentPassword and newPassword are required." }, 400);
    }

    if (newPassword.length < 8) {
      return c.json({ error: "New password must be at least 8 characters." }, 400);
    }

    // Verify current password
    const activePassword = await getAdminPassword();
    if (currentPassword !== activePassword) {
      return c.json({ error: "Current password is incorrect." }, 403);
    }

    // Store the new password as a KV override
    await kv.set('admin_password_override', { password: newPassword, changedAt: new Date().toISOString() });

    console.log("Admin password changed successfully.");
    return c.json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    console.error("Error changing admin password:", error);
    return c.json({ error: `Failed to change password: ${error}` }, 500);
  }
});

Deno.serve(app.fetch);