import React from 'react';
import { Row , Col } from 'react-bootstrap'
import Type from './Type'

class Skill extends React.Component {
	constructor(props) {
		super(props);

		// binds
	}

	render() {
		const {
			props: { skill , pokemonDef }
		} = this;

		const style = {
			opacity :  skill.learnt ? 1 : 0.3,
			marginTop : 3,
			marginBottom: 3,
		}

		const attackTime  = skill.class === "fast" ? skill.cooldown : skill.duration;

		const STAB = skill.stab;

		var damage = skill.damage * (STAB ? 1.25 : 1.0);

		return(
			<Row style={style}>
				<Col md={4} xs={4}><span className='summary-skill-text'>{skill.name.toUpperCase() + (STAB ? "*" : "")}</span></Col>
				<Col md={2} xs={2}><Type size={25} types={[skill.type]} /></Col>
				<Col md={2} xs={2}><span className='summary-skill-text'>{(damage / attackTime).toFixed(1)}</span></Col>
				<Col md={2} xs={2}><span className='summary-skill-text'>{damage.toFixed(1)}</span></Col>
				<Col md={2} xs={2}><span className='summary-skill-text'>{attackTime.toFixed(1) + "s"}</span></Col>

			</Row>
		);			
	}
}

export default Skill;
