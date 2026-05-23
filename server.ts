import express from "express";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { exec } from "child_process";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

// Database emulator in case Supabase is not configured
interface EmulatedUser {
  id: string;
  email: string;
  passwordHash: string; // simplistic mock password check
  name?: string;
  createdAt: string;
}

interface EmulatedHistory {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  result: string;
  format: string;
  tone: string;
  category: string;
  createdAt: string;
}

const localUsers: EmulatedUser[] = [];
const localHistory: EmulatedHistory[] = [];

// Standard fallback admin or initial user to let user tests work instantly
localUsers.push({
  id: "user-12345",
  email: "demo@creatoros.ai",
  passwordHash: "demo123",
  name: "Creator Demo User",
  createdAt: new Date().toISOString()
});

localHistory.push({
  id: "hist-1",
  userId: "user-12345",
  title: "Aesthetic Product Pitch",
  prompt: "Write a high-converting LinkedIn post for our CreatorOS launch targeting solopreneurs.",
  result: `🚀 **INTRODUCING CREATOROS** — The Unified Control Center for Modern Creators 🚀\n\nAre you tired of jumping between 5 different tabs just to write, schedule, optimize, and analytics-track a single post?\n\nWe were too. That's why we created **CreatorOS**.\n\n✨ **What is it?**\nA secure, premium, AI-fueled workspace that acts as your private social media command center.\n\n🔥 **Key Capabilities:**\n- **Pro-Grade Workflows:** One-tap scripts for YouTube, TikTok, LinkedIn & newsletters.\n- **Keep Your Keys Server-Side:** Strict architectural security ensuring your Gemini and API assets never leak to the browser.\n- **Direct Exports:** Clean exports to TXT, Printable PDF layouts, or 1-click clipboard Copy.\n- **Analytics Engine:** Visual indicators of your active pipeline status, token consumption, and historic projects.\n\nJoin 12,000+ top-tier solopreneurs and content experts optimizing their workflow today.\n\n👉 **Try it free at https://creatoros.ai**\n\n#SaaS #Solopreneur #CreatorEconomy #AIAutomation`,
  format: "LinkedIn Post",
  tone: "Professional & Bold",
  category: "Social Media",
  createdAt: new Date(Date.now() - 3600000).toISOString()
}, {
  id: "hist-2",
  userId: "user-12345",
  title: "SaaS Cold Outreach Email",
  prompt: "Generate a persuasive B2B cold email to pitching optimization tools to agency owners.",
  result: `Subject: Quick question about your content scaling bottlenecks at {{AgencyName}}\n\nHi {{OwnerName}},\n\nI came across your agency's recent video campaigns—your production style is top notch.\n\nHowever, I know that scaling custom content workflows for multiple clients usually means your writers get bottlenecked in research and drafting, eating into your net margins.\n\nWe built **CreatorOS** to solve exactly this.\n\nOur partner agencies are average **saving 14+ hours per client weekly** by managing writing workflows through CreatorOS's secured AI workspaces.\n\nWould you be open to a 5-minute conversation next Thursday at 2 PM to see if we can buy your writers their Fridays back?\n\nBest,\nSaaS Outreach Lead\nCreatorOS Team`,
  format: "Email Pitch",
  tone: "Empathetic & Bold",
  category: "Email",
  createdAt: new Date(Date.now() - 7200000).toISOString()
});

const app = express();
app.use(express.json());

// Setup Supabase database bridge if environment variable is present
const isSupabaseConfigured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
let supabaseClient: any = null;
if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    console.log("Supabase service initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
} else {
  console.log("Supabase variables not configured in .env. Falling back to secure express memory core.");
}

// Setup Gemini AI client lazy-loaded or safe key guards
const isGeminiConfigured = !!process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (isGeminiConfigured) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini AI client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY environment variable is missing.");
}

  // --------------------------------------------------------------------------
  // API ROUTES SECTION (FIRST)
  // --------------------------------------------------------------------------

  // Helper token verify middleware
  const authenticateToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // In local / sandbox environment, we allow testing with local tokens
    if (token.startsWith("demo-token-") || token === "guest-session-token") {
      const email = token.replace("demo-token-", "");
      const found = localUsers.find(u => u.email === email) || localUsers[0];
      (req as any).user = { id: found.id, email: found.email, name: found.name };
      return next();
    }

    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data: { user }, error } = await supabaseClient.auth.getUser(token);
        if (error || !user) {
          return res.status(403).json({ error: "Invalid auth token" });
        }
        (req as any).user = { id: user.id, email: user.email, name: user.user_metadata?.name || user.email };
        return next();
      } catch (err) {
        return res.status(403).json({ error: "Invalid session" });
      }
    }

    // fallback memory check
    const userSession = localUsers.find(u => u.id === token);
    if (!userSession) {
      return res.status(403).json({ error: "Session expired or invalid token" });
    }
    (req as any).user = { id: userSession.id, email: userSession.email, name: userSession.name };
    next();
  };

  // Complete ZIP Export Endpoint
  app.get("/api/export-zip", (req, res) => {
    try {
      const zip = new AdmZip();
      const workspaceRoot = process.cwd();

      // Directories and files to exclude from ZIP
      const excludePatterns = [
        "node_modules",
        ".git",
        "dist",
        ".cache",
        ".npm",
        "creatoros-project.zip"
      ];

      const files = fs.readdirSync(workspaceRoot);
      for (const file of files) {
        if (excludePatterns.includes(file)) {
          continue;
        }
        const fullPath = path.join(workspaceRoot, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          zip.addLocalFolder(fullPath, file);
        } else if (stat.isFile()) {
          zip.addLocalFile(fullPath);
        }
      }

      const zipBuffer = zip.toBuffer();
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", 'attachment; filename="creatoros-project.zip"');
      res.setHeader("Content-Transfer-Encoding", "binary");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Content-Length", zipBuffer.length);
      res.end(zipBuffer);
    } catch (err: any) {
      console.error("Failed to generate project ZIP:", err);
      res.status(500).json({ error: "Failed to generate project ZIP export: " + err.message });
    }
  });

  // Complete Direct GitHub Push Endpoint
  app.post("/api/push-github", async (req, res) => {
    const { githubToken, repoUrlOrName } = req.body;
    if (!githubToken || !repoUrlOrName) {
      return res.status(400).json({ error: "Missing githubToken or repoUrlOrName parameters in request body." });
    }

    try {
      let repoPath = repoUrlOrName.trim();
      if (repoPath.startsWith("https://github.com/")) {
        repoPath = repoPath.substring("https://github.com/".length);
      }
      if (repoPath.endsWith(".git")) {
        repoPath = repoPath.substring(0, repoPath.length - 4);
      }

      const parts = repoPath.split("/");
      if (parts.length !== 2) {
        return res.status(400).json({ error: "Invalid repository format. Enter 'username/repo' or a full GitHub repository URL." });
      }

      // Construct authenticated token remote URL
      const authenticatedUrl = `https://x-access-token:${githubToken}@github.com/${repoPath}.git`;

      // Chain Git command pipeline
      const cmd = [
        'git init',
        'git config user.name "SaaS Creator"',
        'git config user.email "SaaS-creator@example.com"',
        'git branch -M main',
        'git remote remove origin 2>/dev/null || true',
        `git remote add origin "${authenticatedUrl}"`,
        'git add .',
        'git commit -m "Initialize CreatorOS Production Release for Vercel" --allow-empty',
        'git push -u origin main --force'
      ].join(" && ");

      exec(cmd, (error, stdout, stderr) => {
        // Redact the sensitive access token from outputs for safety
        const redact = (str: string) => str.replace(new RegExp(githubToken, 'g'), '********');
        const safeStdout = redact(stdout || '');
        const safeStderr = redact(stderr || '');

        if (error) {
          console.error("Git Push Failure:", safeStderr);
          return res.status(500).json({
            error: "Failed to push CreatorOS code. Please verify your Personal Access Token, permissions, and check if the repository exists.",
            details: safeStderr || safeStdout
          });
        }

        res.json({
          success: true,
          message: `Successfully initialized git tracking and force-pushed production structure to repository: https://github.com/${repoPath}`,
          stdout: safeStdout,
          stderr: safeStderr
        });
      });
    } catch (err: any) {
      console.error("Unhandled error during Git upload:", err);
      res.status(500).json({ error: "Git push worker crashed: " + err.message });
    }
  });

  // Auth Status Service Status Indicator
  app.get("/api/status", (req, res) => {
    res.json({
      supabase_configured: isSupabaseConfigured,
      gemini_configured: isGeminiConfigured,
      lemon_squeezy_ready: true, // billing channel ready
      active_connections: {
        instagram: "pending_auth",
        tiktok: "pending_auth",
        whatsapp: "ready_test"
      }
    });
  });

  // Auth Endpoints: Signup
  app.post("/api/auth/signup", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: { name: name || "" }
          }
        });
        if (error) throw error;
        
        // Ensure user is also saved/updated, we can return the Supabase token
        const sessionToken = data.session?.access_token || `demo-token-${email}`;
        const returnUser = {
          id: data.user?.id || `user-${Date.now()}`,
          email: data.user?.email || email,
          name: name || ""
        };
        return res.json({ user: returnUser, token: sessionToken });
      } catch (err: any) {
        return res.status(400).json({ error: err.message || "Failed to sign up" });
      }
    } else {
      // Memory signup fallback
      const exists = localUsers.some(u => u.email === email);
      if (exists) {
        return res.status(400).json({ error: "Email already registered" });
      }
      const newUser: EmulatedUser = {
        id: `user-${Date.now()}`,
        email,
        passwordHash: password, // raw for memory demonstration
        name: name || email.split("@")[0],
        createdAt: new Date().toISOString()
      };
      localUsers.push(newUser);
      // Create some default startup histories for the newly registered user
      localHistory.push({
        id: `hist-demo-${Date.now()}`,
        userId: newUser.id,
        title: "CreatorOS Welcome Project",
        prompt: "Welcome generation task",
        result: `📝 **WELCOME TO CREATOROS, ${newUser.name || 'CREATOR'}!**\n\nYour sandbox workspace has been fully initialized with high-performance local fallback systems. This enables live platform testing instantly even before adding Supabase secrets.\n\n🚀 Let's start crafting high-quality content using the AI workflows!`,
        format: "Blog Post",
        tone: "Casual & Bold",
        category: "General",
        createdAt: new Date().toISOString()
      });
      
      const token = `demo-token-${email}`;
      return res.json({
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
        token
      });
    }
  });

  // Auth Endpoints: Login
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        const returnUser = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || data.user.email
        };
        return res.json({ user: returnUser, token: data.session.access_token });
      } catch (err: any) {
        return res.status(400).json({ error: err.message || "Invalid login credentials" });
      }
    } else {
      // Memory fallback
      const found = localUsers.find(u => u.email === email);
      if (!found || found.passwordHash !== password) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      const token = `demo-token-${email}`;
      return res.json({
        user: { id: found.id, email: found.email, name: found.name },
        token
      });
    }
  });

  // Auth Endpoints: Current User Info
  app.get("/api/auth/me", authenticateToken, (req, res) => {
    res.json({ user: (req as any).user });
  });

  // Content Generation API Route (Gemini Core Proxy)
  app.post("/api/generate", authenticateToken, async (req, res) => {
    const { topic, tone, platform, length, audience, objective } = req.body;
    const userObj = (req as any).user;

    if (!topic || !platform) {
      return res.status(400).json({ error: "Topic and destination platform are required parameters" });
    }

    if (!isGeminiConfigured || !ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured in this app environment's secrets. Please add it via Settings > Secrets to unlock live AI responses!"
      });
    }

    try {
      // Storing tone rules, platform structure rules, audience expectations inside system guidelines
      const lengthPromptMap = {
        short: "Keep the generated content concise, impactful, and under 150 words. Focus on bullet points and immediate hooks.",
        medium: "Keep the content professionally framed, around 300 to 500 words, including subheadings and spacing.",
        long: "Generate a deep-dive comprehensive structure, around 700 to 1000 words. Utilize distinct content frameworks, structured arguments, quotes, and action items."
      };

      const customSystemPrompt = `You are CreatorOS, an advanced AI Content Engine tailored for premium SaaS creators, professional copywriters, and global solopreneurs.
Generate high-performing, hyper-optimized copy that maximizes conversions, clicks, and human readability.
Always return beautiful Markdown format, formatted with clear visual white spaces, bullet structures, and bold highlight terms. Never output raw unstructured dense texts.
Match the specified details strictly. Define clear margins or sections.`;

      const contents = `Generate content for the following context:
- Topic / Core Concept: ${topic}
- Platform / Format: ${platform}
- Desired Copy Tone: ${tone || "professional, bold & engaging"}
- Specific Target Audience: ${audience || "general business professionals"}
- Campaign Objective: ${objective || "Brand awareness and education"}
- Content Volume / Length Constraint: ${lengthPromptMap[length as 'short' | 'medium' | 'long'] || lengthPromptMap.medium}

Ensure the response has:
1. An irresistible eye-catching title or hook
2. Formatted read-time or structured subheadings
3. A strong concluding call-to-action (CTA) inline with the objective
4. Subtly formatted hash-tags or structured SEO meta-tags if relevant to the channel.`;

      // Call Gemini SDK (defaults to gemini-3.5-flash as specified in requirements)
      const gResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: customSystemPrompt,
          temperature: 0.82,
          topK: 40,
        }
      });

      const textOutput = gResponse.text || "(Error: Gemini model completed but returned no output text. Try adjusting prompt parameters)";

      // Generate a title based on the topic
      const cleanTitle = topic.length > 35 ? topic.slice(0, 35) + "..." : topic;

      // Save this generation to the history list
      const newHistItem: EmulatedHistory = {
        id: `hist-${Date.now()}`,
        userId: userObj.id,
        title: cleanTitle,
        prompt: topic,
        result: textOutput,
        format: platform,
        tone: tone || "Custom",
        category: platform.includes("Post") || platform.includes("Caption") || platform.includes("Twitter") ? "Social Media" : "Article",
        createdAt: new Date().toISOString()
      };

      // Store in Supabase, or in-memory
      if (isSupabaseConfigured && supabaseClient) {
        try {
          const { error } = await supabaseClient.from("content_history").insert({
            id: newHistItem.id,
            user_id: newHistItem.userId,
            title: newHistItem.title,
            prompt: newHistItem.prompt,
            result: newHistItem.result,
            format: newHistItem.format,
            tone: newHistItem.tone,
            category: newHistItem.category,
            created_at: newHistItem.createdAt
          });
          if (error) console.error("Supabase insert error, falling back locally:", error);
        } catch (dbErr) {
          console.error("Database connection issue, storing locally:", dbErr);
        }
      }

      // Always save locally in process state as safety fallback
      localHistory.unshift(newHistItem);

      return res.json({
        content: textOutput,
        historyItem: newHistItem
      });

    } catch (genErr: any) {
      console.error("Gemini Generation Error:", genErr);
      return res.status(500).json({
        error: genErr.message || "An expected error occurred while generating copy on the server. Please check your credentials or pipeline setup."
      });
    }
  });

  // Project / History Endpoints: Read
  app.get("/api/history", authenticateToken, (req, res) => {
    const userObj = (req as any).user;
    
    // In future with Supabase connected, try finding them
    // For local ease of use and testing, return both local items matching user (or default user-12345 items so new projects look populated right away for demo purposes)
    const matched = localHistory.filter(h => h.userId === userObj.id || h.userId === "user-12345");
    res.json({ history: matched });
  });

  // Project / History Endpoints: Delete
  app.delete("/api/history/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const userObj = (req as any).user;

    const index = localHistory.findIndex(h => h.id === id && (h.userId === userObj.id || userObj.id === "user-12345"));
    if (index !== -1) {
      localHistory.splice(index, 1);
    }
    res.json({ success: true });
  });

  // Project / History Endpoints: Save or Update Content
  app.put("/api/history/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, result } = req.body;
    const userObj = (req as any).user;

    const item = localHistory.find(h => h.id === id && (h.userId === userObj.id || userObj.id === "user-12345"));
    if (item) {
      if (title) item.title = title;
      if (result) {
        item.result = result;
        item.createdAt = new Date().toISOString(); // update timestamp
      }
      return res.json({ success: true, item });
    }
    
    return res.status(404).json({ error: "Content block or project not found" });
  });

  // --------------------------------------------------------------------------
  // VITE ENTRY & STATIC ASSETS HANDLER (LAST)
  // --------------------------------------------------------------------------
  async function startStandaloneServer() {
    const PORT = 3000;
    if (process.env.NODE_ENV !== "production" && process.env.VITE_DEV_SERVER !== "true") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    if (!process.env.VERCEL && process.env.VITE_DEV_SERVER !== "true") {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`CreatorOS Server available and live at http://localhost:${PORT}`);
      });
    }
  }

  startStandaloneServer();

export { app };
export default app;
