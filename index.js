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
        total: Number(state.total) + Number(action.price),
        products: [...state.products, action.id],
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        total: Number(state.total) - Number(action.price),
        products: state.products.filter((id) => id != action.id),
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

const removeItem = (id) => {
  const { price } = appStore
    .getState()
    .productsReducer.filter((product) => product.id == id)[0];

  appStore.dispatch({ type: "REMOVE_ITEM", id, price });
};

const addProduct = () => {
  const productName = document.getElementById("productName").value;
  const productPrice = document.getElementById("productPrice").value;

  if (
    productName &&
    productPrice &&
    !isNaN(productPrice) &&
    Number(productPrice) > 0
  ) {
    appStore.dispatch({
      type: "ADD_PRODUCT",
      name: productName,
      price: productPrice,
    });
  }
};

let showCart = false;

const showCartItems = (button) => {
  showCart = !showCart;
  button.style = `background-color: ${
    showCart ? "#764abc" : "transparent"
  }; color: ${showCart ? "white" : "#764abc"}`;
  button.childNodes[1].style = `background-color: ${
    showCart ? "white" : "#764abc"
  }; color: ${showCart ? "#764abc" : "white"}`;
  render();
};

const render = () => {
  const { productsReducer: productsState, cartReducer: cartState } =
    appStore.getState();

  const productsList = (
    showCart
      ? cartState.products.map(
          (id) => productsState.filter((p) => p.id == id)[0]
        )
      : productsState
  )
    .map(
      ({ id, name, price }) =>
        `<div class="product ${
          showCart && "product--inCart"
        }"><span><h2>${name}</h2><h3 class="product-price">$${price}</h3></span><button onClick="${
          showCart ? "removeItem" : "addItem"
        }(${id})">${showCart ? "-" : "+"}</button></div>`
    )
    .join("");

  document.getElementById("total_amount").innerHTML = cartState.total;

  document.getElementById("show-cart_counter").innerHTML =
    cartState.products.length;

  document.getElementById("productsList").innerHTML = productsList;
};

appStore.subscribe(render);
render();
