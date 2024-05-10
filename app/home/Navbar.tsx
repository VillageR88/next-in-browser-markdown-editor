import { useContext } from 'react';
import { DataContext } from '@/app/_providers/DataContext';
import IconSave from '../components/IconSave';
import { handleSaveCollectionGroup } from '@/app/lib/functionsServer';
import { safeContext, createMouseLoader, startMouseLoader, stopMouseLoader } from '@/app/lib/functionsClient';
import { DocumentJSON } from '../lib/interfaces';
import Image from 'next/image';
import logo from '@/public/FEMAssets/logo.svg';
import FileBox from '../components/FileBox';
import ButtonSideBar from '../components/ButtonSidebar';
import ButtonDelete from '../components/ButtonDelete';
const Navbar = ({ token }: { token: string }) => {
  const { dataContext, initialDataContext, setDataContext, selected, setSelected, setHandleAutosave } =
    useContext(DataContext);
  const checkSame = () => {
    return JSON.stringify(dataContext) === JSON.stringify(initialDataContext.current);
  };

  return (
    <nav className="flex min-h-[72px] w-full justify-center border-[#313131] bg-[#2B2D31] pr-4">
      <div className="flex size-full items-center justify-between">
        <div className="flex items-center">
          <ButtonSideBar />
          <Image className="ml-[24px]" src={logo as string} alt="logo" priority />
          <div className="ml-[29px] mr-[24px] h-[40px] w-px bg-[#5A6069]"></div>

          {selected !== null && <FileBox data={dataContext[selected]} isNavbarType />}
        </div>
        <div className="flex gap-[24px]">
          <ButtonDelete
            func={() => {
              if (selected === null) return;
              setDataContext((prev) => {
                const temp = [...prev];
                temp.splice(selected, 1);
                initialDataContext.current = temp;
                return temp;
              });
              setSelected(null);
              setHandleAutosave(true);
            }}
          />

          <button
            onClick={() => {
              const mouseLoader = createMouseLoader();
              startMouseLoader({ mouseLoader: mouseLoader });
              handleSaveCollectionGroup({
                data: JSON.stringify(safeContext({ dataContext: dataContext })),
                token: token,
              })
                .then((res) => {
                  if (res) {
                    initialDataContext.current = JSON.parse(
                      JSON.stringify(safeContext({ dataContext: dataContext })),
                    ) as DocumentJSON[];
                    setDataContext(
                      JSON.parse(JSON.stringify(safeContext({ dataContext: dataContext }))) as DocumentJSON[],
                    );
                  }
                  stopMouseLoader({ mouseLoader: mouseLoader });
                })
                .catch((error: unknown) => {
                  console.error(error);
                  stopMouseLoader({ mouseLoader: mouseLoader });
                });
            }}
            disabled={checkSame()}
            className="button2 group flex"
            type="button"
          >
            <div className="button2Inner gap-[3px] font-roboto">
              <IconSave />
              <span className="hidden md:block">Save Changes</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
