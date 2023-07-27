import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Tidak berhasil mengambil data users" });
  }
};

export const register = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  if (password !== confPassword) {
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak cocok" });
  }

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.json({ msg: "Registrasi berhasil dijalankan" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Tidak berhasil register" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: "Email tidak ditemukan" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ msg: "Password yang diinputkan salah" });
    }

    const { id, name } = user;
    const accessToken = jwt.sign(
      { userId: id, name, email },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "15s",
      }
    );

    const refreshToken = jwt.sign(
      { userId: id, name, email },
      process.env.REFRESH_TOKEN,
      { expiresIn: "1d" }
    );

    await User.update({ refresh_token: refreshToken }, { where: { id } });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Tidak berhasil login" });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(204);
  }
  try {
    const user = await User.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!user) {
      return res.sendStatus(204);
    }

    await User.update(
      { refresh_token: null },
      { where: { refresh_token: refreshToken } }
    );

    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Tidak berhasil logout" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Users telah dihapus" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, password, confPassword, role } = req.body;

    if (password !== confPassword) {
      return res
        .status(400)
        .json({ msg: "Password dan konfirmasi password tidak cocok" });
    }

    // Cari pengguna berdasarkan id (primary key)
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
    }

    // Perbarui informasi pengguna
    user.name = name;
    user.email = email;
    user.role = role;

    // Periksa apakah password perlu diperbarui
    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Simpan perubahan pengguna
    await user.save();

    return res.json({ msg: "Informasi pengguna berhasil diperbarui" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Gagal memperbarui informasi pengguna" });
  }
};
