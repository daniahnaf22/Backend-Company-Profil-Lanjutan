import Blogs from "../models/Blog.js";
import path from "path";
import multer from "multer";
import fs from "fs/promises";
import { fileURLToPath } from "url";

// Konfigurasi storage untuk menyimpan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ganti 'uploads' dengan direktori tempat Anda ingin menyimpan gambar
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Dapatkan ekstensi file
    const ext = path.extname(file.originalname);
    // Buat nama unik untuk setiap gambar yang diunggah
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + ext;
    cb(null, fileName);
  },
});

// Filter hanya menerima tipe gambar tertentu (misalnya JPEG, PNG)
const fileFilter = (req, file, cb) => {
  // Definisikan tipe ekstensi yang diperbolehkan
  const allowedExtensions = [".jpg", ".jpeg", ".png"];

  // Dapatkan ekstensi file yang diunggah
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("File type not supported. Only JPEG or PNG allowed."));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Mendapatkan semua data Blog
export async function getAllBlog(req, res) {
  try {
    const blogs = await Blogs.findAll();
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil data negara" });
  }
}

// Mendapatkan detail blogs berdasarkan ID
export async function getBlogById(req, res) {
  const { id } = req.params;

  try {
    const blogs = await Blogs.findByPk(id);
    if (!blogs) {
      return res.status(404).json({ message: "Negara tidak ditemukan" });
    }
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengambil data blogs" });
  }
}

// membuat data blog baru
export const createBlog = async (req, res) => {
  upload.single("img")(req, res, async (err) => {
    if (err) {
      res.status(400).json({ msg: "Error uploading image." });
      return;
    }
    const { title, desc, createBy } = req.body;
    try {
      // req.file berisi informasi tentang gambar yang diunggah
      const img = req.file ? req.file.filename : null;

      await Blogs.create({
        title: title,
        img: img,
        desc: desc,
        createBy: createBy,
      });

      res.status(201).json({ msg: "Blog Created Successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};

// memperbarui data blog berdasarkan ID
export const updateBlog = async (req, res) => {
  upload.single("img")(req, res, async (err) => {
    const { id } = req.params;
    const { title, desc, createBy } = req.body;

    try {
      const blog = await Blogs.findByPk(id);

      if (!blog) {
        return res.status(404).json({ msg: "Blog not found" });
      }

      // req.file berisi informasi tentang gambar yang diunggah
      const img = req.file ? req.file.filename : blog.img;

      await blog.update({
        title: title,
        img: img,
        desc: desc,
        createBy: createBy,
      });

      res.status(200).json({ msg: "Blog updated successfully" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};

// Menghapus data blog berdasarkan ID
export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blogs.findByPk(id);

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    // Hapus file gambar jika ada
    if (blog.img) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const imagePath = path.join(__dirname, "../uploads", blog.img);

      try {
        // Hapus file gambar dari 'uploads' directory
        await fs.unlink(imagePath);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

    await blog.destroy();

    res.status(200).json({ msg: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
