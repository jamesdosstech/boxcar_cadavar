export const initialState = {
    isMenuOpen: false,
    isModalOpen: false,
    isMobile: window.innerWidth <= 768
}

export const reducer = (state, action) => {
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
};