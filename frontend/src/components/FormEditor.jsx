import React, { useState } from 'react'
import Categorize from './QuestionsType/Categorize.jsx';
import Cloze from "./QuestionsType/Cloze.jsx"
import Input from './helper/Input';
import Comprehension from './QuestionsType/Comprehension.jsx';

function FormEditor() {
    const [formTitle, setFormTitle] = useState();
    const [accessKey, setAccessKey] = useState();
    
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
          
        <div className='text-4xl font-bold text-primary-color text-center'>Form Creation</div>
        <div className=' px-4 h-full w-full'>
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
        <Categorize formAccessKey={accessKey}/>
        <Cloze formAccessKey={accessKey}/>
        <Comprehension formAccessKey={accessKey} />
        </div>
        </div>
        
        </div>
      );
}

export default FormEditor
