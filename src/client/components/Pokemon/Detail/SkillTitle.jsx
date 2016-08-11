import React from 'react';
import { Row , Col } from 'react-bootstrap'
import Type from './Type'

class Skill extends React.Component {
	constructor(props) {
		super(props);

		// binds
	}

	render() {
		const { type } = this.props;

		return(
			<Row>
				<Col md={4} xs={4}><span className='summary-skill-title'>{type === "fast" ? "FAST" : "SPECIAL"}</span></Col>
				<Col md={2} xs={2}><span className='summary-skill-title'>TYPE</span></Col>
				<Col md={2} xs={2}><span className='summary-skill-title'>DPS</span></Col>
				<Col md={2} xs={2}><span className='summary-skill-title'>DMG</span></Col>
				<Col md={2} xs={2}><span className='summary-skill-title'>{type === "fast" ? "CD" : "DUR"}</span></Col>
			</Row>
		);			
	}
}

export default Skill;
