// YourDragComponent.js
import { useDrag } from 'react-dnd';

const DragComponent = ({ listKey, newNameIndex, girlList, boyList }) => {

    const [, ref] = useDrag({
        type: 'NAME_CARD', // Matching the accept type in useDrop of LikeZone
    });
    console.log(girlList)

    return (
        newNameIndex && girlList && boyList &&
            girlList.length > newNameIndex.girlIndex && boyList.length > newNameIndex.boyIndex ? (
            listKey === 'girl' ?
                <h3 ref={ref} className='text-3xl md:text-6xl cursor-pointer'>{girlList[newNameIndex.girlIndex]?.name}</h3>
                :
                <h3 ref={ref} className='text-3xl md:text-6xl cursor-pointer'>{boyList[newNameIndex.boyIndex]?.name}</h3>
        ) : (
            // Render some placeholder or loader here
            <div>Loading...</div>
        )
    );

}


export default DragComponent;
