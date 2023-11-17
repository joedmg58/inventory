select inventory.id, items.sku, inventory.serial, items.name, items.description from inventory
inner join items on inventory.item_id = items.id
order by inventory.id;