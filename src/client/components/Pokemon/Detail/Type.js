import React from 'react';
import { OverlayTrigger , Tooltip }  from  'react-bootstrap';


class Type extends React.Component {
    constructor(props) {
        super(props);

        // binds
    }

    render() {
        const {
            props: { types , size }
            } = this;

        const style = {
            width : size,
            height : size
        }


        return(
            <div>
                {
                    types.map( type =>
                    <OverlayTrigger key={"type_" + type} placement="top" overlay={<Tooltip id="tooltip">{type.toUpperCase()}</Tooltip>}>
                        <img style={style} alt={type}  src={"/assets/" + type + ".png"} />
                    </OverlayTrigger>
                    )
                }
            </div>
        );
    }
}

export default Type;
