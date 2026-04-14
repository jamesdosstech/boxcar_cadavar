export type NavState = {
  isMenuOpen: boolean;
  isModalOpen: boolean;
  isMobile: boolean;
};

export type NavAction =
  | { type: "TOGGLE_MENU" }
  | { type: "TOGGLE_MODAL" }
  | { type: "SET_MOBILE"; payload: boolean };

export const initialState: NavState = {
  isMenuOpen: false,
  isModalOpen: false,
  isMobile: window.innerWidth <= 768,
};

export function reducer(state: NavState, action: NavAction): NavState {
  switch (action.type) {
    case "TOGGLE_MENU":
      return { ...state, isMenuOpen: !state.isMenuOpen };
    case "TOGGLE_MODAL":
      return { ...state, isModalOpen: !state.isModalOpen };
    case "SET_MOBILE":
      return { ...state, isMobile: action.payload };
    default:
      return state;
  }
}

