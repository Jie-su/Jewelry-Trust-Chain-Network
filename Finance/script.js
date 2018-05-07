/**
 * Customer place an order from the retailer for a jewelry
 * @param {org.acme.jewelry_network.CustomerPlaceOrder} customerPlaceOrder - the customerPlaceOrder transaction
 * @transaction
 */
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


/**
 * Retailer places an order from the manufacturer for a jewelry
 * @param {org.acme.jewelry_network.RetailerPlaceOrder} retailerPlaceOrder - the RetailerPlaceOrder transaction
 * @transaction
 */
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

/**
 * Create the participants to use in the demo
 * @param {org.acme.jewelry_network.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(){
    console.log('setipDemo');

    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';

    let customer = ['Ricard','Jason','Bin','Alice','Amo','Vivian','Dexter','Poppy','Ryan','Lance','Takuya','Fay','Douglas','Autumn'];
    let retailers;
    let manufacturers = ['Nova','Saber','Archer'];
 

    const jewelry = {
        'Tiffany & Co.':{
            'Nova':{
                'Ring':[
                    {
                        'jin':'ea290d9f5a6833a65',
                        'mineFieldId':'South Africa mine field 1',
                        'DiamondWeight':'0.5ct',
                        'Material':'Gold',
                        'jewelryStatus':'SOLD_TO_CUSTOMER'
                    }
                ],
                'Necklace':[
                    {
                        'jin':'39fd242c2bbe80f11',
                        'mineFieldId':'South Africa mine field 2',
                        'DiamondWeight':'1ct',
                        'Material':'Silver',
                        'jewelryStatus':'SOLD_TO_CUSTOMER'
                    }
                ],
                'Bracelet':[
                    {
                        'jin':'835125e50bca37ca1',
                        'mineFieldId':'Mwadui mine field 2',
                        'DiamondWeight':'1ct',
                        'Material':'Silver',
                        'jewelryStatus':'SOLD_TO_CUSTOMER'
                    }
                ]
            }
        },
        'Pandora':{
            'Saber':{
                'Ring':[
                    {
                        'jin':'0812e6d8d486e0464',
                        'mineFieldId':'Zaire mine field 3',
                        'DiamondWeight':'0.5ct',
                        'Material':'Gold',
                        'jewelryStatus':'SOLD_TO_CUSTOMER'
                    }
                ],
                'Necklace':[
                    {
                        'jin':'c4aa418f26d4a0403',
                        'mineFieldId':'Zaire mine field 4',
                        'DiamondWeight':'3ct',
                        'Material':'Platinum',
                        'jewelryStatus':'SOLD_TO_CUSTOMER'
                    }
                ],
                'Bracelet':[
                    {
                        'jin':'7382fbfc083f696e5',
                        'mineFieldId':'South Africa mine field 1',
                        'DiamondWeight':'4ct',
                        'Material':'Platinum',
                        'jewelryStatus':'SOLD_TO_CUSTOMER'
                    }
                ]
            }
        },
        'Cartier':{
            'Archer':{
                'Ring':[
                    {
                        'jin':'01a9cd3f8f5db5ef7',
                        'mineFieldId':'Angola mine field 1',
                        'DiamondWeight':'10ct',
                        'Material':'Gold',
                        'jewelryStatus':'SOLD_TO_CUSTOMER'
                    }
                ],
                'Necklace':[
                    {
                        'jin':'97f305df4c2881e71',
                        'mineFieldId':'Angola mine field 2',
                        'DiamondWeight':'1.5ct',
                        'Material':'Gold',
                        'jewelryStatus':'SOLD_TO_CUSTOMER'
                    }
                ],
                'Bracelet':[
                    {
                        'jin':'af462063fb901d0e6',
                        'mineFieldId':'Angola mine field 3',
                        'DiamondWeight':'4ct',
                        'Material':'Gold',
                        'jewelryStatus':'SOLD_TO_CUSTOMER'
                    }
                ]
            }

        }

    };

    // convert array names of customer to be array of participant resources of type Person with identifier of that name
    customer = customer.map(function (person) {
        return factory.newResource(namespace,'Person',person);
    });

    // create array of Retailer particpant resources identified by the top level keys in jewelry const
    retailers = Object.keys(jewelry).map(function (retailer) {
        const retailerResource  = factory.newResource(namespace,'Retailer',retailer);
        retailerResource.companyName = retailer;
        return retailerResource;
    });

	for(var manufacturer in manufacturers){
    	const manufacturerResource  = factory.newResource(namespace,'Manufacturer',manufacturers[manufacturer]);
        manufacturerResource.companyName = manufacturers[manufacturer];
         // add the manufacturers
        const manufacturerRegistry = await getParticipantRegistry(namespace + '.Manufacturer');
        await manufacturerRegistry.add(manufacturerResource);
    }

    // create a Regulator participant resource
    const regulator = factory.newResource(namespace, 'Regulator', 'JDA');
    regulator.companyName = 'JDA';

    // add the regulator
    const regulatorRegistry = await getParticipantRegistry(namespace + '.Regulator');
    await regulatorRegistry.add(regulator);

    //add the retailers
    const retailerRegistry = await getParticipantRegistry(namespace + '.Retailer');
    await retailerRegistry.addAll(retailers);

    // add the person
    const personRegistry = await getParticipantRegistry(namespace + '.Person');
    await personRegistry.addAll(customer);

    // add the jewelry
    const jewelryRegistry = await getAssetRegistry(namespace + '.Jewelry');
    const jewelryResources = [];

    for(const retailer in jewelry) {
        for(const manufacturer in jewelry[retailer]){
            for(const model in jewelry[retailer][manufacturer]){
                const jewelrystemplateForModel = jewelry[retailer][manufacturer][model];
                jewelrystemplateForModel.forEach(function (jewelrystemplate){
                    const jewelry = factory.newResource(namespace,'Jewelry',jewelrystemplate.jin);
                    jewelry.owner = customer[jewelryResources.length+1];
                    jewelry.jewelryStatus = jewelrystemplate.jewelryStatus;
                    jewelry.mineFieldId = jewelrystemplate.mineFieldId;
                    jewelry.jewelryDetail = factory.newConcept(namespace,'JewelryDetail');
                    jewelry.jewelryDetail.make = factory.newResource(namespace,'Manufacturer',manufacturer);
                    jewelry.jewelryDetail.sell = factory.newResource(namespace,'Retailer',retailer);
                    jewelry.jewelryDetail.ModelType = model;
                    jewelry.jewelryDetail.DiamondWeight = jewelrystemplate.DiamondWeight;
                    jewelry.jewelryDetail.Material = jewelrystemplate.Material;
                    jewelryResources.push(jewelry);

                });
            }
        }
    }
    await jewelryRegistry.addAll(jewelryResources);

}