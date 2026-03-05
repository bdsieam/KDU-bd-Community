import express from "express";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2/promise";
import path from "path";
import fs from "fs";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "kdu-community-secret-key";

// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "gateway01.ap-northeast-1.prod.aws.tidbcloud.com",
  port: parseInt(process.env.DB_PORT || "4000"),
  user: process.env.DB_USER || "4NnzZjyGfox86M3.root",
  password: process.env.DB_PASSWORD || "Y2YBbaqen16kNzjD",
  database: process.env.DB_NAME || "community_db",
  ssl: {
    rejectUnauthorized: false, // TiDB Cloud requires SSL, but we'll skip verification for now
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initializeDatabase() {
  try {
    // 1. Categories Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        icon VARCHAR(100),
        description TEXT
      )
    `);

    // 2. Posts Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category_id INT,
        title VARCHAR(255) NOT NULL,
        description LONGTEXT,
        location VARCHAR(255),
        contact VARCHAR(255),
        image_url TEXT,
        pdf_url TEXT,
        map_link TEXT,
        submitted_by VARCHAR(255),
        email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category_status (category_id, status),
        INDEX idx_status_created (status, created_at),
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )
    `);

    // Migrations for existing tables
    const migrations = [
      "ALTER TABLE posts MODIFY COLUMN description LONGTEXT",
      "ALTER TABLE posts ADD COLUMN IF NOT EXISTS views INT DEFAULT 0",
      "ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes INT DEFAULT 0",
      "ALTER TABLE posts ADD COLUMN IF NOT EXISTS pdf_url TEXT"
    ];

    for (const sql of migrations) {
      try {
        await pool.query(sql);
      } catch (e) {
        // Ignore errors if column already exists or other migration issues
      }
    }

    // 3. Admins & Moderators Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin'
      )
    `);

    // 4. Notices Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        active TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_active_created (active, created_at)
      )
    `);

    // 5. Comments Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'approved',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_post_id (post_id),
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
      )
    `);

    // Seed Categories if empty
    const [catRows] = await pool.query("SELECT COUNT(*) as count FROM categories");
    if ((catRows as any)[0].count === 0) {
      const categories = [
        ["Visa Information", "visa", "FileText", "D2, D10, extension process, and documents"],
        ["Part-time Work & Job Info", "jobs", "Briefcase", "Job opportunities and work permit info"],
        ["Bank Account Opening Guide", "banking", "CreditCard", "How to open and manage bank accounts"],
        ["Hospital & Clinic Information", "health", "Stethoscope", "Medical services and emergency care"],
        ["Famous Places in Korea", "places", "MapPin", "Must-visit attractions and landmarks"],
        ["Famous Restaurants", "restaurants", "Utensils", "Popular dining spots around KDU"],
        ["Halal Food Locations", "halal", "Beef", "Halal certified and Muslim-friendly food"],
        ["Prayer Time Information", "prayer", "Clock", "Local prayer times and mosque locations"],
        ["SIM Card & Mobile Services", "mobile", "Smartphone", "Getting a SIM card and mobile plans"],
        ["Transportation Guide", "transport", "Bus", "Subway, bus, and intercity travel"],
        ["Student Services", "student-services", "GraduationCap", "University resources and support"],
        ["Emergency Contacts", "emergency", "PhoneCall", "Police, fire, and university emergency numbers"]
      ];

      for (const cat of categories) {
        await pool.query("INSERT INTO categories (name, slug, icon, description) VALUES (?, ?, ?, ?)", cat);
      }
    }

    // Seed Emergency Posts if empty
    const [emergencyCatRows] = await pool.query("SELECT id FROM categories WHERE slug = 'emergency'");
    const emergencyCat = (emergencyCatRows as any)[0];
    if (emergencyCat) {
      const [postCountRows] = await pool.query("SELECT COUNT(*) as count FROM posts WHERE category_id = ?", [emergencyCat.id]);
      if ((postCountRows as any)[0].count === 0) {
        const emergencyPosts = [
          [
            emergencyCat.id, 
            "112 - Police (Crime & Accidents)", 
            "For reporting crimes, accidents, or theft. **How to call:** Dial 112. If you don't speak Korean, say 'English' or 'Bangla' immediately. They will connect you to an interpreter. Stay on the line.",
            "National", "112", "https://picsum.photos/seed/police/800/400", "https://www.google.com/maps/search/police+station", "Admin"
          ],
          [
            emergencyCat.id, 
            "119 - Fire & Ambulance", 
            "For fires or medical emergencies requiring an ambulance. **How to call:** Dial 119. Say 'Ambulance' or 'Fire'. They have a 24/7 translation service for over 20 languages. Give your location clearly if possible.",
            "National", "119", "https://picsum.photos/seed/ambulance/800/400", "https://www.google.com/maps/search/fire+station", "Admin"
          ],
          [
            emergencyCat.id, 
            "1330 - Korea Travel & Interpretation", 
            "The most important number for foreigners! They provide 24/7 3-way interpretation between you and any service (Police, Hospital, etc.). **How to call:** Dial 1330. Press 4 for English or follow prompts for other languages. They can help you explain your situation to anyone.",
            "National", "1330", "https://picsum.photos/seed/korea/800/400", "https://english.visitkorea.or.kr", "Admin"
          ],
          [
            emergencyCat.id, 
            "1339 - Medical Emergency Advice", 
            "For medical advice when it's not a life-threatening emergency but you need to find an open pharmacy or hospital. **How to call:** Dial 1339. They provide information on medical facilities that can treat foreigners.",
            "National", "1339", "https://picsum.photos/seed/medical/800/400", "https://www.e-gen.or.kr", "Admin"
          ],
          [
            emergencyCat.id, 
            "1345 - Immigration Contact Center", 
            "For all visa-related questions, alien registration, or immigration issues. **How to call:** Dial 1345. They have dedicated Bangla speakers available during business hours. Press '*' then '0' for an operator.",
            "National", "1345", "https://picsum.photos/seed/visa/800/400", "https://www.hikorea.go.kr", "Admin"
          ]
        ];

        for (const post of emergencyPosts) {
          await pool.query(`
            INSERT INTO posts (category_id, title, description, location, contact, image_url, map_link, submitted_by, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved')
          `, post);
        }
      }
    }

    // Seed Admin if empty (default: admin/admin123)
    const [adminRows] = await pool.query("SELECT COUNT(*) as count FROM admins");
    if ((adminRows as any)[0].count === 0) {
      const hashedPassword = bcrypt.hashSync("admin123", 10);
      await pool.query("INSERT INTO admins (username, password, name, role) VALUES (?, ?, ?, ?)", ["admin", hashedPassword, "Super Admin", "admin"]);
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

async function startServer() {
  await initializeDatabase();

  const app = express();
  app.use(express.json());

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Multer Configuration for File Uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext) || file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error("Only PDF and image files are allowed"));
      }
    },
  });

  // Serve static files from public/uploads
  app.use("/uploads", express.static(uploadsDir));

  // --- API Routes ---

  // File Upload Endpoint
  app.post("/api/upload", (req, res) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      } else if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    });
  });

  // Public: Get Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM categories");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Public: Get Active Notices
  app.get("/api/notices", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM notices WHERE active = 1 ORDER BY created_at DESC");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notices" });
    }
  });

  // Public: Get Approved Posts by Category
  app.get("/api/posts/category/:slug", async (req, res) => {
    const { slug } = req.params;
    try {
      const [rows] = await pool.query(`
        SELECT p.*, c.name as category_name 
        FROM posts p 
        JOIN categories c ON p.category_id = c.id 
        WHERE c.slug = ? AND p.status = 'approved'
        ORDER BY p.created_at DESC
      `, [slug]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  // Public: Submit Post
  app.post("/api/posts", async (req, res) => {
    const { category_id, title, description, location, contact, image_url, pdf_url, map_link, submitted_by, email } = req.body;
    try {
      await pool.query(`
        INSERT INTO posts (category_id, title, description, location, contact, image_url, pdf_url, map_link, submitted_by, email)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [category_id, title, description, location, contact, image_url, pdf_url, map_link, submitted_by, email]);
      res.status(201).json({ message: "Submission successful. Under review." });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit information." });
    }
  });

  // Public: Get Single Post (and increment views)
  app.get("/api/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("UPDATE posts SET views = views + 1 WHERE id = ?", [id]);
      const [rows] = await pool.query(`
        SELECT p.*, c.name as category_name 
        FROM posts p 
        JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ?
      `, [id]);
      const post = (rows as any)[0];
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  // Public: Like Post
  app.post("/api/posts/:id/like", async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("UPDATE posts SET likes = likes + 1 WHERE id = ?", [id]);
      res.json({ message: "Post liked" });
    } catch (error) {
      res.status(500).json({ error: "Failed to like post" });
    }
  });

  // Public: Get Comments for Post
  app.get("/api/posts/:id/comments", async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query("SELECT * FROM comments WHERE post_id = ? AND status = 'approved' ORDER BY created_at DESC", [id]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // Public: Add Comment
  app.post("/api/posts/:id/comments", async (req, res) => {
    const { id } = req.params;
    const { author_name, content } = req.body;
    try {
      await pool.query("INSERT INTO comments (post_id, author_name, content) VALUES (?, ?, ?)", [id, author_name, content]);
      res.status(201).json({ message: "Comment added" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add comment" });
    }
  });

  // Admin: Login
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const [rows] = await pool.query("SELECT * FROM admins WHERE username = ?", [username]);
      const admin = (rows as any)[0];

      if (admin && bcrypt.compareSync(password, admin.password)) {
        const token = jwt.sign({ 
          id: admin.id, 
          username: admin.username, 
          role: admin.role,
          name: admin.name 
        }, JWT_SECRET, { expiresIn: "24h" });
        res.json({ token, user: { username: admin.username, role: admin.role, name: admin.name } });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Middleware: Auth
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Admin: Get All Posts (with status)
  app.get("/api/admin/posts", authenticateToken, async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT p.*, c.name as category_name 
        FROM posts p 
        JOIN categories c ON p.category_id = c.id 
        ORDER BY p.created_at DESC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  // Admin: Update Post Status or Details
  app.patch("/api/admin/posts/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status, title, description, location, contact, map_link, category_id, image_url, pdf_url } = req.body;
    
    try {
      if (status && Object.keys(req.body).length === 1) {
        await pool.query("UPDATE posts SET status = ? WHERE id = ?", [status, id]);
      } else {
        await pool.query(`
          UPDATE posts 
          SET title = ?, description = ?, location = ?, contact = ?, map_link = ?, 
              category_id = ?, image_url = ?, pdf_url = ?
          WHERE id = ?
        `, [title, description, location, contact, map_link, category_id, image_url, pdf_url, id]);
      }
      res.json({ message: "Post updated successfully" });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  });

  // Admin: Delete Post
  app.delete("/api/admin/posts/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM posts WHERE id = ?", [id]);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // Admin: Bulk Delete Posts
  app.post("/api/admin/posts/bulk-delete", authenticateToken, async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No IDs provided" });
    }
    try {
      // Use the standard mysql2 way for IN clause with an array
      await pool.query("DELETE FROM posts WHERE id IN (?)", [ids]);
      res.json({ message: "Posts deleted successfully" });
    } catch (error) {
      console.error("Bulk delete error:", error);
      res.status(500).json({ error: "Failed to delete posts" });
    }
  });

  // Admin: Analytics
  app.get("/api/admin/analytics", authenticateToken, async (req, res) => {
    try {
      const [totalPostsRows] = await pool.query("SELECT COUNT(*) as count FROM posts");
      const [pendingPostsRows] = await pool.query("SELECT COUNT(*) as count FROM posts WHERE status = 'pending'");
      const [categoryCounts] = await pool.query(`
        SELECT c.name, COUNT(p.id) as count 
        FROM categories c 
        LEFT JOIN posts p ON c.id = p.category_id 
        GROUP BY c.id
      `);
      res.json({ 
        totalPosts: (totalPostsRows as any)[0].count, 
        pendingPosts: (pendingPostsRows as any)[0].count, 
        categoryCounts 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Admin: Get All Notices
  app.get("/api/admin/notices", authenticateToken, async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM notices ORDER BY created_at DESC");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notices" });
    }
  });

  // Admin: Create Notice
  app.post("/api/admin/notices", authenticateToken, async (req, res) => {
    const { content, type } = req.body;
    try {
      await pool.query("INSERT INTO notices (content, type) VALUES (?, ?)", [content, type || 'info']);
      res.status(201).json({ message: "Notice created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create notice" });
    }
  });

  // Admin: Delete Notice
  app.delete("/api/admin/notices/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM notices WHERE id = ?", [id]);
      res.json({ message: "Notice deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete notice" });
    }
  });

  // Admin: Toggle Notice Status
  app.patch("/api/admin/notices/:id/toggle", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("UPDATE notices SET active = 1 - active WHERE id = ?", [id]);
      res.json({ message: "Notice status toggled" });
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle notice" });
    }
  });

  // Admin: Create Category
  app.post("/api/admin/categories", authenticateToken, async (req, res) => {
    let { name, slug, icon, description } = req.body;
    if (!slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    try {
      await pool.query("INSERT INTO categories (name, slug, icon, description) VALUES (?, ?, ?, ?)", [name, slug, icon, description]);
      res.status(201).json({ message: "Category created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create category. Slug might be taken." });
    }
  });

  // Admin: Update Category
  app.patch("/api/admin/categories/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, slug, icon, description } = req.body;
    try {
      await pool.query("UPDATE categories SET name = ?, slug = ?, icon = ?, description = ? WHERE id = ?", [name, slug, icon, description, id]);
      res.json({ message: "Category updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update category." });
    }
  });

  // Admin: Delete Category
  app.delete("/api/admin/categories/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const [postsCountRows] = await pool.query("SELECT COUNT(*) as count FROM posts WHERE category_id = ?", [id]);
      if ((postsCountRows as any)[0].count > 0) {
        return res.status(400).json({ error: "Cannot delete category with existing posts." });
      }
      await pool.query("DELETE FROM categories WHERE id = ?", [id]);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category." });
    }
  });

  // Admin: Get All Comments
  app.get("/api/admin/comments", authenticateToken, async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT c.*, p.title as post_title 
        FROM comments c 
        JOIN posts p ON c.post_id = p.id 
        ORDER BY c.created_at DESC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // Admin: Update Comment Status
  app.patch("/api/admin/comments/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      await pool.query("UPDATE comments SET status = ? WHERE id = ?", [status, id]);
      res.json({ message: "Comment updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update comment" });
    }
  });

  // Admin: Delete Comment
  app.delete("/api/admin/comments/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM comments WHERE id = ?", [id]);
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  // Admin: Get All Moderators (Admin only)
  app.get("/api/admin/moderators", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    try {
      const [rows] = await pool.query("SELECT id, username, name, role FROM admins WHERE role = 'moderator'");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch moderators" });
    }
  });

  // Admin: Create Moderator (Admin only)
  app.post("/api/admin/moderators", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    const { username, password, name } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await pool.query("INSERT INTO admins (username, password, name, role) VALUES (?, ?, ?, 'moderator')", [username, hashedPassword, name]);
      res.status(201).json({ message: "Moderator created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create moderator. Username might be taken." });
    }
  });

  // Admin: Delete Moderator (Admin only)
  app.delete("/api/admin/moderators/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM admins WHERE id = ? AND role = 'moderator'", [id]);
      res.json({ message: "Moderator deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete moderator" });
    }
  });

  // Settings: Change Password
  app.post("/api/admin/change-password", authenticateToken, async (req: any, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
      const [rows] = await pool.query("SELECT * FROM admins WHERE id = ?", [req.user.id]);
      const admin = (rows as any)[0];

      if (admin && bcrypt.compareSync(currentPassword, admin.password)) {
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await pool.query("UPDATE admins SET password = ? WHERE id = ?", [hashedPassword, req.user.id]);
        res.json({ message: "Password updated successfully" });
      } else {
        res.status(400).json({ error: "Incorrect current password" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update password" });
    }
  });

  // --- Vite Setup ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
