import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Sun,
  Moon,
  Languages,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-sm btn-ghost btn-circle">
                <Languages className="w-5 h-5" />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a onClick={() => changeLanguage("en")}>English</a>
                </li>
                <li>
                  <a onClick={() => changeLanguage("ru")}>Русский</a>
                </li>
              </ul>
            </div>
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">{t("Settings")}</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">{t("Profile")}</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">{t("Logout")}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
