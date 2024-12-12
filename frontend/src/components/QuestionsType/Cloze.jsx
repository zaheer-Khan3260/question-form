import React, { useState, useRef, useEffect } from "react";
import Input from "../helper/Input";
import { Save, Pencil, Trash2, GripVertical, Image } from "lucide-react";
import CategoryContainer from "../helper/CategoryContainer";
import api from "../../api/api.js";

function Cloze({formAccessKey, onFormSubmit}) {
  // State variables
  const [sentence, setSentence] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [points, setPoints] = useState("0");
  const [questionImage, setQuestionImage] = useState(null);
  const [questionTitle, setQuestionTitle] = useState("");


  const containerRef = useRef(null);

  // Outside click handler
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

  const handleSentenceChange = (e) => {
    setSentence(e.target.value);
  };


  const handleAddOption = (word) => {
    setOptions([...options, word]);
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    setSelectedWords(selectedWords.filter(word => !updatedOptions.includes(word)));
  };

  const handleWordSelection = (word) => {
    // Toggle word selection
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleSubmit = async () => {
    const content = {
      sentence: sentence,
      blanks: options,
  };

    try {
      const response = await api.post("/question/", {
        questionTitle,
        points,
        formAccessKey,
        type: "Cloze",
        content
      });

      if (response.data) {
        console.log("Question created:", response.data);
        const data = response.data.data
        onFormSubmit(data._id);
        setSentence("");
        setOptions([]);
      }
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  const renderSentence = () => {
    const words = sentence.split(/\s+/);
    return words.map((word, index) => (
      <span 
        key={index} 
        onClick={() => {
            handleWordSelection(word)
            handleAddOption(word);
        }}
        className={`
          inline-block
          p-1 
          rounded 
          cursor-pointer 
          ${options.includes(word) || selectedWords.includes(word) 
            ? ' text-gray-700' 
            : ' text-white'
          }
        `}
      >
        {options.includes(word) || selectedWords.includes(word) ? '______' : word}
      </span>
    ));
  };

  const handleOptionDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
  };

  const handleOptionDragOver = (e) => {
    e.preventDefault();
  };

  const handleOptionDrop = (e) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const dropTargetIndex = options.findIndex(
      (_, index) => e.target.closest(`[data-index="${index}"]`)
    );

    if (draggedIndex !== dropTargetIndex && dropTargetIndex !== -1) {
      const newCategories = [...options];
      const [reorderedItem] = newCategories.splice(draggedIndex, 1);
      newCategories.splice(dropTargetIndex, 0, reorderedItem);
      setOptions(newCategories);
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
      {/* Question Header */}
      <div className="w-full flex space-x-1 mb-4 relative pr-10">
        <GripVertical className="text-primary-color mt-1" />
        <Input
          label={`Question ${2}`}
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
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setQuestionImage(e.target.result);
                reader.readAsDataURL(file);
              }
            }}
            className="text-primary-color mt-12 w-8 absolute right-[18rem] opacity-0 cursor-pointer"
          />
        </div>
        <div>
          <div className="mb-4 text-primary-color text-xl ml-8">
            Points
          </div>
          <Input
            type="number"
            value={points}
            onChange={handlePointsChange}
            placeholder="Points"
            ClassName="rounded-md w-[5rem] h-10 ml-8 opacity-75"
          />
        </div>
      </div>

      {/* Sentence Input */}
      <div className="w-full my-6 ">
         {/* Sentence with Selectable Words */}
      <div className="w-1/2 mb-8 p-2 border rounded">
        {renderSentence()}
      </div>
        <Input
          label="Enter Sentence (Click on words to create blanks)"
          value={sentence}
          onChange={handleSentenceChange}
          ClassName="w-[50%] p-2 border rounded"
          placeholder="Enter your sentence here..."
        />
      </div>

      {/* Options Input */}
    
      {/* Options List */}
      <div 
        className="w-[2/3] space-y-2" 
        onDrop={handleOptionDrop} 
        onDragOver={handleOptionDragOver}
      >
        {options.map((option, index) => (
          <div 
            key={index} 
            draggable 
            data-index={index}
            onDragStart={(e) => handleOptionDragStart(e, index)}
          >
            <CategoryContainer
              text={option}
              onClick={() => handleDeleteOption(index)}
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-6 absolute right-0 opacity-0 group-hover:right-[-6rem] p-2 group-hover:opacity-100 transition-all duration-300">
        <div
          onClick={handleSubmit}
          className="text-primary-color duration-300 transition-all hover:scale-110 cursor-pointer flex space-x-2"
        >
          <Save className="peer" />
          <p className="text-primary-color opacity-0 peer-hover:opacity-100">
            save
          </p>
        </div>
        <div
          onClick={handleSubmit}
          className="text-primary-color duration-300 transition-all hover:scale-110 cursor-pointer flex space-x-2"
        >
          <Pencil className="peer" />
          <p className="text-primary-color opacity-0 peer-hover:opacity-100">
            edit
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cloze;