# Jewelry Trust Chain Network

> This network tracks the manufacture of jewelry from an initial order request through to their completion by the retailer and manufacturer. A regulator is able to provide oversight throughout this whole process.

## Models within this business network

### Participants

`Person` `Manufacturer` `Regulator` `Retailer`

### Assets

`CustomerOrder` `Jewelry` `RetailerOrder`

### Transactions

`CustomerPlaceOrder` `RetailerUpdateOrderStatus` `SetupDemo` `RetailerPlaceOrder` `ManufacturerUpdateOrderStatus``RetailerUpdateOrderStatus`

### Events

`CustomerPlaceOrderEvent` `RetailerUpdateOrderStatusEvent` `RetailerPlaceOrderEvent` `ManufacturerUpdateOrderStatusEvent`

## Example use of this business network

A `Person`uses a retailer's application to order their desired jewelry. The application submits a`CustomerPlaceOrder` transaction which creates a new`CustomerOrder`asset containing the details of the jewelry the `Person` wishes to have made for them. The `Retailer`receives the `CustomerOrder` and submits a `RetailerPlaceOrder` transaction which creates a new `RetailerOrder` asset containing the details of the jewelry the `Person` wishes to have made for them. The `Retailer`also submits `RetailerUpdateOrderStatus`transaction to mark the changes of the `CustomerOrder`from "PLACED" to "SCHEDULED\_FOR\_MANUFACTURE". The `Manufacturer` begins work on the jewelry and as it proceeds through stages of production the `Manufacturer` submits `ManufacturerUpdateOrderStatus` transactions to mark the change in status for the `RetailerOrder` e.g. updating the status from "PLACED" to "MANUFACTURING". Once the `Manufacturer` has completed production for the `RetailerOrder` they register the jewelry by submitting a `ManufacturerUpdateOrderStatus` transaction with the status "JIN_ASSIGNED" (also providing the "jin" and "mineFieldId" to register against) and a `Jewelry` asset is formally added to the registry using the details specified in the `RetailerOrder` . Once the jewelry is registered and delivered to the `Retailer` then the `Manufacturer` submits an `UpdateOrderStatus`transaction with a status of "DELIVERED". The `Retailer` submits a `retailerUpdateOrderStatus` transaction with the status "OWNER_ASSIGNED" at which point the customer field of the `Jewelry` is set to match the customer field of the `CustomerOrder` . The regulator would perform oversight over this whole process.

## Testing this network within playground

Navigate to the **Test** tab and then submit a `SetupDemo` transaction:

```javascript
{
  "$class": "org.acme.jewelry_network.SetupDemo"
}
```

This will generate three `Manufacturer` participants, fourteen `Person` participants, three `Retailer` participants, a single `Regulator` participant and nine `Jewelry` assets.

Next order your Jewelry (an Tiffany & Co. brand Diamond Ring(0.5ct))) by submitting a CustomerPlaceOrder transaction:

```javascript
{
  "$class": "org.acme.jewelry_network.CustomerPlaceOrder",
  "customerOrderId": "TC201805070816",
  "jewelryDetail": {
    "$class": "org.acme.jewelry_network.JewelryDetail",
    "make": "resource:org.acme.jewelry_network.Manufacturer#Nova",
    "sell": "resource:org.acme.jewelry_network.Retailer#Tiffany & Co.",
    "ModelType": "Ring",
    "DiamondWeight": "0.5ct",
    "Material": "Gold"
  },
  "customer": "resource:org.acme.jewelry_network.Person#Bin"
}
```

This `CustomerPlaceOrder` transaction generates a new `CustomerOrder` asset in the registry and emits a `CustomerPlaceOrderEvent` event.

Now simulate the order being accepted by the retailer by submitting an `RetailerUpdateOrderStatus` transaction:

```javascript
{
  "$class": "org.acme.jewelry_network.RetailerUpdateOrderStatus",
  "customerOrderStatus": "PLACED",
  "customerOrder": "resource:org.acme.jewelry_network.CustomerOrder#TC201805070816"
}
```

This ``RetailerUpdateOrderStatus`` transaction updates the CustomerOrderStatus of the ``CustomerOrder`` with orderId "TC201805070816" in the asset registry and emits an `RetailerUpdateOrderStatusEvent` event.

Then, the retailer will place an RetailerOrder to the Manufacturer by submit a RetailerPlaceOrder transacation: 

```javascript
{
  "$class": "org.acme.jewelry_network.RetailerPlaceOrder",
  "retailerOrderId": "{
  "$class": "org.acme.jewelry_network.ManufacturerUpdateOrderStatus",
  "retailerOrderStatus": "MANUFACTURING",
  "retailerOrder": "resource:org.acme.jewelry_network.RetailerOrder#NV201805078365"
}",
  "jewelryDetail": {
    "$class": "org.acme.jewelry_network.JewelryDetail",
    "make": "resource:org.acme.jewelry_network.Manufacturer#Nova",
    "sell": "resource:org.acme.jewelry_network.Retailer#Tiffany & Co.",
    "ModelType": "Ring",
    "DiamondWeight": "0.5ct",
    "Material": "Gold"
  },
  "retailer": "resource:org.acme.jewelry_network.Retailer#Tiffany & Co."
}
```

This `RetailerPlaceOrder` transaction generates a new `RetailerOrder` asset in the registry and emits a `RetailerPlaceOrderEvent` event.

Now simulate the order being accept by the manufacturer by submitting an `ManufacturerUpdateOrderStatus` transaction:

```javascript
{
  "$class": "org.acme.jewelry_network.ManufacturerUpdateOrderStatus",
  "retailerOrderStatus": "PLACED",
  "retailerOrder": "resource:org.acme.jewelry_network.RetailerOrder#NV201805078365"
}
```

This `ManufacturerUpdateOrderStatus`updates the RetailerOrderStatus of the `RetailerOrder` with the orderId "NV201805078365" in the asset registry and emits an ``ManufacturerUpdateOrderStatusEvent` event.

After `Manufacturer` accept the order, Retailer will update the customer order status by submit an `RetailerUpdateOrderStatus` transaction:

```javascript
{
  "$class": "org.acme.jewelry_network.RetailerUpdateOrderStatus",
  "customerOrderStatus": "SCHEDULED_FOR_MANUFACTURE",
  "customerOrder": "resource:org.acme.jewelry_network.CustomerOrder#TC201805070816"
}
```

This `RetailerUpdateOrderStatus` transaction updates the CustomerOrderStatus of the `CustomerOrder` with orderId "TC201805070816" in the asset registry and emits an `RetailerUpdateOrderStatusEvent` event.

When Manufacturer begin to collect and begin to make the jewelry, it will update the Retailer order status by submit an ``ManufacturerUpdateOrderStatus`` transaction:

```javascript
{
  "$class": "org.acme.jewelry_network.ManufacturerUpdateOrderStatus",
  "retailerOrderStatus": "MANUFACTURING",
  "retailerOrder": "resource:org.acme.jewelry_network.RetailerOrder#NV201805078365"
}
```

This `ManufacturerUpdateOrderStatus`updates the RetailerOrderStatus of the `RetailerOrder` with the orderId "NV201805078365" in the asset registry and emits an `` `ManufacturerUpdateOrderStatusEvent`` event.

When Manufacturer finish the jewelry making precess, it will update the Retailer order status by submit an `ManufacturerUpdateOrderStatus` transaction:

```javascript
{
  "$class": "org.acme.jewelry_network.ManufacturerUpdateOrderStatus",
  "retailerOrderStatus": "JIN_ASSIGNED",
  "retailerOrder":                        "resource:org.acme.jewelry_network.RetailerOrder#NV201805078365",
    "jin":"tcnv2018050705goldsa1",
  "mineFieldId":"South Africa mine filed 1"
}
```

This ``ManufacturerUpdateOrderStatus`` transaction updates the RetailerOrderStatus of the `RetailerOrder` with orderId "NV201805078365" in the asset registry, create a new `Jewelry` based of that \`RetailerOrder\` in the asset registry and emits an `ManufacturerUpdateOrderStatusEvent` event. At this stage as the jewelry does not have an owner assigned to it, its status is declared as "CERTIFICATION".

After that, Manufacturer will delivier the jewelry to the retailer so that it will update the Retailer order status by submit an `ManufacturerUpdateOrderStatus` transaction:

```javascript
{
  "$class": "org.acme.jewelry_network.ManufacturerUpdateOrderStatus",
  "retailerOrderStatus": "DELIVERED",
  "retailerOrder": "resource:org.acme.jewelry_network.RetailerOrder#NV201805078365"
}
```

This `ManufacturerUpdateOrderStatus`updates the RetailerOrderStatus of the `RetailerOrder` with the orderId "NV201805078365" in the asset registry and emits an `` `ManufacturerUpdateOrderStatusEvent`` event.

After retailer receive the jewelry, it will update the customer order status by submit an `RetailerUpdateOrderStatus` transaction:

```javascript
{
  "$class": "org.acme.jewelry_network.RetailerUpdateOrderStatus",
  "customerOrderStatus": "OWNER_ASSIGNED",
  "customerOrder": "resource:org.acme.jewelry_network.CustomerOrder#TC201805070816",
    "jin":"tcnv2018050705goldsa1"
}
```

This ``RetailerUpdateOrderStatus`` transaction updates the CustomerOrderStatus of the `CustomerOrder` with orderId "TC201805070816" in the asset registry and emits an `ManufacturerUpdateOrderStatusEvent` event. At this stage as the jewelry will have an owner assigned to it, its status is declared as "SOLD\_TO\_CUSTOMER".

Finally complete the ordering process by marking the customer order as \`DELIVERED\` through submitting another `RetailerUpdateOrderStatus` transaction:

```javascript
{
  "$class": "org.acme.jewelry_network.RetailerUpdateOrderStatus",
  "customerOrderStatus": "DELIVERED",
  "customerOrder": "resource:org.acme.jewelry_network.CustomerOrder#TC201805070816"
}
```

This `RetailerUpdateOrderStatus`  transaction updates the orderStatus of the `CustomerOrder` with customerOrderId "TC201805070816" in the asset registry and emits an `RetailerUpdateOrderStatusEvent` event.

This Business Network definition has been used to create demo applications that simulate the scenario outlined above. You can find more detail on these at [Github](https://github.com/Jie-su/COMP6212)
