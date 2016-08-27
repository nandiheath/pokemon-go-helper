import React from 'react';
import { Row , Col , Table} from 'react-bootstrap'
import Type from './Type'
import { getSkillsByPokemon , getDamage} from './../../../utils'
import TextTooltip from './TextTooltip'
import Skill from './Skill'


export class SuggestedMove extends React.Component {
    constructor(props) {
        super(props);

        // binds
    }

    render() {
        const {
            props: { pokemon}
            } = this;

        const style = {
            marginTop : 3,
            marginBottom: 3,
        }

        var skills = getSkillsByPokemon(pokemon);
        var fastSkill = null;
        var specialSkill = null;
        var rows = [];
        for (var i in skills.fast_attacks)
        {
            fastSkill = skills.fast_attacks[i]
            // Fast move
            rows.push({
                skills : [fastSkill],
                types : [fastSkill.type],
                dps : fastSkill.dps
            })


            for (var j in skills.special_attacks)
            {
                specialSkill = skills.special_attacks[j];
                var combinedOutput = {
                    skills : [fastSkill ,specialSkill]
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
            }
        }

        rows.sort((a , b) => {
            return b.dps - a.dps;
        })

        return(
            <tbody>
                {rows.map((skill , index) =>
                    <tr key={'skill_' + index}>
                        <td>
                            { skill.skills.map( s => <Skill key={'skill_' + index +'_' + s.name} skill={s}></Skill> ) }
                        </td>
                        <td><span className='summary-skill-text'>{skill.dps.toFixed(1)}</span></td>
                    </tr>
                )}
            </tbody>
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
                <thead>
                    <tr>
                        <th className="col-xs-5"><span className='skill-table-header'>Combination<TextTooltip text="List out the dps when using only fast move or combine with special move."/></span></th>
                        <th className="col-xs-2"><span className='skill-table-header'>DPS<TextTooltip text="Damage per second when using the move combination"/></span></th>
                    </tr>
                </thead>
        );
    }
}