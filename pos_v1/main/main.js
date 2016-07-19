'use strict';
let printReceipt = (inputs) => {

  var allItems=loadAllItems();
  var promotions = loadPromotions();

  let cartItems = buildItems(inputs, allItems);

  let subTotalItems = buildCartItems(cartItems, promotions);

  let ReceiptItems = buildReceipt(subTotalItems);

  let PrintItems = buildPrint(ReceiptItems);

  console.log(PrintItems);

};

let buildPrint = (ReceiptItems) =>{

  let information = '***<没钱赚商店>收据***'+'\n';

  for(let infor of ReceiptItems.receipt){

    information +="名称：" + infor.cartItem.item.name + "，数量：" + infor.cartItem.count + infor.cartItem.item.unit
                + "，单价：" + infor.cartItem.item.price.toFixed(2) + "(元)" + "，小计：" + infor.subtotal.toFixed(2) + "(元)\n";

  }

  information +='----------------------' + '\n'
              + "总计：" + ReceiptItems.total.toFixed(2) + "(元)" +'\n'
              + "节省：" + ReceiptItems.savedTotal.toFixed(2) +"(元)\n"
              + '**********************';

  return information;
}





























let buildReceipt = (subtotalItems) =>{
  let total = 0;
  let savedTotal = 0;

  for(let item of subtotalItems){

    total += item.subtotal;
    savedTotal += item.saved;

  }
  return {receipt:subtotalItems,total,savedTotal};
};



let buildItems = (inputs,allItems) => {

  let cartItems = [];
  for (let input of inputs) {

    let splittedInput = input.split('-');
    let barcode = splittedInput[0];
    let count = parseFloat(splittedInput[1] || 1);
    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if (cartItem) {
      cartItem.count++;
    }
    else {
      let item = allItems.find(item => item.barcode === barcode);
      cartItems.push({item, count});
    }
  }

  return cartItems;
};



let buildCartItems = (cartItems, promotions) => {

  return cartItems.map(cartItem => {

    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {subtotal, saved} = discount(cartItem, promotionType);

    return {cartItem, subtotal, saved}
  })
};

let getPromotionType = (barcode, promotions) => {

  let promotion = promotions.find(promotion => promotion.barcodes.includes(barcode));

  return promotion ? promotion.type : '';
};

let discount = (cartItem, promotionType) => {

  let freeItemCount = 0;

  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    freeItemCount = parseInt(cartItem.count / 3);
  }

  let saved = freeItemCount * cartItem.item.price;
  let subtotal = cartItem.count * cartItem.item.price - saved;

  return {saved, subtotal};
};










