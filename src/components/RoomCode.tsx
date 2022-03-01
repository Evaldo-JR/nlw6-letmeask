import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
    code: string | undefined;
};

export const RoomCode = (props: RoomCodeProps) => {
    function copyRoomToClipboard() {
        if (props.code) {
            navigator.clipboard.writeText(props.code);
        }
    }

    return (
        <button className="room-code" onClick={copyRoomToClipboard}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    );
};
