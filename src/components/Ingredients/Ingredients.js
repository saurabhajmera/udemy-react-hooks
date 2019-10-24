import React, {useState} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {

    const [ingredients, updateIngredients] = useState([]);

    const addIngredientsHandler = (ingredient) => {
        updateIngredients((prevIngredients)=>{
            const newIngredients = [...prevIngredients, {id:Math.random().toString(),...ingredient}];
            return newIngredients;
        })
    };

  return (
    <div className="App">
      <IngredientForm addIngredientsEventHandler={addIngredientsHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={()=>{}}/>
      </section>
    </div>
  );
}

export default Ingredients;
