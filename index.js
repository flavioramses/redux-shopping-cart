const { createStore, combineReducers } = Redux;

// REDUCERS

const productsReducer = (
  state = [
    {
      id: 0,
      name: "Fldsmdfr",
      price: 777,
      toggled: false,
    },
  ],
  action
) => {
  switch (action.type) {
    case "ADD_PRODUCT":
      return [
        ...state,
        {
          id: state[state.length - 1] ? state[state.length - 1].id + 1 : 0,
          name: action.name,
          price: action.price,
          toggled: false,
        },
      ];
    default:
      return state;
  }
};

const cartReducer = (state = { total: 0, products: [] }, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      if (state.products.includes(action.id)) return state;

      return {
        ...state,
        total: state.total + action.price,
        products: [...state.products, action.id],
      };
    default:
      return state;
  }
};

// STORE SETUP

const appStore = createStore(combineReducers({ productsReducer, cartReducer }));

// EVENT HANDLERS

const addItem = (id) => {
  const { price } = appStore
    .getState()
    .productsReducer.filter((product) => product.id == id)[0];

  appStore.dispatch({ type: "ADD_ITEM", id, price });
};

const addProduct = () => {
  const productName = document.getElementById("productName").value;
  const productPrice = document.getElementById("productPrice").value;

  appStore.dispatch({
    type: "ADD_PRODUCT",
    name: productName,
    price: productPrice,
  });
};

let showCart = false;

const showCartItems = (button) => {
  showCart = !showCart;
  button.style = `background-color: ${
    showCart ? "#764abc" : "transparent"
  }; color: ${showCart ? "white" : "#764abc"}`;
  render();
};

const render = () => {
  const { productsReducer: productsState, cartReducer: cartState } =
    appStore.getState();

  console.log(JSON.stringify(productsState));
  console.log(JSON.stringify(cartState));

  const productsList = (
    showCart
      ? cartState.products.map(
          (id) => productsState.filter((p) => p.id == id)[0]
        )
      : productsState
  )
    .map(
      ({ id, name, price }) =>
        `<div class="product"><span><h2>${name}</h2><h3 class="product-price">$${price}</h3></span><button onClick="addItem(${id})">+</button></div>`
    )
    .join("");

  document.getElementById("productsList").innerHTML = productsList;
};

appStore.subscribe(render);
render();
