//customer palce order to the retailers
async function customerPlaceOrder(orderRequest){
    console.log('customerPlaceOrder')

    const factory = getFactory();
    const namespace = 'org.acme.jewelry_network';

    const customerOrder = factory.newResource(namespace, 'CustomerOrder', orderRequest.customerOrderId);
    customerOrder.jewelryDetail = orderRequest.jewelryDetail;
    customerOrder.customerOrderStatus = 'PLACED';
    customerOrder.customer = factory.newRelationship(namespace,'Person',orderRequest.customer.getIdentifier());

    //save the customer order
    const assetRegistry = await getAssetRegistry(customerOrder.getFullyQualifiedType());
    await assetRegistry.add(customerOrder);

     // emit the event
     const customerPlaceOrderEvent = factory.newEvent(namespace, 'CustomerPlaceOrderEvent');
     customerPlaceOrderEvent.customerOrderId = customerOrder.customerOrderId
     customerPlaceOrderEvent.jewelryDetail = customerOrder.jewelryDetail
     customerPlaceOrderEvent.customer = customerOrder.customer
     emit(customerPlaceOrderEvent)
}

async function retailerUpdateOrderStatus(updateOrderRequest){

}

async function retailerPlaceOrder(orderRequest){


}

async function manufacturerUpdateOrderStatus(updateOrderRequest){


}

async function setupDemo(){

}