import React, { useState } from 'react'
import Categorize from './QuestionsType/Categorize.jsx';
import Cloze from "./QuestionsType/Cloze.jsx"
import Input from './helper/Input';
import Comprehension from './QuestionsType/Comprehension.jsx';
import api from '../api/api.js';

function FormEditor() {
    const [formTitle, setFormTitle] = useState();
    const [accessKey, setAccessKey] = useState();
    const [questionIds, setQuestionIds] = useState([]); // Added state to store question IDs
    const [previewLink, setPreviewLink] = useState();
    const [accessLink, setAccessLink] = useState();
    const [error, setError] = useState(null); // Added state to store error message

    
    React.useEffect(() => {
        function generateAccessKey(length = 32) {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let password = "";
          
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * chars.length);
              password += chars[randomIndex];
            }
          
            setAccessKey(password);
          }

          generateAccessKey()
        }, []);
        
    const handleQuestionResponse = (questionId) => {
        setQuestionIds([...questionIds, questionId]); 
    }

    

    const handleFormSubmit = async() => {
     try {
       if (!formTitle || !accessKey || questionIds.length < 3) {
         setError("All fields are required");
         return;
       }
       const response = await api.post("/form/", {
         title: formTitle,
         accessKey,
         questions: questionIds
       })
       
       if(response && response.data){
         const data = response.data.data;
         setPreviewLink(data.previewLink);
         setAccessLink(data.accessLink);
       }
     } catch (error) {
      console.log("error while creating form: ", error)
     }

    }

      return (
        <div className="w-full bg-primary-background h-full">
          
        <div className='text-4xl font-bold text-primary-color text-center'>Form Creation</div>
        <div className=' px-4 h-full w-full mb-8'>
        <div className="mb-4">
          <Input
            type="text"
            name="formTitle"
            id="formTitle"
            defaultValue="Form Title"
            ClassName="rounded-none bg-primary-background border-none h-16 text-xl text-white font-semibold"
            onChange={(e) => setFormTitle(e.target.value)}
          />
        </div>
        <div className=' space-y-4'>
        <Categorize formAccessKey={accessKey} onFormSubmit={handleQuestionResponse}/>
        <Cloze formAccessKey={accessKey} onFormSubmit={handleQuestionResponse}/>
        <Comprehension formAccessKey={accessKey} onFormSubmit={handleQuestionResponse} />
        </div>
        </div>
        <div className='w-full flex flex-col space-y-3 items-end pr-4'>
          {/* preview container */}
          {/* {
            previewLink && (
              <div className='space-y-3 text-primary-color'>
                <div className='mb-4'>Preview Link</div>
                <a href={`${window.location.origin}/${previewLink}`} target="_blank" rel="noopener noreferrer" className='px-6 py-3 border rounded-md bg-transparent text-white'>
                  {`${window.location.origin}/${previewLink}`}
                </a>
              </div>
            )
          } */}
          {
            accessLink && (
              <div className=' text-primary-color'>
                <div className='mb-4'>Access Link</div>
                <a href={`${window.location.origin}/${accessLink}`} target="_blank" rel="noopener noreferrer" className='px-6 py-3 border rounded-md bg-transparent text-white'>
                  {`${window.location.origin}/${accessLink}`}
                </a>
              </div>
            )
          }
          {error && <div className='text-red-500'>{error}</div>} {/* Display error message if exists */}
          <button className={`px-8 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white ${previewLink ? "hidden" : "block"} `} onClick={handleFormSubmit} >
            Save
          </button>
        </div>
        </div>
      );
}

export default FormEditor
