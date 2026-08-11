import { NavLink } from "react-router-dom";
import {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import "./navigation.styles.scss";

import { UserContext } from "../../context/user/user.context";
import { useIsAdmin } from "../../hooks/useIsAdmin.hook";
import { useCart } from "../../context/shoppingCart/shoppingCart.context";

import AccountModal, { Step } from "./AccountModal/AccountModal";
import AccountButton from "./AccountButton/AccountButton";

import { initialState, reducer } from "./navReducer";
import CartModal from "../cart/Cart";

type NavItem = { title: string; link: string };

export default function Navigation() {
  const { currentUser } = useContext(UserContext);
  const { itemCount } = useCart();
  const isAdmin = useIsAdmin();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [step, setStep] = useState<Step>(currentUser ? 1 : 4);

  const navItems = useMemo<NavItem[]>(
    () => [
      { title: "Home", link: "/" },
      { title: "Showroom", link: "/showroom" },
      { title: "Blog", link: "/blog" },
      { title: "Shop", link: "/shop" },
      {
        title: "Gallery",
        link: "/gallery",
      },
    ],
    []
  );
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    const setHeightVar = () => {
      const height = navRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--nav-height", `${height}px`);
    };

    setHeightVar();

    const observer = new ResizeObserver(setHeightVar);
    observer.observe(navRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setStep(currentUser ? 1 : 4);
  }, [currentUser]);

  return (
    <>
      <nav ref={navRef} className="ds-nav" aria-label="Primary">
        <div className="ds-nav-scroll">
          {navItems.map(({ title, link }) => (
            <NavLink
              key={title}
              to={link}
              end={link === "/"}
              className={({ isActive }) =>
                `ds-nav-link ${isActive ? "is-active" : ""}`
              }
            >
              {title}
            </NavLink>
          ))}

          <button
            type="button"
            className="ds-nav-link ds-nav-button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open cart. ${itemCount} item${
              itemCount === 1 ? "" : "s"
            } in cart.`}
          >
            <span aria-hidden="true">
              <i className="bi bi-cart" /> {itemCount}
            </span>
            <span className="sr-only">
              Open cart ({itemCount} item{itemCount === 1 ? "" : "s"})
            </span>
          </button>

          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `ds-nav-link ${isActive ? "is-active" : ""}`
              }
            >
              Admin
            </NavLink>
          )}

          {currentUser ? (
            <AccountButton
              label={currentUser?.displayName || "User"}
              onClick={() => dispatch({ type: "TOGGLE_MODAL" })}
            />
          ) : (
            <button
              type="button"
              className="ds-nav-link ds-nav-button"
              onClick={() => dispatch({ type: "TOGGLE_MODAL" })}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
      {state.isModalOpen && (
        <AccountModal
          currentUser={currentUser}
          step={step}
          setStep={setStep}
          onClose={() => dispatch({ type: "TOGGLE_MODAL" })}
        />
      )}
      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
    </>
  );
}
