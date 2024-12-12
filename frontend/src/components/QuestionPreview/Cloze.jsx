import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

function Cloze() {
    const [data, setData] = useState({
        questionTitle: "Fill in the Blanks",
        sentence: "The quick brown fox jumps over the lazy dog",
        selectedWords: ["quick", "lazy"],
        points: 4,
        questionImage: null
    });

    const [draggedWord, setDraggedWord] = useState(null);
    const [blankSpaces, setBlankSpaces] = useState(
        data.sentence.split(' ').map((word, index) => {
            const isBlank = data.selectedWords.includes(word);
            return isBlank ? { word: null, originalWord: word, index } : null;
        })
    );

    const [availableWords, setAvailableWords] = useState([...data.selectedWords]);

    const handleDragStart = (word) => {
        setDraggedWord(word);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (blankIndex) => {
        if (draggedWord) {
            const updatedBlankSpaces = blankSpaces.map((blank, index) => {
                if (index === blankIndex) {
                    return { ...blank, word: draggedWord };
                }
                return blank;
            });

            setBlankSpaces(updatedBlankSpaces);
            setAvailableWords(availableWords.filter(word => word !== draggedWord));
            setDraggedWord(null);
        }
    };

    const removeWordFromBlank = (blankIndex) => {
        const updatedBlankSpaces = blankSpaces.map((blank, index) => {
            if (index === blankIndex) {
                setAvailableWords([...availableWords, blank.word]);
                return { ...blank, word: null };
            }
            return blank;
        });
        setBlankSpaces(updatedBlankSpaces);
    };

    const renderSentenceWithBlanks = () => {
        const words = data.sentence.split(' ');
        return words.map((word, index) => {
            const blank = blankSpaces[index];
            if (blank) {
                return (
                    <div
                        key={index}
                        className="inline-block mx-1 min-w-[100px] h-8 border-b-2 border-blue-500 text-center"
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                    >
                        {blank.word ? (
                            <span
                                className="bg-green-500 text-white px-2 py-1 rounded-md cursor-grab"
                                draggable="true"
                                onDragStart={() => handleDragStart(blank.word)}
                                onDoubleClick={() => removeWordFromBlank(index)}
                            >
                                {blank.word}
                            </span>
                        ) : null}
                    </div>
                );
            }
            return <span key={index} className="mx-1">{word}</span>;
        });
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

            {/* Options Section */}
            <div className='w-full h-32 mt-8 flex items-center'>
                <div className='text-lg mr-4'>Options</div>
                <div className='w-2/3 mx-auto h-full flex items-center space-x-4 justify-center'>
                    {availableWords.map((item) => (
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

            {/* Sentence Section */}
            <div className='w-full h-full my-8 flex'>
                <div className='text-lg'>Sentence: </div>
                <div className='w-2/3 mx-auto h-full flex items-center space-x-4 justify-center'>
                    <div className='flex flex-wrap items-center justify-center'>
                        {renderSentenceWithBlanks()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cloze;