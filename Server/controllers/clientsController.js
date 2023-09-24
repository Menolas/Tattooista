const Client = require('../models/Client')
const ArchivedClient = require('../models/ArchivedClient')
const fs = require("fs")
const mv = require('mv')
const move = require('../utils/functions')

class clientsController {

  async getClients(req, res) {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    let clients = []
    const term = req.query.term
    const gallery = req.query.gallery
    const results = {}

    try {
      if (gallery === 'any' && !term) {
        clients = await Client.find().sort({createdAt: -1})
      } else if (gallery === '1' && !term) {
        clients = await Client.find({$where: "this.gallery.length > 0"}).sort({createdAt: -1})
      } else if (gallery === '0' && !term) {
        clients = await Client.find({$where: "this.gallery.length < 1"}).sort({createdAt: -1})
      } else if (gallery === 'any' && term) {
        clients = await Client.find({fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      } else if (gallery === '1' && term) {
        clients = await Client.find({$where: "this.gallery.length > 0", fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      } else if (gallery === '0' && term) {
        clients = await Client.find({$where: "this.gallery.length < 1", fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      }

      results.resultCode = 0
      results.totalCount = clients.length
      results.clients = clients.slice(startIndex, endIndex)
      res.json(results)
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }

  async getArchivedClients(req, res) {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    let archivedClients = []
    const term = req.query.term
    const gallery = req.query.gallery
    const results = {}

    try {
      if (gallery === 'any' && !term) {
        archivedClients = await ArchivedClient.find().sort({createdAt: -1})
      } else if (gallery === '1' && !term) {
        archivedClients = await ArchivedClient.find({$where: "this.gallery.length > 0"}).sort({createdAt: -1})
      } else if (gallery === '0' && !term) {
        archivedClients = await ArchivedClient.find({$where: "this.gallery.length < 1"}).sort({createdAt: -1})
      } else if (gallery === 'any' && term) {
        archivedClients = await ArchivedClient.find({fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      } else if (gallery === '1' && term) {
        archivedClients = await ArchivedClient.find({$where: "this.gallery.length > 0", fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      } else if (gallery === '0' && term) {
        archivedClients = await ArchivedClient.find({$where: "this.gallery.length < 1", fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      }

      results.resultCode = 0
      results.totalCount = archivedClients.length
      results.clients = archivedClients.slice(startIndex, endIndex)
      res.json(results)
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }

  async getClient(req, res) {
    res.send(res.client);
  }

  async editClient(req, res) {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }

    res.client.fullName = req.body.clientName
    res.client.contacts.email = req.body.email
    res.client.contacts.insta = req.body.insta
    res.client.contacts.phone = req.body.phone
    res.client.contacts.whatsapp = req.body.whatsapp
    res.client.contacts.messenger = req.body.messenger

    if (req.files && req.files.avatar) {
      if (res.client.avatar) {
        await fs.unlink(`./uploads/clients/${res.client._id}/avatar/${res.client.avatar}`, err => {
          if (err) console.log(err)
        })
      }

      const file = req.files.avatar
      const newFileName = encodeURI(Date.now() + '_' + file.name)
      await file.mv(`./uploads/clients/${res.client._id}/avatar/${newFileName}`, err => {
        if (err) console.log(err)
      })

      res.client.avatar = newFileName
    }

    const results = {}

    try {
      const updatedClient = await res.client.save()
      results.client = updatedClient
      results.resultCode = 0
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async updateClientGallery(req, res) {
    if (!req.body.gallery) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      })
    }

    let newGallery = []
    const files = req.files

    for (let key in files) {
      const fileNewName = encodeURI(Date.now() + '_' + files[key].name)
      newGallery.push(fileNewName)
      await files[key].mv(`./uploads/clients/${res.client._id}/doneTattooGallery/${fileNewName}`, err => {
        if (err) if (err) console.log(err)
      })
    }

    const oldData = [...res.client.gallery]
    res.client.gallery = [...oldData, ...newGallery]
    const results = {}

    try {
      const updatedClient = await res.client.save()
      results.client = updatedClient
      results.resultCode = 0
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async addClient(req, res) {
    const client = new Client({
      fullName: req.body.clientName,
      contacts: {
        email: req.body.email,
        insta: req.body.insta,
        phone: req.body.phone,
        whatsapp: req.body.whatsapp,
        messenger: req.body.messenger
      }
    })

    if (req.files && req.files.avatar) {
      const file = req.files.avatar
      if (!file) return res.json({error: 'Incorrect input name'})
      const newFileName = encodeURI(Date.now() + '_' + file.name)
      await file.mv(`./uploads/clients/${client._id}/avatar/${newFileName}`, err => {
        if (err) console.log(err)
      })

      client.avatar = newFileName
    }

    const results = {}

    try {
      let newClient = await client.save()
      results.resultCode = 0
      results.client = newClient
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
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
    })

    const results = {}

    try {
      if (res.client.avatar) {
        console.log("Client has an avatar!!!!!")
        const oldPath = `./uploads/clients/${res.client._id}/avatar/${res.client.avatar}`
        const newPath = `./uploads/archivedClients/${archivedClient._id}/avatar/${res.client.avatar}`
        mv(oldPath, newPath, { mkdirp: true }, function(err) {
          if (err) {
            console.log(err)
          } else {
            //console.log("Avatar Successfully moved!!!!!!!")
          }
        })
        archivedClient.avatar = res.client.avatar
      }

      if (res.client.gallery.length > 0) {
        archivedClient.gallery = [...res.client.gallery]
        await res.client.gallery.forEach((item, index) => {
          const oldGalleryPath = `./uploads/clients/${res.client._id}/doneTattooGallery/${item}`
          const newGalleryPath = `./uploads/archivedClients/${archivedClient._id}/doneTattooGallery/${item}`
          mv(oldGalleryPath, newGalleryPath, { mkdirp: true },function (err) {
            if (err) console.log(err)
          })
        })
        await archivedClient.save()
        console.log(archivedClient + "in cycle!!!!!!!!!!!!")
      }

      await archivedClient.save()
      console.log(archivedClient + "last!!!!!!!!!!!!")
      fs.rm(`./uploads/clients/${res.client._id}`, { recursive:true }, err => {
        if (err) console.log(err)
      })
      await res.client.remove()
      results.resultCode = 0
      results.client = archivedClient
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async reactivateClient(req, res) {
    const client = new Client({
      fullName: res.client.fullName,
      contacts: {
        email: res.client.contacts.email,
        insta: res.client.contacts.insta,
        phone: res.client.contacts.phone,
        whatsapp: res.client.contacts.whatsapp,
        messenger: res.client.contacts.messenger
      },
      gallery: []
    })

    const results = {}

    try {
      if (res.client.avatar) {
        console.log("Client has an avatar!!!!!")
        const oldPath = `./uploads/archivedClients/${res.client._id}/avatar/${res.client.avatar}`
        const newPath = `./uploads/clients/${client._id}/avatar/${res.client.avatar}`
        mv(oldPath, newPath, { mkdirp: true }, function(err) {
          if (err) {
            console.log(err)
          } else {
            //console.log("Avatar Successfully moved!!!!!!!")
          }
        })
        client.avatar = res.client.avatar
      }

      if (res.client.gallery.length > 0) {
        client.gallery = [...res.client.gallery]
        await res.client.gallery.forEach((item, index) => {
          const oldGalleryPath = `./uploads/archivedClients/${res.client._id}/doneTattooGallery/${item}`
          const newGalleryPath = `./uploads/clients/${client._id}/doneTattooGallery/${item}`
          mv(oldGalleryPath, newGalleryPath, { mkdirp: true },function (err) {
            if (err) console.log(err)
          })
        })
        await client.save()
        console.log(client + "in cycle!!!!!!!!!!!!")
      }

      await client.save()
      console.log(client + "last!!!!!!!!!!!!")
      fs.rm(`./uploads/archivedClients/${res.client._id}`, { recursive:true }, err => {
        if (err) console.log(err)
      })
      await res.client.remove()
      results.resultCode = 0
      results.client = client
      res.status(201).json(results)

    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }

  }

  async deleteClient(req, res) {
    const results = {}

    try {
      if (res.client.avatar) {
        await fs.unlink(`./uploads/clients/${res.client._id}/avatar/${res.client.avatar}`, err => {
          if (err) console.log(err)
        })
        await fs.rm(`./uploads/clients/${res.client._id}/avatar`, { recursive:true }, err => {
          if (err) console.log(err)
        })
        if (res.client.gallery.length == 0) {
          await fs.rm(`./uploads/clients/${res.client._id}`, { recursive:true }, err => {
            if (err) console.log(err)
          })
        }
      }
      if (res.client.gallery.length != 0) {
        await res.client.gallery.forEach((item) => {
            fs.unlink(`./uploads/clients/${res.client._id}/doneTattooGallery/${item}`, err => {
            if (err) console.log(err)
          })
        })
        await fs.rm(`./uploads/clients/${res.client._id}/doneTattooGallery`, { recursive:true }, err => {
          if (err) console.log(err)
        })
        await fs.rm(`./uploads/clients/${res.client._id}`, { recursive:true }, err => {
          if (err) console.log(err)
        })
      }
      await res.client.remove()
      results.resultCode = 0
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(500).json(results)
    }
  }

  async deleteArchivedClient(req, res) {
    const results = {}

    try {
      if (res.client.avatar) {
        await fs.unlink(`./uploads/archivedClients/${res.client._id}/avatar/${res.client.avatar}`, err => {
          if (err) console.log(err)
        })
        await fs.rm(`./uploads/archivedClients/${res.client._id}/avatar`, { recursive:true }, err => {
          if (err) console.log(err)
        })
        if (res.client.gallery.length == 0) {
          await fs.rm(`./uploads/archivedClients/${res.client._id}`, { recursive:true }, err => {
            if (err) console.log(err)
          })
        }
      }
      if (res.client.gallery.length != 0) {
        await res.client.gallery.forEach((item) => {
          fs.unlink(`./uploads/archivedClients/${res.client._id}/doneTattooGallery/${item}`, err => {
            if (err) console.log(err)
          })
        })
        await fs.rm(`./uploads/archivedClients/${res.client._id}/doneTattooGallery`, { recursive:true }, err => {
          if (err) console.log(err)
        })
        await fs.rm(`./uploads/archivedClients/${res.client._id}`, { recursive:true }, err => {
          if (err) console.log(err)
        })
      }
      await res.client.remove()
      results.resultCode = 0
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(500).json(results)
    }
  }

  async deleteClientGalleryPicture(req, res) {
    const results = {}
    const picture = req.query.picture

    try {
      await res.client.gallery.pull(picture)
      await fs.unlink(`./uploads/clients/${res.client._id}/doneTattooGallery/${picture}`, err => {
        if (err) console.log(err)
      })

      if (res.client.gallery.length == 0) {
        await fs.rm(`./uploads/clients/${res.client._id}/doneTattooGallery`, { recursive:true }, err => {
          if (err) console.log(err)
        })
      }
      results.resultCode = 0
      results.client = await res.client.save()
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(500).json(results)
    }
  }

}

module.exports = new clientsController();
