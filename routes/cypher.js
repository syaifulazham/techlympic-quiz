// Mapping of symbols to letters
const cypher = {
    symbolMapping: {
        'v01': 'A',
        'c01': 'B',
        'c02': 'C',
        'c03': 'D',
        'v02': 'E',
        'c04': 'F',
        'c05': 'G',
        'c06': 'H',
        'v03': 'I',
        'c07': 'J',
        'c08': 'K',
        'c09': 'L',
        'c10': 'M',
        'c11': 'N',
        'v04': 'O',
        'c12': 'P',
        'c13': 'Q',
        'c14': 'R',
        'c15': 'S',
        'c16': 'T',
        'v05': 'U',
        'c17': 'V',
        'c18': 'W',
        'c19': 'X',
        'c20': 'Y',
        'c21': 'Z',
        '000': ' ',
        '0x0': ',',
        '0m0': '!',
        '0q0': '?'
    },
   
    getKeyByValue: (object, value) => {
        return Object.keys(object).find(key => object[key] === value);
    },
    splitIntoThreeChars: (str) => {
        const arr = [];
        for (let i = 0; i < str.length; i += 3) {
            const chunk = str.substr(i, 3);
            arr.push(chunk);
        }
        return arr;
    },
    encodeMessage: (msg) => {
        var oris = msg.split('');
        var ori_encode = '';
        oris.forEach(d => {
            ori_encode += cypher.getKeyByValue(cypher.symbolMapping, d);
        });
        return ori_encode
    },
    decodeMessage: (msg) =>{
        var decoded = '';
        var dc = cypher.splitIntoThreeChars(msg);
        dc.forEach(d => { decoded += cypher.symbolMapping[d] });

        return decoded;
    }

}


module.exports = cypher;