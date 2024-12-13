import React, { useState, useRef, useEffect } from "react";
import Input from "../helper/Input";
import { Trash2, GripVertical, Image, CirclePlus, Save, Pencil } from "lucide-react";
import CategoryContainer from "../helper/CategoryContainer";
import api from "../../api/api.js";

function Comprehension({formAccessKey, onFormSubmit}) {
  // State variables
  const [isFocused, setIsFocused] = useState(false);
  const [points, setPoints] = useState("0");
  const [questionImage, setQuestionImage] = useState(null);
  const [passageText, setPassageText] = useState("");
  const [subQuestions, setSubQuestions] = useState([
    { 
      id: 1, // Assigning a unique id to each sub-question
      question: "", 
      options: [
        { id: 1, text: "", questionId: 1 }, // Storing the id of the question instead of option id
        { id: 2, text: "", questionId: 1 },
        { id: 3, text: "", questionId: 1 },
        { id: 4, text: "", questionId: 1 }
      ],
      correctAnswer: null 
    }
  ]);

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

  // Handle points change
  const handlePointsChange = (e) => {
    setPoints(e.target.value);
  };

  // Add a new sub-question
  const addSubQuestion = () => {
    setSubQuestions([
      ...subQuestions, 
      { 
        id: subQuestions.length + 1, // Assigning a unique id to the new sub-question
        question: "", 
        options: [
          { id: 1, text: "", questionId: subQuestions.length + 1 }, // Storing the id of the new question
          { id: 2, text: "", questionId: subQuestions.length + 1 },
          { id: 3, text: "", questionId: subQuestions.length + 1 },
          { id: 4, text: "", questionId: subQuestions.length + 1 }
        ],
        correctAnswer: null 
      }
    ]);
  };

  // Update sub-question text
  const updateSubQuestionText = (subQuestionIndex, text) => {
    const newSubQuestions = [...subQuestions];
    newSubQuestions[subQuestionIndex].question = text;
    setSubQuestions(newSubQuestions);
  };

  // Update option text
  const updateOptionText = (subQuestionIndex, optionIndex, text) => {
    const newSubQuestions = [...subQuestions];
    newSubQuestions[subQuestionIndex].options[optionIndex].text = text;
    setSubQuestions(newSubQuestions);
  };

  // Set correct answer
  const setCorrectAnswer = (subQuestionIndex, optionId) => {
    const newSubQuestions = [...subQuestions];
    newSubQuestions[subQuestionIndex].correctAnswer = optionId;
    setSubQuestions(newSubQuestions);
  };

  // Drag and drop handlers for options
  const handleOptionDragStart = (e, subQuestionIndex, optionIndex) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      subQuestionIndex,
      optionIndex
    }));
  };

  const handleOptionDragOver = (e) => {
    e.preventDefault();
  };

  const handleOptionDrop = (e, targetSubQuestionIndex, targetOptionIndex) => {
    e.preventDefault();
    const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    const newSubQuestions = [...subQuestions];
    const sourceSubQuestion = newSubQuestions[draggedData.subQuestionIndex];
    const targetSubQuestion = newSubQuestions[targetSubQuestionIndex];

    // Swap options
    const tempOption = sourceSubQuestion.options[draggedData.optionIndex];
    sourceSubQuestion.options[draggedData.optionIndex] = 
      targetSubQuestion.options[targetOptionIndex];
    targetSubQuestion.options[targetOptionIndex] = tempOption;

    setSubQuestions(newSubQuestions);
  };

  // Remove a sub-question
  const removeSubQuestion = (indexToRemove) => {
    setSubQuestions(subQuestions.filter((_, index) => index !== indexToRemove));
  };

  // Submit form data
  const handleSubmit = async () => {
    const content = {
      passage: passageText,
      questions: subQuestions,
  };

    try {
      const response = await api.post("/question/", {
        points,
        formAccessKey,
        type: "Comprehension",
        content
      });

      if (response.data) {
        const data = response.data.data
        onFormSubmit(data._id);

      }
    } catch (error) {
      console.error("Error creating question:", error);
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
      {/* Passage Section */}
      <div className="w-full mb-4 flex justify-between">
      <div className="w-2/3">
        <label className="text-primary-color mb-2 block text-lg">
          Passage
        </label>
        <textarea 
          label="Passege"
          value={passageText}
          onChange={(e) => setPassageText(e.target.value)}
          className=" p-2 border rounded-md min-h-24 w-full outline-none"
          placeholder="Enter the comprehension passage"
        >
        </textarea>
        </div>
      <div className="relative">
          <Image className="text-primary-color mt-12 w-10 absolute right-[3.5rem] z-0" />
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
            className="text-primary-color mt-12 w-8 absolute right-[3.5rem] opacity-0 cursor-pointer"
          />
        </div>
        <div>
          <div className="mb-4 text-primary-color text-xl">
            Points
          </div>
          <Input
            type="number"
            value={points}
            onChange={handlePointsChange}
            placeholder="Points"
            ClassName="rounded-md w-[5rem] h-10 opacity-75"
          />
        </div>
      </div>

      {/* Sub Questions */}
      {subQuestions.map((subQuestion, subQuestionIndex) => (
        <div 
          key={subQuestion.id} // Using the unique id for each sub-question
          className="w-[calc(100%-8rem)] mb-4 p-4 border rounded-md relative"
        >
          {/* Sub Question Header */}
          <div className="flex items-center space-x-2 mb-8">
          <GripVertical className="text-primary-color mt-1" />
            <h3 className="text-primary-color">
            Question 3.{subQuestionIndex + 1}
            </h3>
            <div>
            <button 
        onClick={addSubQuestion}
        className="text-primary-color p-1 rounded absolute right-[-2.5rem] duration-300 transition-all"
      >
        <CirclePlus />
      </button>
            {subQuestions.length > 1 && (
              <div 
                onClick={() => removeSubQuestion(subQuestionIndex)}
                className=" text-primary-color p-1 rounded absolute right-[-2.5rem]  top-20 duration-300 transition-all"
              >
                <Trash2/>
              </div>
            )}
             
      </div>
          </div>

          {/* Sub Question Input */}
          <Input 
            type="text"
            value={subQuestion.question}
            onChange={(e) => updateSubQuestionText(subQuestionIndex, e.target.value)}
            placeholder={`Enter sub question ${subQuestionIndex + 1}`}
            ClassName="w-[70%] p-2 border rounded-md mb-2 ml-8"
          />

          {/* Options */}
          <div className="">
            {subQuestion.options.map((option, optionIndex) => (
              <div
                key={option.id}
                draggable
                onDragStart={(e) => handleOptionDragStart(e, subQuestionIndex, optionIndex)}
                onDragOver={handleOptionDragOver}
                onDrop={(e) => handleOptionDrop(e, subQuestionIndex, optionIndex)}
                className="flex items-center space-x-2 p-2 cursor-grab"
              >
                <input 
                  type="radio"
                  name={`correct-option-${subQuestionIndex}`}
                  checked={subQuestion.correctAnswer === option.id}
                  onChange={() => setCorrectAnswer(subQuestionIndex, option.id)}
                  className="mr-2"
                />
                <Input 
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOptionText(subQuestionIndex, optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                  ClassName="flex-grow p-1 border rounded h-8 w-[50%]"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
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

export default Comprehension;