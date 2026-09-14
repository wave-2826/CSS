/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1864144027")

  // update field
  collection.fields.addAt(1, new Field({
    "help": "",
    "hidden": false,
    "id": "number1710084457",
    "max": 255,
    "min": 0,
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
})
