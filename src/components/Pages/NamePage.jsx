import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GenderButton from '../Buttons/GenderButton';
import ActionZone from '../ActionZone/ActionZone';
import DragComponent from '../DragComponent/DragComponent';
import Divider from '../Utils/Divider';
import './NamePage.css'; // Import the CSS file for animations

const NamePage = ({
    setListKey, listKey, newNameIndex, girlList, boyList, handleNameAction
}) => {
    const [animationTrigger, setAnimationTrigger] = useState(false);

    const handleNameActionWithAnimation = (nameId, action, gender) => {
        setAnimationTrigger(true);
        setTimeout(() => {
            setAnimationTrigger(false);
        }, 500);
        handleNameAction(nameId, action, gender);
    };

    const backgroundcolor = listKey === 'boy' ? 'bg-white-50' : 'bg-white-50';
    const upperListkey = listKey.toUpperCase();

    return (
        <div className="m-4 w-11/12 md:w-5/6 p-6 flex flex-col justify-around items-center rounded-xl shadow-lg bg-white animate-fade-in">
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

                    <div className="md:w-1/2 xl:w-1/2 xl:h-64 rounded-lg flex justify-center flex-row flex-wrap">
                        <div className={`w-2/3 md:10/12 justify-center items-center flex flex-col ${animationTrigger ? 'animate-bounce' : ''}`}>
                            <h3>{upperListkey}</h3>
                            <DragComponent
                                listKey={listKey}
                                newNameIndex={newNameIndex}
                                girlList={girlList}
                                boyList={boyList}
                            />
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
