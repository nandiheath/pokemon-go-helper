import React from 'react';
import { Row , Col } from 'react-bootstrap'
import Type from './Type'
import { getSkillsByPokemon , getDamage} from './../../../utils'
import TextTooltip from './TextTooltip'

export class SuggestedMove extends React.Component {
    constructor(props) {
        super(props);

        // binds
    }

    render() {
        const {
            props: { type , pokemon}
            } = this;

        const style = {
            marginTop : 3,
            marginBottom: 3,
        }

        var skills = getSkillsByPokemon(pokemon);
        var fastSkill = null;
        var specialSkill = null;

        for (var i in skills.fast_attacks)
        {
            if (skills.fast_attacks[i].learnt)
                fastSkill = skills.fast_attacks[i]
        }

        for (var i in skills.special_attacks)
        {
            if (skills.special_attacks[i].learnt)
                specialSkill = skills.special_attacks[i]
        }


        var rows = [];
        // Fast move
        rows.push({
            name : fastSkill.name.toUpperCase() + (fastSkill.stab?'*':'')+ " ONLY",
            types : [fastSkill.type],
            dps : fastSkill.dps
        })

        var combinedOutput = {
            name : fastSkill.name.toUpperCase() + (fastSkill.stab?'*':'') + " + " + specialSkill.name.toUpperCase() + (specialSkill.stab?'*':'')
        };

        combinedOutput.types = [fastSkill.type];
        if (specialSkill.type !== fastSkill.type)
            combinedOutput.types.push(specialSkill.type);

        // Without getting the LCM , just multiple the energy
        var fastMoveCount = 100 / specialSkill.energy;
        var specialMoveCount = fastSkill.energy;

        //console.log("FAST count:" + fastMoveCount)
        //console.log("Special count:"  + specialMoveCount)
        //console.log("Total energy charged:" + fastSkill.energy * fastMoveCount)
        //console.log("Total energy consumed:" + (100 / specialSkill.energy) * specialMoveCount)
        //console.log("Total damage dued:" + (getDamage(fastSkill) * fastMoveCount + getDamage(specialSkill) * specialMoveCount))
        //console.log("Total time:" + (fastSkill.cooldown * fastMoveCount + specialSkill.duration * specialMoveCount))
        combinedOutput.dps = (getDamage(fastSkill) * fastMoveCount + getDamage(specialSkill) * specialMoveCount) / (fastSkill.cooldown * fastMoveCount + specialSkill.duration * specialMoveCount);

        rows.push(combinedOutput);

        return(
            <div>
                {rows.map(skill =>
                    <Row style={style} key={skill.name}>
                        <Col xs={5}><span className='summary-skill-text'>{skill.name}</span></Col>
                        <Col xs={2}><Type size={25} style={{marginLeft:15}} types={skill.types} /></Col>
                        <Col xs={2}><span className='summary-skill-text'>{skill.dps.toFixed(1)}</span></Col>
                    </Row>
                )}
            </div>
        );
    }
}


export class SuggestedMoveTitle extends React.Component {
    render() {
        const style = {
            marginTop : 10,
            maringBottom : 10
        }
        // Implement Different columns for Mobile and Web browser
        return (
                <Row style={style}>
                    <Col md={5}><span className='summary-skill-title'>Combination<TextTooltip text="List out the dps when using only fast move or combine with special move."/></span></Col>
                    <Col md={2}><span className='summary-skill-title'>TYPE</span></Col>
                    <Col md={2}><span className='summary-skill-title'>DPS<TextTooltip text="Damage per second when using the move combination"/></span></Col>
                </Row>
        );
    }
}