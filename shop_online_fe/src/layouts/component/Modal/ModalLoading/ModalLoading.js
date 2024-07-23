import { RotatingLines } from 'react-loader-spinner';

function ModalLoading({ isLoading }) {
    return (
        <div style={{
            position: 'fixed',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            display: isLoading ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999999,

        }}>
            <RotatingLines
                 visible={true}
                 width="50"
                 strokeColor="#FF6600"
                 strokeWidth="5"
                 animationDuration="0.75"
                 ariaLabel="rotating-lines-loading" />
        </div>
    )

}
export default ModalLoading;
