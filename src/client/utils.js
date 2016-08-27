import pokemons from './pokemons.json'
import skills from './skills.json'
import types from './types.json'
import levels from './levels.json'
import LeftPad from 'left-pad'
import cookie from 'react-cookie'

const LEVELS = [ 0.094     ,  0.16639787,  0.21573247,  0.25572005,  0.29024988,
    0.3210876 ,  0.34921268,  0.37523559,  0.39956728,  0.42250001,
    0.44310755,  0.46279839,  0.48168495,  0.49985844,  0.51739395,
    0.53435433,  0.55079269,  0.56675452,  0.58227891,  0.59740001,
    0.61215729,  0.62656713,  0.64065295,  0.65443563,  0.667934  ,
    0.68116492,  0.69414365,  0.70688421,  0.71939909,  0.7317    ,
    0.73776948,  0.74378943,  0.74976104,  0.75568551,  0.76156384,
    0.76739717,  0.7731865 ,  0.77893275,  0.78463697,  0.79030001];

const DUST = [200 , 400 , 600 ,800 , 1000 , 1300 , 1600 , 1900 , 2200 , 2500 , 3000 ,3500 , 4000 , 4500 , 5000 , 6000
    , 7000 , 8000 , 9000 , 10000];

export function getLevelByCPMultiplier(cpMulitiplier)
{
    for (var i = 0; i < LEVELS.length; i ++)
    {
        if (Math.abs(LEVELS[i] - cpMulitiplier) < 0.01)
            return (i + 1);
    }

    return 1;
}


/**
 * Load content into hash
 * @type {{}}
 */


var pokemonHash = {};
var skillHash = {};
var typeHash = {};

for (var i in pokemons)
{
    pokemonHash[pokemons[i].id] = pokemons[i];
}

for (var i in skills.normal)
{
    skills.normal[i].class = "fast";
    skillHash[skills.normal[i].name.toLowerCase().replace(/\s/ , '')] = skills.normal[i];
}

for (var i in skills.special)
{
    skills.special[i].class = "special";
    skillHash[skills.special[i].name.toLowerCase().replace(/\s/ , '')] = skills.special[i];
}

for (var i in types.types)
{
    typeHash[types.types[i].name] = types.types[i].damage_relations;
}




export function getPokemonDefById(id)
{
    return pokemonHash[id];
}

export function getSkillDefByName(name)
{
    return skillHash[name];
}

function createSkillObject(pokemonDef ,pokemon , skillname)
{

    var object = Object.assign({} , getSkillDefByName(skillname));
    object.learnt = false;

    // Get the STAB
    object.stab = pokemonDef.types.indexOf(object.type) >= 0;

    object.dps = getDPS(object);

    if (formatSkillName(pokemon.move_1_name) === skillname ||
        formatSkillName(pokemon.move_2_name) === skillname)
    {
        object.learnt = true;
    }

    return object;
}

export function formatSkillName(name) {
    // special handling for x-scissor
    return name == null ? '' : name.replace("_FAST", '').toLowerCase().replace('x_scissor' , 'x-scissor').replace(/[\s_]/g, '');
}


export function getSkillsByPokemon(pokemon)
{

    var pokemonDef = getPokemonDefById(pokemon.pokemon_id);
    var skills = {
        fast_attacks : pokemonDef.normal_skills.map( skill => createSkillObject(pokemonDef , pokemon , skill)),
        special_attacks : pokemonDef.special_skills.map(skill => createSkillObject(pokemonDef ,pokemon , skill))
    }

    skills.fast_attacks.sort(sort);
    skills.special_attacks.sort(sort);

    return skills;

}

function sort(a , b){
    return b.dps - a.dps;
}

function getDPS(skill)
{
    var crit = skill.critical || 0;
    return skill.damage * (crit * 1.5 + (1- crit) * 1) *(skill.stab ? 1.25 : 1.0) / (skill.class === "fast" ? skill.cooldown : skill.duration);
}

export function getDamage(skill)
{
    var crit = skill.critical || 0;
    return skill.damage * (crit * 1.5 + (1- crit) * 1) *(skill.stab ? 1.25 : 1.0);
}



export function isMobile()
{
    return getScreenSize().width < 500;
}

function getScreenSize()
{
    return {
        width :  screen.width,
        height : screen.height
    }
}



export function loadStateFromCookie(key , defaultValue)
{
    var state = cookie.load(key);
    if (state === undefined)
    {
        return defaultValue;
    }
    return state;
}

export function saveStateToCookie(key , value)
{
    cookie.save(key , JSON.stringify(value) , { path: '/' });
}

export function getDoubleAttackTo(type)
{
    return typeHash[type].double_damage_to.map(obj => obj.name)
}

export function getDoubleAttackFrom(type)
{
    return typeHash[type].double_damage_from.map(obj => obj.name)
}

export function getHalfAttackTo(type)
{
    return typeHash[type].half_damage_to.map(obj => obj.name).concat(typeHash[type].no_damage_to.map(obj => obj.name))
}

export function getHalfAttackFrom(type)
{
    return typeHash[type].half_damage_from.map(obj => obj.name).concat(typeHash[type].no_damage_from.map(obj => obj.name))
}

export function getDefTypesRelationship(types)
{
    var hash = {};

    for (var i in types)
    {
        getHalfAttackFrom(types[i]).map( type => {
            if (hash[type] === undefined)
            {
                hash[type] = 1;
            }

            hash[type] *= 0.8;
        });

        getDoubleAttackFrom(types[i]).map( type => {

            if (hash[type] === undefined)
            {
                hash[type] = 1;
            }

            hash[type] *= 1.25;
        });
    }

    var returnHash = {}

    for (var type in hash)
    {
        var multiplier = (Math.round(hash[type] * 100 ) / 100).toString();

        // Ignore 1X
        if (multiplier === "1")
            continue;

        if (returnHash[multiplier] === undefined)
            returnHash[multiplier] = [];

        returnHash[multiplier].push(type);
    }

    var returnArray = [];
    for (var i in returnHash)
    {
        if (MultiplierMap[i] === undefined)
        {
            continue;
        }

        returnArray.push({
            multiplier : MultiplierMap[i],
            types : returnHash[i]
        })
    }

    returnArray.sort( (a , b) => {
        return a.multiplier - b.multiplier;
    })
    return returnArray;
}

const MultiplierMap = {
    "0.64" : 0.6,
    "0.8" : 0.8,
    "1.25" : 1.25,
    "1.56" : 1.5
}

export function getUnsignedLong(high , low)
{
    var x = new Number(high);
    x *= Math.pow(2 , 32);
    x += low >>> 0 ;
    return x;
}

export function getPokemonList(){
    var list = [];

    for (var i in pokemonHash)
    {
        list.push({
            value : pokemonHash[i].id,
            label : "#" + LeftPad(pokemonHash[i].id , 3 , 0) + " " +pokemonHash[i].name,
        });
    }

    return list;

}

export function getDustList(){


    return DUST.map(dust => ({
       value : dust,
       label : dust
    }));
}

const APPRAISES = [
    {
        stats : [15],
        message : {
            red : "I'm blown away by its stats. WOW! ",
            blue : "Its stats exceed my calculations. It's incredible!",
            yellow : "Its stats are the best I've ever seen! No doubt about it! "
        }
    },
    {
        stats : [13 , 14],
        message : {
            red : "It's got excellent stats! How exciting! ",
            blue : "I am certainly impressed by its stats, I must say.",
            yellow : "Its stats are really strong! Impressive. "
        }
    },
    {
        stats : [8 , 9 , 10 , 11 , 12],
        message : {
            red : "Its stats indicate that in battle, it'll get the job done. ",
            blue : "Its stats are noticeably trending to the positive.",
            yellow : "It's definitely got some good stats. Definitely!"
        }
    },
    {
        stats : [0 , 1 , 2 , 3 , 4 , 5 , 6, 7],
        message : {
            red : "Its stats don't point to greatness in battle.",
            blue : "Its stats are not out of the norm, in my opinion",
            yellow : "Its stats are all right, but kinda basic, as far as I can see. "
        }
    }
]

export function getAppraiseFromIndex(index , team){
    return APPRAISES[index];
}

export function getAppraiseList(team){
    return APPRAISES.map((app , index) => {
        return ({
            label : app.message[team],
            value : index
        })
    })
}

export function calculateIV(pId , cp , hp , dust)
{
    const pokemon = getPokemonDefById(pId);
    const HP_BASE = parseInt(pokemon.info["Hit Points"]);
    const ATK_BASE = parseInt(pokemon.info["Attack"]);
    const DEF_BASE = parseInt(pokemon.info["Defense"]);

    var levelMin = DUST.indexOf(dust) * 4 + 1
    var levelMax = levelMin + 3;

    var possibleCPM = [];
    var possibleHP = [0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 , 11 , 12 ,13 , 14 , 15];
    var possibleATK = [0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 , 11 , 12 ,13 , 14 , 15];
    var possibleDEF = [0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 , 11 , 12 ,13 , 14 , 15];

    for (var i = levelMin - 1; i <= levelMax - 1; i ++)
    {
        possibleCPM.push(levels[i].cpm);
    }

    var rootNode = {};
    // First using the HP filter out the impossible cp multiplier (a.k.a. LV)
    for (var i in possibleCPM)
    {
        var cpm = possibleCPM[i];
        for (var j in possibleHP)
        {
            if (trunc( (HP_BASE + possibleHP[j]) * cpm ) == hp)
            {
                if (rootNode[cpm] === undefined)
                {
                    rootNode[cpm] = {

                    };
                }

                rootNode[cpm][possibleHP[j]] = {};
            }
        }
    }


    var count =0;
    var results = [];
    for (var cpm in rootNode)
    {
        for (var hp in rootNode[cpm])
        {

            //CP = (Base Atk + Atk IV) * (Base Def + Def IV)^0.5 * (Base Stam + Stam IV)^0.5 * Lvl(CPScalar)^2 / 10
            // SUM = (Base Atk + Atk IV) * (Base Def + Def IV)^0.5
            let sum = cp * 10 / (Math.sqrt((HP_BASE + parseInt(hp))) * Math.pow(parseFloat(cpm) , 2));
            for (var atk = 0; atk < 16; atk ++)
            {
                var calculatedCP = 0;
                for (var def = 15; def >= 0 ; def --)
                {
                    count ++;
                    calculatedCP = trunc((ATK_BASE + atk) * Math.sqrt(DEF_BASE + def) * Math.sqrt(HP_BASE + parseInt(hp)) *
                        Math.pow(parseFloat(cpm) , 2) / 10);
                    //console.log(cp + ":" + calculatedCP);
                    //console.log(calculatedCP === cp);
                    if (calculatedCP === cp)
                    {
                        results.push({
                            cpm : cpm,
                            hp : parseInt(hp),
                            atk : atk,
                            def : def
                        })
                    }else
                    if (calculatedCP < cp)
                    {
                        // Go to next atk as the greatest def is also smaller than required
                        break;
                    }
                }
                if (calculatedCP > cp)
                {
                    //console.log("terminated")
                    break;
                }
            }
        }
    }

    //console.log(results);

    return results;

}

function round(val)
{
    return Math.round(val);
}

function trunc(val)
{
    return val | 0;
}