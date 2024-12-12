import React, { useState, useRef, useEffect } from "react";
import Input from "../helper/Input";
import CategoryContainer from "../helper/CategoryContainer";
import { Save, Pencil, Trash2, GripVertical, Image } from "lucide-react";
import api from "../../api/api.js"
import axios from "axios";

function Categorize({ formAccessKey, onFormSubmit }) {
  const [category, setCategory] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [item, setItem] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [itemCategory, setItemCategory] = useState({});
  const [itemImage, setItemImage] = useState(null);
  const [questionTitle, setQuestionTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [points, setPoints] = useState("0"); // Added points state
  const [questionImage, setQuestionImage] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePointsChange = (e) => {
    setPoints(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleDeleteCategory = (index) => {
    setCategory(category.filter((_, i) => i !== index));
  };

  const handleDeleteItem = (index) => {
    setItem(item.filter((_, i) => i !== index));
  };

  const handleBlurCategory = () => {
    if (newCategory.trim() !== "") {
      setCategory([...category, newCategory]);
      setNewCategory("");
    }
  };

  const handleBlurItem = () => {
    if (newItem.trim() !== "") {
      setItem([...item, newItem]);
      setNewItem("");
    }
  };

  const handleItemCategoryChange = (e, item) => {
    setItemCategory((prevState) => ({
      ...prevState,
      [item]: e.target.value,
    }));
  };

  const handleItemChange = (e) => {
    setNewItem(e.target.value);
  };

  const handleCategoryDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };
  
  const handleCategoryDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleCategoryDrop = (e) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const dropTargetIndex = category.findIndex(
      (_, index) => e.target.closest(`[data-index="${index}"]`)
    );
  
    if (draggedIndex !== dropTargetIndex && dropTargetIndex !== -1) {
      const newCategories = [...category];
      const [reorderedItem] = newCategories.splice(draggedIndex, 1);
      newCategories.splice(dropTargetIndex, 0, reorderedItem);
      setCategory(newCategories);
    }
  };
  
  const handleItemDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };
  
  const handleItemDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleItemDrop = (e) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const dropTargetIndex = item.findIndex(
      (_, index) => e.target.closest(`[data-index="${index}"]`)
    );
  
    if (draggedIndex !== dropTargetIndex && dropTargetIndex !== -1) {
      const newItems = [...item];
      const [reorderedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(dropTargetIndex, 0, reorderedItem);
      setItem(newItems);
    }
  };

  const handleSubmit = async () => {
    const content = {
      categories: category,
      items: item,
  };

    try {
      const response = await api.post("/question/", {
        questionTitle,
        points,
        formAccessKey,
        type: "Categorize",
        content
      });

      if (response.data) {
        console.log("Question created:", response.data);
        const data = response.data.data
        onFormSubmit(data._id);
        setCategory([]);
        setItem([]);
      }
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={() => setIsFocused(true)}
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
        ${
          isFocused
            ? "shadow-lg shadow-red-500/50"
            : "hover:shadow-md hover:shadow-red-500/30"
        }
        transition-shadow 
        duration-300
        cursor-pointer
      `}
    >
      <div className="w-full flex space-x-1 mb-4 relative pr-10">
        <GripVertical className="text-primary-color mt-1" />
        <Input
          label={`Question ${1}`}
          type="text"
          value={questionTitle}
          ClassName="w-[50%]"
          onChange={(e) => setQuestionTitle(e.target.value)}
        />
        <div className="relative">
          <Image className="text-primary-color mt-12 w-10 absolute right-[18rem] z-0" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setQuestionImage)}
            className="text-primary-color mt-12 w-8 absolute right-[18rem] opacity-0 cursor-pointer"
          />
        </div>
        <div>
          <div className="mb-4 text-primary-color text-xl ml-8">Points</div>
          <Input
            type="number"
            value={points}
            onChange={handlePointsChange}
            placeholder="Points"
            ClassName="rounded-md w-[5rem] h-10 ml-8 opacity-75"
          />
        </div>
      </div>
      <div className="my-8 mb-4 text-primary-color text-xl ml-8">Category</div>
      <div
        className="w-[2/3] space-y-2"
        onDrop={(e) => handleCategoryDrop(e)}
        onDragOver={(e) => handleCategoryDragOver(e)}
      >
        {category.map((cat, index) => (
          <div
            key={index}
            draggable
            data-index={index}
            onDragStart={(e) => handleCategoryDragStart(e, index)}
          >
            <CategoryContainer
              text={cat}
              onClick={() => handleDeleteCategory(index)}
            />
          </div>
        ))}
        <Input
          ClassName="rounded-md w-[8rem] h-10 ml-8 opacity-75"
          type="text"
          placeholder={`Category ${category.length + 1}`}
          value={newCategory}
          onChange={handleCategoryChange}
          onBlur={handleBlurCategory}
        />
      </div>

      <div className="my-8 mb-4 text-primary-color text-xl flex justify-between w-1/3 ml-8">
        <div>Item</div>
        {item.length > 0 && <div className="mr-8">Belong To</div>}
      </div>

      <div
        className="w-1/3"
        onDrop={(e) => handleItemDrop(e)}
        onDragOver={(e) => handleItemDragOver(e)}
      >
        {item.map((it, index) => (
          <div
            className="flex w-full justify-between mb-2"
            key={index}
            draggable
            data-index={index}
            onDragStart={(e) => handleItemDragStart(e, index)}
          >
            <CategoryContainer
              text={it}
              onClick={() => handleDeleteItem(index)}
            />
            <select
              className="outline-none rounded-md w-24 bg-secondry-background text-gray-300"
              value={itemCategory[it] || ""}
              onChange={(e) => handleItemCategoryChange(e, it)}
            >
              <option value="">Select</option>
              {category.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        ))}
        <Input
          ClassName="rounded-md w-[8rem] h-10 ml-8 mt-2 opacity-75"
          type="text"
          placeholder={`Item ${item.length + 1}`}
          value={newItem}
          onChange={handleItemChange}
          onBlur={handleBlurItem}
        />
      </div>

      <div className="mt-4 space-y-6 absolute right-0 opacity-0 group-hover:right-[-6rem] p-2 group-hover:opacity-100 transition-all duration-300">
        <div
          onClick={handleSubmit}
          className="text-primary-color duration-300 transition-all hover:scale-110 cursor-pointer flex space-x-2"
        >
          <Save className="peer" />
          <p className="text-primary-color opacity-0 peer-hover:opacity-100">save</p>
        </div>
        <div
          onClick={handleSubmit}
          className="text-primary-color duration-300 transition-all hover:scale-110 cursor-pointer flex space-x-2"
        >
          <Pencil className="peer" />
          <p className="text-primary-color opacity-0 peer-hover:opacity-100">edit</p>
        </div>
      </div>
    </div>
  );
}

export default Categorize;



















