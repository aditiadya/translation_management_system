import db from '../../models/index.js';
const { AdminService, AdminAuth } = db;
import jwt from 'jsonwebtoken';

const getLoggedInUser = async (req) => {
  const token = req.cookies.accessToken;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await AdminAuth.findByPk(decoded.userId, {
      attributes: ['id', 'email']
    });
    return user;
  } catch (err) {
    return null;
  }
};

export const getAllServices = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });

    const services = await AdminService.findAll({ where: { email: user.email } });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single service by ID
export const getServiceById = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });

    const { id } = req.params;
    const service = await AdminService.findOne({ where: { id, email: user.email } });
    if (!service) return res.status(404).json({ message: 'Service not found' });

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addService = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });

    const { name, active_flag } = req.body;

    const newService = await AdminService.create({
      email: user.email,
      name,
      active_flag: active_flag ?? true
    });

    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });

    const { id } = req.params;
    const { name, active_flag } = req.body;

    const service = await AdminService.findOne({ where: { id, email: user.email } });
    if (!service) return res.status(404).json({ message: 'Service not found' });

    service.name = name ?? service.name;
    service.active_flag = active_flag ?? service.active_flag;

    await service.save();
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });

    const { id } = req.params;
    const service = await AdminService.findOne({ where: { id, email: user.email } });
    if (!service) return res.status(404).json({ message: 'Service not found' });

    await service.destroy();
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};