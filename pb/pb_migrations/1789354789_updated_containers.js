/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1864144027")

  // remove field
  collection.fields.removeById("relation1653163849")

  // update field
  collection.fields.addAt(1, new Field({
    "help": "",
    "hidden": false,
    "id": "number1710084457",
    "max": 5255,
    "min": 5000,
    "name": "id_ip",
    "onlyInt": true,
    "presentable": true,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1864144027")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "help": "",
    "hidden": false,
    "id": "relation1653163849",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "owner",
    "presentable": true,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(1, new Field({
    "help": "",
    "hidden": false,
    "id": "number1710084457",
    "max": 5255,
    "min": 5000,
    "name": "ct_id",
    "onlyInt": true,
    "presentable": true,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
