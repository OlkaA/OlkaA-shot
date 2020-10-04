import styles from "../styles/Product.module.css";
import ListSelections from "../components/ListSelections";
import { useState, useRef, useEffect } from "react";

const Product = (props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [drawing, setDrawing] = useState(false);
  const [resize, setResize] = useState({ s: false, direction: "" });
  const [list, setList] = useState([]);

  const shot = useRef(null);
  const productWrapper = useRef(null);
  const seResize = useRef(null);

  const image = {
    url: props.imageUrl,
    width: productWrapper.current?.getBoundingClientRect().width,
    height: productWrapper.current?.getBoundingClientRect().height,
  };

  const directionsEnum = {
    SE: "se",
    NW: "nw",
    NE: "ne",
    SW: "sw",
  };

  const calculatePositions = () => {
    let top, left;

    if (size.width > 0 && size.height > 0) {
      left = position.x
      top = position.y;      
    }
    if (size.width < 0 && size.height > 0) {
      left = position.x + size.width;
      top = position.y;     
    }
    if (size.width > 0 && size.height < 0) {
      left = position.x
      top = position.y + size.height;     
    }
    if (size.width < 0 && size.height < 0) {
      left = position.x + size.width;
      top = position.y + size.height;
    } 

    return {left, top}
  }

  const onMouseDown = (e) => {
    e.persist();
    if (
      e.pageX > shot.current?.getBoundingClientRect().x &&
      e.pageX < shot.current?.getBoundingClientRect().right &&
      e.pageY > shot.current?.getBoundingClientRect().y &&
      e.pageY < shot.current?.getBoundingClientRect().bottom
    ) {
      setDrawing(false);
    } else {
      setSize({ width: 0, height: 0 });
      setDrawing(true);

      const x = e.clientX - productWrapper.current.getBoundingClientRect().x;
      const y = e.clientY - productWrapper.current.getBoundingClientRect().y;
      
      setPosition({
        x: x,
        y: y,
      });
    }
  };

  const onMouseMove = (e) => {
    e.persist();

    if (drawing === true) {
      e.preventDefault();
      setResize({ s: false, direction: "" });

      const calcWidth =
        e.clientX -
        productWrapper.current.getBoundingClientRect().x -
        position.x;

      const calcHeight =
        e.clientY -
        productWrapper.current.getBoundingClientRect().y -
        position.y;
      
      const finalHeight = calcHeight > 0 ? Math.abs(calcWidth) : - Math.abs(calcWidth);

      setSize({
        width: calcWidth,
        height: finalHeight,
      });
    }
    if (resize.s === true) {
      e.preventDefault();
      e.stopPropagation();
      let temporarySize;

      if (resize.direction === directionsEnum.SE) {
        temporarySize =
          e.clientX -
          position.x -
          productWrapper.current.getBoundingClientRect().x;

        setSize({ width: temporarySize, height: temporarySize });
      }
    }
  };

  const onMouseUp = (e) => {
    e.persist();
    e.preventDefault();

    if (drawing && (Math.abs(size.width) > 50 || Math.abs(size.height) > 50)) {

      const {left, top} = calculatePositions();
      const listItem = {
        top,
        left,
        width: Math.abs(size.width),
        height: Math.abs(size.height)
      };
      setList((list) => [...list, listItem]);
    }
    if (resize.s) {
      const listItem = {
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
      };

      let temporaryArray = [...list];
      temporaryArray.splice(temporaryArray.length - 1, 1, listItem);
      setList(temporaryArray);
    }
    setDrawing(false);
    setResize({ s: false, direction: "" });
  };

  const onDragEnd = (e) => {
    if (!resize.s) {
      let x =
        e.clientX -
        productWrapper.current.getBoundingClientRect().x -
        size.width / 2;
      let y =
        e.clientY -
        productWrapper.current.getBoundingClientRect().y -
        size.height / 2;

      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      if (
        x + size.width >
        productWrapper.current.getBoundingClientRect().width
      ) {
        x = productWrapper.current.getBoundingClientRect().width - size.width;
      }
      if (
        y + size.height >
        productWrapper.current.getBoundingClientRect().height
      ) {
        y = productWrapper.current.getBoundingClientRect().height - size.height;
      }

      setPosition({
        x: x,
        y: y,
      });

      const listItem = {
        top: y,
        left: x,
        width: size.width,
        height: size.height,
      };

      let temporaryArray = [...list];
      temporaryArray.splice(temporaryArray.length - 1, 1, listItem);
      setList(temporaryArray);
    }
  };

  const Shot = () => {
    const {left, top } = calculatePositions();

    return (
      <div
        ref={shot}
        className={styles.square}
        style={{
          left: left + "px", // X COORDINATE
          top: top + "px", // Y COORDINATE
          width: Math.abs(size.width) + "px",
          height: Math.abs(size.height) + "px",
          backgroundImage: `url('/${image.url}')`,
          backgroundPosition: `${-left - 2}px ${-top - 2}px`,
          backgroundSize: `${image.width + 13}px ${image.height}px`,
        }}
        draggable
        onDragEnd={onDragEnd}
      >
        <div
          style={{
            width: size.width * 0.3 + "px",
            height: size.height * 0.3 + "px",
          }}
          ref={seResize}
          className={styles.seResize}
          onMouseMove={onMouseMove}
          onMouseDown={() =>
            setResize({ s: true, direction: directionsEnum.SE })
          }
          onMouseUp={onMouseUp}
        ></div>
      </div>
    );
  };

  return (
    <div className={styles.product}>
      <div
        ref={productWrapper}
        className={styles.productWrapper}
        style={{ backgroundImage: `url('/${image.url}')` }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <div className={styles.background}></div>
        <Shot />
      </div>
      <ListSelections list={list} image={image} />
    </div>
  );
};

export default Product;
