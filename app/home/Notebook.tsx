import { useContext } from 'react';
import { DataContext } from '@/app/_providers/DataContext';
import { Reorder, useDragControls } from 'framer-motion';
import { Collection, CollectionGroup, Note } from '../lib/interfaces';
import ButtonDrag from '../components/ButtonDrag';
import IconAdd from '../components/IconAdd';
import { handleSaveCollectionGroup } from '@/app/lib/functionsServer';
import { newData } from '@/app/lib/functionsClient';
import { RotatingLines } from 'react-loader-spinner';

const Item = ({
  collection,
  setCollectionPage,
  index,
  token,
}: {
  collection: Collection;
  setCollectionPage: React.Dispatch<React.SetStateAction<number | null>>;
  index: number;
  token: string;
}) => {
  const controls = useDragControls();
  const { dataContext, initialDataContext, setDataContext } = useContext(DataContext);
  const handleReorderItem = (newOrder: Note[], collectionId: number) => {
    setDataContext((prevState) => {
      const collectionIndex = prevState.collections.findIndex((collection) => collection.id === +collectionId);
      const newCollections = [...prevState.collections];
      newCollections[collectionIndex] = {
        ...newCollections[collectionIndex],
        notes: newOrder,
      };
      return {
        ...prevState,
        collections: newCollections,
      };
    });
  };

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={collection}
      key={collection.id}
      className="group/group2 flex select-none flex-col gap-[6px] rounded-[6px] border border-[#f5f5f5] bg-white px-3 py-4 drop-shadow-sm transition-colors dark:border-[#313131]  dark:bg-[#232323] "
    >
      <div className="flex justify-between px-1">
        <div className="flex max-w-[90%] items-center gap-3 pb-[8px]">
          <button
            onClick={() => {
              setCollectionPage(index + 1);
              void handleSaveCollectionGroup({
                data: newData({ data: JSON.parse(JSON.stringify(dataContext)) as CollectionGroup }),
                token: token,
              });
              initialDataContext.current = newData({ data: dataContext });
              setDataContext(newData({ data: dataContext }));
            }}
            className="truncate text-left text-[18px] font-bold transition-colors hover:text-[darkorange] dark:text-white dark:hover:text-[orange]"
          >
            {collection.title}
          </button>
        </div>
        <ButtonDrag
          alwaysVisible
          func={(e) => {
            controls.start(e);
          }}
        />
      </div>
      <Reorder.Group
        onReorder={(newOrder) => {
          handleReorderItem(newOrder, collection.id);
        }}
        key={collection.id}
        values={collection.notes}
        className="flex flex-col gap-2"
      >
        {collection.notes.map((note) => (
          <ItemsNested key={note.id} note={note} />
        ))}
      </Reorder.Group>
    </Reorder.Item>
  );
};
const ItemsNested = ({ note }: { note: Note }) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={note}
      key={note.id}
      className="group/group3 rounded-[6px] border border-[rgba(0,0,0,0.2)] bg-white p-[10px] transition-colors dark:border-[#1C1C1C] dark:bg-[#1C1C1C]"
    >
      <div className="flex justify-between pl-1 pr-2">
        <span className="font-semibold tracking-[-0.3px] transition-colors dark:font-normal dark:tracking-normal dark:text-white">
          {note.title}
        </span>
        {/*
          <ButtonDrag
            func={(e) => {
              controls.start(e);
            }}
          />
          */}
      </div>
    </Reorder.Item>
  );
};
const Notebook = ({
  setCollectionPage,
  loading,
  token,
}: {
  setCollectionPage: React.Dispatch<React.SetStateAction<number | null>>;
  loading: boolean;
  token: string;
}) => {
  const { dataContext, setDataContext } = useContext(DataContext);

  const handleReorderGroup = (newOrder: Collection[]) => {
    setDataContext((prevState) => ({
      ...prevState,
      collections: newOrder,
    }));
  };

  if (loading) {
    const value = localStorage.getItem('theme');
    const color = value === 'dark' ? 'orange' : 'darkorange';
    return (
      <div className="mt-24">
        <RotatingLines strokeColor={color} width="200" />
      </div>
    );
  }
  return (
    <div className="flex w-full max-w-4xl flex-col gap-6">
      <Reorder.Group
        className="flex w-full flex-col gap-8"
        values={dataContext.collections}
        onReorder={handleReorderGroup}
      >
        {dataContext.collections.map((collection, index) => {
          return (
            <Item
              token={token}
              index={index}
              key={collection.id}
              collection={collection}
              setCollectionPage={setCollectionPage}
            />
          );
        })}
      </Reorder.Group>
      <button
        className="button1 flex pt-px"
        onClick={() => {
          setDataContext((prevState) => {
            const newNotebook = [...prevState.collections];
            newNotebook.push({
              id: newNotebook.length + 1,
              title: 'New Collection',
              notes: [],
            });
            return {
              ...prevState,
              collections: newNotebook,
            };
          });
        }}
      >
        <IconAdd />
        <span className="hidden pl-1 pt-px md:block">Add</span>
      </button>
    </div>
  );
};
export default Notebook;
