import { isValidObjectId } from 'mongoose';
import Client from '../models/Client.js';

async function resolveClient(id) {
  if (!id) return null;
  if (isValidObjectId(id)) {
    const c = await Client.findById(id).exec();
    if (c) return c;
  }
  return null;
}

export async function newForm(req, res) {
  res.render('clients/new');
}

export async function editForm(req, res) {
  const { id } = req.params;
  const client = await resolveClient(id);
  if (!client) return res.status(404).render('error', { message: 'Cliente no encontrado' });
  res.render('clients/edit', { client });
}

export async function create(req, res) {
  const { name, email, phone } = req.body;
  const client = new Client({ name, email, phone, createdAt: new Date() });
  await client.save();
  res.redirect(`/products?clientId=${client._id}`);
}

export async function list(req, res) {
  const clients = await Client.find().lean().exec();
  res.render('clients/list', { clients });
}

export async function clientsJSON(req, res) {
  const clients = await Client.find().lean().exec();
  res.json(clients);
}

export async function remove(req, res) {
  const { id } = req.params;
  const client = await resolveClient(id);
  if (!client) return res.status(404).render('error', { message: 'Cliente no encontrado' });
  await Client.deleteOne({ _id: client._id }).exec();
  res.redirect('/clients');
}

export async function update(req, res) {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const client = await resolveClient(id);
  if (!client) return res.status(404).render('error', { message: 'Cliente no encontrado' });
  client.name = name;
  client.email = email;
  client.phone = phone;
  await client.save();
  res.redirect('/clients');
}