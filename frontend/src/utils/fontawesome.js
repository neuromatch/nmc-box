import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAsterisk,
  faMinusSquare,
  faPlusSquare,
  faTimes,
  faCaretDown,
  faCaretUp,
  faCheckSquare,
  faStar,
  faBullhorn,
  faInfoCircle,
  faCaretLeft,
  faCaretRight,
  faEnvelope,
  faToolbox,
  faLaptopCode,
  faLightbulb,
  faHandshake,
  faUsers,
  faDollarSign,
  faExpandArrowsAlt,
  faCompressArrowsAlt,
  faEdit,
  faSync,
  faSearch,
  faShareAlt,
  faChalkboardTeacher,
  faSun,
  faMoon,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendarPlus, faClock, faUser } from '@fortawesome/free-regular-svg-icons';
import { faGoogle, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';

function initFontAwesome() {
  const icons = [
    faAsterisk,
    faPlusSquare,
    faMinusSquare,
    faTwitter,
    faTimes,
    faCaretDown,
    faCaretUp,
    faCheckSquare,
    faStar,
    faBullhorn,
    faInfoCircle,
    faCaretLeft,
    faCaretRight,
    faEnvelope,
    faToolbox,
    faLaptopCode,
    faLightbulb,
    faHandshake,
    faUsers,
    faDollarSign,
    faExpandArrowsAlt,
    faCompressArrowsAlt,
    faEdit,
    faSync,
    faSearch,
    faClock,
    faCalendarPlus,
    faShareAlt,
    faChalkboardTeacher,
    faGoogle,
    faUser,
    faYoutube,
    faSun,
    faMoon,
    faCog,
  ];

  library.add(...icons);
}

export { initFontAwesome };
export default Fa;
