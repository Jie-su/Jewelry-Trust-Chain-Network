//customer palce order to the retailers
async function customerPlaceOrder(orderRequest){
    console.log('customerPlaceOrder');

    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';

    const customerOrder = factory.newResource(namespace, 'CustomerOrder', orderRequest.customerOrderId);
    customerOrder.jewelryDetail = orderRequest.jewelryDetail;
    customerOrder.customerOrderStatus = 'PLACED';
    customerOrder.customer = factory.newRelationship(namespace,'Person',orderRequest.customer.getIdentifier());

    // save the customer order
    const assetRegistry = await getAssetRegistry(customerOrder.getFullyQualifiedType());
    await assetRegistry.add(customerOrder);

     // emit the event
     const customerPlaceOrderEvent = factory.newEvent(namespace, 'CustomerPlaceOrderEvent');
     customerPlaceOrderEvent.customerOrderId = customerOrder.customerOrderId;
     customerPlaceOrderEvent.jewelryDetail = customerOrder.jewelryDetail;
     customerPlaceOrderEvent.customer = customerOrder.customer;
     emit(customerPlaceOrderEvent);
}

async function retailerUpdateOrderStatus(updateOrderRequest){
    console.log('retailerUpdateOrderStatus');

    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';

    // get jewelry registry
    const jewelryRegistry = await getAssetRegistry(namespace+'.Jewelry');
    if (updateOrderRequest.orderStatus === 'OWNER_ASSIGNED') {
        if (!updateOrderRequest.jin) {
            throw new Error('Value for JIN was expected');
        }

        // assign the owner of the jewelry to be the person who palced the order
        const jewelry = await jewelryRegistry.get(updateOrderRequest.jin);
        jewelry.jewelryStatus = 'SOLD_TO_CUSTOMER';
        jewelry.owner = factory.newRelationship(namespace, 'Person', updateOrderRequest.customerOrder.customer.username);
        await jewelryRegistry.update(jewelry);
    }

    // update the customer order
    const customerOrder = updateOrderRequest.customerOrder;
    customerOrder.customerOrderStatus = updateOrderRequest.customerOrderStatus;
    const customerOrderResigstry = await getAssetRegistry(namespace + '.CustomerOrder');
    await customerOrderResigstry.update(customerOrder);

    // emit the event
    const retailerUpdateOrderStatusEvent = factory.newEvent(namespace, 'RetailerUpdateOrderStatusEvent');
    retailerUpdateOrderStatusEvent.customerOrderStatus = updateOrderRequest.customerOrder.customerOrderStatus;
    retailerUpdateOrderStatusEvent.customerOrder = updateOrderRequest.customerOrder;
    emit(retailerUpdateOrderStatusEvent);
}


// retailer order function
async function retailerPlaceOrder(orderRequest){
    console.log('retailerPlaceOrder');

    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';

    const retailerOrder = factory.newResource(namespace, 'RetailerOrder', orderRequet.retailerOrderId);
    retailerOrder.jewelryDetail = orderRequet.jewelryDetail;
    retailerOrder.retailerOrderStatus = 'PLACED';
    retailerOrder.retailer = factory.newRelationship(namespace, 'Company',orderRequest.retailer.getIdentifier());

    // save the retailer order
    const assetRegistry = await getAssetRegistry(customerOrder.getFullyQualifiedType());
    await assetRegistry.add(retailerOrder);

    // emit the event
    const retailerPlaceOrderEvent = factory.newEvent(namespace, 'RetailerPlaceOrderEvent');
    retailerPlaceOrderEvent.retailerOrderId = retailerOrder.retailerOrderId;
    retailerPlaceOrderEvent.jewelryDetail = retailerOrder.jewelryDetail;
    retailerPlaceOrderEvent.retailer = retailerOrder.retailer;
    emit(retailerPlaceOrderEvent);
}

async function manufacturerUpdateOrderStatus(updateOrderRequest){
    console.log('manufacturerUpdateOrderStatus');

    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';

    const jewelryRegistry = await getAssetRegistry(namespace+'.Jewelry');
    if (updateOrderRequest.retailerOrderStatus === 'JIN_ASSIGNED') {
        if (!updateOrderRequest.jin) {
            throw new Error('Value for JIN was expected');
        }

        if (!updateOrderRequest.mineFieldId) {
            throw new Error('Value for mineFieldId was expected');
        }

        // create a jewelry
        const jewelry = factory.newResource(namespace,'Jewelry', updateOrderRequest.jin);
        jewelry.jewelryDetail = updateOrderRequest.retailerOrder.jewelryDetail;
        jewelry.mineFieldId = updateOrderRequest.mineFieldId;
        jewelry.jewelryStatus = 'CERTIFICATION';
        await jewelryRegistry.add(jewelry)
    }

    // update the order
    const retailerOrder = updateOrderRequest.retailerOrder;
    retailerOrder.retailerOrderStatus = updateOrderRequest.retailerOrderStatus;
    const retailerOrderRegistry = await getAssetRegistry(namespace + '.RetailerOrder');
    await retailerOrderRegistry.update(retailerOrder);

    // emit the event
    const manufacturerUpdateOrderStatusEvent = factory.newEvent(namespace, 'ManufacturerUpdateOrderStatusEvent');
    manufacturerUpdateOrderStatusEvent.retailerOrderStatus = updateOrderRequest.retailerOrder.retailerOrderStatus;
    manufacturerUpdateOrderStatusEvent.retailerOrder = updateOrderRequest.retailerOrder;
    emit(manufacturerUpdateOrderStatusEvent);
}

async function setupDemo(){
    console.log('setipDemo');

    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';

    let customer = ['zhangsan','lisi','wangwu'];
    let manufacturers = [];
}