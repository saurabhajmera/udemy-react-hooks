import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from "../UI/LoadingIndicator";

const IngredientForm = React.memo(props => {
  const [titleState, updateTitleState] = useState("");
  const [amountState, updateAmountState] = useState("");
  const submitHandler = event => {
    event.preventDefault();
    props.addIngredientsEventHandler({title:titleState, amount:amountState});
  };

  const updateName = (name)=>(updateTitleState(name));

  const updateAmount = (amount)=>(updateAmountState(amount));

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={titleState} onChange={event=>updateName(event.target.value)}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={amountState} onChange={event => updateAmount(event.target.value)} />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit" onClick={event=>submitHandler(event)}>Add Ingredient</button>
              {props.isLoading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
