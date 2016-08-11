import React from 'react';
import { Row , Col } from 'react-bootstrap'
import Type from './Type'
import { isMobile } from './../../../utils'
export class Skill extends React.Component {
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

		const isFastMove = skill.class === "fast";
		const attackTime  = isFastMove ? skill.cooldown : skill.duration;


		const STAB = skill.stab;
		var damage = skill.damage * (STAB ? 1.25 : 1.0);
		var energy = 0;
		if (skill.class === "fast")
		{
			energy = (skill.energy / attackTime).toFixed(1)
		}else
		{
			energy = '-' + (100 / skill.energy).toFixed(0);
		}
		return(
			isMobile() ?
				<Row style={style}>
					<Col md={4} xs={4}><span className='summary-skill-text'>{skill.name.toUpperCase() + (STAB ? "*" : "")}</span></Col>
					<Col md={2} xs={2}><Type size={25} types={[skill.type]} /></Col>
					<Col md={2} xs={2}><span className='summary-skill-text'>{skill.dps.toFixed(1)}</span></Col>
					<Col md={2} xs={2}><span className='summary-skill-text'>{energy}</span></Col>
				</Row>
				:
				<Row style={style}>
					<Col md={3}><span className='summary-skill-text'>{skill.name.toUpperCase() + (STAB ? "*" : "")}</span></Col>
					<Col md={1}><Type size={25} types={[skill.type]} /></Col>
					<Col md={1}><span className='summary-skill-text'>{skill.dps.toFixed(1)}</span></Col>
					<Col md={1}><span className='summary-skill-text'>{damage.toFixed(1)}</span></Col>
					<Col md={1}><span className='summary-skill-text'>{attackTime.toFixed(1) + "s"}</span></Col>
					<Col md={1}><span className={'summary-skill-text ' + (!isFastMove?'skill-en-consume' : '')}>{energy}</span></Col>
					<Col md={1}><span className={'summary-skill-text ' + (isFastMove?'skill-en-charge' : '')}>{isFastMove? '+' + skill.energy : skill.critical*100 + '%'}</span></Col>
				</Row>
		);			
	}
}


export class SkillTitle extends React.Component {
	render() {
		const { type } = this.props;
		const simpifiedView = isMobile();
		const isFastMove = type === "fast";
		const style = {
			marginTop : 10,
			maringBottom : 10
		}
		// Implement Different columns for Mobile and Web browser
		return (
			isMobile() ?
			<Row style={style}>
				<Col xs={4}><span
					className='summary-skill-title'>{isFastMove? "FAST" : "SPECIAL"}</span></Col>
				<Col xs={2}><span className='summary-skill-title'>TYPE</span></Col>
				<Col xs={2}><span className='summary-skill-title'>DPS</span></Col>
				<Col xs={2}><span className='summary-skill-title'>{isFastMove? "HPS" : "EN"}</span></Col>
			</Row>
				:
			<Row style={style}>
				<Col md={3}><span
					className='summary-skill-title'>{isFastMove? "FAST" : "SPECIAL"}</span></Col>
				<Col md={1}><span className='summary-skill-title'>TYPE</span></Col>
				<Col md={1}><span className='summary-skill-title'>DPS</span></Col>
				<Col md={1}><span className='summary-skill-title'>DMG</span></Col>
				<Col md={1}><span className='summary-skill-title'>{isFastMove? "CD" : "DUR"}</span></Col>
				<Col md={1}><span className='summary-skill-title'>{isFastMove? "HPS" : "EN"}</span></Col>
				<Col md={1}><span className='summary-skill-title'>{isFastMove? "EN" : "CRI"}</span></Col>
			</Row>
		);
	}
}