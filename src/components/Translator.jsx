import React, { useRef, useState } from 'react'
import { HiSpeakerWave } from "react-icons/hi2";
import { FaRegCopy } from "react-icons/fa";
import { CgArrowsExchange } from "react-icons/cg";
import languages from '../assets/languages';
import { FaRegTrashAlt } from "react-icons/fa";

const Translator = () => {
    const [fromText, setFromText] = useState('');
    const [toText, setToText] = useState('');
    const [fromLanguage, setFromLanguage] = useState('en-GB');
    const [toLanguage, setToLanguage] = useState('hi-IN');
    const [isLoading, setIsLoading] = useState(false)

    const fromRef = useRef(null)
    const toRef = useRef(null)

    const handleExchange = () => {
        let tempValue = fromText;
        setFromText(toText);
        setToText(tempValue);

        let tempLang = fromLanguage;
        setFromLanguage(toLanguage);
        setToLanguage(tempLang)
    }

    const copyContent = (text) => {
        navigator.clipboard.writeText(text);
    }

    const utterText = (text, language) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = language;
        synth.speak(utterance);
    }

    const handleIconClick = (id) => {
        if (id == 'from-copy') {
            fromRef.current?.select()
            copyContent(fromText)
        } else {
            toRef.current?.select()
            copyContent(toText)
        }
    }

    const handleVolIcon = (id) => {
        if (id == 'from-vol') {
            utterText(fromText, fromLanguage)
        } else {
            utterText(toText, toLanguage)
        }
    }

    const handleTranslate = () => {
        setIsLoading(true);


        let url = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLanguage}|${toLanguage}`;

        fetch(url).then((res) => res.json())
            .then((data) => {
                setToText(data.responseData.translatedText)

                setIsLoading(false);
            })


    }

    const handleClear = () => {
        setFromText('');
        setToText('');
    }

    return (
        <>
            <div className="w-[50%] border absolute left-[25%] top-[10%] p-8  bg-slate-300 rounded-lg 
  shadow-xl shadow-neutral-800 overflow-hidden mx-auto">
                <div className='flex flex-col  border bg-white  rounded-lg'>

                    {/* Text Box */}
                    <div className='w-full flex bg-white  rounded-lg flex-row h-[40vh]'>
                        <textarea ref={fromRef} name="from" id="from" placeholder='Enter Text Here...' value={fromText} onChange={(e) => setFromText(e.target.value)}
                            className='w-1/2  rounded-l-lg border-r-2 bg-white max-h-full h-full p-3 text-black outline-none resize-none'></textarea>
                        <textarea ref={toRef} name="to" id="to" readOnly value={toText}
                            className='w-1/2  border-l-2 bg-white  rounded-r-lg max-h-full h-full p-3 outline-none resize-none'></textarea>
                    </div>
                    <div className='flex flex-row  justify-between bg-white  rounded-b-lg border-t-2 h-14'>

                        {/* first utility box */}
                        <div className='w-[40%] flex flex-row bg-white items-center justify-between '>

                            {/* icons */}
                            <div id='from-vol' onClick={() => handleVolIcon('from-vol')} className='h-full w-[15%] flex 
                            justify-center items-center bg-white text-xl mx-3 text-gray-500 hover:text-gray-700 cursor-pointer'><HiSpeakerWave className='bg-white' /></div>
                            <div id='from-copy' onClick={() => handleIconClick('from-copy')} className='h-full w-[15%] flex 
                            justify-center items-center bg-white text-xl mr-3  text-gray-500 hover:text-gray-700 cursor-pointer' ><FaRegCopy className='bg-white' /></div>

                            {/* Language select */}
                            <select value={fromLanguage} onChange={e => setFromLanguage(e.target.value)}
                                className='w-[70%] h-6 outline-none bg-white border-gray-700 border-l-2 ml-3 pl-3 cursor-pointer'>
                                {
                                    Object.entries(languages).map(([code, name]) => (
                                        <option key={code} value={code} className='bg-white'>{name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div onClick={handleExchange}>
                            <CgArrowsExchange className='h-full text-4xl text-gray-500 bg-white hover:text-gray-700 cursor-pointer' />
                        </div>

                        {/* first utility box */}
                        <div className='w-[40%] flex flex-row bg-white items-center justify-between'>
                            {/* Language select */}
                            <select value={toLanguage} onChange={e => setToLanguage(e.target.value)}
                                className='w-[70%] h-6 border-r-2 bg-white outline-none border-gray-700 mr-3 pr-3 cursor-pointer'>
                                {
                                    Object.entries(languages).map(([code, name]) => (
                                        <option key={code} value={code} className='bg-white'>{name}</option>
                                    ))
                                }
                            </select>

                            {/* icons */}
                            <div id='to-copy' onClick={() => handleIconClick('to-copy')} className='h-full w-[15%] 
                            flex justify-center items-center bg-white text-xl ml-3 text-gray-500 hover:text-gray-700 cursor-pointer'><FaRegCopy className='bg-white' /></div>
                            <div id='to-vol' onClick={() => handleVolIcon('to-vol')} className='h-full w-[15%] 
                            flex justify-center items-center bg-white text-xl mx-3 text-gray-500 hover:text-gray-700 cursor-pointer'><HiSpeakerWave className='bg-white' /></div>
                        </div>
                    </div>
                </div>

                {/* Translate Button */}
                <button onClick={handleTranslate} className='w-full h-12 border rounded-lg  mr-5 my-3 cursor-pointer font-bold bg-indigo-500 hover:bg-indigo-700'>
                    {isLoading ? 'Translating...' : 'Translate'}
                </button>
            </div>

            {/* clear Feild button */}
            <FaRegTrashAlt onClick={handleClear} className='absolute top-[50%] right-[50.5%] text-3xl opacity-20 hover:opacity-80 cursor-pointer bg-transparent z-10' />
        </>
    )
}

export default Translator