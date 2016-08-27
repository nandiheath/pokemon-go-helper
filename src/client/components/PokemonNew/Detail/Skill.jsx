import React from 'react';
import { OverlayTrigger , Tooltip , Popover , Table}  from  'react-bootstrap';
import Type from './Type'

export default class Skill extends React.Component {
	constructor(props) {
		super(props);

		// binds
	}

	render() {

		const { skill } = this.props;

		const supStyle = {
			"fontSize" : "smaller"
		};
		return (
			<div>
				<OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={getSkillPopOver(skill)}>
					<span className="tooltip-text"><Type size={20} divStyle={{display:'inline-block' , marginRight:8}} types={[skill.type]} />{skill.name}</span>
				</OverlayTrigger>
			</div>

		);
	}
}

function getSkillPopOver(skill){
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

	return (
		<Popover id="popover-trigger-hover-focus" title={skill.name}>
			<Table>
				<tbody>
					<tr>
						<td>Type</td>
						<td><Type size={15} types={[skill.type]} /></td>
					</tr>
					<tr>
						<td>Damage</td>
						<td>{skill.damage}</td>
					</tr>
					<tr>
						<td>{ isFastMove ? 'Cooldown' : 'Duration' }</td>
						<td>{attackTime}</td>
					</tr>
					<tr>
						<td>DPS</td>
						<td>{skill.dps.toFixed(1)}</td>
					</tr>
					<tr>
						<td>Energy</td>
						<td>{energy}</td>
					</tr>
				</tbody>
			</Table>
		</Popover>
	)
}
