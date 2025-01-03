
let ongoingorders=[];
let ongoingserverorders=[]


/**
 * Adds an order to the respective list (server or non-server).
 * @param {boolean} isServerOrder - Indicates whether the order is a server order.
 * @param {string} orderId - The ID of the order to add.
 * @returns {boolean} - Returns true if the order was successfully added, false if it already exists.
 */


function addOrder(isServerOrder, orderId) {
    // Determine the appropriate list based on the order type
    const orderList = isServerOrder ?ongoingserverorders : ongoingorders;
  
    // Check if the order ID already exists
    if (orderList.indexOf(orderId) === -1) {
      orderList.push(orderId); // Add the order ID
      console.log("Adding Order:", isServerOrder ? "Server" : "Client", orderId);
      return true; // Order successfully added
    } else {
      console.log("Order already exists:", orderId);
      return false; // Order already exists
    }
  }


  function getOngoingorders(isServerOrder=false)
  {
      return   isServerOrder ? ongoingserverorders : ongoingorders;

  }


  function removeOrder(isServerOrder, orderId) {
    // Determine the appropriate list based on the order type
    const orderList = isServerOrder ? ongoingserverorders : ongoingorders;
  
    console.log("Before Removing Order", orderId, orderList);
  
    // Find the index of the order
    const indexOngoingOrder = orderList.indexOf(orderId);
  
    // Remove the order if it exists
    if (indexOngoingOrder !== -1) {
      orderList.splice(indexOngoingOrder, 1); // Modify the array in place
      console.log(`Order removed: ${orderId}`);
      console.log("After Removing Order", orderList);
      return true; // Successfully removed
    } else {
      console.log(`Order not found: ${orderId}`);
      return false; // Order not found
    }
  }

  module.exports={getOngoingorders,addOrder,removeOrder}
  

