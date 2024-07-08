import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GenderButton from '../Buttons/GenderButton';
import ActionZone from '../ActionZone/ActionZone';
import DragComponent from '../DragComponent/DragComponent';
import Divider from '../Utils/Divider';
import './NamePage.css'; // Import the CSS file here

const NamePage = ({
    setListKey, listKey, newNameIndex, girlList, boyList, handleNameAction
}) => {
    const [animationClass, setAnimationClass] = useState('');

    const handleNameActionWithAnimation = (nameId, action, gender) => {
        if (action === 'like') {
            setAnimationClass('animate-like');
        } else {
            setAnimationClass('animate-dislike');
        }

        // Reset animation after it completes
        setTimeout(() => setAnimationClass(''), 1000); // Adjust duration to match CSS animation duration

        handleNameAction(nameId, action, gender);
    };

    const backgroundcolor = listKey === 'boy' ? 'bg-white-50' : 'bg-white-50';
    const upperListkey = listKey.toUpperCase();

    return (
        <div className="w-full p-2 md:p-6 flex flex-col justify-around items-center bg-white">
            <h3 className="text-3xl font-bold">Select Gender</h3>

            <div className="flex justify-center w-full p-5 text-center text-gray-500">
                <GenderButton gender='boy' listKey={listKey} setListKey={setListKey} />
                <GenderButton gender='girl' listKey={listKey} setListKey={setListKey} />
            </div>

            <Divider />

            <div className={`flex w-full mt-10 justify-around items-center ${backgroundcolor}`}>
                <DndProvider backend={HTML5Backend}>
                    <ActionZone
                        actionType="dislike"
                        listKey={listKey}
                        newNameIndex={newNameIndex}
                        girlList={girlList}
                        boyList={boyList}
                        handleNameAction={handleNameActionWithAnimation}
                    />

                    <div className="w-1/2 xl:h-64 rounded-lg flex justify-center flex-row flex-wrap">
                        <div className={`w-full justify-center items-center flex flex-col ${animationClass}`}>
                            <DragComponent
                                listKey={listKey}
                                newNameIndex={newNameIndex}
                                girlList={girlList}
                                boyList={boyList}
                            />
                            <h3 className="mt-4">{upperListkey}</h3>
                        </div>
                    </div>

                    <ActionZone
                        actionType="like"
                        listKey={listKey}
                        newNameIndex={newNameIndex}
                        girlList={girlList}
                        boyList={boyList}
                        handleNameAction={handleNameActionWithAnimation}
                    />
                </DndProvider>
            </div>
        </div>
    );
}

export default NamePage;
