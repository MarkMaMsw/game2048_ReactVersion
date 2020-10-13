import React, { useState } from 'react';
import './App.css';
import Card from './components/Card'

function App() {
  const [title, settitle] = useState('Hi there!');
  const [cells, setCells] = useState([2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
//   const [cells, setCells] = useState([1024,1024,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
//   const [cells, setCells] = useState([4,1024,8,4,32,64,16,2,8,4,32,8,2,16,8,2]);
  const [map, setMap] = useState({
    0: 'empty',
    2: 'two',
    4: 'four',
    8: 'eight',
    16: 'sixteen',
    32: 'three-two',
    64: 'six-four',
    128: 'one-two-eight',
    256: 'two-five-six',
    512: 'five-one-two',
    1024: 'one-zero-two-four',
    2048: 'two-zero-four-eight',
  });

  const divArr = [];
  for (let i=0; i<cells.length; i++){
    divArr.push(<Card cardStyle={map[cells[i]]} value={cells[i]} key={i.toString()}/>)
  }

  const randomInsert = (cells) => {
    // randomly find empty slot
    let randomIndex = Math.floor(Math.random() * Math.ceil(cells.length));
    while (cells[randomIndex] !== 0){
        randomIndex = Math.floor(Math.random() * Math.ceil(cells.length));
    }
    // randomly generate 2 or 4 and set it into cells
    cells[randomIndex] = 2 * Math.ceil(Math.random() * 2); 
  }
  
  // merge all cells possible to be merged in one row/column
  const mergeCells = (arr) => {
    const newArr = [];
    for (let i=0; i<arr.length; i++){
        if (arr[i] !== 0){
            newArr.push(arr[i]);
        }
    }
    if (newArr.length === 0){
        return arr;
    }
    for (let i=0; i<newArr.length-1; i++){
        if (newArr[i] !== 0 && newArr[i] === newArr[i+1]){
            newArr[i] *= 2; 
            newArr[i+1] = 0;
        }
    }
    const finalArr = [];
    for (let i=0; i<newArr.length; i++){
        if (newArr[i] !== 0){
            finalArr.push(newArr[i]);
        }
    }
    const numOfZero = 4 - finalArr.length;
    for (let j=0; j<numOfZero; j++){
        finalArr.push(0);
    }
    return finalArr;
  }
  
  // 4 direction slide handle
  const slideUp = (allcells) => {
    const cells = [...allcells]
    for (let i=0; i<4; i++){
        let arr = [];
        for (let j=0; j<4; j++){
            arr.push(cells[i+4*j]);
        }
        const mergedArr = mergeCells(arr);
        for (let k=0; k<4; k++){
            cells[i+4*k] = mergedArr[k];
        }
    }
    return cells;
  }
  const slideDown = (allcells) => {
    const cells = [...allcells]
    for (let i=0; i<4; i++){
        let arr = [];
        for (let j=3; j>=0; j--){
            arr.push(cells[i+4*j]);
        }
  
        const mergedArr = mergeCells(arr);
        for (let k=3; k>=0; k--){
            cells[i+4*k] = mergedArr[3-k];
        }
    }
    return cells;
  }
  
  const slideLeft = (allcells) => {
    const cells = [...allcells]
    for (let i=0; i<4; i++){
        let arr = [];
        for (let j=0; j<4; j++){
            arr.push(cells[4*i+j]);
        }
        const mergedArr = mergeCells(arr);
        for (let k=0; k<4; k++){
            cells[4*i+k] = mergedArr[k];
        }
    }
    return cells;
  }
  const slideRight = (allcells) => {
    const cells = [...allcells]
    for (let i=0; i<4; i++){
        let arr = [];
        for (let j=3; j>=0; j--){
            arr.push(cells[4*i+j]);
        }
        const mergedArr = mergeCells(arr);
        for (let k=3; k>=0; k--){
            cells[4*i+k] = mergedArr[3-k];
        }
    }
    return cells;
  }
  
  // check if the board is full
  const boardIsFull = (cells) => {
    let count = 0;
    for (let i=0; i<cells.length; i++){
        if (cells[i] === 0){
            count++;
        }
    }
    if (count === 0){
        return true;
    }
    return false;
  }
  
  // check if reach 2048
  const success = (cells) => {
    for (let i=0; i<cells.length; i++){
        if (cells[i] === 2048){
            return true;
        }
    }
    return false;
  }
  
  // check if the game cannot continue
  const fail = (cells) => {
    const checkUp = (cells.toString() === slideUp(cells).toString());
    const checkDown = (cells.toString() === slideDown(cells).toString());
    const checkLeft = (cells.toString() === slideLeft(cells).toString());
    const checkRight = (cells.toString() === slideRight(cells).toString());
    if (checkUp && checkDown && checkLeft && checkRight){
        return true;
    }
    return false;
  }
  
  const test = (e) => {
    let after_slide = [];
    if(e.key === 'ArrowUp'){
        after_slide = slideUp(cells);
    } else if(e.key === 'ArrowDown'){
        after_slide = slideDown(cells);
    } else if(e.key === 'ArrowLeft'){
        after_slide = slideLeft(cells);
    } else if(e.key === 'ArrowRight'){
        after_slide = slideRight(cells);
    }
    if (after_slide.toString() !== cells.toString()){
      randomInsert(after_slide);
      setCells([...after_slide]);
    } else {
        if (boardIsFull(after_slide)){
            if (fail(after_slide)){
                settitle('Opps, You fail');
            }
        } 
    }
    if (success(after_slide)){
        settitle('Congratulations You Reach 2048');
    }
  }

  document.onkeydown = test;

  return (
    <div className="App">
      <h1 id='state'>{title}</h1>
      <div className="container">
          <div className="board">
              {divArr}
          </div>
      </div>
    </div>
  );
}

export default App;
