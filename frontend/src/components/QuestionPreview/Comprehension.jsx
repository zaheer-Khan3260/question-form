import React, { useEffect, useState } from 'react';
import { GripVertical } from 'lucide-react';
import api from '../../api/api.js';

function Comprehension({ questionData, setResponse }) {
    const [data, setData] = useState();
    const [userAnswers, setUserAnswers] = useState({});

    useEffect(() => {
        if(questionData?.content){
            setData(questionData)
        }
    }, [questionData])

    const handleAnswerChange = (id, value) => {
        setUserAnswers(prevState => ({
            ...prevState,
            [id]: {questionId: id, selectedOption: value}
        }));
    };
    const submitAnswers = async() => {
            try {
                const response = await api.post("/answer/", {
                    formAccessKey: questionData?.formAccessKey,
                    questionId: questionData?._id,
                    type: "Comprehension",
                    content: {
                        answers: userAnswers
                    }
                })
        
                if(response && response.data){

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
            <div className="w-full flex space-x-1 mb-4 relative pr-10 ">
                <GripVertical className="mt-1" />
                <div className='text-xl'>Question 3 : </div>
            </div>

            {/* Passage Section */}
            <div className='w-full bg-gray-100 p-4 rounded-md my-4 text-black'>
                {data?.content?.passage}
            </div>

            {/* Questions Section */}
            <div className='w-full space-y-4 mt-4'>
                {data?.content?.questions.map((question, index) => (
                    <div key={index} className='w-full flex flex-col space-y-2'>

                        <div className='text-lg font-semibold'>{`3.${index + 1}`} {question.question}</div>
                        <div className='flex flex-col space-y-1'>
                            {question.options.map((option, optionIndex) => (
                                <label key={optionIndex} className='flex items-center space-x-2 '>
                                    <input
                                        type='radio'
                                        name={`question-${index}`}
                                        value={option.text}
                                        checked={userAnswers[question.id]?.selectedOption === option.text}
                                        onChange={() => handleAnswerChange(question.id, option.text)}
                                        className='form-radio text-blue-500 '
                                    />
                                    <span>{option.text}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <button 
                onClick={submitAnswers} 
                className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
                Submit Answers
            </button>
        </div>
    );
}

export default Comprehension;