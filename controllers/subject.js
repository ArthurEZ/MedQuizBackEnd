const Subject = require('../models/Subject')

exports.getSubjects = async (req, res, next) => {
    try {
        const subject = await Subject.find()
            .populate({
                path: "Category", 
                select: "category description"
            });

        if(subject.length <= 0) return res.status(404).json({ success: false, message: "there is no subject"});
        res.status(200).json({ success: true, count: subject.length, data: subject });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
}

exports.getSubject= async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id)
            .populate({
                path: "Category", 
                select: "category description"
            });
        if (!subject) return res.status(404).json({ success: false, message: "there is no ID of this subject" });

        res.status(200).json({ success: true, data: subject });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
}

exports.createSubject = async (req, res, next) => {
    try {
      if (req.user.role !== 'S-admin') {
        return res.status(403).json({
          success: false,
          message: "You have no permission to create Subject",
        });
      }
  
      const { name, description, year} = req.body;
      const NYear = Number(year);
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Image is required" });
      }
  
      const imgPath = `/public/${req.file.filename}`;
  
      const subject = await Subject.create({
        name,
        description,
        NYear,
        img: imgPath,
      });
  
      res.status(201).json({ success: true, data: subject });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  };
  

  exports.updateSubject = async (req, res, next) => {
    try {
      if (req.user.role !== 'S-admin') {
        return res.status(403).json({ success: false, message: "You have no permission to update this subject" });
      }
  
      const updateData = {
        name: req.body.name,
        description: req.body.description,
        year: req.body.year
      };
  
      if (req.file) {
        updateData.img = `/public/${req.file.filename}`;
      }
  
      const subject = await Subject.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });
  
      if (!subject) {
        return res.status(404).json({ success: false, message: "Subject not found" });
      }
  
      res.status(200).json({ success: true, data: subject });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: error.message });
    }
  };
  

exports.deleteSubject = async (req, res, next) => {
    try {
        if (req.user.role !== 'S-admin') {
            return res.status(403).json({ success: false, message: "You have no permission to delete this subject" });
        }

        const subject = await Subject.findByIdAndDelete(req.params.id);

        if (!subject) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};