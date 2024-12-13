import React, { useEffect, useState } from 'react';
import { GripVertical } from 'lucide-react';
import api from '../../api/api.js';

function Categorize({ questionData, setResponse }) {
  const [data, setData] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFromCategory, setDraggedFromCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userAnswer, setUserAnswer] = useState({});

  useEffect(() => {
    if (questionData?.content) {
      setData(questionData);

      const initializedCategories = questionData.content.categories.map((category) => ({
        name: category,
        items: category.items || [],
      }));

      setCategories(initializedCategories);
    }
  }, [questionData]);

  const handleDragStart = (item, categoryIndex = null) => {
    setDraggedItem(item);
    setDraggedFromCategory(categoryIndex);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (toCategoryIndex) => {
    if (draggedItem) {
      const updatedCategories = categories.map((category, index) => {
        // Remove item from the original category
        if (index === draggedFromCategory) {
          return {
            ...category,
            items: category.items.filter((item) => item !== draggedItem),
          };
        }
        // Add item to the target category
        if (index === toCategoryIndex) {
          return {
            ...category,
            items: [...category.items, draggedItem],
          };
        }
        return category;
      });

      setCategories(updatedCategories);

      // Update user answer
      const updatedUserAnswer = {
        ...userAnswer,
        [toCategoryIndex]: {
          categoryName: categories[toCategoryIndex].name,
          items: [...(userAnswer[toCategoryIndex]?.items || []), draggedItem]
        }
      };

      // Remove item from source category in user answer if it was in a different category
      if (draggedFromCategory !== null) {
        const sourceCategory = userAnswer[draggedFromCategory];
        if (sourceCategory) {
          updatedUserAnswer[draggedFromCategory] = {
            ...sourceCategory,
            items: sourceCategory.items.filter(item => item !== draggedItem)
          };
        }
      }

      // If the item was dragged from the uncategorized items
      if (draggedFromCategory === null) {
        setData((prevState) => ({
          ...prevState,
          content: {
            ...prevState.content,
            items: prevState.content.items.filter((item) => item !== draggedItem),
          },
        }));
      }

      setUserAnswer(updatedUserAnswer);

      // Reset drag states
      setDraggedItem(null);
      setDraggedFromCategory(null);
    }
  };

  const submitAnswer = async () => {
    try {
      const response = await api.post("/answer/", {
        formAccessKey: questionData.formAccessKey,
        questionId: questionData._id,
        type: "Categorize",
        content: {
          categories: Object.values(userAnswer)
        }
      });

      if (response && response.data) {
        console.log("respones in catagorise", response);
        const data = response.data.message;
        setResponse(data._id);
      }
    } catch (error) {
      console.log("error while saving the answer: ", error);
    }
  };

  return (
    <div
      className={`bg-third-background 
            w-full 
            mx-auto 
            p-4 
            rounded-2xl 
            flex 
            flex-col 
            items-start 
            relative 
            group 
            hover:shadow-md 
            hover:shadow-red-500/30
            transition-shadow 
            duration-300
            cursor-pointer
            text-primary-color
          `}
    >
      {/* Question Header */}
      <div className="w-full flex space-x-1 mb-4 relative pr-10">
        <GripVertical className="mt-1" />
        <div className="text-xl">Question 1: </div>
        <div className="text-xl ml-8">{data?.questionTitle}</div>
      </div>

      {/* Uncategorized Items Section */}
      <div className="text-lg mr-4 mt-8">Items</div>
      <div className="w-full h-32 flex items-center">
        <div className="w-2/3 mx-auto h-full flex items-center space-x-4 justify-center">
          {data?.content?.items.map((item) => (
            <div
              key={item}
              className="px-5 py-2 bg-blue-500 rounded-md text-white cursor-grab"
              draggable="true"
              onDragStart={() => handleDragStart(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="text-lg mr-4">Categories</div>
      <div className="w-full h-full mt-8 flex flex-wrap space-x-4 justify-center">
        {categories?.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            className={`w-36 min-h-[200px] rounded-md p-1 text-white
              ${categoryIndex % 2 === 0 ? 'bg-orange-500' : 'bg-green-500'}`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(categoryIndex)}
          >
            <div className="w-full text-center pt-2 pb-1 border-b mb-2 font-bold">
              {category.name}
            </div>
            {category.items.map((item) => (
              <div
                key={item}
                className="px-3 py-2 bg-blue-500 rounded-md text-white cursor-grab mb-2"
                draggable="true"
                onDragStart={() => handleDragStart(item, categoryIndex)}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button 
        onClick={submitAnswer} 
        className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Submit Answer
      </button>
    </div>
  );
}

export default Categorize;