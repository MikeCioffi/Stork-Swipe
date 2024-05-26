import React from 'react';
import { useDrag } from 'react-dnd';

const capitalizeWords = (str) => {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

const DragComponent = ({ listKey, newNameIndex, girlList, boyList }) => {

    const [, ref] = useDrag({
        type: 'NAME_CARD',
    });

    return (
        newNameIndex && girlList && boyList &&
            girlList.length > newNameIndex.girlIndex && boyList.length > newNameIndex.boyIndex ? (
            listKey === 'girl' ?
                <h3 ref={ref} className='text-3xl md:text-6xl cursor-pointer'>
                    {capitalizeWords(girlList[newNameIndex.girlIndex]?.name)}
                </h3>
                :
                <h3 ref={ref} className='text-3xl md:text-6xl cursor-pointer'>
                    {capitalizeWords(boyList[newNameIndex.boyIndex]?.name)}
                </h3>
        ) : (
            <div>Loading...</div>
        )
    );

}

export default DragComponent;
