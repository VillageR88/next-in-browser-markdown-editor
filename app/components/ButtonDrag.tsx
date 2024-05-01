const ButtonDrag = ({ func, alwaysVisible }: { func(arg: React.PointerEvent): void; alwaysVisible?: boolean }) => {
  return (
    <div
      className={`transition-colors hover:cursor-grab active:cursor-grabbing group-hover/group3:opacity-100 ${!alwaysVisible ? 'md:opacity-0' : ''}`}
      onPointerDown={(e) => {
        e.preventDefault();
        func(e);
      }}
      style={{ touchAction: 'none' }}
    >
      <svg
        className="transition-colors dark:fill-white"
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
      >
        <path d="M160-360v-80h640v80H160Zm0-160v-80h640v80H160Z" />
      </svg>
    </div>
  );
};

export default ButtonDrag;
