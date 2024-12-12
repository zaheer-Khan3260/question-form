import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

function Categorize() {
    const [data, setData] = useState({
        Question: "Put the Item in the correct category",
        type: "Categorize",
        content: {
            categories: ["Fruit", "Vegetable"],
            items: ["Apple", "Carrot", "Banana", "Broccoli"]
        },
        points: 5,
    });

    const [draggedItem, setDraggedItem] = useState(null);
    const [draggedFromCategory, setDraggedFromCategory] = useState(null);
    const [categories, setCategories] = useState(
        data.content.categories.map(category => ({ 
            name: category, 
            items: [] 
        }))
    );

    const handleDragStart = (item, categoryIndex = null) => {
        setDraggedItem(item);
        setDraggedFromCategory(categoryIndex);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (toCategoryIndex) => {
        if (draggedItem) {
            // Update categories and remove from source
            const updatedCategories = categories.map((category, index) => {
                if (index === draggedFromCategory) {
                    return { 
                        ...category, 
                        items: category.items.filter(item => item !== draggedItem) 
                    };
                } else if (index === toCategoryIndex) {
                    return { 
                        ...category, 
                        items: [...category.items, draggedItem] 
                    };
                }
                return category;
            });

            setCategories(updatedCategories);

            // If dragged from the uncategorized items list
            if (draggedFromCategory === null) {
                setData(prevState => ({
                    ...prevState,
                    content: {
                        ...prevState.content,
                        items: prevState.content.items.filter(item => item !== draggedItem)
                    }
                }));
            }

            // Reset drag states
            setDraggedItem(null);
            setDraggedFromCategory(null);
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
            <div className="w-full flex space-x-1 mb-4 relative pr-10 ">
                <GripVertical className="mt-1" />
                <div className='text-xl'>Question 1 : </div>
                <div className='text-xl ml-8'>{data.Question}</div>
            </div>

            {/* Uncategorized Items Section */}
            <div className='w-full h-32 mt-8 flex items-center'>
                <div className='text-lg mr-4'>Items</div>
                <div className='w-2/3 mx-auto h-full flex items-center space-x-4 justify-center'>
                    {data.content.items.map((item) => (
                        <div 
                            key={item} 
                            className='px-5 py-2 bg-blue-500 rounded-md text-white cursor-grab' 
                            draggable="true" 
                            onDragStart={() => handleDragStart(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories Section */}
            <div className='w-full h-full mt-8 flex'>
                <div className='text-lg'>Categories</div>
                <div className='w-2/3 mx-auto h-full flex items-center space-x-4 justify-center'>
                    {categories.map((category, categoryIndex) => (
                        <div 
                            key={categoryIndex} 
                            className={`w-36 min-h-52 rounded-md text-white 
                                ${categoryIndex === 0 ? "bg-orange-500" : "bg-green-500"}
                                p-2`} 
                            onDragOver={handleDragOver} 
                            onDrop={() => handleDrop(categoryIndex)}
                        >
                            <div className='w-full text-center pt-2 pb-1 border-b mb-2'>
                                {category.name}
                            </div>
                            {category.items.map((item) => (
                                <div 
                                    key={item} 
                                    className='px-3 py-2 bg-blue-500 rounded-md text-white cursor-grab mb-2' 
                                    draggable="true" 
                                    onDragStart={() => handleDragStart(item, categoryIndex)}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Categorize;
