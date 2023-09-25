import { useReducer } from "react";
import DigitButton from "./DigitButton";
import "./index.css";
import OperandButton from "./OperandButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, {type, payload})
{
  switch(type)
  {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite==true)
      {
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit==="." && state.currentOperand.includes("."))
        return state
      return {
        ...state, 
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }


    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null)
        return state
        if(state.previousOperand == null)
        {
          return{
            ...state,
          operation: payload.operand,
          previousOperand: state.currentOperand,
          currentOperand: null,
          }
        }
        if(state.currentOperand==null)
        {
          return{
            ...state,
            operation: payload.operand,
          }
        }
        return{
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operand,
          currentOperand: null
        }

    case ACTIONS.CLEAR:
        return {}

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite)
      {
        return{
          ...state,
          currentOperand: null,
          overwrite: false,
        }
      }
      if(state.currentOperand== null)
        return null
      if(state.currentOperand.length==1)
      {
        return{
          ...state,
          currentOperand: null
        }
      }
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
      break

    case ACTIONS.EVALUATE:
      if(state.currentOperand==null ||state.previousOperand==null || state.operation==null)
        return state
      return{
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
  }
}

function evaluate({currentOperand, previousOperand, operation})
{
  const curr= parseFloat(currentOperand)
  const prev= parseFloat(previousOperand)
  if(isNaN(prev) || isNaN(curr))
    return ""
  let computation = ""
  switch(operation)
  {
    case "+":
      computation= prev + curr
      break
    case "-":
      computation= prev - curr
      break
    case "*":
      computation= prev*curr
      break
    case "/":
      computation= prev/curr
      break
  }
  return computation.toString()

}


// //comma separation for 100s, 1000s, millions and billions
// const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
//   maximumFractionDigits: 0,
// })

// //to get rid of the point from the back of a decimal which has a point 0 or multiple 0s
// function formatOperand(op){
//   if(op==null)
//     return
//   const [integer, decimal]= op.split('.')
//   if(decimal==null) 
//     return INTEGER_FORMATTER.format(integer)
// }

function App(){
  const [{currentOperand, previousOperand, operation}, dispatch]= useReducer(
    reducer, {}
  )

  return (
    <div className="calculator-grid">
      <div className="output-screen">
      <div className="output">
        {/* <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div> */}
        <div className="previous-operand">{previousOperand} {operation}</div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=> dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperandButton operand="/" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperandButton operand="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperandButton operand="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperandButton operand="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App
