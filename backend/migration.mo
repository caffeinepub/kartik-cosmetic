import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  type OldProduct = {
    name : Text;
    category : Text;
    description : Text;
    rate : Nat;
    quantity : Nat;
    imgUrl : Text;
  };

  type OldLineItem = {
    productId : Text;
    quantity : Nat;
    rate : Nat;
    totalPrice : Nat;
  };

  type OldOrder = {
    lineItems : [OldLineItem];
    total : Nat;
    timestamp : Time.Time;
  };

  type OldActor = {
    products : Map.Map<Text, OldProduct>;
    carts : Map.Map<Principal, List.List<OldLineItem>>;
    orderHistories : Map.Map<Principal, List.List<OldOrder>>;
  };

  type Product = {
    id : Text;
    name : Text;
    category : Text;
    description : Text;
    rate : Nat;
    quantity : Nat;
    imageUrl : Text;
  };

  type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  type Order = {
    id : Text;
    items : [CartItem];
    total : Nat;
    timestamp : Time.Time;
  };

  type NewActor = {
    products : Map.Map<Text, Product>;
    carts : Map.Map<Principal, List.List<CartItem>>;
    orders : Map.Map<Principal, List.List<Order>>;
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Text, OldProduct, Product>(
      func(id, oldProduct) {
        {
          oldProduct with
          id;
          imageUrl = oldProduct.imgUrl;
        };
      }
    );

    let newCarts = old.carts.map<Principal, List.List<OldLineItem>, List.List<CartItem>>(
      func(owner, oldCart) {
        oldCart.map<OldLineItem, CartItem>(
          func(oldLineItem) {
            {
              productId = oldLineItem.productId;
              quantity = oldLineItem.quantity;
            };
          }
        );
      }
    );

    let newOrders = old.orderHistories.map<Principal, List.List<OldOrder>, List.List<Order>>(
      func(user, oldOrders) {
        oldOrders.map<OldOrder, Order>(
          func(oldOrder) {
            {
              id = oldOrder.timestamp.toText();
              items = oldOrder.lineItems.map<OldLineItem, CartItem>(
                func(oldLineItem) {
                  {
                    productId = oldLineItem.productId;
                    quantity = oldLineItem.quantity;
                  };
                }
              );
              total = oldOrder.total;
              timestamp = oldOrder.timestamp;
            };
          }
        );
      }
    );
    {
      old with
      products = newProducts;
      carts = newCarts;
      orders = newOrders;
    };
  };
};
