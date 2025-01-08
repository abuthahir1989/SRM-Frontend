import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type SizeDetail = {
  size_id: number;
  size: string;
  qty: number;
};

type Props = {
  sizes: SizeDetail[];
  setShow: Dispatch<SetStateAction<boolean>>;
  onDone: (data: SizeDetail[]) => void;
};

const SizePopOver: React.FC<Props> = ({ sizes, setShow, onDone }) => {
  const [data, setData] = useState<SizeDetail[]>(sizes);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) =>
      prev.map((i) => {
        if (i.size === name) {
          return {
            ...i,
            qty: +value,
          };
        }
        return i;
      })
    );
  };

  useEffect(() => {
    if (popoverRef.current) popoverRef.current.focus();
  }, []);

  return (
    <div className="popover" ref={popoverRef}>
      <div className="popover__header">
        <h5>Available Sizes</h5>
        <svg className="close-icon" onClick={() => setShow(false)}>
          <use xlinkHref="/icons/sprite.svg#icon-cross"></use>
        </svg>
      </div>
      <div className="popover__body">
        {sizes.map((size, index) => (
          <div className="row mt-sm" key={index}>
            <div className="col center">{size.size}</div>
            <div className="col center">{"=>"}</div>
            <div className="col center">
              <input
                id={size.size.toString()}
                name={size.size.toString()}
                defaultValue={size.qty === 0 ? "" : size.qty}
                type="text"
                className="input"
                onChange={handleChange}
              />
            </div>
          </div>
        ))}
        <div className="row mt-sm">
          <div className="col end">
            <button
              className="btn"
              onClick={() => {
                if (data) onDone(data);
                setShow(false);
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizePopOver;
