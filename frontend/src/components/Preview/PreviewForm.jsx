import React, { useState, useEffect } from 'react'
import Categorize from '../QuestionPreview/Categorize';
import ClozePreview from '../QuestionPreview/Cloze';
import Comprehension from '../QuestionPreview/Comprehension';
import api from '../../api/api.js'; // Importing custom axios instance

function PreviewForm() {
  const [formTitle, setFormTitle] = useState("");
  const [categorizeQuestionData, setCategorizeQuestionData] = useState({})
  const [clozeQuestionData, setClozeQuestionData] = useState({})
  const [comprehensionQuestionData, setComprehensoinQuestionData] = useState({})
  const [answerId, setAnswerId] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessKey = window.location.pathname.split('/').pop(); 
        console.log("accesskey : ", accessKey)
        const response = await api.get(`/form/${accessKey}`);
        console.log("response : ", response.data.data.form)
        const data = response.data.data.form

        setFormTitle(data.title);
        data.questions.map(question => { 
          if (question.type === 'Categorize') {
            setCategorizeQuestionData(question);
          } else if (question.type === 'Cloze') {
            setClozeQuestionData(question);
          } else if (question.type === 'Comprehension') {
            setComprehensoinQuestionData(question); 
          }
        });
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAnswerResponse =  (id) => {
        setAnswerId(prevState => [...prevState, id]);
  };

  const handleFormSubmit = async() => {
    const formId = window.location.pathname.split('/')[1];
    console.log("formId : ", formId)

    try {
      const response = await api.patch(`/form/${formId}`, {
        answers: answerId
      })
  if(response && response.data){
        const data = response.data.updatedForm;
        console.log(response);
      }
    } catch (error) {
      console.log("error while saving form", error);
    }
    
  }


  console.log("answers id: ", answerId);
  return (
    <div className="w-full bg-primary-background h-full">
          
      <div className=' px-4 h-full w-full'>
        <div className="mb-4">
          <div className='rounded-none bg-primary-background border-none h-16 text-xl text-white font-semibold'>
            {formTitle} 
          </div>
        </div>
         
          {
            clozeQuestionData && (
              <div className=' space-y-4'>
              <Categorize questionData={categorizeQuestionData} setResponse={handleAnswerResponse} />
              <ClozePreview questionData={clozeQuestionData} setResponse={handleAnswerResponse} />
              <Comprehension questionData={comprehensionQuestionData} setResponse={handleAnswerResponse}/>
              </div>
            )
          }
      </div>
      <div className='mt-8 w-full text-end pr-4'>
      <button className={`px-8 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white`} onClick={handleFormSubmit} >
            Submit
      </button>
      </div>
    </div>
  );
}

export default PreviewForm;
