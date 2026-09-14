/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1864144027")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != null",
    "listRule": "id = @request.auth.container.id",
    "viewRule": "id = @request.auth.container.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1864144027")

  // update collection data
  unmarshal({
    "createRule": null,
    "listRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
