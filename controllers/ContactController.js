import Contact from "../models/Contact.js";

// Get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "Tidak berhasil mendapatkan message",
      });
  }
};

// Get contact by ID
export const getContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ msg: "Pesan tidak diterima" });
    }

    res.json(contact );
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "Tidak berhasil mendapatkan message",
      });
  }
};

// Create new contact
export const createContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({ msg: "Message berhasil dibuat", contact });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Tidak berhasil membuat message", error: error.message });
  }
};

// Update contact by ID
export const updateContact = async (req, res) => {
  const { name, email, subject, message } = req.body;
  const { id } = req.params;

  try {
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res
        .status(404)
        .json({ msg: "Tidak berhasil mendapatkan message" });
    }

    await contact.update({
      name,
      email,
      subject,
      message,
    });

    res.status(200).json({ msg: "Message berhasil diperbarui", data: contact });
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "Tidak berhasil memperbarui message",
        error: error.message,
      });
  }
};

// Delete contact by ID
export const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res
        .status(404)
        .json({ msg: "Tidak berhasil mendapatkan message" });
    }

    await contact.destroy();
    res.status(200).json({ msg: "Message berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Tidak berhasil menghapus message", error: error.message });
  }
};
