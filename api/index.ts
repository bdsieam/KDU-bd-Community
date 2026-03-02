import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "kdu-community-secret-key";

// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "4000"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

// Helper to ensure database is ready (for serverless cold starts)
async function ensureDb() {
  try {
    // Check if categories table exists
    const [tables] = await pool.query("SHOW TABLES LIKE 'categories'");
    if ((tables as any).length === 0) {
      console.log("Database tables missing. Initializing...");
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
          description TEXT,
          location VARCHAR(255),
          contact VARCHAR(255),
          image_url TEXT,
          map_link TEXT,
          submitted_by VARCHAR(255),
          email VARCHAR(255),
          status VARCHAR(50) DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories (id)
        )
      `);

      // 3. Admins Table
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
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 5. Visitors Table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS visitors (
          visit_date DATE PRIMARY KEY,
          count INT DEFAULT 0
        )
      `);

      // Seed Categories
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
        await pool.query("INSERT IGNORE INTO categories (name, slug, icon, description) VALUES (?, ?, ?, ?)", cat);
      }

      // Seed Admin (admin/admin123)
      const hashedPassword = bcrypt.hashSync("admin123", 10);
      await pool.query("INSERT IGNORE INTO admins (username, password, name, role) VALUES (?, ?, ?, ?)", ["admin", hashedPassword, "Super Admin", "admin"]);
      console.log("Database initialized successfully");
    }
  } catch (err) {
    console.error("Database check/init failed:", err);
  }
}

// --- API Routes ---

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/api/categories", async (req, res) => {
  await ensureDb();
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    res.json(rows);
  } catch (error: any) {
    console.error("Categories fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/notices", async (req, res) => {
  await ensureDb();
  try {
    const [rows] = await pool.query("SELECT * FROM notices WHERE active = 1 ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

app.get("/api/visitors/today", async (req, res) => {
  await ensureDb();
  try {
    const today = new Date().toISOString().split('T')[0];
    // Upsert: increment count for today
    await pool.query(`
      INSERT INTO visitors (visit_date, count) 
      VALUES (?, 1) 
      ON DUPLICATE KEY UPDATE count = count + 1
    `, [today]);

    const [rows] = await pool.query("SELECT count FROM visitors WHERE visit_date = ?", [today]);
    res.json({ count: (rows as any)[0]?.count || 0 });
  } catch (error: any) {
    console.error("Visitor tracking error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/posts/category/:slug", async (req, res) => {
  const { slug } = req.params;
  await ensureDb();
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

app.post("/api/posts", async (req, res) => {
  const { category_id, title, description, location, contact, image_url, map_link, submitted_by, email } = req.body;
  await ensureDb();
  try {
    await pool.query(`
      INSERT INTO posts (category_id, title, description, location, contact, image_url, map_link, submitted_by, email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [category_id, title, description, location, contact, image_url, map_link, submitted_by, email]);
    res.status(201).json({ message: "Submission successful. Under review." });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit information." });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  await ensureDb();
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

app.patch("/api/admin/posts/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, title, description, location, contact, map_link } = req.body;
  try {
    if (status) {
      await pool.query("UPDATE posts SET status = ? WHERE id = ?", [status, id]);
    } else {
      await pool.query(`
        UPDATE posts 
        SET title = ?, description = ?, location = ?, contact = ?, map_link = ? 
        WHERE id = ?
      `, [title, description, location, contact, map_link, id]);
    }
    res.json({ message: "Post updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

app.delete("/api/admin/posts/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM posts WHERE id = ?", [id]);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

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

app.get("/api/admin/notices", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM notices ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

app.post("/api/admin/notices", authenticateToken, async (req, res) => {
  const { content, type } = req.body;
  try {
    await pool.query("INSERT INTO notices (content, type) VALUES (?, ?)", [content, type || 'info']);
    res.status(201).json({ message: "Notice created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create notice" });
  }
});

app.delete("/api/admin/notices/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM notices WHERE id = ?", [id]);
    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notice" });
  }
});

app.patch("/api/admin/notices/:id/toggle", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE notices SET active = 1 - active WHERE id = ?", [id]);
    res.json({ message: "Notice status toggled" });
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle notice" });
  }
});

app.post("/api/admin/categories", authenticateToken, async (req, res) => {
  const { name, slug, icon, description } = req.body;
  try {
    await pool.query("INSERT INTO categories (name, slug, icon, description) VALUES (?, ?, ?, ?)", [name, slug, icon, description]);
    res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.patch("/api/admin/categories/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, slug, icon, description } = req.body;
  try {
    await pool.query("UPDATE categories SET name = ?, slug = ?, icon = ?, description = ? WHERE id = ?", [name, slug, icon, description, id]);
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

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
    res.status(500).json({ error: "Failed to delete category" });
  }
});

app.get("/api/admin/moderators", authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
  try {
    const [rows] = await pool.query("SELECT id, username, name, role FROM admins WHERE role = 'moderator'");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch moderators" });
  }
});

app.post("/api/admin/moderators", authenticateToken, async (req: any, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: "Unauthorized" });
  const { username, password, name } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    await pool.query("INSERT INTO admins (username, password, name, role) VALUES (?, ?, ?, 'moderator')", [username, hashedPassword, name]);
    res.status(201).json({ message: "Moderator created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create moderator" });
  }
});

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

export default app;
