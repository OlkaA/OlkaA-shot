import styles from '../styles/ListSelections.module.css';
import { useState, useRef, useEffect } from "react";

const ListSelections = (props) => {
  let shot = useRef(null);    
  return (
    <ul className={styles.listSelections}>
      {props.list.map((selection, index) => {
        
        const i = selection.width / 50;
          const shotStyle = {
            backgroundImage: `url('/${props.image.url}')`,
            backgroundPosition: `-${selection.left / i}px -${selection.top / i}px`,
            backgroundSize: `${props.image.width / i}px auto`
          }

        return (
          <li key={index}>
            <div className={styles.shot} style={shotStyle} ref={shot}></div>
            <div>
                <div className={styles.text}>Shot {index + 1}</div>
                <span className={styles.size}>{`${parseInt(selection.width)} x ${parseInt(selection.width)}`}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ListSelections;
