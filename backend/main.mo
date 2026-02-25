import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
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

  type UserProfile = {
    name : Text;
  };

  // Persistent stable maps initialization
  let products = Map.empty<Text, Product>();
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let orders = Map.empty<Principal, List.List<Order>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- User Profile Functions ---

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --- Product Management Functions ---

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can add products");
    };
    products.add(product.id, product);
  };

  public query func getProduct(id : Text) : async Product {
    switch (products.get(id)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  // --- Cart Management Functions ---

  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can add items to cart");
    };

    let product = switch (products.get(productId)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product not found") };
    };

    if (quantity == 0) { Runtime.trap("Cannot add zero quantity to cart") };
    if (product.quantity < quantity) { Runtime.trap("Insufficient stock") };

    let currentCart = switch (carts.get(caller)) {
      case (?cart) { cart };
      case (null) { List.empty<CartItem>() };
    };

    let cartItem : CartItem = {
      productId;
      quantity;
    };

    currentCart.add(cartItem);
    carts.add(caller, currentCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can modify their cart");
    };

    switch (carts.get(caller)) {
      case (?cart) {
        let filteredCart = cart.filter(func(item) { item.productId != productId });
        carts.add(caller, filteredCart);
      };
      case (null) { Runtime.trap("Cart is empty") };
    };
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view their cart");
    };

    switch (carts.get(caller)) {
      case (?cart) { cart.toArray() };
      case (null) { [] };
    };
  };

  // --- Order Management Functions ---

  public shared ({ caller }) func placeOrder() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can place orders");
    };

    let cart = switch (carts.get(caller)) {
      case (?cart) { cart };
      case (null) { Runtime.trap("Cart not found") };
    };

    let cartArray = cart.toArray();
    if (cartArray.size() == 0) { Runtime.trap("Cart is empty") };

    var total : Nat = 0;
    for (item in cartArray.vals()) {
      switch (products.get(item.productId)) {
        case (?product) { total += product.rate * item.quantity };
        case (null) { Runtime.trap("Product not found in cart") };
      };
    };

    let order : Order = {
      id = Time.now().toText();
      items = cartArray;
      total;
      timestamp = Time.now();
    };

    let existingOrders = switch (orders.get(caller)) {
      case (?o) { o };
      case (null) { List.empty<Order>() };
    };

    existingOrders.add(order);
    orders.add(caller, existingOrders);
    carts.remove(caller);
  };

  public query ({ caller }) func getOrderHistory() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view order history");
    };

    switch (orders.get(caller)) {
      case (?o) { o.toArray() };
      case (null) { [] };
    };
  };
};
