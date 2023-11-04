import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GenderButton from '../Buttons/GenderButton';
import ActionZone from '../ActionZone/ActionZone';
import DragComponent from '../DragComponent/DragComponent';
const NamesPage = ({
    setListKey, listKey, newNameIndex, girlList, boyList, handleNameAction
}) => (
    <div className="flex flex-col w-full justify-around items-center">

        <div className="flex justify-center">
            {/* Pass 'boy' or 'girl' to switch between genders */}
            <GenderButton gender='boy' listKey={listKey} setListKey={setListKey} />
            <GenderButton gender='girl' listKey={listKey} setListKey={setListKey} />
        </div>


        <div className='flex md:w-3/4 w-full mt-5 justify-around items-center'>


            <DndProvider backend={HTML5Backend}>
                <ActionZone
                    actionType="dislike"
                    listKey={listKey}
                    newNameIndex={newNameIndex}
                    girlList={girlList}
                    boyList={boyList}
                    handleNameAction={handleNameAction}
                />

                <div className="md:w-1/2 xl:w-1/2 xl:h-64 rounded-lg flex justify-center flex-row flex-wrap">
                    <div className='w-2/3 md:10/12 justify-center items-center flex flex-col'>
                        <h2 className='-mt-4 text-xs'>{listKey} NAME</h2>
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
                    handleNameAction={handleNameAction}
                />
            </DndProvider>

        </div>

    </div >
);

export default NamesPage;
