import Logo from '../components/Logo';
import { useRouter } from 'next/navigation';
import { useContext, useRef } from 'react';
import { DataContext } from '@/app/_providers/DataContext';
import IconSave from '../components/IconSave';
import IconUndo from '../components/IconUndo';
import IconLogout from '../components/IconLogout';
import { handleSaveCollectionGroup, clearToken } from '@/app/lib/functionsServer';
import { newData, safeContext, createMouseLoader, startMouseLoader, stopMouseLoader } from '@/app/lib/functionsClient';
import { CollectionGroup } from '../lib/interfaces';
import ButtonTheme from '../components/ButtonTheme';
import { Routes } from '../routes';

const Navbar = ({ token, loading }: { token: string; loading: boolean }) => {
  const logoutRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { dataContext, initialDataContext, setDataContext } = useContext(DataContext);
  const checkSame = () => {
    return JSON.stringify(dataContext.collections) === JSON.stringify(initialDataContext.current.collections);
  };

  return (
    <nav className="flex w-full justify-center border-[#313131] px-6 py-4">
      <div className="flex size-full max-w-[90em] items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Logo alternate />
          <ButtonTheme />
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              const mouseLoader = createMouseLoader();
              startMouseLoader({ mouseLoader: mouseLoader });
              handleSaveCollectionGroup({
                data: newData({ data: safeContext({ dataContext: dataContext }) }),
                token: token,
              })
                .then((res) => {
                  if (res) {
                    initialDataContext.current = JSON.parse(
                      JSON.stringify(safeContext({ dataContext: dataContext })),
                    ) as CollectionGroup;
                    setDataContext(
                      JSON.parse(JSON.stringify(safeContext({ dataContext: dataContext }))) as CollectionGroup,
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
            className="button1 flex"
            type="button"
          >
            <span className="hidden md:block">Save</span>
            <IconSave />
          </button>
          <button
            onClick={() => {
              setDataContext(JSON.parse(JSON.stringify(initialDataContext.current)) as CollectionGroup);
            }}
            disabled={checkSame()}
            className="button1 flex"
            type="button"
          >
            <span className="hidden md:block">Revert</span>
            <IconUndo />
          </button>
          <button
            disabled={loading}
            ref={logoutRef}
            onClick={() => {
              if (logoutRef.current) logoutRef.current.disabled = true;
              const mouseLoader = createMouseLoader();
              startMouseLoader({ mouseLoader: mouseLoader });
              void handleSaveCollectionGroup({
                data: newData({ data: safeContext({ dataContext: dataContext }) }),
                token: token,
              });
              void clearToken().then(() => {
                stopMouseLoader({ mouseLoader: mouseLoader });
                router.push(Routes.login);
              });
            }}
            className="button2 group"
            type="submit"
          >
            <div className="button2Inner gap-[3px]">
              <span className="hidden md:block">Log out</span>
              <IconLogout />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
