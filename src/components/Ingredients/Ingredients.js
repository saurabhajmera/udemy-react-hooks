import React, {useEffect, useState, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {

    const [ingredients, updateIngredients] = useState([]);
    const [isLoading, updateIsLoading] = useState(false);
    const [error, updateErrorMessage] = useState(null);


    useEffect(() => {
        updateIsLoading(true);
        setTimeout(()=>{
            fetch("https://react-hooks-update-5d22d.firebaseio.com/ingredients.json").then(response => response.json()).then(responseData => {
                updateIsLoading(false);
                const ingredientsList = [];
                for(const key in responseData){
                    ingredientsList.push({
                        id: key,
                        title: responseData[key].title,
                        amount: responseData[key].amount
                    })
                }

                updateIngredients(ingredientsList);


            }).catch(error=>{
                updateErrorMessage("An IO Error occurred");
                updateIsLoading(false);

            })
        },1000);

    }, []);

    const addIngredientsHandler = (ingredient) => {
        updateIsLoading(true);

        fetch("https://react-hooks-update-5d22d.firebaseio.com/ingredients.json",{
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            updateIsLoading(false);
            return response.json();
        }).then(responseData => {
            updateIngredients((prevIngredients)=>{
                const newIngredients = [...prevIngredients, {id:responseData.name,...ingredient}];
                return newIngredients;
            })
        }).catch(error=>{
            updateErrorMessage(error.message);
            updateIsLoading(false);

        });
    };

    const removeIngredientHandler = (ingredientId) => {
        fetch(`https://react-hooks-update-5d22d.firebaseio.com/ingredients/${ingredientId}.json`,{
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            updateIngredients((currentIngredients) => {
                const newIngredients = currentIngredients.filter(item=>{
                    return item.id !== ingredientId;
                });

                return newIngredients;
            })
        });


    };

    const filterIngredientsHandler = useCallback((updatedIngredientList) => {
        updateIngredients(updatedIngredientList);

    },[updateIngredients]);

    const closeErrorModal = () => {
        updateErrorMessage(null);
    };

  return (
    <div className="App">
        {error && <ErrorModal onClose={closeErrorModal}>{error}</ErrorModal>}
      <IngredientForm addIngredientsEventHandler={addIngredientsHandler} isLoading={isLoading}/>

      <section>
        <Search filterIngredientsHandler={filterIngredientsHandler}/>
        <IngredientList ingredients={ingredients} onRemoveItem={(id)=>{removeIngredientHandler(id)}}/>
      </section>
    </div>
  );
};

export default Ingredients;
