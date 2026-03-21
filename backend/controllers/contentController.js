const Content = require('../models/Content');

// 📥 Get Page Content (Public)
exports.getContent = async (req, res) => {
  try {
    const content = await Content.findOne({ page: req.params.page });
    res.json(content);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✏️ Create / Update Content (Admin)
exports.updateContent = async (req, res) => {
  try {
    const { page, sections } = req.body;

    let content = await Content.findOne({ page });

     if (req.file) {
      req.body.logo = `/uploads/${req.file.filename}`;
    }

    if (content) {
      content.sections = sections;
      if (req.body.logo) content.logo = req.body.logo;
      content.updatedBy = req.user.id;
    } else {
      content = new Content({
        page,
        sections,
        logo: req.body.logo,
        updatedBy: req.user.id
      });
    }

    await content.save();

    res.json(content);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};