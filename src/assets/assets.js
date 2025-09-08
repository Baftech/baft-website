// Centralized asset paths for files served from Vite `public/` directory
// Usage: import { LOGO_PNG } from "../assets/assets"; then <img src={LOGO_PNG} />

// Images
import VIDEO_COM_PNG from "./video_com.png";
import SVG_SVG from "./SVG.svg";
import B_COIN_SVG from "./b-coin.svg";
import B_COIN_IMAGE_PNG from "./b-coin image.png";

import BAFT_CARD1_SVG from "./baft_card1.svg";
import BAFT_CARD2_SVG from "./baft_card2.svg";
import BAFT_CARD3_SVG from "./baft_card3.svg";
import BAFT_CARD4_SVG from "./baft_card4.svg";

import PAY_BILLS_SVG from "./pay-bills.svg";
import MANAGE_ACCOUNT_SVG from "./manage-account.svg";
import REWARDS_SVG from "./rewards.svg";
import SEAMLESS_PAYMENTS_SVG from "./seamless-payments.svg";

export const VIDEO_THUMBNAIL_JPG = "/video-thumbnail.jpg"; // ensure exists in public if used
export const PLAY_BUTTON_SVG = "/play-button.svg"; // ensure exists in public if used

import HAND_IPHONE_IMAGE_SVG from "./hand_iphone_image.svg";
import BAFT_PIC_PNG from "./baft_pic.png";
import LOGO_PNG from "./logo.png";
import LOGO1_PNG from "./logo1.png";
import SAFE_SEC_SVG from "./safe_sec.svg";
export const SECURE_COIN_PNG = "/secure_coin.png";
export const PRE_FOOTER_SVG = "/pre_footer.svg";
export const LAYER3_WRITE_SVG = "/layer3_write.svg";
export const VITE_SVG = "/vite.svg";

export const PROPERTY_IMAGE_PNG = "/Property 1=Image.png";
export const PROPERTY_VIBHA_PNG = "/Property 1=Vibha Harish (1).png";
export const PROPERTY_DION_PNG = "/Property 1=Dion Monteiro (1).png";
export const PROPERTY_SAKET_PNG = "/Property 1=Saket Borkar (1).png";

// Videos / GIFs (prefer importing from src for bundling)
import BAFT_VID_MP4 from "./BAFT Vid 2_1.mp4";
import BFAST_VIDEO_MP4 from "./bfast_video.mp4";
import BAFT_VIDEO_GIF from "./baft_video.gif";

// Re-export imported media as named exports
export { BAFT_VID_MP4, BFAST_VIDEO_MP4, BAFT_VIDEO_GIF, BAFT_PIC_PNG, HAND_IPHONE_IMAGE_SVG, SAFE_SEC_SVG, BAFT_CARD1_SVG, BAFT_CARD2_SVG, BAFT_CARD3_SVG, BAFT_CARD4_SVG, PAY_BILLS_SVG, MANAGE_ACCOUNT_SVG, REWARDS_SVG, SEAMLESS_PAYMENTS_SVG, SVG_SVG, B_COIN_SVG, B_COIN_IMAGE_PNG, VIDEO_COM_PNG, LOGO_PNG, LOGO1_PNG };

// Grouped exports
export const Assets = {
  VIDEO_COM_PNG,
  SVG_SVG,
  B_COIN_SVG,
  B_COIN_IMAGE_PNG,
  BAFT_CARD1_SVG,
  BAFT_CARD2_SVG,
  BAFT_CARD3_SVG,
  BAFT_CARD4_SVG,
  PAY_BILLS_SVG,
  MANAGE_ACCOUNT_SVG,
  REWARDS_SVG,
  SEAMLESS_PAYMENTS_SVG,
  VIDEO_THUMBNAIL_JPG,
  PLAY_BUTTON_SVG,
  HAND_IPHONE_IMAGE_SVG,
  BAFT_PIC_PNG,
  LOGO_PNG,
  LOGO1_PNG,
  SAFE_SEC_SVG,
  SECURE_COIN_PNG,
  PRE_FOOTER_SVG,
  LAYER3_WRITE_SVG,
  VITE_SVG,
  PROPERTY_IMAGE_PNG,
  PROPERTY_VIBHA_PNG,
  PROPERTY_DION_PNG,
  PROPERTY_SAKET_PNG,
  BAFT_VID_MP4,
  BFAST_VIDEO_MP4,
  BAFT_VIDEO_GIF,
};

export default Assets;


