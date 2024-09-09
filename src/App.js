import { useReducer } from "react";
import "./index.css";
import { type } from "@testing-library/user-event/dist/type";

/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example that I used
 as an analogy to explain how useReducer works, but it's simplified (we're not using
  account numbers here)

2. Use a reducer to model the following state transitions: openAccount, deposit,
 withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get 
 started.

3. All operations (expect for opening account) can only be performed if isActive 
is true. If it's not, just return the original state object. You can check this
 right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also a minimum 
deposit amount of 500 to open an account (which means that the balance will start 
at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is 
met, the requested amount will be registered in the 'loan' state, and it will be 
added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from 
the balance, and the 'loan' will get back to 0. This can lead to negative balances,
 but that's no problem, because the customer can't close their account now (see next
  point)

7. Customer can only close an account if there is no loan, AND if the balance is 
zero. If this condition is not met, just return the state. If the condition is met,
 the account is deactivated and all money is withdrawn. The account basically gets 
 back to the initial state
*/

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
  isActiveLoan: false,
};

function reducer(state, action) {
  if (!state.isActive && action.type !== "Open") return state;
  switch (action.type) {
    case "Open":
      return {
        ...state,
        isActive: true,
        balance: 500,
      };
    case "Close":
      if (state.balance === 0 && state.loan === 0) {
        return { ...state, isActive: false };
      }
      alert(
        "Can't close account untill you have a loan or the balance is not 0"
      );
      return state;
    case "Deposit":
      return { ...state, balance: state.balance + action.payload };
    case "Withdraw":
      return { ...state, balance: state.balance - action.payload };
    case "RequestLoan":
      if (state.loan <= 0) {
        return {
          ...state,
          loan: action.payload,
          balance: state.balance + action.payload,
        };
      }
      alert("You only can request a loan if you do not have active loans");
      return state; // if there is already a loan, do nothing
    case "PayLoan":
      return {
        ...state,
        loan: state.loan - action.payload,
        balance: state.balance - state.loan,
      };

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [{ balance, loan, isActive }, dispatch] = useReducer(
    reducer,
    initialState
  );
  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button onClick={() => dispatch({ type: "Open" })} disabled={isActive}>
          Open account
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "Deposit", payload: 150 })}
          disabled={!isActive}
        >
          Deposit 150
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "Withdraw", payload: 50 })}
          disabled={!isActive}
        >
          Withdraw 50
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "RequestLoan", payload: 5000 })}
          disabled={!isActive}
        >
          Request a loan of 5000
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "PayLoan", payload: 5000 })}
          disabled={!isActive}
        >
          Pay loan
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "Close" })}
          disabled={!isActive}
        >
          Close account
        </button>
      </p>
    </div>
  );
}
