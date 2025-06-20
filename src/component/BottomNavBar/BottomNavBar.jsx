import Link from "next/link";
import {
  FaHome,
  FaSearch,
  FaPlusCircle,
  FaHeart,
  FaUser,
} from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { IoIosContact } from "react-icons/io";
import { IoLink, IoStatsChartSharp } from "react-icons/io5";
import { SiCssdesignawards } from "react-icons/si";

export default function BottomNavBar(props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-[500px]:flex hidden bg-[#273549] px-4 py-2 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center w-full max-w-md mx-auto">
        <NavIcon
          href={`/home${props.refer ? `?refer=${props.refer}` : ``}`}
          icon={<FaHome size={25} />}
        /> 
        <NavIcon
          href={`/earning${props.refer ? `?refer=${props.refer}` : ``}`}
          icon={<IoStatsChartSharp size={20} />}
        />
        <NavIcon
          href={`/design${props.refer ? `?refer=${props.refer}` : ``}`}
          icon={<SiCssdesignawards size={20} />}
        />
        <NavIcon
          href={`/payment${props.refer ? `?refer=${props.refer}` : ``}`}
          icon={<FaSackDollar size={20} />}
        />
        <NavIcon
          href={`/contact${props.refer ? `?refer=${props.refer}` : ``}`}
          icon={<IoIosContact size={25} />}
        />
      </div>
    </nav>
  );
}

function NavIcon({ href, icon }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-white hover:text-[#00f2fe] transition duration-300"
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition">
        {icon}
      </div>
    </Link>
  );
}
