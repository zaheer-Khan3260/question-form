import React, { useState } from 'react'
import Categorize from '../QuestionPreview/Categorize';
import ClozePreview from '../QuestionPreview/Cloze';
import Comprehension from '../QuestionPreview/Comprehension';


function PreviewForm() {
    const [formTitle, setFormTitle] = useState();
    const [accessKey, setAccessKey] = useState();

    const sampleQuestion = {
      questionTitle: "Fill in the Blanks",
      sentence: "The quick brown fox jumps over the lazy dog",
      selectedWords: ["quick", "lazy"],
      options: ["fast", "sleepy", "brown", "tall"],
      points: 4,
      questionImage: null
    };
    
    React.useEffect(() => {
        function generateAccessKey(length = 12) {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let password = "";
          
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * chars.length);
              password += chars[randomIndex];
            }
          
            setAccessKey(password);
          }

          generateAccessKey()
    })

      return (
        <div className="w-full bg-primary-background h-full">
          
        <div className=' px-4 h-full w-full'>
        <div className="mb-4">
            <div className='rounded-none bg-primary-background border-none h-16 text-xl text-white font-semibold'>
                Form Title
            </div>
        </div>
        <div className=' space-y-4'>
        <Categorize/>
        <ClozePreview />
        <Comprehension/>
        </div>
        </div>
        
        </div>
      );
}

export default PreviewForm;
