import React from 'react';
import { OverlayTrigger , Tooltip }  from  'react-bootstrap';


export default class TextTooltip extends React.Component {
    render() {

        const { text } = this.props;

        const supStyle = {
            "fontSize" : "smaller"
        };
        return (
            <sup style={supStyle}>
                <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={<Tooltip id="tooltip">{text}</Tooltip>}>
                    <span className="tooltip-text">[?]</span>
                </OverlayTrigger>
            </sup>

        );
    }
}