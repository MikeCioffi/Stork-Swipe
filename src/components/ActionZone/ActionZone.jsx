// ActionZone.js
import { useDrop } from 'react-dnd';
import { SlLike, SlDislike } from 'react-icons/sl'


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
    const hoverColor = actionType === 'like' ? 'bg-green-300' : 'bg-red-300'


    const backgroundColor = isOver ? (hoverColor) : (actionType === 'like' ? 'bg-green-100' : 'bg-red-100');


    const actionColor = actionType === 'like' ? 'text-green-500' : 'text-red-500';
    const Icon = actionType === 'like' ? SlLike : SlDislike;

    return (
        <div
            ref={ref}
            onClick={() => handleNameAction(
                listKey === 'girl' ? girlList[newNameIndex.girlIndex]._id : boyList[newNameIndex.boyIndex]._id,
                actionType,
                listKey
            )}
            className={`w-1/4 h-full transition-all md:1/12 items-center justify-center hover:${hoverColor} ${actionColor} rounded-lg flex flex-col cursor-pointer ${backgroundColor}`}
        >
            <Icon className='text-5xl' />
        </div>
    );
};

export default ActionZone;
