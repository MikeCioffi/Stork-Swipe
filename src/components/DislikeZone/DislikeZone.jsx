// LikeZone.js
import { useDrop } from 'react-dnd';
import SlLike from 'some-icon-library'; // Replace 'some-icon-library' with the actual library you're using

const DislikeZone = ({ listKey, newNameIndex, girlList, boyList, handleNameAction }) => {
    const [{ isOver }, ref] = useDrop(() => ({
        accept: 'NAME_CARD',
        drop: () => {
            // Logic for handling drop event
            if (listKey === 'girl') {
                handleNameAction(girlList[newNameIndex.girlIndex]._id, 'like', listKey);
            } else {
                handleNameAction(boyList[newNameIndex.boyIndex]._id, 'like', listKey);
            }
        },
        // The collect function allows you to access the monitor instance to check for the isOver state
        collect: (monitor) => ({
            isOver: !!monitor.isOver(), // Using double-bang to ensure a boolean value
        }),
    }), [listKey, newNameIndex, girlList, boyList, handleNameAction]); // dependencies array to re-create the hook if these props change

    // Adding dynamic styling for when the draggable item is over the drop zone
    const backgroundColor = isOver ? 'bg-green-300' : 'bg-green-100';

    return (
        <div
            ref={ref}
            onClick={() => listKey === 'girl'
                ? handleNameAction(girlList[newNameIndex.girlIndex]._id, 'like', listKey)
                : handleNameAction(boyList[newNameIndex.boyIndex]._id, 'like', listKey)}
            className={`w-1/4 h-full transition-all md:1/12 items-center justify-center hover:bg-green-300 text-green-500 rounded-lg flex flex-col cursor-pointer ${backgroundColor}`}
        >
            <SlLike className='text-5xl' />
        </div>
    );
};

export default DislikeZone;
