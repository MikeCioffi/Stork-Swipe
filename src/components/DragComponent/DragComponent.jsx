// YourDragComponent.js
import { useDrag } from 'react-dnd';

const DragComponent = ({ listKey, newNameIndex, girlList, boyList }) => {
    console.log(girlList)
    console.log(newNameIndex)
    console.log(boyList[0].name)

    const [, ref] = useDrag({
        type: 'NAME_CARD', // Matching the accept type in useDrop of LikeZone
    });

    return (
        newNameIndex && girlList && boyList &&
            girlList.length > newNameIndex.girlIndex && boyList.length > newNameIndex.boyIndex ? (
            listKey === 'girl' ?
                <h3 ref={ref} className='text-6xl md:text-9xl cursor-pointer'>{girlList[newNameIndex.girlIndex]?.name}</h3>
                :
                <h3 ref={ref} className='text-6xl md:text-9xl cursor-pointer'>{boyList[newNameIndex.boyIndex]?.name}</h3>
        ) : (
            // Render some placeholder or loader here
            <div>Loading...</div>
        )
    );

}


export default DragComponent;
