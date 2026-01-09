const Service = require('../models/Service');
const fs = require('fs');
const path = require('path');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active services only
exports.getActiveServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching active services:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create service
exports.createService = async (req, res) => {
  try {
    const { title, description, order, isActive } = req.body;

    const serviceData = {
      title,
      description,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    };

    if (req.file) {
      serviceData.image = req.file.path;
    }

    const service = await Service.create(serviceData);
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { title, description, order, isActive } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.title = title || service.title;
    service.description = description || service.description;
    service.order = order !== undefined ? order : service.order;
    service.isActive = isActive !== undefined ? isActive : service.isActive;

    if (req.file) {
      // Delete old image if exists (local only)
      if (service.image && service.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(process.cwd(), service.image);
        if (fs.existsSync(oldImagePath)) {
          try { fs.unlinkSync(oldImagePath); } catch (e) { console.error('Local delete failed:', e); }
        }
      }
      service.image = req.file.path;
    }

    await service.save();
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Delete image if exists (local only)
    if (service.image && service.image.startsWith('/uploads/')) {
      const imagePath = path.join(process.cwd(), service.image);
      if (fs.existsSync(imagePath)) {
        try { fs.unlinkSync(imagePath); } catch (e) { console.error('Local delete failed:', e); }
      }
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
