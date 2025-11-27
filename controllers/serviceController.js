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
      serviceData.image = `/uploads/services/${req.file.filename}`;
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
      // Delete old image if exists
      if (service.image) {
        const oldImagePath = path.join(__dirname, '..', service.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      service.image = `/uploads/services/${req.file.filename}`;
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

    // Delete image if exists
    if (service.image) {
      const imagePath = path.join(__dirname, '..', service.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
