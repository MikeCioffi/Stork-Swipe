// ActionZone.js
import { useDrop } from 'react-dnd';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';


const ActionZone = ({ listKey, newNameIndex, girlList, boyList, handleNameAction, actionType }) => {
    const [{ isOver }, ref] = useDrop(() => ({
        accept: 'NAME_CARD',
        drop: () => {
            handleNameAction(
                listKey === 'girl' ? girlList[newNameIndex.girlIndex]._id : boyList[newNameIndex.boyIndex]._id,
                actionType,
                listKey
            );
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [listKey, newNameIndex, girlList, boyList, handleNameAction, actionType]);
    const hoverColor = actionType === 'dislike' ? 'bg-red-300' : 'bg-green-300'
    const bordecolor = actionType === 'dislike' ? 'border-red-500' : 'border-green-500'
    const backgroundColor = isOver ? (hoverColor) : (actionType === 'like' ? 'bg-green-100' : 'bg-red-100');
    const actionColor = actionType === 'like' ? 'text-green-500' : 'text-red-500';
    const Icon = actionType === 'like' ? FaHeart : FaHeartBroken;

    return (
        <div
            ref={ref}
            onClick={() => handleNameAction(
                listKey === 'girl' ? girlList[newNameIndex.girlIndex]._id : boyList[newNameIndex.boyIndex]._id,
                actionType,
                listKey
            )}
            className={`w-1/4 h-full border-2  ${bordecolor} transition-all md:1/12 items-center justify-center ${actionColor} rounded-xl flex flex-col cursor-pointer hover:${hoverColor} ${isOver ? hoverColor : backgroundColor}`}
        >
            <Icon className=' text-2xl md:text-5xl' />
        </div>
    );
};

export default ActionZone;
