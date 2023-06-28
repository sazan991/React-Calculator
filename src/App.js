import React, { useReducer } from "react";
import DigitalButton from "./DigitalButton";
import OperationButton from "./OperationButton";

import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-opeation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentoperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentoperand === "0") {
        return state; // it stops form writing more than 1 zero at the beginning
      }
      if (payload.digit === "." && state.currentoperand && state.currentoperand.includes(".") ) {
        return state; // it stops form writing more than 1 period  during the calculation
      }
      if (payload.digit === "." && state.currentoperand == "") {
        return {
          ...state,
          currentoperand: "0."
        }
      }
      return {
        ...state,
        currentoperand: `${state.currentoperand || ""}${payload.digit}`,
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentoperand: null,
        };
      }
      if (state.currentoperand == null) return state;
      if (state.currentoperand.length === 1) {
        return {
          ...state,
          currentoperand: null,
        };
      }
      return {
        ...state,
        currentoperand: state.currentoperand.slice(0, -1),
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentoperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentoperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentoperand,
          currentoperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentoperand: null,
      };
//switch case
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentoperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentoperand: evaluate(state),
      };
  }
}

function evaluate({ currentoperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentoperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      computation = prev / current;
      break;
  }
  return computation.toString();
}

const INTERGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTERGER_FORMATTER.format(integer);
  return `${INTERGER_FORMATTER.format(integer)}.${decimal}`;
}

const App = () => {
  const [{ currentoperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousOperand)} {operation}{" "}
          </div>
          <div className="current-operand">
            {formatOperand(currentoperand)}{" "}
          </div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
          DEL
        </button>
        <OperationButton operation="/" dispatch={dispatch} />
        <DigitalButton digit="1" dispatch={dispatch} />
        <DigitalButton digit="2" dispatch={dispatch} />
        <DigitalButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitalButton digit="4" dispatch={dispatch} />
        <DigitalButton digit="5" dispatch={dispatch} />
        <DigitalButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitalButton digit="7" dispatch={dispatch} />
        <DigitalButton digit="8" dispatch={dispatch} />
        <DigitalButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitalButton digit="." dispatch={dispatch} />
        <DigitalButton digit="0" dispatch={dispatch} />
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </>
  );
};

export default App;
