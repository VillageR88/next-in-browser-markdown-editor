import { useContext } from 'react';
import { SidebarContext } from '@/app/_providers/SidebarContext';

export default function ButtonSideBar() {
  const { showSidebar, setShowSidebar } = useContext(SidebarContext);

  return (
    <button
      type="button"
      onClick={() => {
        setShowSidebar((prev: boolean) => !prev);
      }}
      className="flex size-[56px] items-center justify-center bg-[#35393F] transition-colors hover:bg-[#E46643] md:size-[72px]"
    >
      {showSidebar ? (
        <svg className="scale-[75%] md:scale-100" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <g fill="#FFF" fillRule="evenodd">
            <path d="M2.1.686 23.315 21.9l-1.415 1.415L.686 2.1z" />
            <path d="M.686 21.9 21.9.685l1.415 1.415L2.1 23.314z" />
          </g>
        </svg>
      ) : (
        <svg className="scale-[75%] md:scale-100" width="30" height="18" xmlns="http://www.w3.org/2000/svg">
          <g fill="#FFF" fillRule="evenodd">
            <path d="M0 0h30v2H0zM0 8h30v2H0zM0 16h30v2H0z" />
          </g>
        </svg>
      )}
    </button>
  );
}
