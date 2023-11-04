// YourDragComponent.js
import { useDrag } from 'react-dnd';

const DragComponent = ({ listKey, newNameIndex, girlList, boyList }) => {

    const [, ref] = useDrag({
        type: 'NAME_CARD', // Matching the accept type in useDrop of LikeZone
    });

    return (listKey === 'girl' ?
        <h3 ref={ref} className='text-5xl cursor-pointer'>{girlList[newNameIndex.girlIndex].name}</h3>
        :
        <h3 ref={ref} className='text-5xl cursor-pointer'>{boyList[newNameIndex.boyIndex].name}</h3>
    );
};


export default DragComponent;
