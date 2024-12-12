import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

function Comprehension() {
    const [data, setData] = useState({
        questionTitle: "Answer the following questions based on the passage:",
        passage: "The quick brown fox jumps over the lazy dog. Foxes are small to medium-sized, omnivorous mammals belonging to several genera of the family Canidae.",
        questions: [
            { 
                id: 1, 
                text: "What color is the fox?", 
                options: ["Red", "Brown", "Black", "Gray"], 
                answer: "" 
            },
            { 
                id: 2, 
                text: "What does the fox jump over?", 
                options: ["The cat", "The dog", "The log", "The hill"], 
                answer: "" 
            },
            { 
                id: 3, 
                text: "What family do foxes belong to?", 
                options: ["Felidae", "Canidae", "Hominidae", "Ursidae"], 
                answer: "" 
            }
        ],
        points: 5,
        questionImage: null
    });

    const handleAnswerChange = (questionId, value) => {
        const updatedQuestions = data.questions.map((question) =>
            question.id === questionId ? { ...question, answer: value } : question
        );
        setData((prevData) => ({ ...prevData, questions: updatedQuestions }));
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
            <div className="w-full flex space-x-1 mb-4 relative pr-10 ">
                <GripVertical className="mt-1" />
                <div className='text-xl'>Question 1 : </div>
                <div className='text-xl ml-8'>{data.questionTitle}</div>
            </div>

            {/* Passage Section */}
            <div className='w-full bg-gray-100 p-4 rounded-md my-4 text-black'>
                {data.passage}
            </div>

            {/* Questions Section */}
            <div className='w-full space-y-4 mt-4'>
                {data.questions.map((question) => (
                    <div key={question.id} className='w-full flex flex-col space-y-2'>
                        <div className='text-lg font-semibold'>{question.text}</div>
                        <div className='flex flex-col space-y-1'>
                            {question.options.map((option, index) => (
                                <label key={index} className='flex items-center space-x-2'>
                                    <input
                                        type='radio'
                                        name={`question-${question.id}`}
                                        value={option}
                                        checked={question.answer === option}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                        className='form-radio text-blue-500 '
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Comprehension;