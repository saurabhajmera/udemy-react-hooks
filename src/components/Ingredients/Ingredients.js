import React, {useEffect, useState, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";

const Ingredients = () => {

    const [ingredients, updateIngredients] = useState([]);


    useEffect(() => {
        fetch("https://react-hooks-update-5d22d.firebaseio.com/ingredients.json").then(response => response.json()).then(responseData => {
            const ingredientsList = [];
            for(const key in responseData){
                ingredientsList.push({
                    id: key,
                    title: responseData[key].title,
                    amount: responseData[key].amount
                })
            }

            updateIngredients(ingredientsList);


        })
    }, []);

    const addIngredientsHandler = (ingredient) => {
        fetch("https://react-hooks-update-5d22d.firebaseio.com/ingredients.json",{
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            return response.json();
        }).then(responseData => {
            updateIngredients((prevIngredients)=>{
                const newIngredients = [...prevIngredients, {id:responseData.name,...ingredient}];
                return newIngredients;
            })
        });
    };

    const removeIngredientHandler = (ingredientId) => {
        updateIngredients((currentIngredients) => {
            const newIngredients = currentIngredients.filter(item=>{
                return item.id !== ingredientId;
            });

            return newIngredients;
        })
    };

    const filterIngredientsHandler = useCallback((updatedIngredientList) => {
        updateIngredients(updatedIngredientList);

    },[updateIngredients]);

  return (
    <div className="App">
      <IngredientForm addIngredientsEventHandler={addIngredientsHandler}/>

      <section>
        <Search filterIngredientsHandler={filterIngredientsHandler}/>
        <IngredientList ingredients={ingredients} onRemoveItem={(id)=>{removeIngredientHandler(id)}}/>
      </section>
    </div>
  );
}

export default Ingredients;
