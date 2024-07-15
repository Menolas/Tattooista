const Client = require('../models/Client');
const ArchivedClient = require('../models/ArchivedClient');
const fs = require('fs');
const mv = require('mv');
const generateFileRandomName = require('../utils/functions');
const ClientService = require('../services/clientService');

class clientsController {

  async getClients(req, res) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const gallery = req.query.gallery;
    const term = req.query.term;
    let clients = [];
    const results = {};

    try {
      let query = {};
      let searchConditions = [];

      if (term) {
        const regexSearch = { $regex: term, $options: 'i' };
        searchConditions = [
          { fullName: regexSearch },
          { 'contacts.email': regexSearch },
          { 'contacts.phone': regexSearch },
          { 'contacts.whatsapp': regexSearch },
          { 'contacts.messenger': regexSearch },
          { 'contacts.insta': regexSearch },
        ];
      }

      if (gallery === 'true') {
        query.gallery = { $exists: true, $not: { $size: 0 } };
      } else if (gallery === 'false') {
        query.$or = [{ gallery: { $exists: true, $size: 0 } }, { gallery: { $exists: false } }];
      }

      if (searchConditions.length > 0) {
        if (Object.keys(query).length > 0) {
          // If there's already a gallery condition in the query, combine using $and
          query = { $and: [ { $or: searchConditions }, query ] };
        } else {
          // If only term conditions are present, use $or
          query = { $or: searchConditions };
        }
      }

      clients = await Client.find(query).sort({createdAt: -1});

      results.resultCode = 0;
      results.totalCount = clients.length;
      results.clients = clients.slice(startIndex, endIndex);
      res.json(results);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async getArchivedClients(req, res) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let archivedClients = [];
    const term = req.query.term;
    const gallery = req.query.gallery;
    const results = {};

    try {
      let query = {};
      let searchConditions = [];

      if (term) {
        const regexSearch = { $regex: term, $options: 'i' };
        searchConditions = [
          { fullName: regexSearch },
          { 'contacts.email': regexSearch },
          { 'contacts.phone': regexSearch },
          { 'contacts.whatsapp': regexSearch },
          { 'contacts.messenger': regexSearch },
          { 'contacts.insta': regexSearch },
        ];
      }

      if (gallery === 'true') {
        query.gallery = { $exists: true, $not: { $size: 0 } };
      } else if (gallery === 'false') {
        query.$or = [{ gallery: { $exists: true, $size: 0 } }, { gallery: { $exists: false } }];
      }

      if (searchConditions.length > 0) {
        if (Object.keys(query).length > 0) {
          // If there's already a gallery condition in the query, combine using $and
          query = { $and: [ { $or: searchConditions }, query ] };
        } else {
          // If only term conditions are present, use $or
          query = { $or: searchConditions };
        }
      }

      archivedClients = await ArchivedClient.find(query).sort({createdAt: -1});

      results.resultCode = 0;
      results.totalCount = archivedClients.length;
      results.clients = archivedClients.slice(startIndex, endIndex);
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async getClient(req, res) {
    const results = {};
    try {
      results.client = res.client;
      results.resultCode = 0;
      res.send(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async addClient(req, res) {
    const results = {};
    try {
      const client = await ClientService.addClient(req.body);
      if (req.files && req.files.avatar) {
        const file = req.files.avatar;
        if(!file)  return res.json({error: 'Incorrect input name'});
        const newFileName = generateFileRandomName(file.name);
        await new Promise((resolve, reject) => {
          file.mv(`./uploads/clients/${client._id}/avatar/${newFileName}`, err => {
            if (err) {
                reject(err);
            } else {
              client.avatar = newFileName;
              resolve();
            }
          });
        });
      }
      results.resultCode = 0;
      results.client = await client.save();
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async editClient(req, res) {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }

    const results = {};

    try {
      const isClientUnique = await ClientService.editClient(req.params.id, req.body);
      if (isClientUnique) {
        res.client.fullName = req.body.fullName.trim();
        res.client.contacts.email = req.body.email;
        res.client.contacts.insta = req.body.insta?.trim();
        res.client.contacts.phone = req.body.phone;
        res.client.contacts.whatsapp = req.body.whatsapp;
        res.client.contacts.messenger = req.body.messenger?.trim();

        if (req.files && req.files.avatar) {
          if (res.client.avatar) {
            await fs.unlink(`./uploads/clients/${res.client._id}/avatar/${res.client.avatar}`, e => {
              if (e) console.log(e);
            });
          }

          const file = req.files.avatar;
          const newFileName = generateFileRandomName(file.name);
          await file.mv(`./uploads/clients/${res.client._id}/avatar/${newFileName}`, e => {
            if (e) console.log(e);
          });
          res.client.avatar = newFileName;
        }

      }

      results.client = await res.client.save();
      results.resultCode = 0;
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async updateClientGallery(req, res) {
    if (!req.files) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }

    let newGallery = [];
    const files = req.files;
    const results = {};
    try {
      for (let key in files) {

        const fileNewName = generateFileRandomName(files[key].name);
        newGallery.push(fileNewName);

        try {
          await files[key].mv(`./uploads/clients/${res.client._id}/doneTattooGallery/${fileNewName}`, e => {
            if (e) console.log(e);
          })

        } catch (error) {
          console.error('An error occurred during file move:', error);
          throw error; // Propagate the error upwards
        }
      }

      const oldData = [...res.client.gallery];
      res.client.gallery = [...oldData, ...newGallery];

      results.client = await res.client.save();
      results.resultCode = 0;
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async archiveClient(req, res) {
    const archivedClient = new ArchivedClient({
      fullName: res.client.fullName,
      contacts: {
        email: res.client.contacts.email,
        insta: res.client.contacts.insta,
        phone: res.client.contacts.phone,
        whatsapp: res.client.contacts.whatsapp,
        messenger: res.client.contacts.messenger
      },
      gallery: []
    });

    const results = {};

    try {
      const moveOperations = [];

      if (res.client.avatar) {
        const oldPath = `./uploads/clients/${res.client._id}/avatar/${res.client.avatar}`;
        const newPath = `./uploads/archivedClients/${archivedClient._id}/avatar/${res.client.avatar}`;
        if (fs.existsSync(oldPath)) {
          moveOperations.push(new Promise((resolve, reject) => {
            mv(oldPath, newPath, {mkdirp: true}, e => {
              if (e) {
                reject(e);
              } else {
                resolve();
              }
            });
          }));
          archivedClient.avatar = res.client.avatar;
        } else {
          console.log(`File not found: ${oldPath}`);
        }

      }

      if (res.client.gallery.length > 0) {
        archivedClient.gallery = [...res.client.gallery];
        res.client.gallery.forEach((item, index) => {
          const oldGalleryPath = `./uploads/clients/${res.client._id}/doneTattooGallery/${item}`;
          const newGalleryPath = `./uploads/archivedClients/${archivedClient._id}/doneTattooGallery/${item}`;
          if (fs.existsSync(oldGalleryPath)) {
            moveOperations.push(new Promise((resolve, reject) => {
              mv(oldGalleryPath, newGalleryPath, {mkdirp: true}, function (e) {
                if (e) reject(e);
                else resolve();
              });
            }));
          } else {
            console.log(`File not found: ${oldGalleryPath}`);
          }
        });
      }

      await Promise.all(moveOperations);

      await fs.rm(`./uploads/clients/${res.client._id}`, { recursive:true }, (err) => {
        if (err) {
          console.log(err);
          throw err;
        }
      });

      await res.client.remove();
      results.resultCode = 0;
      results.archivedClient = await archivedClient.save();
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async reactivateClient(req, res) {
    const results = {};

    try {
      const newClient = await ClientService.reactivateClient(res.client);
      const moveOperations = [];

      if (res.client.avatar) {
        const oldPath = `./uploads/archivedClients/${res.client._id}/avatar/${res.client.avatar}`;
        const newPath = `./uploads/clients/${newClient._id}/avatar/${res.client.avatar}`;
        moveOperations.push(new Promise((resolve, reject) => {
          mv(oldPath, newPath, { mkdirp: true }, function(e) {
            if (e) reject(e);
            else resolve();
          });
        }));
        newClient.avatar = res.client.avatar;
      }

      if (res.client.gallery.length > 0) {
        newClient.gallery = [...res.client.gallery];
        res.client.gallery.forEach((item, index) => {
          const oldGalleryPath = `./uploads/archivedClients/${res.client._id}/doneTattooGallery/${item}`;
          const newGalleryPath = `./uploads/clients/${newClient._id}/doneTattooGallery/${item}`;
          moveOperations.push(new Promise((resolve, reject) => {
            mv(oldGalleryPath, newGalleryPath, {mkdirp: true}, (err) => {
              if (err) reject(err);
              else resolve();
            });
          }));
        });
      }

      await Promise.all(moveOperations);

      await fs.rm(`./uploads/archivedClients/${res.client._id}`, { recursive:true }, (err) => {
        if (err) {
          console.log(err);
          throw err;
        }
      });
      await res.client.remove();
      results.resultCode = 0;
      results.client = await newClient.save();
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async deleteClient(req, res) {
    const results = {};

    try {
      if (res.client.avatar) {
        await fs.unlink(`./uploads/clients/${res.client._id}/avatar/${res.client.avatar}`, e => {
          if (e) console.log(e);
        });
        await fs.rm(`./uploads/clients/${res.client._id}/avatar`, { recursive:true }, e => {
          if (e) console.log(e);
        });
        if (res.client.gallery.length === 0) {
          await fs.rm(`./uploads/clients/${res.client._id}`, { recursive:true }, e => {
            if (e) console.log(e);
          });
        }
      }
      if (res.client.gallery.length !== 0) {
        await res.client.gallery.forEach((item) => {
            fs.unlink(`./uploads/clients/${res.client._id}/doneTattooGallery/${item}`, e => {
            if (e) console.log(e);
          });
        });
        await fs.rm(`./uploads/clients/${res.client._id}/doneTattooGallery`, { recursive:true }, e => {
          if (e) console.log(e);
        });
        await fs.rm(`./uploads/clients/${res.client._id}`, { recursive:true }, e => {
          if (e) console.log(e);
        });
      }
      await res.client.remove();
      results.resultCode = 0;
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(500).json(results);
    }
  }

  async deleteArchivedClient(req, res) {
    const results = {};

    try {
      if (res.client.avatar) {
        await fs.unlink(`./uploads/archivedClients/${res.client._id}/avatar/${res.client.avatar}`, e => {
          if (e) console.log(e);
        });
        await fs.rm(`./uploads/archivedClients/${res.client._id}/avatar`, { recursive:true }, e => {
          if (e) console.log(e);
        });
        if (res.client.gallery.length === 0) {
          await fs.rm(`./uploads/archivedClients/${res.client._id}`, { recursive:true }, e => {
            if (e) console.log(e);
          });
        }
      }
      if (res.client.gallery.length !== 0) {
        await res.client.gallery.forEach((item) => {
          fs.unlink(`./uploads/archivedClients/${res.client._id}/doneTattooGallery/${item}`, e => {
            if (e) console.log(e);
          });
        });
        await fs.rm(`./uploads/archivedClients/${res.client._id}/doneTattooGallery`, { recursive:true }, e => {
          if (e) console.log(e);
        });
        await fs.rm(`./uploads/archivedClients/${res.client._id}`, { recursive:true }, e => {
          if (e) console.log(e);
        });
      }
      await res.client.remove();
      results.resultCode = 0;
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(500).json(results);
    }
  }

  async deleteClientGalleryPicture(req, res) {
    const results = {};
    const picture = req.query.picture;

    try {
      await res.client.gallery.pull(picture);
      await fs.unlink(`./uploads/clients/${res.client._id}/doneTattooGallery/${picture}`, e => {
        if (e) console.log(e);
      });

      if (res.client.gallery.length === 0) {
        await fs.rm(`./uploads/clients/${res.client._id}/doneTattooGallery`, { recursive:true }, e => {
          if (e) console.log(e);
        });
      }
      results.resultCode = 0;
      results.client = await res.client.save();
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(500).json(results);
    }
  }
}

module.exports = new clientsController();
