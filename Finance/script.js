/**
 * Customer place an order from the retailer for a jewelry
 * @param {org.acme.jewelry_network.CustomerPlaceOrder} customerPlaceOrder - the customerPlaceOrder transaction
 * @transaction
 */
async function customerPlaceOrder(orderRequest){
    console.log('customerPlaceOrder');
	console.log(orderRequest);
    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';
  	
	var timestamp =new Date();
  	orderRequest.customerOrderId = orderRequest.sell.getIdentifier()+(timestamp.getTime());
    const customerOrder = factory.newResource(namespace, 'CustomerOrder', orderRequest.customerOrderId);
    customerOrder.jewelryDetail = orderRequest.jewelryDetail;
    customerOrder.customerOrderStatus = 'PLACED';
    customerOrder.customer = factory.newRelationship(namespace,'Person',orderRequest.customer.getIdentifier());
     customerOrder.retailer = factory.newRelationship(namespace,'Retailer',orderRequest.sell.getIdentifier());

    // save the customer order
    const assetRegistry = await getAssetRegistry(customerOrder.getFullyQualifiedType());
    await assetRegistry.add(customerOrder);

     // emit the event
     const customerPlaceOrderEvent = factory.newEvent(namespace, 'CustomerPlaceOrderEvent');
     customerPlaceOrderEvent.customerOrderId = customerOrder.customerOrderId;
     customerPlaceOrderEvent.jewelryDetail = customerOrder.jewelryDetail;
     customerPlaceOrderEvent.customer = customerOrder.customer;
  customerPlaceOrderEvent.retailer = customerOrder.retailer;
     emit(customerPlaceOrderEvent);
}

/**
 * Retailer updates the status of a customerOrder
 * @param {org.acme.jewelry_network.RetailerUpdateOrderStatus} retailerUpdateOrderStatus - the RetailerUpdateOrderStatus transaction
 * @transaction
 */
async function retailerUpdateOrderStatus(updateOrderRequest){
    console.log('retailerUpdateOrderStatus');

    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';

    // get jewelry registry
    const jewelryRegistry = await getAssetRegistry(namespace+'.Jewelry');
    if (updateOrderRequest.customerOrderStatus === 'OWNER_ASSIGNED') {
        if (!updateOrderRequest.jin) {
            throw new Error('Value for JIN was expected');
        }
        if (!updateOrderRequest.retailerId) { //--√
            throw new Error('Value for retailerId was expected');
        }
        if (!updateOrderRequest.retailerSign) { //--√
            throw new Error('Value for retailerSign was expected');
        }
        if (!updateOrderRequest.manufacturerId) {
            throw new Error('Value for manufacturerId was expected');
        }

        if (!updateOrderRequest.manufacturerSign) {
            throw new Error('Value for manufacturerSign was expected');
            
        }
        if (!updateOrderRequest.mineFieldId) {
            throw new Error('Value for mineFieldId was expected');
            
        }
        if (!updateOrderRequest.mineFieldSign) {
            throw new Error('Value for mineFieldSign was expected');
            
        }

        // assign the owner of the jewelry to be the person who palced the order
        const jewelry = factory.newResource(namespace,'Jewelry', updateOrderRequest.jin);
        jewelry.jewelryStatus = 'SOLD_TO_CUSTOMER';
        jewelry.retailerId = updateOrderRequest.retailerId; //--√
        jewelry.retailerSign = updateOrderRequest.retailerSign; //--√
        jewelry.manufacturerId = updateOrderRequest.manufacturerId;
        jewelry.manufacturerSign = updateOrderRequest.manufacturerSign;
        jewelry.mineFieldId = updateOrderRequest.mineFieldId;
        jewelry.mineFieldSign = updateOrderRequest.mineFieldSign;
       
        jewelry.owner = factory.newRelationship(namespace, 'Person', updateOrderRequest.customerOrder.customer.username);
        await jewelryRegistry.add(jewelry);
    }

    // update the customer order
    const customerOrder = updateOrderRequest.customerOrder;
    customerOrder.customerOrderStatus = updateOrderRequest.customerOrderStatus;
   customerOrder.jin = updateOrderRequest.jin;
    customerOrder.retailerId=updateOrderRequest.retailerId;
    customerOrder.retailerSign=updateOrderRequest.retailerSign;
    customerOrder.mineFieldId = updateOrderRequest.mineFieldId;
    customerOrder.mineFieldSign = updateOrderRequest.mineFieldSign;
    customerOrder.manufacturerId = updateOrderRequest.manufacturerId;
    customerOrder.manufacturerSign = updateOrderRequest.manufacturerSign;
    const customerOrderResigstry = await getAssetRegistry(namespace + '.CustomerOrder');
    await customerOrderResigstry.update(customerOrder);

    // emit the event
    const retailerUpdateOrderStatusEvent = factory.newEvent(namespace, 'RetailerUpdateOrderStatusEvent');
    retailerUpdateOrderStatusEvent.customerOrderStatus = updateOrderRequest.customerOrder.customerOrderStatus;
    retailerUpdateOrderStatusEvent.customerOrder = updateOrderRequest.customerOrder;
    emit(retailerUpdateOrderStatusEvent);
}


/**
 * Retailer places an order from the manufacturer for a jewelry
 * @param {org.acme.jewelry_network.RetailerPlaceOrder} retailerPlaceOrder - the RetailerPlaceOrder transaction
 * @transaction
 */
async function retailerPlaceOrder(orderRequest){
    console.log('retailerPlaceOrder');
  	console.log(orderRequest);

    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';

  	var timestamp =new Date();
  	orderRequest.retailerOrderId = orderRequest.make.getIdentifier()+(timestamp.getTime());
    const retailerOrder = factory.newResource(namespace, 'RetailerOrder', orderRequest.retailerOrderId);
    retailerOrder.jewelryDetail = orderRequest.jewelryDetail;
    retailerOrder.retailerOrderStatus = 'PLACED';
   retailerOrder.customerOrderId=orderRequest.customerOrderId
  
    retailerOrder.retailer = factory.newRelationship(namespace, 'Retailer',orderRequest.retailer.getIdentifier());
  retailerOrder.manufacturer = factory.newRelationship(namespace, 'Manufacturer',orderRequest.make.getIdentifier());


    // save the retailer order
    const assetRegistry = await getAssetRegistry(retailerOrder.getFullyQualifiedType());
    await assetRegistry.add(retailerOrder);

    // emit the event
    const retailerPlaceOrderEvent = factory.newEvent(namespace, 'RetailerPlaceOrderEvent');
    retailerPlaceOrderEvent.retailerOrderId = retailerOrder.retailerOrderId;
  retailerPlaceOrderEvent.customerOrderId = retailerOrder.customerOrderId;
    retailerPlaceOrderEvent.jewelryDetail = retailerOrder.jewelryDetail;
    retailerPlaceOrderEvent.manufacturer = retailerOrder.manufacturer;
    retailerPlaceOrderEvent.retailer = retailerOrder.retailer;
    emit(retailerPlaceOrderEvent);
}

//-----------------------------------------------------------------------------------------add transaction of manufacturer place order

/**
 * Manufacturer places an order from the minefield for a jewelry
 * @param {org.acme.jewelry_network.ManufacturerPlaceOrder} manufacturerPlaceOrder - the ManufacturerPlaceOrder transaction
 * @transaction
 */
async function manufacturerPlaceOrder(orderRequest){
    console.log('manufacturerPlaceOrder');
  	console.log(orderRequest);

    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';

  	var timestamp =new Date();
  	orderRequest.manufacturerOrderId = orderRequest.mine.getIdentifier()+(timestamp.getTime());
    const manufacturerOrder = factory.newResource(namespace, 'ManufacturerOrder', orderRequest.manufacturerOrderId);
  manufacturerOrder.retailerOrderId=orderRequest.retailerOrderId;
    manufacturerOrder.jewelryDetail = orderRequest.jewelryDetail;
    manufacturerOrder.manufacturerOrderStatus = 'PLACED';
    //manufacturerOrder.manufacturer = factory.newRelationship(namespace, 'Company',orderRequest.manufacturer.getIdentifier());
    manufacturerOrder.manufacturer = factory.newRelationship(namespace, 'Manufacturer',orderRequest.manufacturer.getIdentifier());
  manufacturerOrder.minefield = factory.newRelationship(namespace, 'Minefield',orderRequest.mine.getIdentifier());

    // save the manufacturer order
    const assetRegistry = await getAssetRegistry(manufacturerOrder.getFullyQualifiedType());
    await assetRegistry.add(manufacturerOrder);

    // emit the event
    const manufacturerPlaceOrderEvent = factory.newEvent(namespace, 'ManufacturerPlaceOrderEvent');
    manufacturerPlaceOrderEvent.manufacturerOrderId = manufacturerOrder.manufacturerOrderId;
   manufacturerPlaceOrderEvent.retailerOrderId = manufacturerOrder.retailerOrderId;
    manufacturerPlaceOrderEvent.jewelryDetail = manufacturerOrder.jewelryDetail;
    manufacturerPlaceOrderEvent.manufacturer = manufacturerOrder.manufacturer;
  manufacturerPlaceOrderEvent.minefield = manufacturerOrder.minefield;
    emit(manufacturerPlaceOrderEvent);
}

/**
 * Manufacturer updates the status of a retailerOrder
 * @param {org.acme.jewelry_network.ManufacturerUpdateOrderStatus} manufacturerUpdateOrderStatus - the ManufacturerUpdateOrderStatus transaction
 * @transaction
 */
async function manufacturerUpdateOrderStatus(updateOrderRequest){
    console.log('manufacturerUpdateOrderStatus');

    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';

    const jewelryRegistry = await getAssetRegistry(namespace+'.Jewelry');
    if (updateOrderRequest.retailerOrderStatus === 'DELIVERED') {
        if (!updateOrderRequest.jin) {
            throw new Error('Value for JIN was expected');
        }

        if (!updateOrderRequest.manufacturerId) {
            throw new Error('Value for manufacturerId was expected');
        }

        if (!updateOrderRequest.manufacturerSign) {
            throw new Error('Value for manufacturerSign was expected');
            
        }
        if (!updateOrderRequest.mineFieldId) {
            throw new Error('Value for mineFieldId was expected');
            
        }
        if (!updateOrderRequest.mineFieldSign) {
            throw new Error('Value for mineFieldSign was expected');
            
        }
    }

    // update the order
    const retailerOrder = updateOrderRequest.retailerOrder;
    retailerOrder.retailerOrderStatus = updateOrderRequest.retailerOrderStatus;
    retailerOrder.jin = updateOrderRequest.jin;
    retailerOrder.mineFieldId = updateOrderRequest.mineFieldId;
    retailerOrder.mineFieldSign = updateOrderRequest.mineFieldSign;
    retailerOrder.manufacturerId = updateOrderRequest.manufacturerId;
    retailerOrder.manufacturerSign = updateOrderRequest.manufacturerSign;
    const retailerOrderRegistry = await getAssetRegistry(namespace + '.RetailerOrder');
    await retailerOrderRegistry.update(retailerOrder);

    // emit the event
    const manufacturerUpdateOrderStatusEvent = factory.newEvent(namespace, 'ManufacturerUpdateOrderStatusEvent');
    manufacturerUpdateOrderStatusEvent.retailerOrderStatus = updateOrderRequest.retailerOrder.retailerOrderStatus;
    manufacturerUpdateOrderStatusEvent.retailerOrder = updateOrderRequest.retailerOrder;
    emit(manufacturerUpdateOrderStatusEvent);
}

//-------------------------------------------------------------------------------------------- add trasaction of miner node √

/**
 * Minefield updates the status of a manufacturerOrder
 * @param {org.acme.jewelry_network.MinefieldUpdateOrderStatus} minefieldUpdateOrderStatus - MinefieldUpdateOrderStatus transaction
 * @transaction
 */
async function minefieldUpdateOrderStatus(updateOrderRequest){
    console.log('minefieldUpdateOrderStatus');

    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';

    const jewelryRegistry = await getAssetRegistry(namespace+'.Jewelry');
    if (updateOrderRequest.manufacturerOrderStatus === 'DELIVERED') {
        if (!updateOrderRequest.jin) {
            throw new Error('Value for JIN was expected');
        }

        if (!updateOrderRequest.mineFieldId) {
            throw new Error('Value for mineFieldId was expected');
        }

        if (!updateOrderRequest.mineFieldSign) { //-------------------------------- add Sign
            throw new Error('Value for mineFieldSign was expected');
        }

        
       
    }

    // update the order
    const manufacturerOrder = updateOrderRequest.manufacturerOrder;
    manufacturerOrder.manufacturerOrderStatus = updateOrderRequest.manufacturerOrderStatus;
    manufacturerOrder.jin=updateOrderRequest.jin;
    manufacturerOrder.mineFieldId=updateOrderRequest.mineFieldId;
    manufacturerOrder.mineFieldSign=updateOrderRequest.mineFieldSign;
    const manufacturerOrderRegistry = await getAssetRegistry(namespace + '.ManufacturerOrder');
    await manufacturerOrderRegistry.update(manufacturerOrder);

    // emit the event
    const minefieldUpdateOrderStatusEvent = factory.newEvent(namespace, 'MinefieldUpdateOrderStatusEvent');
    minefieldUpdateOrderStatusEvent.manufacturerOrderStatus = updateOrderRequest.manufacturerOrder.manufacturerOrderStatus;
    minefieldUpdateOrderStatusEvent.manufacturerOrder = updateOrderRequest.manufacturerOrder;
    emit(minefieldUpdateOrderStatusEvent);
}



