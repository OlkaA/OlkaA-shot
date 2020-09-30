import styles from "../styles/Product.module.css";
import ListSelections from "../components/ListSelections";
import { useState, useRef, useEffect } from "react";

const Product = (props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [drawing, setDrawing] = useState(false);
  const [resize, setResize] = useState({ s: false, direction: "" });
  const [list, setList] = useState([]);

  let shot = useRef(null);
  let productWrapper = useRef(null);
  let seResize = useRef(null);

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

  const onMouseDown = (e) => {
    e.persist();

    if (
      e.nativeEvent.pageX > shot.current?.getBoundingClientRect().x &&
      e.nativeEvent.pageX < shot.current?.getBoundingClientRect().right &&
      e.nativeEvent.pageY > shot.current?.getBoundingClientRect().y &&
      e.nativeEvent.pageY < shot.current?.getBoundingClientRect().bottom
    ) {
      setDrawing(false);
    } else {
      setSize({width: 0, height: 0})  
      setDrawing(true);
      setPosition({
        x:
          e.nativeEvent.clientX -
          productWrapper.current.getBoundingClientRect().x,
        y:
          e.nativeEvent.clientY -
          productWrapper.current.getBoundingClientRect().y,
      });
    }
  };

  const onMouseMove = (e) => {
    e.persist();   

    if (drawing === true) {
      e.preventDefault();
      setResize({ s: false, direction: "" });
      const temporarySize =
        e.nativeEvent.clientX -
        position.x -
        productWrapper.current.getBoundingClientRect().x;

      setSize({ width: temporarySize, height: temporarySize });
    }  
    if (resize.s === true) {
      e.preventDefault();
      let temporarySize;

      if (resize.direction === directionsEnum.SE) {
        temporarySize =
          e.nativeEvent.clientX -
          position.x -
          productWrapper.current.getBoundingClientRect().x;

        setSize({ width: temporarySize, height: temporarySize });
      }
    }
  };

  const onMouseUp = (e) => {
    e.persist();
    e.preventDefault();    

    if (drawing && (size.width > 0 || size.height > 0)) {
      const listItem = {
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
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
        e.nativeEvent.clientX -
        productWrapper.current.getBoundingClientRect().x -
        size.width / 2;
      let y =
        e.nativeEvent.clientY -
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
        {list.length > 0 && (
          <div
            ref={shot}
            className={styles.square}
            style={{
              top: position.y + "px",
              left: position.x + "px",
              width: size.width + "px",
              height: size.height + "px",
              backgroundImage: `url('/${image.url}')`,
              backgroundPosition: `${-position.x - 2}px ${-position.y - 2}px`,
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
              onMouseDown={() => setResize({ s: true, direction: directionsEnum.SE })}
              onMouseUp={onMouseUp}
            ></div>
          </div>
        )}
      </div>
      <ListSelections list={list} image={image} />
    </div>
  );
};

export default Product;
