select * from items
inner join attribute_values on items.id = attribute_values.item_id
inner join attributes on attributes.id = attribute_values.attribute_id
where sku = 'SKU003';