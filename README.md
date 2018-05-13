# Jewelry Trust Chain Network

> This network tracks the manufacture of jewelry from an initial order request through to their completion by the retailer and manufacturer. A regulator is able to provide oversight throughout this whole process.

## Models within this business network

### Participants

`Person` `Manufacturer` `Retailer` `Minefield` `Regulator`

### Assets

`CustomerOrder` `Jewelry` `RetailerOrder` `ManufacturerOrder`

### Transactions

`CustomerPlaceOrder` `RetailerUpdateOrderStatus` `RetailerPlaceOrder` `ManufacturerUpdateOrderStatus` `RetailerUpdateOrderStatus` `MinefieldUpdateOrderStatus`

### Events

`CustomerPlaceOrderEvent` `RetailerUpdateOrderStatusEvent` `RetailerPlaceOrderEvent` `ManufacturerUpdateOrderStatusEvent` `ManufacturerPlaceOrder` `MinefieldUpdateOrderStatusEvent`

## Example use of this business network

A `Person` uses a retailer's application to order their desired jewelry. The application submits a `CustomerPlaceOrder` transaction which creates a new `CustomerOrder` asset containing the details of the jewelry the `Person` wishes to have made for them. The `Retailer` receives the `CustomerOrder` and submits a `RetailerPlaceOrder` transaction which creates a new `RetailerOrder` asset containing the details of the jewelry the `Person` wishes to have made for them. The `Retailer` also submits `RetailerUpdateOrderStatus` transaction to mark the changes of the `CustomerOrder` from "PLACED" to "SCHEDULED_FOR_MANUFACTURE". The `Manufacturer` receive the `RetailerOrder` and submit a `ManufacturerPlaceOrder` transaction with creates a new `ManufacturerOrder` asset containing the details of the jewelry the `Retailer` wishes to have made for them. After that, `Manufacturer` will submit a `ManufacturerUpdateOrderStatus` transaction which change the `RetailerOrder` from "PLACED" to "WAITING_FOR_DIAMOND". The `Minefield` receive the `ManufacturerOrder` and begin to find out the matched materials. Then it will submit a `MinefieldUpdateOrderStatus` transaction which mark the changes of the `ManufacturerOrder` from "PLACED" to "DELIVERED" (At this stage, it will assign the "JIN", "mineFieldId", "mineFieldSign" to the Diamond). After manufacture receive the materials, it will begin to build the jewelry and as it proceeds through stages of production by submits `ManufacturerUpdateOrderStatus` which mark the changes of the `RetailerOrder` from "WAITING_FOR_DIAMOND" to "MANUFACTURING" and then submits another one transaction which changes the `RetailerOrder` from "MANUFACTURING" to "DELIVERED"(it will assign the "manufacturerId", "manufacturerSign" to the Diamond). Then the retailer will receive the diamond ring and assign the owner of the diamond. After that it will deliver the diamond ring to the customer by update the `CustomerOrder` by submit a `RetailerUpdateOrderStatus` transaction which change the status of `CustomerOrder` from "SCHEDULED_FOR_MANUFACTURE" to "DELIVERED"(At this stage, it will assign the "retailerId", "retailerSign", "owner" to the diamond ring). Then the customer will receive the diamond ring and can check that in their jewelry asset.  
<!-- the `Manufacturer` submits `ManufacturerUpdateOrderStatus` transactions to mark the change in status for the `RetailerOrder` e.g.  updating the status from "PLACED" to "MANUFACTURING". Once the `Manufacturer` has completed production for the `RetailerOrder` they register the jewelry by submitting a `ManufacturerUpdateOrderStatus` transaction with the status "JIN_ASSIGNED" (also providing the "jin" and "mineFieldId" to register against) and a `Jewelry` asset is formally added to the registry using the details specified in the `RetailerOrder` . Once the jewelry is registered and delivered to the `Retailer` then the `Manufacturer` submits an `UpdateOrderStatus`transaction with a status of "DELIVERED". The `Retailer` submits a `retailerUpdateOrderStatus` transaction with the status "OWNER_ASSIGNED" at which point the customer field of the `Jewelry` is set to match the customer field of the `CustomerOrder` . The regulator would perform oversight over this whole process. -->


## Permissions in this business network for modelled participants

Within this network permissions are outlines for the participants outlining what they can and can't do. The rules in the permissions.acl file explicitly ALLOW participants to perform actions. Actions not written for a participant in that file are blocked.

### Regulator

`RegulatorAdminUser` \- Gives the regulator permission to perform ALL actions on ALL resources

### Retailer

`RetailerUpdateOrder` \- Allows a retailer to UPDATE a CustomerOrder asset's data only using a RetailerUpdateOrderStatus transaction. The retailer must also be specified as the _jewelryDetail.sell_ in the CustomerOrder asset.

`RetailerUpdateOrderStatus` \- Allows a retailer to CREATE and READ RetailerUpdateOrderStatus transactions that refer to a customerOrder that they are specified as the _jewelryDetail.sell_ in.

`RetailerReadOrder` - Allows a retailer to READ a CustomerOrder asset that they are specified as the *jewelryDetail.sell*  in.

`RetailerReadJewelries` - Allows a retailer to READ a Jewelry asset that they are specified as the _jewelryDetail.sell_ in.

### Manufacturer

`ManufacturerUpdateOrder` \- Allows a manufacturer to UPDATE a RetailerOrder asset's data only using a ManufacturerUpdateOrderStatus transaction. The manufacturer must also be specified as the _jewelryDetail.make_ in the RetailerOrder asset.

`ManufacturerUpdateOrderStatus` \- Allows a manufacturer to CREATE and READ ManufacturerUpdateOrderStatus transactions that refer to a retailerOrder that they are specified as the _jewelryDetail.make_ in.

`ManufacturerReadOrder` \- Allows a manufacturer to READ a RetailerOrder asset that they are specified as the _jewelryDetail.make_ in.

`ManufacturerCreateJewelries` \- Allows a manufacturer to CREATE a jewelry asset only using a ManufacturerUpdateOrderStatus transaction. The transaction must have a _retailerOrderStatus_ of JIN_ASSIGNED and the RetailerOrder asset have the manufacturer specified as the _jewelryDetail.make_.

`ManufacturerReadJewelries` \- Allows a manufacturer to READ a Jewelry asset that they are specified as the _jewelryDetail.make_ in.

### Person

`CustomerMakeOrder` \- Gives the person permission to CREATE a CustomerOrder asset only using a CustomerPlaceOrder transaction. The person must also be specified as the _customer_ in the CustomerOrder asset.

`CustomerPlaceOrder` \- Gives the person permission to CREATE and READ CustomerPlaceOrder transactions that refer to a customerOrder that they are specified as _customer_ in.

`CustomerReadOrder` \- Gives the person permission to READ a CustomerOrder asset that they are specified as the _customer_ in.
