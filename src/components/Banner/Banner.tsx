import { ReactNode, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { XCircle } from "@phosphor-icons/react";
import ReactGA from "react-ga4";

import { useLocalStorage } from "@/hooks";

import "./Banner.css";

type BannerState = {
  seen: Record<string, boolean>;
};

type BannerProps = {
  id: string;
  children?: ReactNode;
  onClose?: (dispatch: Dispatch<SetStateAction<BannerState>>) => void;
};

const variants: Variants = {
  initial: { y: -120 },
  animate: { y: 0 },
  exit: { y: -120 },
};

const BANNER_STATE_KEY = "banner_state";

const Banner = ({ id, children, onClose }: BannerProps) => {
  const [
    {
      seen: { [id]: seen },
    },
    setBannerState,
  ] = useLocalStorage<BannerState>(BANNER_STATE_KEY, {
    seen: { [id]: false },
  });

  const handleClose = () => {
    ReactGA.event({
      category: "Banner",
      action: "Dismiss",
      label: id,
    });
    onClose
      ? onClose(setBannerState)
      : setBannerState((state) => ({
          ...state,
          seen: { ...state.seen, [id]: true },
        }));
  };

  return (
    <AnimatePresence initial={true}>
      {!seen && (
        <motion.aside
          className="card banner"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
        >
          <div className="banner-content">
            {children}
            <button
              tabIndex={0}
              className="banner-button"
              onClick={handleClose}
              onKeyDown={(e) => {
                e.key === "Enter" && handleClose();
              }}
            >
              <XCircle color="currentColor" size={28} weight="regular" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Banner;